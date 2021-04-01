<template>
  <div class="newsPublish">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <tab>
      <tab-item :selected="showLst" @on-item-click="adjustApplyOrVerify(0)">新闻申请</tab-item>
      <tab-item v-if="canAudit === true" :selected="!showLst" @on-item-click="adjustApplyOrVerify(1)">新闻审批</tab-item>
    </tab>
    <!--新闻发布申请-->
    <div v-show="showLst" class="applyShowLst">
      <ex-scroller ref="scrollerApplyPageIdxOne" v-model="newPublishApplyData" :onGetList="getNewPublishApplyData" height="-90">
        <div>
          <group v-for="(n, index) in newPublishApplyData" :key="index">
            <cell is-link @click.native="goNewsPublishDetailPage(n.XWID,0,0)">
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
                <div class="firstLine">标题：{{n.XWBT}}</div>
                <div class="secondLine">发送范围：{{n.FSFW}}</div>
                <div class="thirdLine">创建时间：{{n.CreateTime}}</div>
                <div class="forthLine">截止日期：{{n.JZRQ}}</div>
                <div :class="`status status${n.States}`" v-if="states = n.States === '0' ? '未提交': (n.States === '2' ? '审核中': (n.States === '3' ? '通过': (n.States === '9' ? '撤回' : (n.States === '8' ? '退回并结束': '审核退回'))))">{{states}}</div>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--新闻发布审批-->
    <div v-if="canAudit === true" v-show="!showLst" class="verifyShowLst">
      <ex-scroller ref="scrollerAuditPageIdxOne" v-model="newPublishVerifyData" :onGetList="getNewPublishVerifyData" height="-90">
        <div>
          <group v-for="(n, index) in newPublishVerifyData" :key="index">
            <cell is-link @click.native="goNewsPublishDetailPage(n.XWID,n.AppId,n.REID)">
              <span slot="after-title" class="vux-label">
                <span class="fileImportAndUrgent">
                  <span class="fileImport">
                    <span class="school-wx-icon icon-importFile" slot="icon" style="font-size: 35px;">
                      <span v-if="n.ZYX === '非常重要'">非常重要</span>
                      <span v-if="n.ZYX === '重要'">重要</span>
                      <span v-if="n.ZYX === '普通'">普通</span>
                    </span>
                  </span>
                  <span class="fileUrgent">
                    <span class="school-wx-icon icon-urgentFile" slot="icon" style="font-size: 35px;">
                      <span v-if="n.JJD === '非常紧急'">非常紧急</span>
                      <span v-if="n.JJD === '紧急'">紧急</span>
                      <span v-if="n.JJD === '普通'">普通</span>
                    </span>
                  </span>
                </span>
                <div class="firstLine">标题：{{n.XWBT}}</div>
                <div class="secondLine">发送范围：{{n.FSFW}}</div>
                <div class="thirdLine">创建时间：{{n.CreateTime}}</div>
                <div class="forthLine">截止日期：{{n.JZRQ}}</div>
                <div :class="`status status${n.States}`" v-if="states = n.States === '0' ? '未提交': (n.States === '2' ? '审核中': (n.States === '3' ? '通过': (n.States === '9' ? '撤回' : (n.States === '8' ? '退回并结束': '审核退回'))))">{{states}}</div>
                <span class="chehui" @click.stop.prevent="revokeFlowData(n.REID)">撤回</span>
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
    name: 'newsPublish',
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
      // 判断是‘新闻发布申请’列表，还是 ‘新闻发布审核’列表
      adjustApplyOrVerify (type) {
        this.showType = type;
        this.showLst = this.showType === 0;
      },
      // 到‘新闻发布详情’页面,showType=0代表'新闻发布申请'列表，showType =1代表'新闻发布申请'列表
      goNewsPublishDetailPage (id, aId, rid) {
        // 把'新闻发布申请'的type 存sessionStorage,从'新闻发布详情'页面 可以返回'新闻发布申请'列表
        sessionStorage.setItem("newsPublishShowType", this.showType);
        this.$router.push({path: '/newsPublish/newsPublishDetail', query: {type: this.showType, id: id, aId: aId, rId: rid}});
      },
      // 到‘新闻发布申请’页面
      goNewsPublishApply () {
        this.$router.push({path: '/newsPublish/newsPublishApply'});
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
      },
      // 获取‘新闻发布申请’列表
      async getNewPublishApplyData (index, size) {
          // 判断显示哪个列表
        if (sessionStorage.getItem("newsPublishShowType") !== null) {
          this.showType = parseInt(sessionStorage.getItem("newsPublishShowType"));
          this.showLst = this.showType === 0;
          // 清除存'新闻发布申请'列表 doneAcceptFileType
          sessionStorage.removeItem("newsPublishShowType");
        }
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetUserSubmitFlowData', cellId: 'OA_FLOW_SQ_XWFB', pageIndex: index, pageSize: size, conditionList: ''});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        console.log("newsPublishApplyData:", d.data);
        return d.data;
      },
      // 根据流程申请业务模块的CellID和键值读取审批结果（审批步骤-审批人-回复内容等）
      /*async getCustomAuditResults () {
        if (this.showType === 0) {
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetCustomAuditResults', bizId: this.$route.query.id, cellId: 'OA_FLOW_SP_XWFB', auditedOnly: false});
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
          }
          console.log("getCustomAuditResults", d.data);
          this.auditResults = d.data;
        }
      },*/
      // 获取‘新闻发布审核’列表
      async getNewPublishVerifyData (index, size) {
        if (this.canAudit === true) {
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetUserAuditFlowData', cellId: 'OA_FLOW_SP_XWFB', pageIndex: index, pageSize: size, conditionList: ''});
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
          }
          console.log("newsPublishSPData:", d.data);
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
          // 新闻发布,用户是否有权限 查看‘审批’列表
          if (data[i].applyCellId === "OA_FLOW_SQ_XWFB"){
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
        showLst: true, // 开始默认'新闻发布申请'列表显示
        showType: 0, // 默认0是‘新闻发布申请’列表，1是 ‘新闻发布审核’列表
        newPublishApplyData: [], // 新闻发布申请列表
        newPublishVerifyData: [], // 新闻发布审核列表
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
  .secondLine{
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
  .newsPublish .verifyShowLst .weui-cells,
  .newsPublish .applyShowLst .weui-cells {
    position: relative;
    left: 2%;
    width: 96%;
    margin-top: 18px;
  }
</style>
