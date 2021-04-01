<template>
  <div class="employeeLeave">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <tab>
      <tab-item :selected="showLst" @on-item-click="adjustApplyOrVerify(0)">职工请假申请</tab-item>
      <tab-item v-if="canAudit" :selected="!showLst" @on-item-click="adjustApplyOrVerify(1)">职工请假审批</tab-item>
    </tab>
    <!--职工请假申请-->
    <div v-show="showLst" class="applyShowLst">
      <ex-scroller ref="scrollerApplyPageIdxOne" v-model="employeeLeaveApplyData" :onGetList="getEmployeeLeaveApplyData" height="-90">
        <div>
          <group v-for="(n, index) in employeeLeaveApplyData" :key="index">
            <cell is-link @click.native="goEmployeeLeaveDetailPage(n.QJID,0,0)">
              <span slot="after-title" class="vux-label">
                <div class="xmIconImg">
                  <span class="school-wx-icon xm-icon" slot="icon">&#xe657;</span>
                  <span class="iconXM">{{n.XM}}</span>
                </div>
                <div class="infor">
                  <div class="firstLine">工号：{{n.ZGH}}</div>
                  <div class="secondLine">请假类型：{{n.LeaveType}}</div>
                  <div class="thirdLine">开始日期：{{n.KSRQ}}</div>
                  <div class="forthLine">结束日期：{{n.JSRQ}}</div>
                  <div class="firthLine">请假天数：{{n.Days}}天</div>
                  <div :class="`status status${n.States}`" v-if="states = n.States === '0' ? '未提交': (n.States === '2' ? '审核中': (n.States === '3' ? '通过': (n.States === '9' ? '撤回' : (n.States === '8' ? '退回并结束': '审核退回'))))">{{states}}</div>
                </div>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--职工请假审批-->
    <div v-if="canAudit && !showLst" class="verifyShowLst">
      <ex-scroller ref="scrollerAuditPageIdxOne" v-model="employeeLeaveVerifyData" :onGetList="getEmployeeLeaveVerifyData" height="-90">
        <div>
          <group v-for="(n, index) in employeeLeaveVerifyData" :key="index">
            <cell is-link @click.native="goEmployeeLeaveDetailPage(n.QJID,n.AppId,n.REID)">
              <span slot="after-title" class="vux-label">
                <div class="xmIconImg">
                  <span class="school-wx-icon xm-icon" slot="icon">&#xe657;</span>
                  <span class="iconXM">{{n.XM}}</span>
                </div>
                <div class="infor">
                  <div class="firstLine">工号：{{n.ZGH}}</div>
                  <div class="secondLine">请假类型：{{n.LeaveType}}</div>
                  <div class="thirdLine">开始日期：{{n.KSRQ}}</div>
                  <div class="forthLine">结束日期：{{n.JSRQ}}</div>
                  <div class="firthLine">请假天数：{{n.Days}}天</div>
                  <div :class="`status status${n.States}`" v-if="states = n.States === '0' ? '未提交': (n.States === '2' ? '审核中': (n.States === '3' ? '通过': (n.States === '9' ? '撤回' : (n.States === '8' ? '退回并结束': '审核退回'))))">{{states}}</div>
                  <span v-if="n.States === '2' && n.UserState === '未审批' && n.StepState !== '通过'" class="chehui" @click.stop.prevent="revokeFlowData(n.REID)">撤回</span>
                </div>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--添加‘职工请假申请’-->
    <!--<add-page @click.native="goEmployeeLeaveApply()"></add-page>-->
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'

  import ExScroller from '../common/ExScroller.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import addPage from '../primaryKey/AddPage.vue'

  export default {
    name: 'employeeLeave',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Tab,
      TabItem,
      ExScroller,
      Cell,
      Group,
      addPage
    },
    methods: {
      // 判断是‘职工请假申请’列表，还是 ‘职工请假审批’列表
      adjustApplyOrVerify (type) {
        this.showType = type;
        this.showLst = this.showType === 0;
      },
      // 到‘职工请假详情’页面
      goEmployeeLeaveDetailPage (id, aId, rid) {
        // 把'新职工请假申请'的type 存sessionStorage,从'职工请假详情'页面 可以返回'职工请假申请'列表
        sessionStorage.setItem("employeeLeaveShowType", this.showType);
        this.$router.push({path: '/employeeLeave/employeeLeaveDetail', query: {type: this.showType, id: id, aId: aId, rId: rid}});
      },
      // 到‘职工请假申请’页面
      /*goEmployeeLeaveApply () {
        this.$router.push({path: '/'});
      },*/
      //  管理端，对已提交的流程进行的撤回操作（管理端随时可进行撤回，及时已经审批通过）
      async revokeFlowData (id) {
        let name = this.QD.getLocalUserinfo().stuObj.XM;
        let that = this;
        this.QD.confirm("提示: 请输入撤回说明（限100字）", "", async function (m) {
          let mlen = m.replace(/[\u0391-\uFFE5]/g, "a").length;
          if (mlen>100){
            that.QD.alert('', '撤回说明不能超过100个字！');
            return;
          }
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'apiOA.RevokeFlowData',
            removerName: name,
            resultIdList: id,
            revokedComments: m
          });
          if (d.status && d.status === "error") {
            that.QD.alert(`获取数据失败:${d.msg}`);
          }
          that.loading = false;
          console.log("revokeFlowData", d.status);
          if (d.status === 'success') {
            that.QD.alert('', '撤回成功！');
            that.$refs.scrollerAuditPageIdxOne.initData();// 编辑刷新
            that.$refs.scrollerApplyPageIdxOne.initData(); // 申请列表刷新
          } else {
            that.QD.alert('', '撤回失败！');
          }
        }, null, {showInput: true, inputVal: "", required: true});
      },
      // 获取‘职工请假申请’列表
      async getEmployeeLeaveApplyData (index, size) {
        // 判断显示哪个列表
        if (sessionStorage.getItem("employeeLeaveShowType") !== null) {
          this.showType = parseInt(sessionStorage.getItem("employeeLeaveShowType"));
          this.showLst = this.showType === 0;
          // 清除存'职工请假申请'列表 doneAcceptFileType
          sessionStorage.removeItem("employeeLeaveShowType");
        }
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetUserSubmitFlowData', cellId: 'OA_FLOW_SQ_ZGQJ', pageIndex: index, pageSize: size, conditionList: ''});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        console.log("leaveApplyData:", d.data);
        return d.data;
      },
      // 获取‘职工请假审批’列表
      async getEmployeeLeaveVerifyData (index, size) {
        if (this.canAudit === true) {
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetUserAuditFlowData', cellId: 'OA_FLOW_SP_ZGQJ', pageIndex: index, pageSize: size, conditionList: ''});
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
          }
          console.log("zgqjSPData:", d.data);
          return d.data;
        }
      },
      // 读取用户可申请和审批的流程菜单
      async getUserMenus () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetUserMenus'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        let data = d.data;
        for (let i=0; i<data.length; i++) {
          // 用户是否有权限 查看‘审批’列表
          if (data[i].applyCellId === "OA_FLOW_SQ_ZGQJ"){
            this.canAudit = data[i].canAudit;
            break;
          }
        }
        console.log("GetUserMenus Data:", d);
      }
    },
    created () {
      // 读取用户可申请和审批的流程菜单
      this.getUserMenus();
    },
    data () {
      return {
        loading: false,
        showLst: true, // 开始默认'职工请假申请'列表显示
        showType: 0, // 默认0是‘职工请假申请’列表，1是 ‘职工请假审批’列表
        employeeLeaveApplyData: [], // 职工请假申请列表
        employeeLeaveVerifyData: [], // 职工请假审核列表
        canAudit: false // 默认无权限 查看‘审批’列表
      }
    }
  }
</script>
<style scoped>
  .verifyShowLst,
  .applyShowLst{
    background-color: #f2f2f2;
  }
  .firstLine{
    color: #333333;
  }
  .secondLine,
  .thirdLine,
  .forthLine,
  .firthLine{
    color: #666666;
    font-size: 14px;
  }
  .status{
    font-size: 14px;
    color: #ff7549;
  }
  .status3{
    color: #008000;
  }
  /*头像xmIconImg*/
  .xmIconImg{
    display: block;
    float: left;
  }
  .xm-icon{
    position: absolute;
    font-size: 35px;
    padding-right:0;
  }
  .iconXM{
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
  .infor{
    width:81%;
    float: left;
    font-size: 16px;
    margin-left: 8px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .chehui{
    float: right;
    padding: 2px 8px;
    font-size: 14px;
    border:1px solid #ff0000;
    color: #ff0000;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
</style>
<style>
  .employeeLeave .verifyShowLst .weui-cells,
  .employeeLeave .applyShowLst .weui-cells {
    position: relative;
    left: 2%;
    width: 96%;
    margin-top: 18px;
  }
</style>
