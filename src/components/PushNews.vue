<!--班级列表-->
<template>
  <div class="push-news">
    <van-cell-group  title="发送信息">
      <van-field
        v-model="message"
        rows="10"
        autosize
        type="textarea"
        placeholder="请输入信息内容"
      />
    </van-cell-group>
    <button-one :titleVal="'发 送'" @click-button="getcid"></button-one>
  </div>
</template>
<script>
  import { Button, CellGroup, Field } from 'vant'
  import buttonOne from '../components/common/XButtonOne.vue'
  export default {
    name: 'pushNews',
    components: {
      buttonOne,
      [Button.name]: Button,
      [CellGroup.name]: CellGroup,
      [Field.name]: Field
    },
    data() {
      return {
        message: '' // 信息
      }
    },
    created() {
    },
    methods: {
      // 得到用户的cid
      getcid () {
        this.QD.pushNews(this.message);
      }
    }
  }
</script>
<style lang="less">
  .push-news{
    textarea{
      border:0.5px solid #eceaea;
    }
  }
</style>
