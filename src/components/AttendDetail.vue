<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>

    <divider>{{month}}月考勤</divider>
    <card :header="{title:'考勤概况'}">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-l vux-1px-r">
          <span>{{stats.s2.val}}</span>
          <br/><span class="demo-icon" slot="icon" style="color:#d9534f;font-size:14px;padding-right:5px;">&#xe60b;</span>{{stats.s2.name}}
        </div>
        <div class="vux-1px-r">
          <span>{{stats.s4.val}}</span>
          <br/><span class="demo-icon" slot="icon" style="color:#d9534f;font-size:14px;padding-right:5px;">&#xe60f;</span>{{stats.s4.name}}
        </div>
        <div class="vux-1px-r">
          <span>{{stats.s8.val}}</span>
          <br/><span class="demo-icon" slot="icon" style="color:#d9534f;font-size:14px;padding-right:5px;">&#xe624;</span>{{stats.s8.name}}
        </div>
        <div class="vux-1px-r">
          <span>{{stats.s16.val}}</span>
          <br/><span class="demo-icon" slot="icon" style="color:#d9534f;font-size:14px;padding-right:5px;">&#xe62f;</span>{{stats.s16.name}}
        </div>
        <div>
          <span>{{stats.s32.val}}</span>
          <br/><span class="demo-icon" slot="icon" style="color:#d9534f;font-size:14px;padding-right:5px;">&#xe611;</span>{{stats.s32.name}}
        </div>
      </div>
    </card>
    <div v-show="(!loading && (objInfo === null || objInfo.length === 0))">
      <divider style="margin-top:50px;">暂无数据</divider>
    </div>
    <group title="考勤记录" v-if="objInfo !== null && objInfo.length > 0">
      <cell v-for="(x, index) in objInfo" :key="index" :title='x.TeachDay' :inlineDesc="`${x.KCMC} - ${x.Teacher}`" >
        <div class="badge-value" slot="value">
          <badge :text="`${x.CategoryName}`"></badge>
        </div>
        <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe65c;</span>
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
  name: "attenddetail",
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
      let d = await this.QD.getData('/School/StuClient/AttendDetail', {xqid: this.xqid, month: this.month})
      console.log(d)
      if (d.status && d.status === "error") {
        this.QD.alert(`获取数据失败:${d.msg}`)
      }
      this.objInfo = d
      for (let s in d) {
        if (d[s].Category > 1 && d[s].Category < 64) {
          this.stats[`s${d[s].Category}`].val += 1
        }
      }
      this.loading = false
      // this.QD.alert(`获取数据成功`)
    }
  },
  created () {
    console.log(this.$route.query)
    this.xqid = this.$route.query.xqid
    this.month = this.$route.query.month
    this.getDetail()
  },
  data () {
    return {
      percent1: 30,
      loading: true,
      objInfo: null,
      xqid: null,
      month: null,
      stats: {
        s2: {name: "迟到", val: 0},
        s4: {name: "早退", val: 0},
        s8: {name: "旷课", val: 0},
        s16: {name: "事假", val: 0},
        s32: {name: "病假", val: 0}
      }   // 迟到2，早退4，旷课8，事假16，病假32
    }
  },
  computed: {
  }
}
</script>
<style scoped lang="less">
  @import '~vux/src/styles/1px.less';
  .card-demo-flex {
    display: flex;
  }
  .card-demo-content01 {
    padding: 10px 0;
  }
  .card-padding {
    padding: 15px;
  }
  .card-demo-flex > div {
    flex: 1;
    text-align: center;
    font-size: 12px;
  }
  .card-demo-flex span {
    color: #f74c31;
  }
</style>
