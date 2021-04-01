<!--筛选组件-->
<template>
  <div class="siftConditionContainer" :class="claObj && claObj.length > 0 ? 'sift-style': ''">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <!-- 筛选标题 start -->
    <group class="siftBox">
      <cell @click.native="showPanelWay">
        <div slot="after-title">
          <p class='sift-text-box' :class="selectIdxObj.gradeIdx > 0 || selectIdxObj.yxInfo > 0 || selectIdxObj.zyInfo > 0 ? 'have-condition-style' : ''">
            <span class="siftText" >筛选</span>
            <span slot="icon" class="school-wx-icon selectIcon"  :class="selectIdxObj.gradeIdx > 0 || selectIdxObj.yxInfo > 0 || selectIdxObj.zyInfo > 0 ? 'have-condition-style' : ''">&#xe65f;</span>
          </p>
          <p class="change-condition">
            <span v-if="selectIdxObj.gradeIdx > 0 || selectIdxObj.yxInfo > 0 || selectIdxObj.zyInfo > 0">已选条件:</span>
            <span v-if="selectInfoObj.gradeInfo && selectIdxObj.gradeIdx > 0" class="condition-name">{{selectInfoObj.gradeInfo.name}}</span>
            <span v-if="selectInfoObj.yxInfo && selectIdxObj.yxIdx > 0" class="condition-name">{{selectInfoObj.yxInfo.name}}</span>
            <span v-if="selectInfoObj.zyInfo && selectIdxObj.zyIdx > 0" class="condition-name">{{selectInfoObj.zyInfo.name}}</span>
          </p>
        </div>
      </cell>
    </group>
    <!-- 筛选标题 end -->

    <!--班级列表 start-->
    <div>
      <class-lst :lst = claObj v-if="claObj && claObj.length > 0" @go-detail="goDetail" ></class-lst>
      <van-empty description="数据为空" v-else/>
    </div>
    <!--班级列表 end-->

    <!--筛选条件 start-->
    <div v-transfer-dom>
      <popup :hide-on-blur="false" v-model="showPanel" position="right" width="80%" style="background-color: #ffffff;">
        <div class="condition-content">
          <sift-option :cancelVal="false"
                       :objData="gradeObj"
                       :title="'年级'"
                       @get-val="getGradeVal"
                       :defaultSelectIndex="selectIdxObj.gradeIdx">
          </sift-option>
          <sift-option :cancelVal="false"
                       :objData="yxObj"
                       :title="'院系'"
                       @get-val="getYXVal"
                       :defaultSelectIndex="selectIdxObj.yxIdx">
          </sift-option>
          <sift-option :cancelVal="false"
                       :objData="zyObj"
                       :title="'专业'"
                       @get-val="getZYVal"
                       :defaultSelectIndex="selectIdxObj.zyIdx">
          </sift-option>
        </div>
        <div class="button-box">
          <div class="btn-style-box">
            <x-button type="primary" :plain=true class="btn-style" @click.native="clearButton">重置</x-button>
          </div>
          <div class="btn-style-box">
            <x-button type="primary" class="btn-style sureSeleVal" @click.native="sureButton">确定</x-button>
          </div>
        </div>
      </popup>
    </div>
    <!--筛选条件 end-->

  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Popup from 'vux/src/components/popup/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'

  import { Empty } from 'vant'

  import siftOption from '../../common/SiftOption.vue'
  import classLst from './ClassLst.vue'
  export default {
    name: 'arrangeRoom-siftStuCondition',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      Popup,
      XButton,
      [Empty.name]: Empty,
      siftOption,
      classLst
    },
    props: {
      currXQOrXnId: { // 当前选中的学期、学年id
        type: String,
        default: '0'
      },
      moralType: {// 当前选中的评语类型
        type: String,
        default: '1'
      },
      searchInfo: {// 筛选信息
        type: Object,
        default: null
      }
    },
    methods: {
      getCurrInfo() {
        if (this.searchInfo) {
          this.selectIdxObj = this.searchInfo.selectIdxObj
          this.selectInfoObj = this.searchInfo.selectInfoObj
          this.gradeObj = this.searchInfo.gradeObj
          this.yxObj = this.searchInfo.yxObj
          this.zyObj = this.searchInfo.zyObj
          this.claObj = this.searchInfo.claObj
        } else {
          this.getWholeGradeData(); // 读取全校所有年级
          this.getFacultyData(); // 读取院系
        }
      },
      // 显示右边的筛选内容
      showPanelWay () {
        this.showPanel = true; // 搜索面板显示
        this.$emit('clickEvent');
      },
      // 点击跳转详细
      goDetail(selectCla, tabIdx) {
        this.$emit('goStuLst', selectCla, tabIdx, this.selectInfoObj)
      },
      // 点击重置按钮
      clearButton () {
        this.selectIdxObj={gradeIdx: 0, yxIdx: 0, zyIdx: 0}
        this.selectInfoObj={gradeInfo: {id: -1, name: '全部'}, yxInfo: {id: -1, name: '全部'}, zyInfo: {id: -1, name: '全部'}}
      },
      // 点击确定按钮
      sureButton () {
        this.showPanel = false; // 搜索面板不显示 gradeId-年级id,classId-班级id
        this.$emit('get-selectVal', this.selectIdxObj, this.selectInfoObj, this.gradeObj, this.yxObj, this.zyObj, this.claObj);
      },
      // 选中的年级信息
      getGradeVal(obj) {
        //console.log('选中的年级信息', obj)
        this.selectIdxObj.gradeIdx = obj.index
        this.selectInfoObj.gradeInfo = obj.value
      },
      // 选中的院系信息
      getYXVal(obj) {
        //console.log('选中的年级信息', obj)
        this.selectIdxObj.yxIdx = obj.index
        this.selectInfoObj.yxInfo = obj.value
        this.getSpecialtyDataByYXID(); //根据院系获取专业
      },
      // 选中的专业信息
      getZYVal(obj) {
        //console.log('选中的年级信息', obj)
        this.selectIdxObj.zyIdx = obj.index
        this.selectInfoObj.zyInfo = obj.value
        this.getClassData(); //根据年级、院系、专业获取班级信息
      },

      // 全校所有年级
      async getWholeGradeData () {
        let lst = [];
        lst.push({id: -1, name: '全部'});
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetWholeGradeData'});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        for (let i=0; i< d.length; i++) {
          let njItem = d[i];
          lst.push({id: njItem.NJID, name: njItem.NJMC});
          if (njItem.isDefault === true) {
            this.selectIdxObj.gradeIdx = i + 1; // 默认开始选中当前学期, +1 加上第一个的 '全部',所以当前学期向后挪一个位置
            this.selectInfoObj.gradeInfo = {id: njItem.NJID, name: njItem.NJMC}
          }
        }
        //console.log(" %c grade=>", 'color:red;', d);
        this.gradeObj = {unfold: false, lst: lst};
      },
      // 获取院系
      async getFacultyData () {
        let lst = [];
        lst.push({id: -1, name: '全部'});
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMobileFacultyData'});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        for (let i=0; i< d.data.length; i++) {
          let yxItem = d.data[i];
          lst.push({id: yxItem.yxid, name: yxItem.yxmc});
        }
        //console.log(" %c yxInfo=>", 'color:blue;', d);
        this.selectInfoObj.yxInfo = {id: -1, name: '全部'}
        this.yxObj = {unfold: false, lst: lst};
        this.getSpecialtyDataByYXID(-1); // 全校所有专业
      },
      // 根据院系获取专业
      async getSpecialtyDataByYXID (yxid) {
        let lst = [];
        lst.push({id: -1, name: '全部'});
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetSpecialtyDataByYXID',
          yxid: this.selectInfoObj.yxInfo.id
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        for (let i=0; i< d.data.length; i++) {
          let zyItem = d.data[i];
          lst.push({id: zyItem.ZYID, name: zyItem.ZYMC});
        }
        //console.log(" %c zyInfo=>", 'color:skyblue;', d);
        this.selectInfoObj.zyInfo = {id: -1, name: '全部'}
        this.zyObj = {unfold: false, lst: lst};
        this.getClassData(); // 获取班级信息
      },
      // 根据年级、院系、专业获取班级信息 moralType}/{xn}/{njid}/{zyid}/{yxid
      async getClassData (yxid) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassMoralCommentData',
          moralType: this.moralType*1,
          xn: this.currXQOrXnId*1,
          njid: this.selectInfoObj.gradeInfo.id,
          yxid: this.selectInfoObj.yxInfo.id,
          zyid: this.selectInfoObj.zyInfo.id
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        //console.log(" %c claInfo=>", 'color:orange;', d);
        this.claObj = d.data;
      }
    },
    created () {
      this.getCurrInfo();
    },
    data () {
      return {
        loading: false,
        showPanel: false,
        gradeObj: null, // 年级信息
        yxObj: null, // 院系信息
        zyObj: null, // 专业信息
        claObj: null, // 班级信息

        selectIdxObj: {gradeIdx: 0, yxIdx: 0, zyIdx: 0}, // 默认选中的index
        selectInfoObj: {gradeInfo: null, yxInfo: null, zyInfo: null} // 选中信息
      }
    },
    mounted() {
    },
    watch: {
      currXQOrXnId (val) {
        this.currXQOrXnId = val
        this.getClassData();
      },
      moralType (val) {
        this.moralType = val
      }
    }
  }
