<template>
  <div>
    <msg :title="title" :description="message" :buttons="buttons" :icon="icon"></msg>
  </div>
</template>

<script>
  // import { Msg, Divider, XButton } from 'vux'
  // import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
  import Msg from 'vux/src/components/msg/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import XButton from "vux/src/components/x-button/index.vue"
  export default {
    name: 'error',
    components: {
      Msg,
      Divider,
      XButton
    },
//    props: {
//      title: {
//        default: '操作失败'
//      },
//      description: {
//        default: '操作失败'
//      },
//    },
    methods: {
      close () {
        this.QD.closeWindow()
      }
    },
    data () {
      return {
        title: this.$route.params && this.$route.params.title ? this.$route.params.title : '操作失败',
        message: this.$route.params && this.$route.params.message ? this.$route.params.message : '',
        icon: 'warn',
        buttons: [{
          type: 'default',
          text: '关闭',
          onClick: () => {
            this.QD.closeWindow()
          }
        }]
      }
    }
  }
</script>
