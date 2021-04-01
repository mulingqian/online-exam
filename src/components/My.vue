<template>
  <div class="p-my">
    <div class="head-field">
      <div :class="`head-box ${userinfo.usertype === 2 ? 'head-bg2' : 'head-bg4'}`">
        <div class="head-contend">
          <div class="head-img-wrap" @click="goSchoolCard">
            <a href="javascript:void(0);">
              <div class="head-img">
                <x-img :src="profileImg" :defaultSrc="profileImg"  @on-success="imgsuccess" @on-error="imgerror"
                       class="ximg-demo" error-class="ximg-error" :offset="1000" container="#head-img"></x-img>
              </div>
            </a>
          </div>
          <div class="myname">
            <p class="user-name">{{userinfo.stuObj.XM}}</p>
            <p class="bind-time">登录时间 {{userObj.schoolappUpdate}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="weui_panel" v-if="userinfo.usertype === 4" >
      <group class="gp stu-gp">
        <cell class="show-more-cell" :is-link="true"
              :arrow-direction="userObj.fold ? 'down' : 'up'"
              @click.native="foldEvent">
          <div slot="after-title" class="cell-title">
            <span>个人信息</span>
          </div>
          <div class="cell-value">
            <span v-if="userObj.fold">展开</span>
            <span v-if="!userObj.fold">收起</span>
          </div>
        </cell>
      </group>
      <group class="gp stu-gp">
        <cell :border-intent="false">
          <div slot="icon">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconxingming1-copy"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">姓名</div>
          <span>{{ userinfo.stuObj.XM }}</span>
        </cell>
        <cell>
          <div slot="icon">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconxingbiecopy-copy"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">性别</div>
          <span>{{ userinfo.stuObj.Sex }}</span>
        </cell>
        <cell>
          <div slot="icon">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconshuzi-copy"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">学号</div>
          <span>{{ userinfo.stuObj.XH }}</span>
        </cell>
        <cell>
          <div slot="icon" class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconbanji"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">班级</div>
          <span>{{ userinfo.stuObj.BJMC }}</span>
        </cell>
        <cell>
          <div slot="icon" class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconbanzhurenguanli"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">班主任</div>
          <span>{{ userinfo.stuObj.BZR }}</span>
        </cell>
        <template v-if="!userObj.fold">
          <cell>
            <div slot="icon">
              <svg class="icon-svg" aria-hidden="true">
                <use xlink:href="#iconnianji"></use>
              </svg>
            </div>
            <div slot="after-title" class="cell-title">年级</div>
            <span>{{ userinfo.stuObj.NJMC }}</span>
          </cell>
          <cell>
            <div slot="icon">
              <svg class="icon-svg" aria-hidden="true">
                <use xlink:href="#iconbumen1-copy"></use>
              </svg>
            </div>
            <div slot="after-title" class="cell-title">院系</div>
            <span>{{ userinfo.stuObj.ZYMC }}</span>
          </cell>
          <cell>
            <div slot="icon">
              <svg class="icon-svg" aria-hidden="true">
                <use xlink:href="#iconzhuanye"></use>
              </svg>
            </div>
            <div slot="after-title" class="cell-title">专业</div>
            <span>{{ userinfo.stuObj.ZYMC }}</span>
          </cell>
        </template>
      </group>
      <group class="gp stu-gp">
        <cell @click.native="goMyClassStuQrCode()" :is-link="true">
          <div slot="icon" class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconweibiaoti--"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">
            <span>二维码</span>
          </div>
          <div>
            <qrcode class="qrCode" :value="xhAndXM"></qrcode>
          </div>
        </cell>
        <cell @click.native="goChangePwdPg" :is-link="true">
          <div slot="icon" class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconxiugaimima"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">
            <span>修改密码</span>
          </div>
        </cell>
      </group>
      <div class="btn-box" v-if="QD.EndClientType !== 'DING'">
        <x-button class="unbind unbind4" type="warn" :show-loading="submitting"  @click.native="doUnbind" action-type="button" >解除用户绑定</x-button>
      </div>
    </div>

    <div class="weui_panel" v-if="userinfo.usertype == 2" >
      <group class="gp">
        <cell>
          <div slot="icon" class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconxingming1"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">姓名</div>
          <span>{{ userinfo.stuObj.XM }}</span>
        </cell>
        <cell>
          <div slot="icon" class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconxingbiecopy"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">性别</div>
          <span>{{ userinfo.stuObj.XB }}</span>
        </cell>
        <cell>
          <div slot="icon" class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconshuzi"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">职工号</div>
          <span>{{ userinfo.stuObj.ZGH }}</span>
        </cell>
        <cell>
          <div slot="icon" class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconbumen1"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">所属部门</div>
          <span>{{ userinfo.stuObj.KSMC }}</span>
        </cell>
        <cell @click.native="goChangePwdPg" :is-link="true">
          <div slot="icon" class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconxiugaimima-copy"></use>
            </svg>
          </div>
          <div slot="after-title" class="cell-title">
            <span>修改密码</span>
          </div>
        </cell>
      </group>
      <div class="btn-box" v-if="QD.EndClientType !== 'DING'">
        <x-button class="unbind unbind2" type="warn" :show-loading="submitting"  @click.native="doUnbind" action-type="button" >解除用户绑定</x-button>
      </div>
    </div>

  </div>
</template>

<script>

import Group from "vux/src/components/group/index.vue"
import XInput from "vux/src/components/x-input/index.vue"
import XImg from "vux/src/components/x-img/index.vue"
import Cell from "vux/src/components/cell/index.vue"
import XButton from "vux/src/components/x-button/index.vue"

import Qrcode from 'vux/src/components/qrcode/index.vue'
// import { AjaxPlugin } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'my',
  components: {
    Group,
    XInput,
    XImg,
    XButton,
    Cell,
    Qrcode
  },
  data () {
    return {
      submitting: false,
      xm: '', // 学生姓名
      xh: '', // 学生学号
      xhAndXM: '', // 学号加姓名 用来生成二维码
      userObj: {fold: true, schoolappUpdate: ''}, // fold 折叠, schoolappUpdate 微校园用户登录变更时间
      profileImg: '' // 用户头像
    }
  },
  created () {
    this.getUserBindTime(); // 得到用户登录的变更时间
    this.getStuQrCode(); // 若是学生用户，得到学生的二维码
    this.getUserPhoto(); //  得到用户的头像
    console.log(`userbind created ${this.userinfo.profileimg}`)
  },
  methods: {
    ...mapActions([
      'updateLoadingStatus',
      'updateUserInfo'
    ]),
    // 得到用户的头像
    async getUserPhoto () {
      // 得到当前用户之前保存的头像
      if (this.QD.myPageData) {
        let qd = this.QD.myPageData;
        if (this.userinfo.userid === qd.userid) {
          this.profileImg = qd.photoUrl;
        }
      }
      // 当存储的头像是空
      if (!this.profileImg) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetUserPhoto', userType: this.userinfo.usertype});
        console.log("userPhote ", d);
        if (d.status && d.status === "error") {
          return;
        }
        if (d.data) {
          this.profileImg = d.data; // 将默认头像更换
          this.QD.myPageData = {userid: this.userinfo.userid, photoUrl: this.profileImg} // 只保存更换的头像
        }
      }
      // 使用默认头像
      if (!this.profileImg) {
        this.getDefaultUserPhoto();
      }
    },
    // 得到用户的默认头像
    getDefaultUserPhoto () {
      let imgsrc = this.userinfo && this.userinfo.profileimg ? this.userinfo.profileimg : this.QD.defaultProfileImg
      if (imgsrc.endsWith('/0')) {
        imgsrc = imgsrc.substr(0, imgsrc.length - 2) + '/132'
      }
      this.profileImg = imgsrc
    },
      // 到电子卡页面
    goSchoolCard() {
      if (this.QD.isOpenSchoolCard && this.userinfo.usertype === 4){
        this.$router.push({path: '/schoolCard', query: {profileImg: this.profileImg}})
      }
    },
    // 折叠的方法
    foldEvent () {
      this.userObj.fold = !this.userObj.fold
    },
    //  到二维码页面
    goMyClassStuQrCode () {
      this.$router.push({path: '/myClassStuQrCode', query: {xm: this.xm, xh: this.xh}});
    },
      // 若是学生用户，得到学生的二维码
    getStuQrCode () {
      if (this.userinfo.usertype === 4) {
        this.xm = this.userinfo.stuObj.XM;
        this.xh = this.userinfo.stuObj.XH;
        let out = this.futf16to8(this.userinfo.stuObj.XM);
        this.xhAndXM = out + '-' + this.userinfo.stuObj.XH;
      }
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
    },
    // 得到用户登录的变更时间
    getUserBindTime () {
      if (localStorage[`${this.QD.PRODUCT_KEY}_update_wxschoolapp`]) {
        this.userObj.schoolappUpdate = localStorage[`${this.QD.PRODUCT_KEY}_update_wxschoolapp`];
      }
    },
    imgsuccess (src, ele) {
      console.log('imgsuccess load', src)
      ele.src = src
    },
    imgerror (src, ele, msg) {
      console.log('error load', msg, src)
    },
    // 到修改密码的页面
    goChangePwdPg () {
      this.$router.push({path: '/initiativeChangePwd'});
    },
    doUnbind (ev) {
      let _this = this
      this.QD.confirm("确定要解除绑定吗？", "解除绑定后，将退出当前登录账号，需要重新绑定用户信息才能进入系统！", function () {
        _this.updateLoadingStatus(true)
        _this.$http.post(`${_this.QD.APIHOST}${_this.QD.API.unbind}`, {}).then((d) => {
          console.log(d);
          _this.updateLoadingStatus(false);
          _this.userinfo.syslogin = false;
          _this.updateUserInfo(_this.userinfo);
          _this.QD.setProductUserUpdateTime(); // 用户变更时，将变更时间写入缓存中
          if (_this.loginByScanPc) {
            window.location.href = _this.QD.APIHOST + '/dist/index.html#/userbind';
          } else {
            _this.QD.go("/", _this.$router);
            console.log("_this.$router is", _this.$router);
          }
        }).catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 499){
            _this.updateLoadingStatus(false);
            _this.userinfo.syslogin = false;
            _this.updateUserInfo(_this.userinfo);
            _this.QD.setProductUserUpdateTime(); // 用户变更时，将变更时间写入缓存中
            _this.QD.go("/", _this.$router)
          }
        })
      })
    }
  },
  computed: {
    ...mapState({
      userinfo: state => state.vux.userinfo,   // 用户信息
      loginByScanPc: state => state.vux.loginByScanPc // 教务扫码登录，路径参数
    })
  },
  watch: {
    userinfo (userinfo) {
      console.log(`UserBind waching userinfo changed:${userinfo}`)
      this.profileImg = this.userinfo && this.userinfo.profileimg ? (this.userinfo.profileimg.substr(0, 4) === 'http' ? this.userinfo.profileimg : `${this.QD.URLBASE}${this.userinfo.profileimg}`) : this.QD.defaultProfileImg
    },
    profileImg (profileImg) {
      console.log(`UserBind  waching profileImg changed:${profileImg}`)
    }
  }
}
</script>
<style scoped>
  .p-my{
    position: static;
    overflow-y: auto;
  }
  .p-my>.head-field{
    position: relative;
  }
  .head-box{
    position: relative;
    width: 100%;
    height: 164px;
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
  }
  .head-bg2{
    background-image: url('../../static/imgs/my_bg2.jpg');
  }
  .head-bg4{
    background-image: url('../../static/imgs/my_bg4.jpg');
  }
  .head-contend{
    position: relative;
    padding: 32px 10px 32px 30px;
  }
  .head-img-wrap{
    position: relative;
    width: 100px;
    height: 100px;
  }
  .head-img img{
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
  .weui-cell__hd>span{
    padding-right: 10px;
  }
  /* 头像 end */
  .myname{
    position: absolute;
    top: 55px;
    left: 145px;
    right: 0;
  }
  .user-name {
    padding: 6px 0;
    font-size: 20px;
    color: #333333;
  }
  .bind-time{
    padding: 6px 0;
    font-size: 12px;
    color: #ffffff;
  }
  .qrCode{
    position: relative;
    top: 4px;
    display: inline-block;
    width: 25px;
    height: 25px;
  }
  .gp .icon-box{
    line-height: inherit;
  }
  .cell-title{
    width: 80px;
  }
  .gp .icon-svg{
    width: 46px;
    height: 26px;
  }
  .btn-box{
    padding: 20px 20px 15px 20px;
  }
  .unbind{
    border-radius: 46px;
  }
  .unbind4{
    background-color: #26a69a;
  }
  .unbind2{
    background-color: #16a1fe;
  }
  .show-more-cell{
    padding: 4px 20px;
    background-color: #f8f8f8;
  }
  .show-more-cell .cell-title{
    color: #999999;
    font-size: 14px;
  }
  .show-more-cell .cell-value{
    padding: 0 4px;
    font-size: 12px;
    color: #C8C8CD;
  }
</style>
<style>
  .p-my .weui_panel .qrCode img{
    width: 20px!important;
    height: 20px!important;
  }
  .p-my .stu-gp .weui-cells{
    margin-top: 0;
  }
</style>
