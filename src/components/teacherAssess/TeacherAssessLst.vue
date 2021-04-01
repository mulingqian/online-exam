<template>
  <div class="teacherAssessLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group style="margin-top: -20px;">
      <popup-picker
        title="选择学期"
        v-model="semesterValue"
        :data="semesterList"
        @on-change="onChangeSemesterValue">
      </popup-picker>
    </group>
    <group class="teaAssessLstGroup">
      <cell v-for="(te,tIdx) in teaEvalList" :key="tIdx">
          <span slot="after-title" class="vux-label">
            <span>{{te.Subject}}</span>
            <br/>
            <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-right:8px;">&#xe601;</span>
            <span class="startDay">{{te.StartDay}} </span>
            <span class="endDay">~ {{te.EndDay}}</span>
            <br/>
            <span
              v-for="(target,aIdx) in te.TargetList"
              :key="aIdx" class="thirdLine">
              <span
                class="goAssessPage"
                v-if="te.IsTimeout === true"
                @click="goTeaAssessKaoPing(te.Subject,target)">
                <span>{{target.NameCode}}</span>
                <span style="padding-left: 8px;">{{target.TableName}}</span>
                <span v-if="target.ResultId > 0" slot="icon" class="school-wx-icon" style="float: right;padding-right: 0;">&#xe65c;</span>
              </span>
              <span v-else @click="accesssTipsTimeOut()">
                <span>{{target.NameCode}}</span>
                <span style="padding-left: 8px;">{{target.TableName}}</span>
                <span v-if="target.ResultId > 0" slot="icon" class="school-wx-icon" style="float: right;padding-right: 0;">&#xe65c;</span>
              </span>
            </span>
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
    name: "teacherAssessLst",
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
      // 清除 跳转到 测试试卷页面保存在sessionStorage中的数据
      clearTeaAssessStorage () {
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
        this.semesterValue[0] = val[0];
        for (let i=0; i< this.semesterData.length; i++) {
          // 得到学期名称对应的学期id
          if (this.semesterValue[0] === this.semesterData[i].XQMC) {
            this.xqId = this.semesterData[i].XQID;
            break;
          }
        }
        this.GetTeaEvalListData(); // 加载当前学期测评列表
      },
      // 获取学期列表
      async getSysEvalSemesterData() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSysEvalSemesterData'});
        if (d.status && d.status === "error") {
          // this.QD.alert(`获取数据失败:${d.msg}`);
          console.log(`获取数据失败:${d.msg}`);
          return;
        }
        this.semesterData = d;
        console.log("获取学期列表", d);
        for (let i=0; i<this.semesterData.length; i++){
          this.semesterLst[i] = d[i].XQMC;
          if (d[i].CurrentXQ === true){
            this.semesterValue = [];
            this.semesterValue.push(d[i].XQMC); // 得到当前学期名称
            this.xqId = d[i].XQID; // 得到当前学期id
          }
        }
        if (sessionStorage.getItem("teaAssessXQID") !== null && sessionStorage.getItem("teaAssessXQMC") !== null) {
          this.semesterValue = [];
          this.xqId = parseInt(sessionStorage.getItem("teaAssessXQID")); // 取sessionStorage中存放的学期id并赋值
          this.semesterValue.push(sessionStorage.getItem("teaAssessXQMC"));
          sessionStorage.removeItem("teaAssessXQID");
          sessionStorage.removeItem("teaAssessXQMC");
          // console.log('缓存取学期', this.semesterValue);
        }
        // 没有找到当前学期
        if (this.semesterValue.length === 0) {
          this.semesterValue.push(d[0].XQMC); // 得到当前学期名称
          this.xqId = d[0].XQID; // 得到当前学期id
        }
        this.semesterList.push(this.semesterLst);
        this.GetTeaEvalListData(); // 加载当前学期测评列表
      },
      // 加载当前学期测评列表
      async GetTeaEvalListData() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetTeaEvalListData', xqid: this.xqId});
        if (d.status && d.status === "error") {
          // this.QD.alert(`获取数据失败:${d.msg}`);
          console.log(`获取学期测评列表数据失败:${d.msg}`);
          return;
        }
        console.log("获取学期测评列表数据", d)
        this.loading = false;
        this.teaEvalList = d;
      },
      // 跳转到教师测评试题 te.Subject,target.EmployeeType,target.KCMC,target.NameCode,target.TableId,target.TargetId
      goTeaAssessKaoPing (subject, target) {
        console.log("goTeaAssessKaoPing......", subject, target);
        // 存相关数据
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
        sessionStorage.setItem("teaAssessXQMC", this.semesterValue[0]); // 当前选择学期id 对应的学期名称
        this.$router.push({path: '/teacherAssess/teacherAssessKaoPing'});
      },
      accesssTipsTimeOut () {
        this.QD.alert('', '当前测评已过时，无法进行考评！');
      }
    },
    created () {
      this.getSysEvalSemesterData();
      // 清除 跳转到 测试试卷页面保存在sessionStorage中的数据
      this.clearTeaAssessStorage();
    },
    data () {
      return {
        loading: false,
        semesterData: [], // 学期数据
        semesterLst: [], // 学期列表
        semesterList: [], // 学期列表
        showSemesterLstMsg: false,
        semesterValue: [], // 学期的名称
        xqId: 0, // 学期id
        teaEvalList: [], // 测评数据
        targetList: [] // 被测评教师列表
      }
    }
  }
</script>
<style scoped>
  .teaAssessLstGroup{
    margin-top: -20px;
  }
  .teacherAssessLst .vux-label{
    color: #333333;
  }
  .teacherAssessLst .startDay,
  .teacherAssessLst .endDay{
    font-size: 14px;
    color: #999999;
  }
  .teacherAssessLst .thirdLine{
    display: block;
    color: #666666;
    border-top: 1px solid #f2f2f2;
    padding: 4px 0;
  }
  .teacherAssessLst .thirdLine .goAssessPage{
    color: #0f89e0;
    display: block;
    overflow: hidden;
  }
</style>
