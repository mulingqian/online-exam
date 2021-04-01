<template>
  <div class="courselst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="xqHead">
      <smst @on-load="onLoad" @on-hide="onHide" :showName="true" ></smst>
    </div>

    <div v-show="(!loading && (lst.length === 0))">
      <divider style="padding-top:80px;">暂无数据</divider>
    </div>
    <div v-if="lst.length !== 0" style="padding-top: 50px;" class="table">
      <x-table full-bordered :cell-bordered="false">
        <tbody>
        <tr style="background-color: #DFE4EB;">
          <th>科目</th>
          <th v-if="QD.stuScoreLstShowXF">学分</th>
          <th>分数</th>
        </tr>
        <tr v-if="QD.stuScoreLstShowXF" v-for="(x, index) in lst" :key="index" class="lstTr">
          <td class="kcmc">{{x.KCMC}}</td>
          <td>{{x.XF}}</td>
          <td :class="{'failed': (x.zdCJ < 60) }"><span class="scoreval">{{x.zdCJ}}</span></td>
        </tr>
        <tr v-if="!QD.stuScoreLstShowXF" v-for="(x, index) in lst" :key="index" class="lstTr">
          <td class="kcmc">{{x.KCMC}}</td>
          <td :class="{'failed': (x.zdCJ < 60) }"><span class="scoreval">{{x.zdCJ}}</span></td>
        </tr>
        </tbody>
      </x-table>
    </div>
    <!--留底部间隔-->
    <div v-if="lst.length !== 0" class="bottom-gap" style="">以上是全部记录</div>
  </div>
</template>

<script>
// import {Cell, Group, XProgress, Loading, Divider, TransferDom} from 'vux'
// import XProgress from 'vux/src/components/x-progress/index.vue'
import Loading from 'vux/src/components/loading/index.vue'
import Divider from 'vux/src/components/divider/index.vue'
import TransferDom from 'vux/src/directives/transfer-dom/index.js'
import Smst from './Smst.vue'
import XTable from 'vux/src/components/x-table/index.vue'

