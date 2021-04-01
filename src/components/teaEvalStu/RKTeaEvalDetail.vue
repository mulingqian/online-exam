<template>
  <div class="teaEvalDetail">
    <tea-eval-detail :classEvalType="1"></tea-eval-detail>
  </div>
</template>
<script>
  import TeaEvalDetail from './common/TeaEvalDetail.vue'
  export default {
    name: "pkTeaEvalDetail",
    directives: {
    },
    components: {
      TeaEvalDetail
    },
    methods: {
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
