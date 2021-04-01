<template>
  <div class="courselst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <smst @on-load="onLoad" @on-hide="onHide" :showName="true" ></smst>
    <div v-show="(!loading && (lst.length === 0))">
      <divider style="margin-top:50px;">暂无数据</divider>
    </div>

    <group>
      <div v-for="(x, key) in lst" class="weui-cell weui-cell_access"  @click="onClick({path: '/attenddetail', query:{xqid: xqid, month: parseInt(key)}})">
        <div class="weui-cell__hd" style="text-align:left;font-size:14px;">
          <span class="demo-icon" slot="icon" style="color:#d9534f;">&#xe65c;</span> {{key}}月份
        </div>
        <div class="vux-cell-bd vux-cell-primary">
          <!--<div style="padding:10px 20px;"></div>-->
        </div>
        <div class="weui-cell__ft">
          <span class="attend-title">
            <span v-for="(y, k2) in x" v-if="y.Category > 1 && y.Category < 64">
              {{y.CategoryName}}<span v-if="y.Times > 0" class="hasattend">{{y.Times}}</span><span v-if="y.Times === 0">0</span>
            </span>
          </span>
        </div>
      </div>
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
import Smst from './Smst.vue'

export default {
  name: "attendLst",
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
    onLoad (e) {
      console.log("smst on load");
      console.log(e);
      e && e.XQID && this.getList(e.XQID);
      this.currentXQData = e;
    },
    onHide (t, e) {
      console.log("smst on hide")
      console.log(e)
      if (t === true && e && e.XQID) {
        this.loading = true;
        this.getList(e.XQID);
        this.currentXQData = e;
      }
    },
    async getList (xqid) {
      let d = await this.QD.getData('/School/StuClient/AttendList', {xqid: xqid})
      if (d.status && d.status === "error") {
        this.QD.alert(`获取数据失败:${d.msg}`)
      }
      this.lst = d;
      this.xqid = xqid
      this.loading = false
      // this.QD.alert(`获取数据成功`)
    },
    onClick (lnk) {
        // 存当前的学期信息
      let arr = JSON.stringify(this.currentXQData);
      sessionStorage.setItem("attendXqData", arr);
      this.QD.go(lnk, this.$router);
    }
  },
  created () {
  },
  data () {
    return {
      percent1: 30,
      loading: true,
      lst: [],
      xqid: 0,
      currentXQData: [] // 开始加载时的学期数据
    }
  },
  computed: {
  }
}
</script>

<style scoped>
  .attend-title{
    font-size:12px;
    color: #555;
  }
  .hasattend{
    color: red;
  }
</style>
