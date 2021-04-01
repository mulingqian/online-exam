<!-- 在线预览 demo -->
<template>
  <div>
    <van-loading v-if="loaded" class="q-load" />

    <div class="preview-docx" ref="fileContent"></div>
  </div>
</template>
<script>
  import mammoth from 'mammoth'
  import { Loading } from 'vant'
  export default {
    name: 'previewDocx',
    components: {
      [Loading.name]: Loading
    },
    props: {
      fileInfo: { // 文件信息
        type: Object,
        default: null
      }
    },
    data () {
      return {
        loaded: true
      }
    },
    created () {
      this.previewWord()
    },
    methods: {
      // 在线预览 word .docx 文档
      previewWord() {
        let that = this;
        try {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", this.fileInfo.url);
          xhr.responseType = "arraybuffer";

          xhr.onload = function(e) {
            var arrayBuffer = xhr.response; //arrayBuffer
            mammoth
              .convertToHtml({ arrayBuffer: arrayBuffer })
              .then(displayResult)
              .done();

            function displayResult(result) {
              let htmlVal = result.value; // The generated HTML
              that.loaded = false;
              that.$refs.fileContent.innerHTML = htmlVal
            }
          };
          xhr.send();
        } catch (e) {
          console.log(e);
          this.QD.alert('温馨提示', '预览出错');
        }
      }
    }
  }
</script>
<style scoped>
  .preview-docx{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .q-load{
    position: absolute;
    top: 50%;
    width: 100%;
    text-align: center;
  }
</style>
<style lang="less">
  .preview-docx{
  /deep/ img{
           width: 100%;
         }
  }
  /* safari 浏览器 */
  .preview-docx{
    img{
      width: 100%;
    }
  }
</style>
