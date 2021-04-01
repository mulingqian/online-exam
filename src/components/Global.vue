<script>
  /**
   * Created by Fu-Zhong on 2017/5/16.
   */
  import Vue from 'vue'
  // import {AjaxPlugin, WechatPlugin} from 'vux'
  import AjaxPlugin from 'vux/src/plugins/ajax/index.js'
  import WechatPlugin from 'vux/src/plugins/wechat/index.js'
  Vue.use(WechatPlugin);
  Vue.use(AjaxPlugin);
  import { go, getUrl } from 'vux/src/libs/router'

  import { Toast } from 'vant'
  Vue.use(Toast)
//  localStorage["userinfo"] = null
  const CFG = {
//    URLBASE: 'http://jwzz.simc.cn/WXSchool/dist',
//    APIHOST: 'http://jwzz.simc.cn/WXSchool',
    EndClientType: window.Global_CONFIG.EndClientType ? window.Global_CONFIG.EndClientType : "WX",  // 客户端类型 值为 WX/APP/DING     sfz 2020
    URLBASE: window.Global_CONFIG.URLBASE,
    APIHOST: window.Global_CONFIG.APIHOST,
    OAHOST: window.Global_CONFIG.OAHOST,
    DINGSCHOOL: window.Global_CONFIG.DINGSCHOOL,
    SSOType: window.Global_CONFIG.SSOType !== undefined && window.Global_CONFIG.SSOType ? window.Global_CONFIG.SSOType : "", // SSO类型，cas代表CAS, 默认空
    UnreadMsg_Interval: window.Global_CONFIG.UnreadMsg_Interval !== undefined ? window.Global_CONFIG.UnreadMsg_Interval : 60000, // 检查未读消息时间间隔, 0代表不检查， 默认1分钟
    Always_CheckAuth: window.Always_CheckAuth !== false,  // 每次跳转都重新授权,默认true
    IS_GLOBAL_USER: window.Global_CONFIG.IS_GLOBAL_USER !== undefined && window.Global_CONFIG.IS_GLOBAL_USER ? window.Global_CONFIG.IS_GLOBAL_USER : true,  // 是否检查全局用户
    URLSCHEMA: window.Global_CONFIG.URLBASE.substr(0, 5) === 'https' ? 'https://' : 'http://',  // 判断 config.js 中的 URLBASE 地址是 http 还是 https

    PRODUCT_KEY: 'WXSchoolApp_p' + window.Global_CONFIG.schoolName,    // 产品标识，可用于区别不同产品的缓存key WXSchoolApp_p_none WXSchoolApp_p
    GLOBAL_KEY: "QD_GLOBAL" + window.Global_CONFIG.schoolName, // QD_GLOBAL_none
    DEVELOPING: true,  // 开发中，页面不经过微信认证
    AcrossCredentials: false,   // 是否添加跨站请求凭证
    defaultProfileImg: require("../assets/images/default_img.gif"),
    schoolName: window.Global_CONFIG.schoolName,
    StudentPlat: window.Global_CONFIG.StudentPlat,
    school_Introduction: window.Global_CONFIG.school_Introduction !== undefined && window.Global_CONFIG.school_Introduction !== null ? window.Global_CONFIG.school_Introduction : '', // 学校概况
    homeModules: window.Global_CONFIG.homeModules !== undefined && window.Global_CONFIG.homeModules !== null ? window.Global_CONFIG.homeModules : null, // home 菜单的设置
    productName: window.Global_CONFIG.productName !== undefined && window.Global_CONFIG.productName !== null ? window.Global_CONFIG.productName : '微信校园',
    productVersionNum: window.Global_CONFIG.productVersionNum !== undefined && window.Global_CONFIG.productVersionNum ? window.Global_CONFIG.productVersionNum : '20210110001', // 产品的版本号，值为路径中的v值
    isOpenSchoolCard: window.Global_CONFIG.isOpenSchoolCard,
    showNewTeachingLog: window.Global_CONFIG.showNewTeachingLog,
    showPayrollTotal: window.Global_CONFIG.showPayrollTotal,
    openInterfaceRegPs: window.Global_CONFIG.openInterfaceRegPs !== undefined && window.Global_CONFIG.openInterfaceRegPs !== null ? window.Global_CONFIG.openInterfaceRegPs : '', // 接口调用前 ps 正则表达式验证 /</， 不验证 '', null
    perviewFilePlat: window.Global_CONFIG.perviewFilePlat !== undefined && window.Global_CONFIG.perviewFilePlat ? window.Global_CONFIG.perviewFilePlat : '', // 文件预览Java 后台地址
    previewFileDemoLst: window.Global_CONFIG.previewFileDemoLst !== undefined && window.Global_CONFIG.previewFileDemoLst ? window.Global_CONFIG.previewFileDemoLst : [], // 文件预览测试
    isAllowTheSameDayWriteLog: window.Global_CONFIG.isAllowTheSameDayWriteLog !== undefined && window.Global_CONFIG.isAllowTheSameDayWriteLog !== null ? window.Global_CONFIG.isAllowTheSameDayWriteLog
      : true,  // 是否允许在除当天之外登记教学日志(不能大于今天日期)，系统中默认 true
    stuAssessTeaIsAllowCheckXQ: window.Global_CONFIG.stuAssessTeaIsAllowCheckXQ !== undefined && window.Global_CONFIG.stuAssessTeaIsAllowCheckXQ !== null ? window.Global_CONFIG.stuAssessTeaIsAllowCheckXQ
      : true,  // 学生评教老师页面是否可以选择学期， 默认为true可以选择
    stuAssessTeaIsWriteRelativeMerits: window.Global_CONFIG.stuAssessTeaIsWriteRelativeMerits !== undefined && window.Global_CONFIG.stuAssessTeaIsWriteRelativeMerits !== null ? window.Global_CONFIG.stuAssessTeaIsWriteRelativeMerits
      : false,  // 学生评教老师页面是否可以填写任课老师的优缺点， 默认为false可以填写评教评语
    tokenCookieName: 'wx_openauthname',
    jsAPIs: ["getLocation", "openLocation", "closeWindow", "scanQRCode", "pushNews"],
    jsAPIs_Ding: [
      'runtime.info',
      'biz.contact.choose',
      'device.notification.confirm',
      'device.notification.alert',
      'device.notification.prompt',
      'biz.ding.post',
      'biz.util.openLink',
      'device.geolocation.get',
      'biz.chat.pickConversation'
    ],
    scoreMap: ["A", "B", "C", "D", "E", "F", "优", "优秀", "良好", "良", "中", "合格", "及格", "不及格", "不合格", "差"],
    imgTypeLst: ['.bmp', '.jpg', '.png', '.gif', '.jpeg'], // bmp,jpg,png,gif,jpeg -图片类型-公文流转信息
    otherPageData: null, // 保存其他页面的数据
    currPageData: null, // 保存当前页面的数据
    brotherPageData: null, // 兄弟页面数据-平级
    currPgToOtherPg: null, // 当前页面数据传值到其他页面
    parentPageData: null, // 父级页面的数据-当前页面为详情页面或修改页面,父级-list
    // byWeChat: false,  // 是否调用微信授权接口
    resubmitEval: false, // 是否可以反复测评,false只能提交一次，true 可以反复测评
    compressSize: window.Global_CONFIG.compressSize !== undefined && window.Global_CONFIG.compressSize !== null ? window.Global_CONFIG.compressSize : 300, // 图片压缩后的大小 kb
    uploadSize: window.Global_CONFIG.uploadSize !== undefined && window.Global_CONFIG.uploadSize !== null ? window.Global_CONFIG.uploadSize : 1, // 附件上传不可以超过 1m, 单位 M
    teacherApplicationNum: window.Global_CONFIG.teacherApplicationNum !== undefined && window.Global_CONFIG.teacherApplicationNum !== null ? window.Global_CONFIG.teacherApplicationNum : 9, // 规定教师端‘我的应用’可以添加多少个
    studentApplicationNum: window.Global_CONFIG.studentApplicationNum !== undefined && window.Global_CONFIG.studentApplicationNum !== null ? window.Global_CONFIG.studentApplicationNum : 9, // 规定学生端‘我的应用’可以添加多少个
    showStuNoticeAnnounce: window.Global_CONFIG.showStuNoticeAnnounce !== undefined && window.Global_CONFIG.showStuNoticeAnnounce !== null ? window.Global_CONFIG.showStuNoticeAnnounce : 1, //  学生端的通知公告菜单的内容默认0不显示,1显示内容
    teachingLogCanRepeatRecord: window.Global_CONFIG.teachingLogCanRepeatRecord !== undefined && window.Global_CONFIG.teachingLogCanRepeatRecord !== null ? window.Global_CONFIG.teachingLogCanRepeatRecord : false, // 教学日志是否可以重复提交
    allowLookCourseOtherTeaDetail: window.Global_CONFIG.allowLookCourseOtherTeaDetail !== undefined && window.Global_CONFIG.allowLookCourseOtherTeaDetail !== null ? window.Global_CONFIG.allowLookCourseOtherTeaDetail : false, // 班级课表、教室课表中点击教学老师名称，是否允许看此老师的课表
    stuScoreLstShowXF: window.Global_CONFIG.stuScoreLstShowXF !== undefined && window.Global_CONFIG.stuScoreLstShowXF !== null ? window.Global_CONFIG.stuScoreLstShowXF : true,  // ‘我的成绩’是否显示科目的学分，系统中默认 true
    guideDialogInfo: window.Global_CONFIG.guideDialogInfo !== undefined && window.Global_CONFIG.guideDialogInfo !== null ? window.Global_CONFIG.guideDialogInfo : null, // 用户信息保护指引
    teachingLogTeaTitleLst: window.Global_CONFIG.teachingLogTeaTitleLst !== undefined && window.Global_CONFIG.teachingLogTeaTitleLst !== null ? window.Global_CONFIG.teachingLogTeaTitleLst : ['学生考勤', '课堂纪律', '老师打分'],
    teachingLogStuTitleLst: window.Global_CONFIG.teachingLogStuTitleLst !== undefined && window.Global_CONFIG.teachingLogStuTitleLst !== null ? window.Global_CONFIG.teachingLogStuTitleLst : ['学生考勤', '学生打分'],
    API: {
      checkAccess: '/School/ClientUtil/CheckAccess',
      checkSSOAccess: '/WXUtil/CheckSSOAccess',
      userbind: '/School/ClientUserBind/DoApiUserBind',
      unbind: '/School/ClientUserBind/UnBind',
      smst: '/School/CommonSource/SmstList',
      weeklst: '/School/CommonSource/WeekList',
      wxSign: '/WXSign/GetSign',
      ddSign: '/DTSign/GetSign'
    }
  }
  // 加载百度地图脚本
  document.write('<script type="text/javascript" src="' + CFG.URLSCHEMA + 'api.map.baidu.com/api?v=2.0&ak=e6Tv5HskogWNNZNod7w5jrGhPRvGzvdS" ></' + 'script>');

  const wx = Vue.wechat
  const qdglobal = {
    // 常用配置
    EndClientType: CFG.EndClientType,
    URLBASE: CFG.URLBASE,
    APIHOST: CFG.APIHOST,
    OAHOST: CFG.OAHOST,
    DINGSCHOOL: CFG.DINGSCHOOL,
    SSOType: CFG.SSOType,
    UnreadMsg_Interval: CFG.UnreadMsg_Interval,
    Always_CheckAuth: CFG.Always_CheckAuth,
    URLSCHEMA: CFG.URLSCHEMA,
    PRODUCT_KEY: CFG.PRODUCT_KEY,
    GLOBAL_KEY: CFG.GLOBAL_KEY,
    DEVELOPING: CFG.DEVELOPING,
    IS_GLOBAL_USER: CFG.IS_GLOBAL_USER,
    defaultProfileImg: CFG.defaultProfileImg,
    schoolName: CFG.schoolName,
    StudentPlat: CFG.StudentPlat,
    school_Introduction: CFG.school_Introduction,
    homeModules: CFG.homeModules,
    productName: CFG.productName,
    productVersionNum: CFG.productVersionNum,
    scoreMap: CFG.scoreMap,
    imgTypeLst: CFG.imgTypeLst,
    otherPageData: CFG.otherPageData,
    currPageData: CFG.currPageData,
    brotherPageData: CFG.brotherPageData,
    currPgToOtherPg: CFG.currPgToOtherPg,
    parentPageData: CFG.parentPageData,
    resubmitEval: CFG.resubmitEval, // 是否可以反复测评
    studentApplicationNum: CFG.studentApplicationNum, //  规定学生端‘我的应用’可以添加多少个
    showStuNoticeAnnounce: CFG.showStuNoticeAnnounce, // 学生端的通知公告菜单的内容默认0不显示,1显示内容
    teachingLogCanRepeatRecord: CFG.teachingLogCanRepeatRecord,
    allowLookCourseOtherTeaDetail: CFG.allowLookCourseOtherTeaDetail,
    stuScoreLstShowXF: CFG.stuScoreLstShowXF,
    isAllowTheSameDayWriteLog: CFG.isAllowTheSameDayWriteLog,
    stuAssessTeaIsAllowCheckXQ: CFG.stuAssessTeaIsAllowCheckXQ,
    stuAssessTeaIsWriteRelativeMerits: CFG.stuAssessTeaIsWriteRelativeMerits,
    guideDialogInfo: CFG.guideDialogInfo,
    teachingLogTeaTitleLst: CFG.teachingLogTeaTitleLst,
    teachingLogStuTitleLst: CFG.teachingLogStuTitleLst,
    tokenCookieName: `${CFG.PRODUCT_KEY}${CFG.tokenCookieName}`,
    openInterfaceRegPs: CFG.openInterfaceRegPs,
    perviewFilePlat: CFG.perviewFilePlat,
    previewFileDemoLst: CFG.previewFileDemoLst,
    AcrossCredentials: CFG.AcrossCredentials,
    jsAPIs_Ding: CFG.jsAPIs_Ding,
    API: CFG.API,
    teacherApplicationNum: CFG.teacherApplicationNum, // 规定教师端'我的应用’可以添加多少个
    compressSize: CFG.compressSize, // 图片压缩后的大小 kb
    uploadSize: CFG.uploadSize,
    isOpenSchoolCard: CFG.isOpenSchoolCard,
    showNewTeachingLog: CFG.showNewTeachingLog,
    showPayrollTotal: CFG.showPayrollTotal,
    ROOT: null,
    xqList: [],
    currentXQ: null,
    xndList: [], // 学年度
    currentXnd: null, // 学年度
    showAlert: false,
    wxReady: false,
    appId: '', // 通过userinfo设置
    appLst_currPageData: null, // appLst.vue 页面中保存的页面信息 -- 防止和菜单中的QD.parentPageData等产生冲突
    application_currPageData: null, // 学生用户或教师用户‘全部应用’页面保存的信息
    myPageData: null, // 我的页面 保存的信息
    classInfoInCourseClass: null, // 班级课表菜单：记录之前选中的班级信息包括用户信息
    roomInfoInClassRoom: null, // 教室课表菜单：记录之前选中的教室信息包括对应的用户信息
    wxPushMsgGuid: 0, // 微信推送消息的 guid
    applyStatusLst: [{ // 状态值列表
      label: '全部',
      type: -1
    }, {
      label: '未提交',
      type: 0
    }, {
      label: '审核中',
      type: 1
    }, {
      label: '审核通过',
      type: 2
    }, {
      label: '被退回',
      type: 4
    }], // 申请列表中状态值列表
    auditStatusLst: [{ // 状态值列表 // UserState=case UserState when 0 then '未审批' when 1 then '退回' when 3 then '通过' end
      label: '全部',
      type: -1
    }, {
      label: '未审批',
      type: 0
    }, {
      label: '退回',
      type: 1
    }, {
      label: '审核通过',
      type: 3
    }], // oa审核列表中的状态值列表
    auditStateData: [{ // 状态值列表  WHEN 0 THEN '未激活' WHEN 1 THEN '已激活' WHEN 2 THEN '已通过' WHEN 4 THEN '已退回' - 教室借用
      label: '全部',
      type: -1
    }, {
      label: '未激活',
      type: 0
    }, {
      label: '未审批',
      type: 1
    }, {
      label: '已通过',
      type: 2
    }, {
      label: '已退回',
      type: 4
    }],
    onAlertHide: () => {},
    // 通用方法
    getLocalUserinfo () {
      console.log("getLocalUserinfo")
      if (localStorage[`${CFG.PRODUCT_KEY}_userinfo`] && localStorage[`${CFG.PRODUCT_KEY}_userinfo`] !== 'null') {
        console.log(localStorage[`${CFG.PRODUCT_KEY}_userinfo`])
        return JSON.parse(localStorage[`${CFG.PRODUCT_KEY}_userinfo`])
      }
      return null
    },
    setLocalUserinfo (userinfo) {
      console.log("setLocalUserinfo");
      if (userinfo){
        localStorage[`${CFG.PRODUCT_KEY}_userinfo`] = JSON.stringify(userinfo);
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
        localStorage[`${CFG.GLOBAL_KEY}_userinfo`] = JSON.stringify(gUserinfo);
        this.setCookie(this.tokenCookieName, userinfo.token);
        Vue.http.defaults.headers.post['apitoken'] = userinfo.token;
        this.appId = userinfo.appId
      } else {
        localStorage[`${CFG.PRODUCT_KEY}_userinfo`] = null;
        localStorage[`${CFG.GLOBAL_KEY}_userinfo`] = null;
        Vue.http.defaults.headers.post['apitoken'] = null;
        this.setCookie(this.tokenCookieName, "");
      }
      this.setProductUserUpdateTime();
      // Vue.prototype.$store.commit('updateMessage', info)
    },
    // 通用方法获取Global UserInfo
    getGLOBALUserinfo () {
      console.log("getGLOBALUserinfo")
      if (localStorage[`${CFG.GLOBAL_KEY}_userinfo`] && localStorage[`${CFG.GLOBAL_KEY}_userinfo`] !== 'null') {
        console.log(localStorage[`${CFG.GLOBAL_KEY}_userinfo`])
        return JSON.parse(localStorage[`${CFG.GLOBAL_KEY}_userinfo`])
      }
      return null
    },
    // 用户变更时，将变更时间写入缓存中
    setProductUserUpdateTime () {
      let curTime = this.getDateOrTime('yyyy-mm-dd hh:mm:ss');
      localStorage[`${CFG.PRODUCT_KEY}_update_wxschoolapp`] = curTime;
      localStorage[`${CFG.PRODUCT_KEY}_update_wxpublic`] = curTime
    },
    // 通用方法比较相同产品下系统用户 与 当前系统用户的用户变更时间是否相等
    getProductUserUpdateTime () {
      console.log("get global userinfo update time ");
      let schoolappUpdate = ''; // 微校园系统用户变更时间
      let publicUpdate = ''; // 移动端公用的系统用户变更时间
      if (localStorage[`${CFG.PRODUCT_KEY}_update_wxschoolapp`]) {
        schoolappUpdate = localStorage[`${CFG.PRODUCT_KEY}_update_wxschoolapp`];
      }
      if (localStorage[`${CFG.PRODUCT_KEY}_update_wxpublic`]) {
        publicUpdate = localStorage[`${CFG.PRODUCT_KEY}_update_wxpublic`];
      }
      console.log("public update", publicUpdate);
      console.log("school app update", schoolappUpdate);
      if (!schoolappUpdate && !publicUpdate) {
        this.setProductUserUpdateTime(); // 用户变更时，将变更时间写入缓存中
        return true; // 移动系统有变更用户.
      } else {
        if (schoolappUpdate === publicUpdate) {
          return false; // 用户变更时间相同
        } else {
          if (publicUpdate) {
            localStorage[`${CFG.PRODUCT_KEY}_update_wxschoolapp`] = publicUpdate;
          }
          return true; // 移动系统有变更用户.
        }
      }
    },
    // 读cookie
    getCookie: function (cname) {
      if (document.cookie.length > 0) {
        let cstart = document.cookie.indexOf(cname + "=")
        if (cstart !== -1) {
          cstart = cstart + cname.length + 1
          let cend = document.cookie.indexOf(";", cstart)
          if (cend === -1) {
            cend = document.cookie.length
          }
          return unescape(document.cookie.substring(cstart, cend))
        }
      }
      return ""
    },
    // 写cookie
    setCookie: function (cname, value, expiredays) {
      let exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie = cname + "=" + value +
        ((expiredays) ? "" : ";expires=" + exdate.toGMTString())
    },
    // 获取url参数
    getQueryString (name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      let r = window.location.search.substr(1).match(reg);
      if (r) return (r[2])
      return null
    },
    // 跳转页面
    go (url, router) {
      if (/^javas/.test(url) || !url) return
      const useRouter = typeof url === 'object' || (router && typeof url === 'string' && !/http/.test(url))
      if (useRouter) {
        if (typeof url === 'object' && url.path && url.path.indexOf("http") >= 0) {
          window.location.href = url.path
        } else if (typeof url === 'object' && url.replace === true) {
          router.replace(url)
        } else {
          url === 'BACK' ? router.go(-1) : router.push(url)
        }
      } else {
        window.location.href = url
      }
      //go(url, router)
    },

    // 获取页面url
    getUrl (url, router) {
      getUrl(url, router)
    },
    // 微信jsApi调用签名
    async onWXReady (callback) {
      if (this.wxReady) {
        callback.call(wx, wx)
        return
      }
      let _this = this
      let response = await Vue.http.post(`${CFG.APIHOST}${CFG.API.wxSign}`, {url: location.href.split("#")[0]}).catch((error) => {
        console.log(error)
        console.log("API.wxSign error: 微信验证遇到点问题！请重新进入该应用");
        _this.alert("微信验证遇到点问题！请重新进入该应用");
      })
      console.log(response)
      let e = await response.data
      try {
        let op = {
          debug: false,
          appId: _this.appId,
          timestamp: e.timestamp,
          nonceStr: e.nonceStr,
          signature: e.signature,
          jsApiList: CFG.jsAPIs
        }
        wx.config(op);
        console.log(op)
        var wxSignFailed = false
        wx.ready(function () {
          _this.wxReady = true
          callback.call(wx, wx, wxSignFailed);
        })
        wx.error(function (e) {
          console.log("wx.error微信验证遇到点问题！请重新进入该应用");
          console.log(e);
          wxSignFailed = true
          _this.alert("微信验证遇到点问题！请重新进入该应用");
        })
      } catch (n) {
        console.log("success catched error: 微信验证遇到点问题！请重新进入该应用");
        _this.alert("微信验证遇到点问题！请重新进入该应用");
      }
    },
    // 关闭窗口
    closeWindow () {
      this.onWXReady(function () {
        if (wx !== undefined && wx !== null) {
          wx.closeWindow()
        } else {
          window.close()
        }
      })
    },
    // Alert
    alert (title, msg, onHide) {
      if (!onHide) onHide = () => {}
      this.ROOT.$emit('alert', title, msg, onHide)
    },
    // Confirm
    confirm (title, msg, onConfirm, onCancel, ps) {
      if (!onConfirm) onConfirm = () => {}
      if (!onCancel) onCancel = () => {}
      this.ROOT.$emit('confirm', title, msg, onConfirm, onCancel, ps)
    },
    setTitle (t) {
      this.ROOT.$emit('setTitle', t);
    },
    async checkAccess () {
      console.log(`api called: wxAccess: ${CFG.APIHOST}${CFG.API.checkAccess}`)
      let response = await Vue.http.post(`${CFG.APIHOST}${CFG.API.checkAccess}`, {
        rawUrl: encodeURIComponent(window.location.href)
      }).catch((error) => {
        console.log(error)
      })
      console.log(response)
      return await response.data
    },
    async checkSSOAccess (ticket) {
      let response = await Vue.http.get(`${CFG.APIHOST}${CFG.API.checkSSOAccess}`).catch((error) => {
        console.log(error)
      })
      console.log(response)
      return await response.data
    },
    //SSO初始设置，不对用户登录信息进行缓存
    prepareSSO(userinfo){
      if (userinfo && userinfo.syslogin === true && this.SSOType!=="") {
        userinfo.syslogin = false;
        this.setLocalUserinfo(userinfo);
      }
    },
    //检查全局用户信息
    checkGlobalUserInfo(userinfo){
      let byglobal = false;  // 是否通过全局用户信息获取登录状态
      if (this.IS_GLOBAL_USER === true) {
        let globalUpdateChanged = false; // 通过缓存对比时间，判断是否变更用户
        //先判断GLobal UserInfo
        let ginfo = this.getGLOBALUserinfo();
        if (ginfo) {
          globalUpdateChanged = this.getProductUserUpdateTime(); // 通用方法比较相同产品下系统用户 与 当前系统用户的用户变更时间是否相等
          let userinfoChanged = !userinfo || ginfo.syslogin !== userinfo.syslogin || ginfo.usertype !== userinfo.usertype || ginfo.userid !== userinfo.userid || ginfo.openid !== userinfo.openid;
          //当Global 记录与本地用户信息不一致，重新到后台获取新的用户
          if (userinfoChanged || globalUpdateChanged) {
            console.log(`checkAuth2，Global用户信息有变更.`);
            byglobal = true;
            // 存在Global用户信息时，记录ajax请求token
            if (!userinfo && ginfo.token) {
              this.setCookie(this.tokenCookieName, ginfo.token);
              Vue.http.defaults.headers.post['apitoken'] = ginfo.token;
              this.appId = ginfo.appId
            }
          }
        } else if (userinfo !== null) { // 不存在全局用户，但存在子系统用户，表示之前已经在别的系统解绑过
          byglobal = true;
        }
      }
      console.log("byglobal is", byglobal);
      return byglobal;
    },
    // 获取API数据通用方法
    async getData (url, ps) {
      if (ps === undefined) ps = {}
      var strPs = JSON.stringify(ps)
      console.log(`api called: ${CFG.APIHOST}${url}, ps:${strPs}`)
      if (this.openInterfaceRegPs) { // 开启验证ps
        if (this.openInterfaceRegPs.test(strPs) === true) {
          Toast({
            message: '请求中存在非法字符',
            position: 'top'
          });
          return await {status: 'error', msg: '请求中存在非法字符'}
        }
      }
      let response = await Vue.http.post(`${CFG.APIHOST}${url}`, ps).catch((error) => {
        console.log(error)
      })
      console.log(response);
      return await response.data
    },
    // 获取学期列表信息
    async getSmstLst () {
      /*if (this.currentXQ !== null) {
       return await this.xqList
       }*/
      console.log(`api called: wxAccess: ${CFG.APIHOST}${CFG.API.smst}`);
      let response = await Vue.http.post(`${CFG.APIHOST}${CFG.API.smst}`, {}).catch((error) => {
        console.log(error)
      })
      console.log(response)
      return await response.data
    },
    // 得到学年度信息
    async getSmsXNDData () {
      if (this.xndList.length > 0) {
        return
      }
      let d = await this.getData('/ComApi/PostObject', {
        apiName: 'GetSemesterXND'
      });
      if (d.status && d.status === "error") {
        console.log(d.msg);
        return []
      }
      return d.data
    },
    // 获取阿里Chart图表插件G2, 调用外部js资源
    async getG2 () {
      if (window.G2) {
        console.log("window.G2 exists");
        return await window.G2
      } else {
        let $script = require("scriptjs");
        return new Promise((resolve, reject) => {
          // https://a.alipayobjects.com/g/datavis/g2/2.3.3/g2.js
          // https://a.alipayobjects.com/g/datavis/g2-mobile-all/2.1.14/index.js
          const g2url = 'https://gw.alipayobjects.com/as/g/datavis/g2/2.3.13/index.js'; // https://a.alipayobjects.com/g/datavis/g2-mobile-all/2.1.14/index.js
          $script(g2url, function () {
            console.log("$script callback");
            if (window.GM) {
              console.log("$script resolved");
              resolve(window.GM)
            } else {
              reject("failed")
            }
          })
        })
      }
    },
    // 获取API数据通用方法
    getHashCode (input, isInt) {
      if (!input || input.length === 0) return null;
      var I64BIT_TABLE =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
      let hash = 5381;
      let i = input.length - 1;

      if (typeof input === 'string') {
        for (; i > -1; i--) {
          hash += (hash << 5) + input.charCodeAt(i);
        }
      } else {
        for (; i > -1; i--) {
          hash += (hash << 5) + input[i];
        }
      }
      var value = hash & 0x7FFFFFFF;
      var retValue = '';
      if (isInt) {
        do {
          retValue += value & 0x3F
          value >>= 6;
        }
        while (value);
      } else {
        do {
          retValue += I64BIT_TABLE[value & 0x3F];
          value >>= 6;
        }
        while (value);
      }
      return retValue;
    },
    // 百度地图 http://api.map.baidu.com/api?v=2.0&ak=piXQ5CgHFqEefqCVbhhBFfe6HjF7l4zW&callback=init
    async getBMap () {
      if (window.BMap) {
        console.log("window.BMap exists");
        return await window.BMap;
      } else {
        return new Promise(function (resolve, reject) {
          var script = document.createElement("script");
          script.type = "text/javascript";
          script.src = CFG.URLSCHEMA + "api.map.baidu.com/api?v=2.0&ak=piXQ5CgHFqEefqCVbhhBFfe6HjF7l4zW&callback=init";
          script.onerror = reject;
          document.head.appendChild(script);
          var h = null;
          h = window.setInterval(function () {
            if (window.BMap) {
              window.clearInterval(h);
              resolve(window.BMap);
            }
          }, 200);
        })
      }
    },
    // 判断手机版本是否是android，true是代表android
    getAppEdition () {
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      if (isAndroid) {
        return true;
      } else {
        return false;
      }
    },
    // 比较日期加时间的大小 yyyy-MM-DD HH:mm '2018-11-26 14: 01'
    compareDateAndTime (startTime, endTime) {
      let startDate = startTime.replace(/-/g, '/');
      let endDate = endTime.replace(/-/g, '/');
      let begin = new Date(startDate);
      let end = new Date(endDate);
      if (begin - end > 0) {
        return 'big'; // 第一个值大于第二个值
      } else if (begin - end === 0) {
        return 'equal'; // 第一个值相等第二个值
      } else {
        return 'small'; // 第一个日期比第二个参数日期小
      }
    },
    // 获取当前的时间或日期rq
    getDateOrTime (rq) {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let seperator1 = "-";
      let seperator2 = ":";
      if (rq === 'date') { // 当前日期
        return year + seperator1 + month + seperator1 + strDate;
      } else { // 当前日期加时间
        let Hours = date.getHours();
        let Minutes = date.getMinutes();
        let Seconds = date.getSeconds();

        if (Hours >= 0 && Hours <= 9) {
          Hours = "0" + Hours;
        }
        if (Minutes >= 0 && Minutes <= 9) {
          Minutes = "0" + Minutes;
        }
        if (Seconds >= 0 && Seconds <= 9) {
          Seconds = "0" + Seconds;
        }
        // 当前时间加日期
        return year + seperator1 + month + seperator1 + strDate+ " " + Hours + seperator2 + Minutes + seperator2 + Seconds;
      }
    },
    // 日期加一天 dt = yyyy-mm-dd; days = 1,加1天
    addDate(dt, days) {
      if (days === undefined || days === '') {
        days = 1;
      }
      let date = new Date(dt);
      date.setDate(date.getDate() + days);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
    },
    // 日期加一天
    getFormatDate(arg) {
      if (arg === undefined || arg === '') {
        return '';
      }
      let re = arg + '';
      if (re.length < 2) {
        re = '0' + re;
      }
      return re;
    },
    // 两个日期相差天数,（比如1991-09-10与1991-09-11相隔一天）
    getDateCount (start, end) {
      let day1 = new Date(start);
      let day2 = new Date(end);
      return (day2 - day1) / (1000 * 60 * 60 * 24);
    },
    // 所有菜单中排除'首页'中的设置菜单并记录排除的 iconfont、url 路径地址
    setMustAllMenuLst (d, fixMenuLst) {
      // d, 从接口中得到的所有菜单
      let configMenuLst = []; // 学校配置的固定菜单信息
      for (let k=0; k<fixMenuLst.length; k++) {
        let has = false;
        for (let i=0; i<d.length; i++){
          if (has) {
            break;
          }
          let lst = d[i].items;
          for (let j=0; j<lst.length; j++) {
            if (lst[j].title === fixMenuLst[k]) {
              configMenuLst.push(lst[j]);
              d[i].items.splice(j, 1); // 删除
              has = true;
              break;
            }
          }
        }
      }
      return {allMenuLst: d, configMenuLst: configMenuLst};
    },
    extend (destination, source) {
      for (var property in source) {
        destination[property] = source[property];
      }
      return destination;
    },
    // 微信扫码
    scanQRCode (callback) {
      this.onWXReady(function () {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            if (callback){
              callback(result);
            }
          }
        });
      });
    }
  }

  // 添加钉钉插件 sfz 2020
  import DingTalkPlugin from '../plugins/dingtalk/index.js'
  if (CFG.EndClientType === "DING"){
    Vue.use(DingTalkPlugin, {global: qdglobal})
  }
  export default qdglobal;

  window.VUXMAP = {
    "Actionsheet": "src/components/actionsheet/index.vue",
    "Agree": "src/components/agree/index.vue",
    "AjaxPlugin": "src/plugins/ajax/index.js",
    "Alert": "src/components/alert/index.vue",
    "AlertPlugin": "src/plugins/alert/index.js",
    "AppPlugin": "src/plugins/app/index.js",
    "Array2stringFilter": "src/filters/array2String.js",
    "Badge": "src/components/badge/index.vue",
    "base64": "src/tools/base64/index.js",
    "Blur": "src/components/blur/index.vue",
    "Box": "src/components/box/index.vue",
    "ButtonTab": "src/components/button-tab/button-tab.vue",
    "ButtonTabItem": "src/components/button-tab/button-tab-item.vue",
    "Calendar": "src/components/calendar/index.vue",
    "Card": "src/components/card/index.vue",
    "Cell": "src/components/cell/index.vue",
    "CellBox": "src/components/cell-box/index.vue",
    "CellFormPreview": "src/components/cell-form-preview/index.vue",
    "Checker": "src/components/checker/checker.vue",
    "CheckerItem": "src/components/checker/checker-item.vue",
    "CheckIcon": "src/components/check-icon/index.vue",
    "Checklist": "src/components/checklist/index.vue",
    "ChinaAddressData": "src/datas/china_address.json",
    "ChinaAddressV1Data": "src/datas/china_address_v1.json",
    "ChinaAddressV2Data": "src/datas/china_address_v2.json",
    "ChinaAddressV3Data": "src/datas/china_address_v3.json",
    "ClickOutsideDirective": "src/directives/click-outside/index.js",
    "Clocker": "src/components/clocker/index.vue",
    "ColorPicker": "src/components/color-picker/index.vue",
    "Confirm": "src/components/confirm/index.vue",
    "ConfirmPlugin": "src/plugins/confirm/index.js",
    "cookie": "src/tools/cookie/index.js",
    "Countdown": "src/components/countdown/index.vue",
    "Countup": "src/components/countup/index.vue",
    "dateFormat": "src/tools/date/format.js",
    "dateRange": "src/tools/date/range.js",
    "Datetime": "src/components/datetime/index.vue",
    "DatetimeRange": "src/components/datetime-range/index.vue",
    "debounce": "src/tools/debounce/index.js",
    "Demobasic": "src/components/fullpage/DemoBasic.vue",
    "Demoindex": "src/components/popover/DemoIndex.vue",
    "DevicePlugin": "src/plugins/device/index.js",
    "DevTip": "src/components/dev-tip/index.vue",
    "Divider": "src/components/divider/index.vue",
    "Flexbox": "src/components/flexbox/flexbox.vue",
    "FlexboxItem": "src/components/flexbox/flexbox-item.vue",
    "FormatTimeFilter": "src/filters/format-time.js",
    "FormPreview": "src/components/form-preview/index.vue",
    "FriendlyTimeFilter": "src/filters/friendly-time.js",
    "Fullpage": "src/components/fullpage/index.vue",
    "Grid": "src/components/grid/grid.vue",
    "GridItem": "src/components/grid/grid-item.vue",
    "Group": "src/components/group/index.vue",
    "GroupTitle": "src/components/group-title/index.vue",
    "Icon": "src/components/icon/index.vue",
    "IndexBar": "src/components/index-bar/index.vue",
    "InlineCalendar": "src/components/inline-calendar/index.vue",
    "InlineDesc": "src/components/inline-desc/index.vue",
    "InlineXNumber": "src/components/inline-x-number/index.vue",
    "InviewDirective": "src/directives/inview/index.js",
    "Loading": "src/components/loading/index.vue",
    "LoadingPlugin": "src/plugins/loading/index.js",
    "LoadMore": "src/components/load-more/index.vue",
    "LocalePlugin": "src/plugins/locale/index.js",
    "Marquee": "src/components/marquee/marquee.vue",
    "MarqueeItem": "src/components/marquee/marquee-item.vue",
    "Masker": "src/components/masker/index.vue",
    "md5": "src/tools/md5/index.js",
    "Msg": "src/components/msg/index.vue",
    "Name2valueFilter": "src/filters/name2value.js",
    "numberComma": "src/tools/number/comma.js",
    "numberPad": "src/tools/number/pad.js",
    "numberRandom": "src/tools/number/random.js",
    "numberRange": "src/tools/number/range.js",
    "NumberRoller": "src/components/number-roller/index.vue",
    "Panel": "src/components/panel/index.vue",
    "Picker": "src/components/picker/index.vue",
    "Popover": "src/components/popover/index.vue",
    "Popup": "src/components/popup/index.vue",
    "PopupPicker": "src/components/popup-picker/index.vue",
    "PopupRadio": "src/components/popup-radio/index.vue",
    "Previewer": "src/components/previewer/index.vue",
    "Qrcode": "src/components/qrcode/index.vue",
    "querystring": "src/tools/querystring/index.js",
    "Radio": "src/components/radio/index.vue",
    "Range": "src/components/range/index.vue",
    "Rater": "src/components/rater/index.vue",
    "ScriptLoaderPlugin": "src/plugins/script-loader/index.js",
    "Scroller": "src/components/scroller/index.vue",
    "Search": "src/components/search/index.vue",
    "Selector": "src/components/selector/index.vue",
    "Shake": "src/components/shake/index.vue",
    "Spinner": "src/components/spinner/index.vue",
    "Step": "src/components/step/step.vue",
    "StepItem": "src/components/step/step-item.vue",
    "Sticky": "src/components/sticky/index.vue",
    "stringTrim": "src/tools/string/trim.js",
    "Swipeout": "src/components/swipeout/swipeout.vue",
    "SwipeoutButton": "src/components/swipeout/swipeout-button.vue",
    "SwipeoutItem": "src/components/swipeout/swipeout-item.vue",
    "Swiper": "src/components/swiper/swiper.vue",
    "SwiperItem": "src/components/swiper/swiper-item.vue",
    "Tab": "src/components/tab/tab.vue",
    "Tabbar": "src/components/tabbar/tabbar.vue",
    "TabbarItem": "src/components/tabbar/tabbar-item.vue",
    "TabItem": "src/components/tab/tab-item.vue",
    "throttle": "src/tools/throttle/index.js",
    "Timeline": "src/components/timeline/timeline.vue",
    "TimelineItem": "src/components/timeline/timeline-item.vue",
    "Tip": "src/components/tip/index.vue",
    "Toast": "src/components/toast/index.vue",
    "ToastPlugin": "src/plugins/toast/index.js",
    "TransferDom": "src/directives/transfer-dom/index.js",
    "TransferDomDirective": "src/directives/transfer-dom/index.js",
    "Value2nameFilter": "src/filters/value2name.js",
    "Video": "src/components/video/index.vue",
    "ViewBox": "src/components/view-box/index.vue",
    "VuxComponentListData": "src/datas/vux_component_list.json",
    "WechatEmotion": "src/components/wechat-emotion/index.vue",
    "WechatPlugin": "src/plugins/wechat/index.js",
    "WepayInput": "src/components/wepay-input/index.vue",
    "XAddress": "src/components/x-address/index.vue",
    "XButton": "src/components/x-button/index.vue",
    "XCircle": "src/components/x-circle/index.vue",
    "XDialog": "src/components/x-dialog/index.vue",
    "XHeader": "src/components/x-header/index.vue",
    "XHr": "src/components/x-hr/index.vue",
    "XImg": "src/components/x-img/index.vue",
    "XInput": "src/components/x-input/index.vue",
    "XNumber": "src/components/x-number/index.vue",
    "XProgress": "src/components/x-progress/index.vue",
    "XSwitch": "src/components/x-switch/index.vue",
    "XTable": "src/components/x-table/index.vue",
    "XTextarea": "src/components/x-textarea/index.vue"
  }
</script>
