<!-- 在线预览 demo -->
<template>
  <div class="preview-pdf" id="pdfContent"></div>
</template>
<script>
  import Pdfh5 from "pdfh5"
  export default {
    name: 'previewPdf',
    components: {
    },
    props: {
      url: { // 文件地址
        type: String,
        default: null
      }
    },
    data () {
      return {
        pdfh5: null
      }
    },
    computed: {
    },
    watch: {
    },
    created () {
    },
    mounted() {
      // 实例化
      this.pdfh5 = new Pdfh5("#pdfContent", {
        pdfurl: this.url,
        lazy: true
      });
      // 监听完成事件
      /*this.pdfh5.on("complete", function (status, msg, time) {
        console.log("状态：" + status + "，信息：" + msg + "，耗时：" + time + "毫秒，总页数：" + this.totalNum)
      })*/
    },
    methods: {
    }
  }
</script>
<style scoped>
</style>
<style lang="less">
  @import "~pdfh5/css/pdfh5.css";
</style>
