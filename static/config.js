window.Global_CONFIG = {
  IS_GLOBAL_USER: true, // 是否检查全局用户 - 是否做统一绑定，系统中默认true
  EndClientType: 'WX', // 值为 WX/APP/DING
  URLBASE: 'http://192.168.1.88:8080',
  APIHOST: 'http://192.168.1.88/WXSchoolApp',
  OAHOST: 'http://localhost:8012',
  StudentPlat: 'http://localhost/StuPlat', // 学生平台-学生端的照片上传
  DINGSCHOOL: 'http://localhost:8181',  // 教务系统站点主地址，用于pc端钉钉访问
  SSOType: "",         // SSO类型，cas代表CAS, 默认空
  UnreadMsg_Interval: 60000, // 定时检查未读消息时间间隔, 0代表不检查， 默认1分钟
  schoolName: '广东省财经职业技术学校', // 广西梧州商贸学校/上海起迪职业技术学校
  productName: '微信校园', // 系统产品名称，系统中有默认值‘微信校园’
  teachingLogCanRepeatRecord: true, // 教学日志是否可以重复提交, 程序默认不可以重复提交 false
  teacherApplicationNum: 9, // 规定教师端‘我的应用’可以添加多少个
  studentApplicationNum: 9, // 规定学生端‘我的应用’可以添加多少个
  demoReceivers: ["admin"], // 教师审批学生请假通过后，向微信推送消息
  showStuNoticeAnnounce: 1, // 学生端的通知公告菜单的内容默认0不显示,1显示内容
  homeModules: { // -首页中固定菜单的设置
    TeaHome: {
      Icons: ['学校概况', '通知公告', '校园地图', '校历']
    }, // teaHome end
    StuHome: { // stuHome start
      Icons: ['学校概况', '通知公告', '校园地图', '校历']
    }// stuHome end
  },
  school_Introduction: '<p>这里是学校概况</p>', // 学校概况
  allowLookCourseOtherTeaDetail: false, // 班级课表、教室课表中点击教学老师名称，是否允许看此老师的课表，可以不配置，系统中默认是 false
  stuScoreLstShowXF: true, // 学生端的‘我的成绩’是否显示科目的学分，系统中默认 true
  teachingLogTeaTitleLst: ['学生考勤', '课堂纪律', '老师打分'], // 教学日志的标题配置-老师端,系统默认有值
  teachingLogStuTitleLst: ['学生考勤', '学生打分'], // 教学日志的标题配置-学生端，系统默认有值
  openInterfaceRegPs: /[<]/, // 接口调用前 ps 正则表达式验证 [<]， 不验证 '', null
  guideDialogInfo: {
    header: '个人信息保护指引',
    contentText:
    '<p>请充分阅读并理解后，点击下面的按钮以接受我们的服务</p>'+
    '<p>1. 在浏览使用时，我们会收集、使用设备标识信息用于推荐。</p>' +
    '<p>2. 我们可能会申请位置权限，用于帮助你在发布的信息中展示位置或丰富信息推荐纬度。城市位置无需使用位置权限，仅通过ip地址确定“城市频道”中的城市及相关信息，不会收集精确位置信息。</p>' +
    '<p>3. 你可以查看完整版<a id="userAgree" class="link">《用户协议》</a>和<a id="userPrivacy" class="link">《隐私政策》</a>以便了解我们收集、使用、共享、存储信息的情况，以及对信息的保护措施。</p>',
    contentDesc: '如果你同意请点击下面的按钮以接受我们的服务。'
  }, // 个人信息保护指引
  isOpenSchoolCard: true, // 是否开启电子校园卡，true开启
  showPayrollTotal: false,  // 是否显示工资单中的总合计项
  showNewTeachingLog: true, // 是否显示教师端、学生端的教学日志    true新版   false旧版
  perviewFilePlat: 'http://192.168.1.45:8012', // 文件预览Java 后台地址
  previewFileDemoLst: [
    {url: 'https://dakaname.oss-cn-hangzhou.aliyuncs.com/file/2018-12-28/1546003237411.pdf', size: '13', name: '文件pdf(dakaname).pdf'},
    {url: 'http://dev.qidisoft.cn/WXSchoolApp/dist/static/文件word.docx', size: '13', name: '文件word(dev).docx'},
    {url: 'http://192.168.1.84:8080/static/文件word.docx', size: '878', name: '文件word(lqq).docx'},
    {url: 'http://192.168.1.84:8080/static/2020年工作日志.doc', size: '380', name: '2020年工作日志.doc'},
    {url: 'http://dev.qidisoft.cn/WXSchoolApp/dist/static/文件pdf.pdf', size: '35', name: '文件pdf(dev).pdf'},
    {url: 'http://192.168.1.84:8080/static/test001.txt', size: '11', name: 'test001.txt'},
    {url: 'http://192.168.1.84:8080/static/知识普及.pptx', size: '3086', name: '知识普及.pptx'},
    {url: 'http://192.168.1.84:8080/static/招聘人员电话反馈表.xlsx', size: '10', name: '招聘人员电话反馈表.xlsx'},
    {url: 'http://192.168.1.84:8080/static/周报样式.xls', size: '25', name: '周报样式.xls'},
    {url: 'http://192.168.1.84:8080/static/设计模式.ppt', size: '8887', name: '设计模式.ppt'},
    {url: 'http://192.168.1.84:8080/static/Hydrangeas.jpg', size: '582', name: 'Hydrangeas.jpg'}
  ],
  isAllowTheSameDayWriteLog: false, // 是否允许在除当天之外登记教学日志(不能大于今天日期),true=>允许，false=> 只能在当天登记 默认true
  stuAssessTeaIsAllowCheckXQ: false, // 学生评教老师页面是否可以选择学期，true=>可以选择， false=> 不允许选择 默认为true
  stuAssessTeaIsWriteRelativeMerits: true // 学生评教老师页面是否显示填写老师的优缺点， false=> 不显示优缺点，显示评教评语 true=>填写老师的优缺点，不显示评教评语  默认为false
};
