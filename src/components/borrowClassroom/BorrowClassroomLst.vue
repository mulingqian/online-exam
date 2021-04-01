<template>
  <div class="borrow-classroom-lst">
    <div class="all_field">
      <select-status :valueLst="QD.applyStatusLst" :defaultStatus="defaultApplyStatus" :title="'审批状态'" @get-val="selectApplyStatusVal"></select-status>
      <ex-scroller ref="scrollApplyPage" v-model="applyLst" :onGetList="getBorrowRoomData" height="-90">
        <div>
          <group class="gp" v-for="(s, sidx) in applyLst" :key="sidx" @click.native="goDetail(s)">
            <cell :is-link="true">
              <div class="cell-title" slot="after-title">
                <p>
                  <span class="key-value">借用日期: </span>
                  <span class="detail-value">{{s.StartDay}} 至 {{s.EndDay}}</span>
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
              <span><a :class="`status-value ${s.Status === 1 ? 'verifying-icon' : (s.Status === 2 ? 'pass-icon' :  (s.Status === 4 ? 'lost-icon' : 'nosubmit-icon'))}`">{{s.StatusName}}</a></span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--教室借用申请-->
    <add-page @click.native="goApplyBorrowRoom"></add-page>
  </div>
</template>
<script>
  import ExScroller from '../common/ExScroller.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import SelectStatus from '../common/SelectActionsheelVal.vue'
  import addPage from '../primaryKey/AddPage.vue'
  export default {
    name: 'borrowClassroomLst',
    directives: {},
    components: {
      ExScroller,
      Cell,
      Group,
      SelectStatus,
      addPage
    },
    methods: {
      // 申请教室借用
      goApplyBorrowRoom () {
        this.savePgData(); // 保存当前页面信息
        this.$router.push({path: '/borrowClassroom/borrowRoomApply'});
      },
      // 到详情页面
      goDetail (s) {
        this.savePgData(); // 保存当前页面信息
        this.$router.push({path: '/borrowClassroom/borrowRoomDetail', query: {id: s.BorrowId, auditId: 0}});
      },
      // 教室借用申请的状态值 change
      selectApplyStatusVal (e) {
        console.log(e);
        this.defaultApplyStatus = e.info;
        this.setApplyWhereInfo(this.defaultApplyStatus.type);
        this.$refs.scrollApplyPage.initData(); // 重新加载第一页数据
      },
      // 设置教室申请时的查询条件
      setApplyWhereInfo (type) {
        if (type === -1) {
          this.whereApplyInfo = [];
        } else {
          this.whereApplyInfo = [{FieldName: 'Status', Operator: 'Equal', NeedQuotes: false, Value: type}];
        }
      },
      // 得到教室借用申请的信息
      async getBorrowRoomData (index, size) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'RoomBorrowApplyLst',
          PageIndex: index,
          PageSize: size,
          Search: JSON.stringify(this.whereApplyInfo)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`${d.msg}`);
          return;
        }
        console.log('RoomInfo', d.data);
        return d.data;
      },
      // 保存当前页面信息
      savePgData () {
        this.QD.parentPageData = {
          defaultApplyStatus: this.defaultApplyStatus,
          whereApplyInfo: this.whereApplyInfo
        };
      },
      // 得到当前页面信息
      getPgData () {
        if (this.QD.parentPageData) {
          this.defaultApplyStatus = this.QD.parentPageData.defaultApplyStatus;
          this.whereApplyInfo = this.QD.parentPageData.whereApplyInfo;
          this.QD.parentPageData = null;
        }
      }
    },
    created () {
      this.getPgData(); // 得到当前页面信息
    },
    data () {
      return {
        applyLst: [], // 教室借用申请记录
        defaultApplyStatus: {
          label: '全部',
          type: -1
        }, // 申请默认选中的状态值
        whereApplyInfo: [] // 申请的查询条件
      }
    }
  }
</script>
<style scoped>
  .borrow-classroom-lst,
  .all_field{
    background-color: #f2f2f2;
  }
  .all_field .gp{
    margin-top: -10px;
  }
  .cell-title>p{
    line-height: 18px;
    overflow: hidden;
  }
  .key-value{
    float: left;
    width: 80px;
    color: #333;
    font-size: 14px;
  }
  .detail-value{
    float: left;
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
