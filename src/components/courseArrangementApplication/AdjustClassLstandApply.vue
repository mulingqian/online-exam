<template>
  <div class="adjustClassLstandApply">
    <div class="title">
      <div class="adjustCourXq">
        <span v-if="currXqmc !== ''">{{currXqmc}}</span>
        <span v-if="currXqmc === ''">无数据</span>
        <!--<span v-on:click="addAdjustCourse">调课申请 <a>+</a></span>-->
      </div>
      <tab>
        <tab-item :selected="showLst" @on-item-click="adjustCourseApply(0)">调课申请</tab-item>
        <tab-item :selected="!showLst" @on-item-click="adjustCourseApply(1)">调课审批</tab-item>
      </tab>
    </div>

      <div v-show="showLst" class="showLst">
        <!--<ex-scroller v-model="adjustCourseLst" :onGetList="getLeaveAdjustCourseLst" height="-130">
          <div>
          </div>
        </ex-scroller>-->
        <group  v-for="(changeCourse, cidx) in adjustCourseLst" :key="cidx">
          <cell :link="{path: '/adjustCourseDetail', query: {id: changeCourse.LeaveId}}">
              <span slot="after-title" class="vux-label">
                <div class="firstLineDiv">
                  <span v-bind:class="changeCourse.State === 4 ? 'stategreen' : 'statered'">{{changeCourse.StateName}}</span>
                  <span>{{changeCourse.DateTime}}</span>
                </div>
                <div class="secondLineDiv">
                  <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;">&#xe601;</span>
                  <span>{{changeCourse.StartDate}} 至</span>
                  <span>{{changeCourse.EndDate}}</span>
                  <!--<span class="detailAdjustCourse" v-on:click="goAdjustCourseDetail(changeCourse.LeaveId)">详情</span>-->
                </div>
                <div class="thirdLineDiv" v-if="changeCourse.Reasons !== ''">
                  <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;">&#xe656;</span>
                  <span>{{changeCourse.Reasons}}</span>
                </div>
                <div class="fourthLineDiv">
                  <span>调课结果:</span>
                  <span v-html="changeCourseContent = '<span>' + changeCourse.Content + '</span>'">
                </span>
                </div>
              </span>
          </cell>
        </group>
      </div>
    <div v-show="!showLst" class="showLst auditData">
      <!--<ex-scroller v-model="auditAdjustCourseLst" :onGetList="GetLeaveScheAudit" height="-130">
        <div>
        </div>
      </ex-scroller>-->
      <group v-for="(audit, aidx) in auditAdjustCourseLst" :key="aidx">
        <cell>
              <span slot="after-title" class="vux-label">
                <div class="audit-firstLine">
                  <span v-bind:class="audit.State === 4 ? 'stategreen' : 'statered'">{{audit.StateName}}</span>
                  <span>{{audit.SubmitTime}}</span>
                </div>
                <div style="overflow: hidden;">
                  <div style="float: left;">
                  <div class="headPortrait">
                    <span class="school-wx-icon stu-icon" slot="icon">&#xe657;</span>
                    <span class="headXM">{{audit.XM}}</span>
                  </div>
                </div>
                <div style="float: left;margin-left: 8px;width: 80%;">
                <div class="audit-secondLine">
                  <!--<span>{{audit.XM}}</span>-->
                  <div class="audit-time">
                    <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-right: 4px;">&#xe601;</span>
                    <span>{{audit.StartDate}} 到</span>
                    <span>{{audit.EndDate}}</span>
                  </div>
                </div>
                <div class="audit-thirdLine">
                  <!--<span>调课申请原因:</span>-->
                  <span>申请原因:{{audit.Reasons}}</span>
                </div>
                <div v-if="audit.State === 2" class="audit-forthLine">
                  <span v-on:click="changeCourseApply(audit.LeaveId, audit.SPID, 2, aidx)">拒绝</span>
                  <span v-on:click="changeCourseApply(audit.LeaveId, audit.SPID, 3, aidx)">通过</span>
                </div>
                </div>
                </div>
              </span>
        </cell>
      </group>
    </div>
    <!--增加调课申请事件-->
    <add-page @click.native="addAdjustCourse()"></add-page>
  </div>
