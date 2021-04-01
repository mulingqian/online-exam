<template>
  <div class="teaThesisManage">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="teaThesisGroup">
      <cell>
        <span slot="after-title" class="vux-label">
          <span style="position: absolute;display: block;width: 100%;">
            <span class="school-wx-icon" slot="icon" style="color: #D2CEC8;float: right;font-size: 60px;padding-right: 30px;margin-top: -10px;">&#xe617;</span>
          </span>
          <div class="firstLine-thesis">
            <span>专业论文</span>
            <a class="firsta1">获奖</a>
          </div>
          <div class="secondLIne-thesis">
            <span>论文编号：111</span>
            <span style="margin-left: 10px;">教研组：基础教研室</span>
          </div>
          <span class="thirdLine-thesis">姓名/职工号：蔡思顺/jxzxjs190</span>
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
    name: "teaThesisManage",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group
    },
    methods: {},
    data () {
      return {
        loading: false
      }
    }
  }
</script>
<style scoped>
  .teaThesisManage{
    background: #f2f2f2;
  }
  .teaThesisManage .teaThesisGroup{
    position: relative;
  }
  .teaThesisManage .firstLine-thesis{
    padding-top: 4px;
    padding-bottom: 12px;
    font-size: 16px;
  }
  .teaThesisManage .firstLine-thesis span{
    margin-right: 15px;
  }
  .teaThesisManage .firstLine-thesis a{
    padding: 1px 8px;
    font-size: 12px;
    color: #fff;
    border-radius: 4px;
  }
  .teaThesisManage .firstLine-thesis .firsta1{
    display: inline-block;
    background-color: #ff721a;
  }
  .teaThesisManage .secondLIne-thesis,
  .teaThesisManage .thirdLine-thesis{
    display: block;
    font-size: 14px;
    color: #999999;
  }
</style>
<style>
  .teaThesisManage .teaThesisGroup .weui-cells{
    margin-top: 0;
  }
</style>
