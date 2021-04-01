<template>
  <div :class="`fwrapper ${loadedPg ? 'p-userbind' : ''}`">
    <div v-if="loadedPg">
      <div class="logo-box">
        <img :src="'./static/imgs/logo.png?v=' + QD.productVersionNum" />
      </div>
      <div class="title-box">
        <p class="text">欢迎使用{{QD.productName}}</p>
      </div>
      <div class="form-field">
        <form class="form-box">
          <x-input class="input-box" ref="userId" placeholder="请输入学号或工号" :required="true" v-model="userid">
            <span slot="label" class="caption"><span class="school-wx-icon num-icon">&#xe677;</span></span>
          </x-input>
          <x-input class="input-box psw-box" ref="userId" placeholder="请输入密码" :required="true" :type="pwdType" v-model="pwd">
            <span slot="label" class="caption"><span class="school-wx-icon psw-icon">&#xe676;</span></span>
            <see-password-icon slot="label" :inpType="pwdType" @getInpType="getInputType"></see-password-icon>
          </x-input>
        </form>
        <div class="btn-box">
          <x-button class="btn-submit" type="primary" :show-loading="false" @click.native="doBind">确认绑定</x-button>
        </div>
      </div>
    </div>
    <change-pwd v-if="bindUserInfo" @get-config="getPwdConfigData" ref="changePwd" @success-result="successUpdatePwd" :bindUserInfo="bindUserInfo" :oldPwd="pwd"></change-pwd>
    <!-- 指引弹框 start -->
    <!--<guide-dialog></guide-dialog>-->
    <!-- 指引弹框 end -->
  </div>
</template>