</template>
<script>
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import ExScroller from '../common/ExScroller.vue'
  import addPage from '../primaryKey/AddPage.vue'
  export default {
    name: 'adjustClassLstAndApply',
    components: {
      ExScroller,
      Tab,
      TabItem,
      Cell,
      Group,
      addPage
    },
    methods: {
      // 根据UserId获取当前用户可以审批的调课审批列表
      async GetLeaveScheAudit () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetLeaveScheAudit', userId: this.QD.getLocalUserinfo().stuObj.UserId});/*pageSize: size, pageIndex: index*/
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        } else {
          if (d.length !== 0 && d !== null) {
            if (d[0].XQMC !== '') {
              this.currXqmc = d[0].XQMC; // 得到当前学期名称
            }
          }
          /*return d;*/
          this.auditAdjustCourseLst = d;
        }
      },
      // 根据职工号获取请假调课信息
      async getLeaveAdjustCourseLst () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetLeaveAdjustCourseLst', ZGH: this.QD.getLocalUserinfo().stuObj.ZGH});/*, pageSize: size, pageIndex: index*/
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        } else {
          if (d.length !== 0 && d !== null) {
            if (d[0].XQMC !== '') {
              this.currXqmc = d[0].XQMC; // 得到当前学期名称
            }
            this.adjustCourseLst = d;
          }
        }
       /* return d;*/
      },
      // 判断是否显示调课申请
      adjustCourseApply (type) {
        this.courseArrAppType = type;
        this.showLst = this.courseArrAppType === 0;
      },
      // 增加调课申请事件
      addAdjustCourse () {
          // 保存此时是调课申请0,还是调课批申1
        sessionStorage.setItem("adjustClassType", this.courseArrAppType);
        this.$router.push({path: '/addAdjustCourse'});
      },
      // 取sessionStorage中存的值，判断是显示调课申请列表还是调课批申
      getAdjustClassType () {
        if (sessionStorage.getItem("adjustClassType") !== null){
          let courseArrAppType = parseInt(sessionStorage.getItem("adjustClassType"));
          this.showLst = courseArrAppType === 0;
          sessionStorage.removeItem("adjustClassType");
        }
      },
      // 调课审批事件
      async changeCourseApply (id, pid, satus, aidx) {
        let _this = this;
        this.QD.confirm("提示: 请输入审批意见", "", async function (m) {
          let d = await _this.QD.getData('/ComApi/PostObject', {
            apiName: 'SetLeaveAdjustCourseApprove',
            LeaveId: id,
            SPID: pid,
            State: satus,
            Reasons: m,
            XM: _this.QD.getLocalUserinfo().stuObj.XM,
            UserId: _this.QD.getLocalUserinfo().stuObj.UserId
          });
          if (d.status && d.status === "error") {
            _this.QD.alert(`获取数据失败:${d.msg}`);
          }
          if (d === true){
            _this.QD.alert('', '审批成功');
            let auditItem =_this.auditAdjustCourseLst[aidx];
            // 拒绝2
            if (satus === 2){
              auditItem.State=3; // 改变当前审批的状态3=退回
            }
            // 同意3
            if (satus === 3){
              auditItem.State=4; // 改变当前审批的状态4=审批通过
            }
            _this.$set(_this.auditAdjustCourseLst, aidx, _this.auditAdjustCourseLst[aidx]); // 改变当前审批的数据
          } else {
            _this.QD.alert('', '审批失败');
          }
        }, null, {showInput: true, inputVal: "", required: true});
      }
    },
    created () {
      this.getAdjustClassType();
      // 获取‘调课审批’列表
      this.GetLeaveScheAudit();
      // 获取‘调课申请’列表
      this.getLeaveAdjustCourseLst();
    },
    data () {
      return {
        currXqmc: '', // 获得学期名称
        showLst: true, // 开始默认调课申请列表显示
        courseArrAppType: 0, // 调课申请为0,1是调课批申
        adjustCourseLst: [], // 调课申请信息
        auditAdjustCourseLst: [] //可以审批的列表信息
      }
    }
  }
