/**
 * Created by Fu-Zhong on 2020/7/16.
 *
 * //const dd = require('dingtalk-jsapi')
 */
import * as dd from 'dingtalk-jsapi'
const plugin = {
  $global: null,
  install (Vue, options) {
    Vue.prototype.$dingtalk = dd
    Vue.dingtalk = dd
    this.$global = options.global
    // 重写Global中相关方法
    Object.assign(this.$global, this.ddApi)
  },
  $dingtalk: dd,
  // 钉钉扩展的公共方法
  ddApi: {
    // 钉钉jsApi调用签名
    async onWXReady (callback) {
      console.log("dingtalk onWXReady", this);
      console.log("dd.env.platform:" + dd.env.platform);
      if (dd.env.platform === "notInDingTalk"){
        this.alert("当前不在钉钉环境，无法使用该应用。");
        return false;
      }
      if (this.wxReady) {
        callback.call(this, dd);
        return
      }
      let that = this;
      let response = await that.getData(`${that.API.ddSign}`, {url: location.href.split("#")[0]});
      console.log("ddSign response:", response);
      if (!response || response.status !== "success"){
        console.log("API.ddSign error: 钉钉验证遇到点问题，获取JS鉴权信息失败！");
        that.alert("钉钉验证遇到点问题：获取JS鉴权信息失败！");
        return;
      }
      if (response && response.status === "success" ){
        let e = response.data;
        try {
          let ddConfig = {
            debug: true,
            agentId: e.agentId,
            corpId: e.corpId,
            timeStamp: e.timestamp,
            nonceStr: e.noncestr,
            signature: e.signature,
            jsApiList: that.jsAPIs_Ding
          };
          // 写store
          // this.ROOT.$store.commit('updateDingConfig', {corpId: e.coprId, agentId: e.agentId})
          that.ROOT.$store.commit({type: 'updateDingConfig', dingConfig: {corpId: e.corpId, agentId: e.agentId}});
          console.log("开始钉权鉴！");
          dd.config(ddConfig); //1.初始化钉钉的jssdk
          dd.error(err => {
            that.wxReady = false;
            alert('钉钉权鉴失败: ' + JSON.stringify(err));
          });
          console.log("钉权鉴完毕！");

          // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
          dd.ready(() => {
            that.wxReady = true;
            console.log("钉钉环境准备就绪。");
            if (callback){
              callback.call(that, dd);
            }
          });
        } catch (n) {
          console.log("success catched error: 钉钉验证遇到点问题！请重新进入该应用", n);
          that.alert("钉钉验证遇到点问题！请重新进入该应用");
        }
      }
    },
    // 客户端当前用户准备就绪后回调
    onDingUser(callback){
      let that = this;
      this.onWXReady(function() {
        console.log(that.ROOT.$store.state);
        // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
        dd.runtime.permission.requestAuthCode({
          corpId: that.ROOT.$store.state.vux.dingConfig.corpId,
          onSuccess: (info) => {
            console.log("钉钉钉钉免登授权成功!", info);
            that.ddAuthCallback(info, callback);
          },
          onFail: (err) => {
            console.log("钉钉验证遇到点问题！onFail获取JS权鉴出错!", err);
            that.alert('免登授权码获取失败!! ');
          }
        }).catch(err => {
          console.log(err + '');
          console.log("钉钉验证遇到点问题！获取JS鉴权出错!" + err);
          that.alert('免登授权码获取失败! ');
        });
        console.log("钉钉免登授权完毕！");
      });
    },
    // 钉钉code验证回调函数，设置当前用户信息
    async ddAuthCallback(info, callback) {
      console.log("ddAuthCallback start:", info);
      let rsp = await this.getData('/DTUtil/CheckAuthCode', {authCode: info.code});
      console.log("CheckAuthCode rsp:", rsp);
      if (!rsp || rsp.status !== "success"){
        console.log("API.ddSign error: 钉钉验证遇到点问题，获取JS鉴权信息失败！");
        this.alert("钉钉验证遇到点问题：获取用户名失败！"+ JSON.stringify(rsp));
        return;
      }
      let d = rsp.data;
      try {
        this.setProductUserUpdateTime(); // 用户变更时，将变更时间写入缓存中
        // // 更新用户信息,写store
        this.ROOT.$store.commit({type: 'updateUserInfo', userinfo: d});
      } catch (ee) {
        window.alert("error:" + JSON.stringify((ee)));
        return;
      }
      callback.call(this, dd)
    },
    // 关闭窗口
    closeWindow () {
      this.onWXReady(function () {
        dd.biz.navigation.close({
          onSuccess: function (result) {
            /*result结构
             {}
             */
            console.log("closeWindow", result);
          },
          onFail: function (err) {
            console.log(err);
            window.close();
          }
        })
      })
    },
    setNavTitle (title, success, fail) {
      this.onWXReady(function () {
        // 设置导航栏标题
        dd.biz.navigation.setTitle({
          title: title,  // 控制标题文本，空字符串表示显示默认文本
          onSuccess: function (result) {
            success.call(this, result);
          },
          onFail: function (err) {
            fail.call(this, err);
          }
        }).catch(err => {
          console.log(err + '')
        });
      });
    },
    scanQRCode (callback) {
      this.onWXReady(function () {
        dd.biz.util.scan({
          type: "all", // type 为 all、qrCode、barCode，默认是all。
          onSuccess: function(data) {
            //onSuccess将在扫码成功之后回调
            /* data结构
             { 'text': String}
             */
            let result = data.text; // 当needResult 为 1 时，扫码返回的结果
            if (callback){
              callback(result);
            }
          },
          onFail: function (err) {
            console.log("scanQECode fail", err);
          }
        });
      });
    },
    checkAuth2 (to, userinfo, callback) {
      // 检查微信登录情况
      // 如果不需要Auth页面
      let byglobal = this.checkGlobalUserInfo(userinfo);  // 全局用户信息是否发生变更
      console.log(this);
      // 钉钉认证用户身份
      if (to.meta && to.meta.anonymous) {
        callback();
        return;
      } else {
        // 需要Auth
        if (byglobal || !userinfo || userinfo.syslogin === false) {
          this.onDingUser(callback);
        } else {
          callback();
        }
      }
    },
    // 获取两个经纬度之间的距离
    getMapDistance: function(lat1, lng1, lat2, lng2) {
      let EARTH_RADIUS = 6378137.0;
      let radLat1 = this.getRad(lat1);
      let radLat2 = this.getRad(lat2);
      let a = radLat1 - radLat2;
      let b = this.getRad(lng1) - this.getRad(lng2);
      let s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2), 2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2), 2)));
      s = s * EARTH_RADIUS;
      s = Math.round(s*10000)/10000.0;
      return s;
    },
    /* 高德坐标 result 结构
     {
     longitude : Number,
     latitude : Number,
     accuracy : Number,
     address : String,
     province : String,
     city : String,
     district : String,
     road : String,
     netType : String,
     operatorType : String,
     errorMessage : String,
     errorCode : Number,
     isWifiEnabled : Boolean,
     isGpsEnabled : Boolean,
     isFromMock : Boolean,
     provider : wifi|lbs|gps,
     isMobileEnabled : Boolean
     }
     */
    // 地图定位
    getLocation: function (success, err) {
      console.log('dingtalk onWXReady getLocation start');
      this.onWXReady(function(){
        console.log("getLocation start");
        dd.device.geolocation.get({
          targetAccuracy: Number,
          coordinate: 1,  // 1：获取高德坐标； 0：获取标准坐标；推荐使用高德坐标；标准坐标没有 address 字段
          withReGeocode: true,  // 是否需要带有逆地理编码信息；该功能需要网络请求，请根据自己的业务场景使用
          useCache: false, // 默认是true，如果需要频繁获取地理位置，请设置false
          onSuccess: function(a) {
            console.log(a);
            console.log("getLocation error: a.latitude=" + a.latitude + ",a.longitude=" + a.longitude + ",a.accuracy=" + a.accuracy);
            let n = a.latitude; let o = a.longitude; let i = a.accuracy || 20;
            if (void 0 === n || void 0 === o ) {
              console.log("getLocation error:phase=1,status=null");
              if (err) {
                err.call(this, { phase: 1, status: null });
              }
            } else {
              success.call(this, {address: a.address, lat: n, lng: o, accuracy: i});
            }
          },
          onFail: function(t) {
            console.log("getLocation fail: ");
            if (err) {
              err.call(this, { phase: 1, status: null });
            }
          }
        });
      });
    },
    // 消息推送
    pushNews (message, callback) {
      let that = this;
      this.onWXReady(function () {
        dd.biz.chat.pickConversation({
          // corpId: 'ding48f5304482b52187bc961a6cb783455b',
          corpId: that.ROOT.$store.state.vux.dingConfig.corpId,
          isConfirm: true, //是否弹出确认窗口，默认为true
          onSuccess: function(res) {
            that.sendMessage(message, res, callback)
          }
          //, 暂时无用
          //onFail: function (err) {
          //}
        });
      });
    },
    // 发送消息
    async sendMessage(message, res, callback) {
      var req = {
        "cid": res.cid,
        "content": message
      }
      // let d = await this.getData('/api/DTFunc/SendMsgToUser', {
      //   jsonData: JSON.stringify(req)
      // });
      let d = await this.getData('/ComApi/SendDingMsgToUser', {
        jsonData: JSON.stringify(req)
      });
      if (d.status && d.status === "error") {
        this.alert('温馨提示', d.msg);
      } else {
        this.alert('温馨提示', '发送成功', function () {
          window.history.go(-1)
        });
      }
    }
  }
}

export default plugin
export const install = plugin.install
