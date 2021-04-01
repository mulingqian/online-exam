<template>
  <div class="classMeLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="moralEGroup">
      <cell :title="currMEstuSemester.XQMC"></cell><!-- value="登记+" :link="{path: '/classMERegister'}"-->
      <cell :is-link="true">
        <div slot="after-title" class="vux-label">
          <div class="vux-x-switch weui-cell_switch" v-model="showStatusMsg">
            <label style="font-size: 14px;">本学期共登记：<span style="color: red">{{addCount}}</span></label>
            <label v-on:click.stop.prevent="showStatusMs">选择状态：{{statusVal}}</label>
          </div>
        </div>
      </cell>
    </group>
    <div>
      <ex-scroller height="-134" ref="scrollerPageIndexOne" v-model="classMELst" :onGetList="getClassMELst" v-if="currSemesterID !== ''">
        <div>
          <div class="moralEdu" v-for="(moral, midx) in classMELst" :key="midx">
            <div class="firsLine">
              <span v-if="moral.Status === 0" class="nosubmit-icon">未提交</span>
              <span v-if="moral.Status === 1" class="verifying-icon">审核中</span>
              <span v-if="moral.Status === 2" class="pass-icon">审核通过</span>
              <span v-if="moral.Status === 4" class="lost-icon">被退回</span>
              <span class="subTime">{{moral.SubmiteTime}}</span>
            </div>
            <div class="secLine">
              <span>{{moral.BJMC}}</span>
              <span v-if="moral.AddOrSub === 0" style="color: green;">{{moral.ScoreValue}}</span>
              <span v-if="moral.AddOrSub === 1" style="color: #ff0000">-{{moral.ScoreValue}}</span>
            </div>
            <div class="thirLine">
              <span>{{moral.ProjectName}}</span>
            </div>
            <div class="foueLine" v-if="moral.Status === 0 || moral.Status === 4">
              <span class="school-wx-icon" slot="icon" style="color:#2a7af0;" @click="deleteClassMEData(moral.ScoreId,midx)">&#xe600;</span>
            </div>
          </div>
        </div>
      </ex-scroller>
    </div>

    <actionsheet v-model="showStatusMsg" :menus="statusLists" show-cancel @on-click-menu="getValue"></actionsheet>
    <!--添加‘班级德育’-->
    <add-page @click.native="goClassMEReg()"></add-page>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'
  import ExScroller from '../common/ExScroller.vue'
  import addPage from '../primaryKey/AddPage.vue'
  export default {
    name: 'classMELst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      ExScroller,
      Group,
      Cell,
      Actionsheet,
      addPage
    },
    methods: {
      // 到班级德育登记页面
      goClassMEReg () {
        this.$router.push('/classMERegister');
      },
      // 根据班级德育id删除班级德育数据
      async deleteClassMEData (id, midx) {
        let _this = this;
        this.QD.confirm('', '确定删除', async function(){
          let d = await _this.QD.getData('/ComApi/PostObject', {apiName: 'DeleteClassEduData', scoreId: id});
          if (d.status && d.status === "error") {
            _this.QD.alert(`获取数据失败:${d.msg}`);
          }
          if (d === 0) {
            _this.QD.alert('', `删除失败`);
          } else {
            _this.QD.alert('', `删除成功`);
            _this.getMECount(); // 刷新登记的总记录 相当删除成功后，重新刷新页面
            _this.classMELst.splice(midx, 1); // 改变当前删除的数据
          }
        }, '');
      },
      // 下面的面板是否出现，选择状态属性值
      showStatusMs () {
        this.showStatusMsg = !this.showstatusMsg;
      },
      // 当选定状态值时，得到 相应状态
      async getValue (key, item) {
        if (item !== undefined && item !== this.statusVal) {
          this.statusVal = item;
          if (item === '全部'){
            key = '';
          }
          if (key === 3){
            key = 4;
            console.log(`key is 3 ,now key is ${key}`);
          }
          this.statusCode = key;
          // 重新加载第一页数据
          this.$refs.scrollerPageIndexOne.initData();
        }
      },
      // 获取学期信息
      async getMEStuSemester () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuSemester'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        for (let i = 0; i < d.length; i++){
          if (d[i].IsCurrent === true){
            this.currMEstuSemester = d[i];
            this.currSemesterID = d[i].XQID;
            this.statusVal = '全部'; // 状态值开始赋值
            break;
          }
        }
        this.getMECount();
      },
      // 根据当前学期id 获取班级德育的总记录
      async getMECount () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassMEAddCount', xqid: this.currSemesterID});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        } else {
          this.addCount = d;
        }
        this.loading = false;
      },
      // 根据班级id 查询班级德育列表
      async getClassMELst (index, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassMELst',
          xqid: this.currSemesterID,
          pageIndex: index,
          pageSize: size,
          status: this.statusCode});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        return d;
      },
      clearClassMESession () {
        if (sessionStorage.getItem("classMEData") !== null) {
          sessionStorage.removeItem("classMEData");
        }
        if (sessionStorage.getItem("selectXfDetailMEProject") !== null) {
          sessionStorage.removeItem("selectXfDetailMEProject");
        }
      }
    },
    created () {
      this.getMEStuSemester(); // 加载当前学期
      this.clearClassMESession(); // 删除班级德育登记中存的信息
    },
    data () {
      return {
        loading: false,
        currMEstuSemester: [], // 当前学期
        currSemesterID: '', // 当前学期id
        addCount: '', // 当前学期下对应教师登记的总记录
        classMELst: [], // 班级德育列表
        showStatusMsg: false, // 开始时状态数组值不出现
        statusVal: '', // 状态值
        statusCode: '', // 状态值相对应的数字 ，开始赋值为空
        statusLists: ["未提交", "审核中", "审核通过", "被退回", "全部"] // 班级德育status状态值 0-未提交,1-审核中,2-审核通过,4-被退回
      }
    }
  }
