<!-- 在线预览 xls -->
<template>
  <div v-if="fileInfo" class="preview-xls fwrapper">
    <!--<xls :fileInfo="fileInfo"></xls>-->
  </div>
</template>
<script>
  // import xls from './component/Xls.vue'
  export default {
    name: 'previewXls',
    components: {
      // xls
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
</style>

