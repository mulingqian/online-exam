<template>
  <div class="message-centre-field">
    <div class="header-box">
      <div class="header-title">消息</div>
      <div class="btn complete-btn" @click="setMsgAllReadWay">
        <span class="school-wx-icon clear-icon">&#xe675;</span>
        <span class="btn-text">全部已读</span>
      </div>
    </div>
    <div class="message-container">
      <group class="gp">
        <cell v-if="userinfo.usertype === 2" @click.native="goPg('/messageCenter/workWaitingOrWorkDone')" :is-link="false">
          <div slot="icon" class="icon-cell">
            <span class="school-wx-icon icon-title">&#xe633;</span>
            <badge v-if="doingsuntreatedNum !== 0" class="no-read-num" :text="doingsuntreatedNum"></badge>
          </div>
          <div slot="after-title">
            待办事宜
          </div>
        </cell>
        <cell @click.native="goPg('/messageCenter/messageCatalog')" :is-link="false">
          <div slot="icon" class="icon-cell">
            <span class="school-wx-icon icon-title">&#xe684;</span>
            <badge v-if="messageNoConfirmedNum !== 0" class="no-read-num" :text="messageNoConfirmedNum"></badge>
          </div>
          <div slot="after-title">
            我的消息
          </div>
        </cell>
        <cell v-if="userinfo.usertype === 4" @click.native="goPg('/classLeaveMsgList')" :is-link="false">
          <div slot="icon" class="icon-cell">
            <span class="school-wx-icon icon-title">&#xe7a6;</span>
          </div>
          <div slot="after-title">
            班级留言
          </div>
        </cell>
        <cell v-if="userinfo.usertype === 4" @click.native="goPg('/classInformation/classInformationLst')" :is-link="false">
          <div slot="icon" class="icon-cell">
            <span class="school-wx-icon icon-title">&#xe640;</span>
          </div>
          <div slot="after-title">
            班级信息
          </div>
        </cell>
        <cell v-if="userinfo.usertype === 2" @click.native="goPg('/classLeaveMsgClassList')" :is-link="false">
          <div slot="icon" class="icon-cell">
            <span class="school-wx-icon icon-title">&#xe7a6;</span>
          </div>
          <div slot="after-title">
            班级留言
          </div>
        </cell>
        <cell v-if="userinfo.usertype === 2" @click.native="goPg('/classInformation/classInforClassLst')" :is-link="false">
          <div slot="icon" class="icon-cell">
            <span class="school-wx-icon icon-title">&#xe640;</span>
          </div>
          <div slot="after-title">
            班级信息
          </div>
        </cell>
      </group>
    </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Badge from 'vux/src/components/badge/index.vue'

  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'messageCentre',
    directives: {
    },
    components: {
      Group,
      Cell,
      Badge
    },
    methods: {
      // 到相应的页面中
      goPg (url) {
        this.$router.push(url)
      },
      // 全部已读
      setMsgAllReadWay () {
        if (this.userinfo.usertype === 2 && this.QD.schoolName && this.QD.schoolName === '广西梧州商贸学校') {
          this.setSpecialMsgAllRead(); // 特殊学校版本的全部已读- 加抢单维修,注只针对老师
        } else {
          this.setCommonMsgAllRead();  // 学校通用版本的全部已读
        }
      },
      // 特殊学校版本的全部已读- 加抢单维修
      async setSpecialMsgAllRead () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'AllUpdateOFDoingStatulRead'});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log(`全部已读:${d.msg}`);
        }
        console.log('msg', d);
        this.getOFDoingsuntreatedNum(); // 获取待办事宜的数量
        this.getMsgOFDoingNoConfirmedNum();  // 查询待办和我的消息未读消息总数
      },
      // 学校通用版本的全部已读
      async setCommonMsgAllRead () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'SetDoingMessageStatus'});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log(`全部已读:${d.msg}`);
        }
        console.log('msg', d);
        if (this.userinfo.usertype === 4) { // 学生
          this.getPersonalMessageNoConfirmedNum(); // 获取我的消息的数量
        } else if (this.userinfo.usertype === 2) { // 老师
          this.getOFDoingsuntreatedNum(); // 获取待办事宜的数量
        }
        this.getMsgOFDoingNoConfirmedNum();  // 查询待办和我的消息未读消息总数
      },
      /*根据登录者的职工号或学号来判断登陆者是学生还是教师*/
      getTeacherOrStu () {
        if (this.userinfo.usertype === 4) {
          this.zghOrXh = this.userinfo.stuObj.XH;
          this.getPersonalMessageNoConfirmedNum();
          // 定时器
          this.autoMsgNo();
        } else if (this.userinfo.usertype === 2) {
          this.zghOrXh = this.userinfo.stuObj.ZGH;
          // 获取待办事宜的数量
          this.getOFDoingsuntreatedNum();
          // 定时器
          this.autoGetDoingOrMsgNo();
        }
      },
      // 定时器,定时获取待办事宜和我的消息的数量
      autoGetDoingOrMsgNo () {
        this.autoMsgCentre = window.setInterval(this.getOFDoingsuntreatedNum, 30000);
      },
      // 定时器,定时获取我的消息的数量
      autoMsgNo () {
        this.autoMsgCentre = window.setInterval(this.getPersonalMessageNoConfirmedNum, 30000);
      },
      // 获取待办事宜的数量
      async getOFDoingsuntreatedNum (){
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetOFDoingsuntreatedNum', ZGH: this.zghOrXh});
        if (d.status && d.status === "error") {
          console.log(`获取数据失败GetOFDoingsuntreatedNum:${d.msg}`);
          return;
        }
        this.doingsuntreatedNum = d;
        this.getPersonalMessageNoConfirmedNum();
      },
      // 获取我的消息的数量
      async getPersonalMessageNoConfirmedNum () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetPersonalMessageNoConfirmedNum'});
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
          return;
        }
        this.messageNoConfirmedNum = d;
      },
      /*查询待办和我的消息未读消息总数*/
      async getMsgOFDoingNoConfirmedNum () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetPersonMsgOFDoingNoConfirmedNum'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.updateLoadingStatus(false);
        let messageSum = d.toString();
        if (messageSum === '0') {
          messageSum = '';
        }
        this.messageCentreSum(messageSum);
      },
      ...mapActions([
        'updateLoadingStatus',
        'messageCentreSum' // 待办和我的消息未读消息总数方法 main.js 中的mutations
      ])
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo,   // 用户信息
        msgCentreSumNum: state => state.vux.msgCentreSumNum // 待办和我的消息未读消息总数
      })
    },
    created () {
        /*根据登录者的职工号或学号来判断登陆者是学生还是教师*/
      this.getTeacherOrStu();
      /*查询待办和我的消息未读消息总数*/
      this.getMsgOFDoingNoConfirmedNum();
    },
    beforeDestroy () {
        /*关闭定时器*/
      if (this.autoMsgCentre) {
        window.clearInterval(this.autoMsgCentre);
      }
    },
    data () {
      return {
        doingsuntreatedNum: 0, // 待办事宜的数量
        messageNoConfirmedNum: 0, // 我的消息数目
        autoMsgCentre: '', // 定时器
        zghOrXh: '' // 登录者的职工号或学号
      }
    }
  }
