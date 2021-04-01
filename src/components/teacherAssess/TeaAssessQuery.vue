<template>
  <div class="teaAssessQuery">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="assessQueryLst" :title="xqDate">
      <cell>
        <span slot="after-title" class="vux-label">
          <div class="firstLine-assessQuery">
            <span>2017学年第一学期测评</span>
          </div>
          <span class="secondLIne-assessQuery">总分：100</span>
          <span class="thirdLine-assessQuery">附加分：30</span>
          <span class="forthLine-assessQuery">名次：1</span>
        </span>
      </cell>
    </group>
    <group class="assessQueryLst" :title="xqDate">
      <cell>
        <span slot="after-title" class="vux-label">
          <div class="firstLine-assessQuery">
            <span>2016学年第二学期测评</span>
          </div>
          <span class="secondLIne-assessQuery">总分：100</span>
          <span class="thirdLine-assessQuery">附加分：30</span>
          <span class="forthLine-assessQuery">名次：1</span>
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
    name: "teaAssessQuery",
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
        loading: false,
        xqDate: '2017学年第一学期'
      }
    }
  }
</script>
<style scoped>
  .teaAssessQuery{
    background: #f2f2f2;
  }
  .teaAssessQuery .assessQueryLst{
    position: relative;
  }
  .teaAssessQuery .firstLine-assessQuery{
    padding-top: 4px;
    padding-bottom: 12px;
    font-size: 16px;
  }
  .teaAssessQuery .firstLine-assessQuery span{
    margin-right: 15px;
  }
  .teaAssessQuery .secondLIne-assessQuery,
  .teaAssessQuery .thirdLine-assessQuery,
  .teaAssessQuery .forthLine-assessQuery{
    display: block;
    font-size: 14px;
    color: #999999;
  }
</style>
<style>
  .teaAssessQuery .weui-cells__title{
    margin-top:0;
    padding-left: 4px;
    padding-top: 12px;
    padding-bottom: 8px;
    color: #999999;
    font-size: 12px;
  }
</style>
