<template>
  <LayoutMiddle
    v-if="!loaded"
    v-loading.body="loading"
    element-loading-text="正在载入，请稍等……"
  >
    <div v-if="error">
      <el-alert
        title="维护中，请稍后再试。"
        type="warning"
        :description="error ? String(error) : ''"
        :closable="false"
        show-icon
      />
    </div>

    <slot v-if="preconditionFailed">
    </slot>

  </LayoutMiddle>
</template>

<script>
import LayoutMiddle from 'components/LayoutMiddle'
export default {
  name: 'precondition',
  components: { LayoutMiddle },
  props: {
    loader: {
      type: Function,
      default: () => new Promise( r => r(true) )
    }
  },
  data: () => ({
    error: null,
    loading: false,
    loaded: false,
    preconditionFailed: false,
  }),
  mounted() {
    const done = (result) => {
      if (result) {
        this.$emit('loaded', result)
        this.loaded = true
      } else {
        this.preconditionFailed = true
      }
    }

    let loader = this.loader()
    if ( loader instanceof Promise ) {
      // do things asynchronously, active loading animation
      this.loading = true
      loader
        .then( done )
        .catch( err => { this.error = err.message;  this.$emit('error', err) } )
        .then( () => this.loading = false )
    } else {
      // loader is not a promise, do things synchronously
      // in this case, won't active loading animation
      done( loader )
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
