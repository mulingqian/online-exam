<template>
  <div class="change-pwd-field">
    <template v-if="loadedPg">
      <div class="header-box">
        <div v-if="initiativeChangePwd" class="left-arrow" @click="goBack"></div>
        <div class="header-title">修改密码</div>
      </div>
      <div class="pwd-container">
        <!-- 个人头像 start -->
        <div class="head-img">
          <x-img :src="profileImg" :defaultSrc="profileImg"
                 class="ximg-demo" error-class="ximg-error" :offset="1000" container="#head-img"></x-img>
        </div>
        <!-- 个人头像 end -->
        <div class="form-field">
          <!-- 密码复杂性的描述 start -->
          <div class="desc-box" v-if="configPwdObj && configPwdObj.complexPwd === 1">
            <p class="title">密码至少包含以下三种: </p>
            <p class="desc">1. 英文大写字母 (A 到 Z)</p>
            <p class="desc">2. 英文小写字母 (a 到 z)</p>
            <p class="desc">3. 10 个基本数字 (0 到 9)</p>
            <p class="desc">4. 特殊字符 (例如 !、$、#、%、@)</p>
          </div>
          <!-- 密码复杂性的描述 end -->
          <form class="form-box">
            <x-input v-if="initiativeChangePwd" class="input-box psw-box" ref="oldPwd" placeholder="请输入原密码" :required="true" type="password"
                     v-model="initiativeOldPwd">
              <span slot="label" class="caption"><span class="school-wx-icon psw-icon">&#xe678;</span></span>
            </x-input>
            <x-input class="input-box psw-box" ref="newPwd1" placeholder="请输入新密码" :required="true" type="password"
                     :min="this.configPwdObj ? this.configPwdObj.pwdMinLength : 0" v-model="newPwd1">
              <span slot="label" class="caption"><span class="school-wx-icon psw-icon">&#xe676;</span></span>
            </x-input>
            <x-input class="input-box psw-box" ref="newPwd2" placeholder="请再次输入新密码" :required="true" type="password"
                     :min="this.configPwdObj ? this.configPwdObj.pwdMinLength : 0" v-model="newPwd2">
              <span slot="label" class="caption"><span class="school-wx-icon psw-icon">&#xe676;</span></span>
            </x-input>
          </form>
          <div class="btn-box">
            <x-button class="btn-submit" type="primary" :show-loading="false" @click.native="doRevise">确认修改</x-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  import XImg from "vux/src/components/x-img/index.vue"
  import XInput from "vux/src/components/x-input/index.vue"
  import XButton from "vux/src/components/x-button/index.vue"
  import { mapActions } from 'vuex'
  import {md5} from "vux"
  export default {
    name: 'changePwd',
    directives: {},
    components: {
      XImg,
      XInput,
      XButton
    },
    props: {
      initiativeChangePwd: { // 用户登录成功后，自动主动修改密码
        type: Boolean,
        default: false
      },
      bindUserInfo: { // 用户信息
        type: Object,
        default: null
      },
      oldPwd: { // 用户的原密码 , userbind 页面 用户绑定成功的密码
        type: String,
        default: ''
      }
    },
    data () {
      return {
        loadedPg: false, // 默认不显示页面
        backLoaded: true,
        pwdType: 'password', //密码框类型
        initiativeOldPwd: '', // 主动修改密码的原密码
        newPwd1: '',
        newPwd2: '',
        configPwdObj: null, // 密码的配置信息
        specialLetter: false // 默认新密码中无特殊字母
      }
    },
    created () {
      this.getUserPwdConfigInfo(); // 得到修改密码的配置信息
    },
    mounted () {
    },
    computed: {
      profileImg () {
        let imgsrc = this.bindUserInfo && this.bindUserInfo.profileimg ? this.bindUserInfo.profileimg : this.QD.defaultProfileImg
        if (imgsrc.endsWith('/0')) {
          imgsrc = imgsrc.substr(0, imgsrc.length - 2) + '/132'
        }
        return imgsrc
      }
    },
    watch: {
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 返回事件
      goBack () {
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 显示页面
      doShowPg () {
        this.loadedPg = true;
      },
      // 判断新密码是否满足复杂性要求
      /*
       1. 英文大写字母(A 到 Z)
       2. 英文小写字母(a 到 z)
       3. 10 个基本数字(0 到 9)
       4. 非字母字符(例如 !、$、#、%) [(space)!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~DEL (delete)]
      * */
      doPwdComplexityValidate () {
        let conditionNum = 0; // 满足条件数目
        let upperCase = /[A-Z]/;
        let lowerCase = /[a-z]/;
        let numCase = /[0-9]/;
        let otherCase = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
        if (upperCase.test(this.newPwd1)) {
          conditionNum ++;
        }
        if (lowerCase.test(this.newPwd1)) {
          conditionNum ++;
        }
        if (numCase.test(this.newPwd1)) {
          conditionNum ++;
        }
        if (otherCase.test(this.newPwd1)) {
          conditionNum ++;
          this.specialLetter = true; // 新密码中有特殊字母
        }
        if (conditionNum < 3) {
          return false
        }
        return true
      },
      // 调用修改密码的接口
      async doRevisePwdInter () {
        let oldPassword = this.oldPwd;
        if (this.initiativeChangePwd) { // 自主修改密码
          oldPassword = this.initiativeOldPwd;
        }
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'UpdatePwd', UserId: this.bindUserInfo.userid, Pwd: oldPassword, NewPwd: this.newPwd1});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log("GetUserPwdConfigInfo", d);
          this.QD.alert('', `修改密码失败:${d.msg}`);
          return;
        }
        this.$emit('success-result');
      },
      // 做修改
      doRevise () {
        this.specialLetter = false;
        let validateVal = this.validateInput(); // 验证
        if (!validateVal) {
          return;
        }
        if (this.specialLetter) {
          let that = this;
          this.QD.confirm('温馨提示', '新密码中包含特殊字符, 确认修改 ?', function() {
            that.doRevisePwdInter();
          }, '');
        } else {
          this.doRevisePwdInter();
        }
      },
      // 验证
      validateInput () {
        if (this.initiativeChangePwd && !this.initiativeOldPwd) {
          this.QD.alert('温馨提示', '请输入原密码');
          return false
        }
        if (!this.newPwd1) {
          this.QD.alert('温馨提示', '请输入新密码');
          return false
        }
        if (this.newPwd1 !== this.newPwd2) {
          this.QD.alert('温馨提示', '确认密码与新密码不一致，请重新输入！');
          return false
        }
        // 验证密码的最小长度
        if (this.newPwd1.length < this.configPwdObj.pwdMinLength) {
          this.QD.alert('温馨提示', '新密码长度不能小于' + this.configPwdObj.pwdMinLength + '位');
          return false
        }
        if (this.configPwdObj.complexPwd === 1) { // 0 不需要判断密码的复杂性; 1
          let satisfyPwdComplex = this.doPwdComplexityValidate(); // 判断新密码是否满足复杂性要求
          if (!satisfyPwdComplex) {
            this.QD.alert('温馨提示', '输入的新密码不符合复杂度要求！');
            return false
          }
        }
        if (this.configPwdObj.modifyPwd === 1) { // 1 必须修改初始密码;
          let md5Pwd = md5(this.newPwd1).toUpperCase(); // 将小写字母转换成大写字母
          let defaultPwds = this.configPwdObj.defaultPwd.split(",");  // 默认密码或者身份证后六位
          for (let p of defaultPwds) {
            if (p === md5Pwd) {
              return false
            }
          }
        }
        return true
      },
      // 得到修改密码的配置信息
      async getUserPwdConfigInfo () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetUserPwdConfigInfo', userType: this.bindUserInfo.usertype});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log("GetUserPwdConfigInfo", d);
          this.$emit('get-config', this.configPwdObj);
          return;
        }
        this.configPwdObj = d.data[0];
        console.log("configInfo", this.configPwdObj);
        this.$emit('get-config', this.configPwdObj);
      }
    }
  }
