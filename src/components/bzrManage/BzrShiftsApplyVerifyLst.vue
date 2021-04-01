<template>
  <div class="eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <tab-change class="tab-box" :tabItemLst="canBrowse ? tabType1 : tabType2" :selectedTabType="selectedTabType" @get-TabVal="typeTabClick"></tab-change>
    <div style="background-color: #f5f5f9;">
      <select-status v-if="selectedTabType === 1" :valueLst="QD.applyStatusLst" :defaultStatus="defaultApplyStatus" :title="'状态值'" @get-val="selectApplyStatusVal"></select-status>
      <ex-scroller v-show="selectedTabType === 1" ref="scrollerApplyPageIdxOne" v-model="applyLst" :onGetList="getApplyLst" height="-134">
        <div>
          <apply-verify-lst v-for="(s, sidx) in applyLst" :key="sidx" :item="s" :isLink="true" :showIconTitle="false" :iconTitleType="false" @click-cell="goApplyDetail">
            <p slot="right-info">
              <label v-if="s.DBXM">顶班人：{{s.DBXM}}</label>
              <label v-if="!s.DBXM">顶班人：无</label>
              <br />
              <label>
                <a class="workDate">顶班开始时间：{{s.KSRQ}} {{s.KSRQFW}}</a>
                <br /><a class="workDate">顶班结束时间：{{s.JSRQ}} {{s.JSRQFW}}</a>
              </label>
              <br /><span class="applyDate">{{s.ApplyDate}}</span>
            </p>
            <span slot="keep-right">
              <a v-if="s.States === '0'">未提交</a>
              <a v-if="s.States === '1'" class="verifying-icon">审核中</a>
              <a v-if="s.States === '2'" class="pass-icon">审核通过</a>
              <a v-if="s.States === '4'" class="lost-icon">被退回</a>
            </span>
          </apply-verify-lst>
        </div>
      </ex-scroller>
    </div>
    <!-- 审核的列表 start -->
    <div style="background-color: #f5f5f9;">
      <select-status v-if="selectedTabType === 2" :valueLst="auditStatesLst" :defaultStatus="defaultVerifyStatus" :title="'状态值'" @get-val="selectVerifyStatusVal"></select-status>
      <ex-scroller v-show="selectedTabType === 2" ref="scrollerAuditPageIdxOne" v-model="verifyLst" :onGetList="getAuditLst" height="-134">
        <div>
          <apply-verify-lst v-for="(s, sidx) in verifyLst" :key="sidx" :item="s" :isLink="true" :showIconTitle="true" :iconTitleType="false" @click-cell="goAuditDetail">
            <a slot="iconTitle">{{s.XM.substr(s.XM.length-2, 2)}}</a>
            <div slot="right-info">
              <p>申请人：{{s.XM}}</p>
              <label v-if="s.DBXM">顶班人：{{s.DBXM}}</label>
              <label v-if="!s.DBXM">顶班人：无</label>
              <br />
              <label>
                <a class="workDate">顶班开始时间：{{s.KSRQ}} {{s.KSRQFW}}</a>
                <br /><a class="workDate">顶班结束时间：{{s.JSRQ}} {{s.JSRQFW}}</a>
              </label>
              <br /><span class="applyDate">{{s.ApplyDate}}</span>
            </div>
            <span slot="keep-right">
              <a v-if="s.States === '1'" class="verifying-icon">审核中</a>
              <a v-if="s.States === '2'" class="pass-icon">审核通过</a>
              <a v-if="s.States === '4'" class="lost-icon">被退回</a>
            </span>
          </apply-verify-lst>
        </div>
      </ex-scroller>
    </div>
    <!-- 审核的列表 end -->
    <!--添加‘申请’-->
    <add-page @click.native="goAddApply()"></add-page>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import ExScroller from '../common/ExScroller.vue'
  import ApplyVerifyLst from '../common/VerifyLst.vue'
  import SelectStatus from '../common/SelectActionsheelVal.vue'
  import TabChange from '../common/TabChange.vue'
  import addPage from '../primaryKey/AddPage.vue'
  export default {
    name: 'bzrManage-BzrShiftsApplyVerifyLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      ApplyVerifyLst,
      addPage,
      SelectStatus,
      TabChange,
      ExScroller
    },
    methods: {
        // 添加申请
      goAddApply () {
        this.savePgData();
        this.$router.push({path: '/bzrManage/bzrShiftsWorkApply', query: {id: 0}});
      },
        // 到详情页面
      goApplyDetail (e) {
        this.savePgData();
        this.$router.push({path: '/bzrManage/bzrShiftsWorkDetail', query: {id: e.info.DBID, type: 1}});
      },
      // 审批详情
      goAuditDetail (e) {
        this.savePgData();
        this.$router.push({path: '/bzrManage/bzrShiftsWorkDetail', query: {id: e.info.DBID, type: 2}});
      },
      // 审批
      verifyButton (e) {
        console.log(e.type);
        if (e.type.type === 2) {
          this.verifyWay('通过');
        } else {
          this.verifyWay('拒绝');
        }
      },
      // 审批方法
      verifyWay (type) {
        let that = this;
        this.QD.confirm("提示: 请输入"+ type + "说明（限100字）", "", async function (m) {
          let mlen = m.replace(/[\u0391-\uFFE5]/g, "a").length;
          if (mlen>100){
            that.QD.alert('', type + '说明不能超过100个字！');
            return;
          }
          console.log('');
        }, null, {showInput: true, inputVal: "", required: true});
      },
      // 点击tab标题，切换常用岗位申请和临时岗位申请
      typeTabClick(e) {
        this.selectedTabType = e.type;
      },
      // 得到选中的申请状态信息- 重新加载第一页数据
      selectApplyStatusVal (e) {
        this.defaultApplyStatus = e.info;
        this.setApplyWhereInfo(this.defaultApplyStatus.type);
        this.$refs.scrollerApplyPageIdxOne.initData(); // 重新加载第一页数据
      },
      setApplyWhereInfo (type) {
        if (type === -1) {
          this.whereApplyInfo = [];
        } else {
          this.whereApplyInfo = [{FieldName: 'states', Operator: 'Equal', NeedQuotes: false, Value: type}];
        }
      },
      async getApplyLst (index, size) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'ClassWorkInsteadApplyData',
          PageIndex: index,
          PageSize: size,
          Search: JSON.stringify(this.whereApplyInfo)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`${d.msg}`);
          return;
        }
        return d.List;
      },
      // 得到选中的审核状态信息- 重新加载第一页数据
      selectVerifyStatusVal (e) {
        this.defaultVerifyStatus = e.info;
        this.setVerifyWhereInfo(this.defaultVerifyStatus.type);
        this.$refs.scrollerAuditPageIdxOne.initData(); // 重新加载第一页数据
      },
      setVerifyWhereInfo (type) {
        if (type === -1) {
          this.whereVerifyInfo = [];
        } else {
          this.whereVerifyInfo = [{FieldName: 'states', Operator: 'Equal', NeedQuotes: false, Value: type}];
        }
      },
      // 审核列表
      async getAuditLst (index, size) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'ClassWorkInsteadAuditData',
          PageIndex: index,
          PageSize: size,
          Search: JSON.stringify(this.whereVerifyInfo)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`${d.msg}`);
          return;
        }
        return d.List;
      },
      // 根据用户和菜单 获取用户对审批菜单的审批权限
      async getSysUserPriorityData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSysUsersPriorityData', cellId: 'XGGL_BJXX_BZRDBSP'});
        this.loading = false;
        if (d.status && d.status === "error") {
          // this.QD.alert(`获取用户审批权限失败`);
          console.log('获取用户审批权限失败');
        } else {
          this.canBrowse = d.CanBrowse;
        }
      },
      // 保存本页面的数据
      savePgData () {
        this.QD.parentPageData = {
          canBrowse: this.canBrowse,
          defaultApplyStatus: this.defaultApplyStatus,
          whereApplyInfo: this.whereApplyInfo,
          defaultVerifyStatus: this.defaultVerifyStatus,
          whereVerifyInfo: this.whereVerifyInfo,
          selectedTabType: this.selectedTabType
        };
        console.log('ds save', this.selectedTabType);
      },
      // 得到本页面保存的数据
      getSavePgData () {
        if (this.QD.parentPageData) {
          let s = this.QD.parentPageData;
          this.canBrowse = s.canBrowse;
          this.defaultApplyStatus = s.defaultApplyStatus;
          this.whereApplyInfo = s.whereApplyInfo;
          this.defaultVerifyStatus = s.defaultVerifyStatus;
          this.whereVerifyInfo = s.whereVerifyInfo;
          this.selectedTabType = s.selectedTabType;
          this.QD.parentPageData = null;
          console.log('ds get save', this.selectedTabType);
        } else {
          this.getSysUserPriorityData(); // 根据用户和菜单 获取用户对审批菜单的审批权限
        }
      }
    },
    created () {
      this.getSavePgData();// 得到本页面保存的数据
    },
    data () {
      return {
        loading: false,
        canBrowse: false, // 默认用户无权限查看审批列表权限
        whereVerifyInfo: [], // 申请条件筛选
        whereApplyInfo: [], // 申请条件筛选 {"FieldName": "UserID", "Operator": "Equal", "Value": "gaojianping", "NeedQuotes": true}
        applyLst: [], // 申请列表
        verifyLst: [], // 审批列表
        selectedTabType: 1, // 开始默认选中tab 1
        // tab 类型集合
        tabType1: [{
          title: '班主任顶班申请',
          type: 1
        }, {
          title: '班主任顶班审批',
          type: 2
        }],
        tabType2: [{
          title: '班主任顶班申请',
          type: 1
        }],
        defaultApplyStatus: {
          label: '全部',
          type: -1
        }, // 申请默认选中的状态值
        defaultVerifyStatus: {
          label: '全部',
          type: -1
        }, // 审批默认选中的状态值
        auditStatesLst: [{ // 状态值列表
          label: '全部',
          type: -1
        }, {
          label: '审核中',
          type: 1
        }, {
          label: '审核通过',
          type: 2
        }, {
          label: '被退回',
          type: 4
        }]
      }
    }
  }
</script>
<style scoped>
  .workDate{
    font-size: 14px;
    color: #333333;
  }
  .applyDate{
    font-size: 12px;
    color: #666666;
  }
</style>
