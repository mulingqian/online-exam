<template>
  <div class="fwrapper user-agree">
    <div class="container">
      <h4 class="title">用户协议</h4>
      <div class="content-box">
        <div class="head2">1.户群体及服务内容</div>
        <div class="desc">微信校园的用户群体为：使用微信校园产品的学校的老师，学生以及家长用户，微信校园的具体服务内容由
        微信校园根据实际情况提供，例如考试数据、个人资料、个人分享信息以及评论等。微信校园保留变更、中断或终止部分网络服务的权利。微信校园保留根
        据实际情况随时调整平台提供的服务种类、形式。<span class="emphasize-desc">微信校园为给用户打造更好的产品体验，会不断升级服务，</span>优化功能，因业务调整给用户带来的不便，微信校园会尽量提前告知用户。
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'user-agreement',
    components: {
    },
    data () {
      return {
      }
    },
    methods: {
    }
  }
</script>
<style scoped lang="less">
  .container{
    padding: 20px 10px;
  }
  .title{
    padding: 0 10px 12px 10px;
    font-size: 18px;
    color: #000000;
    text-align: center;
  }
  .content-box{
    padding: 0 10px 20px 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .content-box .head2{
    padding: 8px 0;
    font-size: 16px;
    color: #000000;
    line-height: 22px;
  }
  .content-box .desc{
    padding: 8px 0;
    font-size: 14px;
    color: #333333;
    line-height: 24px;
  }
  .content-box .emphasize-desc{
    color: #000000;
  }
</style>
