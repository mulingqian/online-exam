<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <scroller lock-x height="-102" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group v-if="!!objInfo" >
          <cell>
            <span slot="after-title">项目名称</span>
            <span slot="value" class="valuesize">{{ objInfo.Name }}</span>
          </cell>
        </group>
      </div>
      <div class="shaft">
        <timeline>
          <timeline-item v-for="(x, index) in recordSign" :key="index">
            <h4 class="recent">{{x.SignRemark}}</h4>
            <p class="recent">{{x.SignDate}}</p>
          </timeline-item>
        </timeline>
      </div>
    </scroller>
  </div>
</template>

<script>
  // import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
  import { Timeline, TimelineItem } from 'vux'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
//  import Timeline from 'vux/src/components/timeline/index.vue'

  export default {
    name: "voluntarySigninLst",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      Timeline,
      TimelineItem,
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
        let d = await this.QD.getData('/School/StuClient/VoluntaryServiceDetailStudent', {ID: parseInt(this.id)})
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.objInfo = d;
        this.students = d.Students;
        let w = await this.QD.getData('/School/StuClient/StudentVoluntaryAttendanceDetailData', {ID: parseInt(this.id), XH: this.xh})
        console.log(w);
        for (let i = 0; i < w.length; i++) {
          if (w[i].Sign) {
            this.recordSign.push(w[i]);
          }
        }
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
        loading: true,
        objInfo: {},
        students: [],
        recordSign: []
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
  .valuesize{
    font-size: 15px;
  }
  p {
    color: #888;
    font-size: 0.8rem;
  }
  h4 {
    color: #666;
    font-weight: normal;
  }
  .recent {
    color: #10aeff;
  }
  .shaft{
    width: 50%;
    margin: 0 auto;
  }
</style>

