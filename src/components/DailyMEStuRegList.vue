<template>
  <div class="mEduStuReqList">
    <group class="mEduStuHeadTitle">
      <cell :title="currMEstuSemester.XQMC"></cell>
      <cell :is-link="true">
        <div slot="after-title" class="vux-label">
          <div class="vux-x-switch weui-cell_switch" v-model="showStatusMsg">
            <label style="font-size: 14px;">本学期共登记：<span style="color: red">{{reqCount}}</span></label>
            <label v-on:click.stop.prevent="showStatusMs">选择状态：{{statusVal}}</label>
          </div>
        </div>
      </cell>
    </group>
    <div class="mELstGroup">
      <ex-scroller height="-134" ref="scrollerPageIndexOne" v-model="mEStuProjectReqCre" :onGetList="getMEStuProjectRequestByCreator" v-if="currSemesterID !== ''">
        <div>
          <group class="mEStuRgeLstGroup"  v-for="(em,midx) in mEStuProjectReqCre" :key="midx">
            <cell>
              <div slot="after-title" class="vux-label stumELst">
                <span class="stuME-status">
                  <span :class="`${em.status === '未提交'? 'nosubmit-icon' :
                  (em.status === '审核中' ? 'verifying-icon' : (em.status === '审核通过' ? 'pass-icon': 'lost-icon'))}`">
                    {{em.status}}
                  </span>
                  <span class="stuCreTime">{{em.submiteTime}}</span>
                </span>
                <span class="stuIconImg">
                  <span class="school-wx-icon stu-icon" slot="icon">&#xe657;</span>
                  <span class="stuIconXM">{{em.xm}}</span>
                </span>
                <span class="stuContain">
                  <span class="firstLineCon">
                    <span class="stuBjmc">{{em.bjmc}}</span>
                  </span>
                  <br/><span class="stuNote">{{em.parentName}}:{{em.itemName}}</span>
                  <br/>
                  <span class="stuPoint" v-if="em.addOrSub === '加分'">学分值：{{em.scoreValue}}</span>
                  <span class="stuPoint" v-if="em.addOrSub === '减分'" style="color: #ff0000">学分值：-{{em.scoreValue}}</span>
                  <!--<span class="school-wx-icon deleCre" slot="icon" style="display: block;color:#2a7af0;"-->
                        <!--v-if="em.status === '未提交' || em.status === '被退回'" @click="deleteRegDataByID(em.scoreId, midx)">&#xe600;</span>-->
                  <span class="school-wx-icon deleCre" slot="icon" style="display: block;color:#2a7af0;"
                        @click="deleteRegDataByID(em.scoreId, midx)">&#xe600;</span>
                </span>
              </div>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>

    <actionsheet v-model="showStatusMsg" :menus="statusLists" show-cancel @on-click-menu="getValue"></actionsheet>
    <!--当前学期不为空时，添加‘学生德育’-->
    <add-page v-if="currSemesterID !== ''" @click.native="goDailyMEReg()"></add-page>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'

  import ExScroller from './common/ExScroller.vue'
  import addPage from './primaryKey/AddPage.vue'
  import { mapActions } from 'vuex'
  export default {
    name: "dailyMEStuRegList",
    directives: {
      TransferDom
    },
    components: {
      ExScroller,
      Group,
      Cell,
      Actionsheet,
      addPage
    },
    methods: {
        // 到德育登记页面
      goDailyMEReg () {
        sessionStorage.setItem("semesterId", this.currSemesterID); // 将当前学期id 存在sessionStorage中
        this.$router.push({path: '/dailyMEReg'});
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
            key = -1;
          } else if (item === '未提交'){
            key = 0;
          } else if (item === '审核中'){
            key = 1;
          } else if (item === '审核通过'){
            key = 2;
          } else { // 被退回
            key = 4;
          }
          this.statusCode = key;
          // 重新加载第一页数据
          this.$refs.scrollerPageIndexOne.initData();
        }
      },
      //点击删除图片  根据日常登记ID删除日常登记信息
      deleteRegDataByID(scoreId, midx) {
        let _this = this;
        this.QD.confirm('', '确定删除', async function() {
          _this.updateLoadingStatus(true);
          let d = await _this.QD.getData('/ComApi/PostObject', {apiName: 'DeleteStuAddSubScore', scoreId: scoreId});
          _this.updateLoadingStatus(false);
          if (d.status && d.status === "error") {
            _this.QD.alert('', `删除失败`);
            console.log('删除', d);
            return;
          }
          _this.QD.alert('', `删除成功`);
          _this.getRequestCount(); // 重新教师登记的总记录 相当删除成功后，重新刷新页面
          _this.mEStuProjectReqCre.splice(midx, 1); // 改变当前删除的数据
        }, '');
      },
        // 获取学期信息
      async getMEStuSemester () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuSemester'});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return
        }
        console.log("获取学期信息", d)
        for (let i = 0; i < d.length; i++){
          if (d[i].IsCurrent === true){
            this.currMEstuSemester = d[i];
            this.currSemesterID = d[i].XQID;
            break;
          }
        }
        this.statusVal = '全部'; // 状态值开始赋值
        this.getRequestCount();
      },
      // 获取当前学期下对应登记的总记录
      async getRequestCount () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStudentMoralCount', xqid: this.currSemesterID});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log('当前学期下对应登记的总记录', d);
          return;
        }
        console.log("当前学期下对应登记的总记录", d)
        this.reqCount = d.data;
      },
      // 根据学期ID和创建者获取日常登记信息
      async getMEStuProjectRequestByCreator(index, size){
        let objData = {SemId: this.currSemesterID, PageIndex: index, PageSize: size, Status: this.statusCode};
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuMoreEduLst',
          objData: JSON.stringify(objData)});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败`);
          console.log("登记列表", d);
          return [];
        }
        return d.data;
      },
      // 清除德育登记中存在sessionStorage中的数据
      clearMEStuRegSession () {
        if (sessionStorage.getItem("selectStuMEList") !== null) {
          console.log("removeItme selectStuMEList");
          sessionStorage.removeItem("selectStuMEList");
        }
        if (sessionStorage.getItem("semesterId") !== null) {
          console.log("removeItme semesterId");
          sessionStorage.removeItem("semesterId");
        }
        /*扫码中的姓名和学号*/
        if (sessionStorage.getItem("myClassStuQrCodeXM")) {
          sessionStorage.removeItem("myClassStuQrCodeXM");
        }
        if (sessionStorage.getItem("myClassStuQrCodeXH")) {
          sessionStorage.removeItem("myClassStuQrCodeXH");
        }
        // 学生信息来源（扫码或手动选择）判断条件
        if (sessionStorage.getItem("isSelectStuForME")) {
          sessionStorage.removeItem("isSelectStuForME");
        }
      },
      ...mapActions([
        'updateLoadingStatus'
      ])
    },
    created () {
      this.getMEStuSemester();
      this.clearMEStuRegSession();
    },
    data () {
      return {
        currMEstuSemester: [], // 得到德育当前的学期列表
        currSemesterID: '', // 当前学期的id
        reqCount: '', // 当前学期下对应教师登记的总记录
        mEStuProjectReqCre: [], // 根据学期ID和创建者获取日常登记信息
        statusLists: ["全部", "未提交", "审核中", "审核通过", "被退回"], // 学生德育status状态值
        showStatusMsg: false,
        statusVal: '', // 状态值
        statusCode: -1 // 状态值相对应的数字 ，开始赋值为-1 全部
      }
    }
  }
