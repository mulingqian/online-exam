<template>
  <div class="leaveApplyDetail">
    <group>
      <cell title="学生" :value="stuLeaveApplyData.XH + ' - ' + stuLeaveApplyData.StuName"></cell>
      <cell title="开始时间" :value="stuLeaveApplyData.StartDate"></cell>
      <cell title="结束时间" :value="stuLeaveApplyData.EndDate"></cell>
      <cell>
        <span slot="after-title" class="vux-label">
          <span class="leaveDay">
            <span>共请假</span>
            <span style="color: #008000;">{{stuLeaveApplyData.ApplyDay}}</span>
            <span>天</span>
          </span>
        </span>
      </cell>
      <cell title="请假类别" :value="stuLeaveApplyData.ApplyType"></cell>
      <cell title="是否需要离校" :value="stuLeaveApplyData.LeaveSchoolStatus == 1 ? '需要离校' : (stuLeaveApplyData.LeaveSchoolStatus == 2 ? '无需离校' : '不在校')"></cell>
      <cell>
        <span slot="after-title" class="vux-label">
          <span>请假内容</span><br/>
          <span class="leaveContent">{{stuLeaveApplyData.Content}}</span>
        </span>
      </cell>
      <cell>
        <span slot="after-title" class="vux-label">
          <span>备注</span><br/>
          <span class="leaveRemark">{{stuLeaveApplyData.Remark}}</span>
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: "leaveApplyDetail",
    components: {
      Cell,
      Group
    },
    methods: {
      // 根据请假调课ID获取请假调课详情信息
      async getStuLeaveAppleData() {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuLeaveApplyData', applyId: this.$route.query.id});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.stuLeaveApplyData = d;
      }
    },
    created () {
      this.getStuLeaveAppleData();
    },
    data () {
      return {
        stuLeaveApplyData: [] // 学生请假申请详情
      }
    }
  }
</script>
<style>
  .leaveApplyDetail .weui-cells {
    margin-top:0;
  }
  .leaveApplyDetail .weui-cell .vux-cell-bd .vux-label{
    font-size: 16px;
    color: #333333;
  }
  .leaveApplyDetail .weui-cell .weui-cell__ft{
    font-size: 16px;
    color: #666666;
  }
  .leaveApplyDetail .weui-cell .vux-cell-bd .vux-label .leaveDay{
    float: right;
    color: #666666;
  }
  .leaveApplyDetail .weui-cell .vux-cell-bd .vux-label .leaveContent,
  .leaveApplyDetail .weui-cell .vux-cell-bd .vux-label .leaveRemark{
    color: #666666;
  }
</style>
