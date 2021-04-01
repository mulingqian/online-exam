<template>
  <div class="selectMultiStudent">
    <div class="selectStuMoCont">
      <div class="gradeMo-left">
        <a>年级<span class="school-wx-icon" slot="icon" style="color:#333333;padding-right: 0;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="true" height="-95" style="background-color: #f2f2f2;">
          <div>
            <a v-for="(grade, gidx) in gradeList" :key="gidx" v-on:click.stop.prevent="getClass(grade.NJID,gidx)"
               :class="{ 'gradebackgColor-link':gidx === isActiveGrade }">{{grade.NJMC}}</a>
          </div>
        </scroller>
      </div>
      <div class="classMo-midd">
        <a>班级<span class="school-wx-icon" slot="icon" style="color:#666666;padding-right: 0;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="true" height="-95" style="background-color: #f2f2f2;">
          <div>
            <a v-for="(clas, cidx) in classList" :key="cidx" v-on:click.stop.prevent="getMEStuDetail(clas.BJID,cidx)"
               :class="{ 'classbackgColor-link':cidx === isActiveClass }">{{clas.BJMC}}</a>
          </div>
        </scroller>
      </div>
      <div class="nameMo-right">
        <a style="padding: 10px 2px;text-align: center;">
          姓名<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span>
        </a>
        <scroller lock-x :scrollbar-y="true" height="-95" style="background-color: #f2f2f2;">
          <div>
            <a v-for="(stu, stidx) in stuDetail" :key="stidx" v-on:click.stop.prevent="nameBackgColor(stidx)">
              <span style="padding-right: 0;" :class="`school-wx-icon ${stuDetail[stidx].selectedEmploy === true ? 'selectedMultiEmployeeIcon' : 'noSelectMultiEmployeeIcon'}`" slot="icon"></span>
              <span>{{stu.XM}}({{stu.XH}})</span>
            </a>
            <span style="display: inline-block;height: 50px;width: 100%;"></span>
          </div>
        </scroller>
        <div class="finishMultiStu" @click="finishSelectStuData()"><a class="finishA">完成</a></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Scroller from 'vux/src/components/scroller/index.vue'
  import Search from 'vux/src/components/search/index.vue'
  export default {
    name: "selectMultiStudent",
    components: {
      Scroller,
      Search
    },
    methods: {
        // 点击完成事件
      finishSelectStuData () {
        // 存选择学生的姓名
        let name = this.selectedStuNameLst.join();
        // 存选择学生的 stuId
        let stuId = this.selectedStuIdLst.join();
        if (stuId === '') {
          this.QD.alert('', '请选择学生');
          return;
        }
        if (this.$route.query.page === 'fieldMultiSStudent') {
          // FieldMultiSStu.vue 组件
          sessionStorage.setItem("selectMultiStuNameLst_fieldMultiSStu", name);
          sessionStorage.setItem("selectMultiStuIdLst_fieldMultiSStu", stuId);
          /*跳转 officeTwo.vue*/
          this.$router.push({path: '/userDefinded/officeTwo'});
        }
      },
      // 点击姓名
      nameBackgColor(idx) {
        // 并传值到 德育登记页面
        this.stuDetail[idx].selectedEmploy = !this.stuDetail[idx].selectedEmploy;
        console.log(this.stuDetail[idx].selectedEmploy);
        this.$set(this.stuDetail, idx, this.stuDetail[idx]);
        if (this.stuDetail[idx].selectedEmploy === true) {
          this.selectedStuNameLst.push(this.stuDetail[idx].XM);
          this.selectedStuIdLst.push(this.stuDetail[idx].StuId.toString());
        } else {
          // 去掉重复的
          for (let i=0; i<this.selectedStuIdLst.length; i++) {
            if (this.selectedStuIdLst[i] === this.stuDetail[idx].StuId.toString()) {
              this.selectedStuNameLst.splice(i, 1);
              this.selectedStuIdLst.splice(i, 1);
            }
          }
        }
      },
      // 获取年级信息2015级2016级
      async getGrade() {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuGrade'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.gradeList = d;
        this.getClass(this.gradeList[0].NJID, 0);
      },
      // 根据专业id 和班级id 获取班级信息,0全部专业,0全部班级
      async getClass(njId, gindex) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuClass', ZYID: 0, NJID: njId});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.classList = d;
        this.isActiveGrade = gindex; // 年级背景颜色改变
        this.getMEStuDetail(d[0].BJID, 0);
      },
      // 根据班级id获取学生详细信息
      async getMEStuDetail(bjid, classid) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuDetailByBJID', BJID: bjid});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.stuDetail = d;
        this.isActiveClass = classid; // 班级背景颜色改变
        // 添加selectedStu字段 赋值为false
        for (let i=0; i<this.stuDetail.length; i++) {
          this.stuDetail[i].selectedStu = false;
        }
        /*判断已选学生姓名中是否已存在*/
        if (this.$route.query.page === 'fieldMultiSStudent') {
          // FieldMultiSStu.vue 组件
          this.getStuIdLst(this.selectedStuIdLst);
        }
      },
      // 用UserId 判断 之前选择的教职工
      getStuIdLst(stuIdLst) {
        for (let i=0; i<stuIdLst.length; i++) {
          for (let j=0; j<this.stuDetail.length; j++) {
            if (stuIdLst[i] === this.stuDetail[j].StuId.toString()) {
              this.stuDetail[j].selectedEmploy = true;
              break;
            }
          }
        }
      },
      // 得到选择学生的数据
      getSelectStudentData () {
        // FieldMultiStu.vue 子组件
        if (this.$route.query.page === 'fieldMultiSStudent') {
          if (sessionStorage.getItem("selectMultiStuNameLst_fieldMultiSStu") !== null && sessionStorage.getItem("selectMultiStuIdLst_fieldMultiSStu") !== null) {
            this.selectedStuNameLst = sessionStorage.getItem("selectMultiStuNameLst_fieldMultiSStu").split(",");
            this.selectedStuIdLst = sessionStorage.getItem("selectMultiStuIdLst_fieldMultiSStu").split(",");
            console.log("selectedStuIdLst is", this.selectedStuIdLst, this.selectedStuNameLst);
          }
        }
        /*点击选择年级*/
        this.getGrade();
      }
    },
    created (){
      // 得到选择学生的数据
      this.getSelectStudentData();
    },
    data (){
      return {
        isActiveGrade: 0, // 改变年级背景颜色
        isActiveClass: 0, // 改变班级背景颜色
        gradeList: [], // 年级信息
        classList: [], // 班级信息
        stuDetail: [], // 学生详细信息
        selectedStuNameLst: [], // 已选学生的姓名
        selectedStuIdLst: [] // 已选学生姓名对应的stuId
      }
    }
  }
