<template>
  <div class="selectMultiTeacher">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="allDepartmentAndEmployee">
      <div class="allDepartment">
        <a>部门<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="false" height="-95" style="background-color: #f2f2f2;">
          <div>
            <a v-if="departmentData.length !== 0" :class="{'clickBgColor':dIdx === isDepartActive}" v-for="(depart, dIdx) in departmentData" v-on:click="getEmployeeLst(depart.KSH,dIdx)" :key="dIdx">{{depart.KSMC}}</a>
          </div>
        </scroller>
      </div>
      <div class="employeeLst">
        <a style="text-align: center;padding: 10px 15px;">姓名<span class="school-wx-icon" slot="icon" style="color:#666666;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="false" height="-95" style="background-color: #f2f2f2;">
          <div>
            <a v-for="(employee, eIdx) in employeeData" :key="eIdx" @click="chooseEmployee(eIdx)" v-if="employeeData.length !== 0">
              <span :class="`school-wx-icon ${employeeData[eIdx].selectedEmploy === true ? 'selectedMultiEmployeeIcon' : 'noSelectMultiEmployeeIcon'}`" slot="icon"></span>
              <span>{{employee.XM}}</span>
            </a>
            <span style="display: inline-block;height: 50px;width: 100%;"></span>
          </div>
        </scroller>
        <div class="finishMultiTea" @click="getSelectEmployData()"><a>完成</a></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Scroller from 'vux/src/components/scroller/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  export default {
    name: "selectMultiTeacher",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Scroller
    },
    methods: {
      // 获取部门列表
      async getAllDepartment() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetAllDepartmentDataList'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.departmentData = d;
        this.getEmployeeData(this.departmentData[0].KSH); // 获取第一列部门中的教师信息
      },
      // 根据部门代码查询教师信息
      async getEmployeeData(ksh) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetEmployeeDataList', ksh: ksh});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        this.employeeData = d;
        // 添加selectedEmploy字段 赋值为false
        for (let i=0; i<this.employeeData.length; i++) {
          this.employeeData[i].selectedEmploy = false;
        }
        /*判断当前教师姓名中是否已经有之前选中的教师*/
        // 公文流转
        if (this.zghOrUserId === 0){
          console.log("this.zghOrUserId === 0");
          // 公文流转添加页面
          this.getZGHLst(this.selectedEmployeeZGHLst);
        }
        // 用UserId判断
        if (this.zghOrUserId === 1){
          // 新闻发布
          if (this.$route.query.page === 'newsPublishDetail') {
            this.getUserIdLst(this.selectedEmployeeUserIdLst);
          }
          // 公告发布
          if (this.$route.query.page === 'noticePublishDetail') {
            this.getUserIdLst(this.selectedEmployeeUserIdLst);
          }
          if (this.$route.query.page === 'campusDispatchDetail') {
            // 校内发文
            this.getUserIdLst(this.selectedEmployeeUserIdLst);
          }
          if (this.$route.query.page === 'receiptFileManageDetail') {
            // 校内发文
            this.getUserIdLst(this.selectedEmployeeUserIdLst);
          }
          if (this.$route.query.page === 'meetingApplyDetail') {
            // 会议申请
            this.getUserIdLst(this.selectedEmployeeUserIdLst);
          }
          if (this.$route.query.page === 'employeeLeaveDetail') {
            // 职工请假
            this.getUserIdLst(this.selectedEmployeeUserIdLst);
          }
          if (this.$route.query.page === 'teaAttendanceDetail') {
            // 考勤
            this.getUserIdLst(this.selectedEmployeeUserIdLst);
          }
          if (this.$route.query.page === 'deferHolidaysDetail') {
            // 补休
            this.getUserIdLst(this.selectedEmployeeUserIdLst);
          }
          if (this.$route.query.page === 'fieldMultiSTea') {
            // 组件 fieldMultiSTea.vue
            this.getUserIdLst(this.selectedEmployeeUserIdLst);
          }
        }
      },
      // 用UserId 判断 之前选择的教职工
      getUserIdLst(userIdLst) {
        console.log("getUserIdLst");
        for (let i=0; i<userIdLst.length; i++) {
          for (let j=0; j<this.employeeData.length; j++) {
            if (userIdLst[i] === this.employeeData[j].UserId) {
              this.employeeData[j].selectedEmploy = true;
              break;
            }
          }
        }
      },
      // 用zgh 判断 之前选择的教职工
      getZGHLst(zghLst) {
        console.log("getZGHLst");
        for (let i=0; i<zghLst.length; i++) {
          for (let j=0; j<this.employeeData.length; j++) {
            if (zghLst[i] === this.employeeData[j].ZGH) {
              this.employeeData[j].selectedEmploy = true;
              break;
            }
          }
        }
      },
      // 根据不同部门的代码获取教师信息
      getEmployeeLst (ksh, idx) {
        this.getEmployeeData(ksh);
        this.isDepartActive = idx; // 给选中当前的部门添加背景颜色
      },
      // 点击教师姓名事件
      chooseEmployee (idx) {
          // 是否选中
        this.employeeData[idx].selectedEmploy = !this.employeeData[idx].selectedEmploy;
        this.$set(this.employeeData, idx, this.employeeData[idx]);
        if (this.employeeData[idx].selectedEmploy === true) {
          this.selectedEmployeeNameLst.push(this.employeeData[idx].XM);
          this.selectedEmployeeZGHLst.push(this.employeeData[idx].ZGH);
          this.selectedEmployeeUserIdLst.push(this.employeeData[idx].UserId);
        } else {
            // 去掉重复的
          for (let i=0; i<this.selectedEmployeeNameLst.length; i++) {
            if (this.selectedEmployeeZGHLst[i] === this.employeeData[idx].ZGH && this.zghOrUserId === 0) {
              this.selectedEmployeeNameLst.splice(i, 1);
              this.selectedEmployeeZGHLst.splice(i, 1);
            }
            if (this.selectedEmployeeUserIdLst[i] === this.employeeData[idx].UserId && this.zghOrUserId === 1) {
              this.selectedEmployeeNameLst.splice(i, 1);
              this.selectedEmployeeUserIdLst.splice(i, 1);
            }
          }
        }
      },
      // 点击 完成 后做处理
      getSelectEmployData () {
        // 存选择教师的姓名
        let name = this.selectedEmployeeNameLst.join();
        // 存选择教师的UserId
        let userId = this.selectedEmployeeUserIdLst.join();
        let zgh = this.selectedEmployeeZGHLst.join();
        if (name === '') {
          this.QD.alert('', '请选择');
          return;
        }
        if (this.$route.query.page === 'newsPublishDetail') {
            // 新闻发布详情 page
          sessionStorage.setItem("selectMultiEmployeeNameLst_newsPublish", name);
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_newsPublish", userId);
          console.log("userId is", userId);
          //this.$router.replace({path: '/newsPublish/newsPublishDetail',
          // query: {type: this.$route.query.type, id: this.$route.query.id, aId: this.$route.query.aId, rId: this.$route.query.rId}}); // 返回到'新闻发布详情'页面
          if (this.backLoaded) {
            this.backLoaded = false;
            this.$router.go(-1);
          }
        } else if (this.$route.query.page === 'noticePublishDetail') {
            // 公告发布详情 page
          sessionStorage.setItem("selectMultiEmployeeNameLst_noticePublish", name); // 存选择教师的姓名
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_noticePublish", userId); // 存选择教师的UserId
          if (this.backLoaded) {
            this.backLoaded = false;
            this.$router.go(-1);
          }
        } else if (this.$route.query.page === 'campusDispatchDetail') {
          // 校内发文详情
          sessionStorage.setItem("selectMultiEmployeeNameLst_campusDispatch", name); // 存选择教师的姓名
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_campusDispatch", userId); // 存选择教师的UserId
          if (this.backLoaded) {
            this.backLoaded = false;
            this.$router.go(-1);
          }
        } else if (this.$route.query.page === 'receiptFileManageDetail') {
            // 收文管理
          sessionStorage.setItem("selectMultiEmployeeNameLst_receiptFileManage", name); // 存选择教师的姓名
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_receiptFileManage", userId); // 存选择教师的UserId
          if (this.backLoaded) {
            this.backLoaded = false;
            this.$router.go(-1);
          }
        } else if (this.$route.query.page === 'meetingApplyDetail') {
            // 会议申请
          sessionStorage.setItem("selectMultiEmployeeNameLst_meetingApplyDetail", name); // 存选择教师的姓名
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_meetingApplyDetail", userId); // 存选择教师的UserId
          if (this.backLoaded) {
            this.backLoaded = false;
            this.$router.go(-1);
          }
        } else if (this.$route.query.page === 'employeeLeaveDetail') {
            // 职工请假
          sessionStorage.setItem("selectMultiEmployeeNameLst_employeeLeave", name); // 存选择教师的姓名
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_employeeLeave", userId); // 存选择教师的UserId
          if (this.backLoaded) {
            this.backLoaded = false;
            this.$router.go(-1);
          }
        } else if (this.$route.query.page === 'teaAttendanceDetail') {
            // 考勤
          sessionStorage.setItem("selectMultiEmployeeNameLst_teaAttendanceDetail", name); // 存选择教师的姓名
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_teaAttendanceDetail", userId); // 存选择教师的UserId
          if (this.backLoaded) {
            this.backLoaded = false;
            this.$router.go(-1);
          }
        } else if (this.$route.query.page === 'deferHolidaysDetail') {
            // 补休
          sessionStorage.setItem("selectMultiEmployeeNameLst_deferHolidaysDetail", name); // 存选择教师的姓名
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_deferHolidaysDetail", userId); // 存选择教师的UserId
        } else if (this.$route.query.page === 'fieldMultiSTea') {
            // 组件fieldMultiSTea.vue
          sessionStorage.setItem("selectMultiEmployeeNameLst_fieldMultiSTea", name); // 存选择教师的姓名
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_fieldMultiSTea", userId); // 存选择教师的UserId
          if (this.backLoaded) {
            this.backLoaded = false;
            this.$router.go(-1);
          }
        } else {
            // 公文流转申请 page
          sessionStorage.setItem("selectMultiEmployeeNameLst", name);
          sessionStorage.setItem("selectMultiEmployeeZGHLst", zgh); // 存选择教师的职工号
          if (this.backLoaded) {
            this.backLoaded = false;
            this.$router.go(-1);
          }
        }
      },
      // 得到选择教师的数据
      getSelectEmployeeData () {
          // 新闻发布详情 page
        if (this.$route.query.page === 'newsPublishDetail') {
          if (sessionStorage.getItem("selectMultiEmployeeNameLst_newsPublish") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_newsPublish") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst_newsPublish").split(",");
            this.selectedEmployeeUserIdLst = sessionStorage.getItem("selectMultiEmployeeUserIdLst_newsPublish").split(",");
          }
          //  判断是‘职工号’0,还是‘UserId’1,获取之前选择的教职工
          this.zghOrUserId = 1;
        } else if (this.$route.query.page === 'noticePublishDetail') {
          // 公告发布详情 page
          if (sessionStorage.getItem("selectMultiEmployeeNameLst_noticePublish") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_noticePublish") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst_noticePublish").split(",");
            this.selectedEmployeeUserIdLst = sessionStorage.getItem("selectMultiEmployeeUserIdLst_noticePublish").split(",");
          }
          //  判断是‘职工号’0,还是‘UserId’1,获取之前选择的教职工
          this.zghOrUserId = 1;
        } else if (this.$route.query.page === 'campusDispatchDetail') {
            // 校内发文详情 page
          if (sessionStorage.getItem("selectMultiEmployeeNameLst_campusDispatch") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_campusDispatch") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst_campusDispatch").split(",");
            this.selectedEmployeeUserIdLst = sessionStorage.getItem("selectMultiEmployeeUserIdLst_campusDispatch").split(",");
          }
          //  判断是‘职工号’0,还是‘UserId’1,获取之前选择的教职工
          this.zghOrUserId = 1;
        } else if (this.$route.query.page === 'receiptFileManageDetail') {
            // 收文管理详情页面
          if (sessionStorage.getItem("selectMultiEmployeeNameLst_receiptFileManage") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_receiptFileManage") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst_receiptFileManage").split(",");
            this.selectedEmployeeUserIdLst = sessionStorage.getItem("selectMultiEmployeeUserIdLst_receiptFileManage").split(",");
          }
          this.zghOrUserId = 1;
        } else if (this.$route.query.page === 'meetingApplyDetail') {
            // 会议申请 page
          if (sessionStorage.getItem("selectMultiEmployeeNameLst_meetingApplyDetail") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_meetingApplyDetail") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst_meetingApplyDetail").split(",");
            this.selectedEmployeeUserIdLst = sessionStorage.getItem("selectMultiEmployeeUserIdLst_meetingApplyDetail").split(",");
          }
          this.zghOrUserId = 1;
        } else if (this.$route.query.page === 'employeeLeaveDetail') {
            // 职工请假 page
          if (sessionStorage.getItem("selectMultiEmployeeNameLst_employeeLeave") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_employeeLeave") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst_employeeLeave").split(",");
            this.selectedEmployeeUserIdLst = sessionStorage.getItem("selectMultiEmployeeUserIdLst_employeeLeave").split(",");
          }
          this.zghOrUserId = 1;
        } else if (this.$route.query.page === 'teaAttendanceDetail') {
            // 考勤
          if (sessionStorage.getItem("selectMultiEmployeeNameLst_teaAttendanceDetail") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_teaAttendanceDetail") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst_teaAttendanceDetail").split(",");
            this.selectedEmployeeUserIdLst = sessionStorage.getItem("selectMultiEmployeeUserIdLst_teaAttendanceDetail").split(",");
          }
          this.zghOrUserId = 1;
        } else if (this.$route.query.page === 'deferHolidaysDetail') {
            // 补休
          if (sessionStorage.getItem("selectMultiEmployeeNameLst_deferHolidaysDetail") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_deferHolidaysDetail") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst_deferHolidaysDetail").split(",");
            this.selectedEmployeeUserIdLst = sessionStorage.getItem("selectMultiEmployeeUserIdLst_deferHolidaysDetail").split(",");
          }
          this.zghOrUserId = 1;
        } else if (this.$route.query.page === 'fieldMultiSTea') {
            // fieldMultiSTea 自定义表单流程
          if (sessionStorage.getItem("selectMultiEmployeeNameLst_fieldMultiSTea") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_fieldMultiSTea") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst_fieldMultiSTea").split(",");
            this.selectedEmployeeUserIdLst = sessionStorage.getItem("selectMultiEmployeeUserIdLst_fieldMultiSTea").split(",");
          }
          this.zghOrUserId = 1;
        } else {
          // 公文流转 page
          if (sessionStorage.getItem("selectMultiEmployeeNameLst") !== null && sessionStorage.getItem("selectMultiEmployeeZGHLst") !== null) {
            this.selectedEmployeeNameLst = sessionStorage.getItem("selectMultiEmployeeNameLst").split(",");
            this.selectedEmployeeZGHLst = sessionStorage.getItem("selectMultiEmployeeZGHLst").split(",");
          }
          //  判断是‘职工号’0,还是‘UserId’1,获取之前选择的教职工
          this.zghOrUserId = 0;
        }
        this.getAllDepartment(); // 获取部门列表
      }
    },
    beforeDestroy () {
      for (let i=0; i<this.employeeData.length; i++) {
        delete this.employeeData[i].selectedEmploy; // 删除教师信息数组selectedEmploy字段
      }
    },
    created (){
      // 得到选择教师的数据
      this.getSelectEmployeeData();
    },
    data (){
      return {
        loading: false,
        backLoaded: true,
        departmentData: [], // 部门列表
        employeeData: [], // 教师信息
        isDepartActive: 0, // 默认选中第一列的部门
        selectedEmployeeNameLst: [], // 选择教师的姓名
        selectedEmployeeZGHLst: [], // 选择教师的职工号
        selectedEmployeeUserIdLst: [], // 选择教师的UserId
        zghOrUserId: 0, //  判断是‘职工号’0,还是‘UserId’1,获取之前选择的教职工
        ksh: [] // 部门代码
      }
    }
  }
