<template>
  <div class="msgCatalogDetail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <cell>
        <span slot="after-title" class="vux-label">{{msgDetail.Subject}}</span>
      </cell>
      <cell title="消息来源">
        <span>{{msgDetail.MsgFrom}}</span>
      </cell>
      <cell title="消息时间">
        <span>{{msgDetail.CreateTime}}</span>
      </cell>
      <cell title="消息类别">
        <span>{{msgDetail.MsgType}}</span>
      </cell>
      <cell title="消息状态">
        <span v-if="msgDetail.Confirmed === true">已读</span>
        <span v-else>未读</span>
      </cell>
      <cell title="紧急度">
        <span>{{msgDetail.Urgent}}</span>
      </cell>
      <cell title="重要性">
        <span>{{msgDetail.Importance}}</span>
      </cell>
      <cell title="起始日期">
        <span>{{msgDetail.DateFrom}}</span>
      </cell>
      <cell title="结束日期">
        <span>{{msgDetail.Deadline}}</span>
      </cell>
      <cell title="消息内容">
        <span slot="after-title" style="font-size: 14px;color: #999999;" v-html="msgDetail.MsgText"></span>
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
    name: 'msgCatalogDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell
    },
    methods: {
      /*获取我的消息内容*/
      async getPersonalMessageDetail () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetPersonalMessageDetail', msgId: this.$route.query.id});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        this.msgDetail = d;
      }
    },
    created () {
      this.getPersonalMessageDetail();
    },
    data () {
      return {
        loading: false,
        msgDetail: [] // 消息详情
      }
    }
  }
</script>
<style scoped>
  .msgCatalogDetail{
    background-color: #f2f2f2;
  }
</style>
<style>
  .msgCatalogDetail .weui-cells{
    margin-top:0;
  }
  .msgCatalogDetail .weui-cells .vux-cell-primary .vux-label{
    color: #333333;
  }
</style>
