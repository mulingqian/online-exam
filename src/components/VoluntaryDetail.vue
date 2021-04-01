<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <scroller lock-x height="-50" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group label-width="5em">
          <cell>
            <span slot="after-title">项目名称</span>
            <span slot="value" class="valuesize">{{ objInfo.Name }}</span>
          </cell>
          <cell class="signin" :link="{path:'/voluntarysignin', query:{id: objInfo.ID}}" v-if="objInfo.FzrXH === xh" >
            <span slot="icon" class="demo-icon">&#xe65f;</span>
            <span slot="after-title">活动签到</span>
          </cell>
          <cell class="signin" :link="{path:'/voluntarysigninlst', query:{id: objInfo.ID}}" >
            <span slot="icon" class="demo-icon">&#xe718;</span>
            <span slot="after-title">签到记录</span>
          </cell>
          <cell>
            <span slot="after-title">项目地点</span>
            <span slot="value" class="valuesize">{{ objInfo.Place }}</span>
          </cell>
          <cell>
            <span slot="after-title">项目负责人</span>
            <span slot="value" class="valuesize">{{ objInfo.FzrName }}</span>
          </cell>
          <cell>
            <span slot="after-title">是否允许报名</span>
            <span slot="value" class="valuesize">{{ objInfo.IsAllowedEnroll }}</span>
          </cell>
          <cell>
            <span slot="after-title">报名状态</span>
            <span slot="value" class="valuesize">{{ statics }}</span>
          </cell>
          <cell>
            <span slot="after-title">人数</span>
            <span slot="value" class="valuesize">{{ objInfo.StuNum}}</span>
          </cell>
          <cell
            title="志愿者计划"
            is-link
            :border-intent="false"
            :arrow-direction="showPlan ? 'up' : 'down'"
            @click.native="showPlan = !showPlan"></cell>
          <p class="slide" :class="showPlan?'animate':''">{{!objInfo.VoluntaryPlan || objInfo.VoluntaryPlan == "" ? "-- 无 --" : objInfo.VoluntaryPlan}}</p>

          <cell title="项目简介">
            <span slot="value" class="valuesize">{{ objInfo.Summary }}</span>
          </cell>
          <cell title="公告">
            <span slot="value" class="valuesize">{{ objInfo.Notice }}</span>
          </cell>
          <cell
            title="志愿者成员"
            is-link
            :border-intent="false"
            :arrow-direction="showContent ? 'up' : 'down'"
            @click.native="showContent = !showContent"></cell>

          <template v-if="showContent" v-for="obj in students">
            <cell :border-intent="false">
          <span slot="after-title" class="xmxh">{{ obj.XM }}
          <span v-if="obj.XB === '男'" class="demo-icon1">&#xe6d5;</span>
          <span v-if="obj.XB === '女'" class="demo-icon2">&#xe79f;</span>
          </span>
              <span slot="inline-desc"><badge :text="obj.XH" class="bg-badge"></badge></span>
              <span slot="value" class="stumess"> {{obj.NJMC}} {{obj.ZYMC}} {{obj.BJMC}}</span>
            </cell>
          </template>
        </group>
        <div style="padding:10px;">
          <x-button type="warn" @click.native="doApply()" v-if="this.statics === '未报名'">我要报名</x-button>
          <x-button type="warn" v-if="this.statics === '已报名'" disabled>正在审核中</x-button>
          <span v-if="this.statics === '审核通过'" class="success">报名成功</span>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  // import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import CellBox from 'vux/src/components/cell-box/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Badge from 'vux/src/components/badge/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'

  export default {
    name: "voluntaryDetail",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      Cell,
      CellBox,
      Group,
      Loading,
      Badge,
      XButton
    },
    methods: {
      onScroll () {
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
      },
      async doApply () {
        let stuid = this.QD.getLocalUserinfo().stuObj.XH;
        let d = await this.QD.getData('/School/StuClient/StudentVoluntaryApply', { ID: parseInt(this.id), XH: stuid });
        console.log(d);
        if (d.status === 'success') {
          this.QD.alert("报名成功!")
          this.statics = "已报名";
        }
      },
      async getDetail () {
        console.log(this.id);
        let stuid = this.QD.getLocalUserinfo().stuObj.XH;
        let d = await this.QD.getData('/School/StuClient/VoluntaryServiceDetailStudent', {ID: parseInt(this.id)})
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.objInfo = d
        this.students = d.Students;
        if (d.Students.length === 0) {
          this.statics = '未报名';
        } else {
          for (let i = 0; i < this.students.length; i++) {
            if (stuid === this.students[i].XH) {
              this.statics = this.students[i].Status;
            } else {
              this.statics = "未报名";
            }
          }
        }
        console.log(this.statics);
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
        objInfo: {},
        students: [],
        showContent: false,
        showPlan: false,
        statics: null
      }
    },
    computed: {
      id () {
        return this.$route.query.id
      },
      type () {
        return this.$route.query.type
      },
      xh () {
        return this.QD.getLocalUserinfo().stuObj.XH;
      }
    }
  }
</script>
<style scoped>
  .demo-icon1{
    font-family: 'wxiconfont';
    font-size: 10px;
    color: #10aeff;
    padding-right: 10px;
  }
  .demo-icon2{
    font-family: 'wxiconfont';
    font-size: 10px;
    color: #ff7367;
    padding-right: 10px;
  }
  .xmxh{
    font-weight: normal;
    font-size: 15px;
  }
  .bg-badge{
    background-color: #56dd67;
  }
  .stumess{
    font-size: 14px;
  }
  .valuesize{
    font-size: 15px;
  }
  .btn-orange{
    background-color: #e47836;
  }
  .warn-message{
    display: block;
    font-size: 16px;
    color: red;
  }
  .weui-cells .warn-message:after {
    display: none;
  }
  .success {
    display: block;
    width: 70%;
    height: 40px;
    line-height: 40px;
    background-color: #27d1bf;
    border-radius: 4px;
    text-align: center;
    color: white;
    margin: 0 auto;
  }
  .slide {
    padding: 0 20px;
    overflow: hidden;
    max-height: 0;
    color: #555;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
  }
  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
</style>

