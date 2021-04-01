<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastMsg" position="top"></toast>
    <scroller lock-x height="-52" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group v-if="!!objInfo" label-width="5em">
          <cell>
            <span slot="after-title">晨检日期</span>
            <span slot="value" class="valuesize">{{ objInfo.AttendDate }}</span>
          </cell>
          <cell>
            <span slot="after-title">班级名称</span>
            <span slot="value" class="valuesize">{{ objInfo.BJMC }}</span>
          </cell>

          <cell
            title="学生列表"
            is-link
            :border-intent="false"
            :arrow-direction="showContent ? 'up' : 'down'">
          </cell>

          <template v-if="showContent" v-for="obj in students">
            <cell :border-intent="false">
                <span slot="after-title" class="xmxh">{{ obj.XM }}
                  <span v-if="obj.XB === '男'" class="demo-icon1">&#xe6d5;</span>
                  <span v-if="obj.XB === '女'" class="demo-icon2">&#xe79f;</span>
                </span>
              <span slot="inline-desc"><badge :text="obj.XH" class="bg-badge"></badge></span>
              <span slot="value" class="stumess">
                <span >
                  <x-button mini plain :class='obj.Item_SJ === true || obj.Item_SJ === "1" ? "btn-in btn-sj":"btn-in"'>
                    <span class="demo-icon demo-icon13">&#xe62f;</span>请假
                  </x-button>
                </span>
                <span >
                  <x-button mini plain :class='obj.Item_BJ === true || obj.Item_BJ === "1" ? "btn-in btn-bj":"btn-in"'>
                    <span class="demo-icon demo-icon13" >&#xe611;</span>病假
                  </x-button>
                </span>
                <span >
                  <x-button mini plain :class='obj.Item_QQ === true || obj.Item_QQ === "1" ? "btn-in btn-qq":"btn-in"'>
                    <span class="demo-icon demo-icon13" >&#xe624;</span>缺勤
                  </x-button>
                </span>
              </span>
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
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import XButton from 'vux/src/components/x-button/index.vue'
  import Badge from 'vux/src/components/badge/index.vue'
  import Toast from 'vux/src/components/toast/index.vue'

  export default {
    name: "morningCheckDetail",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      Cell,
      Group,
      Loading,
      Divider,
      XButton,
      Badge,
      Toast
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
        let d = await this.QD.getData('/School/StuClient/StudentMorningCheckByAttenIdDetail', {attendid: parseInt(this.id)})
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
      this.getDetail();
      // 开启自动保存
    },
    data () {
      return {
        showToast: false,
        toastMsg: '',
        bjmc: this.$route.query.bjmc,
        bjdm: this.$route.query.bjdm,
        changed: false,
        saving: false,
        percent1: 30,
        loading: true,
        showContent: true,
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
      },
      currDate () {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDate();
        return year + '-' + month + '-' + day;
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
  .demo-icon.demo-icon13{
    font-size: 13px;
    padding-right: 2px;
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
  .btn-in {
    color: #aaa;
    border-color: #aaa;
    margin-right:5px;
  }
  .btn-in .demo-icon13{
    color: #aaa;
  }
  .btn-in.btn-sj  .demo-icon13,
  .btn-in.btn-sj {
    color: #ff973e;
    border-color: #ff973e;
  }
  .btn-in.btn-bj  .demo-icon13,
  .btn-in.btn-bj {
    color: #10aeff;
    border-color: #10aeff;
  }

  .btn-in.btn-qq  .demo-icon13,
  .btn-in.btn-qq {
    color: #ff1733;
    border-color: #ff1733;
  }


  .stumess{
    font-size: 14px;
  }
  .weui-btn_mini{
    line-height:1.8;
    padding: 0 .6em;
  }
</style>

