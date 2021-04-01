<template>
  <div class="teaAssessStuLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="assessStuSemester">
      <cell>
        <popup-picker :data="semesterList" @on-change="onChangeSemesterValue">
           <span slot="title" class="vux-label">
             <a class="semesterValue">{{semesterValue}}</a>
           </span>
        </popup-picker>
        <span slot="after-title" class="vux-label">
          <span style="position: relative;top: 5px;">选择学期</span>
        </span>
      </cell>
    </group>
    <group class="assessStuLstGroup">
      <cell v-for="(te,tIdx) in teaEvalStuLst" :key="tIdx">
          <span slot="after-title" class="vux-label">
            <span>{{te.Subject}}</span>
            <br/>
            <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-right:0;">&#xe601;</span>
            <span class="startDay">{{te.StartDay}} </span>
            <span class="endDay">~ {{te.EndDay}}</span>
            <br/>
            <span v-for="(target,aIdx) in te.TargetList" :key="aIdx" class="thirdLine">
              <span class="goAssessPage" v-if="te.IsTimeout === true" @click="goTeaAssessStuSub(te.Subject,target.EmployeeType,target.KCMC,target.NameCode,target.TableId,target.TargetId,target.ResultId,target.InputOnly)">
                <span>{{target.NameCode}}</span>
                <span style="padding-left: 8px;">{{target.TableName}}</span>
                <span v-if="target.ResultId" slot="icon" class="school-wx-icon" style="float: right;padding-right: 0;">&#xe65c;</span>
              </span>
              <span v-else>
                <span>{{target.NameCode}}</span>
                <span style="padding-left: 8px;">{{target.TableName}}</span>
                <span v-if="target.ResultId" slot="icon" class="school-wx-icon" style="float: right;padding-right: 0;">&#xe65c;</span>
              </span>
            </span>
          </span>
      </cell>
    </group>
    <!--<actionsheet v-model="showSemesterLstMsg" :menus="semesterLst" show-cancel @on-click-menu="getSemesterValue"></actionsheet>-->
  </div>