</script>
<style scoped>
  .classMeLst{
    background-color: #f2f2f2;
  }
  .classMeLst .moralEGroup .vux-label label:nth-child(2){
    float:right;
    text-align: right;
    font-size: 14px;
    color: #666666;
  }
  .classMeLst .moralEdu {
    position: relative;
    margin-top: 10px;
    border-bottom: 1px solid #e5e5e5;
    background-color: #ffffff;
  }
  .classMeLst .moralEdu .firsLine{
    padding-left: 15px;
    padding-top: 10px;
  }
  .classMeLst .moralEdu .firsLine span{
    font-size: 14px;
  }
  .classMeLst .moralEdu .firsLine .subTime{
    margin-left: 10px;
    color: #999999;
    font-size: 12px;
  }
  .classMeLst .moralEdu .secLine{
    padding-left: 15px;
    padding-top: 10px;
    padding-right: 10px;
    font-size: 14px;
    color: #333333;
  }
  .classMeLst .moralEdu .secLine span:nth-child(2){
    float: right;
  }
  .classMeLst .moralEdu .thirLine{
    padding-left: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
    font-size: 14px;
    color: #666666;
  }
  .classMeLst .moralEdu .thirLine span{
    line-height: 16px;
  }
  .classMeLst .moralEdu .foueLine{
    height: 20px;
    padding-left: 15px;
    padding-bottom: 4px;
  }
  .classMeLst .moralEdu .foueLine span{
    float: right;
  }
</style>
<style>
  .classMeLst .xs-container{
    margin-top: 0;
  }
  .classMeLst .moralEGroup .weui-cells{
    margin-top: 0;
  }
  .classMeLst .weui-cells .vux-label{
    width: 100%;
    font-size: 16px;
    color: #333333;
  }
  .classMeLst .weui-cells .weui-cell__ft{
    font-size: 14px;
    color: #333333;
  }
  /*状态值面板*/
  .classMeLst .weui-actionsheet__menu .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
  .classMeLst .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
</style>
