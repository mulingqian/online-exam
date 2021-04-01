<template>
  <div class="fieldExplainWord">
    <!--说明文字-->
    <span class="eContent">{{explainWordContent}}</span>
  </div>
</template>
<script>
  export default {
    name: 'primaryKey-fieldExplainWord',
    components: {
    },
    props: {
      explainWordLst: Object
    },
    methods: {
      // 获取type类型的所有值
      getAllVal () {
        this.explainWordContent = this.explainWordLst.content;
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
    },
    data () {
      return {
        explainWordContent: '', // 说明文字内容
        explainWord: '' // 说明文字
      }
    }
  }
</script>
<style scoped>
  .eContent {
    display: inline-block;
    padding-top: 18px;
    padding-left: 10px;
    font-size: 14px;
    color: #666666;
  }
</style>
<style>
</style>
