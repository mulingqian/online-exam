<template>
  <div class="teaSkillContest">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="selectStyle">
      <!--<a>全部专业<span class="school-wx-icon arrowPoint" slot="icon" style="color: #cccccc;"></span></a>-->
      <a class="aProfession" style="width: 34%;position: relative;top: 2px;">
        <group>
          <popup-picker :data="professionLst" @on-change="onChangeProfession">
            <span slot="title">
              <span class="aProfessionSpan">全部专业</span>
              <span class="school-wx-icon arrowPoint aProfessionSpan" slot="icon" style="color: #cccccc;"></span>
            </span>
          </popup-picker>
        </group>
      </a>
      <!--<a class="aCategory" style="position: relative;top: -4px;">
        <div v-on:click.stop.prevent="showCategoryMs">
          <span>类型</span>
          <span class="school-wx-icon arrowPoint" slot="icon" style="color: #cccccc;"></span>
        </div>
      </a>-->
      <a class="aProfession" style="width: 28%;position: relative;top: 2px;">
        <group>
          <popup-picker :data="categoryLists" @on-change="onChangeProfession">
            <span slot="title">
              <span class="aProfessionSpan">类型</span>
              <span class="school-wx-icon arrowPoint aProfessionSpan" slot="icon" style="color: #cccccc;"></span>
            </span>
          </popup-picker>
        </group>
      </a>
      <!--<a class="aCategory" style="position: relative;top: -4px;">
        <div v-on:click.stop.prevent="showObjectMs">
          <span>参赛对象</span>
          <span class="school-wx-icon arrowPoint" slot="icon" style="color: #cccccc;"></span>
        </div>
      </a>-->
      <a class="aProfession" style="width: 34%;position: relative;top: 2px;">
        <group>
          <popup-picker :data="objectLists" @on-change="onChangeProfession">
            <span slot="title">
              <span class="aProfessionSpan">参赛对象</span>
              <span class="school-wx-icon arrowPoint aProfessionSpan" slot="icon" style="color: #cccccc;"></span>
            </span>
          </popup-picker>
        </group>
      </a>
    </div>
    <group class="stuSkillGroup" :title="skillData">
      <cell>
        <span slot="after-title" class="vux-label">
          <span style="position: absolute;display: block;width: 100%;">
            <span class="school-wx-icon" slot="icon" style="color: #D2CEC8;float: right;font-size: 60px;padding-right: 30px;margin-top: -10px;">&#xe617;</span>
          </span>
          <div class="firstLine-stuSkill">
            <span>电子产品安装与调试</span>
            <a class="firsta1">个人</a>
          </div>
          <span class="secondLIne-stuSkill">竞赛时间：2017年11月19-20日</span>
          <span class="thirdLine-stuSkill">竞赛地点：萧山技师学院</span>
        </span>
      </cell>
    </group>
    <group :title="skillData2">
      <cell>
        <span slot="after-title" class="vux-label">
          <span style="position: absolute;display: block;width: 100%;">
            <span class="school-wx-icon" slot="icon" style="color: #D2CEC8;float: right;font-size: 60px;padding-right: 30px;margin-top: -10px;">&#xe617;</span>
          </span>
          <div class="firstLine-stuSkill">
            <span>机电一体化设备组装与调试</span>
            <a class="firsta2">团体（每组2人)</a>
          </div>
          <span class="secondLIne-stuSkill">竞赛时间：2017年11月19-20日</span>
          <span class="thirdLine-stuSkill">竞赛地点：萧山技师学院</span>
        </span>
      </cell>
    </group>
    <!--<actionsheet v-model="showCategoryMsg" :menus="categoryLists" show-cancel @on-click-menu="getCategoryVal"></actionsheet>-->
    <!--<actionsheet v-model="showObjectMsg" :menus="objectLists" show-cancel @on-click-menu="getObjectVal"></actionsheet>-->
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  /*import Actionsheet from 'vux/src/components/actionsheet/index.vue'*/
  export default {
    name: "tesSkillContest",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      PopupPicker
    },
    methods: {
      onChangeProfession (val) {
        console.log(val[0]);
      }
      // 下面的面板是否出现，选择类型值
      /*showCategoryMs () {
        this.showCategoryMsg = !this.showCategoryMsg;
      },*/
      /*选择类型的值*/
      /*getCategoryVal (key, item) {
        console.log(item); // 类型的值
      },*/
      // 下面的面板是否出现，选择参赛对象值
      /*showObjectMs () {
        this.showObjectMsg = !this.showObjectMsg;
      },*/
     /*选择类型的值*/
      /*getObjectVal (key, item) {
        console.log(item); // 类型的值
      }*/
    },
    data () {
      return {
        loading: false,
        showCategoryMsg: false, // 是否显示类型
        showObjectMsg: false, // 参赛对象
        skillData: '电子电工技术',
        skillData2: '汽车运用与维修',
        professionLst: [['现代物流', '汽车运用与维修', '服装设计制作']],
        /*categoryLists: ["个人", "团体"],*/ // 类型数组
        categoryLists: [['个人', '团体']],
        /*objectLists: ["学生", "老师"]*/ // 类型数组
        objectLists: [['学生', '老师']]
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
    width: 31%;
    text-align: center;
    font-size: 14px;
  }
  .teaSkillContest .aProfession{
    position: relative;
    top: 11px;
  }
  .teaSkillContest .aProfession .aProfessionSpan{
    display: inline-block;
    position: relative;
    top: 0;
    padding-right: 6px;

  }
 /* .teaSkillContest .aObject span,
  .teaSkillContest .aCategory span{
    display: inline-block;
    padding: 8px 4px;
  }*/
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
