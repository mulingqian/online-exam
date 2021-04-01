<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <scroller lock-x height="-102" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group v-if="!!objInfo" >
          <cell>
            <span slot="after-title">{{ objInfo.Name }}</span>
            <span slot="value" class="valuesize">{{ datatimes }}</span>
          </cell>
        </group>
        <group title="小螺钉志愿者签到记录" v-if="!!objInfo" >
          <cell  v-for="(obj, index) in students" :key="index"  :border-intent="false">
            <span slot="after-title" class="xmxh">{{ obj.XM }}
              <span v-if="obj.XB === '男'" class="demo-icon sex-nan">&#xe6d5;</span>
              <span v-if="obj.XB === '女'" class="demo-icon sex-nv">&#xe79f;</span>
            </span>
            <span slot="inline-desc">
              <badge :text="obj.XH" class="bg-badge1"></badge><br/>
              <badge :text="obj.NJMC + '' + obj.ZYMC" class="bg-badge2"></badge>
            </span>
            <span slot="value" class="stumess">
              <span v-on:click="doSign(objInfo.ID, obj.XH)">
                <x-button mini plain :class="obj.sign ? 'btn-qd' : 'btn-in'">
                  <span class="demo-icon">&#xe718;</span>签到
                </x-button>
              </span>
            </span>
          </cell>
        </group>
      </div>
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
  import XButton from 'vux/src/components/x-button/index.vue'

  export default {
    name: "voluntarySignin",
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
      Card,
      XButton
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
      // 小螺钉志愿者成员签到
      async doSign (ParentId, XH) {
        let sign;
        for (let i = 0; i < this.students.length; i++) {
          if (XH === this.students[i].XH) {
            if (this.students[i].sign === undefined) {
              this.students[i].sign = true;
            } else {
              this.students[i].sign = !this.students[i].sign
            }
            sign = this.students[i].sign;
            this.$set(this.students, i, this.students[i]);
          }
        }
        let Details = '[{"XH":"' + XH + '","ParentId":"' + ParentId + '","Sign": ' + sign + ',"SignDate":"' + this.datatimes + '","SignRemark":"签到"}]';
        let d = await this.QD.getData('/School/StuClient/InsertVoluntaryAttendance', {entityJson: Details});
        console.log(d.status);
      },
      async getDetail () {
        let d = await this.QD.getData('/School/StuClient/VoluntaryServiceDetailStudent', {ID: parseInt(this.id)})
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.objInfo = d;
        this.students = d.Students;
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDate();
        this.datatimes = year + '-' + month + '-' + day;
        let w = await this.QD.getData('/School/StuClient/StudentVoluntaryAttendanceData', { ParentId: parseInt(d.ID), CreateDate: this.datatimes })
        console.log(w);
        for (let j = 0; j < w.length; j++) {
          for (let i = 0; i < this.students.length; i++) {
            if (this.students[i].XH === w[j].XH) {
              this.students[i].sign = w[j].Sign;
            }
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
        percent1: 30,
        loading: true,
        showContent: false,
        objInfo: {},
        students: [],
        datatimes: ''
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
  .sex-nan {
    font-size: 10px;
    color: #41a0fe;
  }
  .sex-nv{
    font-size: 10px;
    color: #ff7367;
  }
  .btn-in {
    color: #aaa;
    border-color: #aaa;
  }
  .btn-in span{
    font-size: 14px;
    color: #aaa;
  }
  .btn-qd {
    color: #10aeff;
    border-color: #10aeff;
  }
  .btn-qd span{
    font-size: 14px;
    color: #10aeff;
  }
  .xmxh{
    font-weight: normal;
    font-size: 15px;
  }
  .bg-badge1{
    background-color: #56dd67;
  }
  .bg-badge2{
    background-color: #5cc3ff;
  }
  .stumess{
    font-size: 14px;
  }
  .valuesize{
    font-size: 15px;
  }
</style>