</script>
<style scoped>
  .adjustClassLstandApply{
    background-color: #f2f2f2;
  }
  .title{
    position: absolute;
    width: 100%;
    background-color: #fff;
    top: 46px;
    z-index: 50;
  }
  .adjustClassLstandApply .adjustCourXq{
    border-bottom:1px solid #e5e5e5;
  }
  .adjustClassLstandApply .adjustCourXq span{
    display: inline-block;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    font-size: 16px;
    color: #333333;
  }
  /*悬浮的加号*/
  /*.addAdjustCour{
    position: absolute;
    bottom: 8px;
    right: 15px;
    padding: 4px;
  }
  .addAdjustCourIcon{
    color: #100f0f;
    font-size: 30px;
    padding-left: 8px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 13px;
    opacity: 0.8;
  }*/
  /*悬浮的加号end*/
  .adjustClassLstandApply .showLst{
    position: relative;
    top: 81px;
    background-color: #f2f2f2;
  }

  .adjustClassLstandApply .vux-label{
    overflow: hidden;
    margin-bottom: 10px;
  }
  .headPortrait{
    position: relative;
    width: 40px;
    height: 50px;
  }
  .stu-icon{
    position: absolute;
    font-size: 35px;
  }
  .headXM{
    position: relative;
    top: 13px;
    left: 0;
    width: 35px;
    display: inline-block;
    font-size: 12px;
    text-align: center;
    line-height: 12px;
    color: #ffffff;
  }

  .adjustClassLstandApply .firstLineDiv{
    margin-top: 8px;
    font-size: 14px;
  }
  .adjustClassLstandApply .stategreen{
    color: #008000;
  }
  .adjustClassLstandApply .statered{
    color: #ff7549;
  }
  .adjustClassLstandApply .firstLineDiv span:nth-child(2){
    float: right;
    padding-left: 8px;
    color: #999999;
    font-size: 12px;
  }
  .adjustClassLstandApply .secondLineDiv{
    font-size: 14px;
    color: #666666;
  }
  .adjustClassLstandApply .secondLineDiv .detailAdjustCourse{
    float: right;
    width: 35px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    color: #ff0000;
    border: 1px solid #ff0000;
    border-radius: 6px;
  }
  .adjustClassLstandApply .thirdLineDiv{
    font-size: 14px;
    color: #666666;
  }
  .adjustClassLstandApply .fourthLineDiv{
    padding-top: 8px;
    font-size: 14px;
    color: #666666;
  }
  .adjustClassLstandApply .fourthLineDiv span{
    line-height: 20px;
  }
  .adjustClassLstandApply .audit-firstLine{
    font-size: 14px;
    color: #333333;
    margin-bottom: 4px;
    margin-top: 8px;
  }
  .adjustClassLstandApply .audit-firstLine span:nth-child(2){
    float: right;
    font-size: 12px;
    padding-left: 8px;
    color: #999999;
  }
  .adjustClassLstandApply .audit-secondLine{
    font-size: 16px;
    color: #333333;
  }
  .adjustClassLstandApply .audit-secondLine span{
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .audit-secondLine .audit-time{
    font-size: 14px;
    color: #666666;
  }
  .adjustClassLstandApply .audit-thirdLine{
    font-size: 14px;
    color: #666666;
    padding-bottom: 4px;
  }
  .adjustClassLstandApply .audit-thirdLine span:nth-child(2){
    color: #666666;
  }
  .adjustClassLstandApply .audit-forthLine{
    overflow: hidden;
    font-size: 16px;
    border-top: 1px dashed #e5e5e5;
  }
  .adjustClassLstandApply .audit-forthLine span{
    float: right;
    font-size: 16px;
    margin-top: 8px;
    /*padding-top: 4px;
    padding-bottom: 4px;*/
    padding-left: 8px;
    padding-right: 8px;
    border:1px solid #e5e5e5;
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
  .adjustClassLstandApply .audit-forthLine span:nth-child(2){
    margin-right: 10px;
    color: #008000;
  }
  .adjustClassLstandApply .audit-forthLine span:nth-child(1){
    color: #ff0000;
  }
</style>
<style>
  .adjustClassLstandApply .showLst .weui-cells {
    position: relative;
    left: 2%;
    width: 96%;
    margin-top: 18px;
  }
  .adjustClassLstandApply .auditData .weui-cell{
    padding-left: 8px;
    padding-right: 8px;
  }
  .adjustClassLstandApply .showLst .weui-cell:before{
    left:0;
  }
</style>
