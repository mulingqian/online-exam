<template>
  <div class="guide-dialog-content">
    <x-dialog class="guide-dialog" v-model="showGuideDialog">
      <div class="container">
        <p class="header">{{guideInfo.header}}</p>
        <div class="content-box" v-html="guideInfo.contentText"></div>
        <p class="content-desc">{{guideInfo.contentDesc}}</p>
        <div class="buttom-box clearfloat">
          <span class="btn exit-btn" @click="exitEvent">退出应用</span>
          <span class="btn agree-btn" @click="hiddenEvent">同意</span>
        </div>

      </div>
    </x-dialog>
  </div>
</template>
<script>
  import XDialog from 'vux/src/components/x-dialog/index.vue'
  import XButton from "vux/src/components/x-button/index.vue"
  export default {
    name: 'userbind-guideDialog',
    components: {
      XDialog,
      XButton
    },
    data () {
      return {
        showGuideDialog: false,
        guideInfo: null // 个人信息保护指引
      }
    },
    created () {
      this.getGuideInfo(); // 得到配置的用户信息保护指引
    },
    mounted () {
      this.$nextTick(function() {
        let that = this;
        let userAgree = document.querySelector("#userAgree"); // 用户协议
        userAgree.addEventListener('click', function(ev) {
          that.goRelatePg('/userAgree') // 到相对应的页面
        }, false);
        let userPrivacy = document.querySelector("#userPrivacy"); // 政策隐私
        userPrivacy.addEventListener('click', function(ev) {
          that.goRelatePg('/userPrivacy') // 到相对应的页面
        }, false);
      })
    },
    methods: {
      // 得到配置的用户信息保护指引
      getGuideInfo () {
        if (this.QD.guideDialogInfo) {
          this.guideInfo = this.QD.guideDialogInfo;
        } else {
          this.guideInfo = {
            header: '个人信息保护指引',
            contentText:
            '<p>请充分阅读并理解后，点击下面的按钮以接受我们的服务</p>'+
            '<p>1. 在浏览使用时，我们会收集、使用设备标识信息用于推荐。</p>' +
            '<p>2. 我们可能会申请位置权限，用于帮助你在发布的信息中展示位置或丰富信息推荐纬度。城市位置无需使用位置权限，仅通过ip地址确定“城市频道”中的城市及相关信息，不会收集精确位置信息。</p>' +
            '<p>3. 你可以查看完整版<a id="userAgree">《用户协议》</a>和<a id="userPrivacy">《隐私政策》</a>以便了解我们收集、使用、共享、存储信息的情况，以及对信息的保护措施。</p>',
            contentDesc: '如果你同意请点击下面的按钮以接受我们的服务。'
          }
        }
        this.showEvent();  // 显示指引弹框内容
      },
      // 显示指引弹框内容
      showEvent () {
        let that = this;
        setTimeout(function () {
          that.showGuideDialog = true
        }, 500)
      },
      // 隐藏弹框事件
      hiddenEvent () {
        this.showGuideDialog = false;
      },
      // 退出程序事件
      exitEvent () {
        console.log("exit event");
        this.QD.closeWindow();
      },
      // 到相对应的页面
      goRelatePg (url) {
        this.$router.push(url);
      }
    }
  }
</script>
<style scoped lang="less">
  .guide-dialog .container{
    width: 100%;
    padding: 16px 0 0 0;
    background: #ffffff;
    box-sizing: border-box;
    .header{
      margin-bottom: 16px;
      font-size: 18px;
      color: #000000;
    }
    .buttom-box{
      font-size: 18px;
      text-align: center;
      /*background-color: #4fc3f7;*/
    }
    .buttom-box .btn{
      position: relative;
      float: left;
      display: inline-block;
      width: 50%;
      padding: 10px 10px;
      box-sizing: border-box;
      border-top: 1px solid #d9d9d9;
    }
    .buttom-box .exit-btn{
      color: #000000;
    }
    .buttom-box .agree-btn{
      border-left: 1px solid #d9d9d9;
      color: #ff0000;
    }
  }
  .guide-dialog .content-box{
    max-height: 460px;
    padding: 0 10px 0 10px;
    color: #333333;
    overflow-y: scroll;
  }
</style>
<style lang="less">
  .guide-dialog-content .guide-dialog .content-box>p{
    padding: 2px 0;
    line-height: 20px;
    font-size: 14px;
    text-align: left;
  }
  .guide-dialog-content .guide-dialog .content-box .link{
    color: #4fc3f7;
  }
  .guide-dialog-content .guide-dialog .content-desc{
    margin-top: 16px;
    padding: 0 10px 16px 10px;
    line-height: 20px;
    font-size: 14px;
    text-align: left;
  }
</style>
