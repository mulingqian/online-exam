<template>
  <div class="scholarlst ">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <ex-scroller v-model="lst" :onGetList="getList">
      <group>
        <cell class="backgth">
          <span slot="after-title" class="scholarLst">奖学金名称</span>
          <span slot="after-title" class="scholarLst">学期</span>
        </cell>
        <div v-for="(x, index) in lst" :key="index">
          <cell  :link="{path:'/scholarshipdetail', query:{id: x.ID}}"   v-bind:class="(index + 1) % 2 === 0 ? 'backg' : ''">
            <span slot="after-title" class="scholarLst scholar-size" >{{x.Name}}</span>
            <span slot="after-title" class="scholarLst scholar-size">{{x.SmstName}}</span>
          </cell>
        </div>
      </group>
    </ex-scroller>
  </div>
</template>

<script>
  // import {Cell, Group, XProgress, Loading, Divider, TransferDom} from 'vux'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import ExScroller from './common/ExScroller.vue'
  import VueRouter from 'vue-router'

  export default {
    name: "scholarlst",
    directives: {
      TransferDom
    },
    components: {
      Cell,
      Group,
      ExScroller,
      Loading,
      Divider,
      VueRouter
    },
    methods: {
      // 根据页码和每页显示奖学金个数来获取到奖学金
      async getList (index, size) {
        let d = await this.QD.getData('/School/StuClient/ScholarshipList', { pageIndex: index, pageSize: size })
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        return d;
      }
    },
    created () {
    },
    data () {
      return {
        loading: false,
        lst: []
      }
    },
    computed: {
    },
    watched: {

    }
  }
</script>

<style scoped>
  .failed .weui-progress__inner-bar{
    background-color:red;
  }
  .xs-plugin-pullup-up,
  .xs-plugin-pullup-down {
    line-height: 30px;
  }
  .backgth {
    background-color: #eee;
  }
  .backg{
    background-color: #f8f7f7;
  }
  .scholarLst{
    display: inline-block;
    width: 50%;
    text-align: center;
  }
  .scholar-size{
    font-size: 14px;
  }
</style>
