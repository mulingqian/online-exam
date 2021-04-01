<template>
  <div class="leaveAuditDetail">
    <group>
      <cell title="学生" :value="stuLeaveApplyAuditData.XH + ' - ' + stuLeaveApplyAuditData.StuName"></cell>
      <cell title="开始时间" :value="stuLeaveApplyAuditData.StartDate"></cell>
      <cell title="结束时间" :value="stuLeaveApplyAuditData.EndDate"></cell>
      <cell>
        <span slot="after-title" class="vux-label">
          <span class="leaveDay">
            <span>共请假</span>
            <span style="color: #008000;">{{stuLeaveApplyAuditData.ApplyDay}}</span>
            <span>天</span>
          </span>
        </span>
      </cell>
      <cell title="请假类别" :value="stuLeaveApplyAuditData.ApplyType"></cell>
      <cell title="是否需要离校" :value="stuLeaveApplyAuditData.LeaveSchoolStatus == 1 ? '需要离校' : (stuLeaveApplyAuditData.LeaveSchoolStatus == 2 ? '无需离校' : '不在校')"></cell>
      <cell>
        <span slot="after-title" class="vux-label">
          <span>请假内容</span><br/>
          <span class="leaveContent">{{stuLeaveApplyAuditData.Content}}</span>
        </span>
      </cell>
      <cell>
        <span slot="after-title" class="vux-label">
          <span>备注</span><br/>
          <span class="leaveRemark">{{stuLeaveApplyAuditData.Remark}}</span>
        </span>
      </cell>
      <cell v-if="this.resultList !== null && resultList.length > 0">
        <span slot="after-title" class="vux-label auditResult">
          <span class="resultTitle">审批意见</span>
          <span class="">{{resultList[0].AuditorName}}</span>
          <span>{{resultList[0].AuditStatus}}</span>
          <span>{{resultList[0].AuditDate}}</span>
          <br/>
          <span>{{resultList[0].AuditOpinion}}</span>
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: "leaveAuditDetail",
    components: {
      Cell,
      Group
    },
    methods: {
      // 根据请假调课ID获取请假调课详情信息
      async getStuLeaveAuditData() {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuLeaveAuditData', applyId: this.$route.query.applyId, auditId: this.$route.query.auditId, stepId: this.$route.query.stepId});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.stuLeaveApplyAuditData = d;
        this.resultList = d.ResultList;
        console.log(this.resultList);
      }
    },
    created () {
      this.getStuLeaveAuditData();
    },
    data () {
      return {
        stuLeaveApplyAuditData: [], // 学生请假申请详情
        resultList: [] // 审批意见列表
      }
    }
  }
</script>
<style>
  .leaveAuditDetail .weui-cells {
    margin-top:0;
  }
  .leaveAuditDetail .weui-cell .vux-cell-bd .vux-label{
    font-size: 16px;
    color: #333333;
  }
  .leaveAuditDetail .weui-cell .weui-cell__ft{
    font-size: 16px;
    color: #666666;
  }
  .leaveAuditDetail .weui-cell .vux-cell-bd .vux-label .leaveDay{
    float: right;
    color: #666666;
  }
  .leaveAuditDetail .weui-cell .vux-cell-bd .vux-label .leaveContent,
  .leaveAuditDetail .weui-cell .vux-cell-bd .vux-label .leaveRemark{
    color: #666666;
  }
  .leaveAuditDetail .weui-cell .vux-cell-bd .auditResult span{
    padding-right: 4px;
  }
  .leaveAuditDetail .weui-cell .vux-cell-bd .auditResult .resultTitle{
    display: block;
    text-align: center;
    border-bottom: 1px dashed #e5e5e5;
    padding-right: 0px;
    padding-bottom: 4px;
    margin-bottom: 4px;
  }
</style>

