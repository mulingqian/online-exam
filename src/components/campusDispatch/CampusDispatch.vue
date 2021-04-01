<template>
  <div class="campusDispatch">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <tab>
      <tab-item :selected="showLst" @on-item-click="adjustApplyOrVerify(0)">校内发文管理</tab-item>
      <tab-item v-if="canAudit" :selected="!showLst" @on-item-click="adjustApplyOrVerify(1)">校内发文审批</tab-item>
    </tab>
    <!--校内发文管理-->
    <div v-show="showLst" class="applyShowLst">
      <ex-scroller ref="scrollerApplyPageIdxOne" v-model="campusDispatchApplyData" :onGetList="getCampusDispatchApplyData" height="-90">
        <div>
          <group v-for="(n, index) in campusDispatchApplyData" :key="index">
            <cell is-link @click.native="goCampusDispatchDetailPage(n.FWID,0,0)">
              <span slot="after-title" class="vux-label">
                <span class="fileImportAndUrgent">
                  <span class="fileImport">
                    <span :class="`school-wx-icon icon-importFile ${n.ZYX === '非常重要' ? 'veryImporRed': (n.ZYX === '重要'? 'imporYellow': '')}`" slot="icon" style="font-size: 35px;">
                      <span v-if="n.ZYX === '非常重要'">非常重要</span>
                      <span v-if="n.ZYX === '重要'">重要</span>
                      <span v-if="n.ZYX === '普通'">普通</span>
                    </span>
                  </span>
                  <span class="fileUrgent">
                    <span :class="`school-wx-icon icon-urgentFile ${n.JJD === '非常紧急'? 'veryUrgentRed': (n.JJD === '紧急'? 'urgentYellow': '')}`" slot="icon" style="font-size: 35px;">
                      <span v-if="n.JJD === '非常紧急'">非常紧急</span>
                      <span v-if="n.JJD === '紧急'">紧急</span>
                      <span v-if="n.JJD === '普通'">普通</span>
                    </span>
                  </span>
                </span>
                <div class="firstLine">标题：{{n.FWBT}}</div>
                <div class="secondLine">文号：{{n.FWWH}}</div>
                <div class="thirdLine">来文日期：{{n.LWRQ}}</div>
                <div class="forthLine">处理期限：{{n.CLQX}}</div>
                <div :class="`status status${n.States}`" v-if="states = n.States === '0' ? '未提交': (n.States === '2' ? '审核中': (n.States === '3' ? '通过': (n.States === '9' ? '撤回' : (n.States === '8' ? '退回并结束': '审核退回'))))">{{states}}</div>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--校内发文审批-->
    <div v-if="canAudit && !showLst" class="verifyShowLst">
      <ex-scroller ref="scrollerAuditPageIdxOne" v-model="campusDispatchVerifyData" :onGetList="getCampusDispatchVerifyData" height="-90">
        <div>
          <group v-for="(n, index) in campusDispatchVerifyData" :key="index">
            <cell is-link @click.native="goCampusDispatchDetailPage(n.FWID,n.AppId,n.REID)">
              <span slot="after-title" class="vux-label">
                <span class="fileImportAndUrgent">
                  <span class="fileImport">
                    <span :class="`school-wx-icon icon-importFile ${n.ZYX === '非常重要' ? 'veryImporRed': (n.ZYX === '重要'? 'imporYellow': '')}`" slot="icon" style="font-size: 35px;">
                      <span v-if="n.ZYX === '非常重要'">非常重要</span>
                      <span v-if="n.ZYX === '重要'">重要</span>
                      <span v-if="n.ZYX === '普通'">普通</span>
                    </span>
                  </span>
                  <span class="fileUrgent">
                    <span :class="`school-wx-icon icon-urgentFile ${n.JJD === '非常紧急'? 'veryUrgentRed': (n.JJD === '紧急'? 'urgentYellow': '')}`" slot="icon" style="font-size: 35px;">
                      <span v-if="n.JJD === '非常紧急'">非常紧急</span>
                      <span v-if="n.JJD === '紧急'">紧急</span>
                      <span v-if="n.JJD === '普通'">普通</span>
                    </span>
                  </span>
                </span>
                <div class="firstLine">标题：{{n.FWBT}}</div>
                <div class="secondLine">文号：{{n.FWWH}}</div>
                <div class="thirdLine">来文日期：{{n.LWRQ}}</div>
                <div class="forthLine">处理期限：{{n.CLQX}}</div>
                <div :class="`status status${n.States}`" v-if="states = n.States === '0' ? '未提交': (n.States === '2' ? '审核中': (n.States === '3' ? '通过': (n.States === '9' ? '撤回' : (n.States === '8' ? '退回并结束': '审核退回'))))">{{states}}</div>
                <span v-if="n.States === '2' && n.UserState === '未审批' && n.StepState !== '通过'" class="chehui" @click.stop.prevent="revokeFlowData(n.REID)">撤回</span>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--添加‘新闻发布申请’-->
    <!--<add-page @click.native="goNewsPublishApply()"></add-page>-->
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
    name: 'campusDispatch-campusDispatch',
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
      // 判断是‘校内发文管理’列表，还是 ‘校内发文审批’列表
      adjustApplyOrVerify (type) {
        this.showType = type;
        this.showLst = this.showType === 0;
      },
      // 到‘校内发文详情’页面
      goCampusDispatchDetailPage (id, aId, rid) {
        // 把'校内发文详情'的type 存sessionStorage,从'校内发文详情'页面 可以返回'校内发文详情'列表
        sessionStorage.setItem("campusDispatchShowType", this.showType);
        this.$router.push({path: '/campusDispatch/campusDispatchDetail', query: {type: this.showType, id: id, aId: aId, rId: rid}});
      },
      // 到‘校内发文申请’页面
      goNewsPublishApply () {
        this.$router.push({path: '/campusDispatch/campusDispatchApply'});
      },
      // 获取‘校内发文管理’列表
      async getCampusDispatchApplyData (index, size) {
        // 判断显示哪个列表
        if (sessionStorage.getItem("campusDispatchShowType") !== null) {
          this.showType = parseInt(sessionStorage.getItem("campusDispatchShowType"));
          this.showLst = this.showType === 0;
          // 清除存'校内发文管理'列表 campusDispatchShowType
          sessionStorage.removeItem("campusDispatchShowType");
        }
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetUserSubmitFlowData', cellId: 'OA_FLOW_SQ_FWGL', pageIndex: index, pageSize: size, conditionList: ''});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        console.log("campusDispatchSQ:", d.data);
        return d.data;
      },
      // 获取‘校内发文审批’列表
      async getCampusDispatchVerifyData (index, size) {
        if (this.canAudit === true) {
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetUserAuditFlowData', cellId: 'OA_FLOW_SP_FWGL', pageIndex: index, pageSize: size, conditionList: ''});
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
          }
          console.log("campusDispatchSPData:", d.data);
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
          // 公告发布,用户是否有权限 查看‘审批’列表
          if (data[i].applyCellId === "OA_FLOW_SQ_FWGL"){
            this.canAudit = data[i].canAudit;
            break;
          }
        }
        console.log("GetUserMenus Data:", d);
      },
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
      }
    },
    created () {
      // 读取用户可申请和审批的流程菜单
      this.getUserMenus();
    },
    data () {
      return {
        loading: false,
        showLst: true, // 开始默认'校内发文管理'列表显示
        showType: 0, // 默认0是‘校内发文管理’列表，1是 ‘新闻发布审核’列表
        campusDispatchApplyData: [], // 校内发文管理 列表
        campusDispatchVerifyData: [], // ‘校内发文审批’列表
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
  .forthLine{
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
  /*紧急度和重要性的css*/
  .vux-label .fileImportAndUrgent{
    float: right;
  }
  .vux-label .fileImportAndUrgent .fileImport,
  .vux-label .fileImportAndUrgent .fileUrgent{
    position: relative;
    display: inline-block;
    width: 35px;
  }
  .vux-label .icon-importFile:before,
  .vux-label .icon-urgentFile:before{
    position: absolute;
    top: -17px;
    padding-right:0;
    font-size: 36px;
    content: '\e622';
    color: #5ac389;
    z-index:0;
  }
  .vux-label .veryImporRed.icon-importFile:before{
    color: #ff0000;
  }
  .vux-label .imporYellow.icon-importFile:before{
    color: #ff501d;
  }
  .vux-label .veryUrgentRed.icon-urgentFile:before{
    color: #ff0000;
  }
  .vux-label .urgentYellow.icon-urgentFile:before{
    color: #ff501d;
  }
  .vux-label .icon-importFile > span,
  .vux-label .icon-urgentFile > span{
    position:absolute;
    width: 16px;
    left: 10px;
    top: -7px;
    line-height: 15px;
    font-size: 14px;
    z-index:1;
    text-align: center;
    color: #fff;
  }
  .vux-label .veryImporRed > span,
  .vux-label .veryUrgentRed > span{
    left: 0;
    top: -6px;
    width: 35px;
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
  .campusDispatch .verifyShowLst .weui-cells,
  .campusDispatch .applyShowLst .weui-cells {
    position: relative;
    left: 2%;
    width: 96%;
    margin-top: 18px;
  }
</style>
