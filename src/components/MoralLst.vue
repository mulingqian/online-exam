<template>
  <div class="courselst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-show="(!loading && (!lst || lst.length === 0))">
      <divider style="margin-top:50px;">暂无数据</divider>
    </div>

    <div class="lst-field">
      <div class="lst-content">
        <div class="bottomHalfLine each-box" v-for="(x, index) in lst"  :key="index" @click="goDetailEvent(x.MCID)">
          <div class="icon-box">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#qdicon-pingyu1"></use>
            </svg>
          </div>
          <div class="block">
            <p class="xqmc">{{x.XQMC}}</p>
            <p class="text">学年度: {{x.XND}}</p>
            <p class="text">评语类型: {{x.Type}}</p>
            <p class="text">品德等第: {{x.PDDD}}</p>
            <p class="text pynr">评语内容: {{x.PYNR}}</p>
          </div>
          <div class="weui-cell_access">
            <div class="weui-cell__ft"></div>
          </div>
        </div>
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
  import Smst from './Smst.vue'

  export default {
    name: 'moralLst',
    directives: {
      TransferDom
    },
    components: {
      Cell,
      Group,
      Smst,
      Loading,
      Divider
    },
    methods: {
      // 到详情页面
      goDetailEvent(id) {
        this.$router.push({path: '/moraldetail', query: {id: id}})
      },
      async getList () {
        let d = await this.QD.getData('/School/StuClient/MoralList', {})
        this.lst = d
        this.loading = false
      }
    },
    created () {
      this.getList()
    },
    data () {
      return {
        percent1: 30,
        loading: true,
        lst: [],
        currentXQ: null
      }
    },
    computed: {
    }
  }
</script>

<style scoped lang="less">
  .lst-content{
    position: relative;
    .each-box{
      position: relative;
      display: flex;
      padding: 10px 15px;
    }
    .icon-box{
      padding: 0 10px 0 0;
    }
    .icon-svg{
      width: 25px;
      height: 25px;
    }
    .xqmc{
      font-size: 16px;
      color: #18191a;
      line-height: normal;
    }
    .text{
      font-size: 12px;
      color: #494C4D;
      line-height: normal;
      padding: 3px 0;
    }
    .text.pynr{
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .weui-cell_access .weui-cell__ft:after{
      margin-top: 2px;
    }
  }
</style>
