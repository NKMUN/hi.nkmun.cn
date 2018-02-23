<template>
  <div class="word-count">
    <span class="label">词数：</span><span class="count">{{ count }}</span>
  </div>
</template>

<script>
import wordCount from '@/lib/word-count'
export default {
  computed: {
    count() {
      return this.value ? wordCount(this.value) : '[暂无]'
    }
  },
  props: {
    value: {}
  }
}
</script>
