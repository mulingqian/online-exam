import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import MyRouter from './utils/router.js'

Vue.use(VueRouter)
import App from './App'
import Vuex from 'vuex'
// import VueResource from 'vue-resource'
Vue.use(Vuex)
// Vue.use(VueResource)
import global_ from './components/Global'
Vue.prototype.QD = global_
var checkAccess = global_.checkAccess

// import { checkAccess } from './utils/api.js'
// import vuexI18n from 'vuex-i18n'

require('es6-promise').polyfill()
// import { LocalePlugin, DevicePlugin, ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin, WechatPlugin, AjaxPlugin } from 'vux'
//
// Vue.use(DevicePlugin)
// Vue.use(ToastPlugin)
// Vue.use(AlertPlugin)
// Vue.use(ConfirmPlugin)
// Vue.use(LoadingPlugin)
// Vue.use(WechatPlugin)
// Vue.use(AjaxPlugin)
// Vue.use(LocalePlugin)
import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)

// 判断是否从微信认证返回,若是，清空用户缓存，重新检查授权信息
let redirByWXOauth = global_.getQueryString("redir_by_wxoauth");
console.log("redir_by_wxoauth", redirByWXOauth);
if (redirByWXOauth === "1"){
  localStorage[`${global_.GLOBAL_KEY}_userinfo`] = null;
  localStorage[`${global_.PRODUCT_KEY}_userinfo`] = null;
 // console.log('check wx login ,jump to ' + e.redir)
  window.location.replace( window.location.href.replace('redir_by_wxoauth=1', ''));
}

let userinfo = Vue.prototype.QD.getLocalUserinfo() // store.state.vux.userinfo
if (typeof userinfo === 'string') {
  console.log(userinfo)
  userinfo = null
  localStorage[`${global_.PRODUCT_KEY}_userinfo`] = null
}
if (global_.AcrossCredentials) {
  Vue.http.defaults.withCredentials = true  // 跨域Ajax带Cookie
}
// 如果SSO，设置当前登录信息不本地缓存
global_.prepareSSO(userinfo);

// // 设置ajax请求权限错误统一处理
// Vue.http.interceptors.push(function (request, next) {
//   // continue to next interceptor
//   next(function (response) {
//     // modify response
//     console.log(response);
//     if (response.status === 499) {
//
//     }
//   });
// });

// http response 拦截器
Vue.http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      console.log(JSON.stringify(error));
      switch (error.response.status) {
        case 499:
          // alert(499);
          localStorage[`${global_.PRODUCT_KEY}_userinfo`] = null
          global_.setCookie(global_.tokenCookieName, "")
          Vue.http.defaults.headers.post['apitoken'] = null
          userinfo = null
          if (error.response.statusText && error.response.statusText.length > 0) {
            window.location = error.response.statusText;
          }
          break;
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          // store.commit(types.LOGOUT);
          router.replace('/')
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });
Vue.http.defaults.headers.post['isajax'] = "1";

if (userinfo !== null && userinfo.token !== null) {
  global_.setCookie(global_.tokenCookieName, userinfo.token)
  Vue.http.defaults.headers.post['apitoken'] = userinfo.token
  // 记录appId
  global_.appId = userinfo.appId
}
console.log(userinfo)

// 记录当前学期信息
// global_.getSmstLst()

/**
* you can add your module here
*/
let store = new Vuex.Store({
  modules: {
    // i18n: vuexI18n.store
  }
})

