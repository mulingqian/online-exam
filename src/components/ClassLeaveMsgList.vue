<template>
  <div class="classLeaMsgLst">
    <div class="addLeaMsg" v-if="zghOrXhType === 1">
          <span class="addMsg" @click="addLeaveMsg">
            <span class="school-wx-icon" slot="icon" style="color:#138018;">&#xe646;</span>发个留言吧
          </span>
    </div>
    <div class="classLeaCon" v-for="(lm,lidx) in leaveMsgList" :key="lidx" v-on:click="getClassLeaveDetail(lm.MsgId)">
      <div class="leaMsg">
            <span class="leaName">
              <span class="school-wx-icon stu-icon" slot="icon" style="position: relative;color:#f0ad4e;font-size: 30px;padding-right: 0;">&#xe612;
                <span style="font-size: 14px;">{{lm.XM}}</span>
              </span>
            </span>
        <span class="leaTitle">{{lm.Title}}</span>
        <span class="leaTime">{{lm.CreateTime}}</span>
      </div>
      <div class="leaReplay">
        <span class="replayCount">回复</span>
        <span class="school-wx-icon leaMsg-icon" slot="icon" style="color:#999999;">&#xe603;</span>
      </div>
    </div>
    <divider class="noMsg" v-if="zghOrXhType === 4 && leaveMsgList.length <= 0">暂无班级留言</divider>
  </div>
</template>
<script>
  import { mapState } from 'vuex'

  import Divider from 'vux/src/components/divider/index.vue'
  export default {
    name: "classLeaveMsgList",
    components: {
      Divider
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    methods: {
        //  写留言
      addLeaveMsg () {
        this.$router.push({path: '/classLeaveMsgAdd', query: {id: this.$route.query.bjid}}); // 跳转到添加留言页面
      },
        // 根据留言id 跳转到留言详情页面
      getClassLeaveDetail (msgid) {
        this.$router.push({path: '/classLeaveMsgDetail', query: {id: msgid}});
      },
      // 查询留言列表 bjid(班级Id)、type(类型：1-教师，4-学生)
      async getClassLeaveMsgLstData () {
        if (this.userinfo.usertype === 4) {
          this.zghOrXhType = 4;
          this.bjid = this.userinfo.stuObj.BJID;
        } else {
          this.zghOrXhType = 1;
          this.bjid = this.$route.query.bjid;
        }
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassLeaveMsgLstData', bjid: this.bjid, type: this.zghOrXhType});
        if (d.status && d.status === "error") {
          this.QD.alert('', `获取班级留言数据失败！`);
          return;
        }
        this.leaveMsgList = d;
      }
    },
    created () {
      this.getClassLeaveMsgLstData();
    },
    data () {
      return {
        leaveMsgList: [], // 留言列表
        bjid: null, // 班级id
        zghOrXhType: 0 // 判断是教师端还是学生端type(类型：1-教师，4-学生)
      }
    }
  }
</script>
<style scoped>
  .noMsg{
    padding: 60px 0 0 0;
  }
</style>
<style>
  .classLeaMsgLst{
    background-color: #f2f2f2;
  }
  .classLeaMsgLst .addLeaMsg{
    width:100%;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .classLeaMsgLst .xs-container {
    margin-top: 0;
  }
  .classLeaMsgLst .addLeaMsg .addMsg{
    padding: 10px 20px;
    display: inline-block;
    border-radius: 50px;
    color: #666666;
    background-color:#ffffff;
  }
  .classLeaMsgLst .classLeaCon{
    width:100%;
    margin-bottom: 40px;
  }
  .classLeaMsgLst .classLeaCon .leaMsg{
    color: #333333;
    background-color: #ffffff;
  }
  .classLeaMsgLst .classLeaCon .leaMsg span{
    display: block;
  }
  .classLeaMsgLst .classLeaCon .leaMsg .leaName{
    margin-bottom: 40px;
    /*padding-top: 10px;*/
    text-align: center;
    font-size: 14px;
  }
  .classLeaMsgLst .classLeaCon .leaMsg .leaTitle{
    text-align: center;
    margin-bottom: 40px;
    font-size: 16px;
  }
  .classLeaMsgLst .classLeaCon .leaMsg .leaTime{
    font-size: 12px;
    color: #999999;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .classLeaMsgLst .leaReplay{
    width:100%;
    height: 40px;
    font-size: 12px;
    color: #999999;
    border-top:1px solid #e5e5e5;
    background-color: #ffffff;
  }
  .classLeaMsgLst .leaMsg-icon{
    float: right;
    display: inline-block;
    margin-top: 10px;
  }
  .classLeaMsgLst .replayCount{
    display: inline-block;
    margin-left: 10px;
    margin-top: 10px;
  }
</style>
