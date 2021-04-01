<template>
  <div class="announceNewsDetail">
    <div class="newsSubject">
      <span>{{newsSubject}}</span>
      <p>{{newsCreateTime}}</p>
    </div>
    <div v-html="newsContent" class="newsContent">
    </div>
    <div class="newsFiles">
      <p v-for="(f, fIdx) in announceFile" :key="fIdx">
        <span class="school-wx-icon newsFileIcon" slot="icon">&#xe634;</span>
        <a :href="f.FilePath">{{f.FileName}}</a>
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    name: "announceNewsDetail",
    methods: {
        // 根据id获取通知公告新闻的详细信息
      async getDetailById () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetOfficeDocDetail', id: this.$route.query.id});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.newsContent = d.Content;
        this.newsSubject = d.Subject;
        this.newsCreateTime = d.CreateTime;
        this.announceFile = d.AttList;
        console.log(this.announceFile[0]);
      }
    },
    created() {
      this.getDetailById();
    },
    data () {
      return {
        newsContent: '', // 新闻详情内容
        newsSubject: '', // 新闻主题
        newsCreateTime: '',
        announceFile: [] // 附件数组
      }
    }
  }
</script>
<style scoped>
  .announceNewsDetail{
    overflow-x: hidden;
  }
  .announceNewsDetail .newsSubject span{
    display: inline-block;
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 38px;
    font-size: 16px;
    color: #333333;
  }
  .announceNewsDetail .newsSubject p{
    line-height: 20px;
    font-size: 12px;
    color: #999999;
    text-align: center;
  }
  .announceNewsDetail .newsContent{
    margin-top: 10px;
    font-size: 16px;
    color: #666666;
    line-height: 20px;
    padding-left: 12px;
    padding-right: 10px;
  }
  .newsFiles{
    margin-top: 12px;
    padding-left: 12px;
    padding-right: 10px;
    font-size: 16px;
  }
  .newsFiles a{
    color: #666666;
  }
  .newsFileIcon{
    padding-right: 0;
  }
</style>
<style>
  .announceNewsDetail img{
    text-align: center;
    width: 100% !important;
    height: auto!important;
  }
  .announceNewsDetail pre,code{
    white-space: pre-wrap;
  }
  .announceNewsDetail .newsContent .content-container-title,
  .announceNewsDetail .newsContent .content-container-body-info,
  .announceNewsDetail .newsContent p{
    text-indent: 20px;
  }
  .announceNewsDetail .newsContent tbody tr td:nth-child(1) img{
    width: 100% !important;
    height: auto!important;
  }
  .announceNewsDetail .newsContent p span{
    font-family: "Microsoft YaHei" !important;
    font-size:16px !important;
    color: #666666 !important;
    background-color: transparent !important;
  }
  .announceNewsDetail .newsContent ul li img{
    width:100% !important;
    height:auto!important;
  }
</style>