store.registerModule('vux', {
  state: {
  //  userType: 5,  //家长
    userinfo: userinfo,
    demoScrollTop: 0,
    scrrollPage: [
      {page: 'adminMorSelect', scroll: 0},
      {page: 'searchPage', scroll: 0},
      {page: 'stuLstByMoral', scroll: 0}
    ], // 滚动页面高度
    scrollTopAllMenu: 0, // ‘全部应用’滚动的高度
    isLoading: false,
    direction: 'forward',
    modalId: null,
    jSDM: null, // 教师代码 - 巡堂
    msgCentreSumNum: '', // 待办和我的消息未读消息总数,badge 的属性是string
    qrcodescankey: '', // 绑定后的扫码登录，路径的参数值
    loginByScanPc: '', // 教务PC端扫码登录
    onlineStatus: true, // 网络是否在线
    dingConfig: null
  },
  mutations: {
    // 用户信息
    updateUserInfo (state, payload) {
      console.log(`before mutations Userinfo `)
      console.log(payload.userinfo)
      state.userinfo = payload.userinfo
      if (payload.userinfo) {
        userinfo = payload.userinfo
        //添加Global Token
        let gUserinfo = {"wxlogin": userinfo.wxlogin,
          "syslogin": userinfo.syslogin,
          "appId": userinfo.appId,
          "wxuid": userinfo.wxuid,
          "openid": userinfo.openid,
          "name": userinfo.name,
          "sex": userinfo.sex,
          "profileimg": userinfo.profileimg,
          "usertype": userinfo.usertype,
          "userid": userinfo.userid,
          "token": userinfo.token};
        localStorage[`${global_.GLOBAL_KEY}_userinfo`] = JSON.stringify(gUserinfo);

        localStorage[`${global_.PRODUCT_KEY}_userinfo`] = JSON.stringify(payload.userinfo);
        global_.setCookie(global_.tokenCookieName, payload.userinfo.token);
        Vue.http.defaults.headers.post['apitoken'] = payload.userinfo.token;
        global_.appId = userinfo.appId
      } else {
        localStorage[`${global_.GLOBAL_KEY}_userinfo`] = null;
        localStorage[`${global_.PRODUCT_KEY}_userinfo`] = null;
        global_.setCookie(global_.tokenCookieName, "");
        Vue.http.defaults.headers.post['apitoken'] = null;
        userinfo = null
      }
      global_.setProductUserUpdateTime();
      console.log(`after mutations Userinfo `)
      console.log(payload.userinfo)
    },
    updateAllMenuPosition(state, payload) { // 教师端的全部应用记录滚动高度
      state.scrollTopAllMenu = payload.top
    },
    updateScrrollPage(state, payload) { // 记录滚动高度
      console.log('记录滚动高度', payload)
      for (let i=0; i< state.scrrollPage.length; i++){
        let item = state.scrrollPage[i]
        if (item.page === payload.top.page) {
          item.scroll = payload.top.scrollTop
        }
      }
      console.log('记录滚动高度之后', state.scrrollPage)
    },
    updateDemoPosition (state, payload) {
      state.demoScrollTop = payload.top
    },
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection (state, payload) {
      state.direction = payload.direction
    },
    updateModalId (state, payload) {
      state.modalId = payload.modalId
    },
    updateJSDM (state, payload) {
      state.jSDM = payload.jSDM
    },
    messageCentreSum (state, payload) {
      state.msgCentreSumNum = payload.msgCentreSumNum
    },
    updateQrcodescankey (state, payload) {
      state.qrcodescankey = payload.qrcodescankey
    },
    updateLoginByScanPc (state, payload) {
      state.loginByScanPc = payload.loginByScanPc
    },
    updateOnlineStatus (state, payload) { // 网络是否在线
      state.onlineStatus = payload.onlineStatus
    },
    updateDingConfig (state, payload) {
      state.dingConfig = payload.dingConfig
    }
  },
  actions: {
    // 更新用户信息
    updateUserInfo ({commit}, userinfo) {
      console.log(`before update Userinfo `);
      console.log(localStorage[`${global_.PRODUCT_KEY}_userinfo`]);
      console.log(userinfo);

      // localStorage['userinfo'] = userinfo
      commit({type: 'updateUserInfo', userinfo: userinfo});
      console.log(`after update Userinfo `);
      console.log(localStorage[`${global_.PRODUCT_KEY}_userinfo`]);
      console.log(userinfo);
    },
    updateLoadingStatus ({commit}, isloading) {
      commit({type: 'updateLoadingStatus', isLoading: isloading})
    },
    updateAllMenuPosition ({commit}, top) { // ‘全部应用’滚动位置
      commit({type: 'updateAllMenuPosition', top: top})
    },
    updateScrrollPage ({commit}, top) { // ‘全部应用’滚动位置
      console.log(top, 'updateScrrollPageupdadateScrrollPage')
      commit({type: 'updateScrrollPage', top: top})
    },
    updateDemoPosition ({commit}, top) {
      commit({type: 'updateDemoPosition', top: top})
    },
    updateModalId ({commit}, modalId) {
      commit({type: 'updateModalId', modalId: modalId})
    },
    updateJSDM ({commit}, jSDM) {
      commit({type: 'updateJSDM', jSDM: jSDM})
    },
    messageCentreSum ({commit}, msgCentreSumNum) {
      commit({type: 'messageCentreSum', msgCentreSumNum: msgCentreSumNum})
    },
    updateQrcodescankey ({commit}, qrcodescankey) {
      commit({type: 'updateQrcodescankey', qrcodescankey: qrcodescankey})
    },
    updateLoginByScanPc ({commit}, loginByScanPc) {
      commit({type: 'updateLoginByScanPc', loginByScanPc: loginByScanPc})
    },
    updateOnlineStatus ({commit}, onlineStatus) { // 网络是否在线
      commit({type: 'updateOnlineStatus', onlineStatus: onlineStatus})
    },
    updateDingConfig ({commit}, dingConfig) { // 钉钉配置信息
      commit({type: 'updateDingConfig', dingConfig: dingConfig})
    }
  }
})
const FastClick = require('fastclick')
FastClick.attach(document.body)

