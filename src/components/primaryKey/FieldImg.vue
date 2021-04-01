<template>
  <div class="fieldImg">
    <!--图片-->
    <group class="gp">
      <cell>
        <span slot="after-title" class="vux-label">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{imgTitle}}
        </span>
        <span slot><label for="uploadUserDefinedImg" class="school-wx-icon" style="color:#f0ad4e;">&#xe614;</label></span>
      </cell>
      <span class="imgLst">
        <span v-for="(imgfile, idx) in srcImgFileLst" :key="idx">
          <x-img :src="imgfile" :default-src="imgfile" style="width: 90px;height: 100px;margin-right: -30px;margin-bottom: 45px;"></x-img>
          <span class="school-wx-icon" style="position: relative;top: -128px;left: -65px;" @click="clearImg(idx)">&#xe627;</span>
        </span>
      </span>
      <input type="file"  multiple="multiple" accept="image/*" value="" id="uploadUserDefinedImg" style="display: none;" @change="flowDocImgFile($event)" ref="imgInput" />
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XImg from 'vux/src/components/x-img/index.vue'
  import lrz from 'lrz'
  export default {
    name: 'primaryKey-fieldImg',
    components: {
      XImg,
      lrz,
      Cell,
      Group
    },
    props: {
      imgLst: Object
    },
    methods: {
      // 删除图片
      clearImg (i) {
        this.srcImgFileLst.splice(i, 1);
        this.srcFURLImgLst.splice(i, 1);
        this.srcFURLImgLst = [];
        for (let i=0; i<this.srcFURLImgLst.length; i++) {
          this.getImg(this.srcFURLImgLst[i], this.srcFURLImgLst.length);
        }
        console.log("this.srcImgFileLst.length is", this.srcImgFileLst.length);
      },
      // 将图片转换成base64位并显示在页面上
      flowDocImgFile (e) {
        let filesLen = this.srcImgFileLst.length + e.target.files.length;
        for (let i=0; i<e.target.files.length; i++) {
          console.log("2222");
          let imgLen = e.target.files.length;
          let file = e.target.files[i];
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
            /*console.log('压缩');*/
            lrz(file, {                  // 压缩图片
              quality: qua
            }).then(function (rst) {
              /* 处理成功后执行 */
              let srcImg = rst.base64;
              that.srcImgFileLst.push(srcImg);
              that.getImg(srcImg, filesLen);
            }).catch( function () {
              /* 处理失败后执行 */
            }).always(function () {
              /* 必然执行 */
            })
          } else {
            /*console.log('不压缩');*/
            let reader = new FileReader();
            reader.onload = function(e){
              let r = this.result;
              that.srcImgFileLst.push(r);
              that.getImg(r, filesLen);
            };
            reader.readAsDataURL(file);
          }
        }
      },
      //以可以上传的形式base64 保存图片
      getImg (srcImg, len) {
        let urlImg = srcImg.split(',')[1];
        this.srcFURLImgLst.push(urlImg);
        if (this.srcFURLImgLst.length === len) {
          this.srcFURLImg = this.srcFURLImgLst.join();
          this.$emit('get-val', {val: this.srcFURLImg, labelpy: this.imgLst.labelpy});
        }
      },
      // 获取type类型的所有值
      getAllVal () {
        this.imgTitle = this.imgLst.label;
        this.isRequired = this.imgLst.Isrequired;
       /* if (sessionStorage.getItem("field-" + this.imgLst.labelpy) !== null) {
          this.srcImgFileLst = sessionStorage.getItem("field-" + this.imgLst.labelpy);
        }*/
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
    },
    data () {
      return {
        imgTitle: '', // 图片的标题
        srcImgFileLst: [], // 图片file
        srcFURLImgLst: [], // 所有图片路径
        srcFURLImg: '', // 所有图片路径string 'rul1,rul2,rul3'
        imgLen: 0, // 图片的长度
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style scoped>
  .imgLst{
    display: block;
    padding: 4px 15px;
  }
</style>
<style>
  /*.fieldImg .gp .weui-cells{
    margin-top: 0;
  }*/
</style>
