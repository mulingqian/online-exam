<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>

    <divider v-if="type === 1">学生奖励</divider>
    <divider v-if="type === 2">学生处分</divider>

    <div v-show="(!loading && (objInfo === null))">
      <divider style="margin-top:50px;">暂无数据</divider>
    </div>
    <group title="" v-if="objInfo !== null && type === 1">
      <cell title='学期名称' :value="objInfo.XQMC" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe60a;</span>
      </cell>
      <cell title='奖励日期' :value="objInfo.JLRQ" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe60a;</span>
      </cell>
      <cell title='奖励名称' :value="objInfo.JLMC" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe60a;</span>
      </cell>
      <cell title='颁奖单位' :value="objInfo.BJDW" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe60a;</span>
      </cell>
      <cell title='奖励金额' :value="objInfo.JLJE" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe60a;</span>
      </cell>
      <cell title='奖励文号' :value="objInfo.JLWH" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe60a;</span>
      </cell>
      <cell title='奖励加分' :value="objInfo.AddScore" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe60a;</span>
      </cell>
      <cell title='奖励原因' :value="objInfo.JLYY" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe60a;</span>
      </cell>
    </group>
    <group title="" v-if="objInfo !== null && type === 2">
      <cell title='学期名称' :value="objInfo.XQMC" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe640;</span>
      </cell>
      <cell title='处分日期' :value="objInfo.CFRQ" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe640;</span>
      </cell>
      <cell title='处分名称' :value="objInfo.CFMC" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe640;</span>
      </cell>
      <cell title='处分文号' :value="objInfo.CFWH" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe640;</span>
      </cell>
      <cell title='撤销日期' :value="objInfo.CXRQ" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe640;</span>
      </cell>
      <cell title='撤销文号' :value="objInfo.CXWH" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe640;</span>
      </cell>
      <cell title='处分减分' :value="objInfo.SubScore" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe640;</span>
      </cell>
      <cell title='处分原因' :value="objInfo.CFYY" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe640;</span>
      </cell>
    </group>
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
  name: "awarddetail",
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
      let d = await this.QD.getData('/School/StuClient/AwardDetail', {id: this.id, type: this.type})
      console.log(d)
      if (d.status && d.status === "error") {
        this.QD.alert(`获取数据失败:${d.msg}`)
      }
      this.objInfo = d
      this.loading = false
      // this.QD.alert(`获取数据成功`)
    }
  },
  created () {
    console.log(this.$route.query)
    this.getDetail()
  },
  data () {
    return {
      percent1: 30,
      loading: true,
      objInfo: null
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    type () {
      return this.$route.query.type
    }
  }
}
</script>

