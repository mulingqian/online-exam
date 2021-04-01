<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <scroller lock-x height="-52" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group label-width="5em">
          <cell>
            <span slot="after-title">社团名称</span>
            <span slot="value" class="valuesize">{{ objInfo.Name }}</span>
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
        </group>
        <div style="padding:10px;">
          <x-button type="primary" v-if="this.stas === '已报名'" disabled>正在审核中</x-button>
          <x-button type="warn" @click.native="doCell()" v-if="this.stas === '审核通过'">退出社团</x-button>
          <x-button type="primary" @click.native="doApply()" v-if="this.stas === 0">我要报名</x-button>
          <x-button type="primary" @click.native="doApply()" v-if="this.stas === '未通过'" class="btn-orange">重新报名</x-button>
          <span class="warn-message" v-if="this.stas === '未通过'">您的申请已被驳回</span>
        </div>
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

  export default {
    name: "coomunityApplyDetail",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      Cell,
      Group,
      Loading,
      Divider,
      XButton
    },
    methods: {
      onScroll () {
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
      },
      // 撤销报名
      doCell () {
        let _this = this;
        this.QD.confirm("确定要退出该社团吗？", '', async function () {
          let stuid = _this.QD.getLocalUserinfo().stuObj.XH;
          let d = await _this.QD.getData('/School/StuClient/StudentCommunityCanCelApply', { ID: parseInt(_this.id), XH: stuid });
          console.log(d);
          if (d.status === 'success') {
            _this.QD.alert("撤销成功!")
            _this.stas = 0;
          }
        });
      },
      // 提交报名
      async doApply () {
        let stuid = this.QD.getLocalUserinfo().stuObj.XH;
        let d = await this.QD.getData('/School/StuClient/StudentCommunityApply', { ID: parseInt(this.id), XH: stuid });
        console.log(d);
        if (d.status === 'success') {
          this.QD.alert("报名成功!")
          this.stas = '已报名';
        }
      },
      async getDetail () {
        let stuid = this.QD.getLocalUserinfo().stuObj.XH;
        console.log(stuid);
        let d = await this.QD.getData('/School/StuClient/StudentCommunityDetail', { ID: parseInt(this.id) })
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.objInfo = d;
        this.students = d.Students;
        // 查找当前学生是否在社团中，并设置报名状态
        this.stas = 0;
        for (let i = 0; i < this.students.length; i++) {
          if (stuid === this.students[i].XH) {
            this.stas = this.students[i].Status;
            break;
          }
        }
        this.loading = false
        // this.QD.alert(`获取数据成功`)
      }
    },
    created () {
      console.log(this.$route.query)
      this.getDetail();
    },
    data () {
      return {
        percent1: 30,
        loading: true,
        showContent: false,
        objInfo: {},
        students: [],
        stas: 0
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
</style>
