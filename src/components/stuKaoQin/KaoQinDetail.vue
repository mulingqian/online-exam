<template>
  <div class="kaoQinDetail">
    <div class="kaoQinSum">
      <span>迟到<a :class="cdTotalNum > 0 ? 'categoryRed' : 'categoryGreen'">{{cdTotalNum}}</a></span>
      <span>早退<a :class="ztTotalNum > 0 ? 'categoryRed' : 'categoryGreen'">{{ztTotalNum}}</a></span>
      <span>旷课 <a :class="kkTotalNum > 0 ? 'categoryRed' : 'categoryGreen'">{{kkTotalNum}}</a></span>
      <span>事假 <a :class="sjTotalNum > 0 ? 'categoryRed' : 'categoryGreen'">{{sjTotalNum}}</a></span>
      <span>病假 <a :class="bjTotalNum > 0 ? 'categoryRed' : 'categoryGreen'">{{bjTotalNum}}</a></span>
      <!--<span>婚假：{{hjTotalNum}}</span>-->
    </div>
    <group class="kaoQinGroup">
      <cell v-for="(s, sIdx) in stuAttandanceDetail" :key="sIdx">
        <span slot="after-title" class="vux-label">
          <span style="display: block;color: #333333;font-size: 16px;">{{s.KCMC}}</span>
          <span style="font-size: 14px;color: #666666;">{{s.TeachDay}}</span>
          <span v-if="s.CategoryName !== '正常'" style="float: right;color: #ff0000;font-size: 14px;">{{s.CategoryName}}</span>
          <span v-else style="float: right;color: #008000;font-size: 14px;">{{s.CategoryName}}</span>
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'

  export default {
    name: "kaoQinDetail",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group
    },
    methods: {
      // 根据学号、月份、学期id学生查询考勤详细
      async getStuAttandanceDetail () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuAttandanceDetail',
          xh: this.QD.getLocalUserinfo().stuObj.XH,
          month: this.$route.query.m,
          xqid: this.$route.query.xqid
        });
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.stuAttandanceDetail = d;
        for (let i=0; i<d.length; i++) {
          if (d[i].Category === 2){
            this.cdTotalNum++;
          }
          if (d[i].Category === 4){
            this.ztTotalNum++;
          }
          if (d[i].Category === 8){
            this.kkTotalNum++;
          }
          if (d[i].Category === 16){
            this.sjTotalNum++;
          }
          if (d[i].Category === 32){
            this.bjTotalNum++;
          }
         /* if (d[i].Category === 64){
            this.hjTotalNum++;
          }*/
        }
      }
    },
    data () {
      return {
        loading: false,
        stuAttandanceDetail: [], // 考勤详情
        cdTotalNum: 0, // 迟到次数
        ztTotalNum: 0, // 早退次数
        kkTotalNum: 0, // 旷课次数
        sjTotalNum: 0, // 事假次数
        bjTotalNum: 0 // 病假次数
      }
    },
    created () {
      this.getStuAttandanceDetail();
    }
  }
</script>
<style scoped>
  .kaoQinSum{
    font-size: 16px;
    color: #333333;
    padding: 10px 15px;
    border-bottom: 1px solid #e5e5e5;
  }
  .kaoQinSum span{
    margin-left: 4px;
  }
  .kaoQinSum .categoryRed{
    color: #ff0000;
  }
  .kaoQinSum .categoryGreen{
    color: #008000;
  }
</style>
<style>
  .kaoQinDetail .kaoQinGroup .weui-cells{
    margin-top: -1px;
  }
</style>
