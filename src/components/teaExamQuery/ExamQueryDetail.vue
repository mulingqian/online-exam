<template>
  <div class="teaExamQueryDetail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <cell :value="testDetailData.ExamName">
        <span slot="after-title" class="vux-label">考试课程</span>
      </cell>
      <cell :value="testDetailData.JSMC">
        <span slot="after-title" class="vux-label">所在考场</span>
      </cell>
      <cell :value="testDetailData.ExamDayWeek">
        <span slot="after-title" class="vux-label">考试日期</span>
      </cell>
      <cell :value="testDetailData.Times">
        <span slot="after-title" class="vux-label">考试时间</span>
      </cell>
      <cell :value="testDetailData.ClaName">
        <span slot="after-title" class="vux-label">考试班级</span>
      </cell>
      <cell :value="testDetailData.BJMC">
        <span slot="after-title" class="vux-label">行政班级</span>
      </cell>
      <cell :value="testDetailData.ClaNum">
        <span slot="after-title" class="vux-label">学生人数</span>
      </cell>
    </group>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: "examQueryDetail",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group
    },
    methods: {
      // 根据id(职工号)、Type(类型：教师查询employee) 得到考试信息
      async getTeacherTestData () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetExamineeDetail', ClaId: this.$route.query.id});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.testDetailData = d;
        this.loading = false;
        // 造假数据
        if (this.testDetailData.length === 0) {
          this.testDetailData ={"ExamName": '测试课程001', "JSMC": "2机房", "ExamDayWeek": '9月19日（星期二）', "Times": '9:00-11:00', "ClaName": '2017年-2018年计算机#2016级数学1班', "BJMC": '2016级数学1班', "ClaNum": '2'};
        }
        // 造假数据 end
      }
    },
    created () {
      this.getTeacherTestData();
    },
    data () {
      return {
        loading: true,
        testDetailData: [] // 考试信息
      }
    }
  }
</script>
<style>
  .teaExamQueryDetail .weui-cells{
    margin-top:0;
  }
  .teaExamQueryDetail .weui-cells .weui-cell .vux-cell-bd .vux-label{
    color: #333333;
  }
  .teaExamQueryDetail .weui-cell .weui-cell__ft{
    width: 70%;
    color: #666666;
  }
</style>