</script>
<style scoped>
  .message-centre-field{
    position: static;
    background-color: #f2f2f2;
  }
  .message-container{
    position: absolute;
    top: 46px;
    bottom: 53px;
    width: 100%;
    overflow-y: scroll;
    background-color: #f2f2f2;
  }
  .header-box{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 3px 0;
    background-color: #f8f8f8;
    z-index: 100;
  }
  .header-title{
    position: relative;
    height: 40px;
    margin: 0 88px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
  }
  .header-box .btn{
    position: absolute;
    top: 9px;
    padding: 6px 0;
    font-size: 16px;
    border-radius: 5px;
  }
  .header-box .complete-btn{
    right: 15px;
    color: #666666;
    font-size: 14px;
  }
  .header-box .btn-text{
    vertical-align: middle;
  }
  .header-box .clear-icon{
    padding: 0;
    font-size: 14px;
    color: #666666;
    vertical-align: middle;
  }
  .icon-cell{
    position: relative;
    margin: 2px 12px 2px 0;
  }
  .icon-cell .icon-title{
    display: inline-block;
    width: 38px;
    height: 38px;
    padding: 0;
    color: #474747;
    font-size: 24px;
    text-align: center;
    border: 1px solid #f0f0f0;
    border-radius: 50%;
    vertical-align: middle;
  }
  .icon-cell .no-read-num{
    position: absolute;
    top: -8px;
    left: 24px;
  }
</style>
<style>
  .message-container .gp .weui-cells{
    margin-top:0;
  }
</style>
