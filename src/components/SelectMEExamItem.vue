<template>
  <div class="selectMeExamIt">
    <select-items @get-SelectVal="getSelectVal" :selectOriginInfo="selectOriginInfo"></select-items>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import SelectItems from './commonSelect/SelectMEItems'
  export default {
    name: "selectMeExamItem",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Scroller,
      SelectItems
    },
    methods: {
      // 得到选中的值
      getSelectVal (e) {
        this.QD.otherPageData = {itemInfo: e.itemInfo};
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
        // 获取学分项目
      async getMEStuXMProject() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuXMProject'});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.xfProject = d;
        if (this.xfProject.length > 0) {
          this.getMEStuXMetail(d[0].ID);
        }
      },
      // 根据父ID（项目ID）获取学分细则信息
      async getMEStuXMetail(pid) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuProjectDetail', ParentID: pid});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.xfProDetail = d;
        this.$nextTick(() => {
          this.$refs.scrollerLst.reset({top: 0})
        })
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
        isActive: 0, // 学分项目 index = isActive
        isActivexfDetail: '', // 学分细则背景颜色改变
        xfProject: [], // 学分项目信息
        xfProDetail: [], // 学分项目细则
        selectOriginInfo: [] // 原来选择的项目
      }
    }
  }
</script>
<style scoped>
</style>

