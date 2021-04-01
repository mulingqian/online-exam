<template>
  <div class="upload-img-file">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <!-- 多张附件 start -->
      <template v-if="imgFileMulti">
        <cell :title="titleName">
          <span v-if="ableOperate"><label class="school-wx-icon" for="uploadMultiTypeImg" style="color:#f0ad4e;font-size: 24px;">&#xe614;</label></span>
        </cell>
        <div v-for="(item, index) in showImgData" :key="index" style="position: relative;display: inline-block; width: 50%;">
          <x-img :src="item.src" :default-src="item.src" class="previewer-demo-img"></x-img>
          <span v-if="ableOperate" class="school-wx-icon" style="position: absolute; left: 120px; margin-left: 8%; color: #ee8077;" @click="deleteImg(index)">&#xe627;</span>
        </div>
        <input type="file" accept="image/*" value="" id="uploadMultiTypeImg" style="display: none;" @change="changeImgFile($event)" multiple="multiple" />
      </template>
      <!-- 多张附件 end -->
      <!-- 单张附件 start -->
      <template v-if="!imgFileMulti">
        <cell :title="titleName">
          <span v-if="ableOperate"><label class="school-wx-icon" for="uploadSingleTypeImg" style="color:#f0ad4e;">&#xe614;</label></span>
        </cell>
        <div v-for="(item, index) in showImgData" :key="index" style="position: relative;display: inline-block; width: 100%; text-align: center;">
          <x-img :src="item.src" :default-src="item.src" class="previewer-single-img"></x-img>
          <span v-if="ableOperate" class="school-wx-icon" style="position: absolute;color: #ee8077;" @click="deleteImg(index)">&#xe627;</span>
        </div>
        <input type="file" accept="image/*" value="" id="uploadSingleTypeImg" style="display: none;" @change="changeImgFile($event)" />
      </template>
      <!-- 单张附件 end -->
    </group>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import XImg from 'vux/src/components/x-img/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import lrz from 'lrz'
  let Base64 = require('js-base64').Base64;
  export default {
    name: 'commonUploadImgFile',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      XImg,
      lrz
    },
    props: {
      titleName: {
        type: String,
        default: '附件'
      }, // 默认标题为附件
      showImgLst: {
        type: Array,
        default: function() {
          return [];
        }
      }, // 渲染在页面上的图片列表
      imgInfoLst: {
        type: Array,
        default: function() {
          return [];
        }
      }, // 需要上传的图片列表
      imgFileMulti: { // 默认可以选择多张图片
        type: Boolean,
        default: true
      },
      limitImgFileNum: { // 限制上传附件的数量，0 代表不限制， limitImgFileNum > 大于0 代表只能上传附件的数据
        type: Number,
        default: 0
      },
      ableOperate: {
        type: Boolean,
        default: true
      } // 默认可以选择图片和删除图片
    },
    methods: {
      // 删除图片
      deleteImg (idx) {
        this.showImgData.splice(idx, 1);
        this.imgLst.splice(idx, 1);
        this.$emit('get-imgLst', {imgLst: this.imgLst, showImgLst: this.showImgData});
      },
      // 将图片转换成base64位并显示在页面上
      changeImgFile (e) {
        // console.log(e);
        let files = e.target.files;
        if (!this.imgFileMulti) { // 只能上传单张图片
          this.showImgData = [];
          this.imgLst = [];
        }
        // 限制上传附件的数量 start
        if (this.limitImgFileNum > 0 && files.length + this.showImgData.length > this.limitImgFileNum) {
          let newFiles = [];
          for (let k=0; k<files.length; k++) {
            if (k + this.showImgData.length > this.limitImgFileNum-1) {
              files = newFiles; // files 重新赋值
              break;
            }
            newFiles.push(files[k]);
          }
        }
        // 限制上传附件的数量 end
        for (let i=0; i<files.length; i++) {
          let file = files[i];
          if (!/image\/\w+/.test(file.type)) {
            console.log("请确保文件为图像类型");
            return false;
          }
          let name = file.name; // 文件名
          let nameBase64 = Base64.encode(name);

          let type = '.' + name.split('.')[1]; // 后缀名
          let fsize = parseInt((file.size)/1024); // 计算图片大小，默认是B，转换成KB
          let that = this;
          let qua = this.QD.compressSize / fsize;
          if (fsize > this.QD.compressSize) {
            this.loading = true;
            //读取照片
            let reader = new FileReader();
            reader.onload = function(e){
              console.log("reader onload");
              let imgdata = e.target.result;
              //加载图片获取图片真实宽度和高度
              let image = new Image();
              image.onload=function(){
                console.log("image onload");
                //计算应该压缩的比例
                let towidth = image.width * Math.sqrt(qua);
                //按宽度压缩
                lrz(file, {                  // 压缩图片
                  width: towidth
                }).then(function (rst) {
                  let srcImg = rst.base64;
                  let src = {src: srcImg};
                  let imgtype = srcImg.split(';')[0]; // 图片内容格式
                  let imgContentType = imgtype.substr(5, imgtype.length); // 图片后缀名
                  that.showImgData.push(src);
                  that.imgLst.push({FileName: nameBase64, FilePath: '', AttData: srcImg.split(',')[1], FileSize: rst.fileLen.toString(), Extension: type, ContentType: imgContentType});
                }).catch( function () {
                  console.log('按宽度压缩图片 失败');
                }).always(function () {
                  that.$emit('get-imgLst', {imgLst: that.imgLst, showImgLst: that.showImgData});
                  that.loading = false;
                });
              };
              image.src= imgdata;
            };
            reader.readAsDataURL(file);
          } else {
            let reader = new FileReader();
            reader.onload = function(e){
              let srcImg = this.result;
              let src = {src: srcImg};
              let imgtype = srcImg.split(';')[0]; // 图片内容格式
              let imgContentType = imgtype.substr(5, imgtype.length); // 图片后缀名
              // console.log('文件信息', name, type, file.size.toString(), imgContentType);
              that.showImgData.push(src);
              that.imgLst.push({FileName: nameBase64, FilePath: '', AttData: srcImg.split(',')[1], FileSize: file.size.toString(), Extension: type, ContentType: imgContentType});
              that.$emit('get-imgLst', {imgLst: that.imgLst, showImgLst: that.showImgData});
            };
            reader.readAsDataURL(file);
          }
        }
      }
    },
    created () {
      this.showImgData = this.showImgLst;
      this.imgLst = this.imgInfoLst;
    },
    data () {
      return {
        loading: false,
        showImgData: [], // 渲染在页面上的图片
        imgLst: [] // 需要上传的附件图片JSON.stringify字符串数组
      }
    }
  }
</script>
<style scoped>
  .previewer-demo-img{
    width: 120px;
    height: 120px;
    background-color: #f1f1f1;
    margin: 5% 0 5% 8%;
  }
  .previewer-single-img{
    width: 120px;
    height: 120px;
    margin: 2% 0 5% 0;
  }
</style>
