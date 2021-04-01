<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>

    <div v-show="(!loading && (objInfo === null ))">
      <divider style="margin-top:50px;">暂无数据</divider>
    </div>
    <group v-if="objInfo !== null" gutter="0">
      <cell title='学期名称' :value="objInfo.XQMC" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe609;</span>
      </cell>
      <cell title='学年度' :value="objInfo.XND" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe609;</span>
      </cell>
      <cell title='评语类型' :value="objInfo.CommentTypeStr" >
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe609;</span>
      </cell>
      <cell title='品德等第'>
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe609;</span>
        <div class="badge-value" slot="content" style="text-align:left;"></div>
        <badge :text="`${objInfo.PDDD}`" style="padding:5px;" slot="value"></badge>
      </cell>

    </group>
    <group title='评语内容' v-if="objInfo !== null ">
      <cell >
        <div slot="after-title" style="color:#555;">{{objInfo.PYNR}}</div>
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
  name: "moralDetail",
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
      let d = await this.QD.getData('/School/StuClient/MoralDetail', {id: this.id})
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
      loading: true,
      objInfo: null,
      xqid: null

    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  }
}
</script>
