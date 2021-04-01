<template>
  <div class="eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <sift-verify-lst :selectXQID="selectXQID" :selectResult_sift="selectResult_sift" :selectIdx_sift="selectIdx_sift" @get-xqInfo="getXqInfo" @get-selectVal="getSelectInfo"></sift-verify-lst>
    <div class="dataBox">
      <ex-scroller v-if="loaded" v-model="verifyLst" :onGetList="getVerifyData" ref="scrollerPageIndexOne" height="-96">
        <div>
          <verify-lst :class="sidx !== 0 ? 'gpBox': ''" v-for="(s, sidx) in verifyLst" :key="sidx" :item="s" :isLink="true" :showIconTitle="true" :iconTitleType="false" @click-cell="goAuditDetail">
            <a slot="iconTitle">{{s.XM.substr(s.XM.length-2, 2)}}</a>
            <div slot="right-info">
            </div>
            <div slot="right-info" class="rightInfo">
              <p class="rp0">
                <span>申请人：{{s.XM}}</span>
                <span class="submitTime">{{s.SubmitTime}}</span>
              </p>
              <p class="rp1">
                <span>{{s.DKXZ}} {{s.ChangeType}}</span>
              </p>
              <p class="rp2">
                <span>概要:</span>
                <span>{{s.Subject}}</span>
              </p>
              <p class="rp3">{{s.XQMC}}</p>
              <p :class="`rp4 ${s.AuditState === '已通过' ? 'pass-icon' : (s.AuditState === '已激活' ? 'verifying-icon' : (s.AuditState === '已退回' ? 'lost-icon' : 'nosubmit-icon'))}`">
                {{s.AuditState}}
              </p>
            </div>
          </verify-lst>
        </div>
      </ex-scroller>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import ExScroller from '../common/ExScroller.vue'
  /*import SelectStatus from '../common/SelectActionsheelVal.vue'*/
  import SiftVerifyLst from './SiftVerifyLst.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import verifyLst from '../common/VerifyLst.vue'
  export default {
    name: 'courseExchangeVerifyLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      ExScroller,
      SiftVerifyLst,
      Group,
      Cell,
      verifyLst
    },
    methods: {
      // 到审批详情
      goAuditDetail (e) {
        console.log(e);
        let sv = 0;
        if (e.info.AuditState === '未激活') {
          sv = 0;
        } else if (e.info.AuditState === '已激活') {
          sv = 1;
        } else if (e.info.AuditState === '已通过') {
          sv = 2;
        } else if (e.info.AuditState === '已退回') {
          sv = 4;
        }
        this.saveCurrPgData(); // 保存当前页面信息
        this.$router.push({path: '/courseExchange/courseExDetail', query: {id: e.info.AppId, states: sv, itemId: e.info.ItemId}});
      },
      // 得到学期信息
      getXqInfo (e) {
        this.selectXQID = e.xqInfo.xqid;
        this.loaded = true;
      },
      // 得到筛选后的值
      getSelectInfo (e) {
        console.log('get', e);
        let condition = [];
        let selectXQID = this.selectXQID;
        let r = e.result;
        if (r.status.type !== -1) {
          condition.push({FieldName: 'Sys_AuditItem.States', Value: r.status.type, NeedQuotes: false});
        }
        if (r.nature !== '全部') {
          condition.push({FieldName: 'Tea_SmstClassChangeApply.DKXZ', Value: r.nature, NeedQuotes: true}); // 调课性质
        }
        if (r.range.title !== '全部') {
          condition.push({FieldName: 'ChangeRange', Value: r.range.value, NeedQuotes: true}); // 调课范围
        }
        // 学期信息
        if (r.xqData && r.xqData.xqid !== 0) {
          selectXQID = r.xqData.xqid;
        }
        // 筛选条件和上一次不一样
        if (selectXQID !== this.selectXQID || JSON.stringify(condition) !== JSON.stringify(this.condition)) {
          this.selectResult_sift = e.result;
          this.selectIdx_sift = e.selectIdx;
          this.condition = [];
          this.selectXQID = selectXQID;
          this.condition = condition;
          this.$refs.scrollerPageIndexOne.initData(); // 重新加载第一页数据
        }
      },
      // 得到审核列表数据
      async getVerifyData (index, size) {
        let json = {semid: this.selectXQID, condition: this.condition, pageIndex: index, pageSize: size};
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'ReadTeaAuditLstForTK',
          objData: JSON.stringify(json)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
          return [];
        }
        d = JSON.parse(d);
        if (!d.success) {
          console.log(`获取数据失败:${d.msg}`);
          return [];
        }
        console.log("verify lst", d.applyList);
        return d.applyList;
      },
      // 保存当前页面信息
      saveCurrPgData () {
        this.QD.parentPageData = {selectXQID: this.selectXQID, condition: this.condition, selectResult_sift: this.selectResult_sift, selectIdx_sift: this.selectIdx_sift};
      },
      // 得到当前页面信息
      getCurrPgData () {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.selectXQID = qd.selectXQID;
          this.condition = qd.condition;
          this.selectResult_sift = qd.selectResult_sift;
          this.selectIdx_sift = qd.selectIdx_sift;
          this.QD.parentPageData = null;
        }
      }
    },
    created () {
      this.getCurrPgData(); // 得到当前页面信息
    },
    data () {
      return {
        loaded: false,
        loading: false,
        condition: [], // 筛选条件
        selectXQID: 0, // 选中的学期id
        verifyLst: [], // 审核列表
        selectResult_sift: null, // 选中的结果-筛选
        selectIdx_sift: null, // 默认选中全部-筛选
        whereVerifyInfo: [] // 审批条件筛选
      }
    }
  }
</script>
<style scoped>
  .gpBox{
    margin-top: -1.25em;
  }
  .dataBox{
    position: relative;
    top: 50px;
  }
  .rightInfo .rp2,
  .rightInfo .rp3{
    font-size: 12px;
    color: #666;
  }
  .rightInfo .rp0{
    position: relative;
    line-height: 24px;
  }
  .rightInfo .rp2{
    overflow: hidden;
    white-space: nowrap;
  }
  .submitTime{
    position: absolute;
    right: 0;
    font-size: 12px;
    color: #666;
  }
  .rp4{
    font-size: 14px;
  }
</style>
