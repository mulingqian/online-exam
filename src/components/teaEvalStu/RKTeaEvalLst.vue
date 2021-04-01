<template>
  <div class="eachPgBase">
    <tea-eval-lst :classEvalType="1" @click-class="selectClass"></tea-eval-lst>
  </div>
</template>
<script>
  import teaEvalLst from './common/TeaEvalLst.vue'
  export default {
    name: "pkTeaEvalLst",
    directives: {
    },
    components: {
      teaEvalLst
    },
    methods: {
      // 点击选择班级
      selectClass (e) {
        this.$router.push({path: '/teaEvalStu/rkTeaEvalDetail', query: {eID: e.FWID}});
      }
    },
    created () {
    },
    data () {
      return {
      }
    }
  }
</script>
<style scoped>
</style>
