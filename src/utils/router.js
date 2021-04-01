import Vue from 'vue'
import Router from 'vue-router'
// import UserBind from '@/components/UserBind'
// import Home from '@/components/Home'

// import Error from '@/components/Error'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/',
      name: 'entry',
      component: resolve => require(['../components/Entry.vue'], resolve),
      meta: { showHead: false, showBar: false, anonymous: true }
    },
    { path: '/qrCodeLogin',
      name: 'qrCodeLogin',
      component: resolve => require(['../components/QrCodeLogin.vue'], resolve),
      meta: { showHead: false, showBar: false, anonymous: false }
    },
    { path: '/qdSsoEntry/:cid',
      name: 'qdssoentry',
      component: resolve => require(['../components/QDSsoEntry.vue'], resolve),
      meta: { showHead: false, showBar: false, anonymous: false }
    },
    { path: '/my',
      name: 'my',
      component: resolve => require(['../components/My.vue'], resolve),
      meta: {showHead: false, showBar: true}
    },
    { path: '/mydetail',
      name: 'mydetail',
      component: resolve => require(['../components/MyDetail.vue'], resolve),
      meta: {showHead: true, showBar: true, title: '个人信息'}
    },
    { path: '/error',
      name: 'error',
      component: resolve => require(['../components/Error.vue'], resolve),
      meta: { showHead: false, showBar: false, anonymous: true }
    },
    { path: '/userAgree',
      name: 'userAgree',
      component: resolve => require(['../components/userbind/UserAgree.vue'], resolve),
      meta: { showHead: false, showBar: false, anonymous: true }
    },
    { path: '/userPrivacy',
      name: 'userPrivacy',
      component: resolve => require(['../components/userbind/UserPrivacy.vue'], resolve),
      meta: { showHead: false, showBar: false, anonymous: true }
    },
    { path: '/userbind',
      name: 'userbind',
      component: resolve => require(['../components/UserBind.vue'], resolve),
      meta: { showHead: false, showBar: false, anonymous: true }
    },
    { path: '/initiativeChangePwd',
      name: 'initiativeChangePwd',
      component: resolve => require(['../components/userbind/InitiativeChangePwd.vue'], resolve),
      meta: { showHead: false, showBar: false }
    },
    { path: '/noticeinfo',
      name: 'noticeinfo',
      component: resolve => require(['../components/NoticeInfo.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '公告' }
    },
    { path: '/messageCenter/messageCentre',
      name: 'messageCenter/messageCentre',
      component: resolve => require(['../components/messageCenter/MessageCentre.vue'], resolve),
      meta: { showHead: false, showBar: true }
    },
    { path: '/messageCenter/messageCatalog',
      name: 'messageCenter/messageCatalog',
      component: resolve => require(['../components/messageCenter/MessageCatalog.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的消息' }
    },
    { path: '/messageCenter/msgCatalogDetail',
      name: 'messageCenter/msgCatalogDetail',
      component: resolve => require(['../components/messageCenter/MsgCatalogDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的消息' }
    },
    { path: '/messageCenter/workWaitingOrWorkDone',
      name: 'messageCenter/workWaitingOrWorkDone',
      component: resolve => require(['../components/messageCenter/WorkWaitingOrWorkDone.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '待办事宜' }
    },
    { path: '/messageCenter/workDo',
      name: 'messageCenter/workDo',
      component: resolve => require(['../components/messageCenter/WorkDo.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '工作处理' }
    },
    { path: '/home',
      name: 'home',
      component: resolve => require(['../components/Home.vue'], resolve),
      meta: { showHead: false, showBar: true }
    },
    { path: '/myApplication/searchMenu',
      name: 'searchMenu',
      component: resolve => require(['../components/myApplication/common/SearchMenu.vue'], resolve),
      meta: { showHead: false, showBar: false }
    },
    { path: '/myApplication/moreApplication',
      name: 'moreApplication',
      component: resolve => require(['../components/myApplication/MoreApplication.vue'], resolve),
      meta: { showHead: false, showBar: false }
    },
    { path: '/myApplication/stuMoreApplication',
      name: 'stuMoreApplication',
      component: resolve => require(['../components/myApplication/StuMoreApplication.vue'], resolve),
      meta: { showHead: false, showBar: false }
    },
    { path: '/myApplication/myApplicationEdit',
      name: 'myApplicationEdit',
      component: resolve => require(['../components/myApplication/MyApplicationEdit.vue'], resolve),
      meta: { showHead: false, showBar: false }
    },
    { path: '/myApplication/stuApplicationEdit',
      name: 'stuApplicationEdit',
      component: resolve => require(['../components/myApplication/StuApplicationEdit.vue'], resolve),
      meta: { showHead: false, showBar: false }
    },
    { path: '/public/schoolinfo',
      name: 'schoolinfo',
      component: resolve => require(['../components/Schoolinfo.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学校概况' }
    },
    { path: '/public/announcelst',
      name: 'announcelst',
      component: resolve => require(['../components/Announcelst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '通知公告' }
    },
    { path: '/announceNewsDetail',
      name: 'announceNewsDetail',
      component: resolve => require(['../components/AnnounceNewsDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '详情' }
    },
    { path: '/public/calendar',
      name: 'calendar',
      component: resolve => require(['../components/Calendar.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '校历' }
    },
    { path: '/payrollList',
      name: 'payrollList',
      component: resolve => require(['../components/PayrollList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '工资单' }
    },
    { path: '/payrollDetail',
      name: 'payrollDetail',
      component: resolve => require(['../components/PayrollDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '工资单详细' }
    },
    { path: '/addressBookList',
      name: 'addressBookList',
      component: resolve => require(['../components/AddressBookList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '校内通讯录' }
    },
    { path: '/addressBookDetail',
      name: 'addressBookDetail',
      component: resolve => require(['../components/AddressBookDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '校内通讯录' }
    },
    { path: '/meetingList',
      name: 'meetingList',
      component: resolve => require(['../components/MeetingList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '会议查询' }
    },
    { path: '/meetingListDetail',
      name: 'meetingListDetail',
      component: resolve => require(['../components/MeetingListDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '会议信息' }
    },
    { path: '/teaReportList',
      name: 'teaReportList',
      component: resolve => require(['../components/TeaReportList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学校教育质量年度报告' }
    },
    { path: '/courseTeaLst',
      name: 'courseTeaLst',
      component: resolve => require(['../components/CourseTeaLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的课表' }
    },
    { path: '/scoreTeaLst',
      name: 'scoreTeaLst',
      component: resolve => require(['../components/ScoreTeaLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '成绩单' }
    },
    { path: '/scoreTeaDetail',
      name: 'scoreTeaDetail',
      component: resolve => require(['../components/ScoreTeaDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '成绩单详情' }
    },
    { path: '/dailyMEStuRegList',
      name: 'dailyMEStuRegList',
      component: resolve => require(['../components/DailyMEStuRegList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生德育' }
    },
    { path: '/dailyMEReg',
      name: 'dailyMEReg',
      component: resolve => require(['../components/DailyMEReg.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生德育登记', rightQrCode: true }
    },
    { path: '/selectStudentMoral',
      name: 'selectStudentMoral',
      component: resolve => require(['../components/SelectStudentMoral.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择学生' }
    },
    { path: '/selectMEExamItem',
      name: 'selectMEExamItem',
      component: resolve => require(['../components/SelectMEExamItem.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择项目' }
    },
    { path: '/myClassInforList',
      name: 'myClassInforList',
      component: resolve => require(['../components/MyClassInforList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的班级' }
    },
    { path: '/myClassMembers',
      name: 'myClassMembers',
      component: resolve => require(['../components/MyClassMembers.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级成员' }
    },
    { path: '/myClassStuDetail',
      name: 'myClassStuDetail',
      component: resolve => require(['../components/MyClassStuDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生详情' }
    },
    { path: '/myClassStuQrCode',
      name: 'myClassStuQrCode',
      component: resolve => require(['../components/MyClassStuQrCode.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '二维码' }
    },
    { path: '/classLeaveMsgClassList',
      name: 'classLeaveMsgClassList',
      component: resolve => require(['../components/ClassLeaveMsgClassList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的班级' }
    },
    { path: '/classLeaveMsgList',
      name: 'classLeaveMsgList',
      component: resolve => require(['../components/ClassLeaveMsgList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级留言' }
    },
    { path: '/classLeaveMsgDetail',
      name: 'classLeaveMsgDetail',
      component: resolve => require(['../components/ClassLeaveMsgDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '留言详情' }
    },
    { path: '/classLeaveMsgAdd',
      name: 'classLeaveMsgAdd',
      component: resolve => require(['../components/ClassLeaveMsgAdd.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '写留言' }
    },
    { path: '/classInformation/classInforClassLst',
      name: 'classInformation/classInforClassLst',
      component: resolve => require(['../components/classInformation/ClassInforClassLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的班级' }
    },
    { path: '/classInformation/classInformationLst',
      name: 'classInformation/classInformationLst',
      component: resolve => require(['../components/classInformation/ClassInformationLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级信息' }
    },
    { path: '/classInformation/classInforDetail',
      name: 'classInformation/classInforDetail',
      component: resolve => require(['../components/classInformation/ClassInforDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级信息' }
    },
    { path: '/classInformation/classInforAdd',
      name: 'classInformation/classInforAdd',
      component: resolve => require(['../components/classInformation/ClassInforAdd.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级信息' }
    },
    { path: '/classMELst',
      name: 'classMELst',
      component: resolve => require(['../components/classMoralEdu/ClassMELst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级德育' }
    },
    { path: '/classMERegister',
      name: 'classMERegister',
      component: resolve => require(['../components/classMoralEdu/ClassMERegister.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级德育登记' }
    },
    { path: '/selectClassForME',
      name: 'selectClassForME',
      component: resolve => require(['../components/classMoralEdu/SelectClassForME.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择班级' }
    },
    { path: '/selectClassMEItem',
      name: 'selectClassMEItem',
      component: resolve => require(['../components/classMoralEdu/SelectClassMEItem.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择项目' }
    },
    { path: '/adjustClassLstandApply',
      name: 'adjustClassLstandApply',
      component: resolve => require(['../components/courseArrangementApplication/AdjustClassLstandApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '请假调课' }
    },
    { path: '/adjustCourseDetail',
      name: 'adjustCourseDetail',
      component: resolve => require(['../components/courseArrangementApplication/AdjustCourseDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '详情' }
    },
    { path: '/addAdjustCourse',
      name: 'addAdjustCourse',
      component: resolve => require(['../components/courseArrangementApplication/AddAdjustCourse.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '调课申请' }
    },
    { path: '/stuLeaveApply/leaveApplyList',
      name: 'stuLeaveApply/leaveApplyList',
      component: resolve => require(['../components/stuLeaveApply/LeaveApplyList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '请假申请' }
    },
    { path: '/stuLeaveApply/leaveApplyDetail',
      name: 'stuLeaveApply/leaveApplyDetail',
      component: resolve => require(['../components/stuLeaveApply/LeaveApplyDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '请假申请详情' }
    },
    { path: '/stuLeaveApply/leaveAuditDetail',
      name: 'stuLeaveApply/leaveAuditDetail',
      component: resolve => require(['../components/stuLeaveApply/LeaveAuditDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '请假审批详情' }
    },
    { path: '/stuLeaveApply/leaveApplyReg',
      name: 'stuLeaveApply/leaveApplyReg',
      component: resolve => require(['../components/stuLeaveApply/LeaveApplyReg.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '请假申请' }
    },
    { path: '/stuLeaveApply/selectBZRStudent',
      name: 'stuLeaveApply/selectBZRStudent',
      component: resolve => require(['../components/stuLeaveApply/SelectBZRStudent.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择学生' }
    },
    { path: '/public/schoolMap',
      name: 'schoolMap',
      component: resolve => require(['../components/SchoolMap.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '校园地图' }
    },
    { path: '/receiptManagement/acceptFileLst',
      name: 'receiptManagement/acceptFileLst',
      component: resolve => require(['../components/receiptManagement/AcceptFileLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '公文流转' }
    },
    { path: '/receiptManagement/acceptFileDetail',
      name: 'receiptManagement/acceptFileDetail',
      component: resolve => require(['../components/receiptManagement/AcceptFileDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '公文流转信息' }
    },
    { path: '/selectTeacher',
      name: 'selectTeacher',
      component: resolve => require(['../components/SelectTeacher.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择教师' }
    },
    { path: '/selectMultiTeacher',
      name: 'selectMultiTeacher',
      component: resolve => require(['../components/SelectMultiTeacher.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择教师' }
    },
    { path: '/receiptManagement/flowDocApply',
      name: 'receiptManagement/flowDocApply',
      component: resolve => require(['../components/receiptManagement/FlowDocApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '公文流转申请' }
    },
    { path: '/receiptManagement/selectFlowDocFromBy',
      name: 'receiptManagement/selectFlowDocFromBy',
      component: resolve => require(['../components/receiptManagement/SelectFlowDocFromBy.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择来文单位' }
    },
    { path: '/classLog/classLogLst',
      name: 'classLog/classLogLst',
      component: resolve => require(['../components/classLog/ClassLogLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '课堂日志' }
    },
    { path: '/classLog/classLogEdit',
      name: 'classLog/classLogEdit',
      component: resolve => require(['../components/classLog/ClassLogEdit.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生考勤' }
    },
    { path: '/teaExamQuery/examQuery',
      name: 'teaExamQuery/examQuery',
      component: resolve => require(['../components/teaExamQuery/ExamQuery.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考试查询' }
    },
    { path: '/teaExamQuery/examQueryDetail',
      name: 'teaExamQuery/examQueryDetail',
      component: resolve => require(['../components/teaExamQuery/ExamQueryDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考试查询详情' }
    },
    { path: '/teacherAssess/teaAssessStuLst',
      name: 'teacherAssess/teaAssessStuLst',
      component: resolve => require(['../components/teacherAssess/TeaAssessStuLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生测评' }
    },
    { path: '/teacherAssess/teaAssessStuSubject',
      name: 'teacherAssess/teaAssessStuSubject',
      component: resolve => require(['../components/teacherAssess/TeaAssessStuSubject.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生测评' }
    },
    { path: '/teacherAssess/teacherAssessLst',
      name: 'teacherAssess/teacherAssessLst',
      component: resolve => require(['../components/teacherAssess/TeacherAssessLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教师测评' }
    },
    { path: '/teacherAssess/teacherAssessKaoPing',
      name: 'teacherAssess/teacherAssessKaoPing',
      component: resolve => require(['../components/teacherAssess/TeacherAssessKaoPing.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教师测评' }
    },
    { path: '/teacherAssess/teaAssessQuery',
      name: 'teacherAssess/teaAssessQuery',
      component: resolve => require(['../components/teacherAssess/TeaAssessQuery.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '个人考评查询' }
    },
    { path: '/assets-review/assetsReviewLst',
      name: 'assetsreviewlst',
      component: resolve => require(['../components/assets-review/assetsReviewLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '资产盘点管理' }
    },
    { path: '/repair/teaRepair',
      name: 'repair/teaRepair',
      component: resolve => require(['../components/repair/TeaRepair.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '报修管理' }
    },
    { path: '/repair/teaRepairDetail',
      name: 'repair/teaRepairDetail',
      component: resolve => require(['../components/repair/TeaRepairDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '详情' }
    },
    { path: '/repair/repairResult',
      name: 'repair/repairResult',
      component: resolve => require(['../components/repair/RepairResult.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '维修结果' }
    },
    { path: '/repair/repairAssess',
      name: 'repair/repairAssess',
      component: resolve => require(['../components/repair/RepairAssess.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '维修评价' }
    },
    { path: '/repair/repairApply',
      name: 'repair/repairApply',
      component: resolve => require(['../components/repair/RepairApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '报修申请' }
    },
    { path: '/repair/selectDeviceUser',
      name: 'repair/selectDeviceUser',
      component: resolve => require(['../components/repair/selectDeviceUser.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择教师' }
    },
    { path: '/thesisManage/teaThesisManage',
      name: 'thesisManage/teaThesisManage',
      component: resolve => require(['../components/thesisManage/TeaThesisManage.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教师论文管理' }
    },
    { path: '/stuSelectCourseManage/stuSelectCourse',
      name: 'stuSelectCourseManage/stuSelectCourse',
      component: resolve => require(['../components/stuSelectCourseManage/StuSelectCourse.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '在校生选课' }
    },
    { path: '/stuSelectCourseManage/timetable',
      name: 'stuSelectCourseManage/timetable',
      component: resolve => require(['../components/stuSelectCourseManage/Timetable.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的课表' }
    },
    { path: '/studentAssessTea/studentAssessTeaLst',
      name: 'studentAssessTea/studentAssessTeaLst',
      component: resolve => require(['../components/studentAssessTea/StudentAssessTeaLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教师测评' }
    },
    { path: '/studentAssessTea/studentAssessTeaKaoPing',
      name: 'studentAssessTea/studentAssessTeaKaoPing',
      component: resolve => require(['../components/studentAssessTea/StudentAssessTeaKaoPing.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教师测评' }
    },
    { path: '/stuDailyNorm',
      name: 'stuDailyNorm',
      component: resolve => require(['../components/StuDailyNorm.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '日常规范' }
    },
    { path: '/stuKaoQin/kaoQinLst',
      name: 'stuKaoQin/kaoQinLst',
      component: resolve => require(['../components/stuKaoQin/KaoQinLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生考勤' }
    },
    { path: '/stuKaoQin/kaoQinDetail',
      name: 'stuKaoQin/kaoQinDetail',
      component: resolve => require(['../components/stuKaoQin/KaoQinDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考勤详细' }
    },
    { path: '/outsideSchool/externalTest',
      name: 'outsideSchool/externalTest',
      component: resolve => require(['../components/outsideSchool/ExternalTest.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '校外考试' }
    },
    { path: '/skillContest/stuSkillContest',
      name: 'skillContest/stuSkillContest',
      component: resolve => require(['../components/skillContest/StuSkillContest.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '技能大赛' }
    },
    { path: '/skillContest/teaSkillContest',
      name: 'skillContest/teaSkillContest',
      component: resolve => require(['../components/skillContest/TeaSkillContest.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '技能大赛' }
    },
    { path: '/teachingMaterial/stuTeachingMaterial',
      name: 'teachingMaterial/stuTeachingMaterial',
      component: resolve => require(['../components/teachingMaterial/StuTeachingMaterial.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教材查询' }
    },
    { path: '/newsPublish/newsPublish',
      name: 'newsPublish/newsPublish',
      component: resolve => require(['../components/newsPublish/newsPublish.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '新闻' }
    },
    { path: '/newsPublish/newsPublishDetail',
      name: 'newsPublish/newsPublishDetail',
      component: resolve => require(['../components/newsPublish/newsPublishDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '新闻详情' }
    },
    { path: '/newsPublish/newsPublishApply',
      name: 'newsPublish/newsPublishApply',
      component: resolve => require(['../components/newsPublish/NewsPublishApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '新闻申请' }
    },
    { path: '/noticePublish/noticePublish',
      name: 'noticePublish/noticePublish',
      component: resolve => require(['../components/noticePublish/NoticePublish.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '公告' }
    },
    { path: '/noticePublish/noticePublishDetail',
      name: 'noticePublish/noticePublishDetail',
      component: resolve => require(['../components/noticePublish/NoticePublishDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '公告详情' }
    },
    { path: '/noticePublish/noticePublishApply',
      name: 'noticePublish/noticePublishApply',
      component: resolve => require(['../components/noticePublish/NoticePublishApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '公告申请' }
    },
    { path: '/campusDispatch/campusDispatch',
      name: 'campusDispatch/campusDispatch',
      component: resolve => require(['../components/campusDispatch/CampusDispatch.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '校内发文' }
    },
    { path: '/campusDispatch/campusDispatchDetail',
      name: 'campusDispatch/campusDispatchDetail',
      component: resolve => require(['../components/campusDispatch/CampusDispatchDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '校内发文详情' }
    },
    { path: '/campusDispatch/campusDispatchApply',
      name: 'campusDispatch/campusDispatchApply',
      component: resolve => require(['../components/campusDispatch/CampusDispatchApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '校内发文管理' }
    },
    { path: '/employeeLeave/employeeLeave',
      name: 'employeeLeave/employeeLeave',
      component: resolve => require(['../components/employeeLeave/EmployeeLeave.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '职工请假' }
    },
    { path: '/employeeLeave/employeeLeaveDetail',
      name: 'employeeLeave/employeeLeaveDetail',
      component: resolve => require(['../components/employeeLeave/EmployeeLeaveDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '职工请假详情' }
    },
    { path: '/attendance/teaAttendance',
      name: 'attendance/teaAttendance',
      component: resolve => require(['../components/attendance/TeaAttendance.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考勤' }
    },
    { path: '/attendance/teaAttendanceDetail',
      name: 'attendance/teaAttendanceDetail',
      component: resolve => require(['../components/attendance/TeaAttendanceDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考勤详情' }
    },
    { path: '/deferHolidays/deferHolidays',
      name: 'deferHolidays/deferHolidays',
      component: resolve => require(['../components/deferHolidays/DeferHolidays.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '补休' }
    },
    { path: '/deferHolidays/deferHolidaysDetail',
      name: 'deferHolidays/deferHolidaysDetail',
      component: resolve => require(['../components/deferHolidays/DeferHolidaysDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '补休详情' }
    },
    { path: '/receiptFile/receiptFileManage',
      name: 'receiptFile/receiptFileManage',
      component: resolve => require(['../components/receiptFile/ReceiptFileManage.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '收文管理' }
    },
    { path: '/receiptFile/receiptFileManageDetail',
      name: 'receiptFile/receiptFileManageDetail',
      component: resolve => require(['../components/receiptFile/receiptFileManageDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '收文管理详情' }
    },
    { path: '/meetingApply/meetingApply',
      name: 'meetingApply/meetingApply',
      component: resolve => require(['../components/meetingApply/meetingApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '会议申请' }
    },
    { path: '/meetingApply/meetingApplyDetail',
      name: 'meetingApply/meetingApplyDetail',
      component: resolve => require(['../components/meetingApply/MeetingApplyDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '会议详情' }
    },
    { path: '/selectMultiStudent',
      name: 'selectMultiStudent',
      component: resolve => require(['../components/SelectMultiStudent.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择学生' }
    },
    /*{ path: '/userDefinded/officeTwo',
      name: 'userDefinded/officeTwo',
      component: resolve => require(['../components/userDefinded/OfficeTwo.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '自定义办公1' }
    },*/
    /*{ path: '/userDefinded/officeTwo',
      name: 'userDefinded/officeTwo',
      component: resolve => require(['../components/userDefinded/KeepAlive.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '自定义办公1' }
    },*/
    { path: '/scholarshiplst',
      name: 'scholarshiplst',
      component: resolve => require(['../components/ScholarshipLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '奖学金公示' }
    },
    { path: '/scholarshipdetail',
      name: 'scholarshipdetail',
      component: resolve => require(['../components/ScholarshipDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '奖学金详情' }
    },
    { path: '/communitylst',
      name: 'communitylst',
      component: resolve => require(['../components/CommunityLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的社团' }
    },
    { path: '/communityapply',
      name: 'communityapply',
      component: resolve => require(['../components/CommunityApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '社团报名' }
    },
    { path: '/communitydetail',
      name: 'communitydetail',
      component: resolve => require(['../components/CommunityDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '社团信息' }
    },
    { path: '/communityapplydetail',
      name: 'communityapplydetail',
      component: resolve => require(['../components/CommunityApplyDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '社团信息' }
    },
    { path: '/communitysignin',
      name: 'communitysignin',
      component: resolve => require(['../components/CommunitySignin.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '社团活动签到' }
    },
    { path: '/communitysigninlst',
      name: 'communitysigninlst',
      component: resolve => require(['../components/CommunitySigninLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的签到记录' }
    },
    { path: '/voluntarylst',
      name: 'voluntarylst',
      component: resolve => require(['../components/VoluntaryLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '小螺钉志愿者' }
    },
    { path: '/voluntarysignin',
      name: 'voluntarysignin',
      component: resolve => require(['../components/VoluntarySignin.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '志愿者活动签到' }
    },
    { path: '/voluntarysigninlst',
      name: 'voluntarysigninlst',
      component: resolve => require(['../components/VoluntarySigninLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的签到记录' }
    },
    { path: '/voluntarydetail',
      name: 'voluntarydetail',
      component: resolve => require(['../components/VoluntaryDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '小螺钉志愿者详情' }
    },
    { path: '/leaveinfo',
      name: 'leaveinfo',
      component: resolve => require(['../components/LeaveInfo.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '离校巡回单' }
    },
    { path: '/scorelst',
      name: 'scorelst',
      component: resolve => require(['../components/ScoreLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '成绩查询' }
    },
    { path: '/attendlst',
      name: 'attendlst',
      component: resolve => require(['../components/AttendLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考勤信息' }
    },
    { path: '/attenddetail',
      name: 'attenddetail',
      component: resolve => require(['../components/AttendDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考勤详情' }
    },
    { path: '/dylst',
      name: 'dylst',
      component: resolve => require(['../components/DyLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生德育' }
    },
    { path: '/awardlst',
      name: 'awardlst',
      component: resolve => require(['../components/AwardLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '奖惩情况' }
    },
    { path: '/awarddetail',
      name: 'awarddetail',
      component: resolve => require(['../components/AwardDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '奖惩详情' }
    },
    { path: '/morallst',
      name: 'morallst',
      component: resolve => require(['../components/MoralLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语' }
    },
    { path: '/moraldetail',
      name: 'moraldetail',
      component: resolve => require(['../components/MoralDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语详情' }
    },
    { path: '/bzrMoralSelect',
      name: 'bzrMoralSelect',
      component: resolve => require(['../components/moral/BzrMoralSelect.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语' }
    },
    { path: '/bzrMoralSelectNew',
      name: 'bzrMoralSelectNew',
      component: resolve => require(['../components/moral/BzrMoralSelectNew.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语' }
    },
    { path: '/stuLstByMoral',
      name: 'stuLstByMoral',
      component: resolve => require(['../components/moral/StuLstByMoral.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语' }
    },
    { path: '/stuLstByMoralNew',
      name: 'stuLstByMoralNew',
      component: resolve => require(['../components/moral/StuLstByMoralNew.vue'], resolve),
      meta: { showHead: false, showBar: false, title: '品德评语' }
    },
    { path: '/stuWriteDetail',
      name: 'stuWriteDetail',
      component: resolve => require(['../components/moral/StuWriteDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语' }
    },
    { path: '/adminMoralSelect',
      name: 'adminMoralSelect',
      component: resolve => require(['../components/moral/AdminMoralSelect.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语' }
    },
    { path: '/adminMoralSelectNew',
      name: 'adminMoralSelectNew',
      component: resolve => require(['../components/moral/AdminMoralSelectNew.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语', keepAlive: true, scrollTop: 0 }
    },
    { path: '/stuMoralDetailBySearch',
      name: 'stuMoralDetailBySearch',
      component: resolve => require(['../components/moral/StuDetailBySearch.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语' }
    },
    { path: '/searchPage',
      name: 'searchPage',
      component: resolve => require(['../components/moral/SearchPage.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语搜索' }
    },
    { path: '/stuMoralLst',
      name: 'stuMoralLst',
      component: resolve => require(['../components/moral/StuMoralLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语' }
    },
    { path: '/courselst',
      name: 'courselst',
      component: resolve => require(['../components/CourseLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的课表' }
    },
    { path: '/morningchecklst',
      name: 'morningchecklst',
      component: resolve => require(['../components/MorningCheckLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '晨检记录' }
    },
    { path: '/morningcheckdetail',
      name: 'morningcheckdetail',
      component: resolve => require(['../components/MorningCheckDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '晨检详细' }
    },
    { path: '/morningcheckadd',
      name: 'morningcheckadd',
      component: resolve => require(['../components/MorningCheckAdd.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '晨检管理' }
    },
    { path: '/morningcheckadddetail',
      name: 'morningcheckadddetail',
      component: resolve => require(['../components/MorningCheckAddDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '晨检管理' }
    },
    { path: '/awardXF/awardXFLst',
      name: 'awardXFLst',
      component: resolve => require(['../components/awardXF/AwardXFLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '奖励学分' }
    },
    { path: '/demo/assetsGetLst',
      name: 'demo/assetsGetLst',
      component: resolve => require(['../components/demo/AssetsGetLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '资产领用' }
    },
    { path: '/demo/assetsGetAdd',
      name: 'demo/assetsGetAdd',
      component: resolve => require(['../components/demo/AssetsGetAdd.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '资产领用' }
    },
    { path: '/stuKaoQinDemo/stuKaoQinEdit',
      name: 'stuKaoQinDemo/stuKaoQinEdit',
      component: resolve => require(['../components/stuKaoQinDemo/StuKaoQinEdit.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生考勤', rightQrCodeDemo: true }
    },
    { path: '/infirmaryDemo/infirmSickLst',
      name: 'infirmaryDemo/infirmSickLst',
      component: resolve => require(['../components/infirmaryDemo/InfirmSickLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '医务室病假登记' }
    },
    { path: '/infirmaryDemo/infirmSickReg',
      name: 'infirmaryDemo/infirmSickReg',
      component: resolve => require(['../components/infirmaryDemo/InfirmSickReg.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '医务室病假登记', rightQrCodeDemo: true }
    },
    { path: '/stuKaoQinDemo/stuKaoQinChart',
      name: 'stuKaoQinDemo/stuKaoQinChart',
      component: resolve => require(['../components/stuKaoQinDemo/StuKaoQinChart.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考勤统计' }
    },
    { path: '/teaTeachingLog/curriculumLst',
      name: 'teaTeachingLog/curriculumLst',
      component: resolve => require(['../components/teaTeachingLog/CurriculumLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教学日志' }
    },
    { path: '/teaTeachingLog/recordCurricu',
      name: 'teaTeachingLog/recordCurricu',
      component: resolve => require(['../components/teaTeachingLog/RecordCurricu.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教学日志' }
    },
    { path: '/teaTeachingLog/newRecordCurricu',
      name: 'teaTeachingLog/newRecordCurricu',
      component: resolve => require(['../components/teaTeachingLog/NewRecordCurricu.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教学日志' }
    },
    { path: '/stuTeachingLog/manageClassLst',
      name: 'stuTeachingLog/manageClassLst',
      component: resolve => require(['../components/stuTeachingLog/ManageClassLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教学日志' }
    },
    { path: '/stuTeachingLog/recordCurricu',
      name: 'stuTeachingLog/recordCurricu',
      component: resolve => require(['../components/stuTeachingLog/RecordCurricu.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教学日志' }
    },
    { path: '/stuTeachingLog/newRecordCurricu',
      name: 'stuTeachingLog/newRecordCurricu',
      component: resolve => require(['../components/stuTeachingLog/NewRecordCurricu.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教学日志' }
    },
    { path: '/certificate/uploadCertificate',
      name: 'certificate/uploadCertificate',
      component: resolve => require(['../components/certificate/UploadCertificate.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '证书申请' }
    },
    { path: '/certificate/seeCertApprovalLst',
      name: 'certificate/seeCertApprovalLst',
      component: resolve => require(['../components/certificate/SeeCertApprovalLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '证书' }
    },
    { path: '/certificate/certificateDetail',
      name: 'certificate/certificateDetail',
      component: resolve => require(['../components/certificate/CertificateDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '证书详情' }
    },
    { path: '/certificate/reviseCertificate',
      name: 'certificate/reviseCertificate',
      component: resolve => require(['../components/certificate/reviseCertificate.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '证书申请' }
    },
    { path: '/uploadImage/uploadImg',
      name: 'uploadImage/uploadImg',
      component: resolve => require(['../components/uploadImage/UploadImg.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '上传照片' }
    },
    { path: '/certificateTea/certVerifyLst',
      name: 'certificateTea/certVerifyLst',
      component: resolve => require(['../components/certificateTea/CertVerifyLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '证书审核' }
    },
    { path: '/certificateTea/certVerifyDetail',
      name: 'certificateTea/certVerifyDetail',
      component: resolve => require(['../components/certificateTea/CertVerifyDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '证书审核' }
    },
    { path: '/bzrManage/bzrShiftsWorkApply',
      name: 'bzrManage/bzrShiftsWorkApply',
      component: resolve => require(['../components/bzrManage/BzrShiftsWorkApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班主任顶班申请' }
    },
    { path: '/commonSelect/selectMultiTea',
      name: 'commonSelect/selectMultiTea',
      component: resolve => require(['../components/commonSelect/SelectMultiTea.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择教师' }
    },
    { path: '/commonSelect/selectMultiBzr',
      name: 'commonSelect/selectMultiBzr',
      component: resolve => require(['../components/commonSelect/SelectMultiBZR.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择班主任' }
    },
    { path: '/bzrManage/shiftsApplyVerifyLst',
      name: 'bzrManage/shiftsApplyVerifyLst',
      component: resolve => require(['../components/bzrManage/BzrShiftsApplyVerifyLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班主任顶班申请和审批' }
    },
    { path: '/bzrManage/bzrShiftsWorkDetail',
      name: 'bzrManage/bzrShiftsWorkDetail',
      component: resolve => require(['../components/bzrManage/BzrShiftsWorkDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班主任顶班申请详情' }
    },
    { path: '/courseClass/courseClassDetail',
      name: 'courseClass/courseClassDetail',
      component: resolve => require(['../components/courseClass/CourseClassDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级课表' }
    },
    { path: '/classWholeSchool/classWholeSchoolLst',
      name: 'classWholeSchool/classWholeSchoolLst',
      component: resolve => require(['../components/classWholeSchool/ClassWholeSchoolLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级' }
    },
    { path: '/borrowClassroom/borrowClassroomLst',
      name: 'borrowClassroom/borrowClassroomLst',
      component: resolve => require(['../components/borrowClassroom/BorrowClassroomLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教室借用申请' }
    },
    { path: '/borrowClassroom/borrowRoomApply',
      name: 'borrowClassroom/borrowRoomApply',
      component: resolve => require(['../components/borrowClassroom/BorrowRoomApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教室借用申请' }
    },
    { path: '/borrowClassroom/borrowRoomDetail',
      name: 'borrowClassroom/borrowRoomDetail',
      component: resolve => require(['../components/borrowClassroom/BorrowRoomDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教室借用申请' }
    },
    { path: '/borrowClassroom/freeClassRoomLst',
      name: 'borrowClassroom/freeClassRoomLst',
      component: resolve => require(['../components/borrowClassroom/FreeClassRoomLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择教室' }
    },
    { path: '/borrowClassroom/borrowRoomRevise',
      name: 'borrowClassroom/borrowRoomRevise',
      component: resolve => require(['../components/borrowClassroom/BorrowRoomRevise.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教室借用申请' }
    },
    { path: '/borrowClassroom/roomVerifyLst',
      name: 'borrowClassroom/roomVerifyLst',
      component: resolve => require(['../components/borrowClassroom/RoomVerifyLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教室借用审批' }
    },
    { path: '/courseExchange/courseExchangeLst',
      name: 'courseExchange/courseExchangeLst',
      component: resolve => require(['../components/courseExchange/CourseExchangeLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '调课申请' }
    },
    { path: '/courseExchange/courseExBaseApply',
      name: 'courseExchange/courseExBaseApply',
      component: resolve => require(['../components/courseExchange/CourseExBaseApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '调课申请' }
    },
    { path: '/courseExchange/courseEXInfoApply',
      name: 'courseExchange/courseEXInfoApply',
      component: resolve => require(['../components/courseExchange/CourseEXInfoApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '调课申请' }
    },
    { path: '/courseExchange/selectTeaCEX',
      name: 'courseExchange/selectTeaCEX',
      component: resolve => require(['../components/courseExchange/SelectTeaCEX.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择代课教师' }
    },
    { path: '/courseExchange/selectRoomCEX',
      name: 'courseExchange/selectRoomCEX',
      component: resolve => require(['../components/courseExchange/SelectRoomCEX.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择上课教室' }
    },
    { path: '/courseExchange/selectCourseCEX',
      name: 'courseExchange/selectCourseCEX',
      component: resolve => require(['../components/courseExchange/SelectCourseCEX.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择课时' }
    },
    { path: '/courseExchange/selectCourseCEXbndt',
      name: 'courseExchange/selectCourseCEXbndt',
      component: resolve => require(['../components/courseExchange/SelectCourseCEXbndt.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择课时' }
    },
    { path: '/courseExchange/selectTeaClassmateCEX',
      name: 'courseExchange/selectTeaClassmateCEX',
      component: resolve => require(['../components/courseExchange/SelectTeaClassmateCEX.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选择对调教师' }
    },
    { path: '/courseExchange/courseExchangeVerifyLst',
      name: 'courseExchange/courseExchangeVerifyLst',
      component: resolve => require(['../components/courseExchange/CourseExchangeVerifyLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '调课申请审批' }
    },
    { path: '/courseExchange/courseExDetail',
      name: 'courseExchange/courseExDetail',
      component: resolve => require(['../components/courseExchange/CourseEXDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '调课详情' }
    },
    { path: '/demoTrainingRoom/trainingRoomApply',
      name: 'demoTrainingRoom/trainingRoomApply',
      component: resolve => require(['../components/demoTrainingRoom/TrainingRoomApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '实训室申请' }
    },
    { path: '/stu/stuSelectCourseManage/stuSelectCourse',
      name: 'stu/stuSelectCourseManage/stuSelectCourse',
      component: resolve => require(['../components/stuSelectCourseManage/StuSelectCourse.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '选课' }
    },
    { path: '/stu/courselst',
      name: 'stu/courselst',
      component: resolve => require(['../components/CourseLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的课表' }
    },
    { path: '/stu/teaExamQuery/examQuery',
      name: 'stu/teaExamQuery/examQuery',
      component: resolve => require(['../components/teaExamQuery/ExamQuery.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考试查询' }
    },
    { path: '/stu/scorelst',
      name: 'stu/scorelst',
      component: resolve => require(['../components/ScoreLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '成绩查询' }
    },
    { path: '/stu/studentAssessTea/studentAssessTeaLst',
      name: 'stu/studentAssessTea/studentAssessTeaLst',
      component: resolve => require(['../components/studentAssessTea/StudentAssessTeaLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教师测评' }
    },
    { path: '/stu/attendlst',
      name: 'stu/attendlst',
      component: resolve => require(['../components/AttendLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '考勤信息' }
    },
    { path: '/stu/awardlst',
      name: 'stu/awardlst',
      component: resolve => require(['../components/AwardLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '奖惩情况' }
    },
    { path: '/stu/morallst',
      name: 'stu/morallst',
      component: resolve => require(['../components/MoralLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '品德评语' }
    },
    { path: '/stu/stuDailyNorm',
      name: 'stu/stuDailyNorm',
      component: resolve => require(['../components/StuDailyNorm.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '日常规范' }
    },
    { path: '/stu/outsideSchool/externalTest',
      name: 'stu/outsideSchool/externalTest',
      component: resolve => require(['../components/outsideSchool/ExternalTest.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '校外考试' }
    },
    { path: '/stu/skillContest/stuSkillContest',
      name: 'stu/skillContest/stuSkillContest',
      component: resolve => require(['../components/skillContest/StuSkillContest.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '技能大赛' }
    },
    { path: '/stu/teachingMaterial/stuTeachingMaterial',
      name: 'stu/teachingMaterial/stuTeachingMaterial',
      component: resolve => require(['../components/teachingMaterial/StuTeachingMaterial.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教材查询' }
    },
    { path: '/stu/awardXF/awardXFLst',
      name: 'stu/awardXFLst',
      component: resolve => require(['../components/awardXF/AwardXFLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '奖励学分' }
    },
    { path: '/stu/stuTeachingLog/manageClassLst',
      name: 'stu/stuTeachingLog/manageClassLst',
      component: resolve => require(['../components/stuTeachingLog/ManageClassLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教学日志' }
    },
    { path: '/stu/certificate/seeCertApprovalLst',
      name: 'stu/certificate/seeCertApprovalLst',
      component: resolve => require(['../components/certificate/SeeCertApprovalLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '证书' }
    },
    { path: '/stu/uploadImage/uploadImg',
      name: 'stu/uploadImage/uploadImg',
      component: resolve => require(['../components/uploadImage/UploadImg.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '上传照片' }
    },
    { path: '/stu/dailyMEStuRegList',
      name: 'stu/dailyMEStuRegList',
      component: resolve => require(['../components/DailyMEStuRegList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生德育' }
    },

    {
      path: '/arrangeRoom/roomApply',
      name: 'arrangeRoom/roomApply',
      component: resolve => require(['../components/ArrangeRoom/roomApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班主任分配新生寝室' }
    },
    {
      path: '/teaEvalStu/rkTeaEvalLst',
      name: 'pkTeaEvalLst',
      component: resolve => require(['../components/TeaEvalStu/RKTeaEvalLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '任课老师评学登记' }
    },
    {
      path: '/teaEvalStu/rkTeaEvalDetail',
      name: 'pkTeaEvalStuDetail',
      component: resolve => require(['../components/teaEvalStu/RKTeaEvalDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '任课老师评学登记' }
    },
    {
      path: '/teaEvalStu/brzTeaEvalLst',
      name: 'brzTeaEvalLst',
      component: resolve => require(['../components/TeaEvalStu/BzrTeaEvalLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班主任评学登记' }
    },
    {
      path: '/teaEvalStu/bzrTeaEvalDetail',
      name: 'brzTeaEvalStuDetail',
      component: resolve => require(['../components/teaEvalStu/BzrTeaEvalDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班主任评学登记' }
    },
    {
      path: '/public/repairSpecial/repairApply',
      name: 'specialRepairApply',
      component: resolve => require(['../components/repairSpecial/PublicRepairApply.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '报修申请' }
    },
    {
      path: '/public/repairSpecial/repairLst',
      name: 'specialRepairLst',
      component: resolve => require(['../components/repairSpecial/PublicRepairLst.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '报修申请' }
    },
    {
      path: '/public/repairSpecial/publicRepairDetail',
      name: 'publicRepairDetail',
      component: resolve => require(['../components/repairSpecial/PublicRepairDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '报修申请详情' }
    },
    {
      path: '/public/repairSpecial/publicRepairResult',
      name: 'publicRepairResult',
      component: resolve => require(['../components/repairSpecial/PublicRepairResult.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '维修结果' }
    },
    {
      path: '/public/repairSpecial/publicRepairAssess',
      name: 'publicRepairAssess',
      component: resolve => require(['../components/repairSpecial/publicRepairAssess.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '维修结果' }
    },
    {
      path: '/courseRoom/selectPkRoom',
      name: 'selectPkRoom',
      component: resolve => require(['../components/courseRoom/SelectPkRoom.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教室' }
    },
    {
      path: '/courseRoom/courseRoomDetail',
      name: 'courseRoomDetail',
      component: resolve => require(['../components/courseRoom/CourseRoomDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教室课表' }
    },
    {
      path: '/courseOtherTeaDetail',
      name: 'courseOtherTeaDetail',
      component: resolve => require(['../components/courseTea/CourseOtherTeaDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教师课表' }
    },
    {
      path: '/stu/stuLeaveSelfApply/leaveApplyList',
      name: 'leaveSelfApplyLst',
      component: resolve => require(['../components/stuLeaveSelfApply/LeaveApplyList.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生请假' }
    },
    {
      path: '/stu/stuLeaveSelfApply/leaveApplyDetail',
      name: 'leaveSelfApplyDetail',
      component: resolve => require(['../components/stuLeaveSelfApply/LeaveApplyDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '请假申请详情' }
    },
    {
      path: '/stu/stuLeaveSelfApply/leaveApplyReg',
      name: 'leaveSelfApplyReg',
      component: resolve => require(['../components/stuLeaveSelfApply/LeaveApplyReg.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生请假' }
    },
    {
      path: '/moralEduBjStats',
      name: 'moralEduBjStats',
      component: resolve => require(['../components/moralEduStats/MoralEduBjStats.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '班级德育扣分统计' }
    },
    {
      path: '/moralEduStuStats',
      name: 'moralEduStuStats',
      component: resolve => require(['../components/moralEduStats/MoralEduStuStats.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生德育扣分统计' }
    },
    {
      path: '/teaView/teachAssignReport',
      name: 'moralEduStuStats',
      component: resolve => require(['../components/teaView/TeachAssignReport.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '教学任务书' }
    },
    {
      path: '/patrol/teaPatrol',
      name: 'teaPatrol',
      component: resolve => require(['../components/patrol/TeaPatrol.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '' }
    },
    {
      path: '/myEducationScore/myEduScore',
      name: 'myEduScore',
      component: resolve => require(['../components/myEducationScore/MyEduScore.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '我的德育分' }
    },
    {
      path: '/myEducationScore/eduScoreDetail',
      name: 'eduScoreDetail',
      component: resolve => require(['../components/myEducationScore/EduScoreDetail.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '德育分详情' }
    },
    {
      path: '/stuArrears',
      name: 'stuArrears',
      component: resolve => require(['../components/StuArrears.vue'], resolve),
      meta: { showHead: true, showBar: false, title: '学生欠费查询' }
    },
    {
      path: '/schoolCard',
      name: 'schoolCard',
      component: resolve => require(['../components/schoolCard/SchoolCard.vue'], resolve),
      meta: {showHead: false, showBar: false}
    },
    {
      path: '/wxPushMsg',
      name: 'wxPushMsg',
      component: resolve => require(['../components/wxPushMsg/index.vue'], resolve),
      meta: {showHead: false, showBar: false}
    },

    {
      path: '/previewDemo',
      name: 'previewDemo',
      component: resolve => require(['../components/preview/PreviewDemo.vue'], resolve),
      meta: {showHead: false, showBar: false, anonymous: true}
    },
    {
      path: '/previewDocx',
      name: 'previewDocx',
      component: resolve => require(['../components/preview/PreviewDocx.vue'], resolve),
      meta: {showHead: false, showBar: false, anonymous: true}
    },
    {
      path: '/previewPdf',
      name: 'previewPdf',
      component: resolve => require(['../components/preview/PreviewPdf.vue'], resolve),
      meta: {showHead: false, showBar: false, anonymous: true}
    },
    {
      path: '/previewXls',
      name: 'previewXls',
      component: resolve => require(['../components/preview/PreviewXls.vue'], resolve),
      meta: {showHead: false, showBar: false, anonymous: true}
    },
    {
      path: '/pushNews',
      name: 'pushNews',
      component: resolve => require(['../components/PushNews.vue'], resolve),
      meta: {showHead: true, showBar: false, title: '消息推送', anonymous: true}
    }
  ]
})
