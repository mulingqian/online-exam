<template>
  <div class="stuKaoQinLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <cell is-link>
        <span slot="after-title" class="vux-label">
          <span style="float:right;" v-on:click.stop.prevent="showSemesPanel">选择学期：{{selectedSemes}}</span>
        </span>
      </cell>
    </group>
    <group class="kaoQinGroup">
      <cell v-if="monthLst !== null"  v-for="(m, mIdx) in monthLst" :key="mIdx" is-link @click.native="gokaoQinDetail(mIdx)">
        <span slot="after-title" class="vux-label">
          <span class="kaoQinMonth">{{mIdx}}月考勤</span>
          <span class="kaoQinCategroy">
            <span v-if="n.Category !== 1 && n.Category !== 64 " v-for="(n,nIdx) in monthLst[mIdx]" :key="nIdx">
              <span>{{n.CategoryName}}</span>
              <span :class="n.Times > 0 ? 'categoryTimesRed' : 'categoryTimes'">{{n.Times}} </span>
            </span>
          </span>
        </span>
      </cell>
    </group>
    <actionsheet v-model="isShowSemesLst" :menus="semesterLst" show-cancel @on-click-menu="getSemesterValue"></actionsheet>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'
  export default {
    name: "kaoQinLst",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Actionsheet,
      Cell,
      Group
    },
    methods: {
        // 到详细页面<!--:link="{path: '/stuKaoQin/kaoQinDetail', query: {m: mIdx, xqid: selectedSemesId}}" -->
      gokaoQinDetail (mIdx) {
          // 存学期id
        localStorage.setItem("kaoQinSemesId", this.selectedSemesId);
        this.$router.push({path: '/stuKaoQin/kaoQinDetail', query: {m: mIdx, xqid: this.selectedSemesId}});
      },
      // 选择学期，下面的面板信息出现
      showSemesPanel () {
        this.isShowSemesLst = !this.isShowSemesLst;
      },
      // 选择学期值
      getSemesterValue (key, item) {
        if (item !== undefined && item !== this.selectedSemes) {
          this.selectedSemes = item;
          this.selectedSemesId = this.semesterId[key];
          this.loading = true;
          this.getStuAttendanceMonthData();
        }
      },
      // 查询和当前学生相关的学期列表
      async getStuAttendanceSemesterData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuAttendanceSemesterData', xh: this.QD.getLocalUserinfo().stuObj.XH});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        let flag = false;
        for (let i=0; i<d.length; i++) {
          this.semesterLst[i] = d[i].XQMC;
          this.semesterId[i] = d[i].XQID;
          /*找到当前的学期*/
          if (d[i].CurrentXQ === true) {
            this.selectedSemes = d[i].XQMC;
            this.selectedSemesId = d[i].XQID;
            flag = true;
          }
        }
        /*数据中没有当前学期，默认选择第一个数据作为当前学期*/
        if (!flag) {
          this.selectedSemes = d[0].XQMC;
          this.selectedSemesId = d[0].XQID;
        }
        this.getStuAttendanceMonthData();
      },
      async getStuAttendanceMonthData () {
       // 获取考勤学期id
        if (localStorage.getItem("kaoQinSemesId") !== null){
          this.selectedSemesId = parseInt(localStorage.getItem("kaoQinSemesId"));
          console.log(this.selectedSemesId);
          localStorage.removeItem("kaoQinSemesId");
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuAttendanceMonthData', xqid: this.selectedSemesId, xh: this.QD.getLocalUserinfo().stuObj.XH});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        this.monthLst = d;
      }
    },
    data () {
      return {
        loading: false,
        semesterLst: [], // 学期数组
        semesterId: [], // 学期id,对应学期数组的学期id
        selectedSemes: '', // 当前选择的学期
        selectedSemesId: -1, // 选择学期对应的id
        isShowSemesLst: false, //学期面板
        monthLst: [] // 当前学期对应的月份列表信息
      }
    },
    created () {
      this.getStuAttendanceSemesterData();
    }
  }
</script>
<style scoped>
  .stuKaoQinLst .vux-label{
    overflow: hidden;
    font-size: 16px;
    color: #333333;
  }
  .stuKaoQinLst .kaoQinGroup .kaoQinMonth{
    font-size: 16px;
    color: #333333;
  }
  .stuKaoQinLst .kaoQinGroup .kaoQinCategroy{
    display:block;
    font-size: 14px;
    color: #666666;
  }
  .stuKaoQinLst .kaoQinGroup .categoryTimesRed{
    margin-right: 8px;
    color: #ff0000;
  }
  .stuKaoQinLst .kaoQinGroup .categoryTimes{
    margin-right: 8px;
    color: #666666;
  }
</style>
<style>
  /*状态值面板*/
  .stuKaoQinLst .weui-actionsheet__menu .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
  .stuKaoQinLst .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
  .stuKaoQinLst .weui-cells{
    margin-top: 0;
  }
  .stuKaoQinLst .kaoQinGroup .weui-cells{
    margin-top: -1px;
  }
</style>

