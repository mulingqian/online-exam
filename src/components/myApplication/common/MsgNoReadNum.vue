<template></template>
<script>
  import { mapActions } from 'vuex'
  export default {
    name: 'msgNoReadNum',
    computed: {},
    data () {
      return {}
    },
    props: {
      useInterfaceMsgNum: { // 是否调用接口
        type: Boolean,
        default: true
      }
    },
    created () {
      this.getMsgOFDoingNoConfirmedNum(); // 查询待办和我的消息未读消息总数
    },
    mounted () {
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus',
        'messageCentreSum' // 待办和我的消息未读消息总数方法 main.js 中的mutations
      ]),
      // 查询待办和我的消息未读消息总数
      async getMsgOFDoingNoConfirmedNum () {
        if (!this.useInterfaceMsgNum) {
          return;
        }
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetPersonMsgOFDoingNoConfirmedNum'});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log('home msg', d.msg);
          let messageSum = '';
          this.messageCentreSum(messageSum);
          this.$emit('get-num', messageSum);
          return;
        }
        console.log("..msg num", d);
        let messageSum = d.toString();
        if (messageSum === '0') {
          messageSum = '';
        }
        this.messageCentreSum(messageSum);
        this.$emit('get-num', messageSum);
      }
    }
  }
</script>
