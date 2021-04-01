<template>
  <div class="leaveApplyList">
    <tab>
      <tab-item :selected="showLst" @on-item-click="adjustCourseApply(0)">请假申请</tab-item>
      <tab-item :selected="!showLst" @on-item-click="adjustCourseApply(1)">请假审批</tab-item>
    </tab>
    <div v-show="showLst" class="leaveApplyShowLst">
      <ex-scroller v-model="stuLeaveApplyLst" ref="scrollerLeaveApplyLstPageIdxOne" :onGetList="getLeaveApplyLst" height="-90">
        <div>
          <group v-for="(stuLeaveApply, stuIdx) in stuLeaveApplyLst" :key="stuIdx">
            <cell :link="{path: '/stuLeaveApply/leaveApplyDetail', query: {id: stuLeaveApply.ApplyID}}">
            <span slot="after-title" class="vux-label">
              <div class="first-stuLeaveApply">
                <span v-if="stuLeaveApply.Status===0">未提交</span>
                <span v-if="stuLeaveApply.Status===1">审核中</span>
                <span v-if="stuLeaveApply.Status===2" style="color: #008000;">审核通过</span>
                <span v-if="stuLeaveApply.Status===4" style="color: #ff7549;">被退回</span>
                <span>{{stuLeaveApply.CreateDate}}</span>
              </div>
              <div class="stuIconImg">
                <span class="school-wx-icon stu-icon" slot="icon">&#xe657;</span>
                <span class="stuIconXM">{{stuLeaveApply.StuName}}</span>
              </div>
              <div class="stuInfor">
                <div class="second-stuLeaveApply">
                <!--<span>{{stuLeaveApply.StuName}}</span>-->
                  <span>学号:{{stuLeaveApply.XH}}</span>
                  <!--<span>{{stuLeaveApply.ApplyType}}{{stuLeaveApply.ApplyDay}} 天</span>-->
               </div>
              <div class="third-stuLeaveApply">
                <span>班级:{{stuLeaveApply.BJMC}}</span>
                <!--<span>{{stuLeaveApply.XM}}</span>-->
                <div style="color: #666666;">
                  <div style="color: #666666;">请假类型:{{stuLeaveApply.ApplyType}}</div>
                 <!-- <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-left: 0;padding-right: 2px;">&#xe601;</span>-->
                  <span>开始时间:{{stuLeaveApply.StartDate}}</span>
                  <div>结束时间:{{stuLeaveApply.EndDate}}</div>
                  <span style="color:#3EA7C0;">时长:{{stuLeaveApply.ApplyDay}} 天</span>
                  <span class="isShowSituation" v-if="stuLeaveApply.ReturnSchool > 0 ? (stuLeaveApply.ReturnSchool == 1 ? leaveSchStatus='已离校' : leaveSchStatus='已返校') : (stuLeaveApply.LeaveSchoolStatus == 1 ? leaveSchStatus='需要离校' : (stuLeaveApply.LeaveSchoolStatus == 2 ? leaveSchStatus='无需离校' : leaveSchStatus='不在校'))">{{leaveSchStatus}}</span>
                </div>
                <span class="school-wx-icon stuLeaveApplyDelete" slot="icon" v-if="stuLeaveApply.Status===0 || stuLeaveApply.Status===4" style="color:#2a7af0;" @click.stop.prevent="deleteStuLeaveApply(stuLeaveApply.ApplyID,stuIdx)">&#xe600;</span>
              </div>
              </div>
            </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <div v-show="!showLst" class="leaveApplyShowLst">
      <ex-scroller v-model="stuLeaveAuditLst" ref="scrollerLeaveAuditLstPageIdxOne" :onGetList="getStuLeaveAuditLst" height="-90">
        <div>
          <group   v-for="(stuLeaveAudit,auIdx) in stuLeaveAuditLst" :key="auIdx">
            <cell is-link @click.native="goLeaveAuditDetail(stuLeaveAudit.ApplyID, stuLeaveAudit.AuditId, stuLeaveAudit.StepId)">
            <span slot="after-title" class="vux-label">
              <div class="first-stuLeaveApply">
                <span v-if="stuLeaveAudit.Status===0">未提交</span>
                <span v-if="stuLeaveAudit.Status===1">审核中</span>
                <span v-if="stuLeaveAudit.Status===2" style="color: #008000;">审核通过</span>
                <span v-if="stuLeaveAudit.Status===4" style="color: #ff7549;">被退回</span>
                <span>{{stuLeaveAudit.CreateDate}}</span>
              </div>
              <div style="overflow: hidden;">
                 <div class="stuIconImg">
                    <span class="school-wx-icon stu-icon" slot="icon">&#xe657;</span>
                    <span class="stuIconXM">{{stuLeaveAudit.StuName}}</span>
                 </div>
                <div class="stuInfor">
                  <div class="second-stuLeaveApply">
                  <!--<span>{{stuLeaveAudit.StuName}}</span>-->
                  <span>学号:{{stuLeaveAudit.XH}}</span>
                  <!--<span>{{stuLeaveAudit.ApplyType}}{{stuLeaveAudit.ApplyDay}} 天</span>-->
                </div>
                  <div class="third-stuLeaveApply">
                    <span>班级:{{stuLeaveAudit.BJMC}}</span>
                    <!--<span>{{stuLeaveAudit.XM}}</span>-->
                    <div style="color: #666666;">
                      <div>请假类型:{{stuLeaveAudit.ApplyType}}</div>
                      <!--<span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-left: 0;padding-right: 2px;">&#xe601;</span>-->
                      <span>开始时间:{{stuLeaveAudit.StartDate}}</span>
                      <div>结束时间:{{stuLeaveAudit.EndDate}}</div>
                      <span style="color:#3EA7C0;">时长:{{stuLeaveAudit.ApplyDay}} 天</span>
                      <span class="isShowSituation" v-if="stuLeaveAudit.ReturnSchool > 0 ?
                    (stuLeaveAudit.ReturnSchool == 1 ? leaveSchStatus='已离校' : leaveSchStatus='已返校')
                     : (stuLeaveAudit.LeaveSchoolStatus == 1 ? leaveSchStatus='需要离校' :
                     (stuLeaveAudit.LeaveSchoolStatus == 2 ? leaveSchStatus='无需离校' : leaveSchStatus='不在校'))&&stuLeaveAudit.Status!==1&&stuLeaveAudit.StepStatus !== 1">{{leaveSchStatus}}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="stuLeaveAudit.Status===1&&stuLeaveAudit.StepStatus === 1" class="audit-forthLine">
                <span v-on:click.stop.prevent="auditStuLeaveApply(stuLeaveAudit.ApplyID, stuLeaveAudit.AuditId, stuLeaveAudit.StepId, 4, auIdx)">拒绝</span>
                <span v-on:click.stop.prevent="auditStuLeaveApply(stuLeaveAudit.ApplyID, stuLeaveAudit.AuditId, stuLeaveAudit.StepId, 2, auIdx)">通过</span>
              </div>
            </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--<span class="addAdjustCour">
      <span @click="addLeaveApply()" class="school-wx-icon addAdjustCourIcon" slot="icon">&#xe668;</span>
    </span>-->
    <!--添加‘学生请假’-->
    <add-page @click.native="addLeaveApply()"></add-page>
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
    name: "leaveApplyList",
    components: {
      ExScroller,
      Tab,
      TabItem,
      Cell,
      Group,
      addPage
    },
    methods: {
        // 跳转到学生请假申请登记页面
      addLeaveApply () {
        sessionStorage.setItem("leaveApplyType", this.leaveApplyType); // 存学生请假批申列表 1/0
        this.$router.push({ path: '/stuLeaveApply/leaveApplyReg' });
      },
        // 查看学生请假审批详情
      goLeaveAuditDetail(applyid, auditid, stepid) {
        sessionStorage.setItem("leaveApplyType", this.leaveApplyType); // 存学生请假批申列表 1/0
        this.$router.push({ path: '/stuLeaveApply/leaveAuditDetail', query: { applyId: applyid, auditId: auditid, stepId: stepid } });
      },
      // 判断是否显示请假申请
      adjustCourseApply (type) {
        this.leaveApplyType = type;
        this.showLst = this.leaveApplyType === 0;
      },
      // 取sessionStorage中存的值，判断是显示学生请假批申列表还是请假审批
      getLeaveApplyTpye () {
        if (sessionStorage.getItem("leaveApplyType") !== null) {
          this.leaveApplyType = parseInt(sessionStorage.getItem("leaveApplyType")); // 赋值，this.leaveApplyType值只有在点击是才会赋值的
          this.showLst = this.leaveApplyType === 0;
          sessionStorage.removeItem("leaveApplyType"); // 清除sessionStorage中的值
        }
      },
      // 获取学生请假申请信息
      async getLeaveApplyLst (index, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuLeaveApplyLst', pageSize: size, pageIndex: index});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        return d;
      },
      // 获取学生请假批申列表信息
      async getStuLeaveAuditLst (index, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuLeaveAuditLst', pageSize: size, pageIndex: index});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        return d;
      },
      // 请假审批事件
      async auditStuLeaveApply (applyId, auditId, stipId, status, auIdx) {
        // console.log("aaa", window.Global_CONFIG.demoReceivers);
        let _this = this;
        this.QD.confirm("提示: 请输入审批意见", "", async function (m) {
          let d = await _this.QD.getData('/ComApi/PostObject', {
            apiName: 'AuditStuLeaveApply',
            ApplyID: applyId,
            AuditId: auditId,
            StepId: stipId,
            Status: status,
            Remark: m
          });
          if (d.status && d.status === "error") {
            _this.QD.alert(`获取数据失败:${d.msg}`);
          }
          if (d === true){
            _this.QD.alert('', '审批成功');
            let auditItem =_this.stuLeaveAuditLst[auIdx];
            auditItem.Status=status; // 改变当前审批的状态
            auditItem.StepStatus=status; // 改变当前审批的审批步骤状态
            _this.$set(_this.stuLeaveAuditLst, auIdx, _this.stuLeaveAuditLst[auIdx]); // 改变当前审批的数据
            // 重新加载请假申请列表的第一页数据
            _this.$refs.scrollerLeaveApplyLstPageIdxOne.initData();
            let d1 = await _this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuLeaveApplyData', applyId: applyId});
            if (d1.status && d1.status === "error") {
              return;
            }
            let val = ["您好，您有新的学生请假提醒！", d1.StuName + "学生(" + d1.XH + ")", d1.StartDate + " 到 " + d1.EndDate, d1.Content, "请留意门禁放行等事宜!"];
            let d = await _this.QD.getData('/School/TeaClient/SendWXTempMessage', {
              target: "学生请假提醒",
              values: val,
              userIds: window.Global_CONFIG.demoReceivers
            });
          } else {
            _this.QD.alert('', '审批失败');
          }
        }, null, {showInput: true, inputVal: "", required: true});
      },
      // 根据学生请假申请id删除学生请假申请数据
      async deleteStuLeaveApply (id, stuIdx) {
        let _this = this;
        this.QD.confirm('', '确定删除', async function(){
          let d = await _this.QD.getData('/ComApi/PostObject', {apiName: 'DeleteStuLeaveApplyData', applyId: id});
          if (d.status && d.status === "error") {
            _this.QD.alert(`获取数据失败:${d.msg}`);
          }
          if (d === 0) {
            _this.QD.alert('', `删除失败`);
          } else {
            _this.QD.alert('', `删除成功`);
            _this.stuLeaveApplyLst.splice(stuIdx, 1); // 改变当前删除的数据
            // 重新加载请假审批列表的第一页数据
            _this.$refs.scrollerLeaveAuditLstPageIdxOne.initData();
          }
        }, '');
      }
    },
    created () {
      this.getLeaveApplyTpye();
    },
    data () {
      return {
        showLst: true, // 开始默认请假申请列表显示
        leaveApplyType: 0, // 请假申请为0,1是请假批申
        stuLeaveApplyLst: [], // 学生请假列表
        stuLeaveAuditLst: [] // 学生请假审批列表
      }
    }
  }
