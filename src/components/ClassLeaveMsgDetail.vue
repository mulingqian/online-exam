<template>
  <div class="classLeaveMsgDetail">
    <div style="background-color: #f2f2f2;">
      <div class="leaveMsgScroller">
        <div class="classLeaCon">
          <div class="leaMsg">
        <span class="leaName">
          <span class="school-wx-icon stu-icon" slot="icon" style="position: relative;color:#f0ad4e;font-size: 30px;padding-right: 0;">&#xe612;
            <span style="font-size: 14px;">{{leaveMsgDetail.XM}}</span>
          </span>
        </span>
            <span class="leaTitle">{{leaveMsgDetail.Title}}</span>
            <span class="leaContent">{{leaveMsgDetail.Content}}</span>
            <span class="leaTime">{{leaveMsgDetail.CreateTime}}</span>
          </div>
          <div class="leaReplay">
            <span class="replayCount"><label for="classLeaveMsgAddReplayInput">回复</label></span>
            <span class="school-wx-icon leaMsg-icon" slot="icon" style="color:#999999;"><label for="classLeaveMsgAddReplayInput">&#xe603;</label></span>
          </div>
        </div>
        <div class="classLeaRep">
          <div class="leaveMsgReplayDe" v-for="(lmr, ridx) in leaveMsgReplay" :key="ridx">
            <span class="replyName">
              <span class="school-wx-icon rep-icon" slot="icon" style="color:#f0ad4e;">&#xe612;</span>
              <span class="replayXm">{{lmr.XM}}</span>
            </span>
            <span class="replyTime">{{lmr.ReplyTime}}</span>
            <span class="rwContent">{{lmr.ReplyContent}}</span>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div class="addReplay">
        <input v-model="replayMsg" type="text" id="classLeaveMsgAddReplayInput"/>
        <a @click="InsertClassLeaveMsgRep">发送</a>
      </div>
    </footer>
  </div>
</template>
<script>
  import Scroller from 'vux/src/components/scroller/index.vue'
  export default {
    name: "classLeaveMsgDetail",
    components: {
      Scroller
    },
    methods: {
        // 添加回复MsgId(回复的消息ID)、ReplyContent(回复的内容)、Type(类型：1-教职工，4-学生
      async InsertClassLeaveMsgRep () {
        let zghOrXhType;
        if (this.QD.getLocalUserinfo().stuObj.XH !== undefined) {
          zghOrXhType = 4;
        } else {
          zghOrXhType = 1;
        }
        if (this.replayMsg !== ''){
          let d = await this.QD.getData('/ComApi/PostObject', {
            apiName: 'InsertClassLeaveMsgRep',
            MsgId: this.$route.query.id,
            ReplyContent: this.replayMsg,
            Type: zghOrXhType
          });
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
          }
          if (d === 0){
            this.QD.alert('', `请重新回复`);
          } else {
            this.getClassLeaveMsgDetail(); // d>0 添加回复成功 重新获取留言信息
            this.replayMsg = ''; // 把之前的回复留言内容清空
          }
        } else {
          this.QD.alert('', `请输入信息`);
        }
      },
      // 根据留言id 查询留言详细
      async getClassLeaveMsgDetail () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassLeaveMsgDetail', msgId: this.$route.query.id});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.leaveMsgDetail = d;
        this.leaveMsgReplay = d.DetailList;
      }
    },
    created () {
      this.getClassLeaveMsgDetail();
    },
    data () {
      return {
        leaveMsgDetail: [], // 留言详情
        leaveMsgReplay: [], // 回复留言详情
        replayMsg: '' // 回复留言的信息
      }
    }
  }
</script>
<style scoped>
  .classLeaveMsgDetail{
    background-color: #f2f2f2;
  }
  .classLeaveMsgDetail .leaveMsgScroller{
    width: 96%;
    margin-left: 2%;
    padding-bottom: 100px;
  }
  .classLeaveMsgDetail .classLeaCon{
    width:100%;
    /*margin-bottom: 10px;
    margin-top: 10px;*/
  }
  .classLeaveMsgDetail .classLeaCon .leaMsg{
    color: #333333;
    background-color: #ffffff;
  }
  .classLeaveMsgDetail .classLeaCon .leaMsg span{
    display: block;
  }
  .classLeaveMsgDetail .classLeaCon .leaMsg .leaName{
    margin-bottom: 20px;
    text-align: center;
    font-size: 14px;
  }
  .classLeaveMsgDetail .classLeaCon .leaMsg .leaTitle{
    text-align: center;
    margin-bottom: 10px;
    font-size: 16px;
  }
  .classLeaveMsgDetail .classLeaCon .leaMsg .leaContent{
    margin-bottom: 40px;
    padding-left: 20px;
    font-size: 14px;
  }
  .classLeaveMsgDetail .classLeaCon .leaMsg .leaTime{
    font-size: 12px;
    color: #999999;
    padding-bottom: 10px;
  }
  .classLeaveMsgDetail .leaReplay{
    width:100%;
    height: 40px;
    font-size: 12px;
    color: #999999;
    border-top:1px solid #e5e5e5;
    border-bottom:1px solid #e5e5e5;
    background-color: #ffffff;
  }
  .classLeaveMsgDetail .leaMsg-icon{
    float: right;
    display: inline-block;
    margin-top: 10px;
  }
  .classLeaveMsgDetail .replayCount{
    display: inline-block;
    margin-left: 10px;
    margin-top: 15px;
  }
  .classLeaveMsgDetail .classLeaRep .leaveMsgReplayDe{
    color: #333333;
    background-color: #ffffff;
    border-bottom:1px solid #e5e5e5;
  }
  .classLeaveMsgDetail .classLeaRep .leaveMsgReplayDe .rep-icon{
    display: inline-block;
    margin-left: 10px;
    margin-top: 10px;
    font-size: 30px;
    vertical-align:middle;
  }
  .classLeaveMsgDetail .classLeaRep .leaveMsgReplayDe .replyName{display:inline-block;}
  .classLeaveMsgDetail .classLeaRep .leaveMsgReplayDe .replyName .replayXm{
    font-size: 12px;
    color: #999999;
  }
  .classLeaveMsgDetail .classLeaRep .leaveMsgReplayDe .replyTime{
    display: inline-block;
    font-size: 12px;
    color: #999999;
    padding-top: 10px;
  }
  .classLeaveMsgDetail .classLeaRep .leaveMsgReplayDe .rwContent{
    display: block;
    margin-left: 50px;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .classLeaveMsgDetail footer{
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .classLeaveMsgDetail .addReplay{
    width:100%;
    text-align:center;
    background-color: #ffffff;
  }
  .classLeaveMsgDetail .addReplay input{
    width: 85%;
    height: 25px;
    margin-top: 8px;
    margin-bottom: 8px;
    border: 1px solid #e5e5e5;
  }
  .classLeaveMsgDetail .addReplay a{
    color:#333333;
    font-size: 14px;
  }
</style>
<style>
  .classLeaveMsgDetail .xs-container {
    margin-top: 0;
  }
</style>