</script>
<style scoped lang="less">
  .sift-style{
    background-color: #f2f2f2;
  }
  .siftBox{
    position: relative;
    width: 100%;
    z-index: 10;
    color:#626666;
  }
  /*筛选标题 start*/
  .sift-text-box{
    display: inline-block;
    .selectIcon{
      color:#626666;
      font-size: 16px;
      vertical-align: top;
    }
    .siftText{
      font-size: 14px;
      vertical-align: top;
    }
  }
  .have-condition-style{
    color: @tea-theme-color!important;
  }
  .change-condition{
    display: inline-block;
    font-size: 12px;
    vertical-align: middle;
    .condition-name{
      display: inline-block;
      padding:2px 4px;
      margin:0 8px 4px 0;
      border:0.5px solid #999;
      border-radius: 2px;
    }
  }
  /*筛选标题 end*/

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
    float: left;
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
    width: 80%;
    bottom: 0;
    display: flex;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #ffffff;
    z-index: 502;
    .btn-style-box{
      width:50%;
      padding:0 8px;
    }
  }

  .btn-style {
    line-height: 32px;
    font-size: 16px;
    color: @tea-theme-color;
    border:1px solid @tea-theme-color;
  }
  .sureSeleVal {
    color: #fff;
    background: @tea-theme-color;
  }
</style>
<style>
  .siftConditionContainer .siftBox .weui-cells{
    margin-top: 0;
  }
</style>
