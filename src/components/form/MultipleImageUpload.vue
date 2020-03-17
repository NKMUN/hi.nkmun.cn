<script>
import ElUpload from 'element-ui/lib/upload'
import 'element-ui/lib/theme-chalk/upload.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import ImagePreview from '@/components/ImagePreview.js'

const PREVIEW_IMAGE_SIZE_QUERY = "size=tiny"
const PREVIEW_DIALOG_IMAGE_SIZE_QUERY = "size=large"

export default {
  functional: true,
  render(h, ctx) {
    const API_IMAGE_PREFIX = ctx.data.attrs.action || '/api/images/'

    function handleFileList(fileList) {
      const recoverIdFromUrl = url => {
        if (url.startsWith(API_IMAGE_PREFIX)) {
          const startPos = API_IMAGE_PREFIX.length
          const queryPos = url.indexOf('?')
          const endPos = queryPos === -1 ? undefined : queryPos    // js does not offer C style substr
          return url.slice(startPos, endPos)
        }
      }
      const files = fileList.filter(file => file.status === 'success')
      const list = files.map(file => file.response ? file.response.id : recoverIdFromUrl(file.url))
      ctx.listeners.input && ctx.listeners.input(list)
    }

    function handlePreview(file) {
      if (ctx.listeners.preview || ctx.props.onPreview) {
        ctx.listeners.preview && ctx.listeners.preview(file)
        ctx.props.onPreview && ctx.props.onPreview(file)
      } else {
        ImagePreview(file.url.replace(PREVIEW_IMAGE_SIZE_QUERY, PREVIEW_DIALOG_IMAGE_SIZE_QUERY))
      }
    }

    function recoverUploadedImage(fileList) {
      return fileList.map((id, idx) => ({
        name: String(idx),
        url: `${API_IMAGE_PREFIX}${id}?size=tiny&format=jpg`
      }))
    }

    const disabled = ctx.props.disabled

    return h(
      ElUpload,
      {
        ...ctx.data,
        props: {
          action: API_IMAGE_PREFIX,
          accept: "image/jpeg, image/png, .jpg, .jpeg, .png",
          listType: "picture-card",
          ...ctx.props,
          fileList: recoverUploadedImage(ctx.props.value || []),
          onSuccess: (resp, file, fileList) => handleFileList(fileList),
          onRemove: (file, fileList) => handleFileList(fileList),
          onPreview: (file) => handlePreview(file),
        },
        attrs: {
          disabled
        }
      },
      ctx.children && ctx.children.length ? ctx.children : [<i class="el-icon-plus" />]
    )
  }
}
</script>

<style lang="stylus" scoped>
.el-upload
  min-width: 370px
[disabled] /deep/ div.el-upload--picture-card
  display: none
</style>
