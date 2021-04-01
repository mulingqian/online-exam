<template>
  <div class="leaveSelfApplyReg">
    <group class="gp">
      <cell>
        <span slot="after-title" class="vux-label">学生</span>
        <span v-if="userinfo.stuObj">{{userinfo.stuObj.XM}}</span>
      </cell>
      <datetime v-model="startTime" format="YYYY-MM-DD HH:mm" :minute-list="['00', '05', '10', '15','20', '25', '30', '35','40', '45', '50', '55']"
                @on-change="startTimechange">
        <span slot="title">开始时间</span>
      </datetime>
      <datetime v-model="endTime" format="YYYY-MM-DD HH:mm" :minute-list="['00', '05', '10', '15','20', '25', '30', '35','40', '45', '50', '55']"
                @on-change="endTimechange" title="结束时间"></datetime>
      <cell>
        <span slot="after-title" class="vux-label">
          <span>共请假</span>
          <span style="color: #008000;">{{applyDay}}</span>
          <span>天</span>
        </span>
      </cell>
      <cell :is-link="true">
        <span slot="after-title" class="vux-label">
         <span>请假类别</span>
        </span>
        <span slot="default">
          <span class="rg-cell" v-on:click.stop.prevent="showLeaveApplyTypeMsg">{{leaveApplyType}}</span>
        </span>
      </cell>
      <cell :is-link="true">
        <span slot="after-title" class="vux-label">
         <span>是否需要离校</span>
        </span>
        <span slot="default">
          <span class="rg-cell" v-on:click.stop.prevent="showLeaveApplyStatusMsg">{{leaveSchool}}</span>
        </span>
      </cell>
      <x-textarea placeholder="请假内容" :show-counter="false" :rows="1" autosize v-model="leaveContent"></x-textarea>
      <x-textarea placeholder="请假备注" :show-counter="false" :rows="1" autosize v-model="leaveRemark"></x-textarea>
    </group>
    <div v-transfer-dom>
      <actionsheet v-model="showLeaveTypePanel" :menus="leaveTypeLists" show-cancel @on-click-menu="getLeaveTypeValue"></actionsheet>
      <actionsheet v-model="showLeaveApplyStatusPanel" :menus="leaveApplyStatusList" show-cancel @on-click-menu="getLeaveStatus"></actionsheet>
    </div>
    <x-button-one :titleVal="'提交'" @click-button="addSubmit"></x-button-one>
  </div>
</template>
<script>
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'

  import XButtonOne from '../common/XButtonOne.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: "leaveApplyReg",
    directives: {
      TransferDom
    },
    components: {
      XTextarea,
      Datetime,
      Group,
      Cell,
      Actionsheet,
      XButtonOne
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    data () {
      return {
        startTime: '请选择（必填）',
        endTime: '请选择（必填）',
        startVEndTime: true, // 开始时间要小于结束时间
        showLeaveTypePanel: false, // 请假类别是否出现
        showLeaveApplyStatusPanel: false, // 是否离校等情况面板是否出现
        leaveTypeLists: ["病假", "事假", "其他"], //请假类别()
        leaveApplyStatusList: ["需要离校", "无需离校", "不在校"], // 需要离校=1,无需离校=2,不在校=3
        leaveApplyType: '病假',
        leaveSchool: '需要离校', // 是否需要离校
        leaveContent: '', // 请假内容
        leaveRemark: '', // 请假备注
        applyDay: 0.0 // 以天计算请假时长 文本
      }
    },
    created () {
      console.log("userinfo = ", this.userinfo);
    },
    methods: {
      // 选择开始时间
      startTimechange (value) {
        this.startTime = value;
        this.countTimeGap();
      },
      // 选择结束时间
      endTimechange (value) {
        this.endTime = value;
        this.countTimeGap();
      },
      // 下面的面板是否出现，选择请假类别
      showLeaveApplyTypeMsg () {
        this.showLeaveTypePanel = !this.showLeaveTypePanel;
      },
      // 下面的面板是否出现，选择是否离校等情况
      showLeaveApplyStatusMsg () {
        this.showLeaveApplyStatusPanel = !this.showLeaveApplyStatusPanel;
      },
      // 得到请假类别
      getLeaveTypeValue (key, item) {
        if (item !== undefined && item !== this.typeValue) {
          this.leaveApplyType = item;
        }
      },
      // 得到请假是否需要离校情况
      getLeaveStatus (key, item) {
        if (item !== undefined && item !== this.typeValue) {
          this.leaveSchool = item;
        }
      },
      // 计算时间差
      countTimeGap() {
        if (this.startTime !== '请选择（必填）' && this.endTime !== '请选择（必填）'){
          let startDate = this.startTime.replace(/-/g, '/');
          let endDate = this.endTime.replace(/-/g, '/');

          let begin = new Date(startDate);
          let end = new Date(endDate);

          if (begin - end >= 0) {
            this.startVEndTime = false; // 开始时间要小于结束时间
            this.QD.alert('', '请假开始日期要在结束日期之前!');
            return false;
          } else {
            this.startVEndTime = true; // // 开始时间要小于结束时间
          }
          let days = end.getTime() - begin.getTime();
          let day = Math.floor(days / (24 * 3600 * 1000));
          //计算出小时数
          let leave1 = days % (24 * 3600 * 1000);  //计算天数后剩余的毫秒数
          //小时除以24四舍五入
          let hours = Math.floor(leave1 / (3600 * 1000));
          let leave2 =leave1%(3600*1000);  // 计算小时数后剩余的毫秒数
          let minutes = Math.floor(leave2/(60*1000));
          if (day === 0 && hours === 0 && minutes >= 0){
            this.applyDay = (minutes/(24*60)).toFixed(1);
          } else {
            this.applyDay = (day + hours/24 + minutes/(24*60)).toFixed(1);
          }
        }
      },
      async addSubmit () {
        if (this.leaveContent === '') {
          this.QD.alert('', '请输入请假内容');
          return;
        }
        if (this.startTime === '请选择（必填）' || this.endTime === '请选择（必填）') {
          this.QD.alert('', '请选择时间');
          return;
        }
        if (!this.startVEndTime) {
          this.QD.alert('', '请假开始日期要在结束日期之前!');
          return;
        }
        let objInfo = {
          apiName: 'InsertStudentLeaveApplyData',
          XH: this.userinfo.stuObj.XM,
          StartDate: this.startTime,
          EndDate: this.endTime,
          ApplyType: this.leaveApplyType,
          Content: this.leaveContent,
          Remark: this.leaveRemark,
          LeaveSchoolStatus: this.leaveSchool,
          ApplyDay: this.applyDay
        };
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', objInfo);
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        if (d > 0){
          this.$router.go(-1);
        } else {
          this.QD.alert('', '登记失败！');
        }
      },
      ...mapActions([
        'updateLoadingStatus'
      ])
    },
    beforeDestroy () {
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -20px;
    margin-bottom: 60px;
  }
</style>
<style>
  /*状态值面板*/
  .leaveSelfApplyReg .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
  .leaveSelfApplyReg .vux-x-textarea.weui-cell .weui-cell__bd textarea{
    font-size: 14px;
    color: #333333;
  }
</style>