</template>
<script>
 /* import Actionsheet from 'vux/src/components/actionsheet/index.vue'*/
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'

  import PopupPicker from 'vux/src/components/popup-picker/index.vue'

  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  export default {
    name: "teaAssessStuLst",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      PopupPicker,
      Cell,
      Group
    },
    methods: {
        /*清除跳转到测评试卷页面的的数据*/
      clearSessionData () {
        sessionStorage.removeItem("teaAssessSubject");
        sessionStorage.removeItem("teaAssesseEmployeeType");
        sessionStorage.removeItem("teaAssessKCMC");
        sessionStorage.removeItem("teaAssessNameCode");
        sessionStorage.removeItem("teaAssessTableId");
        sessionStorage.removeItem("teaAssessTargetId");
        sessionStorage.removeItem("teaAssessResultId");
      },
        /*选择学期*/
      onChangeSemesterValue (val) {
        this.semesterValue = val[0];
        console.log(this.semesterValue);
        for (let i=0; i< this.semesterData.length; i++) {
          // 得到学期名称对应的学期id
          if (this.semesterValue === this.semesterData[i].XQMC) {
            this.xqId = this.semesterData[i].XQID;
            break;
          }
        }
        console.log(this.xqId);
      },
      // 跳转到教师测评学生试题
      goTeaAssessStuSub (subject, employeeType, KCMC, nameCode, tableId, targetId, resultId, InputOnly) {
        // 存相关数据
        sessionStorage.setItem("teaAssessSubject", subject);
        sessionStorage.setItem("teaAssesseEmployeeType", employeeType);
        sessionStorage.setItem("teaAssessKCMC", KCMC);
        sessionStorage.setItem("teaAssessNameCode", nameCode);
        sessionStorage.setItem("teaAssessTableId", tableId);
        sessionStorage.setItem("teaAssessTargetId", targetId);
        sessionStorage.setItem("teaAssessResultId", resultId);
        sessionStorage.setItem("teaAssessInputOnly", InputOnly);
        sessionStorage.setItem("teaAssessXQID", this.xqId); // 选择学期id 后把学期id 存sessionStorage中
        sessionStorage.setItem("teaAssessSemesterMC", this.semesterValue)
        this.$router.push({path: '/teacherAssess/teaAssessStuSubject'});
      },
      // 获取学期列表
      async getSysEvalSemesterData() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSysEvalSemesterData'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        this.semesterData = d;
        for (let i=0; i<this.semesterData.length; i++){
          this.semesterLst[i] = d[i].XQMC;
          if (d[i].CurrentXQ === true){
            this.semesterValue = d[i].XQMC; // 得到当前学期名称
            this.xqId = d[i].XQID; // 得到当前学期id
          }
        }
        // 判断sessionStorage中是否存有学期名称和学期id
        if (sessionStorage.getItem("teaAssessSemesterMC") !== null && sessionStorage.getItem("teaAssessXQID") !== null) {
          this.semesterValue = sessionStorage.getItem("teaAssessSemesterMC");
          this.xqId = sessionStorage.getItem("teaAssessXQID");
          sessionStorage.removeItem("teaAssessSemesterMC");
          sessionStorage.removeItem("teaAssessXQID");
        }
        // 没有找到当前学期
        if (this.semesterValue === '') {
          this.semesterValue = d[0].XQMC; // 得到当前学期名称
          this.xqId = d[0].XQID; // 得到当前学期id
        }
        this.semesterList.push(this.semesterLst);
      },
      GetTeaEvalStuLstData () {
        this.teaEvalStuLst = [{"Subject": "17学生测评",
          "StartDay": "2017年11月30日",
          "EndDay": "2018年01月26日",
          "XQMC": "2017学年第一学期",
          "TargetList": [{"TargetId": 1, "NameCode": "万涛", "TableName": "学生", "ResultId": "90", "TableId": 4, "KCMC": "经济政治与社会", "EmployeeType": 10, "InputOnly": false}],
          "IsTimeout": true,
          "AllowInput": false}, {"Subject": "17学生测评",
            "StartDay": "2017年11月30日",
            "EndDay": "2018年01月26日",
            "XQMC": "2017学年第一学期",
            "TargetList": [{"TargetId": 2, "NameCode": "李乐", "TableName": "学生", "ResultId": "90", "TableId": 4, "KCMC": "经济政治与社会", "EmployeeType": 10, "InputOnly": false}],
            "IsTimeout": true,
            "AllowInput": false}];
      }
    },
    created () {
      this.getSysEvalSemesterData();
      this.GetTeaEvalStuLstData(); // 加载学期测评列表
      this.clearSessionData(); // 清除sessionStorage中的数据
    },
    data () {
      return {
        loading: false,
        semesterData: [], // 学期数据
        semesterLst: [], // 学期列表
        semesterList: [], // 学期列表
        showSemesterLstMsg: false,
        semesterValue: '', // 学期的名称
        xqId: 0, // 学期id
        teaEvalStuLst: [] // // 测评数据
      }
    }
  }
</script>
<style scoped>
  .teaAssessStuLst .assessStuSemester .semesterValue{
    font-size: 16px;
    color: #666666;
  }
  .teaAssessStuLst .startDay,
  .teaAssessStuLst .endDay{
    font-size: 14px;
    color: #999999;
  }
  .teaAssessStuLst.thirdLine{
    color: #666666;
  }
  .teaAssessStuLst .thirdLine .goAssessPage{
    color: #0f89e0;
    display: block;
    overflow: hidden;
  }
</style>
<style>
  .teaAssessStuLst .assessStuSemester .weui-cells{
    margin-top: -10px;
  }
  .teaAssessStuLst .assessStuSemester .weui-cells .weui-cell_access{
    padding-bottom: 0 !important;
  }
  .teaAssessStuLst .assessStuLstGroup .weui-cell:before{
    left:0;
  }
  .teaAssessStuLst .weui-cells{
    margin-top: -1px;
  }
  .teaAssessStuLst .weui-cells .vux-label{
    color: #333333;
  }
  /*状态值面板*/
  .teaAssessStuLst .weui-actionsheet__menu .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
  .teaAssessStuLst .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
</style>
