<template>
  <div>
    <toast v-model="showValue" :time="time" :is-show-mask="true" :text="text" :position="position"></toast>
  </div>
</template>
<script>
  import Toast from 'vux/src/components/toast/index.vue'
  export default{
    name: 'commonToastInfo',
    directives: {
    },
    components: {
      Toast
    },
    props: {
      position: { // 显示的位置
        type: String,
        default: 'middle'
      },
      text: { // 提示信息
        type: String,
        default: '成功'
      },
      time: { // 显示时间
        type: Number,
        default: 1000
      }
    },
    methods: {},
    data () {
      return {
        showValue: true
      }
    }
  }
</script>
<style scoped>

</style>
