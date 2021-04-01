<template>
  <div class="upload-img">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <span v-if="srcImg || oldImg" class="changeImgButton">
      <label for="uploadFigurePhoto" class="reviseImg">修改照片</label>
    </span>
    <div v-if="oldImg || srcImg" class="hasImg">
      <x-img v-if="oldImg && !srcImg" :src="QD.StudentPlat + oldImg" :default-src="QD.StudentPlat + oldImg"></x-img>
      <x-img v-if="srcImg" :src="srcImg" :default-src="srcImg"></x-img>
    </div>
    <div v-if="!oldImg && !srcImg" class="img-content">
      <!--<table v-show="srcImg !== null" style="width: 100%;border-spacing: 0;">
        <x-img :src="srcImg" :default-src="srcImg" style="position: relative;display: inline-block;height: 106px;width: 150px;"></x-img>
      </table>-->
      <template v-if="!srcImg && !oldImg">
        <label for="uploadFigurePhoto" style="position: absolute;display: block;height: 100%;width: 100%;"></label>
        <label class="school-wx-icon add-imgIcon">&#xe686;</label>
        <br />
        <a class="word-ts">暂无上传照片，请上传照片</a>
      </template>

    </div>
    <input type="file" accept="image/*" value="" id="uploadFigurePhoto" style="display: none;" @change="photoImgFile($event)"/>
    <x-button-one :titleVal="'上 传'" @click-button="uploadImg"></x-button-one>

  </div>
</template>

<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import XImg from 'vux/src/components/x-img/index.vue'
  import XButtonOne from '../common/XButtonOne.vue'
  import lrz from 'lrz'
  export default {
    name: "uploadImage",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      lrz,
      XImg,
      XButtonOne
    },
    methods: {
        // 上传照片
      uploadImg () {
        if (!this.srcImg) {
          this.QD.alert('', '请先选择照片');
          return;
        }
        let photoData = this.srcImg.split(',')[1]; // base64位
        /* 得到图片的后缀名 png jpg start */
        let head = this.srcImg.split(',')[0];
        let imgtype = head.split(';')[0];
        let imgExtension = imgtype.substr(11, imgtype.length); // 图片后缀名
        /* 得到图片的后缀名 png jpg end */
        let that = this;
        this.QD.confirm('', '确定上传', async function(){
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'UpdateStudentBase64Photo',
            XH: that.userInfo.XH,
            PhotoData: photoData,
            Extension: imgExtension
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            console.log(d.msg);
            return;
          }
          // console.log(d);
          if (d.status === 'success') {
            that.QD.alert('', '上传成功');
          }
        });
      },
        //  // 将图片转换成base64位并显示在页面上
      photoImgFile(e) {
        let file = e.target.files[0];
        // 计算图片大小，默认是B，转换成KB
        let fsize = parseInt((file.size)/1024);
        if (!/image\/\w+/.test(file.type)) {
          alert("请确保文件为图像类型");
          return false;
        }
        let that = this;
        let qua = this.QD.compressSize / fsize;
        qua = Math.round(qua*100)/100;

        if (fsize > 200) {
          /*console.log('压缩');
           console.log(qua);*/
          lrz(file, {                  // 压缩图片
            quality: qua
          }).then(function (rst) {
            /* 处理成功后执行 */
            that.srcImg = rst.base64;
          }).catch( function () {
            /* 处理失败后执行 */
          }).always(function () {
            /* 必然执行 */
          });
        } else {
          // console.log('不压缩');
          let reader = new FileReader();
          reader.onload = function(e){
            that.srcImg = this.result;
            // console.log('不压缩 nobase64', that.srcImg);
          };
          reader.readAsDataURL(file);
        }
      },
      // 学生获取上传的照片信息
      async getStudentPhoto() {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStudentPhoto',
          xh: this.userInfo.XH
        });
        if (d.status && d.status === "error") {
          console.log(d.msg);
          return;
        }
        if (d.status === 'success') {
          this.oldImg = d.stuPhoto;
        }
      },
      // 获取学生用户信息
      getUserInfo() {
        this.userInfo = this.QD.getLocalUserinfo().stuObj;
        this.getStudentPhoto(); // 学生获取上传的照片信息
      }
    },
    created () {
      this.getUserInfo(); // 获取学生用户信息
    },
    data () {
      return {
        loading: false,
        userInfo: [], // 学生用户信息
        oldImg: null, // 之前上传的照片
        srcImg: null // 上传图片处理
      }
    }
  }
</script>
<style scoped>
.upload-img{
  background-color: #f2f2f2;
}
.changeImgButton{
  overflow: hidden;
  width: 100%;
  display: block;
}
.reviseImg{
  display: inline-block;
  float: right;
  padding-right: 15px;
  padding-top: 10px;
  color: #0f89e0;
}
.hasImg{
  position: relative;
  top: 20px;
  margin: 0 15px;
  text-align: center;
}
.img-content{
  position: relative;
  top: 40px;
  margin: 0 15px;
  height: 240px;
  background-color: #fff;
  text-align: center;
}
  .add-imgIcon{
    display: inline-block;
    width: 100%;
    padding-right: 0;
    padding-top: 60px;
    font-size: 60px;
    color: #e5e5e5;
  }
  .word-ts{
    display: inline-block;
    font-size: 16px;
    color: #666666;
    padding: 10px 0;
  }
</style>

