<template>
  <div class="teaExamQuery">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="examXQMC">
      <span>{{xqmc}}</span>
    </div>
    <tab>
      <tab-item :selected="type === 2" @on-item-click="changeExamType(2)">期中考试</tab-item>
      <tab-item :selected="type === 3" @on-item-click="changeExamType(3)">期末考试</tab-item>
      <tab-item :selected="type === 1" @on-item-click="changeExamType(1)">补考</tab-item>
      <tab-item :selected="type === 9" @on-item-click="changeExamType(9)">其他</tab-item>
    </tab>
    <div class="bg">
      <group v-if="makeUpExam.length > 0 && type === 1" class="examQueryGroup"  v-for="(t,tIdx) in makeUpExam" :key="tIdx">
        <cell @click.native="goExamDetail(t.ExamId)" is-link>
        <span slot="after-title" class="vux-label">
          <span>补考</span>
          <!--<span v-if="t.ExamType === 2">期中考试</span>
          <span v-if="t.ExamType === 3">期末考试</span>
          <span v-if="t.ExamType === 9">其他</span>-->
          <br/>
          <span>{{t.ExamName}}</span>
          <br/>
          <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-right:0;">&#xe601;</span>
          <span>{{t.ExamDayWeek}} {{t.Times}}</span>
          <br/>
          <span slot="icon" class="school-wx-icon" style="color: #108fe9;padding-right:0;">&#xe60d;</span>
          <span>{{t.JSMC}}</span>
        </span>
        </cell>
      </group>
    </div>
    <div class="bg">
      <group v-if="midExam.length > 0 && type === 2" class="examQueryGroup" v-for="(t,tIdx) in midExam" :key="tIdx">
        <cell @click.native="goExamDetail(t.ExamId)" is-link>
        <span slot="after-title" class="vux-label">
          <span>期中考试</span>
          <br/>
          <span>{{t.ExamName}}</span>
          <br/>
          <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-right:0;">&#xe601;</span>
          <span>{{t.ExamDayWeek}} {{t.Times}}</span>
          <br/>
          <span slot="icon" class="school-wx-icon" style="color: #108fe9;padding-right:0;">&#xe60d;</span>
          <span>{{t.JSMC}}</span>
        </span>
        </cell>
      </group>
    </div>
    <div class="bg">
      <group v-if="endExam.length > 0 && type === 3" class="examQueryGroup" v-for="(t,tIdx) in endExam" :key="tIdx">
        <cell @click.native="goExamDetail(t.ExamId)" is-link>
        <span slot="after-title" class="vux-label">
          <span>期末考试</span>
          <br/>
          <span>{{t.ExamName}}</span>
          <br/>
          <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-right:0;">&#xe601;</span>
          <span>{{t.ExamDayWeek}} {{t.Times}}</span>
          <br/>
          <span slot="icon" class="school-wx-icon" style="color: #108fe9;padding-right:0;">&#xe60d;</span>
          <span>{{t.JSMC}}</span>
        </span>
        </cell>
      </group>
    </div>
    <div class="bg">
      <group v-if="otherExam.length > 0 && type === 9" class="examQueryGroup">
        <cell v-for="(t,tIdx) in otherExam" :key="tIdx" @click.native="goExamDetail(t.ExamId)" is-link>
        <span slot="after-title" class="vux-label">
          <span>其他</span>
          <br/>
          <span>{{t.ExamName}}</span>
          <br/>
          <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-right:0;">&#xe601;</span>
          <span>{{t.ExamDayWeek}} {{t.Times}}</span>
          <br/>
          <span slot="icon" class="school-wx-icon" style="color: #108fe9;padding-right:0;">&#xe60d;</span>
          <span>{{t.JSMC}}</span>
        </span>
        </cell>
      </group>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: "teaExamQueryLst",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Tab,
      TabItem,
      Cell,
      Group
    },
    methods: {
      // 改变考试类型的type(2-期中考试，3-期末考试，1-补考，9-其他)
      changeExamType (type) {
        this.type = type;
      },
      // 到考试详情页面去
      goExamDetail (id) {
        sessionStorage.setItem("examQueryType", this.type);
        this.$router.push({path: '/teaExamQuery/examQueryDetail', query: {id: id}});
      },
      // 根据id(职工号)、Type(类型：教师查询employee) 得到考试信息
      async getTeacherTestData () {
        if (sessionStorage.getItem("examQueryType") !== null) {
          this.type = parseInt(sessionStorage.getItem("examQueryType"));
          sessionStorage.removeItem("examQueryType");
        }
        let id;
        let type;
        if (this.QD.getLocalUserinfo().stuObj.ZGH !== undefined) {
          id = this.QD.getLocalUserinfo().stuObj.ZGH;
          type = 'employee';
        }
        if (this.QD.getLocalUserinfo().stuObj.XH !== undefined) {
          id = this.QD.getLocalUserinfo().stuObj.XH;
          type = 'student';
        }
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetExamineeByZGH', id: id, type: type});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.testData = d;
        this.loading = false;
        if (d.length > 0) {
          this.xqmc = this.testData[0].XQMC; // 获得学期名称
          this.getExamTypeData(); // 根据考试的类型，分组
        } else {
          this.xqmc = '无数据';
        }
      },
      // 根据考试的类型，分组
      getExamTypeData () {
        for (let i = 0; i < this.testData.length; i++) {
          if (this.testData[i].ExamType === 1) {
            this.makeUpExam.push(this.testData[i]);
          } else if (this.testData[i].ExamType === 2) {
            this.midExam.push(this.testData[i]);
          } else if (this.testData[i].ExamType === 3) {
            this.endExam.push(this.testData[i]);
          } else {
            this.otherExam.push(this.testData[i]);
          }
        }
      }
    },
    created () {
      this.getTeacherTestData();
    },
    data () {
      return {
        loading: true,
        type: 2, // 考试类型 2-期中考试，3-期末考试，1-补考，9-其他
        testData: [], // 考试信息
        xqmc: '', // 学期名称
        makeUpExam: [], // 补考
        midExam: [], // 期中考试
        endExam: [], // 期末考试
        otherExam: [] // 其他考试
      }
    }
  }
</script>
<style scoped>
  .teaExamQuery{
    background-color: #f2f2f2;
  }
  .bg{
    margin-top: -1.3em;
    background-color: #f2f2f2;
  }
  .teaExamQuery .examXQMC{
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
  }
  .teaExamQuery .examXQMC span{
    display: inline-block;
    padding-top: 10px;
    padding-left: 10px;
    padding-bottom: 10px;
    font-size: 16px;
    color: #333333;
  }
  .teaExamQuery .vux-label span{
    color: #333333;
  }
  .teaExamQuery .vux-label span:nth-child(3){
    font-size: 14px;
    color: #666666;
  }
  .teaExamQuery .vux-label span:nth-child(6),
  .teaExamQuery .vux-label span:nth-child(9){
    color: #999999;
    font-size: 12px;
  }
</style>
<style>
  /*.teaExamQuery .examQueryGroup .weui-cells{
    margin-top: -1px;
  }*/
</style>