</script>
<style scoped lang="less">
  .change-pwd-field{
    position: static;
  }
  .header-box{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 3px 0;
    background-color: #f8f8f8;
    z-index: 100;
  }
  .header-title{
    position: relative;
    height: 40px;
    margin: 0 88px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
  }
  .left-arrow{
    position: absolute;
    top: 9px;
    left: 12px;
    width: 30px;
    height: 30px;
  }
  .left-arrow:before{
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid #2c2c2c;
    border-width: 1px 0 0 1px;
    -webkit-transform: rotate(315deg);
    transform: rotate(315deg);
    top: 8px;
    left: 7px;
  }
  /* 内容 start */
  .pwd-container{
    position: absolute;
    top: 46px;
    bottom: 0;
    width: 100%;
  }
  .head-img{
    position: relative;
    padding: 40px 0 30px 0;
    text-align: center;
  }
  .head-img img{
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }
  .form-field{
    position: relative;
  }
  /* 密码复杂性描述 start */
  .form-field .desc-box{
    position: relative;
    left: 10%;
    width: 80%;
    padding: 0 0 20px 10px;
    font-size: 14px;
    color: #666666;
    box-sizing: border-box;
    .title{
      padding: 2px 0;
      color: #333333;
    }
    .desc{
      padding: 2px 0;
      color: #ff0000;
    }
  }
  /* 密码复杂性描述 end */
  .form-box{
    color: #333333;
    font-size: 14px;
  }
  .input-box{
    position: relative;
    left: 10%;
    width: 80%;
    margin-bottom: 24px;
    padding: 4px 4px 4px 0;
    box-sizing: border-box;
    border: 1px solid #dfdfdf;
    border-radius: 40px;
  .psw-icon{
    padding: 0 10px;
    font-size: 24px;
    color: #999999;
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
    padding-bottom: 40px;
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
  /* 内容 end */
</style>
<style>
  /* x-input 中 input 的样式设置 */
  .change-pwd-field .weui-input{
    height: 32px;
  }
  .change-pwd-field .input-box input::-webkit-input-placeholder {
    color: #999999;
  }
  .change-pwd-field .input-box input::-moz-placeholder {
    color: #999999;
  }
  .change-pwd-field .input-box input:-o-placeholder {
    color: #999999;
  }
  .change-pwd-field .input-box input:-ms-input-placeholder {
    color: #999999;
  }
  .change-pwd-field .input-box input:input-placeholder{
    color: #999999;
  }
  .change-pwd-field .psw-box .weui-cell__bd{
   /* padding-right: 60px;*/
  }
</style>
