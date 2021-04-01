<template>
  <div class="courselst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <scroller lock-x height="-52" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group>
          <cell :link="{path:'/communityapplydetail', query:{id: x.ID}}" v-for="(x, index) in lst" :key="index">
            <div slot="after-title" class="sizebox communityLst">
              <div :class="`thumb-texticon bg${x.iconbg}`">{{x.Name.substr(x.Name.length-2,2)}}</div>{{x.Name}}
            </div>
            <span slot="value" class="communityLst">指导老师：{{ x.TeacherName }}<br/> 负责人：{{x.FzrName}}</span>
          </cell>
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
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Badge from 'vux/src/components/badge/index.vue'
  import VueRouter from 'vue-router'

  export default {
    name: "communityApply",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      Cell,
      Group,
      Loading,
      Divider,
      Badge,
      VueRouter
    },
    methods: {
      onScroll () {
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
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
      async getList (stuId) {
        let d = await this.QD.getData('/School/StuClient/StudentCommunityEnrollList', { XH: stuId })
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.lst = d
        for (let i = 0; i < d.length; i++) {
          let n = d[i];
          this.lst[i].iconbg = parseInt(this.QD.getHashCode(n.Name, true)) % 12;
        }
        this.loading = false
        console.log(this.lst);
        // this.QD.alert(`获取数据成功`)
      }
    },
    created () {
      this.getList(this.QD.getLocalUserinfo().stuObj.XH);
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
  .communityLst{
    font-size: 14px;
    overflow: hidden;
  }
  .sizebox div{
    display: inline-block;
    height: 50px;
    width: 50px;
    text-align: center;
    line-height: 50px;
    margin-right: 10px;
  }
</style>