export default {
  name: "scorelst",
  directives: {
    TransferDom
  },
  components: {
    Smst,
    Loading,
    Divider,
    XTable
  },
  methods: {
    onLoad (e) {
      console.log("smst on load");
      console.log(e)
      e && e.XQID && this.getList(e.XQID)
    },
    onHide (t, e) {
      console.log("smst on hide")
      console.log(e)
      if (t === true && e && e.XQID) {
        this.loading = true;
        this.getList(e.XQID)
      }
    },
    async getList (xqid) {
      // let d = await this.QD.getData('/School/StuClient/ScoreList', {xqid: xqid})
      let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuScoreData', xh: this.QD.getLocalUserinfo().stuObj.XH, xqid: xqid});
      this.loading = false;
      console.log(d)
      if (d.status && d.status === "error") {
        this.QD.alert(`获取数据失败:${d.msg}`);
        return;
      }
      for (let s of d) {
        if (!isNaN(parseFloat(s.CJ)) || !isNaN(parseFloat(s.BkScore)) || !isNaN(parseFloat(s.CxScore))) {
          let cj = parseFloat(s.CJ);
          let bkcj = parseFloat(s.BkScore);
          let cxcj = parseFloat(s.BkScore);
          if (!isNaN(parseFloat(s.CJ)) && !isNaN(parseFloat(s.BkScore)) && !isNaN(parseFloat(s.CxScore))) {
            s.zdCJ = cj > bkcj ? (cj > cxcj ? cj : cxcj + '（重修）') : (bkcj > cxcj ? bkcj + '（补考）' : cxcj + '（重修）');
          }
          if (!isNaN(parseFloat(s.CJ)) && !isNaN(parseFloat(s.BkScore)) && !isNaN(parseFloat(s.CxScore)) === false) {
            s.zdCJ = cj > bkcj ? cj : bkcj + '（补考）';
          }
          if (!isNaN(parseFloat(s.CJ)) && !isNaN(parseFloat(s.BkScore)) === false && !isNaN(parseFloat(s.CxScore)) === false) {
            s.zdCJ = cj;
          }
          if (!isNaN(parseFloat(s.CJ)) === false && !isNaN(parseFloat(s.BkScore)) && !isNaN(parseFloat(s.CxScore))) {
            s.zdCJ = bkcj > cxcj ? bkcj + '（补考）': cxcj + '（重修）';
          }
          if (!isNaN(parseFloat(s.CJ)) === false && !isNaN(parseFloat(s.BkScore)) && !isNaN(parseFloat(s.CxScore))=== false) {
            s.zdCJ = bkcj + '（补考）';
          }
          if (!isNaN(parseFloat(s.CJ)) && !isNaN(parseFloat(s.BkScore)) === false && !isNaN(parseFloat(s.CxScore))) {
            s.zdCJ = cj > cxcj ? cj : cxcj + '（重修）';
          }
          if (!isNaN(parseFloat(s.CJ)) === false && !isNaN(parseFloat(s.BkScore)) === false && !isNaN(parseFloat(s.CxScore))) {
            s.zdCJ = cxcj + '（重修）';
          }
          if (!isNaN(parseFloat(s.CJ)) === false && !isNaN(parseFloat(s.BkScore)) === false && !isNaN(parseFloat(s.CxScore))=== false) {
            s.zdCJ = '--';
          }
        } else {
          let csType = '';
          let cjIndex = -1;
          let bkIndex = -1;
          let cxIndex = -1;
          if (s.CJ !==null && s.CJ !== '') {
            cjIndex = this.QD.scoreMap.indexOf(s.CJ);
          }
          if (s.BkScore !==null && s.BkScore !== '') {
            bkIndex = this.QD.scoreMap.indexOf(s.BkScore);
          }
          if (s.CxScore !==null && s.CxScore !== '') {
            cxIndex = this.QD.scoreMap.indexOf(s.CxScore);
          }
          let minIndex;
          if (cjIndex !== -1 && bkIndex !== -1 && cxIndex !== -1) {
            minIndex = cjIndex <= bkIndex ? (cjIndex < cxIndex ? cjIndex : cxIndex) : (bkIndex < cxIndex ? bkIndex : cxIndex);
            if (minIndex === bkIndex) {
              csType = '补考';
            }
            if (minIndex === cxIndex) {
              csType = '重修';
            }
          }
          if (cjIndex !== -1 && bkIndex !== -1 && cxIndex === -1) {
            minIndex = cjIndex < bkIndex ? cjIndex : bkIndex;
            if (minIndex === bkIndex) {
              csType = '补考';
            }
          }
          if (cjIndex !== -1 && bkIndex === -1 && cxIndex === -1) {
            minIndex = cjIndex;
          }
          if (cjIndex === -1 && bkIndex !== -1 && cxIndex !== -1) {
            minIndex = bkIndex < cxIndex ? bkIndex : cxIndex;
            if (minIndex === bkIndex) {
              csType = '补考';
            }
            if (minIndex === cxIndex) {
              csType = '重修';
            }
          }
          if (cjIndex === -1 && bkIndex !== -1 && cxIndex === -1) {
            minIndex = bkIndex;
            csType = '补考';
          }
          if (cjIndex === -1 && bkIndex === -1 && cxIndex === -1) {
            minIndex = -1;
          }
          if (cjIndex === -1 && bkIndex === -1 && cxIndex !== -1) {
            minIndex = cxIndex;
            csType = '重修';
          }
          if (cjIndex !== -1 && bkIndex === -1 && cxIndex !== -1) {
            minIndex = bkIndex < cxIndex ? bkIndex : cxIndex;
            if (minIndex === cxIndex) {
              csType = '重修';
            }
          }
          if (minIndex !== -1) {
            s.zdCJ = this.QD.scoreMap[minIndex] + csType;
          } else {
            s.zdCJ = '--';
          }
        }
      }
      this.lst = d;
      // this.QD.alert(`获取数据成功`)
    }
  },
  created () {
  },
  data () {
    return {
      loading: true,
      percent1: 30,
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
  .xqHead{
    position: absolute;
    width: 100%;
    top: 46px;
    height: 40px;
    background-color: #fff;
    z-index: 5;
  }
  .failed .scoreval{
    color:red;
  }
  .table th,
  .table td{
    font-size: 14px;
    color: #333333;
  }
  .kcmc{
    width: 50%;
    padding: 0 2px;
  }
  .lstTr:nth-child(odd) {
    background-color: #f3f6f8;
  }
  .bottom-gap{
    display: block;
    width: 100%;
    height: 50px;
    text-align: center;
    font-size: 12px;
    color: #999999;
    padding-top: 10px;
  }
</style>
<style>
  .failed .weui-progress__inner-bar{
    background-color:red;
  }
</style>
