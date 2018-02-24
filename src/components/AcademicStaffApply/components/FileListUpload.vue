<template>
  <el-upload
    ref="upload"
    :action="action"
    :headers="headers"
    show-file-list
    :accept="accept"
    :file-list="uploaded"
    :on-preview="handlePreview"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :before-upload="beforeUpload"
  >
    <slot></slot>
  </el-upload>
</template>

<script>
import { Upload } from 'element-ui'
export default {
  components: {
    [Upload.name]: Upload
  },
  props: {
    action: {
      type: String,
      default: '/api/files/'
    },
    headers: {
      type: Object,
      default: () => {}
    },
    accept: {
      type: String,
      default: '*/*'
    },
    beforeUpload: {
      type: Function
    },
    value: {}
  },
  computed: {
    uploaded() {
      return (this.value || []).map(({name, id}) => ({
        name,
        url: `${this.action}${id}`
      }))
    }
  },
  methods: {
    handleSuccess(resp, file, fileList) {
      return this.handleFileList(fileList)
    },
    handleRemove(file, fileList) {
      return this.handleFileList(fileList)
    },
    handleFileList(fileList) {
      const recoverFileInfo = file => {
        if (file.url.startsWith(this.action)) {
          const startPos = this.action.length
          const queryPos = file.url.indexOf('?')
          const endPos = queryPos === -1 ? undefined : queryPos    // js does not offer C style substr
          return {
            name: file.name,
            id: file.url.slice(startPos, endPos)
          }
        }
      }
      const files = fileList
        .filter(file => file.status === 'success')
        .map(file => {
          if (file.response) return { name: file.response.name, id: file.response.id }
          else return recoverFileInfo(file)
        })
      this.emit(files)
    },
    handlePreview(file) {
      return this.$agent.get(file.url)
      .then(
        ({header}) => window.open(`${file.url}${header.location}`, '_blank'),
        e => this.$message({ type: 'error', message: e.message })
      )
    },
    emit(files) {
      this.$emit('input', files)
      this.$emit('change', files)
    }
  }
}
</script>