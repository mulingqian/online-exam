<template>
  <group class="gp-result" title="审批记录">
    <cell v-for="(r, rIdx) in auditResults" :key="rIdx">
      <div slot="after-title" class="after-title-result">
        <span class="gpleft">
          <label class="left-name">
            <a class="xm">{{r.Auditor.substr(r.Auditor.length-2, 2)}}</a>
          </label>
        </span>
        <div class="gpright">
          <label class="approvalTime">{{r.AuditTime}}</label>
          <a>{{r.Auditor}}</a>
          <a v-if="r.IsApprove" class="verifyPass">同意</a>
          <a v-if="!r.IsApprove" class="rejectState">拒绝</a>
          <p>{{r.Comment}}</p>
        </div>
      </div>
    </cell>
  </group>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'commonAuditLst',
    components: {
      Cell,
      Group
    },
    props: {
      auditResults: { // 审核结果的数据
        type: Array,
        default: []
      }
    },
    methods: {
      // 点击第一个按钮
      clickOne () {
        this.$emit('get-oneVal');
      },
      // 点击第二个按你
      clickTwo () {
        this.$emit('get-twoVal');
      }
    }
  }
</script>
<style scoped>
  .after-title-result{
    overflow: hidden;
  }
  .gpleft{
    float: left;
    display: inline-block;
    padding-right: 4px;
    overflow: hidden;
  }
  .left-name{
    display: block;
    width: 30px;
    height: 30px;
    margin-right: 10px;
    font-size: 12px;
    text-align: center;
    line-height: 30px;
    color: #fff;
  }
  .xm{
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    color: #fff;
    letter-spacing: .1em;
    background-color: #09bb07;
  }
  .stepName{
    position: relative;
    font-size: 8px;
    color: #09bb07;
    top: -6px;
  }
  .gpright{
    float: left;
    width: 83%;
    display: inline-block;
  }
  .gpright > a{
    font-size: 14px;
  }
  .gpright>p{
    font-size: 12px;
    color: #666666;
  }
  .approvalTime{
    float: right;
    font-size: 12px;
    color: #666666;
  }
  .verifyPass{
    color: #7ed499;
  }
  .noVerify{
    color: #666666;
  }
  .rejectState{
    color: #bd2c00;
  }
</style>
