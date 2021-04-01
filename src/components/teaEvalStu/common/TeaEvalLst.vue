<template>
  <div class="MouldEvalStuLst eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="eachPgBase">
      <sift-lst @get-selectVal="getSiftInfo" :selectResult_sift="selectResult_sift" :selectIdx_sift="selectIdx_sift"></sift-lst>
      <div class="siftContainer">
        <p class="siftCondition" v-if="selectResult_sift">筛选条件: {{selectResult_sift.xqData.Value}}</p>
        <div class="LstField clearfloat">
          <div class="lfBox">
            <a class="title1">已发布的评学<span class="school-wx-icon arrowIcon" slot="icon">&#xe638;</span></a>
            <scroller class="scrollerBox" :lock-x="true" :scrollbarY="true" height="-160">
              <div>
                <a :class="`${selectIdx.pxIdx === srIdx ? 'selectedPXStyle' : ''}`"
                   v-for="(sr, srIdx) in evalLst" :key="srIdx" @click.stop.prevent="selectPXWay(sr, srIdx)">{{sr.Subject}}</a>
              </div>
            </scroller>
          </div>
          <div class="rgBox">
            <a class="title2">评学班级<span class="school-wx-icon arrowIcon" slot="icon">&#xe638;</span></a>
            <scroller :lock-x="true" :scrollbarY="true" height="-160">
              <div>
                <a :class="`bjBox ${!sl.IsSave && selectInfo.pxInfo.IsCanEval ? 'startEvalInBJ' : (sl.IsSave && selectInfo.pxInfo.IsCanEval ? 'againEvalInBj' :
                (sl.IsSave && !selectInfo.pxInfo.IsCanEval ? 'completeEvalInBj' : 'noCompleteEvalInBj'))}`"
                   v-for="(sl, slIdx) in bjLst" :key="slIdx" @click.stop.prevent="selectBJWay(sl, slIdx)">
                  <span class="bjmcVal">{{sl.BJMC}}</span>
                </a>
              </div>
            </scroller>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import SiftLst from '../SiftEvalStuLst.vue'
  import Scroller from 'vux/src/components/scroller/index.vue'
  export default {
    name: "teaEvalStu-common-teaEvalLst",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      SiftLst,
      Scroller
    },
    props: {
      classEvalType: {
        type: Number,
        default: 1
      }// 班主任类型:1任课老师 2 班主任
    },
    methods: {
      // 选择班级的方法
      selectBJWay (s, idx) {
        this.selectInfo.bjInfo = s;
        this.selectIdx.bjIdx = idx;
        this.saveCurrPgData(); // 保存当前页面数据
        this.$emit('click-class', {FWID: s.FWID});
      },
      // 选择评学的方法
      selectPXWay (s, idx) {
        this.selectInfo.pxInfo = s;
        this.selectIdx.pxIdx = idx;
        this.getEvalClassRange(); // 评学的班级范围
      },
      // 得到筛选信息
      getSiftInfo (e) {
        this.selectResult_sift = e.result;
        this.selectIdx_sift = e.selectIdx;
        this.getEvalInfoByXQ(); // 得到已发布的评学
      },
      // 评学的班级范围
      async getEvalClassRange () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetTeaEvalClassRange',
          infoId: this.selectInfo.pxInfo.PXID, // 发布的评学Id
          classEvalType: this.classEvalType // 班主任类型:1任课老师 2 班主任
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取班级数据失败:${d.msg}`);
          return;
        }
        console.log("bj", d);
        this.bjLst = d.Data;
      },
      // 得到已发布的评学
      async getEvalInfoByXQ () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetTeaEvalInfoByXQ',
          semesterId: this.selectResult_sift.xqData.Key
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取评学数据失败:${d.msg}`);
          return;
        }
        console.log("eval info", d);
        this.evalLst = d.Data;
        // pxInfo 评学信息 ，bjInfo 班级信息- 得到之前保存的数据
        if (this.loaded && this.selectInfo.pxInfo && this.selectInfo.bjInfo) {
          this.loaded = false;
          this.getEvalClassRange(); // 评学的班级范围
          return;
        }
        // 开始默认设置第一个评学为选中的
        if (this.evalLst.length > 0) {
          this.selectInfo.pxInfo = this.evalLst[0];
          this.selectIdx.pxIdx = 0;
          this.getEvalClassRange(); // 评学的班级范围
        }
      },
      // 得到之前保存的页面数据
      getCurrPgData () {
        if (this.QD.parentPageData) {
          this.loaded = true;
          let qd = this.QD.parentPageData;
          this.selectResult_sift = qd.selectResult_sift;
          this.selectIdx_sift = qd.selectIdx_sift;
          this.selectInfo = qd.selectInfo;
          this.selectIdx = qd.selectIdx;
          this.QD.parentPageData = null;
        }
      },
      // 保存当前页面数据
      saveCurrPgData () {
        this.QD.parentPageData = {
          selectResult_sift: this.selectResult_sift,
          selectIdx_sift: this.selectIdx_sift,
          selectInfo: this.selectInfo,
          selectIdx: this.selectIdx
        }
      }
    },
    created () {
      this.getCurrPgData(); // 得到之前保存的页面数据
    },
    data () {
      return {
        loading: false,
        loaded: false,
        selectResult_sift: null, // 筛选 选中的结果
        selectIdx_sift: null, // 筛选 选中 idx
        evalLst: [], // 已发布的评学信息
        bjLst: [], // 评学对应的班级信息
        selectInfo: {pxInfo: null, bjInfo: null}, // pxInfo 评学信息 ，bjInfo 班级信息
        selectIdx: {pxIdx: 0, bjIdx: 0} // 默认选中的 评学pxIdx, 班级 bjIdx
      }
    }
  }
</script>
<style>
  .MouldEvalStuLst .LstField .xs-container {
    margin-top: 0;
  }
</style>
<style scoped>
  .siftContainer{
    position: relative;
    top: 50px;
  }
  .siftCondition {
    padding: 6px 15px;
    font-size: 14px;
    color: #666;
  }
  .LstField{
    background-color: #ffffff;
  }
  .LstField > .lfBox{
    float: left;
    width: 50%;
  }
  .LstField > .rgBox{
    float: left;
    width: 50%;
  }
  .LstField > .rgBox a,
  .LstField > .lfBox a{
    width: 100%;
    display: inline-block;
    line-height: 1.41176471;
    text-align: center;
    color: #333333;
    box-sizing: border-box;
    word-break: break-all; /* 强制换行 */
  }
  .LstField > .lfBox a{
    padding: 10px 15px;
    background-color: #f5f5f9;
  }
  .LstField > .lfBox .title1,
  .LstField > .rgBox .title2{
    font-size: 16px;
    color: #ffffff;
    background-color: #cbd4e2;
    padding: 4px 15px;
  }
  .LstField > .rgBox .title2{
    border-left: 1px solid #ffffff;
    border-bottom: 1px solid #f2f2f9;
  }
  .arrowIcon{
    color: #ffffff;
    padding-right: 0;
    vertical-align: middle;
  }
  .scrollerBox{
    background-color: #f5f5f9;
  }
  .LstField > .rgBox .bjBox{
    padding: 10px 0;
  }
  .bjBox .bjmcVal{
    width: 80%;
    display: inline-block;
    border: 1px solid #999999;
    padding: 6px 4px;
    font-size: 14px;
  }
  /* 选中评学 班级的样式 start */
  .LstField > .lfBox .selectedPXStyle{
    background-color: #ffffff;
  }
  /* 还未测评的班级样式 */
  .LstField > .rgBox .startEvalInBJ>span{
    color: #0f89e0;
  }
  /* 已经提交了，但是测评时间未过*/
  .LstField > .rgBox .againEvalInBj>span{
    color: #333333;
  }
  /* 完成测- 已提交了并测评时间已过 */
  .LstField > .rgBox .completeEvalInBj>span{
    color: #a89f9f;
    border: 1px solid #dad4d4;
  }
  /* 未提交并测试时间已过 */
  .LstField > .rgBox .noCompleteEvalInBj>span{
    color: #0f89e0;
    border: 1px solid #dad4d4;
  }
  /* 选中评学 班级的样式 end */
</style>