const router = MyRouter

sync(store, router)
// // 记录当前url请求参数
if (location.search !== '') {
  let codeKey = global_.getQueryString("qrcodescankey");
  if (codeKey) {
    console.log("qrcodescankey", codeKey);
    store.commit({type: 'updateQrcodescankey', qrcodescankey: codeKey});
  }
  let codeKey2 = global_.getQueryString("LoginByScanPc");
  console.log("LoginByScanPc", codeKey2);
  if (codeKey2){
    store.commit({type: 'updateLoginByScanPc', loginByScanPc: codeKey2});
  }
  // 巡堂
  let jsdm = global_.getQueryString("jsdm");
  store.commit({type: 'updateJSDM', jSDM: jsdm});
  // 产品版本号
  let versionNum = global_.getQueryString("?v");
  if (versionNum) {
    console.log("versionNum", versionNum);
    global_.productVersionNum = versionNum; // 得到路径地址中的版本号 productVersionNum 赋值。。。。。
  }
  // 微信推送消息的 guid , 值不可能为 0
  let guid = global_.getQueryString("id");
  if (guid) {
    global_.wxPushMsgGuid = guid;
  }
} else {
  // router.push({name: 'error', params: {message: '请求参数错误！'}})
}

// simple history management
const history = window.sessionStorage;
history.clear();
let historyCount = history.getItem('count') * 1 || 0;
history.setItem('/', 0);

const checkAuth2 = (to, callback) => {
  // 检查微信登录情况
  // 如果不需要Auth页面
  let byglobal = global_.checkGlobalUserInfo(userinfo);  // 全局用户信息是否发生变更
  console.log('....mainjs checkAuth2');
  if (to.meta && to.meta.anonymous) {
    // 没有userinfo，或者Global用户信息不一致，则检查微信wxAccess
    if (byglobal || !userinfo || userinfo.wxlogin === false) {
      wxAccess(byglobal, callback)
    } else {
      callback();
    }
  } else {
    // 需要Auth
    if (byglobal || !userinfo || userinfo.syslogin === false) {
      sysAccess(byglobal, callback)
    } else {
      callback();
    }
  }
};

