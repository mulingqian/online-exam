<template>
  <div class="meetingList">
    <group>
      <cell :is-link="true">
        <div slot="after-title" class="vux-label">
          <div class="vux-x-switch weui-cell_switch">
            <label>{{stateMeet}}</label>
            <label v-on:click.stop.prevent="showStatusMs">选择状态：{{stateMeet}}</label>
          </div>
        </div>
      </cell>
    </group>
    <div style="background-color: #f2f2f2;">
      <ex-scroller v-model="meetingLists" :onGetList="getOfficeMeetingData" height="-90" ref="scrollerMeetingLstPageIdxOne">
        <div>
          <div class="liMeetingList" v-if="meetingLists.length>0" v-for="(meetingL, midx) in meetingLists" :key="midx" @click="goMeetingLDe(meetingL.MID)">
            <span class="meetingImportAndUrgent">
                <span class="meetingImport">
                  <span :class="`school-wx-icon icon-importMeeting ${meetingL.Importance === 1? 'veryImporRed': (meetingL.Importance === 2? 'imporYellow': '')}`" slot="icon" style="font-size: 35px;">
                    <span v-if="meetingL.Importance === 1">非常重要</span>
                    <span v-if="meetingL.Importance === 2">重要</span>
                    <span v-if="meetingL.Importance === 4">普通</span>
                  </span>
                </span>
                <span class="meetingUrgent">
                  <span :class="`school-wx-icon icon-urgentMeeting ${meetingL.Urgent === 1? 'veryUrgentRed': (meetingL.Urgent === 2? 'urgentYellow': '')}`" slot="icon" style="font-size: 35px;">
                    <span v-if="meetingL.Importance === 1">非常紧急</span>
                    <span v-if="meetingL.Importance === 2">紧急</span>
                    <span v-if="meetingL.Importance === 4">普通</span>
                  </span>
                </span>
            </span>
            <div class="mNht">{{meetingL.Name}}<span class="mNht-H">{{meetingL.HYSMC}}<a class="mNht-S">{{meetingL.StateName}}</a></span></div>
            <div class="mSe">
              <span class="school-wx-icon" slot="icon" style="color:#f0ad4e;padding-right:0;">&#xe601;</span>
              {{meetingL.StartTime}} 到 {{meetingL.EndTime}}</div>
            <div class="mSub">会议主题：{{meetingL.Subject}}</div>
          </div>
        </div>
      </ex-scroller>
    </div>
    <actionsheet v-model="showStatusMsg" :menus="statusLists" show-cancel @on-click-menu="getValue"></actionsheet>
  </div>
</template>
<script>
  import ExScroller from './common/ExScroller.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'
  export default {
    name: "meetingList",
    components: {
      Group,
      Cell,
      Actionsheet,
      ExScroller
    },
    methods: {
        // 传会议 MID 到 会议详细信息 页面
      goMeetingLDe (id) {
        // 会议状态值存sessionStorage
        sessionStorage.setItem("stateMeet", this.stateMeet);
        sessionStorage.setItem("stateMeetNum", this.stateMeetNum);
        this.$router.push({ path: '/meetingListDetail', query: {mid: id} });
      },
      // 下面的面板是否出现，选择状态属性值
      showStatusMs () {
        this.showStatusMsg = !this.showstatusMsg;
      },
        // actionsheet 改变状态的值
      getValue (key, item) {
        if (item !== undefined && item !== this.stateMeet) {
          this.stateMeet = item;
          if (item === "全部") {
            this.stateMeetNum = -1;
          } else if (item === "进行中"){
            this.stateMeetNum = 8;
          } else {  // 已准
            this.stateMeetNum = 4;
          }
          this.$refs.scrollerMeetingLstPageIdxOne.initData();
        }
      },
      // 根据会议状态 获取会议查询信息
      async getOfficeMeetingData(size, index){
        if (sessionStorage.getItem("stateMeet") !== null && sessionStorage.getItem("stateMeetNum") !== null) {
          this.stateMeet = sessionStorage.getItem("stateMeet");
          this.stateMeetNum = parseInt(sessionStorage.getItem("stateMeetNum"));
          sessionStorage.removeItem("stateMeet");
          sessionStorage.removeItem("stateMeetNum");
        }
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'OfficeMeetingData', state: this.stateMeetNum, pageSize: size, pageIndex: index});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        console.log("dfdfdfd", d);
        return d;
      }
    },
    data () {
      return {
        showStatusMsg: false,
        stateMeet: '全部', // 开始状态默认-1
        stateMeetNum: -1, // 会议状态对应的数字，根据会议状态（数字）查询会议信息
        statusLists: ['已准', '进行中', '全部'], // 会议status状态值
        meetingLists: [] // 会议数据 数组
      }
    }
  }
