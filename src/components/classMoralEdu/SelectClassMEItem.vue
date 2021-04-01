<template>
  <div class="selectMeExamIt">
    <select-items @get-SelectVal="getSelectVal" :selectOriginInfo="selectOriginInfo"></select-items>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import SelectItems from '../commonSelect/SelectMEItems'
  export default {
    name: 'selectClassMEItem',
    directives: {
      TransferDom
    },
    components: {
      SelectItems,
      Scroller
    },
    methods: {
      // 得到选中的值
      getSelectVal (e) {
        console.log("select e", e);
        this.QD.otherPageData = {itemInfo: e.itemInfo};
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 得到之前选中的项目细则
      getOriginData () {
        this.selectOriginInfo = this.QD.currPageData.itemInfo;
      }
    },
    created (){
      this.getOriginData(); // 得到之前选中的项目细则
    },
    data (){
      return {
        loading: false,
        backLoaded: true,
        selectOriginInfo: [] // 原来选择的项目
      }
    }
  }
</script>
<style scoped>
  .selectMeExamIt{background-color: #ffffff;}
</style>