</script>
<style scoped>
  .selectMultiTeacher{ background-color: #ffffff; }
  .selectMultiTeacher .allDepartmentAndEmployee{
    overflow: hidden;
  }
  .selectMultiTeacher .allDepartmentAndEmployee .allDepartment{
    float: left;
    width:35%;
    background-color:#ffffff;
    border-right: 1px solid #f2f2f2;
  }
  .selectMultiTeacher .allDepartmentAndEmployee .allDepartment a{
    display: block;
    line-height: 1.41176471;
    text-align: center;
    padding:10px 15px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectMultiTeacher .allDepartmentAndEmployee .allDepartment .clickBgColor{
    background-color: #f2f2f2;
    color: #ffa500;
  }
  .selectMultiTeacher .allDepartmentAndEmployee .employeeLst{
    position: relative;
    float: left;
    width:64%;
    background-color:#ffffff;
    border-left: 1px solid #f2f2f2;
  }
  .selectMultiTeacher .allDepartmentAndEmployee .employeeLst a{
    display: block;
    line-height: 1.41176471;
    padding: 7px 15px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectMultiTeacher .allDepartmentAndEmployee .employeeLst .noSelectMultiEmployeeIcon:before{
    content: '\e62a';
  }
  .selectMultiTeacher .allDepartmentAndEmployee .employeeLst .selectedMultiEmployeeIcon:before{
    content: '\e692';
  }
  .selectMultiTeacher .allDepartmentAndEmployee .employeeLst .finishMultiTea{
    position:absolute;
    bottom:0;
    width:100%;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  .selectMultiTeacher .allDepartmentAndEmployee .employeeLst .finishMultiTea a{
    display: inline-block;
    padding: 8px 10px;
    font-size: 16px;
    line-height: 20px;
    color: #fff;
    border:0;
  }
</style>
<style>
  .selectMultiTeacher .allDepartmentAndEmployee .employeeLst .xs-container{ margin-top: 0; }
  .selectMultiTeacher .allDepartment .xs-container{ margin-top: 0; background-color: #ffffff;}
</style>

