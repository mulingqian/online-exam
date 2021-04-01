<!-- 在线预览 demo -->
<template>
  <div v-if="fileInfo" class="preview-content">
   <!-- <qpdf :url="fileInfo.url"></qpdf>-->
  </div>
</template>
<script>
  // import Qpdf from './component/Pdf.vue'
  export default {
    name: 'previewPdf',
    components: {
      // Qpdf
    },
    data () {
      return {
        fileInfo: null // 文件信息
      }
    },
    created () {
      console.log("fileInfo", this.fileInfo)
      if (this.QD.parentPageData && this.QD.parentPageData.file) {
        this.fileInfo = this.QD.parentPageData.file;
      } else {
        this.$router.go(-1)
      }
    },
    methods: {
    }
  }
</script>
<style scoped lang="less">
  .preview-content{
    position: absolute;
    top: 0;
    bottom: 0;
  }
</style>