</script>
<style scoped>
  .mELstGroup{
    background-color: #f2f2f2;
  }
  .mEduStuReqList .mEduStuHeadTitle label:nth-child(2){
    float:right;
    text-align: right;
    font-size: 14px;
    color: #666666;
  }
  .mEduStuReqList .vux-label{
    width: 100%;
    color: #333333;
  }
  .mEduStuReqList .mEStuRgeLstGroup .vux-label{
    margin-top: 8px;
    margin-bottom: 10px;
  }
  /*清除浮动*/
  .mEduStuReqList .stumELst{
    overflow: hidden;
  }
  .mEduStuReqList .stuME-status{
    display: block;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .mEduStuReqList .stuME-status .stuCreTime{
    float: right;
    color:#999999;
    font-size: 12px;
  }
  .mEduStuReqList .stuIconImg{
    display: block;
    float: left;
  }
  .mEduStuReqList .stuIconImg .stu-icon{
    position: absolute;
    font-size: 35px;
    padding-right:0;
  }
  .mEduStuReqList .stuIconXM{
    position: relative;
    top: 11px;
    left: 0;
    width: 35px;
    display: inline-block;
    font-size: 12px;
    text-align: center;
    line-height: 12px;
    color: #ffffff;
  }
  .mEduStuReqList .stuContain{
    display:block;
    width:81%;
    float: left;
    font-size: 16px;
    margin-left: 8px;
  }
  .mEduStuReqList .stuContain .firstLineCon{
    width:100%;
    margin-bottom: 8px;
  }
  .mEduStuReqList .stuContain span{
    /*display: inline-block;*/
    font-size: 14px;
  }
  .mEduStuReqList .stuContain .stuBjmc{
    color:#999999;
  }
  .mEduStuReqList .stuContain .stuPoint{
    /*float: right;*/
    color: green;
  }
  .mEduStuReqList .stuContain .stuNote{
    margin-bottom: 8px;
    width:100%;
    font-size: 14px;
    color: #666666;
  }
  .mEduStuReqList .stuContain .deleCre{
    float: right;
    padding-right:0;
    width: 20px;
    height: 20px;
    font-size: 20px;
    vertical-align: middle;
    background-size: cover;
  }
  /*悬浮的加号*/
  /*.addMeStuReg{
    position: absolute;
    bottom: 8px;
    right: 15px;
    padding: 4px;
  }
  .addMeStuRegIcon{
    color: #100f0f;
    font-size: 30px;
    padding-left: 8px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 13px;
    opacity: 0.8;
  }*/
  /*悬浮的加号end*/
</style>
<style>
  .mEduStuReqList .xs-container{
    margin-top: 0;
  }
  .mEduStuReqList .mEduStuHeadTitle .weui-cells{
    margin-top:0;
  }
  .mEduStuReqList .mEStuRgeLstGroup .weui-cells{
    position: relative;
    left: 2%;
    width: 96%;
  }
  .mEduStuReqList .weui-cells .weui-cell{
    padding: 10px 8px;
  }
  .mEduStuReqList .weui-cells .weui-cell__ft{
    font-size: 14px;
    color: #333333;
  }
  .mEduStuReqList .mELstGroup .weui-cell:before{
    left:0;
  }
  /*状态值面板*/
  .mEduStuReqList .weui-actionsheet__menu .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
  .mEduStuReqList .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
</style>

