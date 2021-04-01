<template>
  <div class="scoreTeaLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <smst @on-load="onLoad" @on-hide="onHide" :showName="true" ></smst>
    <div v-show="(!loading && (lst.length === 0))">
      <divider style="margin-top:50px;">暂无数据</divider>
    </div>
    <group>
      <cell v-for="(x, index) in lst" @click.native="goScoreTeaDetail(x.ReportId)" :key="index" :is-link="true">
        <span slot="after-title" class="vux-label">
          {{x.RptName}}
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  // import {Cell, Group, XProgress, Loading, Divider, TransferDom} from 'vux'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XProgress from 'vux/src/components/x-progress/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Smst from './Smst.vue'

  export default {
    name: "scoreTeaLst",
    directives: {
      TransferDom
    },
    components: {
      Cell,
      Group,
      Smst,
      Loading,
      XProgress,
      Divider
    },
    methods: {
      onLoad (e) {
        console.log("smst on load");
        e && e.XQID && this.getList(e.XQID);
        this.currentXQData = e;
      },
      onHide (t, e) {
        console.log("smst on hide");
        console.log(e);
        if (t === true && e && e.XQID) {
          this.getList(e.XQID);
          this.currentXQData = e;
        }
      },
      // 根据学期id号获取 成绩单
      async getList (xqid) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'TeaScoreReportData', zgh: this.QD.getLocalUserinfo().stuObj.ZGH, semId: xqid});
        this.loading = false;
        console.log(d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.lst = d;
      },
      // 到成绩单详情页面
      goScoreTeaDetail (id) {
        let arr = JSON.stringify(this.currentXQData);
        sessionStorage.setItem("scoreTeaXqData", arr);
        this.$router.push({path: '/scoreTeaDetail', query: {reportId: id}});
      }
    },
    created () {
    },
    data () {
      return {
        loading: false,
        lst: [], // 存放成绩单信息，以便获取成绩单名称RptName 和成绩单id ReportId
        currentXQData: [] // 开始加载时的学期数据
      }
    },
    computed: {
    }
  }
</script>
<style scoped>
  .scoreTeaLst .vux-label {
    color: #333333;
    font-size: 15px;
  }
</style>
<style>
</style>
