<template>
  <div class="selectTeacher">
    <div class="allDepartmentAndEmployee">
      <div class="allDepartment">
        <a>部门<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span></a>
        <a :class="{'clickBgColor':dIdx === isDepartActive}" v-for="(depart, dIdx) in departmentData" v-on:click="getEmployeeLst(depart.KSH,dIdx)" :key="dIdx">{{depart.KSMC}}</a>
      </div>
      <div class="employeeLst">
        <a>姓名<span class="school-wx-icon" slot="icon" style="color:#666666;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="true" height="-95" style="background-color: #f2f2f2;">
          <div>
            <a v-for="(employee, eIdx) in employeeData" :key="eIdx" @click="getSelectEmployData(employee.XM,employee.ZGH)">{{employee.XM}}</a>
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>
<script>
  import Scroller from 'vux/src/components/scroller/index.vue'
  export default {
    name: 'selectDeviceUser',
    components: {
      Scroller
    },
    methods: {
      // 获取部门列表
      async getAllDepartment() {
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
        this.employeeData = d;
      },
      // 根据不同部门的代码获取教师信息
      getEmployeeLst (ksh, idx) {
        this.getEmployeeData(ksh);
        this.isDepartActive = idx; // 给选中当前的部门添加背景颜色
      },
      // 选择教师后做处理
      getSelectEmployData (name, zgh) {
        sessionStorage.setItem("selectDeviceUserName", name); // 存选择教师的姓名
        sessionStorage.setItem("selectDeviceUserZGH", zgh); // 存选择教师的职工号
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      }
    },
    created (){
      this.getAllDepartment(); // 获取部门列表
    },
    data (){
      return {
        backLoaded: true,
        departmentData: [], // 部门列表
        employeeData: [], // 教师信息
        isDepartActive: 0 // 默认选中第一列的部门
      }
    }
  }
</script>
<style scoped>
  .selectTeacher{ background-color: #ffffff; }
  .selectTeacher .allDepartmentAndEmployee{
    overflow: hidden;
  }
  .selectTeacher .allDepartmentAndEmployee .allDepartment{
    float: left;
    width:35%;
    background-color:#ffffff;
    border-right: 1px solid #f2f2f2;
  }
  .selectTeacher .allDepartmentAndEmployee .allDepartment a{
    display: block;
    line-height: 1.41176471;
    text-align: center;
    padding:10px 15px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectTeacher .allDepartmentAndEmployee .allDepartment .clickBgColor{
    background-color: #f2f2f2;
    color: #ffa500;
  }
  .selectTeacher .allDepartmentAndEmployee .employeeLst{
    float: left;
    width:64%;
    background-color:#ffffff;
    border-left: 1px solid #f2f2f2;
  }
  .selectTeacher .allDepartmentAndEmployee .employeeLst a{
    display: block;
    text-align: center;
    line-height: 1.41176471;
    padding:10px 15px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
</style>
<style>
  .selectTeacher .allDepartmentAndEmployee .employeeLst .xs-container{ margin-top: 0; }
</style>
