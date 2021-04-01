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
      <popup :hide-on-blur="false" v-model="showPanel" position="right" width="80%" style="background-color: #ffffff;">
        <div>
          <span class="panel-Head">筛选</span>
        </div>
        <div style="padding:34px 0 55px 0;">
          <group class="gp">
            <cell>
              <span slot="after-title" class="category-Head">授课学期</span>
            </cell>
            <p class="noDataHint" v-if="!loaded && xqLst.length <= 0">没有授课学期数据</p>
            <div class="option-box">
              <a @click="selectXQVal(s, sidx)" :class="selectIdx.xqIdx === sidx ? 'select-a-BgC' : ''" v-for="(s, sidx) in xqLst" :key="sidx">{{s.Value}}</a>
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
    name: "teaEvalStu-siftEvalStuLst",
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
      // 选择授课学期
      selectXQVal (item, idx) {
        this.selectIdx.xqIdx = idx;
        this.selectResult.xqData = item;
      },
      // 点击确定按钮
      sureButton () {
        this.showPanel = false; // 搜索面板不显示
        this.$emit('get-selectVal', {result: this.selectResult, selectIdx: this.selectIdx});
      },
      // 得到学期数据
      async getEvalSemesterData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'TeaEvalSemester',
          xnd: 0 //  0 代表所有的
        });
        this.loading = false;
        this.loaded = false;
        if (d.status && d.status === "error") {
          console.log(`获取学期数据失败:${d.msg}`);
          return;
        }
        console.log("semester", d);
        this.xqLst = d.Data.list;
        // 数据是之前保存的数据
        if (this.selectResult.xqData) {
          this.$emit('get-selectVal', {result: this.selectResult, selectIdx: this.selectIdx});
          return;
        }
        // 找到当前学期
        for (let i=0; i<this.xqLst.length; i++) {
          let si = this.xqLst[i];
          if (si.IsCurrent) {
            this.selectIdx.xqIdx = i;
            this.selectResult.xqData = si;
            this.$emit('get-selectVal', {result: this.selectResult, selectIdx: this.selectIdx});
            return; // 不执行下面的代码
          }
        }
        // 没有找到当前学期
        if (this.xqLst.length > 0) {
          console.log("no current xq");
          this.selectIdx.xqIdx = 0;
          this.selectResult.xqData = this.xqLst[0];
          this.$emit('get-selectVal', {result: this.selectResult, selectIdx: this.selectIdx});
        }
      },
      // 得到之前保存的数据
      getSaveData () {
        if (this.selectResult_sift) {
          this.selectResult = this.selectResult_sift;
        }
        if (this.selectIdx_sift) {
          this.selectIdx = this.selectIdx_sift;
        }
        this.getEvalSemesterData(); // 得到学期数据
      }
    },
    created () {
      this.getSaveData();  // 得到之前保存的数据
    },
    data () {
      return {
        loading: false,
        loaded: false,
        showPanel: false,
        selectResult: {xqData: null}, // 选中的结果
        selectIdx: {xqIdx: 0}, // 默认选中全部
        xqLst: [] // 授课学期
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
  /* 没有数据时的提示 start */
  .noDataHint{
    text-align: center;
    font-size: 16px;
    color: #999999;
  }
  /* 没有数据时的提示 end */
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
