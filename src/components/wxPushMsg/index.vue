<template>
  <div class="wx-push-msg fwrapper" v-if="msgInfo">
    <div class="container">
      <div class="msg-type">{{msgInfo.MsgType}}</div>
      <template v-for="item in msgInfo.MsgDetail">
        <div v-if="item.key" class="each-box">
          <div class="block">
            <div class="title">{{item.key}}:</div>
            <div class="text">{{item.value}}</div>
          </div>
        </div>
      </template>
    </div>
    <div class="btn-box">
      <div class="btn" @click="doConfirmEvent"><span class="text">确认并前往处理</span></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'wxPushMsg',
    components: {},
    data() {
      return {
        msgInfo: null // 详细内容
      }
    },
    created() {
      this.getMsgData(); // 得到微信推送消息模板中的详细信息
    },
    methods: {
      async getMsgData() {
        console.log("guid", this.QD.wxPushMsgGuid);
        if (this.QD.wxPushMsgGuid !== 0) { // guid 存在 和 推送消息的详情地址存在时的情况
          let d = await this.QD.getData('/WXMsg/WXMsg/GetMsgData', {guid: this.QD.wxPushMsgGuid});
          console.log("get msg data = ", d);
          if (d.status && d.status === "error") {
            console.log("报错", d.msg);
          } else {
            this.msgInfo = d.data;
            this.msgInfo.MsgDetail = JSON.parse(this.msgInfo.Data)
          }
        } else {
          window.close()
        }
      },
      // 做确认
      async doConfirmEvent() {
        if (this.msgInfo.IsConfirm === '0') { // 没有确认
          let obj = {
            Sender: this.msgInfo.Sender,
            SendTime: this.msgInfo.SendTime,
            Receiver: this.msgInfo.Receiver,
            MsgType: this.msgInfo.MsgType,
            Content: this.msgInfo.Data,
            GUID: this.QD.wxPushMsgGuid
          };
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'SaveWXMsgConfirm', objData: JSON.stringify(obj)});
          console.log("save wx msg confirm  ", d);
          if (d.status && d.status === "error") {
            console.log("报错", d.msg);
          } else {
            this.goRelativePg()
          }
        } else {
          this.goRelativePg()
        }
      },
      // 做页面跳转
      goRelativePg() {
        this.$router.replace(this.msgInfo.Url)
      }
    }
  }
</script>
<style scoped lang="less">
  .container{
    padding-bottom: 87px;
  }
  .msg-type{
    font-size: 14px;
    color: #999999;
    padding: 24px 15px 14px 15px;
  }
  .each-box{
    position: relative;
    padding: 10px 15px;
    line-height: normal;
    .block{
      display: flex;
    }
    .title{
      display: block;
      min-width: 50px;
      color: #1a1a1a;
      font-size: 14px;
    }
    .text{
      font-size: 14px;
      color: #666666;
    }
  }
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 20px 0 32px 0;
    text-align: center;
    .btn{
      position: relative;
      left: 26%;
      width: 48%;
      padding: 8px 4px;
      border-radius: 4px;
      background-color: @tea-theme-color;
    }
    .text{
      color: #ffffff;
      font-size: 14px;
      line-height: normal;
      letter-spacing: 0.2px;
      text-align: center;
    }
  }
</style>
