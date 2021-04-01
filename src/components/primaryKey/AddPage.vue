<template>
  <div class="addPage">
    <span class="add-span">
      <span class="school-wx-icon addIcon" slot="icon">&#xe668;</span>
    </span>
  </div>
</template>
<script>
  export default {
    name: 'primaryKey-addPage'
  }
</script>
<style scoped>
  .addPage{
    position: absolute;
    bottom: 8px;
    right: 15px;
  }
  /*悬浮的加号*/
  .add-span{
    display: inline-block;
    padding: 4px;
  }
  .addIcon{
    color: #100f0f;
    font-size: 30px;
    padding-left: 8px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 13px;
    opacity: 0.6;
  }
  /*悬浮的加号end*/
</style>
