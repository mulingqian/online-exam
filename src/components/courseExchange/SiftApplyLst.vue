<template>
  <div>
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <!-- 筛选 start -->
    <group class="siftBox">
      <cell @click.native="showPanelWay">
        <div slot="after-title">
          <span slot="icon" class="school-wx-icon selectIcon">&#xe65f;</span>
          <span class="siftText">筛选</span>
        </div>
      </cell>
    </group>
    <!-- 筛选 end -->
    <div v-transfer-dom>
      <popup v-model="showPanel" position="right" width="80%" style="background-color: #ffffff;" @on-hide="hidePopup">
        <div>
          <span class="panel-Head">筛选</span>
        </div>
        <div style="padding:34px 0 55px 0;">
          <group class="gp">
            <cell><span slot="after-title" class="category-Head">状态</span></cell>
            <div class="option-box">
              <a @click="selectStatusVal(s, sidx)" :class="selectIdx.statusIdx === sidx ? 'select-a-BgC' : ''" v-for="(s, sidx) in QD.applyStatusLst" :key="sidx">{{s.label}}</a>
            </div>
            <cell><span slot="after-title" class="category-Head">调课范围</span></cell>
            <div class="option-box">
              <a @click="selectRangeVal(s, sidx)" :class="selectIdx.rangeIdx === sidx ? 'select-a-BgC' : ''" v-for="(s, sidx) in rangeLst" :key="sidx">{{s.title}}</a>
            </div>
            <cell><span slot="after-title" class="category-Head">调课性质</span></cell>
            <div class="option-box">
              <a @click="selectNatureVal(s, sidx)" :class="selectIdx.natureIdx === sidx ? 'select-a-BgC' : ''" v-for="(s, sidx) in natureLst" :key="sidx">{{s}}</a>
            </div>
            <cell v-if="selectResult.xqData && selectResult.xqData.xqid>0" :arrow-direction="showXqContent ? 'up' : 'down'" :is-link="true" @click.native="showXqContent = !showXqContent">
              <span slot="after-title" class="category-Head">授课学期</span>
            </cell>
            <div v-if="showXqContent" class="option-box">
              <a @click="selectXQVal(s, sidx)" :class="selectIdx.xqIdx === sidx ? 'select-a-BgC' : ''" v-for="(s, sidx) in xqLst" :key="sidx">{{s.xqmc}}</a>
            </div>
          </group>
        </div>
        <div class="button-box">
          <x-button mini type="primary" class="sureSeleVal" @click.native="sureButton">确定</x-button>
        </div>
      </popup>
    </div>

  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Popup from 'vux/src/components/popup/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  export default {
    name: 'courseExchange-siftApplyLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      Popup,
      XButton
    },
    props: {
      selectXQID: Number,
      selectResult_sift: Object,
      selectIdx_sift: Object
    },
    methods: {
      // 显示右边的筛选内容
      showPanelWay () {
        this.showPanel = true; // 搜索面板显示
      },
      //  关闭时触发
      hidePopup () {
        this.conveyInfo(); // 向父级传递值
      },
      // 选择状态值
      selectStatusVal (item, idx) {
        this.selectIdx.statusIdx = idx;
        this.selectResult.status = item;
      },
      // 选择调课范围值
      selectRangeVal (item, idx) {
        this.selectIdx.rangeIdx = idx;
        this.selectResult.range = item;
      },
      // 选择调课性质值
      selectNatureVal (item, idx) {
        this.selectIdx.natureIdx = idx;
        this.selectResult.nature = item;
      },
      // 选择授课学期
      selectXQVal (item, idx) {
        this.selectIdx.xqIdx = idx;
        this.selectResult.xqData = item;
      },
      // 点击确定按钮
      sureButton () {
        this.showPanel = false; // 搜索面板不显示
        this.conveyInfo(); // 向父级传递值
      },
      // 向父级传递值
      conveyInfo () {
        this.$emit('get-selectVal', {result: this.selectResult, selectIdx: this.selectIdx});
      },
      // 读取当前老师有调课申请的学期
      async getApplySemesters () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetApplySemestersForTK'
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取学期数据失败:${d.msg}`);
          return;
        }
        d = JSON.parse(d);
        console.log("xq lst", d);
        this.xqLst = d.data;
        if (this.selectXQID === 0) {
          for (let i=0; i<this.xqLst.length; i++) {
            let si = this.xqLst[i];
            if (si.isCurrent) { // 找到当前学期
              this.selectResult.xqData = si; // 开始默认选中的是当前学期
              this.selectIdx.xqIdx = i; // 选中学期idx
              this.$emit('get-xqInfo', {xqInfo: this.selectResult.xqData}); // 得到学期信息
              return; // 不再执行后面的代码
            }
          }
        } else { // 之前有记录选择的学期信息-- 查找记录的学期是否存在
          for (let i=0; i<this.xqLst.length; i++) {
            let si = this.xqLst[i];
            if (si.xqid === this.selectXQID) { // 找到当前学期
              this.selectResult.xqData = si; // 开始默认选中的是当前学期
              this.selectIdx.xqIdx = i; // 选中学期idx
              this.$emit('get-xqInfo', {xqInfo: this.selectResult.xqData}); // 得到学期信息
              return; // 不再执行后面的代码
            }
          }
        }
        if (!this.selectResult.xqData && this.xqLst.length > 0) { // 没有找到当前学期时执行
          this.selectResult.xqData = this.xqLst[0];
        }
        this.$emit('get-xqInfo', {xqInfo: this.selectResult.xqData}); // 得到学期信息
      },
      // 得到之前保存的数据
      getSaveData () {
        if (this.selectResult_sift) {
          this.selectResult = this.selectResult_sift;
        }
        if (this.selectIdx_sift) {
          this.selectIdx = this.selectIdx_sift;
        }
        this.getApplySemesters();
      }
    },
    created () {
      this.getSaveData();  // 得到之前保存的数据
    },
    data () {
      return {
        loading: false,
        showPanel: false,
        rangeLst: [{title: '全部', value: -1}, {title: '代课', value: 1}, {title: '教室', value: 2}, {title: '时间', value: 3}, {title: '班内对调', value: 4}], // 调课范围
        natureLst: ['全部', '因公', '因私'], // 调课性质
        selectResult: {status: this.QD.applyStatusLst[0], range: {title: '全部', value: -1}, nature: '全部', xqData: null}, // 选中的结果
        selectIdx: {statusIdx: 0, rangeIdx: 0, natureIdx: 0, xqIdx: 0}, // 默认选中全部
        xqLst: [], // 授课学期
        showXqContent: true // 默认不显示学期信息
      }
    }
  }
</script>
<style scoped>
  .siftBox{
    position: absolute;
    margin-top: -21px;
    width: 100%;
    z-index: 10;
  }
  .gp{
    margin-top: -1.25em;
  }
  .selectIcon{
    font-size: 20px;
    color: #666666;
  }
  .siftText{
    vertical-align: top;
  }
  .panel-Head{
    position: fixed;
    width: 100%;
    display: block;
    margin-bottom: 40px;
    padding: 10px 15px;
    font-size: 14px;
    color: #999999;
    background-color: #f2f2f2;
    z-index: 2;
  }
  .category-Head{
    display: block;
    font-size: 14px;
    color: #666666;
  }
  .option-box{
    padding-bottom: 4px;
    padding-left: 10px;
  }
  .option-box a{
    display: inline-block;
    width: 45%;
    margin: 5px;
    font-size: 14px;
    color: #333333;
    padding: 10px 0 10px 0;
    text-align: center;
    background-color: #f2f2f2;
  }
  .option-box .select-a-BgC{
    background-color: #f3d1d1;
    color: #ea1212;
  }
  .button-box{
    position: fixed;
    width: 100%;
    bottom: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #ffffff;
    z-index: 502;
  }
  .sureSeleVal {
    margin-left: 120px;
    border-radius:99px;
    background-color: #F05C2B;
  }
</style>
