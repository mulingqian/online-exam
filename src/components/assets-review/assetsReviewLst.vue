<template>
  <div class="teaSkillContest">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="selectStyle">
      <!--<a>全部专业<span class="school-wx-icon arrowPoint" slot="icon" style="color: #cccccc;"></span></a>-->
      <a class="aCategory">
        <div v-on:click.stop.prevent="showSemesterSelect">
          <span>2017学年第一学期</span>
          <span class="school-wx-icon arrowPoint" slot="icon" style="color: #cccccc;"></span>
        </div>
      </a>
      <div style="width:20px;height:20px;float:right;padding:8px;"><a @click.prevent="scanQRCode" ><span class="school-wx-icon" style="font-size:22px;color:#0f89e0;padding:0;margin:0;">&#xe623;</span></a></div>
    </div>
    <group  v-for="(item, index) in glist" :key="index" >
      <cell :title="item.title"></cell>
      <cell-form-preview :list="item.list"></cell-form-preview>
      <cell>
        <label slot="after-title" style="color:red;font-weight:normal">实盘： {{item.total}}</label>
      </cell>
    </group>
    <actionsheet v-model="showSemesterLst" :menus="smstLists" show-cancel @on-click-menu="getSemesterVal"></actionsheet>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'
  import CellFormPreview from 'vux/src/components/cell-form-preview/index.vue'
  export default {
    name: 'assetsReview-assetsReviewLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      PopupPicker,
      Actionsheet,
      CellFormPreview
    },
    methods: {
      scanQRCode () {
        var that = this;
        this.QD.scanQRCode(function () {
          that.QD.alert('登记成功！');
          that.glist[0].total++;
          that.$set(that.glist, 0, that.glist[0]);
        });
      },
      // 下面的面板是否出现，选择类型值
      showSemesterSelect () {
        this.showSemesterLst = !this.showSemesterLst;
      },
      /*选择类型的值*/
      getSemesterVal (key, item) {
        console.log(item); // 类型的值
      }
    },
    data () {
      return {
        loading: false,
        showSemesterLst: false, // 是否显示类型
        glist: [
          {
            title: '笔记本',
            total: 10,
            list: [{
              label: '编号',
              value: 'hz-dl-01'
            }, {
              label: '规格',
              value: 'HP-EliteBook'
            }, {
              label: '型号',
              value: '8470p'
            }]
          },
          {
            title: '打印机',
            total: 3,
            list: [{
              label: '编号',
              value: 'hz-dl-02'
            }, {
              label: '规格',
              value: 'HP-PL'
            }, {
              label: '型号',
              value: 'x001'
            }]
          },
          {
            title: '传真机',
            total: 2,
            list: [{
              label: '编号',
              value: 'hz-dl-03'
            }, {
              label: '规格',
              value: 'HP-AAA'
            }, {
              label: '型号',
              value: 'x234001'
            }]
          }
        ],
        smstLists: ["2017学年第二学期", "2017学年第一学期", "2016学年第二学期", "2016学年第一学期", "2015学年第二学期", "2015学年第一学期"] // 类型数组
      }
    }
  }

</script>
<style scoped>
  .teaSkillContest{
    background: #f2f2f2;
  }
  .teaSkillContest .selectStyle{
    padding: 0 4px;
    color: #999999;
    background-color: #fff;
  }
  .teaSkillContest .selectStyle a{
    display: inline-block;
    width: 55%;
    text-align: center;
    font-size: 14px;
  }
  .teaSkillContest .aProfession{
    position: relative;
    top: 11px;
  }
  .teaSkillContest .aProfession .aProfessionSpan{
    display: inline-block;
    /*padding: 4.5px 0;*/
    padding-top: 4.5px;
    padding-bottom: 4.5px;
    padding-right: 3px;

  }
  .teaSkillContest .aObject span,
  .teaSkillContest .aCategory span{
    display: inline-block;
    padding: 8px 4px;
  }
  .teaSkillContest .selectStyle .arrowPoint:before{
    content: '\e61c';
  }
  .teaSkillContest .stuSkillGroup{
    position: relative;
  }
  .teaSkillContest .firstLine-stuSkill{
    padding-top: 4px;
    padding-bottom: 12px;
    font-size: 16px;
  }
  .teaSkillContest .firstLine-stuSkill span{
    margin-right: 15px;
  }
  .teaSkillContest .firstLine-stuSkill a{
    padding: 1px 8px;
    font-size: 12px;
    color: #fff;
    border-radius: 4px;
  }
  .teaSkillContest .firstLine-stuSkill .firsta1{
    display: inline-block;
    background-color: #ff721a;
  }
  .teaSkillContest .firstLine-stuSkill .firsta2{
    display: inline-block;
    background-color: #06a659;
    opacity:0.8;
  }
  .teaSkillContest .secondLIne-stuSkill,
  .teaSkillContest .thirdLine-stuSkill{
    display: block;
    font-size: 12px;
    color: #999999;
  }
</style>
<style>
  .teaSkillContest .selectStyle .aProfession .weui-cells{
    margin-top: 0;
    font-size: 14px;
  }
  .teaSkillContest .selectStyle .aProfession .weui-cells:before,
  .teaSkillContest .selectStyle .aProfession .weui-cells:after,
  .teaSkillContest .selectStyle .aProfession .vux-cell-box:before{
    border:0;
  }
  .teaSkillContest .selectStyle .aProfession .weui-cells .weui-cell:before,
  .teaSkillContest .selectStyle .aProfession .weui-cells .weui-cell:after{
    border:0;
  }
  .teaSkillContest .selectStyle .aProfession .weui-cells .weui-cell{
    padding:0;
  }
  .teaSkillContest .weui-cells__title{
    padding-left: 4px;
    padding-top: 4px;
    padding-bottom: 8px;
    color: #333333;
    font-size: 12px;
  }
  .teaSkillContest .weui-cell__ft:after{
    width: 0;
    height: 0;
    border-width: 0;
  }
  /*状态值面板*/
  .teaSkillContest .weui-actionsheet__menu .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
  .teaSkillContest .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
</style>