</script>
<style scoped>
  .meetingList .weui-cell_switch label{
    font-size: 16px;
  }
  .meetingList .weui-cell_switch label:nth-child(1){
    color: #333333;
  }
  .meetingList .weui-cell_switch label:nth-child(2){
    float:right;
    color: #666666;
  }
  .meetingList .liMeetingList{
    margin-top: 10px;
    background-color: #ffffff;
  }
  .meetingList .liMeetingList .meetingImportAndUrgent{
    position: relative;
    top: 6px;
    float: right;
  }
  .meetingList .liMeetingList .meetingImportAndUrgent .meetingImport,
  .meetingList .liMeetingList .meetingImportAndUrgent .meetingUrgent{
    position: relative;
    display: inline-block;
    width: 35px;
  }
  .meetingList .liMeetingList .icon-importMeeting:before,
  .meetingList .liMeetingList .icon-urgentMeeting:before{
    position: absolute;
    top: 0;
    padding-right:0;
    font-size: 36px;
    content: '\e622';
    color: #5ac389;
    z-index:0;
  }
  .meetingList .liMeetingList .veryImporRed.icon-importMeeting:before{
    color: #ff0000;
  }
  .meetingList .liMeetingList .imporYellow.icon-importMeeting:before{
    color: #ff501d;
  }
  .meetingList .liMeetingList .veryUrgentRed.icon-urgentMeeting:before{
    color: #ff0000;
  }
  .meetingList .liMeetingList .urgentYellow.icon-urgentMeeting:before{
    color: #ff501d;
  }
  .meetingList .liMeetingList .icon-importMeeting > span,
  .meetingList .liMeetingList .icon-urgentMeeting > span{
    position:absolute;
    width: 16px;
    left: 10px;
    top: 0;
    line-height: 15px;
    font-size: 14px;
    z-index:1;
    text-align: center;
    color: #fff;
  }
  .meetingList .liMeetingList .veryImporRed > span,
  .meetingList .liMeetingList .veryUrgentRed > span{
    left: 0;
    top: 0;
    width: 35px;
  }
  .meetingList .mNht{
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    font-size: 16px;
    color: #333;
  }
  .meetingList .mNht .mNht-H{
    padding-left: 10px;
    font-size: 14px;
    color: #6f6f6f;
    font-weight:normal;
  }
  .meetingList .mNht .mNht-H .mNht-S{
    margin-left: 4px;
    background-color: #ff721a;
    padding: 1px 8px;
    font-size: 12px;
    color: #fff;
    border-radius: 4px;
  }
  .meetingList .mSe{
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size:14px;
    color: #6f6f6f;
  }
  .meetingList .mSub{
    padding-left: 10px;
    padding-bottom: 10px;
    padding-top: 5px;
    font-size:14px;
    color: #6f6f6f;
  }
</style>
<style>
  .meetingList .weui-cells {
    margin-top: 0;
  }
  .meetingList .weui-cells .vux-label{
    width: 100%;
    font-size: 16px;
    color: #333333;
  }
  .meetingList .xs-container{
    margin-top: 0;
  }
/*状态值面板*/
.meetingList .weui-actionsheet__menu .weui-actionsheet__cell{
  font-size: 16px;
  color: #333333;
}
.meetingList .weui-actionsheet__action .weui-actionsheet__cell{
  position: relative;
  padding: 10px 0;
  text-align: center;
  font-size: 16px;
  color: #666666;
}
</style>
