<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="headmess">
      <span>{{ Names }}</span>
      <span> {{ SmstName }} </span>
    </div>

    <scroller lock-x height="-100" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom">
      <group>
        <cell v-for="(x, index) in files" :key="index">
          <span slot="icon" v-if="x.FileName.split('.')[1] === 'doc'" class="demo-wx-icon">&#xe63c;</span>
          <span slot="icon" v-else-if="x.FileName.split('.')[1] === 'txt'" class="demo-wx-icon">&#xe69d;</span>
          <span slot="icon" v-else-if="x.FileName.split('.')[1] === 'xls'" class="demo-wx-icon">&#xe631;</span>
          <span slot="icon" v-else-if="x.FileName.split('.')[1] === 'pdf'" class="demo-wx-icon">&#xe638;</span>
          <span slot="icon" v-else="x.FileName.split('.')[1]" class="demo-wx-icon">&#xe604;</span>
          <a slot="after-title" :download="x.FileName.split('.')[0]" v-on:click="test(x.FilePath)">{{x.FileName}}</a>
        </cell>
      </group>
    </scroller>
  </div>
</template>

<script>
// import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
import Scroller from 'vux/src/components/scroller/index.vue'
import Cell from 'vux/src/components/cell/index.vue'
import Group from 'vux/src/components/group/index.vue'
import Loading from 'vux/src/components/loading/index.vue'
import Divider from 'vux/src/components/divider/index.vue'
import TransferDom from 'vux/src/directives/transfer-dom/index.js'
import Badge from 'vux/src/components/badge/index.vue'
import Card from 'vux/src/components/card/index.vue'

export default {
  name: "scholarshipDetail",
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
    Card
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({top: 0})
    })
  },
  methods: {
    onScrollBottom () {
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset()
      })
    },
    test (url) {
      location.href = url;
    },
    async getDetail () {
      let d = await this.QD.getData('/School/StuClient/ScholarshipDetail', {id: parseInt(this.id)})
      console.log(d[0])
      if (d.status && d.status === "error") {
        this.QD.alert(`获取数据失败:${d.msg}`)
      }
      this.Names = d[0].Name;
      this.SmstName = d[0].SmstName;
      this.files = d[0].Files;
      console.log(this.files);
      this.loading = false;
      // this.QD.alert(`获取数据成功`)
    }
  },
  created () {
    console.log(this.$route.query.id)
    this.getDetail();
  },
  data () {
    return {
      loading: true,
      Names: null,
      SmstName: null,
      files: null
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
<style scoped>

  .headmess{
    overflow: hidden;
    z-index: 10000;
  }
  .headmess span{
    display: inline-block;
    float: left;
    width: 50%;
    text-align: center;
    height: 50px;
    line-height: 50px;
    background-color: #eee;
    font-size: 15px;
  }
  .headmess span:nth-child(2){
    font-size: 14px;
  }
</style>
