<template>
  <div class="borrow-classroom-lst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="all_field">
      <select-status :valueLst="QD.auditStateData" :defaultStatus="defaultVerifyStatus" :title="'审批状态'" @get-val="selectApplyStatusVal"></select-status>
      <ex-scroller ref="scrollVerifyPage" v-model="applyLst" :onGetList="getBorrowRoomData" height="-90">
        <div>
          <apply-verify-lst :class="sidx !== 0 ? 'gpBox': ''" v-for="(s, sidx) in applyLst" :key="sidx" :item="s" :isLink="true" :showIconTitle="true"
                            :iconTitleType="false" :showVerifyButton="s.AuditState === '1'"
                            @click-cell="goAuditDetail" @get-ButtonVal="doAudit">
            <a slot="iconTitle">{{s.XM.substr(s.XM.length-2, 2)}}</a>
            <div slot="right-info">
              <p>
                <span class="key-value">借用开始日期: </span>
                <span class="detail-value">{{s.StartDay}}</span>
              </p>
              <p>
                <span class="key-value">借用结束日期: </span>
                <span class="detail-value">{{s.EndDay}}</span>
              </p>
              <p>
                <span class="key-value">借用节次: </span>
                <span class="detail-value">{{s.UseNodes}}</span>
              </p>
              <p v-if="s.Rooms">
                <span class="key-value">借用的教室: </span>
                <span class="detail-value">{{s.Rooms}}</span>
              </p>
              <p class="apply-date">{{s.ApplyDay}}</p>
            </div>
            <span slot="keep-right" v-if="s.AuditState !== '1'">
              <a :class="`status-value ${s.AuditState === '2' ? 'pass-icon' :  (s.AuditState === '4' ? 'lost-icon' : 'nosubmit-icon')}`">{{s.AuditStateName}}</a>
            </span>
          </apply-verify-lst>
        </div>
      </ex-scroller>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import ExScroller from '../common/ExScroller.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import SelectStatus from '../common/SelectActionsheelVal.vue'
  import ApplyVerifyLst from '../common/VerifyLst.vue'
  export default {
    name: 'borrowClassroom-roomVerifyLst',
    directives: {
      TransferDom
    },
    components: {
      ExScroller,
      Loading,
      Cell,
      Group,
      SelectStatus,
      ApplyVerifyLst
    },
    methods: {
      // 审批详情
      goAuditDetail (e) {
        this.savePgData();
        this.$router.push({path: '/borrowClassroom/borrowRoomDetail', query: {id: e.info.BorrowId, auditId: e.info.AuditId}});
      },
      // 做审批
      doAudit (e) {
        console.log(e);
        this.auditWay(e.type.type, e.info);
        /* 审批拒绝 e.type.type === 4 ; 审批同意 e.type.type === 2*/
      },
      // 审批方法 targetId:教室借用申请Id，auditId:审批Id,passed:true(通过)/false(拒绝)，comment:审批意见
      auditWay (type, info) {
        let that = this;
        let typeVal = '拒绝';
        let pV = false; // passed:true(通过)/false(拒绝)
        if (type === 2) {
          pV = true;
          typeVal = '同意';
        }
        this.QD.confirm("提示: 请输入" +typeVal+ "说明", "", async function (m) {
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'DoAuditRoomBorrowApply',
            targetId: info.BorrowId,
            auditId: info.AuditId,
            passed: pV,
            comment: m
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            that.QD.alert(`审批失败`);
            return;
          }
          that.$refs.scrollVerifyPage.initData(); // 重新加载第一页数据-申请
        }, null, {showInput: true, inputVal: "", required: true});
      },
      // 教室借用申请的状态值 change
      selectApplyStatusVal (e) {
        console.log(e);
        this.defaultVerifyStatus = e.info;
        this.setApplyWhereInfo(this.defaultVerifyStatus.type);
        this.$refs.scrollVerifyPage.initData(); // 重新加载第一页数据
      },
      // 设置教室申请时的查询条件
      setApplyWhereInfo (type) {
        if (type === -1) {
          this.whereVerifyInfo = [];
        } else {
          this.whereVerifyInfo = [{FieldName: 'AuditState', Operator: 'Equal', NeedQuotes: false, Value: type}];
        }
      },
      // 得到教室借用申请的信息
      async getBorrowRoomData (index, size) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'AuditRoomBorrowApplyData',
          PageIndex: index,
          PageSize: size,
          Search: JSON.stringify(this.whereVerifyInfo)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`${d.msg}`);
          return;
        }
        console.log('RoomInfo', d.data);
        return d.data;
      },
      // 保存本页面的数据
      savePgData () {
        this.QD.parentPageData = {
          defaultVerifyStatus: this.defaultVerifyStatus,
          whereVerifyInfo: this.whereVerifyInfo
        };
      },
      // 得到本页面数据
      getPgData () {
        if (this.QD.parentPageData) {
          this.defaultVerifyStatus = this.QD.parentPageData.defaultVerifyStatus;
          this.whereVerifyInfo = this.QD.parentPageData.whereVerifyInfo;
          this.QD.parentPageData = null;
        }
      }
    },
    created () {
      this.getPgData(); // 得到本页面数据
    },
    data () {
      return {
        loading: false,
        applyLst: [], // 教室借用申请记录
        defaultVerifyStatus: {
          label: '全部',
          type: -1
        }, // 申请默认选中的状态值
        whereVerifyInfo: [] // 申请的查询条件
      }
    }
  }
</script>
<style scoped>
  .borrow-classroom-lst,
  .all_field{
    background-color: #f2f2f2;
  }
  .all_field .gpBox{
    margin-top: -10px;
  }
  .cell-title>p{
    line-height: 18px;
    overflow: hidden;
  }
  .key-value{
    width: 80px;
    color: #333;
    font-size: 14px;
  }
  .detail-value{
    width: 65%;
    color: #666;
    font-size: 14px;
  }
  .apply-date{
    font-size: 12px;
    color: #999;
  }
  .status-value{
    font-size: 12px;
  }
</style>
