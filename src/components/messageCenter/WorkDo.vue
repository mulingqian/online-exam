<template>
  <div class="workDo">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group v-if="doingsDetail.length !== 0">
      <cell>
        <span slot="after-title" class="vux-label">
          {{doingsDetail.Subject}}
        </span>
      </cell>
      <cell title="工号">
        <span>{{doingsDetail.ZGH}}</span>
      </cell>
      <cell>
        <span slot="after-title" class="vux-label">
          <span v-html="content" class="workContent"></span>
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
    name: 'workDo',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group
    },
    methods: {
      // 获取任务详细
      async getOFDoingsDetail () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetOFDoingsDetail', DBID: this.$route.query.id});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        // this.loading = false;
        this.content = d.Content;
        this.doingsDetail = d;
      }
    },
    created () {
      this.getOFDoingsDetail();
    },
    data () {
      return {
        loading: false,
        doingsDetail: [], // 任务详情
        content: '' // 任务内容
      }
    }
  }
</script>
<style scoped>

</style>
<style>
  .workDo .weui-cells{
    margin-top:0;
  }
  .workDo .workContent table{
    width:100% !important;
  }
  .workDo .workContent table .tblCell{
    font-size: 14px !important;
  }
</style>
