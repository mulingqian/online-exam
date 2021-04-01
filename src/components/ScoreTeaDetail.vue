<template>
  <div class="scoreTeaDetail">
    <group :gutter="'0'" class="score-lst">
      <cell v-for="(ss, sidx) in StudentScoreDetail" :key="sidx" :border-intent="false">
            <span slot="after-title" class="vux-label">
              <span>{{ss.XH}}</span>
              <span>{{ss.XM}}</span>
            </span>
        <span :class="ss.SpecialColor ? 'failed-color' : ''">{{ss.CJ}}</span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  export default {
    name: "scoreTeaDetail",
    components: {
      Group,
      Cell
    },
    methods: {
      async getStudentScoreDetailData (){
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'TeaQueryStuScoreDetail', reportId: this.$route.query.reportId});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败!`);
          return;
        }
        console.log(`check employeeWageData d==${d}`);
        this.StudentScoreDetail = d;
        for (let i=0; i<this.StudentScoreDetail.length; i++) {
          let ss = this.StudentScoreDetail[i];
          ss.SpecialColor = false; // 是否标注红颜色
          if (ss.CJ === null) {
            ss.CJ = '--'
          }
          if (ss.CJ !== '--' && parseFloat(ss.CJ) < 60) {
            ss.SpecialColor = true;
          }
        }
      }
    },
    created () {
      this.getStudentScoreDetailData();
    },
    data () {
      return {
        StudentScoreDetail: [] // 学生成绩
      }
    }
  }
</script>
<style scoped>
  .scoreTeaDetail{
    padding-bottom: 20px;
  }
  .scoreTeaDetail .vux-label span:nth-child(1){
    color: #666666;
    font-size: 14px;
  }
  .scoreTeaDetail .vux-label span:nth-child(2){
    color: #333333;
  }
  .failed-color{
    color: #ff0000;
  }
</style>
<style>
  .scoreTeaDetail .weui-cell .weui-cell__ft{
    color: #999999;
  }
</style>
