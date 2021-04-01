<template>
  <div class="detail">
    <group class="gp">
      <cell>
        <span slot="after-title" class="title">学生</span>
        <span class="value">{{info.XH }}  -  {{info.StuName}}</span>
      </cell>
      <cell>
        <span slot="after-title" class="title">开始时间</span>
        <span class="value">{{info.StartDate}}</span>
      </cell>
      <cell>
        <span slot="after-title" class="title">结束时间</span>
        <span class="value">{{info.EndDate}}</span>
      </cell>
      <cell>
        <div class="value">
          <span>共请假</span>
          <span style="color: #008000;">{{info.ApplyDay}}</span>
          <span>天</span>
        </div>
      </cell>
      <cell>
        <span slot="after-title" class="title">请假类别</span>
        <span class="value">{{info.ApplyType}}</span>
      </cell>
      <cell>
        <span slot="after-title" class="title">是否需要离校</span>
        <span class="value">{{info.statusName}}</span>
      </cell>
      <cell>
        <span slot="after-title" class="title">
          <span>请假内容</span><br/>
          <span class="leaveContent">{{info.Content}}</span>
        </span>
      </cell>
      <cell>
        <span slot="after-title" class="title">
          <span>备注</span><br/>
          <span class="leaveRemark">{{info.Remark}}</span>
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import { mapActions } from 'vuex'
  export default {
    name: "leaveSelfApplyDetail",
    components: {
      Cell,
      Group
    },
    methods: {
      // 根据请假调课ID获取请假调课详情信息
      async getStuLeaveAppleData() {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuLeaveApplyData', applyId: this.$route.query.id});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log("detail error", d);
          return;
        }
        this.info = d;
        this.info.statusName = this.info.LeaveSchoolStatus === 1 ? '需要离校' : (this.info.LeaveSchoolStatus === 2 ? '无需离校' : '不在校');
      },
      ...mapActions([
        'updateLoadingStatus'
      ])
    },
    created () {
      this.getStuLeaveAppleData();
    },
    data () {
      return {
        info: [] // 学生请假申请详情
      }
    }
  }
</script>
<style scoped>
  .gp {
    margin-top: -20px;
  }
  .title{
    font-size: 16px;
    color: #333333;
  }
  .value{
    font-size: 16px;
    color: #666666;
  }
  .leaveContent,
  .leaveRemark{
    color: #666666;
  }
</style>
