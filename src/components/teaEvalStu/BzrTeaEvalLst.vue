<template>
  <div class="eachPgBase">
    <tea-eval-lst :classEvalType="2" @click-class="selectClass"></tea-eval-lst>
  </div>
</template>
<script>
  import teaEvalLst from './common/TeaEvalLst.vue'
  export default {
    name: "bzrTeaEalLst",
    directives: {
    },
    components: {
      teaEvalLst
    },
    methods: {
      // 点击选择班级
      selectClass (e) {
        this.$router.push({path: '/teaEvalStu/bzrTeaEvalDetail', query: {eID: e.FWID}});
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
