<template>
  <div class="leaveApplyReg">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group style="margin-bottom: 60px;">
      <cell :value="seleStuName" :link="{path:'/stuLeaveApply/selectBZRStudent'}" @click.native="goSelectBZRStu()">
        <span slot="after-title" class="vux-label">学生</span>
      </cell>
      <datetime v-model="startTime" format="YYYY-MM-DD HH:mm" :minute-list="['00', '05', '10', '15','20', '25', '30', '35','40', '45', '50', '55']" @on-change="startTimechange" title="开始时间"></datetime>
      <datetime v-model="endTime" format="YYYY-MM-DD HH:mm" :minute-list="['00', '05', '10', '15','20', '25', '30', '35','40', '45', '50', '55']" @on-change="endTimechange" title="结束时间"></datetime>
      <cell>
        <span slot="after-title" class="vux-label">
          <span>共请假</span>
          <span style="color: #008000;">{{applyDay}}</span>
          <span>天</span>
        </span>
      </cell>
      <cell is-link>
        <span slot="after-title" class="vux-label">
         <span>请假类别</span>
        </span>
        <span slot="default">
          <span class="rg-cell" v-on:click.stop.prevent="showLeaveApplyTypeMsg">{{leaveApplyType}}</span>
        </span>
      </cell>
      <cell is-link>
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
    <div class="btn-box">
      <x-button @click.native="addSubmit" type="primary" class="btn-save" mini>提交</x-button>
    </div>
  </div>
</template>
<script>
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'

  import XButton from 'vux/src/components/x-button/index.vue'

  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
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
      Loading,
      XButton
    },
    methods: {
        // 跳转到 选择学生 页面
      goSelectBZRStu () {
        // 当前学生请假页面的信息存放在 QD.currPageData
        this.QD.currPageData = null;
        this.QD.currPageData = {startTime: this.startTime, endTime: this.endTime, leaveApplyType: this.leaveApplyType, leaveContent: this.leaveContent, leaveRemark: this.leaveRemark, leaveSchool: this.leaveSchool, applyDay: this.applyDay};
        this.$router.push({path: '/stuLeaveApply/selectBZRStudent'});
      },
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
            this.startVEndTime = false;
            this.QD.alert('', '请假开始日期要在结束日期之前!');
            return false;
          } else {
            this.startVEndTime = true;
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
        if (this.seleStuName === '选择') {
          this.QD.alert('', '请选择学生');
          return;
        }
        if (!this.startVEndTime) {
          this.QD.alert('', '请假开始日期要在结束日期之前!');
          return;
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'InsertLeaveApplyData',
          XH: this.seleStuXH,
          StartDate: this.startTime,
          EndDate: this.endTime,
          ApplyType: this.leaveApplyType,
          Content: this.leaveContent,
          Remark: this.leaveRemark,
          LeaveSchoolStatus: this.leaveSchool,
          ApplyDay: this.applyDay
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        if (d > 0){
          this.$router.go(-1);
          // this.$router.replace('/stuLeaveApply/leaveApplyList');
        } else {
          this.QD.alert('', '登记失败！');
        }
      },
      // 获取所选择学生请假的信息和当前页面所选信息
      getLeaveApplyStudentData () {
        if (this.QD.otherPageData) {
          this.seleStuXH = this.QD.otherPageData.XH;
          this.seleStuName = this.QD.otherPageData.XM;
          this.QD.otherPageData = null;
        } else {
          this.seleStuName = '选择';
        }
        // 取当前页面之前存的有关学生请假的数据
        if (this.QD.currPageData){
          this.startTime = this.QD.currPageData.startTime;
          this.endTime = this.QD.currPageData.endTime;
          this.leaveApplyType = this.QD.currPageData.leaveApplyType;
          this.leaveContent = this.QD.currPageData.leaveContent;
          this.leaveRemark = this.QD.currPageData.leaveRemark;
          this.leaveSchool = this.QD.currPageData.leaveSchool;
          this.applyDay = this.QD.currPageData.applyDay;
          this.QD.currPageData = null;
        }
      }
    },
    created () {
      this.getLeaveApplyStudentData();
    },
    beforeDestroy () {
    },
    data () {
      return {
        loading: false,
        seleStuName: '选择', // 存学生姓名
        seleStuXH: '', // 选择学生的学号
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
    }
  }
</script>
<style scoped>
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
  .btn-save{
    width: 100%;
    height: 40px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
  }
</style>
<style>
  .leaveApplyReg .weui-cells{ margin-top:0;}
  .leaveApplyReg .weui-cell .vux-label{
    color: #333333;
  }
  .leaveApplyReg .weui-cell .weui-cell__ft{
    color: #333333;
  }
  .leaveApplyReg .weui-cells .vux-datetime .vux-datetime-value .vux-cell-value{
    color: #666666;
  }
  .leaveApplyReg .weui-cells .vux-datetime div p{
    color: #333333;
  }
  /*状态值面板*/
  .leaveApplyReg .weui-actionsheet__menu .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
  .leaveApplyReg .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
  .leaveApplyReg .vux-x-textarea.weui-cell .weui-cell__bd textarea{
    font-size: 14px;
    color: #333333;
  }
</style>
