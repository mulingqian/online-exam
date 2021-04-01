<template>
  <div :class="`fwrapper ${showEntryPg ? 'p-entry' : ''}`">
    <div v-if="showEntryPg">
      <div class="loading" id="loading">
        <div class="loading-logo-wrap">
          <div class="loading-logo">
            <img :src="'./static/imgs/logo.png?v=' + QD.productVersionNum" />
            <div class="welcome">{{QD.schoolName}}<br /> - {{QD.productName}} - </div>
            <div class="loading-line-box">
              <div class="loading-line"></div>
            </div>
          </div>
        </div>
        <!-- 重新加载 btn start -->
        <div class="refresh-box">
          <span class="school-wx-icon refresh-icon" @click="clearLocalStorage">&#xe679;</span>
        </div>
        <!-- 重新加载 btn end -->
      </div>
    </div>

    <!-- 进入系统 判断用户是否需要修改密码 -->
    <change-pwd v-if="hasUserInfo"
                :initiativeChangePwd="true"
                :bindUserInfo="userinfo"
                ref="changePwd"
                @get-config="getPwdConfigData"
                @success-result="successUpdatePwd">
    </change-pwd>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import ChangePwd from './userbind/ChangePwd.vue'
export default {
  name: 'entry',
  components: {
    ChangePwd
  },
  data () {
    return {
      tip: '正在加载',
      hasUserInfo: false, // 判断是否存在用户信息
      configPwdObj: null, // 密码的配置信息
      showEntryPg: true, // 在存在用户 前 显示 entry.vue 页面
      intoSystemType: 1 // 修改密码成功后，跳转路径方式如：home.vue / qrCodeLogin
    }
  },
  methods: {
    clearLocalStorage () {
      localStorage.clear();
      window.location.reload();
    },
    checkAccess () {
      if (this.QD.EndClientType === "DING") {
        this.checkAccess_DING()
      } else {
        this.checkAccess_WX()
      }
    },
    checkAccess_WX () {
      console.log(`Entry checkAccess_WX: ${typeof this.userinfo}`);
      console.log(this.userinfo);
      let byglobal = this.QD.checkGlobalUserInfo(this.userinfo);  // 全局用户信息是否发生变更

      // 如果是教务扫码登录则直接跳出
      if (this.onLoginByScanPc() === true) {
        return;
      }
      if (!byglobal && !this.userinfo){
        // this.$router.replace('userbind');
        this.toUserBind();
      } else if (!byglobal && this.userinfo && this.userinfo.syslogin === true) {
        // 判断缓存数据是否合法：
        if (!this.userinfo.stuObj) {
          // 清空缓存，跳到绑定页面
          console.log(`Entry 清空缓存，跳到绑定页面`);
          this.userinfo.syslogin = false;
          this.updateUserInfo(this.userinfo);
          // this.$router.replace('userbind');
          this.toUserBind();
          return;
        }
        this.doLoginHome();
      } else if (!byglobal && this.userinfo && this.userinfo.wxlogin === true && this.userinfo.syslogin === false) {
        console.log(`Entry 跳转到绑定页面`);
        // 跳转到绑定页面
        // this.$router.replace('userbind');
        this.toUserBind();
      } else {
        console.log(`Entry checkAccess_WX 不跳转，watching...`)
      }
    },
    // 钉钉的授权逻辑
    checkAccess_DING () {
      console.log(`Entry checkAccess_DING: ${typeof this.userinfo}`);
      console.log(this.userinfo);
      let that = this;
      let byglobal = this.QD.checkGlobalUserInfo(this.userinfo);  // 全局用户信息是否发生变更
      // 如果是教务扫码登录则直接跳出
      if (this.onLoginByScanPc() === true) {
        return;
      }
      if (!this.QD.Always_CheckAuth && !byglobal && this.userinfo && this.userinfo.syslogin === true && this.userinfo.stuObj) {
        that.doLoginHome();
      } else {
        // 绑定钉钉用户， 然后跳转到home
        console.log(`Entry checkAccess_DING，绑定钉钉用户`);

        that.QD.onDingUser(function () {
          console.log(`Entry checkAccess_DING，已绑定钉钉用户， 跳转到home`);
          that.doLoginHome();
        });
      }
    },
    doLoginHome () {
      if (this.QD.EndClientType === "DING") {
        // 钉钉入口逻辑
        this.doLoginByDing();
      } else {
        this.hasUserInfo = true;
        this.intoSystemType = 2;
      }
    },
    // 钉钉进入系统
    async doLoginByDing (){
      if (this.$dingtalk && this.$dingtalk.env.platform === "pc" && this.QD.DINGSCHOOL) {
        console.log(`Entry 钉钉PC校园主页`);
        // 获取教务授权签名信息
        let rsp = await this.QD.getData('/School/ClientUtil/CheckSchoolSign', {});
        console.log("CheckSchoolSign rsp:", rsp);
        if (!rsp || rsp.status !== "success"){
          console.log("API.ddSign error: 钉钉获取教务授权签名信息失败！", rsp);
          alert("钉钉获取教务授权签名信息失败！");
          return;
        }
        let d = rsp.data;
        let u = `${this.QD.DINGSCHOOL}/SSO/AuthEntry.aspx?timestamp=${d.timestamp}&userid=${d.userid}&nonce=${d.nonce}&sign=${d.sign}`;
        this.QD.go(u);
      } else {
        console.log(`Entry 跳转到主页`);
        this.$router.replace('home');
      }
    },
    // 教务扫码登录
    onLoginByScanPc () {
      /* 教务扫码登录 start */
      if (this.loginByScanPc) {
        console.log("loginByScanPc", this.loginByScanPc);
        let that = this;
        let data = {ticket: this.loginByScanPc};
        this.$http.post(`${this.QD.APIHOST}/School/ClientUserBind/CheckUserByScanTicket`, data).then((d) => {
          if (d.data && d.data.status === 'error') {
            that.QD.alert("绑定失败", d.data.msg);
            // this.$router.replace('userbind');
            this.toUserBind();
          } else {
            that.updateUserInfo(d.data);
            that.hasUserInfo = true;
            that.intoSystemType = 1;
          }
        });
        return true;
      }
      return false;
      /* 教务扫码登录 end */
    },
    // 进入系统的方式
    intoSystemTypeEvent () {
      if (this.intoSystemType === 1) {
        this.$router.replace('/home');
      } else if (this.intoSystemType === 2) {
        if (this.qrcodescankey) {
          console.log(`Entry 钉钉绑定`);
          this.$router.replace('/qrCodeLogin');
        } else {
          console.log(`Entry 跳转到主页`);
          this.$router.replace('/home');
        }
      }
    },
    // 跳转到用户登录页面，区分是否SSO版本
    async toUserBind(){
      if (this.QD.SSOType === "cas") {
        let e = await this.QD.checkSSOAccess(null);
        if (e.redir) {
          // console.log('check sys login ,jump to ' + e.redir)
          window.location.replace(e.redir);
        }
      } else {
        this.$router.replace('userbind');
      }
    },
    // 提示用户去修改密码
    hintChangePwdPg () {
      this.showEntryPg = false; // entry.vue 不显示内容
      this.$refs.changePwd.doShowPg(); // 显示修改密码界面
      this.QD.alert("温馨提示", "您当前密码不安全, 请修改密码.", function () {
      })
    },
    // 得到密码的配置信息
    getPwdConfigData (e) {
      this.configPwdObj = e;
      console.log("entry", this.configPwdObj);
      // 用户当前密码和初始密码一致的情况下设置了需要修改密码
      if (this.configPwdObj && this.configPwdObj.modifyPwd === 1 && this.configPwdObj.identical === true) {
        this.hintChangePwdPg();
      } else {
        this.intoSystemTypeEvent();
      }
    },
    // 成功修改密码
    successUpdatePwd () {
      this.intoSystemTypeEvent();
    },
    ...mapActions([
      'updateUserInfo'
    ])
  },
  created () {
    console.log(`entry created`)
    this.checkAccess()
  },
  computed: {
    ...mapState({
      userinfo: state => state.vux.userinfo,   // 用户信息
      qrcodescankey: state => state.vux.qrcodescankey, // 绑定后的扫码登录，路径的参数值
      loginByScanPc: state => state.vux.loginByScanPc // 教务扫码登录，路径参数
    })

  },
  watch: {
    userinfo (userinfo) {
      console.log(`entry waching userinfo changed:${userinfo}`)
      // 钉钉无需监控userinfo变化，直接读取userinfo后进入系统
      if (this.QD.EndClientType === "DING") {
        return;
      }
      this.checkAccess()
    }
  }
}
</script>
<style scoped>
  .p-entry{
    background-color: #fdb933;
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
  }
  .loading{
    width:100%;
    height:100%;
    background-color: #fdb933;
    position: fixed;
    z-index:99;
  }
  .loading-logo-wrap{
    position: absolute;
    width: 100%;
    top: 20%;
    transform: translate3d(-50%,-50%,0);
    -webkit-transform: translate3d(-50%,-50%,0);
    left: 50%;
  }
  .loading-logo{
    display: block;
    position: absolute;
    width: 100%;
    top: 14%;
    left: 50%;
    -webkit-transform:translateX(-50%);
    transform:translateX(-50%);
    color: #fff;
    text-align: center;
  }
  .loading-logo .welcome{
    padding: 10px 10px;
    line-height:1.6em;
  }
  .loading-logo img{
    width: 60%;
    max-width: 200px;
  }
  .loading-line-box{
    position: relative;
    left: 25%;
    width: 50%;
  }
  .loading-line{
    height:1px;
    width: 100%;
    margin-top: 10px;
    background-color: rgba(255,255,255,.7);
    animation:lineAnimate 2s infinite;
    -webkit-animation:lineAnimate 2s infinite;
    -webkit-transform-origin: 0 0;
  }
  @keyframes lineAnimate{
    from {transform: scaleX(0)}
    to {transform: scaleX(1)}
  }
  @-webkit-keyframes lineAnimate{
    from {-webkit-transform: scaleX(0)}
    to {-webkit-transform: scaleX(1)}
  }
  .refresh-box{
    position: absolute;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }
  .refresh-icon{
    display: inline-block;
    width: 36px;
    padding: 0;
    font-size: 32px;
    color: #ffffff;
    vertical-align: middle;
  }
</style>
