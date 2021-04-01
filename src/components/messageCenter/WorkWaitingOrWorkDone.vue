<template>
  <div class="workWaitingOrWorkDone">
    <tab>
      <tab-item :selected="showLst" @on-item-click="judgeConfirmed(0)">待办工作</tab-item>
      <tab-item :selected="!showLst" @on-item-click="judgeConfirmed(1)">已办工作</tab-item>
    </tab>
    <!--待办工作-->
    <div v-show="showLst">
      <scroller lock-x :scrollbar-y="true" height="-90">
        <group>
          <cell v-for="(item,dIndex) in ofDoingsData" :key="dIndex" @click.native="goWorkWaitingDetail(item.BDID, item.URL, 1)" is-link>
            <span slot="after-title" class="vux-label">
              <span class="doneSubject">{{item.Subject}}</span>
              <span class="workTime">{{item.CreateTime}}</span>
            </span>
          </cell>
        </group>
      </scroller>
    </div>
    <!--待办工作end-->
    <!--已办工作-->
    <div v-show="!showLst">
      <scroller lock-x :scrollbar-y="true" height="-90">
        <group>
          <cell v-for="(item,dIndex) in oFDoneData" :key="dIndex" @click.native="goWorkWaitingDetail(item.BDID, item.URL, 2)" is-link>
            <span slot="after-title" class="vux-label">
              <span class="doneSubject">{{item.Subject}}</span>
              <span class="workTime">{{item.CreateTime}}</span>
            </span>
          </cell>
        </group>
      </scroller>
    </div>
    <!--已办工作end-->
  </div>
</template>
<script>
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'

  import Scroller from 'vux/src/components/scroller/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'workWaitingOrWorkDone',
    directives: {
    },
    components: {
      Tab,
      TabItem,
      Scroller,
      Cell,
      Group
    },
    methods: {
        // 从详情页面还回 判断显示待办工作 还是已办工作
      getConfire () {
        console.log("confirmed is ");
        if (sessionStorage.getItem("workWaitingOrDoneConfirm") !== null) {
          this.confirmed = parseInt(sessionStorage.getItem("workWaitingOrDoneConfirm"));
          this.showLst = this.confirmed === 0;
          sessionStorage.removeItem("workWaitingOrDoneConfirm");
        }
      },
        // 判断是待办工作，还是已办工作
      judgeConfirmed (c) {
        this.confirmed = c;
        this.showLst = this.confirmed === 0;
      },
      /*待办工作到详情页面,已办工作到详情页面*/
      goWorkWaitingDetail (id, url, type) {
        if (url !== undefined && url.length > 0) {
          if (type === 1 && this.QD.schoolName && this.QD.schoolName === '广西梧州商贸学校') {
            this.specialGoWorkWaitingDetail(id, url); // 特殊学校版本- 加抢单维修 待办工作到详情页面,已办工作到详情页面
          } else if (type === 1) {
            this.commonGoWorkWaitingDetail(id);  // 学校通用版本 待办工作到详情页面,已办工作到详情页面
          }
          /*更新待办事宜为已读 end*/
          if (url.indexOf('OfficeMeetingEdit.aspx') > 0 || url.indexOf('OfficeMeetingBrowse.aspx') > 0) {
            /*确保还回来的时候对应 待办工作或 已办工作*/
            sessionStorage.setItem("workWaitingOrDoneConfirm", this.confirmed);
            let meetId = url.substring(url.indexOf('key') + 4);
            //跳转到会议
            this.$router.push({ path: '/meetingListDetail', query: {mid: meetId} });
          } else if (url.indexOf('FlowDocProcessEdit.aspx') > 0) {
            /*确保还回来的时候对应 待办工作或 已办工作*/
            sessionStorage.setItem("workWaitingOrDoneConfirm", this.confirmed);
            let docId = url.substring(url.indexOf('key') + 4);
            //跳转到公文
            this.$router.push({path: '/receiptManagement/acceptFileDetail', query: {id: docId}});
          } else {
            /*确保还回来的时候对应 待办工作或 已办工作*/
            sessionStorage.setItem("workWaitingOrDoneConfirm", this.confirmed);
            // 跳转到任务详情页面
            this.$router.push({path: '/messageCenter/workDo', query: {id: id}});
          }
        } else {
          /*确保还回来的时候对应 待办工作或 已办工作*/
          sessionStorage.setItem("workWaitingOrDoneConfirm", this.confirmed);
          // 跳转到任务详情页面
          this.$router.push({path: '/messageCenter/workDo', query: {id: id}});
        }
      },
      // 特殊学校版本- 加抢单维修 待办工作到详情页面,已办工作到详情页面
      async specialGoWorkWaitingDetail (id, url) {
        let d;
        let keyVal = 0; // 报修路径地址中的key值, 不属于报修的bxid 一律是 0
        if (url.indexOf('Office/BXGL/BXCL/') > 0) { // 报修待办类型 /Office/BXGL/BXCL/StudentDeviceRepairDealEdit.aspx/ DeviceRepairDealEdit.aspx
          let startIdx = url.indexOf('key=') + 4;
          let endIdx = url.indexOf('&');
          keyVal = url.substr(startIdx, endIdx-startIdx); // 取得报修路径地址中的key值
          console.log('key', keyVal);
          d = await this.QD.getData('/ComApi/PostObject', {
            apiName: 'UpdateOFDoingStatuReadRepairStatus',
            bdid: id, // 待办主键
            bxid: keyVal // 报修主键
          });
        } else {
          d = await this.QD.getData('/ComApi/PostObject', {apiName: 'UpdateOFDoingStatuRead', BDID: id});
        }
        console.log('更新已读 update', d);
      },
      /* 学校通用版本 待办工作到详情页面,已办工作到详情页面 */
      async commonGoWorkWaitingDetail (id) {
        /*更新待办事宜为已读 */
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'UpdateOFDoingStatuRead', BDID: id});
        console.log("更新已读", d);
        /*更新待办事宜为已读 end*/
      },
      // 获取待办工作列表
      async getOFDoings () {
        if (this.QD.getLocalUserinfo().stuObj.XH !== undefined) {
          this.zghOrXh = this.QD.getLocalUserinfo().stuObj.XH;
        } else {
          this.zghOrXh = this.QD.getLocalUserinfo().stuObj.ZGH;
        }
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetOFDoings', ZGH: this.zghOrXh, Confirmed: 0});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.ofDoingsData = d;
        this.getOFDone();
      },
      // 获取已办工作列表
      async getOFDone () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetOFDoings', ZGH: this.zghOrXh, Confirmed: 1});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.oFDoneData = d;
      }
    },
    created () {
      this.getConfire();
      this.getOFDoings();
    },
    data () {
      return {
        // loading: false,
        zghOrXh: '', // 得到职工号或学生学号
        showLst: true, // 待办工作显示，已办工作隐藏
        ofDoingsData: [], // 待办工作
        oFDoneData: [], // 已办工作
        confirmed: 0 // 默认开始时待办工作，已办工作confirmed 是1
      }
    }
  }
</script>
<style scoped>
  .workWaitingOrWorkDone .vux-label{
    overflow: hidden;
  }
  .workWaitingOrWorkDone .doneSubject{
    display: inline-block;
    width: 70%;
    color: #333333;
    font-size: 14px;
  }
  .workWaitingOrWorkDone .workTime{
    display: block;
    font-size: 12px;
    color: #999999;
  }
</style>
<style>
  .workWaitingOrWorkDone .weui-cells {
    margin-top: 18px;
  }
</style>
