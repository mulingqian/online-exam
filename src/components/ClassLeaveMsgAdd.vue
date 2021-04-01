<template>
  <div class="classLeaveMsgAdd">
    <div class="publishLeaveMsg"><a @click="InserClassLeaveMsgInfor">发表</a></div>
    <div class="leaveMsgTitle">
      <span>标题</span>
      <input type="text" placeholder="请输入标题" v-model="leaveMsgTitle"/>
    </div>
    <div class="leaveMsgContent">
      <textarea placeholder="留言内容" v-model="leaveMsgContent"></textarea>
    </div>
  </div>
</template>
<script>
  export default {
    name: "classLeaveMsgAdd",
    methods: {
      // 留言插入数据库中
      async InserClassLeaveMsgInfor () {
        let bjid;
        if (this.leaveMsgTitle === ''){
          this.QD.alert('', `请输入标题`);
        }
        if (this.leaveMsgContent === ''){
          this.QD.alert('', `请输入内容`);
        }
        if (this.QD.getLocalUserinfo().stuObj.XH !== undefined) {
          bjid = this.QD.getLocalUserinfo().stuObj.BJID;
        } else {
          bjid = this.$route.query.id;
        }
        if (this.leaveMsgTitle !== ''& this.leaveMsgContent !== ''){
          let d = await this.QD.getData('/ComApi/PostObject', {
            apiName: 'InsertClassLeaveMsgInfor',
            BJID: bjid,
            Title: this.leaveMsgTitle,
            Content: this.leaveMsgContent
          });
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
          }
          console.log(d);
          // 大于0的数字添加留言成功，并跳转到 班级留言 页面
          if (d > 0){
            this.$router.replace({path: 'classLeaveMsgList', query: {bjid: this.$route.query.id}});
          }
        }
      }
    },
    data () {
      return {
        leaveMsgTitle: '',
        leaveMsgContent: ''
      }
    }
  }
</script>
<style>
  .classLeaveMsgAdd .publishLeaveMsg{
    width:100%;
    height: 45px;
  }
  .classLeaveMsgAdd .publishLeaveMsg a{
    float: right;
    display: block;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    margin-right: 10px;
    margin-top: 10px;
    background-color: #138018;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 14px;
    padding-right: 14px;
    color: #fff;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
  .classLeaveMsgAdd .leaveMsgTitle{
    width:100%;
    border-top:1px solid #e5e5e5;
  }
  .classLeaveMsgAdd .leaveMsgTitle span{
    margin-left: 10px;
    font-size: 16px;
    color: #cccccc;
  }
  .classLeaveMsgAdd .leaveMsgTitle input{
    width:78%;
    height: 25px;
    outline: none;
    text-align: right;
    font-size: 16px;
    color: #333333;
    border:0;
  }
  .classLeaveMsgAdd .leaveMsgContent{
    width:100%;
    margin-top: 2px;
    border-top: 1px solid #e5e5e5;
    text-align: center;
  }
  .classLeaveMsgAdd .leaveMsgContent textarea{
    width: 90%;
    height: 120px;
    margin-top: 8px;
    font-size: 14px;
    color: #333333;
    border:0;
    outline: 0;
  }
</style>
