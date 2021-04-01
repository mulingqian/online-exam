 <!-- 在线预览 demo -->
<template>
  <div class="preview-demo fwrapper">

    <!--<uploader
      v-model="fileLst"
      :viewType="2"
      :disabled="true"
      @click-preview-file="previewFile">
    </uploader>-->

    <template v-if="outFileLst.length > 0">
      <uploader
        v-model="outFileLst"
        :viewType="2"
        :disabled="true"
        @click-preview-file="previewFileEvent">
      </uploader>
    </template>

  </div>
</template>
<script>
  import Uploader from '../common/Uploader.vue'
  import { base64 } from 'vux'
  export default {
    name: 'previewDemo',
    components: {
      Uploader
    },
    data () {
      return {
        fileLst: [
          {file: {name: '文件pdf.pdf', size: 35*1024, type: 'pdf', url: 'https://dakaname.oss-cn-hangzhou.aliyuncs.com/file/2018-12-28/1546003237411.pdf'}}
        ],
        outFileLst: []
      }
    },
    created () {
      this.getOutFileData();
    },
    methods: {
      // 点击预览文件事件
      previewFile(val) {
        this.QD.parentPageData = {file: val};
        if (val.type === 'docx') {
          this.$router.push('/previewDocx')
        } else if (val.type === 'pdf') {
          this.$router.push('/previewPdf')
        } else if (val.type === 'xls') {
          this.$router.push('/previewXls')
        }
      },
      // 打开预览
      previewFileEvent(val) {
        if (this.QD.perviewFilePlat && this.QD.imgTypeLst.indexOf('.' + val.type) === -1) {
          let openUrl = this.QD.perviewFilePlat + '/preview?url='+encodeURIComponent(base64.encode(val.url));
          console.log("into openUrl", openUrl);
          window.open(openUrl)
        }
      },
      // 得到外部的文件
      getOutFileData() {
        for (let i=0; i<this.QD.previewFileDemoLst.length; i++) {
          let item = this.QD.previewFileDemoLst[i];
          // 获取最后一个.的位置
          let index= item.url.lastIndexOf(".");
         // 获取后缀
          let ext = item.url.substr(index+1);
          if (this.QD.imgTypeLst.indexOf('.' + ext) !== -1) { // 是图片类型
            ext = 'image'
          }
          // this.outFileLst.push({file: {name: item.name, size: item.size*1024}, url: item.url + '?v=' + this.QD.productVersionNum, type: ext})
          this.outFileLst.push({file: {name: item.name, size: item.size*1024, type: ext, url: item.url + '?v=' + this.QD.productVersionNum}, url: item.url + '?v=' + this.QD.productVersionNum})
        }
      }
    }
  }
</script>
<style scoped lang="less">
</style>

