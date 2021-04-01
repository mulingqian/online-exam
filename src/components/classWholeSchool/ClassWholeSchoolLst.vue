<template>
  <div class="class-whole-school">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="select-box">
      <div class="select-grade">
        <a class="category_title">年级<span class="school-wx-icon arrow_icon">&#xe638;</span></a>
        <scroller :lock-x="true" :scrollbar-y="true" height="-116" style="padding-top: 19px;">
          <div>
            <a v-for="(r, ridx) in firstRowLst" :key="ridx" @click.stop.prevent="clickFirstRow(r, ridx)" :class="{ 'selectColorA': ridx === selectRowIdx.firstIdx }">
              <span v-if="r.NJMC && r.NJMC.substr(r.NJMC.length-1, 1) === '级'">{{r.NJMC}}</span>
              <span v-else>{{r.NJMC}}级</span>
            </a>
          </div>
        </scroller>
      </div>
      <div class="select-specialty">
        <a class="category_title">专业<span class="school-wx-icon arrow_icon">&#xe638;</span></a>
        <scroller :lock-x="true" :scrollbar-y="true" height="-116" style="padding-top: 19px;">
          <div>
            <a v-for="(r, ridx) in secondRowLst" :key="ridx" @click.stop.prevent="clickSecondRow(r, ridx)" :class="{ 'selectColorA': ridx === selectRowIdx.secondIdx }">{{r.ZYMC}}</a>
          </div>
        </scroller>
      </div>
      <div class="select-class">
        <a class="category_title">班级<span class="school-wx-icon arrow_icon">&#xe638;</span></a>
        <scroller :lock-x="true" :scrollbar-y="true" height="-116" style="background-color: #f2f2f2;padding-top: 19px;">
          <div>
            <a v-for="(r, ridx) in thirdRowLst" :key="ridx" @click.stop.prevent="clickThirdRow(r, ridx)" :class="{ 'selectColorA': ridx === selectRowIdx.thirdIdx }">{{r.BJMC}}</a>
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Scroller from 'vux/src/components/scroller/index.vue'
  export default {
    name: 'classWholeSchoolLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      Scroller
    },
    methods: {
      // 选择班级
      clickThirdRow (r, ridx) {
        this.selectRowIdx.thirdIdx = ridx;
        this.selectInfo.bjid = r.BJID;
        this.selectInfo.bjmc = r.BJMC;
        this.QD.otherPageData = {selectInfo: this.selectInfo, selectRowIdx: this.selectRowIdx}; // 选中的信息
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 点击第一列标签, 选择年级
      clickFirstRow (r, ridx) {
        this.selectRowIdx.firstIdx = ridx;
        this.selectInfo.njid = r.NJID;
        this.selectInfo.njmc = r.NJMC;
        this.selectInfo.bjid = null; // 班级信息初始化
        this.selectInfo.bjmc = ''; //初始化信息初始化
        this.selectRowIdx.thirdIdx = -1; // 后面的初始化为未选中
        this.getConditionClassData(); // 根据全校的年级id和专业id得到班级id njid/zyid
      },
      // 点击第二列标签, 选择专业
      clickSecondRow (r, ridx) {
        this.selectRowIdx.secondIdx = ridx;
        this.selectInfo.zyid = r.ZYID;
        this.selectInfo.zymc = r.ZYMC;
        this.selectInfo.bjid = null; // 班级信息初始化
        this.selectInfo.bjmc = ''; //初始化信息初始化
        this.selectRowIdx.thirdIdx = -1; // 后面的初始化为未选中
        this.getConditionClassData(); // 根据全校的年级id和专业id得到班级id njid/zyid
      },
      // 全校所有年级
      async getWholeGradeData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetWholeGradeData'});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        this.getWholeSpecialtyData(); // 全校所有专业
        this.firstRowLst = d;
        console.log("grade", d);
      },
      // 全校所有专业
      async getWholeSpecialtyData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetWholeSpecialtyData'});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        this.secondRowLst = d;
        if (this.firstRowLst.length > 0 && this.secondRowLst.length > 0) {
          if (this.QD.otherPageData && this.QD.otherPageData.selectInfo) {
            this.selectInfo = this.QD.otherPageData.selectInfo;
            this.selectRowIdx = this.QD.otherPageData.selectRowIdx;
            this.QD.otherPageData = null; // 清空Global 中参数记录的数据
          } else {
            this.selectInfo = {njid: this.firstRowLst[0].NJID, njmc: this.firstRowLst[0].NJMC, zyid: this.secondRowLst[0].ZYID, zymc: this.secondRowLst[0].ZYMC, bjid: null, bjmc: ''};
          }
          this.getConditionClassData(); // 根据全校的年级id和专业id得到班级id njid/zyid
        }
        console.log("specialtyData", d);
      },
      // 根据全校的年级id和专业id得到班级id njid/zyid
      async getConditionClassData () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetConditionClassData', njid: this.selectInfo.njid, zyid: this.selectInfo.zyid});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        this.thirdRowLst = d;
      }
    },
    created () {
      this.getWholeGradeData(); // 全校所有年级
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        firstRowLst: [], // 第一列，全校年级信息
        secondRowLst: [], // 第二列，全校专业
        thirdRowLst: [], // 第三列，班级信息
        selectInfo: {njid: null, njmc: '', zyid: null, zymc: '', bjid: null, bjmc: ''}, // 选择的信息
        selectRowIdx: {firstIdx: 0, secondIdx: 0, thirdIdx: -1} // 第一列和第二列的背景颜色选中的样式
      }
    }
  }
</script>
<style scoped>
  .class-whole-school{
    background-color: #ffffff;
  }
  .select-box>div{
    float: left;
    background-color:#ffffff;
  }
  .select-class .selectColorA,
  .select-grade .selectColorA,
  .select-specialty .selectColorA{
    color: #ffa500;
    background-color: #f2f2f2;
  }
  .select-grade{
    width:25%;
    border-right: 1px solid #f2f2f2;
  }
  .select-specialty{
    width:48%;
    border-left: 1px solid #f2f2f2;
  }
  .select-class{
    width:25%;
  }
  .select-grade a{
    display: inline-block;
    width: 100%;
    line-height: 1.41176471;
    text-align: center;
    padding: 10px 2px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .arrow_icon{
    color: #333333;
  }
  .select-specialty a{
    display: inline-block;
    width: 100%;
    text-align: center;
    line-height: 1.41176471;
    padding: 10px 2px;
    font-size: 14px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
  .select-class a{
    display: inline-block;
    width: 100%;
    text-align: center;
    line-height: 1.41176471;
    padding: 10px 0;
    font-size: 14px;
    color: #999999;
    border-bottom: 1px solid #e5e5e5;
  }
</style>

