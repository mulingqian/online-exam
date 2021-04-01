<template>
  <div class="myClassStuQrCode">
    <div class="div-qrCode">
      <span class="qrCodename">
        <span class="school-wx-icon stu-icon" slot="icon" style="color:#f0ad4e;">&#xe612;</span>
        <span style="float: left;">
          <span>{{xm}}</span>
          <span class="xh">{{xh}}</span>
        </span>
      </span>
      <qrcode class="qrCode" :value="xhAndXM"></qrcode>
    </div>
  </div>
</template>
<script>
  import Qrcode from 'vux/src/components/qrcode/index.vue'
  export default {
    name: "myClassStuQrCode",
    components: {
      Qrcode
    },
    methods: {
      getQrCodeString () {
        this.xh = this.$route.query.xh;
        this.xm = this.$route.query.xm;
        /*let out = this.futf16to8(this.xm);
         let stuLst = {xm: out, xh: this.xh};
         this.xhAndXM = JSON.stringify(stuLst);
         console.log('xhAndXM', this.xhAndXM);*/
        let stuLst = {xm: this.xm, xh: this.xh};
        this.xhAndXM = JSON.stringify(stuLst);
        // this.xhAndXM = out + '-' + this.xh;
      },
      // 在二维码编码前把字符串转换成UTF-8
      futf16to8(str) {
        let out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
          c = str.charCodeAt(i);
          if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
          } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          }
        }
        return out;
      }
    },
    created () {
        // 得到生成二维码的字符串
      this.getQrCodeString();
    },
    data () {
      return {
        xm: '', // 姓名
        xh: '', // 学号
        xhAndXM: '' // 学号加姓名 用来生成二维码
      }
    }
  }
</script>
<style scoped>
  .myClassStuQrCode{
    background-color: #2c2a2a;
  }
  .div-qrCode{
    position: relative;
    width: 90%;
    left: 5%;
    top: 40px;
    background-color: #fff;
  }
  .qrCodename{
    display: inline-block;
    padding-left: 12px;
    padding-top: 12px;
    overflow: hidden;
  }
  .stu-icon{
    position: relative;
    float: left;
    font-size: 40px;
    line-height: 45px;
  }
  .qrCode{
    text-align: center;
    padding-top: 15px;
    padding-bottom: 30px;
  }
  .xh{
    display: block;
    font-size: 14px;
    color: #666666;
    padding-top: 4px;
  }
</style>
<style>
  .myClassStuQrCode .qrCode img{
    width: 75%!important;
    height: 75%!important;
  }
</style>
