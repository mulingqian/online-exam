<template>
  <div class="courselst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <tab>
      <tab-item selected @on-item-click="onItemClick(0)"><span class="demo-icon icon-award"  style="font-size:22px;line-height: 32px;"   ></span> 学生奖励</tab-item>
      <tab-item @on-item-click="onItemClick(1)"><span class="demo-icon icon-punish" style="font-size:26px;line-height: 32px;"></span> 学生处分</tab-item>
    </tab>
    <group v-show="select1" >
      <div v-show="(!loading && (!awards || awards.length === 0))">
        <divider style="margin-top:50px;">暂无数据</divider>
      </div>
      <cell v-for="(x, index) in awards"  :key="index" :is-link="true"  :inline-desc="x.XQMC" :link="{path: '/awarddetail', query:{id: x.JLID, type: 1}}">
        <div  style="color:#5bc0de;" slot="after-title">{{x.JLMC}}</div>
        <span class="scoreval" slot="value">{{x.AddScore}}</span>
      </cell>
    </group>
    <group v-show="!select1" >
      <div v-show="(!loading && (!punishes || punishes.length === 0))">
        <divider style="margin-top:50px;">暂无数据</divider>
      </div>
      <cell v-for="(x, index) in punishes"  :key="index" :is-link="true"  :inline-desc="x.XQMC"  :link="{path: '/awarddetail', query:{id: x.CFID, type: 2}}">
        <div  style="color:#5bc0de;" slot="after-title">{{x.CFMC}}</div>
        <span class="scoreval" slot="value">{{x.CFRQ}}</span>
      </cell>
    </group>
  </div>
</template>

<script>
// import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
// import {Tab, TabItem} from 'vux'
import Tab from 'vux/src/components/tab/tab.vue'
import TabItem from 'vux/src/components/tab/tab-item.vue'
import Cell from 'vux/src/components/cell/index.vue'
import Group from 'vux/src/components/group/index.vue'
import Loading from 'vux/src/components/loading/index.vue'
import Divider from 'vux/src/components/divider/index.vue'
import TransferDom from 'vux/src/directives/transfer-dom/index.js'
import Smst from './Smst.vue'

export default {
  name: "awardLst",
  directives: {
    TransferDom
  },
  components: {
    Cell,
    Group,
    Smst,
    Loading,
    Divider,
    Tab,
    TabItem
  },
  methods: {
    onItemClick (idx) {
      this.getList(idx)
    },
    async getList (idx) {
      this.loading = true

      let url = idx === 0 ? '/School/StuClient/AwardList' : '/School/StuClient/PunishList'
      this.select1 = idx === 0
      let d = await this.QD.getData(url, {})
      console.log(d)
      if (d.status && d.status === "error") {
        this.QD.alert(`获取数据失败:${d.msg}`)
      }
      if (idx === 0) {
        this.awards = d
      } else {
        this.punishes = d
      }
      this.loading = false
      // this.QD.alert(`获取数据成功`)
    }
  },
  created () {
    this.getList(0)
  },
  data () {
    return {
      select1: true,
      loading: true,
      awards: [],
      punishes: [],
      currentXQ: null
    }
  },
  computed: {
  }
}
</script>

<style scoped>
  .failed .weui-progress__inner-bar,
  .failed .scoreval{
    color:red;
  }
  .scoreval{
    color: #428bca
  }

</style>
