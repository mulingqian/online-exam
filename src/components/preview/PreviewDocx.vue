<!-- 在线预览 docx -->
<template>
  <div v-if="fileInfo" class="preview-content fwrapper">
    <!--<docx :fileInfo="fileInfo"></docx>-->
  </div>
</template>
<script>
  // import docx from './component/Docx.vue'
  export default {
    name: 'previewDocx',
    components: {
      // docx
    },
    data () {
      return {
        fileInfo: null // 文件信息
      }
    },
    created () {
      if (this.QD.parentPageData && this.QD.parentPageData.file) {
        this.fileInfo = this.QD.parentPageData.file
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
    position: fixed;
    top: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>

