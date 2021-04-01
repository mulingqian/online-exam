<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <scroller lock-x height="-52" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group v-if="!!objInfo" label-width="5em">
          <cell>
            <span slot="after-title">社团名称</span>
            <span slot="value" class="valuesize">{{ objInfo.Name }}</span>
          </cell>
          <cell class="signin" :link="{path:'/communitysignin', query:{id: objInfo.ID}}" v-if="objInfo.FzrXH === xh" >
            <span slot="icon" class="demo-icon">&#xe65f;</span>
            <span slot="after-title">活动签到</span>
          </cell>
          <cell class="signin" :link="{path:'/communitysigninlst', query:{id: objInfo.ID}}" >
            <span slot="icon" class="demo-icon">&#xe718;</span>
            <span slot="after-title">签到记录</span>
          </cell>
          <cell>
            <span slot="after-title">活动场地</span>
            <span slot="value" class="valuesize">{{ objInfo.ActivePlace }}</span>
          </cell>
          <cell>
            <span slot="after-title">活动时间</span>
            <span slot="value" class="valuesize">{{ objInfo.ActiveDate }}</span>
          </cell>
          <cell>
            <span slot="after-title">指导教师</span>
            <span slot="value" class="valuesize">{{ objInfo.TeacherName }}</span>
          </cell>
          <cell>
            <span slot="after-title">负责人</span>
            <span slot="value" class="valuesize">{{ objInfo.FzrName }}</span>
          </cell>
          <cell>
            <span slot="after-title">允许招募人数</span>
            <span slot="value" class="valuesize">{{ objInfo.AllowedNumber }}</span>
          </cell>
          <cell title="社团简介">
            <span slot="value" class="valuesize">{{ objInfo.ClubJJ }}</span>
          </cell>
          <cell title="社团公告">
            <span slot="value" class="valuesize">{{ objInfo.Notice }}</span>
          </cell>
          <cell
            title="社团成员"
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
      </div>
    </scroller>
  </div>
</template>

<script>
  // import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import Badge from 'vux/src/components/badge/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'

  export default {
    name: "communitydetail",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      Badge,
      Cell,
      Group,
      Loading,
      Divider
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.scroller.reset({top: 0})
      })
    },
    methods: {
      onScroll () {
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
      },
      async getDetail () {
        let d = await this.QD.getData('/School/StuClient/StudentCommunityDetail', {ID: parseInt(this.id)})
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.objInfo = d;
        this.students = d.Students;
        this.loading = false
        // this.QD.alert(`获取数据成功`)
      }
    },
    created () {
      console.log(this.$route.query)
      console.log(this.xh);
      this.getDetail()
    },
    data () {
      return {
        percent1: 30,
        loading: true,
        showContent: false,
        objInfo: {},
        students: []
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
  .signin{
    color: #428bca;

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
  .valuesize{
    font-size: 15px;
  }
</style>