<script>
  // import {Group, XInput, XImg, Selector, XButton} from 'vux'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import Group from "vux/src/components/group/index.vue"
  import XInput from "vux/src/components/x-input/index.vue"
  import XImg from "vux/src/components/x-img/index.vue"
  import XButton from "vux/src/components/x-button/index.vue"
  import { mapState, mapActions } from 'vuex'
  import seePasswordIcon from './common/SeePasswordIcon.vue'
  import ChangePwd from './userbind/ChangePwd.vue'
  /*import GuideDialog from './userbind/GuideDialog.vue'*/
  import {md5} from "vux"
  import { Toast } from 'vant'

  export default {
    name: 'userbind',
    components: {
      Tab,
      TabItem,
      Group,
      XInput,
      XImg,
      XButton,
      seePasswordIcon,
      ChangePwd,
      [Toast.name]: Toast
    },
    data () {
      return {
        loadedPg: true, // 页面是否显示
        pwdType: 'password', //密码框类型
        isvalid: false,
        userid: '',
        pwd: '',
        bindUserInfo: null, // 绑定成功后接口返回的值
        configPwdObj: null // 密码的配置信息
      }
    },
    computed: {
      ...mapState({
        qrcodescankey: state => state.vux.qrcodescankey // // 绑定后的扫码登录，路径的参数值
      })
    },
    created () {
    },
    methods: {
      //获取pwd 类型
      getInputType (val){
        this.pwdType = val;
      },
      onItemClick (t) {
        this.userType = t;
      },
      imgsuccess (src, ele) {
        console.log('imgsuccess load', src)
        ele.src = src
      },
      imgerror (src, ele, msg) {
        console.log('error load', msg, src)
      },
      // 成功修改密码
      successUpdatePwd () {
        this.goProductPg() // 登录成功, 进入页面
      },
      // 登录成功,判断是否需要修改密码
      judgeRevisePwd () {
        if (this.configPwdObj) {
          if (this.needChangeDefaultPwd()) { // 需要修改初始密码 modifyPwd=1
            this.loadedPg = false;
            this.$refs.changePwd.doShowPg();
          } else {
            this.goProductPg()
          }
        } else {
          this.goProductPg() // 登录成功, 进入页面
        }
      },
      // 判断是否需要修改初始密码
      needChangeDefaultPwd () {
        if (this.configPwdObj && this.configPwdObj.modifyPwd === 1) { // 需要修改初始密码 modifyPwd=1
          let md5Pwd = md5(this.pwd).toUpperCase(); // 将小写字母转换成大写字母
          let defaultPwds = this.configPwdObj.defaultPwd.split(",");  // 默认密码或者身份证后六位
          for (let p of defaultPwds) {
            if (p === md5Pwd) {
              return true;
            }
          }
        }
        return false;
      },
      // 登录成功, 进入页面
      goProductPg () {
        // 存 当前登录用户的 token
        this.QD.setProductUserUpdateTime(); // 用户变更时，将变更时间写入缓存中
        this.updateUserInfo(this.bindUserInfo);
        if (this.qrcodescankey) {
          console.log(`Entry 微信绑定`);
          this.$router.replace('/qrCodeLogin');
        } else {
          console.log(`Entry 跳转到主页`);
          this.$router.replace('home');
        }
      },
      validateInput () {
        let valid = true
        for (let ref in this.$refs) {
          let item = this.$refs[ref]
          item.blur && item.blur()
          if (item.invalid) {
            valid = false
          }
          console.log(item.valid);
        }
        this.isvalid = valid;
      },
      doBind (ev) {
        this.bindUserInfo = null;
        this.validateInput();
        if (this.isvalid === true) {
          let that = this;
          let obj = {userid: this.userid, pwd: md5(this.pwd)};
          if (this.QD.openInterfaceRegPs) { // 开启验证ps
            let strPs = JSON.stringify(obj);
            if (this.QD.openInterfaceRegPs.test(strPs) === true) {
              Toast({
                message: '请求中存在非法字符',
                position: 'top'
              });
              return
            }
          }
          this.updateLoadingStatus(true);
          this.$http.post(`${this.QD.APIHOST}${this.QD.API.userbind}`, obj).then((d) => {
            that.updateLoadingStatus(false);
            if (d.data && d.data.status === 'error') {
              that.QD.alert("绑定失败", d.data.msg);
            } else {
              console.log("绑定成功");
              that.bindUserInfo = d.data;
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      },
      // 得到密码的配置信息
      getPwdConfigData (e) {
        this.configPwdObj = e;
        this.judgeRevisePwd(); // 登录成功,判断是否需要修改密码
      },
      ...mapActions([
        'updateLoadingStatus',
        'updateUserInfo'
      ])
    },
    watch: {
    }
  }
</script>
<style lang="less" scoped>
  .p-userbind{
    background-position: 0 0;
    background-image: url(../assets/images/userbind_bg.jpg);
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
  }
  .logo-box{
    padding-top: 38px;
    padding-bottom: 12px;
    text-align: center;
  }
  .logo-box > img{
    width: 222px;
  }
  .title-box{
    text-align: center;
  }
  .title-box .text{
    padding: 0 10px;
    font-size: 30px;
    color: #ffffff;
    line-height: 32px;
  }
  .form-field{
    position: relative;
    padding-top: 62px;
  }
  .form-box{
    color: #ffffff;
    font-size: 14px;
  }
  .input-box{
    position: relative;
    left: 10%;
    width: 80%;
    margin-bottom: 24px;
    padding: 4px 4px 4px 0;
    box-sizing: border-box;
    border: 1px solid #ffffff;
    border-radius: 40px;
    .psw-icon,
    .num-icon{
      padding: 0 10px;
      font-size: 24px;
      color: #ffffff;
    }
  }
  .input-box:before{
    height: 0;
    border: 0;
  }
  .btn-box{
    position: relative;
    width: 80%;
    left: 10%;
    padding-top: 6px;
  }
  .btn-submit{
    position: relative;
    font-size: 16px;
    padding: 2px 0;
    background-color: #4fc3f7;
    -webkit-border-radius: 40px;
    -moz-border-radius: 40px;
    border-radius: 40px;
    box-shadow: 0 2px 8px 0 rgba(56, 120, 202, 0.2);
  }
</style>
<style>
  /* x-input 中 input 的样式设置 */
  .p-userbind .weui-input{
    height: 32px;
  }
  .p-userbind .input-box input::-webkit-input-placeholder {
    color: #ffffff
  }
  .p-userbind .input-box input::-moz-placeholder {
    color: #ffffff
  }
  .p-userbind .input-box input:-o-placeholder {
    color: #ffffff
  }
  .p-userbind .input-box input:-ms-input-placeholder {
    color: #ffffff
  }
  .p-userbind .input-box input:input-placeholder{
    color: #ffffff
  }
  .p-userbind .psw-box .weui-cell__bd{
    padding-right: 60px;
  }
</style>
