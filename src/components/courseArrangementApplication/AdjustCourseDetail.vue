<template>
  <div class="adjustCourseDetail">
    <div class="currXQ"><span>{{adjustCourseData.XQMC}}</span></div>
    <div class="groupStyle">
      <group v-if="adjustCourseData.length != 0">
        <cell title="申请日期" :value="adjustCourseData.DateTime"></cell>
        <cell title="申请人" :value="adjustCourseData.XM"></cell>
        <cell title="类别" :value="adjustCourseData.Leaverange"></cell>
        <cell title="调课原因" :value="adjustCourseData.Reasontype"></cell>
        <cell title="具体内容" :value="adjustCourseData.Reasons"></cell>
      </group>
    </div>
    <div class="adjustResult cfc">
      <div>
        <span>调课结果</span>
      </div>
      <div v-html="changeCourseContent = '<span>' + adjustCourseData.Content + '</span>'"></div>
    </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'

  export default {
    name: 'adjustCourseDetail',
    components: {
      Cell,
      Group
    },
    methods: {
      // 根据请假调课ID获取请假调课详情信息
      async getLeaveACDetail () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetLeaveACDetail', LeaveId: this.$route.query.id});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.adjustCourseData = d;
      }
    },
    created () {
      this.getLeaveACDetail();
    },
    data () {
      return {
        adjustCourseData: [] // 请假调课详情
      }
    }
  }
</script>
<style>
  .adjustCourseDetail .currXQ span{
    display: block;
    padding: 10px 0 10px 15px;
    font-size: 16px;
    color: #333333;
  }
  .adjustCourseDetail .groupStyle .weui-cells {
    margin-top:0;
  }
  .adjustCourseDetail .groupStyle .weui-cell .vux-cell-bd .vux-label{
    font-size: 16px;
    color: #333333;
  }
  .adjustCourseDetail .groupStyle .weui-cell .weui-cell__ft{
    font-size: 16px;
    color: #666666;
  }
  .adjustCourseDetail .adjustResult{
    overflow: hidden;
  }
  .adjustCourseDetail .adjustResult div:nth-child(1){
    float: left;
    width:30%;
  }
  .adjustCourseDetail .adjustResult div:nth-child(1) span{
    display: inline-block;
    padding: 10px;
    font-size: 16px;
    color: #333333;
  }
  .adjustCourseDetail .adjustResult div:nth-child(2){
    float: right;
    width:70%;
  }
  .adjustCourseDetail .adjustResult div:nth-child(2) span{
    display: inline-block;
    line-height: 20px;
    padding-top: 10px;
    font-size: 16px;
    color: #666666;
  }
</style>
