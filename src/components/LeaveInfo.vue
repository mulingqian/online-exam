<template>
  <div class="courselst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <scroller lock-x height="-150" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group>
          <div v-for="obj in lst">
            <cell
              is-link
              :border-intent="false"
              :arrow-direction="showContent ? 'up' : 'down'"
              @click.native="showContent = !showContent">
              <span slot="after-title" class="xmxh">{{ obj.XM }}</span>
              <span slot="inline-desc"><badge :text="obj.XH" class="bg-badge"></badge></span>
              <span slot="value" class="stumess"> {{obj.NJMC}} {{obj.ZYMC}} {{obj.BJMC}}</span>
            </cell>
            <template v-if="showContent">
              <cell class="ke">
                <span slot="after-title" v-bind:class="obj.Cwk ? 'passke': 'failke'">财务科</span>
                <span slot="value"><span v-if="obj.Cwk === true" class="demo-icon1">&#xe6ea;</span></span>
              </cell>
              <cell class="ke">
                <span slot="after-title" v-bind:class="obj.Sbk ? 'passke': 'failke'">设备科</span>
                <span slot="value"><span v-if="obj.Sbk === true" class="demo-icon1">&#xe6ea;</span> </span>
              </cell>
              <cell class="ke">
                <span slot="after-title" v-bind:class="obj.Zwk ? 'passke': 'failke'">总务科</span>
                <span slot="value"><span v-if="obj.Zwk === true" class="demo-icon1">&#xe6ea;</span></span>
              </cell>
              <cell class="ke">
                <span slot="after-title" v-bind:class="obj.Tsg ? 'passke': 'failke'">图书馆</span>
                <span slot="value"><span v-if="obj.Tsg === true" class="demo-icon1">&#xe6ea;</span></span>
              </cell>
              <cell class="ke">
                <span slot="after-title" v-bind:class="obj.Tyg ? 'passke': 'failke'">体育馆</span>
                <span slot="value"><span v-if="obj.Tyg === true" class="demo-icon1">&#xe6ea;</span></span>
              </cell>
              <cell class="ke">
                <span slot="after-title" v-bind:class="obj.Xsk ? 'passke': 'failke'">学生科</span>
                <span slot="value"><span v-if="obj.Xsk === true" class="demo-icon1">&#xe6ea;</span></span>
              </cell>
              <cell class="ke">
                <span slot="after-title" v-bind:class="obj.Jwk ? 'passke': 'failke'">教务科</span>
                <span slot="value"><span v-if="obj.Jwk === true" class="demo-icon1">&#xe6ea;</span></span>
              </cell>
            </template>
          </div>
        </group>
      </div>
    </scroller>
  </div>
</template>

<script>
  // import {Cell, Group, XProgress, Loading, Divider, TransferDom} from 'vux'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XProgress from 'vux/src/components/x-progress/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Badge from 'vux/src/components/badge/index.vue'
  import Smst from './Smst.vue'

  export default {
    name: "leaveInfo",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      Cell,
      Group,
      Smst,
      Loading,
      XProgress,
      Badge,
      Divider
    },
    methods: {
      onScroll () {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs.scroller.reset()
          })
        }, 2000)
      },
      onLoad (e) {
        console.log("smst on load")
        console.log(e)
        e && e.XQID && this.getList(e.XQID)
      },
      onHide (t, e) {
        console.log("smst on hide")
        console.log(e)
        if (t === true && e && e.XQID) {
          this.loading = true
          this.getList(e.XQID)
        }
      },
      async getList () {
        let d = await this.QD.getData('/School/StuClient/StudentLeaveSchoolDetail', {XH: this.stuId})
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.lst = d
        console.log(this.lst);
        this.loading = false
        // this.QD.alert(`获取数据成功`)
      }
    },
    created () {
      this.stuId = this.QD.getLocalUserinfo().stuObj.XH;
      console.log(this.stuId);
      this.getList();
    },
    data () {
      return {
        stuId: null,
        percent1: 30,
        loading: false,
        lst: [],
        showContent: true,
        currentXQ: null
      }
    },
    computed: {
    }
  }
</script>

<style scoped>
  .scoreval{
    color: #428bca
  }
  .failed .scoreval{
    color:red;
  }
</style>
<style>
  .failed .weui-progress__inner-bar{
    background-color:red;
  }
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
  .ke span{
    font-size: 16px;
    text-align: center;
  }
  .passke{
    color: #10aeff;
  }
  .failke{
    color: #c5c5c5;
  }
</style>
