<template>
  <div class="but-box">
    <x-button :class="`butOne ${oneButtonClass}`" type="primary" :mini="true" @click.native="clickOne">{{titleOne}}</x-button>
    <x-button :class="`butTwo ${twoButtonClass}`" type="primary" :mini="true" @click.native="clickTwo">{{titleTwo}}</x-button>
  </div>
</template>
<script>
  import XButton from 'vux/src/components/x-button/index.vue'
  export default {
    name: 'commonButtonTwo',
    components: {
      XButton
    },
    props: {
      titleOne: {
        type: String,
        default: '保存'
      },
      titleTwo: {
        type: String,
        default: '取消'
      },
      oneButtonClass: { // 默认修改样式
        type: String,
        default: 'button2'
      },
      twoButtonClass: { // 默认取消样式
        type: String,
        default: 'button3'
      }
    },
    methods: {
      // 点击第一个按钮
      clickOne () {
        this.$emit('get-oneVal');
      },
      // 点击第二个按你
      clickTwo () {
        this.$emit('get-twoVal');
      }
    }
  }
</script>
<style scoped>
  .but-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    line-height: 40px;
    background-color: #fff;
  }
  .butOne{
    width: 40%;
  }
  .butTwo{
    width: 40%;
    margin-left: 20px;
  }
  /* 保存 */
  .button1 {
    background-color: #bdb930;
    color: #ffffff;
  }
  /*  修改 */
  .button2 {
    background-color: #56a6be;
    color: #ffffff;
  }
  /* 取消*/
  .button3 {
    background-color: #ffffff;
    color: #333333;
  }
  /* 提交*/
  .button4 {
    background-color: #066dbd;
    color: #ffffff;
  }
  /* 审核通过 */
  .button5{
    background-color: #2971d7;
    color: #ffffff;
  }
  /* 审核拒绝 */
  .button6{
    background-color: #d14629;
    color: #ffffff;
  }
  /* 确定*/
  .button7 {
    background-color: #066dbd;
    color: #ffffff;
  }
</style>

