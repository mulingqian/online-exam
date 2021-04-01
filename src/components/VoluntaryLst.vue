<template>
  <div class="courselst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <tab>
      <tab-item selected @on-item-click="changeType(0)"><span class="demo-icon"  style="font-size:22px;line-height: 32px;"   >&#xe6a0;</span> 我参与的</tab-item>
      <tab-item @on-item-click="changeType(1)"><span class="demo-icon" style="font-size:26px;line-height: 32px;">&#xe663;</span> 我要报名</tab-item>
    </tab>
    <ex-scroller v-model="lst1" :onGetList="getList1" v-show="showScroller">
      <group>
        <cell :link="{path:'/voluntarydetail', query:{id: x.ID}}" v-for="(x, index) in lst1" :key="index">
          <span slot="after-title" class="communityLst sizebox">
            <div :class="`thumb-texticon bg${x.iconbg}`">{{x.Name.substr(x.Name.length-2,2)}}</div>{{ x.Name }}
          </span>
          <span slot="value" class="communityLst">负责人：{{x.FzrName}}<br/>人数：{{x.StuNum}}  </span>
        </cell>
      </group>
    </ex-scroller>
    <ex-scroller v-model="lst2" :onGetList="getList2" v-show="!showScroller">
      <group>
        <cell :link="{path:'/voluntarydetail', query:{id: x.ID}}" v-for="(x, index) in lst2" :key="index">
          <span slot="after-title" class="communityLst sizebox">
            <div :class="`thumb-texticon bg${x.iconbg}`">{{x.Name.substr(x.Name.length-2,2)}}</div>{{ x.Name }}
          </span>
          <span slot="value" class="communityLst">负责人：{{x.FzrName}}<br/>人数：{{x.StuNum}}  </span>
        </cell>
      </group>
    </ex-scroller>
  </div>
</template>
<script>
  // import {Cell, Group, XProgress, Loading, Divider, TransferDom} from 'vux'
  import ExScroller from './common/ExScroller.vue'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'

  export default {
    name: "voluntaryLst",
    directives: {
      TransferDom
    },
    components: {
      ExScroller,
      Tab,
      TabItem,
      Cell,
      Group,
      Loading
    },
    methods: {
      changeType (type) {
        this.type = type;
        this.showScroller = this.type === 0;
      },
      async getList1 (index, size) {
        console.log(this.type);
        let d = await this.QD.getData('/School/StuClient/StudentVoluntaryList', { pageIndex: index, pageSize: size, XH: this.QD.getLocalUserinfo().stuObj.XH, VolunType: 0 })
        console.log(d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        for (let i = 0; i < d.length; i++) {
          let n = d[i];
          n.iconbg = parseInt(this.QD.getHashCode(n.Name, true)) % 12;
        }
        return d;
      },
      async getList2 (index, size) {
        console.log(this.type);
        let d = await this.QD.getData('/School/StuClient/StudentVoluntaryList', { pageIndex: index, pageSize: size, XH: this.QD.getLocalUserinfo().stuObj.XH, VolunType: 1 })
        console.log(d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        for (let i = 0; i < d.length; i++) {
          let n = d[i];
          n.iconbg = parseInt(this.QD.getHashCode(n.Name, true)) % 12;
        }
        return d;
      }
    },
    created () {
      // this.getList(this.pageSize, this.index);
    },
    data () {
      return {
        showScroller: true,
        loading: false,
        lst1: [],
        lst2: [],
        type: 0
      }
    },
    computed: {
    }
  }
</script>

<style scoped>
  .failed .weui-progress__inner-bar{
    background-color:red;
  }
  .sizebox div{
    display: inline-block;
    height: 50px;
    width: 50px;
    text-align: center;
    line-height: 50px;
    margin-right: 10px;
  }
  .failed .scoreval{
    color:red;
  }
  .communityLst {
    font-size: 15px;
  }
</style>