</script>
<style scoped>
  .selectMultiStudent{background-color: #ffffff;}
  /* 清除浮动*/
  .selectStuMoCont{
    overflow: hidden;
  }
  .selectMultiStudent .gradeMo-left{
    float: left;
    width:25%;
    background-color:#ffffff;
    border-right: 1px solid #f2f2f2;
  }
  .gradeMo-left a{
    display: block;
    line-height: 1.41176471;
    text-align: center;
    padding:10px 2px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .gradeMo-left .gradebackgColor-link{
    color: #ffa500;
    background-color: #f2f2f2;
  }
  .classMo-midd .classbackgColor-link{
    color: #ffa500;
    background-color: #f2f2f2;
  }
 .nameMo-right .namebackgColor-link{
    color: #ffa500;
    background-color: #f2f2f2;
  }
  .classMo-midd{
    float: left;
    width:25%;
    background-color:#ffffff;
    border-left: 1px solid #f2f2f2;
  }
  .classMo-midd a{
    display: block;
    text-align: center;
    line-height: 1.41176471;
    padding:10px 2px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
  .nameMo-right{
    position: relative;
    float: left;
    width:48%;
    background-color:#ffffff;
    border-left: 1px solid #f2f2f2;
  }
  .nameMo-right a{
    display: block;
    line-height: 1.41176471;
    padding: 10px 0 10px 2px;
    font-size: 16px;
    color: #999999;
    border-bottom: 1px solid #e5e5e5;
  }
  .noSelectMultiEmployeeIcon:before{
    content: '\e62a';
  }
  .selectedMultiEmployeeIcon:before{
    content: '\e692';
  }
  .finishMultiStu{
    position:absolute;
    bottom:0;
    width:100%;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  .selectMultiStudent .finishMultiStu .finishA{
    display: inline-block;
    padding: 8px 10px;
    font-size: 16px;
    line-height: 20px;
    color: #fff;
    border:0;
  }
</style>
<style>
  .selectMultiStudent .xs-container {
    margin-top: 0;
  }
</style>
