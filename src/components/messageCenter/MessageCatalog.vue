<template>
  <div class="messageCatalog">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <scroller lock-x :scrollbar-y="true" height="-50">
      <div>
        <group v-for="(msg, mIdx) in msgDataLst" :key="mIdx">
          <cell :link="{path: '/messageCenter/msgCatalogDetail', query: {id: msg.MsgId}}">
            <span class="school-wx-icon msgIcon" slot="icon">&#xe6cf;</span>
            <span slot="after-title" class="vux-label">
              <div class="first-line">{{msg.MsgType}}
                <a class="msgUrgent">{{msg.Urgent}}</a>
                <a v-if="msg.Confirmed === false" class="msgConfirm">未读</a>
                <span class="msgCreateTime">{{msg.CreateTime}}</span>
              </div>
              <div class="second-line">{{msg.Subject}}</div>
            </span>
          </cell>
        </group>
      </div>
    </scroller>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Scroller from 'vux/src/components/scroller/index.vue'

  export default {
    name: 'messageCatalog',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Scroller,
      Group,
      Cell
    },
    methods: {
        /*获取我的消息内容*/
      async getMsgDataLst () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetPersonalMessageDataList'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        this.msgDataLst = d;
      }
    },
    created () {
      this.getMsgDataLst();
    },
    data () {
      return {
        loading: false,
        msgDataLst: [] // 消息内容
      }
    }
  }
</script>
<style scoped>
  .messageCatalog{
    background-color: #f2f2f2;
  }
  .messageCatalog .msgIcon{
    position: relative;
    top: -12px;
    padding-right: 2px;
    color:#f0ad4e;
    font-size: 32px;
  }
  .messageCatalog .first-line{
    overflow: hidden;
    line-height: 20px;
  }
  .messageCatalog .first-line .msgUrgent{
    display: inline-block;
    background-color: #06a659;
    padding: 0 4px;
    font-size: 10px;
    color: #fff;
    border-radius: 4px;
  }
  .messageCatalog .first-line .msgConfirm{
    display: inline-block;
    background-color: #0f89e0;
    padding: 0 4px;
    font-size: 10px;
    color: #fff;
    border-radius: 4px;
  }
  .messageCatalog .msgCreateTime{
    float: right;
    font-size: 10px;
    color: #999999;
  }
  .messageCatalog .second-line{
    height: 42px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    color: #666666;
  }
</style>
<style>
  .messageCatalog .weui-cell{
    padding: 10px 4px;
  }
</style>
