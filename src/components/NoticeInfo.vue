<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div>
      <p v-html="objInfo.Subject" class="header-title"></p>
      <divider class="publishdate">{{ objInfo.PublishDate}}</divider>
      <div v-html="objInfo.Content" class="content1">

      </div>
    </div>
  </div>
</template>

<script>
  // import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Badge from 'vux/src/components/badge/index.vue'
  import Card from 'vux/src/components/card/index.vue'

  export default {
    name: "noticeInfo",
    directives: {
      TransferDom
    },
    components: {
      Cell,
      Group,
      Loading,
      Divider,
      Badge,
      Card
    },
    methods: {
      async getDetail () {
        let d = await this.QD.getData('/School/StuClient/StudentServiceNoticeDetail', {ID: parseInt(this.id)})
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.objInfo = d[0];
        console.log(this.objInfo);
        this.loading = false
        // this.QD.alert(`获取数据成功`)
      }
    },
    created () {
      console.log(this.$route.query)
      this.id = this.$route.query.id
      this.getDetail()
    },
    data () {
      return {
        loading: true,
        objInfo: {},
        id: null
      }
    },
    computed: {
    }
  }
</script>
<style scoped lang="less">
  body{
    background-color: #f7f7f7;
  }
 .header-title{
   display: block;
   width: 50%;
   font-size: 18px;
   line-height: 24px;
   margin: 5px auto;
   text-align: center;
 }
  .publishdate{
    width: 80%;
    font-size: 12px;
    margin: 0 auto;
  }
</style>
<style>
  .content1{
    width: 96%;
    margin: 0 auto;
  }
  .content1 p span{
    font-size: 16px !important;
    line-height: 26px !important;
    background-color: #f7f7f7 !important;
  }
  .content1 p span img{
    width: 100%;
  }
</style>

