<template>
    <div class="addressBookDe">
      <group class="gp">
        <cell title="姓名" :value="employeeDetail.XM">
          <span class="demo-icon" slot="icon" style="color:#f0ad4e;">&#xe610;</span>
        </cell>
        <cell title="性别" :value="employeeDetail.XB">
          <span class="demo-icon" slot="icon" style="color:#f0ad4e;">&#xe831;</span>
        </cell>
        <cell title="职工号" :value="employeeDetail.ZGH">
          <span class="demo-icon" slot="icon" style="color:#f0ad4e;">&#xe668;</span>
        </cell>
        <cell title="部门名称" :value="employeeDetail.KSMC">
          <span class="demo-icon" slot="icon" style="color:#f0ad4e;">&#xe655;</span>
        </cell>
        <cell title="教研组名称" :value="employeeDetail.JYZMC">
          <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;">&#xe62f;</span>
        </cell>
        <cell title="电子信箱" :value="employeeDetail.DZXX">
          <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;">&#xe60c;</span>
        </cell>
        <cell title="联系电话">
          <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;">&#xe61f;</span>
          <span><a :href="'tel:' + employeeDetail.LXDH"  style="color: #999999;">{{employeeDetail.LXDH}}</a></span>
        </cell>
      </group>
    </div>
</template>
<script>
  import { Group, Cell } from 'vux'
  export default {
    name: "addressBookDetail",
    components: {
      Group,
      Cell
    },
    methods: {
      // 获取 教职工的详细信息 方法
      async getEmployeeDetail (){
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'EmployeeDetail', zgh: this.$route.query.addressBookzgh});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.employeeDetail = d;
      }
    },
    created() {
      this.getEmployeeDetail();
    },
    data () {
      return {
        employeeDetail: [] // 教职工的详细信息 的数组
      }
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -1.25em;
  }
</style>
<style>
.addressBookDe .vux-table tbody tr td:first-child {
  font-size: 15px;
  font-weight: 600;
}
.addressBookDe .vux-table tbody tr td:last-child {
  font-size: 15px;
}
</style>
