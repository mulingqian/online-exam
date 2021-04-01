<template>
    <div class="schooLinfo">
      <div class="mgs-detail" v-html="QD.school_Introduction"></div>
    </div>
</template>
<style scoped>
.schooLinfo p{
  line-height: 18px;
  font-size: 16px;
  color: #333333;
}
  .mgs-detail{
    padding: 15px 10px;
    font-size: 16px;
    color: #333333;
  }
</style>
<script>
    export default{
      name: 'schoolinfo'
    }
</script>
