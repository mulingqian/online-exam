<template>
  <div class="fwrapper user-agree">
    <div class="container">
      <h4 class="title">隐私政策</h4>
      <div class="content-box">
        <div class="head2">更新日期：2020年07月20日</div>
        <div class="head2">生效日期：2020年07月20日</div>
        <div class="head2">本隐私政策将帮助您了解：</div>
        <div class="desc">
          1.我们会遵循隐私政策收集、使用您的信息，但不会仅因您的同意本隐私政策而采用强制捆绑的方式一揽子收集个人信息。
        </div>
        <div class="desc">
          2.精确地理位置、摄像头、麦克风、相册（存储）权限，均不会默认开启，只有经过您的明示授权才会在为实现特定功能或服务时使用，
          您也可以撤回授权。<span class="emphasize-desc">特别需要指出的是，即使经过您的授权，我们获得了这些敏感权限，也不会在相关功能或服务不需要时而收集您的信息。</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'user-privacy',
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
