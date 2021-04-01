<template>
  <div class="classLeaMsgClaLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <cell :title="cl.BJMC" v-for="(cl,cidx) in classList" :key="cidx" :link="{path: '/classInformation/classInformationLst', query: {bjid: cl.BJID}}"></cell><!--:link="{path: '', query: {}}"-->
    </group>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'classInforClassLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group
    },
    methods: {
      // 获取班级信息
      async getClassLst () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassInforLst', id: this.QD.getLocalUserinfo().stuObj.ZGH});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        this.classList = d;
      }
    },
    created () {
      this.getClassLst();
    },
    data () {
      return {
        loading: false,
        classList: [] // 班级信息
      }
    }
  }
</script>
<style>
  .classLeaMsgClaLst .weui-cells{
    margin-top:0;
  }
  .classLeaMsgClaLst .weui-cells .weui-cell .vux-cell-bd .vux-label{
    font-size: 16px;
    color: #333333;
  }
</style>
