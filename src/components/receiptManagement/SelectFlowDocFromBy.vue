<template>
  <div class="selectFlowDocFromBy">
    <group class="gp">
      <cell v-for="(flowCompany,fIdx) in flowDocCompany" :key="fIdx" @click.native="goFlowDocApply(flowCompany)" :is-link="true">
        <span slot="after-title" class="vux-label">{{flowCompany}}</span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'selectFlowDocFromBy',
    components: {
      Cell,
      Group
    },
    methods: {
        // 获取收文单位列表
      async getFlowDocCompany() {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetFlowDocCompany'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.flowDocCompany = d;
        console.log(this.flowDocCompany);
      },
      // 选中来文单位事件
      goFlowDocApply (flowCompany) {
        // 存公文流转申请的来文单位
        sessionStorage.setItem("flowDocUnit", flowCompany);
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 得到之前选中的来文单位
      getCurPageData () {
        if (sessionStorage.getItem("flowDocUnit") !== null) {
          sessionStorage.removeItem("flowDocUnit");
        }
      }
    },
    created () {
      this.getCurPageData();
      this.getFlowDocCompany();
    },
    data () {
      return {
        backLoaded: true,
        flowDocCompany: [] // 收文单位列表
      }
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -20px;
  }
</style>
<style>
  .selectFlowDocFromBy .weui-cells .vux-label{
    color: #333333;
  }
</style>
