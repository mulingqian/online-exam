/**
 * Created by Fu-Zhong on 2017/5/16.
 */
import Vue from 'vue'
import {WechatPlugin} from 'vux'
Vue.use(WechatPlugin)
import { go, getUrl } from 'vux/src/libs/router'

const wx = Vue.wechat
// 常用配置

let developing = true  // 开发中，页面不经过微信认证
let appID = null
let userinfo = {}

// 通用方法
export default {
  developing,
  appID,
  userinfo,
  go (url) {
    go(url, Vue.$router)
  },
  getUrl (url) {
    getUrl(url, Vue.$router)
  },
  // 关闭窗口
  closeWindow: () => {
    if (wx !== undefined && wx !== null) {
      wx.closeWindow()
    } else {
      window.close()
    }
  }

}
