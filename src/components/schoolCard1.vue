<template>
  <!--:class="'根据接口返回值判定加载那种颜色'"-->
  <div class="schoolCard" :class="[bgColor ? 'greenColor': 'redColor']">
    <div class="header">
      <span class="school-wx-icon breakIcon" @click="goBreak">&#xe688;</span>
      <span class="title">电子校园卡</span>
    </div>
    <div class="card" :class="[bgColor ? 'greenCard': 'redCard']">
      <div class="userinfo-left">
        <p class="name">{{ userinfo.stuObj.XM }}</p>
        <p class="user-img">
          <img :src="this.$route.query.profileImg" alt="">
        </p>
      </div>
      <div class="userinfo-right">
        <p>学号：{{ userinfo.stuObj.XH }}</p>
        <p>班级：{{ userinfo.stuObj.BJMC }}</p>
        <p>班主任：{{ userinfo.stuObj.BZR }}</p>
        <p>院系：{{ stuInfo.yxmc }}</p>
        <!--<p>二维码</p>-->
        <img id="barcode" ref="barcode" @click="enlargeQRcode('条形码')"/>
      </div>
    </div>
    <div class="time" :class="[bgColor ? 'greenTime': 'redTime']">{{this.nowDate}}</div>
    <div class="QR-code-box" :class="[bgColor ? 'green-qr-code-box': 'red-qr-code-box']" @click="enlargeQRcode('二维码')">
      <qrcode class="qr-code" :value="qrCodeInfo" v-if="qrCodeInfo"></qrcode>
    </div>

    <!--模态框 start-->
    <div v-transfer-dom>
      <popup v-model="showQrCode" height="100%" is-transparent>
        <div class="code-box">
          <p>请扫描{{popupTitle}}
            <span class="school-wx-icon" @click="showQrCode=false">&#xe627;</span>
          </p>
          <img id="barcode1" ref="barcode" v-if="popupTitle === '条形码'"/>
          <qrcode class="qr-code" :value="qrCodeInfo" v-if="qrCodeInfo && popupTitle !== '条形码'"></qrcode>
        </div>
      </popup>
    </div>
    <!--模态框 end-->
  </div>
</template>
<script>
  import JsBarcode from 'jsbarcode'
  import { mapState, mapActions } from 'vuex'
  import Qrcode from 'vux/src/components/qrcode/index.vue'
  import Popup from "../../node_modules/vux/src/components/popup/index";
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  export default {
    name: 'schoolCard',
    directives: {
      TransferDom
    },
    components: {
      Popup,
      Qrcode
    },
    data (){
      return {
        stuInfo: {}, //生成学生信息
        nowDate: '',
        showQrCode: false,
        popupTitle: '', // 弹出框title
        xh: '', // 学号 用来生成条形码
        bgColor: false, // 背景颜色 false 不通过（红色） true 通过（绿色）
        qrCodeInfo: null // 用于生成二维码的信息
      }
    },
    mounted() {
      this.currentTime();
    },
    methods: {
      goBreak(){
        window.history.go(-1)
      },
      // 放大条码、二维码
      enlargeQRcode (val) {
        this.showQrCode=true;
        this.popupTitle = val;
        if (this.popupTitle === '条形码'){
          this.barcode1(this.xh)
        }
      },
      // 条码
      barcode(txm){
        this.$nextTick(() => {
          var barcode = this.$refs.barcode
          JsBarcode('#barcode', txm, {
            format: 'CODE128A',
            lineColor: '#000',
            background: '#EBEEF5',
            width: 2,
            height: 40,
            displayValue: false
          })
        })
      },
      // 条码
      barcode1(txm){
        this.$nextTick(() => {
          var barcode1 = this.$refs.barcode1
          JsBarcode('#barcode1', txm, {
            format: 'CODE128A',
            lineColor: '#000',
            background: '#fff',
            width: 2,
            height: 80,
            displayValue: true,
            textMargin: 5, //设置条形码和文本之间的间距
            margin: 15//设置条形码周围的空白边距
          })
        })
      },
      // 实时刷新时间
      currentTime() {
        setInterval(this.getCurrDate, 1000);
      },
      // 获取当前时间并格式化
      getCurrDate() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = this.formatData((date.getMonth() + 1)); // 月
        let day = this.formatData(date.getDate()); // 日
        let hour = this.formatData(date.getHours()); // 时
        let minute = this.formatData(date.getMinutes()); // 分
        let second = this.formatData(date.getSeconds()); // 秒
        this.nowDate = `${year}-${month}-${day}  ${hour}:${minute}:${second}`;
      },
      formatData(s){
        return s < 10 ? '0' + s : s
      },
      // 获取学生电子校园卡信息
      async getCampusCardInfo(){
        this.isLoading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'CampusCardInfo'});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert('', '获取学生电子校园卡信息失败');
          return;
        }
        this.stuInfo=d.data;
        this.bgColor = this.stuInfo.allow;
        this.xh = this.stuInfo.qrcode;
        this.qrCodeInfo = JSON.stringify({key: this.stuInfo.xh, keyType: 1})
        this.barcode(this.stuInfo.barcode);    // 条形码and二维码
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    created() {
      this.xh = this.userinfo.stuObj.XH
      this.getCampusCardInfo(); // 获取学生电子校园卡信息
    },
    // 销毁定时器
    beforeDestroy() {
      if (this.getCurrDate) {
        clearInterval(this.getCurrDate); // 在Vue实例销毁前，清除时间定时器
      }
    }
  }
