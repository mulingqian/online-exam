<template>
  <div></div>
</template>
<script>
  export default {
    name: 'oaMenuData',
    computed: {},
    data () {
      return {}
    },
    created () {
      this.isGetOAMyOfficeLst(); // 是否 通过接口获取OA办公菜单
    },
    mounted () {
    },
    methods: {
      // 是否 通过接口获取OA办公菜单
      isGetOAMyOfficeLst () {
        if (this.QD.OAHOST !== null && this.QD.OAHOST !== '') {
          this.getMyOfficeLst(); // 得到'我的办公'
        } else {
          let officeMenuList = [];
          this.$emit('get-oaMenu', officeMenuList);
        }
      },
      // 得到‘我的办公’模块--通过接口获取
      async getMyOfficeLst () {
        let officeMenuList = [];
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetUserMenus'});
        if (d.status && d.status === "error") {
          console.log("oa menus 报错", d.msg);
          this.$emit('get-oaMenu', officeMenuList);
          return;
        }
        let data = d.data;
        if (data.length > 0) {
          for (let i=0; i<data.length; i++) {
            // 新闻发布
            if (data[i].applyCellId === 'OA_FLOW_SQ_XWFB') {
              officeMenuList.push({
                cid: 'OA_FLOW_SQ_XWFB',
                title: '新闻',
                url: {
                  path: '/newsPublish/newsPublish',
                  replace: false
                },
                iconContent: '&#xe667',
                iconColor: '#108fe9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_GGFB') { // 公告发布
              officeMenuList.push({
                cid: 'OA_FLOW_SQ_GGFB',
                title: '公告',
                url: {
                  path: '/noticePublish/noticePublish',
                  replace: false
                },
                iconContent: '&#xe6ce',
                iconColor: '#108fe9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_HYSQ') { // 会议
              officeMenuList.push({
                cid: 'OA_FLOW_SQ_HYSQ',
                title: '会议申请',
                url: {
                  path: '/meetingApply/meetingApply',
                  replace: false
                },
                iconContent: '&#xe636',
                iconColor: '#e96a25'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_FWGL') { // 校内发文
              officeMenuList.push({
                cid: 'OA_FLOW_SQ_FWGL',
                title: '校内发文',
                url: {
                  path: '/campusDispatch/campusDispatch',
                  replace: false
                },
                iconContent: '&#xe64e',
                iconColor: '#108fe9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_SWGL') { // 收文
              officeMenuList.push({
                cid: 'OA_FLOW_SQ_SWGL',
                title: '收文管理',
                url: {
                  path: '/receiptFile/receiptFileManage',
                  replace: false
                },
                iconContent: '&#xe637',
                iconColor: '#e96a25'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_ZGQJ') {
              officeMenuList.push({
                cid: 'OA_FLOW_SQ_ZGQJ',
                title: '职工请假',
                url: {
                  path: '/employeeLeave/employeeLeave',
                  replace: false
                },
                iconContent: '&#xe63a',
                iconColor: '#8e82e9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_KQSQ') {
              officeMenuList.push({
                cid: 'OA_FLOW_SQ_KQSQ',
                title: '考勤',
                url: {
                  path: '/attendance/teaAttendance',
                  replace: false
                },
                iconContent: '&#xe639',
                iconColor: '#8e82e9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_BXSQ') {
              officeMenuList.push({
                cid: 'OA_FLOW_SQ_BXSQ',
                title: '补休',
                url: {
                  path: '/deferHolidays/deferHolidays',
                  replace: false
                },
                iconContent: '&#xe64b',
                iconColor: '#8e82e9'
              })
            }
          }
        }
        // 将 ‘我的办公’添加进 ‘全部应用’中
        console.log("oa", officeMenuList);
        this.$emit('get-oaMenu', officeMenuList);
      }
    }
  }
</script>
