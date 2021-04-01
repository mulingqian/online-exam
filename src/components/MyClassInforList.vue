<template>
  <div class="myClassInforLst">
    <group>
      <cell :title="cl.BJMC" v-for="(cl,cidx) in classList" :key="cidx" :link="{path: '/myClassMembers', query: {bjid: cl.BJID}}"></cell><!--:link="{path: '', query: {}}"-->
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: "myClassInforList",
    components: {
      Cell,
      Group
    },
    methods: {
      // 获取班级信息
      async getClassLst () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassInforLst', id: this.QD.getLocalUserinfo().stuObj.ZGH});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.classList = d;
      }
    },
    created () {
      this.getClassLst();
    },
    data () {
      return {
        classList: [] // 班级信息
      }
    }
  }
</script>
<style>
  .myClassInforLst .weui-cells{
    margin-top:0;
  }
  .myClassInforLst .weui-cells .weui-cell .vux-cell-bd .vux-label{
    font-size: 16px;
    color: #333333;
  }
</style>
