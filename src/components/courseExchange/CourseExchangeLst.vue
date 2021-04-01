<template>
  <div class="course-exchange-lst eachPgBase">
    <div class="container eachPgBase">
      <!-- 筛选 start -->
      <!--this.selectResult_sift = qd.selectResult_sift;
          this.selectIdx_sift = qd.selectIdx_sift;-->
      <sift-apply-lst :selectXQID="selectXQID" :selectResult_sift="selectResult_sift" :selectIdx_sift="selectIdx_sift" @get-xqInfo="getXqInfo" @get-selectVal="getSelectInfo"></sift-apply-lst>
      <!-- 筛选 end -->
      <!-- 根据条件查找出的内容 start -->
      <div class="dataBox">
        <ex-scroller v-if="loaded" v-model="applyLst" :pageSize="10" :onGetList="getApplyData" ref="scrollerPageIndexOne" height="-96">
          <div>
            <apply-lst :class="sidx !== 0 ? 'gpBox': ''" v-for="(s, sidx) in applyLst" :key="sidx" :item="s" :isLink="true" :showIconTitle="true"
                       :iconTitleType="false" @click-cell="goDetail">
              <a slot="iconTitle">{{s.XM.substr(s.XM.length-2, 2)}}</a>
              <div slot="right-info" class="rightInfo">
                <p class="rp1">
                  <span>{{s.DKXZ}} {{s.ChangeType}}</span>
                  <span class="submitTime">{{s.SubmitTime}}</span>
                </p>
                <p class="rp2">
                  <span>概要:</span>
                  <span>{{s.Subject}}</span>
                </p>
                <p class="rp3">{{s.XQMC}}</p>
                <p :class="`rp4 ${s.Status === '审核通过' ? 'pass-icon' : (s.Status === '审核中' ? 'verifying-icon' : (s.Status === '被退回' ? 'lost-icon' : 'nosubmit-icon'))}`">
                  {{s.Status}}
                </p>
              </div>
            </apply-lst>
          </div>
        </ex-scroller>



      </div>
      <!-- 根据条件查找出的内容 end -->
      <add-page @click.native="goApplyPg()"></add-page>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import ExScroller from '../common/ExScroller.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import SiftApplyLst from './SiftApplyLst.vue'
  import ApplyLst from '../common/VerifyLst.vue'
  import addPage from '../primaryKey/AddPage.vue'
  export default {
    name: 'courseExchangeLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      ExScroller,
      Group,
      Cell,
      SiftApplyLst,
      ApplyLst,
      addPage
    },
    methods: {
      // 到详情页面 courseExchange/courseExDetail
      goDetail (e) {
        this.saveCurrPgData(); // 保存列表中的数据
        this.$router.push({path: '/courseExchange/courseExDetail', query: {id: e.info.AppId}});
      },
      // 到申请页面
      goApplyPg () {
        this.saveCurrPgData(); // 保存列表中的数据
        this.$router.push({path: '/courseExchange/courseExBaseApply'});
      },
      // 得到筛选后的值
      getSelectInfo (e) {
        console.log('get', e);
        let condition = [];
        let selectXQID = this.selectXQID;
        let r = e.result;
        if (r.status.type !== -1) {
          condition.push({FieldName: 'Tea_SmstClassChangeApply.Status', Value: r.status.type, NeedQuotes: false});
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
      // 得到学期信息
      getXqInfo (e) {
        this.selectXQID = e.xqInfo.xqid;
        this.loaded = true;
      },
      // 读取老师调课申请列表
      async getApplyData (index, size) {
        // NeedQuotes：表示是否需要单引号，可不传该值，默认为true
        let objData = {semid: this.selectXQID, condition: this.condition, pageIndex: index, pageSize: size};
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetScheduleChangeApplyData',
          objData: JSON.stringify(objData)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取申请数据失败:${d.msg}`);
          return;
        }
        d = JSON.parse(d);
        console.log("apply lst", this.applyLst);
        return d.applyList;
      },
      // 保存列表中的数据
      saveCurrPgData () {
        this.QD.parentPageData = {
          condition: this.condition,
          selectXQID: this.selectXQID,
          selectResult_sift: this.selectResult_sift,
          selectIdx_sift: this.selectIdx_sift
        }; // 保存 列表中的数据
      },
      // 得到当前页面数据
      getCurrPgData () {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.condition = qd.condition; // 筛选条件
          this.selectXQID = qd.selectXQID; // 学期ID
          this.selectResult_sift = qd.selectResult_sift;
          this.selectIdx_sift = qd.selectIdx_sift;
          this.QD.parentPageData = null;
        }
      }
    },
    created () {
      this.getCurrPgData(); // 得到当前页面数据
    },
    data () {
      return {
        loaded: false,
        applyLst: [], // 申请列表
        condition: [], // 筛选条件
        selectXQID: 0, // 选中的学期id
        selectResult_sift: null, // 选中的结果-筛选
        selectIdx_sift: null // 默认选中全部-筛选
      }
    }
  }
</script>
<style scoped>
  .dataBox{
    position: relative;
    top: 50px;
  }
  .rightInfo .rp2,
  .rightInfo .rp3{
    font-size: 12px;
    color: #666;
  }
  .rightInfo .rp1{
    position: relative;
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
  .gpBox{
    margin-top: -1.25em;
  }
</style>
