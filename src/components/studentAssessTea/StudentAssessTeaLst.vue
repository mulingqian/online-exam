<template>
  <div class="studentAssessLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="assessTeaSemester" v-if="this.QD.stuAssessTeaIsAllowCheckXQ">
      <cell>
        <popup-picker
          :data="semesterList"
          @on-change="onChangeSemesterValue">
           <span slot="title" class="vux-label">
             <a class="semesterValue">{{semesterValue}}</a>
           </span>
        </popup-picker>
        <span slot="after-title" class="vux-label">
          <span style="position: relative;top: 5px;">选择学期</span>
        </span>
      </cell>
    </group>
    <group class="assessTeaSemester" v-if="!this.QD.stuAssessTeaIsAllowCheckXQ">
      <cell title="当前学期：" :value="semesterValue" class="semesterValue" style="position: relative;top: 5px;padding: 16px;"></cell>
    </group>
    <group v-if="teaEvalList.length > 0">
      <cell v-for="(te,tIdx) in teaEvalList" :key="tIdx">
          <span slot="after-title" class="vux-label">
            <span>{{te.Subject}}</span>
            <br/>
            <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-right:0;">&#xe601;</span>
            <span class="startDay">{{te.StartDay}} </span>
            <span class="endDay">~ {{te.EndDay}}</span>
            <br/>
            <div v-for="(target,aIdx) in te.TargetList" :key="aIdx" class="thirdLine">
              <span class="goAssessPage" v-if="te.IsTimeout === true" @click="goStuAssessKaoPing(te.Subject,target)">
                <span>{{aIdx + 1}}.{{target.NameCode.split('/')[0]}}老师:</span>
                <span style="padding-left: 8px;">{{target.KCMC}}</span>
                <span v-if="target.ResultId > 0" slot="icon" class="school-wx-icon" style="float: right;padding-right: 0;">&#xe65c;</span>
              </span>
              <span v-else @click="accesssTipsTimeOut()">
                <span>{{aIdx + 1}}.{{target.NameCode.split('/')[0]}}老师:</span>
                <span style="padding-left: 8px;">{{target.KCMC}}</span>
                <span v-if="target.ResultId > 0" slot="icon" class="school-wx-icon" style="float: right;padding-right: 0;">&#xe65c;</span>
              </span>
            </div>
          </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'

  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  export default {
    name: "studentAssessTeaLst",
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
      /*选择学期*/
      onChangeSemesterValue (val) {
        this.semesterValue = val[0];
        for (let i=0; i< this.semesterData.length; i++) {
          // 得到学期名称对应的学期id
          if (this.semesterValue === this.semesterData[i].XQMC) {
            this.xqId = this.semesterData[i].XQID;
            break;
          }
        }
        this.GetTeaEvalListData(); // 加载当前学期测评列表
      },
      // 获取学期列表
      async getSysEvalSemesterData() {
        this.isLoading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSysEvalSemesterData'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.semesterData = d;
        this.isLoading = false;
        for (let i=0; i<this.semesterData.length; i++){
          this.semesterLst[i] = d[i].XQMC;
          if (d[i].CurrentXQ === true){
            this.semesterValue = d[i].XQMC; // 得到当前学期名称
            this.xqId = d[i].XQID; // 得到当前学期id
          }
        }
        if (sessionStorage.getItem("teaAssessXQID") !== null && sessionStorage.getItem("stuAssessXQMC") !== null) {
          this.xqId = parseInt(sessionStorage.getItem("teaAssessXQID")); // 取sessionStorage中存放的学期id并赋值
          this.semesterValue = sessionStorage.getItem("stuAssessXQMC");
          sessionStorage.removeItem("teaAssessXQID");
          sessionStorage.removeItem("stuAssessXQMC");
        }
        // 没有找到当前学期
        if (this.semesterValue === '') {
          this.semesterValue = d[0].XQMC; // 得到当前学期名称
          this.xqId = d[0].XQID; // 得到当前学期id
        }
        this.semesterList.push(this.semesterLst);
        this.GetTeaEvalListData(); // 加载当前学期测评列表
      },
      // 加载当前学期测评列表
      async GetTeaEvalListData() {
        this.isLoading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuEvalListData', xh: this.QD.getLocalUserinfo().stuObj.XH, xqid: this.xqId});
        if (d.status && d.status === "error") {
          // this.QD.alert(`获取数据失败:${d.msg}`);
          console.log(`获取数据失败:${d.msg}`);
        } else {
          this.teaEvalList = d;
        }
        this.isLoading = false;
      },
      // 跳转到教师测评试题 te.Subject,target.EmployeeType,target.KCMC,target.NameCode,target.TableId,target.TargetId
      //target.EmployeeType,target.KCMC,target.NameCode,target.TableId,target.TargetId,target.ResultId,target.InputOnly,target.MaxScore,target.MinScore, target.AllowInput
      goStuAssessKaoPing (subject, target) {
        console.log('点击的测评试题信息', subject, target)
        // 存相关数据GetTeaSysEvalItemData
        sessionStorage.setItem("teaAssessSubject", subject);
        sessionStorage.setItem("teaAssesseEmployeeType", target.EmployeeType);
        sessionStorage.setItem("teaAssessKCMC", target.KCMC);
        sessionStorage.setItem("teaAssessNameCode", target.NameCode);
        sessionStorage.setItem("teaAssessTableId", target.TableId);
        sessionStorage.setItem("teaAssessTargetId", target.TargetId);
        sessionStorage.setItem("teaAssessResultId", target.ResultId);
        sessionStorage.setItem("teaAssessInputOnly", target.InputOnly);
        sessionStorage.setItem("teaAssessMaxScore", target.MaxScore);
        sessionStorage.setItem("teaAssessMinScore", target.MinScore);
        sessionStorage.setItem("teaAssessAllowInput", target.AllowInput);
        sessionStorage.setItem("teaAssessXQID", this.xqId); // 选择学期id 后把学期id 存sessionStorage中
        sessionStorage.setItem("stuAssessXQMC", this.semesterValue); // 选择学期id 对应的学期名称
        this.$router.push({path: '/studentAssessTea/studentAssessTeaKaoPing'});
      },
      accesssTipsTimeOut () {
        this.QD.alert('', '当前测评已过时，无法进行考评！');
      },
      // 清除跳转到 学生测评试卷保存在sessionStorage中的数据
      clearStuSession () {
        sessionStorage.removeItem("teaAssessSubject");
        sessionStorage.removeItem("teaAssesseEmployeeType");
        sessionStorage.removeItem("teaAssessKCMC");
        sessionStorage.removeItem("teaAssessNameCode");
        sessionStorage.removeItem("teaAssessTableId");
        sessionStorage.removeItem("teaAssessTargetId");
        sessionStorage.removeItem("teaAssessResultId");
      }
    },
    created () {
      this.getSysEvalSemesterData();
      this.clearStuSession(); // 清除跳转到 学生测评试卷保存在sessionStorage中的数据
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
        teaEvalList: [], // 测评数据
        targetList: [] // 被测评教师列表
      }
    }
  }
</script>
<style scoped>
  .studentAssessLst .assessTeaSemester .semesterValue{
    font-size: 16px;
    color: #666666;
  }
  .studentAssessLst .vux-label{
    color: #333333;
  }
  .studentAssessLst .startDay,
  .studentAssessLst .endDay{
    font-size: 14px;
    color: #999999;
  }
  .studentAssessLst .thirdLine{
    padding: 8px 0;
    color: #666666;
    overflow: hidden;
  }
  .studentAssessLst .thirdLine .goAssessPage{
    color: #0f89e0;
    display: block;
    overflow: hidden;
  }
</style>
<style>
  .studentAssessLst .assessTeaSemester .weui-cells{
    margin-top: -10px;
  }
  .studentAssessLst .assessTeaSemester .weui-cells .weui-cell_access{
    padding-bottom: 0 !important;
  }
  .studentAssessLst .weui-cells{
    margin-top: -1px;
  }
</style>
