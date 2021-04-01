<template>
  <div class="courselst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-show="(!loading && (lst === null || lst.length === 0))">
      <divider style="margin-top:50px;">暂无班级可管理</divider>
    </div>
    <scroller lock-x height="-102" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group>
          <cell :link="{path:'/morningcheckadddetail', query:{id: x.BJID, bjmc:x.BJMC, bjdm: x.BJDM}}" v-for="(x, index) in lst" :key="index">
            <div slot="after-title" class="sizebox communityLst">
              <div :class="`thumb-texticon bg${x.iconbg}`">{{x.BJDM}}</div>{{x.BJMC}}
            </div>
            <span slot="value" class="communityLst">点击晨检</span>
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
  import Divider from 'vux/src/components/divider/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'

  export default {
    name: "morningCheckAdd",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      Cell,
      Divider,
      Group,
      Loading
    },
    methods: {
      onScroll () {
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
      },
      async getList () {
        let d = await this.QD.getData('/School/StuClient/ClassMasterClassList', { zgh: this.userInfo.ZGH });
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.lst = d
        for (let i = 0; i < d.length; i++) {
          let n = d[i];
          this.lst[i].iconbg = parseInt(this.QD.getHashCode(n.BJDM, true)) % 12;
        }
        this.loading = false
        console.log(this.lst);
        // this.QD.alert(`获取数据成功`)
      }
    },
    created () {
      this.getList();
    },
    data () {
      return {
        loading: true,
        userInfo: this.QD.getLocalUserinfo().stuObj,
        lst: []
      }
    },
    computed: {
    }
  }
</script>
<style scoped>
  .failed .scoreval{
    color:red;
  }
  .failed .weui-progress__inner-bar{
    background-color:red;
  }
  .communityLst{
    font-size: 14px;
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
