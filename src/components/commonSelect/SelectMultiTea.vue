<template>
  <div class="selectMultiTeacher">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="allDepartmentAndEmployee">
      <div class="allDepartment">
        <a>部门<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="false" height="-95" style="background-color: #fff;">
          <div>
            <span style="display:inline-block;width: 100%;"></span>
            <a v-if="departmentData.length !== 0" :class="{'clickBgColor':dIdx === isDepartActive}" v-for="(depart, dIdx) in departmentData" v-on:click="getEmployeeLst(depart.KSH,dIdx)" :key="dIdx">{{depart.KSMC}}</a>
          </div>
        </scroller>
      </div>
      <div class="employeeLst">
        <a style="text-align: center;padding: 10px 15px;">姓名<span class="school-wx-icon" slot="icon" style="color:#666666;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="false" height="-95" style="background-color: #f2f2f2;">
          <div>
            <span style="display:inline-block;width: 100%;"></span>
            <a v-for="(employee, eIdx) in employeeData" :key="eIdx" @click="chooseEmployee(eIdx)" v-if="employeeData.length !== 0">
              <span :class="`school-wx-icon ${employeeData[eIdx].selectedEmploy === true ? 'selectedMultiEmployeeIcon' : 'noSelectMultiEmployeeIcon'}`" slot="icon"></span>
              <span>{{employee.XM}}</span>
            </a>
            <span style="display: inline-block;height: 50px;width: 100%;"></span>
          </div>
        </scroller>
        <div class="finishMultiTea" @click="getSelectEmployData()"><a>完成</a></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Scroller from 'vux/src/components/scroller/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  export default {
    name: 'commonSelectMultiTea',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Scroller
    },
    methods: {
      // 获取部门列表
      async getAllDepartment() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetAllDepartmentDataList'});
        if (d.status && d.status === "error") {
          this.loading = false;
          this.QD.alert(`获取数据失败`);
          return;
        }
        this.departmentData = d;
        this.getEmployeeData(this.departmentData[0].KSH); // 获取第一列部门中的教师信息
      },
      // 根据部门代码查询教师信息
      async getEmployeeData(ksh) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetEmployeeDataList', ksh: ksh});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取教师信息失败:${d.msg}`);
          return;
        }
        this.employeeData = d;
        // 添加selectedEmploy字段 赋值为false
        for (let i=0; i<this.employeeData.length; i++) {
          this.employeeData[i].selectedEmploy = false;
        }
        /*判断当前教师姓名中是否已经有之前选中的教师*/
        // 用UserId判断
        this.getZGHLst(this.selectedEmployeeZGHLst);
      },
      // 用zgh 判断 之前选择的教职工
      getZGHLst(zghLst) {
        console.log("getZGHLst");
        for (let i=0; i<zghLst.length; i++) {
          for (let j=0; j<this.employeeData.length; j++) {
            if (zghLst[i] === this.employeeData[j].ZGH) {
              this.employeeData[j].selectedEmploy = true;
              break;
            }
          }
        }
      },
      // 根据不同部门的代码获取教师信息
      getEmployeeLst (ksh, idx) {
        this.getEmployeeData(ksh);
        this.isDepartActive = idx; // 给选中当前的部门添加背景颜色
      },
      // 点击教师姓名事件
      chooseEmployee (idx) {
        this.employeeData[idx].selectedEmploy = !this.employeeData[idx].selectedEmploy;
        this.$set(this.employeeData, idx, this.employeeData[idx]);
        if (this.employeeData[idx].selectedEmploy === true) {
          this.selectedEmployeeNameLst.push(this.employeeData[idx].XM);
          this.selectedEmployeeZGHLst.push(this.employeeData[idx].ZGH);
        } else {
          // 去掉重复的
          for (let i=0; i<this.selectedEmployeeNameLst.length; i++) {
            if (this.selectedEmployeeZGHLst[i] === this.employeeData[idx].ZGH) {
              this.selectedEmployeeNameLst.splice(i, 1);
              this.selectedEmployeeZGHLst.splice(i, 1);
            }
          }
        }
      },
      // 点击 完成 后做处理
      getSelectEmployData () {
        if (this.selectedEmployeeZGHLst.length === 0) {
          this.QD.alert('', '请选择');
          return;
        }
        if (this.backLoaded) { // 防止点击多次
          this.backLoaded = false;
          this.saveCurrData();
          this.$router.go(-1);
        }
      },
      // 得到选择教师的数据
      getSelectEmployeeData () {
        console.log('get 3333', this.QD.otherPageData);
        if (this.QD.otherPageData) {
          this.selectedEmployeeNameLst = this.QD.otherPageData.nameLst;
          this.selectedEmployeeZGHLst = this.QD.otherPageData.zghLst;
          this.QD.otherPageData = null;
        }
        this.getAllDepartment(); // 获取部门列表
      },
      // 保存本页数据
      saveCurrData () {
        this.QD.otherPageData = {nameLst: this.selectedEmployeeNameLst, zghLst: this.selectedEmployeeZGHLst};
      }
    },
    beforeDestroy () {
      for (let i=0; i<this.employeeData.length; i++) {
        delete this.employeeData[i].selectedEmploy; // 删除教师信息数组selectedEmploy字段
      }
    },
    created (){
      // 得到选择教师的数据
      this.getSelectEmployeeData();
    },
    data (){
      return {
        loading: false,
        backLoaded: true,
        departmentData: [], // 部门列表
        employeeData: [], // 教师信息
        isDepartActive: 0, // 默认选中第一列的部门
        selectedEmployeeNameLst: [], // 选择教师的姓名
        selectedEmployeeZGHLst: [], // 选择教师的职工号
        selectedEmployeeUserIdLst: [], // 选择教师的UserId
        ksh: [] // 部门代码
      }
    }
  }
</script>
<style scoped>
  .selectMultiTeacher{ background-color: #ffffff; }
  .allDepartmentAndEmployee{
    overflow: hidden;
  }
  .allDepartment{
    float: left;
    width:35%;
    background-color:#ffffff;
    border-right: 1px solid #f2f2f2;
  }
  .allDepartment a{
    display: block;
    line-height: 1.41176471;
    text-align: center;
    padding:10px 15px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .allDepartment .clickBgColor{
    background-color: #f2f2f2;
    color: #ffa500;
  }
 .employeeLst{
    position: relative;
    float: left;
    width:64%;
    background-color:#ffffff;
    border-left: 1px solid #f2f2f2;
  }
 .employeeLst a{
    display: block;
    line-height: 1.41176471;
    padding: 7px 15px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
 .employeeLst .noSelectMultiEmployeeIcon:before{
    content: '\e62a';
  }
 .selectedMultiEmployeeIcon:before{
    content: '\e692';
  }
  .finishMultiTea{
    position:absolute;
    bottom:0;
    width:100%;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  .finishMultiTea a{
    display: inline-block;
    padding: 8px 10px;
    font-size: 16px;
    line-height: 20px;
    color: #fff;
    border:0;
  }
</style>

