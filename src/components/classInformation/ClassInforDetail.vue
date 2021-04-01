<template>
  <div class="classInforDetail">
    <group>
      <cell>
        <span slot="after-title" class="vux-label">
          <div class="first-line">{{classInforDetail.Title}}</div>
          <div class="second-line">{{classInforDetail.Content}}</div>
          <div class="third-line">
            <span>{{classInforDetail.XM}}</span>
            <span>{{classInforDetail.CreateTime}}</span>
          </div>
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'

  export default {
    name: 'classInforDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell
    },
    methods: {
      /*获取班级信息详细*/
      async getClassInfoData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassInfoData', infoId: this.$route.query.id});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        this.classInforDetail = d;
      }
    },
    created () {
      this.getClassInfoData();
    },
    data () {
      return {
        loading: false,
        classInforDetail: [] // 班级信息详细
      }
    }
  }
</script>
<style scoped>
  .classInforDetail{
    background-color: #f2f2f2;
  }
  .classInforDetail .first-line{
    text-align: center;
    color: #333333;
  }
  .classInforDetail .second-line{
    text-indent:25px;
    color: #666666;
    font-size: 14px;
  }
  .classInforDetail .third-line{
    float: right;
    margin-right: 8px;
    font-size: 12px;
    color: #999999;
  }
</style>
<style>
  .classInforDetail .weui-cells{
    margin-top:0;
  }
</style>
