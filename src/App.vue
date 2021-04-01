<template>
  <div :class="`${userinfo && userinfo.usertype === 2 ? 'appmode myapp tea-app':'myapp stu-app'}
  ${sonLoading ? 'no-network-app' : ''} ${onlineStatus ? '' : 'no-network-app'} ${isLoading_global ?  'no-network-app' : ''}`" style="height:100%;">
    <toast v-model="netWorkNoStatusToast" type="text" :time="6000" :is-show-mask="false" text="网络出错, 请稍后再试!" :width="'150px'" :position="'default'"></toast>
    <toast v-model="sonLoadingToast" type="text" :time="6000" :is-show-mask="false" text="请求超时!" :position="'default'"></toast>
    <toast v-model="isLoadingToast_global" type="text" :time="6000" :is-show-mask="false" text="请求超时!" :position="'default'"></toast>
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <div v-transfer-dom>
      <alert v-model="topAlert.show" :title="topAlert.title" @on-hide="topAlert.onHide">{{ topAlert.msg }}</alert>
    </div>
    <div v-transfer-dom>
      <confirm v-model="topConfirm.show"
               ref="topConfirm"
               :closeOnConfirm = "topConfirm.closeOnConfirm"
               :title="topConfirm.title"
               @on-cancel="topConfirm.onCancel"
               @on-confirm="topConfirm.onConfirm">
        <p style="text-align:center;">{{ topConfirm.msg }}</p>
        <x-input v-if="topConfirm.showInput" v-model="topConfirm.inputVal" :required="topConfirm.required" style="border: 1px solid #aaa; padding:6px 6px;"></x-input>
      </confirm>
    </div>
    <view-box ref="viewBox" class="view-box"  :body-padding-top="showHead ? '46px':'0'" :body-padding-bottom="showBar?'50px':'0'">

      <x-header slot="header" v-show="showHead"
                style="width:100%;position:absolute;left:0;top:0;z-index:100;"
      :left-options="leftOptions"
      :right-options="rightOptions"
      :transition="headerTransition"
      @on-click-more="onClickMore">
        <span slot="default" v-html="title"></span>
        <a slot="right" @click.prevent="scanQRCode" v-if="rightQrCode === true"><span class="school-wx-icon" style="padding:0;color: #fff;">&#xe623;</span></a>
        <a slot="right" @click.prevent="scanQRCodeDemo" v-if="rightQrCodeDemo === true"><span class="school-wx-icon" style="padding:0;color: #fff;">&#xe623;</span></a>
      </x-header>

      <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
          <keep-alive :include=/.+_keepAlive/> <!-- vue 页面包括 '_keepAlive'  /.+_keepAlive/  moreApplication_keepAlive 代表页面需要缓存 -->
            <router-view class="router-view" ref="myrouter" :style="`${clientInfo.routerHeight}`"></router-view>
          </keep-alive>
      </transition>

      <tabbar class="vux-demo-tabbar" icon-class="vux-center" v-show="showBar" slot="bottom">
        <tabbar-item :link="{path:'/home'}">
          <div slot="icon">
            <span v-if="route.path === '/home'" class="school-wx-icon tabbar-icon selected-tabbar-icon">&#xe67d;</span>
            <span v-else="" class="school-wx-icon tabbar-icon default-tabbar-icon">&#xe682;</span>
          </div>
          <span slot="label">首 页</span>
        </tabbar-item>
        <tabbar-item class="appInfor" :link="{path:'/messageCenter/messageCentre'}" :badge="this.msgCentreSumNum">
          <div slot="icon">
            <span v-if="route.path === '/messageCenter/messageCentre'" class="school-wx-icon tabbar-icon selected-tabbar-icon">&#xe683;</span>
            <span v-else="" class="school-wx-icon tabbar-icon default-tabbar-icon">&#xe681;</span>
          </div>
          <span slot="label">消 息</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/my'}">
          <div slot="icon">
            <span v-if="route.path === '/my'" class="school-wx-icon tabbar-icon selected-tabbar-icon">&#xe67c;</span>
            <span v-else="" class="school-wx-icon tabbar-icon default-tabbar-icon">&#xe67e;</span>
          </div>
          <span slot="label">我 的</span>
        </tabbar-item>
      </tabbar>
  </view-box>
  </div>
</template>

<script>
// import { Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDom, Alert } from 'vux'
import ViewBox from 'vux/src/components/view-box/index.vue'
import XHeader from 'vux/src/components/x-header/index.vue'
import Tabbar from 'vux/src/components/tabbar/tabbar.vue'
import TabbarItem from 'vux/src/components/tabbar/tabbar-item.vue'
import Loading from 'vux/src/components/loading/index.vue'
import TransferDom from 'vux/src/directives/transfer-dom/index.js'
import Alert from 'vux/src/components/alert/index.vue'
import Confirm from 'vux/src/components/confirm/index.vue'

import Cell from 'vux/src/components/cell/index.vue'
import Group from 'vux/src/components/group/index.vue'
import Divider from 'vux/src/components/divider/index.vue'
import XButton from "vux/src/components/x-button/index.vue"
import Smst from './components/Smst.vue'

import XInput from "vux/src/components/x-input/index.vue"
import XImg from "vux/src/components/x-img/index.vue"
import Toast from 'vux/src/components/toast/index.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'app',
  directives: {
    TransferDom
  },
  components: {
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Loading,
    Alert,
    XInput,
    Confirm,
    Toast
  },
  methods: {
    autoUpdateMsgCentreSum () {
      /*定时器setInterval对象*/
      if (this.QD.UnreadMsg_Interval>0) {
        window.setInterval(this.getMsgOFDoingNoConfirmedNum, this.QD.UnreadMsg_Interval);
      }
    },
    /*查询待办和我的消息未读消息总数*/
    async getMsgOFDoingNoConfirmedNum () {
      if (this.userinfo && this.userinfo.syslogin) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetPersonMsgOFDoingNoConfirmedNum'});
        if (d.status && d.status === "error") {
          console.log('app msg', d.msg);
          let messageSum = '';
          this.messageCentreSum(messageSum);
          return;
        }
        let messageSum = d.toString();
        if (messageSum === '0') {
          messageSum = '';
        }
        this.messageCentreSum(messageSum);
      }
    },
    /* 查询待办和我的消息未读消息总数 end */
    // 扫码
    scanQRCode () {
      let that = this;
      this.QD.scanQRCode(function (result) {
        // 得到学生的学号和姓名，用于德育登记 start
        console.log('result', result);
        let info = JSON.parse(result);
        let xm = info.xm;
        let xh = info.xh;
        // 判断是否使用了扫码功能，区别手动选择学生
        let isSelectStu = "false";
        sessionStorage.setItem("myClassStuQrCodeXM", xm);
        sessionStorage.setItem("myClassStuQrCodeXH", xh);
        sessionStorage.setItem("isSelectStuForME", isSelectStu);
        // 得到学生的学号，用于德育登记 end
        console.log(xm);
        console.log(xh);
        console.log(isSelectStu);
        that.$refs.myrouter.getStuData();
      });
    },
    scanQRCodeDemo () {
      let that = this;
      this.QD.scanQRCode(function (result) {
        // 得到学生的学号和姓名，用于登记 start
        let info = JSON.parse(result);
        let xm = info.xm;
        let xh = info.xh;
        that.QD.otherPageData = null;
        that.QD.otherPageData = {XM: xm, XH: xh};
        console.log("otherPageData", that.QD.otherPageData);
        that.$refs.myrouter.getPageData();
      });
    },
    close () {
      this.QD.closeWindow()
    },
    alert (title, msg, onHide) {
      if (!onHide) {
        onHide = ''
      }
      this.topAlert = {
        show: true,
        title: title,
        msg: msg,
        onHide: onHide
      }
    },
    confirm (title, msg, onConfirm, onCancel, ps) {
      if (!onConfirm) {
        onConfirm = ''
      }
      if (!onCancel) {
        onCancel = ''
      }
      let that = this;
      this.topConfirm = {
        show: true,
        closeOnConfirm: false,
        showInput: ps && ps.showInput,
        inputAttrs: ps && ps.inputAttrs ? ps.inputAttrs : {},
        title: title,
        msg: msg,
        onConfirm: function (t) {
//          if (ps && ps.showInput){
//            that.$refs.topConfirm.setInputValue(that.topConfirm.inputVal);
//          }
          console.log(`onConfirm t:${t}`);
          let m = that.topConfirm.inputVal;
          console.log(`onConfirm m:${m}`);

          if (that.topConfirm.required && (!m || m.length <= 0)) {
            console.log(`that.topConfirm.required:${that.topConfirm.required}`);
            return false;
          }
          let ret = onConfirm(that.topConfirm.inputVal);
          if (ret === false) {
            console.log(`onConfirm ret:${ret}`);
            return false;
          } else {
            that.topConfirm.show = false;
          }
        },
        onCancel: onCancel,
        inputVal: ps && ps.inputVal ? ps.inputVal : "",
        required: ps && ps.required
      };
      console.log(this.topConfirm);
    },
    getTitle () {
      if (this.route.meta && this.route.meta.defaultTitle) return `<div><div class="home-title">${this.QD.schoolName}</div><div class="home-subtitle">${this.userinfo.stuObj.XM} （${this.currUserId}）</div></div>`
      return this.route.meta ? this.route.meta.title : ""
    },
    setTitle (t) {
      this.headTitle = t;
    },
    // 设置header 和 footer
    setLayout () {
      console.log(this.route);
      this.showHead = this.route.path !== '/' && !(this.route.meta.showHead === false);
      this.showBar = this.route.path !== '/' && !(this.route.meta.showBar === false);
      this.rightQrCode = this.route.meta.rightQrCode;
      this.rightQrCodeDemo = this.route.meta.rightQrCodeDemo;
      this.headTitle = this.getTitle();
      console.log(`this.route.path=${this.route.path}, showHead=${this.showHead}, showBar =${this.showBar}`);
      this.clientChangeEvent(); // 监听手机屏
    },
    onClickMore () {
      this.showMenu = true
    },
    // 方法返回判断网络是否在线的 boolean
    updateOnlineStatusEvent (e) {
      let s = e.type === 'online';
      this.oldOnlineStatus = this.onlineStatus; // 记录上一次网络状态
      this.onlineStatus = s; // 记录现在的网络状态
      // console.log('app updateOnlineStatusEvent', s);
      this.updateOnlineStatus(s);
      //  之前断网，现在有网络，且 loading 加载中,不要 loading 提示
      if (!this.oldOnlineStatus && this.onlineStatus) {
        this.sonLoading = true;
        // console.log('again open online status');
      }
    },
    // 当跳转页面时初始化值
    initValChangePath () {
      this.isLoading_global = false; // 清空全局 loading 的样式
      this.sonLoading = false; // 清空vue loading 的样式
    },
    // 当loading=true,即加载时间过久，提示-请求超时并loading加载中隐藏
    getSonLoading () {
     /* 1. 第一次进入页面的loading;
     * 2. 在同一个页面 此时loading 是 true, 20s 前是 false
     */
      let load = false;
      if (this.$refs.myrouter.loading === undefined) {
        load = false; // 默认不显示loading
      } else {
        load = this.$refs.myrouter.loading;
      }
      // console.log(`loading = `, load, this.firstLoading, this.sonLoading);
      if (this.firstLoading && load || (!this.firstLoading && load && !this.sonLoading)) {
        this.firstLoading = false;
        this.sonLoading = load; // app.vue 下的页面loading的值
        this.sonLoadingToast = this.sonLoading;
      }
      // console.log(`app getSonLoading sonLoading = ${load}`);
    },
    // 当全局 isLoading 变化时，处理方法
    dealGlobalLoadChange () {
      console.log("isLoading val.....", this.isLoading);
      if (this.isLoading === true) { // 开始 转圈
        let that = this;
        this.setTimeoutIsLoading = window.setTimeout(function () {
          console.log("20s in app, isLoading change.....", that.isLoading_global);
          that.isLoading_global = that.isLoading; // 记录全局的 20s 后 'isLoading_global' 变化 加上class ‘no-network-app’样式
          that.isLoadingToast_global = true; // 20s 后 isLoading 依旧是 true
        }, 20000);
      } else {
        clearTimeout(this.setTimeoutIsLoading); // 阻止函数的执行- 当已经是false, 不需要再执行函数的内容了
      }
    },
    // 设置 routerHeight 的最小高度样式
    setRouterStyle() {
      if (this.showHead && this.showBar) {
        this.clientInfo.routerHeight = 'min-height: ' + (this.clientInfo.clientHeight - 46 - 53) + 'px';
      } else if (this.showHead && !this.showBar) {
        this.clientInfo.routerHeight = 'min-height: ' + (this.clientInfo.clientHeight - 46) + 'px';
      } else if (!this.showHead && this.showBar) {
        this.clientInfo.routerHeight = 'min-height: ' + (this.clientInfo.clientHeight - 53) + 'px';
      } else {
        this.clientInfo.routerHeight = 'min-height: ' + this.clientInfo.clientHeight + 'px';
      }
    },
    // 监听手机屏
    clientChangeEvent () {
      this.clientInfo.clientHeight = document.body.clientHeight; // 初始化页面的高度
      this.setRouterStyle();  // 设置 routerHeight 的最小高度样式
    },
    // 获取距离顶部距离
    getElementTop(element) {
      let actualTop = element.offsetTop;
      let current = element.offsetParent;

      while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent
      }
      return actualTop
    },
    /* 监听手机实时屏的高度变化- input 聚焦事件 */
    dealFocusEvent() {
      let clientHeight = document.body.clientHeight;
      let _focusElem = null; // 数计入框焦点
      let _elemBodyTop = null; // dom对象相对文档Top
      let scrollViewBoxVal = null; // 需要滚动的高度
      let that = this;
      // 利用捕获事件监听输入框等 focus 动作
      document.body.addEventListener("focus", function(e) {
        _focusElem = e.target || e.srcElement;
        console.log("focus event _foucsElem = ..", _focusElem);
        // dom对象相对屏幕Top
        _elemBodyTop = that.getElementTop(_focusElem); // dom对象相对文档Top
      }, true);
      // 失去焦点时
      document.body.addEventListener("blur", function(e) {
        if (_focusElem) {
          console.log("blur event _focusElem blur = ..");
          _focusElem = null;
        }
      });
      // 因为存在软键盘显示二屏幕大小还没有被改变，所以以窗体（屏幕显示）大小改变为准
      window.addEventListener("resize", function () {
        console.log("app focusEvent resize..", document.body.clientHeight, _focusElem, clientHeight, _elemBodyTop);
        if (_focusElem && document.body.clientHeight < clientHeight) {
          // 焦点元素滚动到可视范围的底部 （false为底部，true为顶部)
          scrollViewBoxVal = _elemBodyTop - document.body.clientHeight + _focusElem.clientHeight + 6;
          console.log("app focusEvent resize, viewBox scrollTo..", scrollViewBoxVal);

          let scTop = that.$refs.viewBox.getScrollTop();
          let elemGapTop = _elemBodyTop - scTop + _focusElem.clientHeight;
          // 文本框在键盘的下面,
          if (elemGapTop > document.body.clientHeight) {
            that.$refs.viewBox.scrollTo(scrollViewBoxVal);
            window.setTimeout(function () {
              that.$refs.viewBox.scrollTo(scrollViewBoxVal);
            }, 5);
          } else { // 文本框在键盘的上面
            that.$refs.viewBox.scrollTo(scTop);
            window.setTimeout(function () {
              that.$refs.viewBox.scrollTo(scTop);
            }, 5);
          }
        }
        // 键盘消失
        if (_focusElem && document.body.clientHeight === clientHeight) {
          let scTop = that.$refs.viewBox.getScrollTop(); // 手机
          that.$refs.viewBox.scrollTo(scTop);
          if (scrollViewBoxVal !== null) {
            scrollViewBoxVal = null; // 聚焦时view 需要滚动的高宽初始化
            window.setTimeout(function () {
              that.$refs.viewBox.scrollTo(scTop);
            }, 5);
          }
        }
      })
    },
    ...mapActions([
      'updateDemoPosition',
      'updateUserInfo',
      'messageCentreSum', // 待办和我的消息未读消息总数方法 main.js 中的mutations
      'updateOnlineStatus'
    ])
  },
  created () {
    console.log(`App.vue created`, this.userInfo);
    // this.setLayout();
    this.$nextTick(function () {
      document.title = `${this.QD.productName}`
    });
      /*自动更新待办和未读消息总数*/
    this.autoUpdateMsgCentreSum();
  },
  mounted () {
    /* 检测网络状态 start */
    window.addEventListener('online', this.updateOnlineStatusEvent);
    window.addEventListener('offline', this.updateOnlineStatusEvent);
    /* 检测网络状态 end */
    console.log(`App.vue mounted`);
    this.$root.$on('alert', this.alert);
    this.$root.$on('confirm', this.confirm);
    this.$root.$on('setTitle', this.setTitle);
    this.dealFocusEvent();
  },
  beforeDestroy () {
    /* 关闭检测网络状态 解除事件监听 start */
    window.removeEventListener('online', this.updateOnlineStatusEvent);
    window.removeEventListener('offline', this.updateOnlineStatusEvent);
    /* 关闭检测网络状态 end */
  },
  watch: {
    path (path) {
      if (this.setIntervalSonLoading) {
        clearInterval(this.setIntervalSonLoading); // 清定时器-监听loading
      }
      this.initValChangePath(); // 当跳转页面时初始化值
      console.log(`path changed:${path},showHead=${this.showHead}`);
      this.setLayout();
      this.firstLoading = true;
      this.setIntervalSonLoading = window.setInterval(this.getSonLoading, 20000); // 当loading=true,即加载时间过久，提示-请求超时并loading加载中隐藏
    },
    onlineStatus (onlineStatus) { // 监听网络
      console.log("in app, onlineStatus change.....", this.onlineStatus);
      this.netWorkNoStatusToast = !this.onlineStatus;
    },
    // 监听 全局 isLoading的变化
    isLoading () {
      console.log("in app, isLoading change.....");
      this.dealGlobalLoadChange(); // 当全局 isLoading 变化时，处理方法
    }
  },
  computed: {
    ...mapState({
      userinfo: state => state.vux.userinfo,  // 用户信息
      route: state => state.route,
      path: state => state.route.path,
      deviceready: state => state.app.deviceready,
      demoTop: state => state.vux.demoScrollTop,
      isLoading: state => state.vux.isLoading,
      direction: state => state.vux.direction,
      msgCentreSumNum: state => state.vux.msgCentreSumNum, // 待办和我的消息未读消息总数
      onlineStatus: state => state.vux.onlineStatus // 网络是否在线
    }),
    leftOptions () {
      let isAndroid = this.QD.getAppEdition();
      return {
        showBack: isAndroid ? this.route.path !== '/home' : false
      }
    },
    rightOptions () {
      return {
        showMore: false
      }
    },
    headerTransition () {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    },
    title: {
      get () {
        if (this.headTitle) {
          let ht = this.headTitle;
          this.headTitle = '';
          return ht;
        }
        if (this.route.meta && this.route.meta.defaultTitle) return `<div><div class="home-title">${this.QD.schoolName}</div><div class="home-subtitle">${this.userinfo.stuObj.XM} （${this.currUserId}）</div></div>`
        return this.route.meta ? this.route.meta.title : ""
      },
      set() {}
    },
    currUserId (stu) {
      if (this.userinfo && this.userinfo.stuObj && this.userinfo.stuObj.XH){
        return this.userinfo.stuObj.XH
      } else if (this.userinfo && this.userinfo.stuObj && this.userinfo.stuObj.ZGH){
        return this.userinfo.stuObj.ZGH
      }
      return '';
    }
  },
  data () {
    return {
      showMenu: false,
      showHead: false,
      showBar: false,
      topAlert: {
        show: false,
        title: '',
        msg: '',
        onHide: ''
      },
      headTitle: '', // 设置标题
      topConfirm: {
        show: false,
        title: '',
        msg: '',
        onCancel: '',
        onConfirm: ''
      },
      clientInfo: {clientHeight: 0, routerHeight: ''}, // 手机屏信息;clientHeight 实时屏幕高度
      rightQrCode: false, // 学生德育header右边的二维码icon
      rightQrCodeDemo: false, // header右边的二维码icon demo-学生考勤stuKaoQinEdit
      setIntervalSonLoading: null, // 监听 sonLoading 事件
      firstLoading: true, // 是否是第一次进入其他vue页面
      sonLoading: false, // app.vue 下的页面loading
      sonLoadingToast: false, // 提示 app.vue 下的页面loading
      oldOnlineStatus: true, // 上一次网络状态
      netWorkNoStatusToast: false, // 网络状态 -  提示用, false - 有网，true - 没有网
      setTimeoutIsLoading: null, // 监听 isLoading 事件
      isLoading_global: false, // 记录全局的 'isLoading_global' 变化 - 注 页面切换、用户退出、用户登录等的 loading
      isLoadingToast_global: false // 全局的 'isLoading_global' 的提示， 20s内一直是true ,提示
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';
@import './style/index_vant';
body {
  font-family: "Microsoft YaHei", "微软雅黑";
  background-color: #fff;
  line-height:1;
}
.logo-img{
  width: 21px;
  vertical-align: top;
  margin-right: 5px;
}
.xs-container{
  margin-top: -19px;
}
.home .weui-cells{
  font-size:15px;
}
.fwrapper.fwrapper{
  position: relative;
  top:0;
  left:0;
  height: auto;
  width: 100%;
}
.view-box{
  position: relative;
}
.home-title{
  font-size:18px;
  line-height: 22px;
}
.home-subtitle{
  font-size:12px;
  line-height: 16px;
}
.vux-x-icon {
  fill: #ff8a00;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
.group-top{
  margin-top: -21px;
}
.vux-demo-tabbar{
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.vux-demo-tabbar .tabbar-icon{
  display: inline-block;
  width: 27px;
  height: 27px;
  padding: 0;
  font-size: 27px;
}
.vux-demo-tabbar .default-tabbar-icon{
  color: #000000;
}
.stu-app .vux-demo-tabbar .selected-tabbar-icon{
  color: @stu-theme-color;
}
.tea-app .vux-demo-tabbar .selected-tabbar-icon{
  color: @tea-theme-color;
}
/* tab start */
.tea-app .vux-tab .vux-tab-item.vux-tab-selected{
  color: @tea-theme-color;
  border-bottom: 3px solid @tea-theme-color;
}
.stu-app .vux-tab .vux-tab-item.vux-tab-selected{
  color: @stu-theme-color;
  border-bottom: 3px solid @stu-theme-color;
}
.tea-app .vux-tab-ink-bar,
.tea-app .vux-tab-bar-inner{
  background-color: @tea-theme-color;
}
.stu-app .vux-tab-ink-bar,
.stu-app .vux-tab-bar-inner{
  background-color: @stu-theme-color;
}
/* tab end */
.vux-demo-tabbar-component {
  background-color: #F70968;
  color: #fff;
  border-radius: 7px;
  padding: 0 4px;
  line-height: 14px;
}
.weui-tabbar__icon + .weui-tabbar__label {
  margin-top: 0!important;
}
.vux-demo-header-box {
  z-index: 100;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

@font-face {
  font-family: 'wxiconfont';  /* project id 535305 */
  src: url('//at.alicdn.com/t/font_535305_zk05j8ugupp919k9.eot');
  src: url('//at.alicdn.com/t/font_535305_zk05j8ugupp919k9.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_535305_zk05j8ugupp919k9.woff') format('woff'),
  url('//at.alicdn.com/t/font_535305_zk05j8ugupp919k9.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_535305_zk05j8ugupp919k9.svg#wxiconfont') format('svg');
}
.demo-icon {
  font-family: 'wxiconfont';
  font-size: 20px;
  color: @tab-bar-active-color;
  padding-right: 10px;
}
.vux-tab-selected .demo-icon{
  color: @tab-text-active-color;
}
.tool-icon{
  font-family: 'wxiconfont';
  font-size: 20px;
  color: #666;
}

.demo-icon-big {
  font-size: 28px;
}

.demo-icon:before {
  content: attr(icon);
}
@font-face {
  font-family: 'iconfont';  /* project id 405166 */
  src: url('//at.alicdn.com/t/font_405166_urfykkt7kcaw0zfr.eot');
  src: url('//at.alicdn.com/t/font_405166_urfykkt7kcaw0zfr.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_405166_urfykkt7kcaw0zfr.woff') format('woff'),
  url('//at.alicdn.com/t/font_405166_urfykkt7kcaw0zfr.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_405166_urfykkt7kcaw0zfr.svg#iconfont') format('svg');
}
.demo-wx-icon {
  font-family: 'iconfont';
  font-size: 20px;
  color: #108fe9;
  padding-right: 10px;
}
@font-face {
  font-family: 'iconfontSchool';  /* project id 463447 */
  src: url('//at.alicdn.com/t/font_463447_m103eg0cy8.eot');
  src: url('//at.alicdn.com/t/font_463447_m103eg0cy8.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_463447_m103eg0cy8.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_463447_m103eg0cy8.woff') format('woff'),
  url('//at.alicdn.com/t/font_463447_m103eg0cy8.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_463447_m103eg0cy8.svg#iconfontSchool') format('svg');
}
.school-wx-icon {
  font-family: 'iconfontSchool';
  font-size: 20px;
  color: #108fe9;
  padding-right: 10px;
}
/* 菜单 */
.school-wx-icon:before {
  content: attr(icon);
}
/* 新版本移动校园 start */
@font-face {
  font-family: 'iconfontSchoolapp2';  /* project id 1855081 */
  src: url('//at.alicdn.com/t/font_1855081_dbvr5yb70i.eot');
  src: url('//at.alicdn.com/t/font_1855081_dbvr5yb70i.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1855081_dbvr5yb70i.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1855081_dbvr5yb70i.woff') format('woff'),
  url('//at.alicdn.com/t/font_1855081_dbvr5yb70i.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1855081_dbvr5yb70i.svg#iconfontSchoolapp2') format('svg');
}
.school-wx-icon2 {
  font-family: 'iconfontSchoolapp2';
  font-size: 20px;
  color: #108fe9;
}
/* 新版本移动校园 end */
/* 巡堂 start */
@font-face {
  font-family: 'schoolpatrol';  /* project id 326282 */
  src: url('//at.alicdn.com/t/font_q9jhg2zb7nrn3ik9.eot');
  src: url('//at.alicdn.com/t/font_q9jhg2zb7nrn3ik9.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_q9jhg2zb7nrn3ik9.woff') format('woff'),
  url('//at.alicdn.com/t/font_q9jhg2zb7nrn3ik9.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_q9jhg2zb7nrn3ik9.svg#schoolpatrol') format('svg');
}
.patrol-icon1 {
  font-family: 'schoolpatrol';
  font-size: 20px;
  color: #f0ad4e;
  padding-right: 10px;
}
/* 巡堂 end */

.router-view {
  width: 100%;
}
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.menu-title {
  color: #888;
}
.img-blockcover,
.img-thumbcover{
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  overflow: hidden;
}
.img-blockcover{
  height: 120px;
}
.img-thumbcover{
  height: 120px;
  border-radius: 50%;
}
.title-mask{
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
  line-height:28px;
  padding: 0 8px;
  white-space: nowrap;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 14px;
  color: #fff;
  background: rgba(0,0,0,0.6) !important;
}
.thumb-texticon{
  display: inline-block;
  width: 100%;
  height:100%;
  border-radius: 50%;
  color: #fff;
  letter-spacing: .1em;
}
.tea-app .vux-header{
  background-color: @tab-bar-active-color_tea;
}
.stu-app .vux-header{
  background-color: @tab-bar-active-color;
}
.myapp .vux-header .vux-header-title,
.myapp .vux-header h1 {
  margin: 0 40px;
}
/* header 样式 start */
.vux-header .vux-header-title > span {
  display: inline-block;
  width: 100%;
}
.bg0{ background: @bg-color0;}
.bg1{ background: @bg-color1;}
.bg2{ background: @bg-color2;}
.bg3{ background: @bg-color3;}
.bg4{ background: @bg-color4;}
.bg5{ background: @bg-color5;}
.bg6{ background: @bg-color6;}
.bg7{ background: @bg-color7;}
.bg8{ background: @bg-color8;}
.bg9{ background: @bg-color9;}
.bg10{ background: @bg-color10;}
.bg11{ background: @bg-color11;}

.center {
  padding-top: 1px;
  text-align: center;
  line-height:1;
}
.index-img{
  width:100%;
}
.icon-select:before{ content: '\e673'; }
.icon-scholar:before{ content: '\e604'; }
.icon-community:before{ content: '\e639'; }
.icon-sign:before{ content: '\e64d'; }
.icon-voluntary:before{ content: '\e60e'; }
.icon-stuleave:before{ content: '\e613'; }
.icon-award:before{ content: '\e60c'; }
.icon-punish:before{ content: '\e640'; }
.icon-bzr:before{ content: '\e610'; }

.icon-spinner:before { content: '\e643';}

.icon-teacher:before { content: '\e610';}
.icon-student:before { content: '\e642';}
.icon-morning:before { content: '\e6c3';}
.icon-attend:before { content: '\e65c';}

@keyframes rotating {
  from{
    transform: rotate(0);
    -webkit-transform: rotate(0);
  }
  to{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes rotating {
  from{
    transform: rotate(0);
    -webkit-transform: rotate(0);
  }
  to{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
/* 设置课表颜色 start */
.course01{
  background-color: #f79d54;;
}
.course02{
  background-color: #6070e9;
}
.course03{
  background-color: #5ba1f7;
}
.course04{
  background-color: #56a36c;
}
.course05{
  background-color: #a685e5;
}
.course06{
  background-color: #7e884f;
}
.course07{
  background-color: #31a79b;
}
.course08{
  background-color: #ee8077;
}
.course09{
  background-color: #6baf4a;
}
.course10{
  background-color: #2e68aa;
}
.course11{
  background-color: #e777ee;
}
.course12{
  background-color: #59b4d0;
}
/* 设置课表颜色 end */
/* iconfont 多色 */
.icon-svg{
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
/* 每个页面的背景颜色*/
.eachPgBase {
  background-color: #f5f5f9;
}
.containers-common{
  position: relative;
}
/* checker 样式 start */
.category-item-pad{
  margin-left: 10px;
  margin-top: 10px;
  font-size: 14px;
  color: #333333;
  padding: 0 10px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
}
.category-item {
  width: 28%;
  margin-left: 2%;
  margin-top: 10px;
  font-size: 14px;
  color: #333333;
  padding: 2px 1%;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
}
.category-item-pad-selected,
.category-item-selected{
  color: #13c22b;
  border-color: #13c22b;
}
.stu-category-item-selected{
  color: #13c22b;
  border-color: #13c22b;
}
.checker-field{
  margin-top: 10px;
  padding: 10px 10px 15px 10px;
  background-color: #fff;
  text-align: center;
}
.divider-title{
  position: relative;
  left: 15%;
  width: 70%;
  text-align: center;
  font-size: 14px;
}
/* checker 样式 end */
/* 必填 * */
.requireIcon{
  font-size: 16px;
  padding-right: 0;
  color: #e83b3b;
}
// 审核通过，已报名
.pass-icon {
  color: #7ed499;
}
// 审核失败, 退回
.lost-icon {
  color: #bd2c00;
}
// 未提交，未报名
.nosubmit-icon{
  color: #79760d;
}
// 审核中
.verifying-icon{
  color: #066dbd;
}
/* 审核通过、审核退回、审核中、未提交*/
.verifyIcon{
  font-size: 90px !important;
  opacity: 0.6;
  z-index: 99;
  position: absolute;
  top: 4px;
  right: 20px;
  animation: verifyStatus 0.6s;
}
@keyframes verifyStatus
{
  from {
    font-size: 200px;
    position: absolute;
    top: 204px;
    right: 40px;}
  to {
    font-size: 90px;
    position: absolute;
    top: 34px;
    right: 40px;}
}
/*loading .weui-mask_transparent 遮罩面积*/
.weui-mask_transparent{
  top: 46px !important;
}
/* 当没有网络时，loading 加载中隐藏 */
.no-network-app  ~  .v-transfer-dom > .weui-loading_toast {
  display: none;
}
  /* actionSheel 弹出框的可选所有值 和取消 */
.weui-actionsheet__action .weui-actionsheet__cell,
.weui-actionsheet__menu .weui-actionsheet__cell{
  font-size: 16px;
  color: #333333;
}
  /* x-textarea 字体的设置 */
  textarea {
    color: #333333;
    font-family: inherit;
  }
/* 清除浮动 start */
.clearfloat:after{
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfloat{
  zoom: 1;
}
.gp-descTitle{
  display: inline-block;
  width: 100%;
  color: #666666;
  font-size: 14px;
  padding-left: 15px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: #f5f5f9;
}
.lf {
  float: left;
}
/*线 line 0.5*/
.bottomHalfLine::after{
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  border-bottom: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.topHalfLine::after{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  box-sizing: border-box;
  content: '';
  pointer-events: none;
  border-top: 1px solid #ebedf0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
</style>
<style>
  /* App.vue 下的消息 */
  .appInfor .weui-tabbar__icon > sup{
    top: 0;
    margin-left: 8px;
  }
  /* group 写cell input text picker 样式 start */
  /* cell */
  .public-group .weui-cell__ft{
    color: #333333;
  }
  /* picker */
  .public-group .vux-cell-value{
    color: #333333;
  }
  /* group 写cell input text picker 样式 end */
</style>
