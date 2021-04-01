<template>
  <!--<footer>
    <div class="submitMERegister" @click="clickButton"><a>{{title}}</a></div>
  </footer>-->
  <div class="btn-box">
    <x-button @click.native="clickButton" type="primary" class="btn-save" mini>{{title}}</x-button>
  </div>
</template>
<script>
  import XButton from 'vux/src/components/x-button/index.vue'
  export default {
    name: 'commonSubmitButton',
    components: {
      XButton
    },
    props: {
      title: String
    },
    methods: {
      clickButton () {
        this.$emit('click-button');
      }
    }
  }
</script>
<style scoped>
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
  .btn-save{
    width: 100%;
    height: 40px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
  }
  /*footer{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .submitMERegister{
    margin-top: 10px;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  .submitMERegister a{
    display: inline-block;
    padding: 12px 10px;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }*/
</style>