// 判断wxAccess
async function wxAccess (byglobal, callback) {
  console.log(`wxAccess: curernt userinfo ${userinfo}`);
  if (!byglobal && userinfo && userinfo.wxlogin === true) {
    return
  }
  Vue.http.defaults.headers.post['byglobal'] = (byglobal ? "1" : ""); // byglobal=="1"表示系统后台需要重新清理用户信息Session
  console.log("byglobal header:", Vue.http.defaults.headers.post['byglobal']);
  let e = await checkAccess();
  Vue.http.defaults.headers.post['byglobal'] = "";
  console.log(e);
  if (!e || e.appId === null) {
    router.replace({name: 'error', params: {message: '找不到指定的应用！'}});
    return
  }
  if (e.wxlogin === false) {
    if (e.redir) {
      console.log('check wx login ,jump to ' + e.redir)
      window.location.href = e.redir
    } else {
      router.push({name: 'error', params: {message: '必须在微信中打开该应用！'}});
      return;
    }
  } else {
    console.log('wxAccess valid!');
    // localStorage['userinfo'] = JSON.stringify(e)
    store.commit({type: 'updateUserInfo', userinfo: e});
    callback();
    // store.commit({type: 'updateUserInfo', userinfo: e})
    // valid = true
  }
}

// 判断绑定用户Access
async function sysAccess (byglobal, callback) {
  console.log(`sysAccess: curernt userinfo ${userinfo}`)
  if (!byglobal && userinfo && userinfo.syslogin === true) {
    return
  }
  console.log("byglobal:", byglobal);
  Vue.http.defaults.headers.post['byglobal'] = (byglobal ? "1" : ""); // byglobal=="1"表示系统后台需要重新清理用户信息Session
  console.log("byglobal header:", Vue.http.defaults.headers.post['byglobal']);
  let e = await checkAccess();
  Vue.http.defaults.headers.post['byglobal'] = "";
  console.log(e)
  if (!e || e.appId === null) {
    router.push({name: 'error', params: {message: '找不到指定的应用！'}})
    return
  }
  if (e.wxlogin === false) {
    if (e.redir) {
      console.log('check sys login ,jump to ' + e.redir)
      window.location.replace(e.redir)
      return
    } else {
      router.push({name: 'error', params: {message: '必须在微信中打开该应用！'}})
      return
    }
  } else if (e.syslogin === false) {
    if (e.redir) {
      console.log("check syslogin ,jump to " + e.redir)
      window.location.replace(e.redir)
    } else {
      router.push({name: 'error', params: {message: '必须在微信中打开该应用！'}})
      return
    }
  } else {
    console.log('Access valid!')
    // localStorage['userinfo'] = JSON.stringify(e)
    store.commit({type: 'updateUserInfo', userinfo: e});
    callback();
    // valid = true
  }
}
// 每次页面跳转执行
router.beforeEach(function (to, from, next) {
  console.log(`main.js beforeEach called from:${from.path}, to:${to.path}`);
  store.commit('updateLoadingStatus', {isLoading: true});
  const history = window.sessionStorage;
  let historyCount = 0;
  // 钉钉认证用户身份
  if (global_.EndClientType === "DING") {
    if (to.path === '/' ) {
      history.clear();
      doNext(to, from, next, history);
    } else if (to.path === '/userbind') {
      next({path: '/'});
      return;
    } else {
      // 检查权限
      global_.checkAuth2(to, userinfo, () => { doNext(to, from, next, history, historyCount); });
    }
  } else {
    if (to.path === '/userbind') {
      history.clear();
      historyCount = history.getItem('count') * 1 || 0;
      history.setItem('/', 0)
    }
    // 检查权限
    checkAuth2(to, () => { doNext(to, from, next, history, historyCount); });

    // doNext(to, from, next, history, historyCount);
  }
});

let doNext = (to, from, next, history, historyCount) => {
  const toIndex = history.getItem(to.path);
  const fromIndex = history.getItem(from.path);

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      store.commit('updateDirection', {direction: 'reverse'})
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1];
    window.location.href = `http${url}`
  } else {
    next()
  }
}

/* 在跳转之后判断 */
router.afterEach(function (to) {
  console.log('main.js afterEach');
  store.commit('updateLoadingStatus', {isLoading: false});
});

global_.ROOT = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')

// const appMethods = App.methods
// global_.alert = function (title, msg, onHide) {
//   appMethods.alert(title, msg, onHide)
// }
