<template>
  <div class="awardXFLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-show="(!loading && (studentAwardCredit.length === 0))">
      <divider style="padding-top:50px;">暂无数据</divider>
    </div>
    <div class="awardXFGP" v-if="studentAwardCredit.length !== 0">
      <group v-for="(s, sidx) in studentAwardCredit" :key="sidx">
        <cell>
          <span slot="after-title">
            <span style="color: #333333;">
              <span class="school-wx-icon iconTitle">&#xe66d;</span>
              <span>奖励名称：{{s.JLMC}}</span>
              <br />
              <span style="color: #428bca;">
                <span class="school-wx-icon iconTitle">&#xe63d;</span>
                学分：{{s.Credit}}</span>
            </span>
          </span>
          <span slot="inline-desc">
            <span class="school-wx-icon iconTitle">&#xe63c;</span>
            <span>颁奖日期：{{s.BZRQ}}</span>
            <br />
            <span class="school-wx-icon iconTitle">&#xe63e;</span>
            <span>学期名称：{{s.XQMC}}</span>
          </span>
        </cell>
      </group>
    </div>
  </div>
</template>
<script>
  import Loading from 'vux/src/components/loading/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  export default {
    name: 'awardXF-awardXFLst',
    directives: {
      TransferDom
    },
    components: {
      Group,
      Cell,
      Loading,
      Divider
    },
    methods: {
        //  奖励学分列表
      async getStudentAwardCredit () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStudentAwardCredit', xh: this.QD.getLocalUserinfo().stuObj.XH});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        this.studentAwardCredit = d;
      }
    },
    created () {
      //  奖励学分列表
      this.getStudentAwardCredit();
    },
    data () {
      return {
        loading: false,
        studentAwardCredit: [] //  奖励学分列表
      }
    }
  }
</script>
<style scoped>
  .awardXFGP,
  .awardXFLst{
    background-color: #f2f2f2;
  }
  .iconTitle{
    color: #7c8c27;
    padding-right: 0;
  }
</style>
<style>
  .awardXFLst .awardXFGP .weui-cells{
    margin-top: 0;
    margin-bottom: 10px;
  }
</style>
