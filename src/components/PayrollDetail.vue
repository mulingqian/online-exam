<template>
    <div class="payrollDeail">
      <group class="payrollGroup">
        <cell title="姓名" :value="employeeWageDetail.XM"></cell>
        <cell title="工号" :value="employeeWageDetail.ZGH"></cell>
        <cell title="工资年度" :value="employeeWageDetail.Year"></cell>
        <cell title="工资月份" :value="employeeWageDetail.Month"></cell>
        <cell title="工资分类" :value="employeeWageDetail.Subject"></cell>
        <cell title="实发金额" :value="employeeWageDetail.ActualPay"></cell>
        <cell title="应发金额" :value="employeeWageDetail.PlanPay"></cell>
        <cell :title="wageItem.Name" :value="wageItem.Value" v-for="(wageItem, idx) in this.employeeWageDetail.WageItems" :key="idx"></cell>
      </group>
    </div>
</template>
<script>
  /*import { Cell, Group } from 'vux'*/
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: "payrollDetail",
    components: {
      Group,
      Cell
    },
    methods: {
      // 获取工资单详细方法
      async getEmployeeWageDetail (){
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'EmployeeWageDetail', year: this.$route.query.year, month: this.$route.query.month, wageType: this.$route.query.type});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        console.log(`check employeeWageData d==${d}`);
        this.employeeWageDetail = d;
      }
    },
    created() {
      this.getEmployeeWageDetail();
    },
    data () {
      return {
        employeeWageDetail: [] // 工资单详细的数组
      }
    }
  }
</script>
<style scoped>

</style>
<style>
  .payrollDeail .payrollGroup .vux-label{
    color: #333333;
  }
  .payrollDeail .payrollGroup .weui-cells{
    margin-top:0;
  }
</style>