</script>
<style scoped lang="less">
  /*背景颜色*/
  .redColor{
    background: url("../assets/images/redSchoolCard.jpg") no-repeat;
    background-size:100%;
    height:100%!important;
  }
  .greenColor{
    background: url("../assets/images/greenSchoolCard.jpg") no-repeat;
    background-size:100%;
    height:100%!important;
    }
  .schoolCard{
    position: static;
    overflow-y: auto;
  /*头部*/
  .header{
    height:50px;
    color:#fff;
    font-size:16px;
    line-height:50px;
    text-align: center;
    .breakIcon{
      margin-left:24px;
      color:#fff;
      float: left;
    }
    .title{
      margin-left:-24px;
    }
  }
  /*卡片*/
  .greenCard{
    background: url('../assets/images/greenCard.png') no-repeat;
    background-size: 94% 110%;
    background-position:10px -10px;
  }
    .redCard{
    background: url('../assets/images/card.png') no-repeat;
    background-size: 94% 110%;
    background-position:10px -10px;
  }
  .card{
    display:flex;
    color:#333;
    padding:0 16px;
    margin: 6px 0 12px;
    div{
      flex:1;
    }
    .userinfo-left{
      padding-bottom:32px;
      .name{
        font-size:22px;
        font-weight:bold;
        text-align: center;
        padding:20px 0;
      }
      .user-img{
        width:104px;
        height:104px;
        background:#fff;
        margin:auto;
        img{
          width:104px;
          height:104px;
        }
      }
    }
    .userinfo-right{
      margin-top:20px;
      font-size:14px;
      padding:0 10px;
      >p{
        margin-bottom:16px;
      }
      >img{
        width:94%;
        height:30px;
      }
    }
  }

  /*时间*/
    .greenTime{
      background: #2b8c53;
    }
    .redTime{
      background: #b71c1c;
    }
  .time{
    width:75%;
    line-height:40px;
    color:#fff;
    font-size:16px;
    text-align: center;
    border-radius:20px;
    margin:auto;
  }
    /*二维码 start*/
    .green-qr-code-box{
      border:5px solid #1b5e20;
    }
    .red-qr-code-box{
      border:5px solid #a61919;
    }
  .QR-code-box{
    width:75%;
    height:45%;
    background: #fff;
    border-radius: 20px;
    margin:12px auto 0;
    position: relative;
    .qr-code{
      width: 72%;
      height: 72%;
      background: skyblue;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
  /*二维码 start*/

}
</style>
<style lang="less">
  .schoolCard .QR-code-box .qr-code img{
    width: 100%!important;
    height: 100%!important;
  }
  /*条形码、二维码 弹出框start*/
  .vux-popup-dialog{
    top:50%;
    transform: translate(0, -50%);
    overflow-y: inherit;
    p{
      padding:20px 0 40px;
      text-align: center;
      span{
        position: fixed;
        right: 20px;
        color: #c5d5d5;
      }
    }
    img{
      /*width:94%;*/
      /*margin-left:3%;*/
      /*position: relative;*/
      /*top: 50%;*/
      /*transform: rotate(90deg);*/
    }
    .qr-code{
      img{
        width:90%!important;
        height:auto!important;
        text-align:center;
      }
    }
    .code-box{
      background-color:#fff;
      margin:0 auto;
      /*border-radius:5px;*/
      /*padding-bottom:40px;*/
      text-align: center;
      height: 100%;
    }
  }
  /*条形码、二维码 弹出框end*/


</style>

