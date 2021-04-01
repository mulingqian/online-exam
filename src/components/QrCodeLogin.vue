<template>
  <div class="fwrapper qr-code-login">
    <div class="qr-code-field">
      <!-- 绑定用户信息之后，扫码登录 -->
      <div class="icon-box">
        <span class="school-wx-icon computer-icon">&#xe65b;</span>
        <p class="icon-msg">电脑登录确认</p>
      </div>
      <div class="btn-box">
        <x-button type="primary" class="login-btn" @click.native="doLogin" mini>登录</x-button>
        <x-button type="primary" class="cancel-btn" @click.native="cancelLogin" mini>取消登录</x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: "qrcodeLogin",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      XButton
    },
    methods: {
        // 点击登录 qrcodescankey
      async doLogin () {
        let timestamp = new Date().getTime();
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'apiSocket.scanByQrcode',
          qrcodescankey: this.qrcodescankey,
          username: this.userinfo.userid,
          timestamp: timestamp,
          token: this.userinfo.token
        });
        this.$router.replace('/home'); // 跳转到主页
      },
        // 取消登录
      cancelLogin () {
          // 跳转到主页
        this.$router.replace('/home');
      },
      ...mapActions([
        'updateUserInfo',
        'updateQrcodescankey' // // 绑定后的扫码登录，更新路径的参数值
      ])
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo,  // 用户信息
        qrcodescankey: state => state.vux.qrcodescankey // // 绑定后的扫码登录，路径的参数值
      })
    },
    created () {
    }
  }
</script>
<style scoped>
  .qr-code-login,
  .qr-code-field{
    width: 100%;
    height: 100%;
  }
  .icon-box{
    padding-top: 60px;
    text-align: center;
  }
  .computer-icon{
    display: inline-block;
    width: 100%;
    height: 220px;
    font-size: 240px;
    padding: 0;
    color: #d0d3d6;
  }
  .icon-msg{
    font-size: 16px;
    color: #000;
  }
  .btn-box{
    position: fixed;
    width: 100%;
    bottom: 40px;
  }
  .login-btn,
  .cancel-btn{
    display: block;
    width: 60%;
    height: 50px;
    font-size: 16px;
  }
  .login-btn{
    color: #3396fb;
    background-color: #e7f3ff;
  }
  .cancel-btn{
    color: #7e8186;
    background-color: #fff;
  }
</style>
<style>
  .qr-code-login .btn-box .weui-btn:after{
    border: 1px solid #fff;
  }
</style>