</script>
<style scoped>
  /*头像*/
  .leaveApplyList .stuIconImg{
    display: block;
    float: left;
  }
  .leaveApplyList .stuIconImg .stu-icon{
    position: absolute;
    font-size: 35px;
    padding-right:0;
  }
  .leaveApplyList .stuIconXM{
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
  /*头像结束*/
  .stuInfor{
    width:81%;
    float: left;
    font-size: 16px;
    margin-left: 8px;
    margin-bottom: 10px;
    overflow: hidden;
  }

  .leaveApplyList .leaveApplyShowLst {
    background-color: #f2f2f2;
  }
  .leaveApplyList .first-stuLeaveApply{
    margin-top: 8px;
  }
  .leaveApplyList .first-stuLeaveApply,
  .leaveApplyList .second-stuLeaveApply,
  .leaveApplyList .third-stuLeaveApply
  {
    overflow: hidden;
    font-size: 14px;
    color: #333333;
  }
  .leaveApplyList .first-stuLeaveApply span:nth-child(2){
    float: right;
    font-size: 12px;
    padding-left: 8px;
    color: #999999;
  }
  .leaveApplyList .second-stuLeaveApply{
    /*padding-bottom: 4px;*/
  }
  .leaveApplyList .second-stuLeaveApply span:nth-child(1){
    /*padding-left: 8px;*/
    color: #999999;
  }
  /*.leaveApplyList .second-stuLeaveApply span:nth-child(2){
    float: right;
    color: #ff0000;
  }*/
  .leaveApplyList .third-stuLeaveApply{
   /* padding-top: 4px;*/
    color: #999999;
  }
  /*.leaveApplyList .third-stuLeaveApply span:nth-child(2){
    padding-left: 8px;
  }*/
  .leaveApplyList .third-stuLeaveApply .isShowSituation{
    float: right;
    color: #3437ff;
  }
  .leaveApplyList .third-stuLeaveApply .stuLeaveApplyDelete{
    float: right;
    width: 20px;
    height: 20px;
    padding-right: 0;
    font-size: 20px;
    vertical-align: middle;
    background-size: cover;
  }
  .leaveApplyList .audit-forthLine{
    margin-top: 4px;
    overflow: hidden;
    font-size: 16px;
    border-top: 1px dashed #e5e5e5;
  }
  .leaveApplyList .audit-forthLine span{
    float: right;
    font-size: 16px;
    margin-top: 8px;
    padding-left: 8px;
    padding-right: 8px;
    border:1px solid #e5e5e5;
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
  .leaveApplyList .audit-forthLine span:nth-child(2){
    margin-right: 10px;
    color: #008000;
  }
  .leaveApplyList .audit-forthLine span:nth-child(1){
    color: #ff0000;
  }
</style>
<style>
  .leaveApplyList .weui-cells {
    position: relative;
    left: 2%;
    width: 96%;
    margin-top: 18px;
  }
  .leaveApplyList .leaveApplyShowLst .weui-cell:before{
    left:0;
  }
</style>

