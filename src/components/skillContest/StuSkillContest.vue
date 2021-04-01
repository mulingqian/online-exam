<template>
  <div class="stuSkillContest">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <tab>
      <tab-item selected @on-item-click="stuSkillDatShow()">大赛查询</tab-item>
      <tab-item @on-item-click="stuSkillDatShow()">我的大赛</tab-item>
    </tab>
    <!--大赛查询-->
    <div v-show="showStuSkillData">
      <div style="position: relative;color: #ff721a;padding-top: 8px;padding-bottom: 8px;background-color:#f6f6e7;">
        <span class="school-wx-icon" slot="icon" style="padding-left: 4px;padding-right: 4px;color: #ff721a;">&#xe620;</span>
        <span style="font-size: 12px;">2017年中等职业学校师生职业能力大赛圆满结束</span>
        <span class="school-wx-icon" slot="icon" style="float: right;color: #ff721a;padding-top: 2px;">&#xe625;</span>
      </div>
      <group class="stuSkillGroup">
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
      <group>
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
    </div>
    <!--大赛查询end-->
    <!--我的大赛-->
    <div v-show="!showStuSkillData">
      <group class="stuSkillGroup" :title="skillData">
        <cell>
          <span slot="after-title" class="vux-label">
            <span style="position: absolute;display: block;width: 100%;">
              <span class="school-wx-icon" slot="icon" style="float: right;font-size: 30px;padding-right: 30px;margin-top: -16px;color: #f5b827;">&#xe61a;</span>
            </span>
            <div class="firstLine-stuSkill">
              <span>电子产品安装与调试（个人）</span>
            </div>
            <span class="secondLIne-stuSkill">指导教师：许连群 <span style="float: right;">成绩：91.2</span></span>
            <span class="thirdLine-stuSkill">竞赛时间：2017年11月19-20日</span>
            <span class="forthLine-stuSkill">竞赛地点：萧山技师学院</span>
          </span>
        </cell>
      </group>
      <group class="stuSkillGroup" :title="skillData">
        <cell>
          <span slot="after-title" class="vux-label">
            <span style="position: absolute;display: block;width: 100%;">
              <span class="school-wx-icon" slot="icon" style="float: right;font-size: 30px;padding-right: 30px;margin-top: -16px;color: #1271c6;">&#xe61b;</span>
            </span>
            <div class="firstLine-stuSkill">
              <span>电子安装与维修（团队）</span>
            </div>
            <span class="secondLIne-stuSkill">指导教师：张少波
              <span style="float: right;">成绩：87</span>
            </span>
            <span class="thirdLine-stuSkill">竞赛时间：2017年11月19-20日</span>
            <span class="forthLine-stuSkill">竞赛地点：萧山技师学院</span>
          </span>
        </cell>
      </group>
    </div>
    <!--我的大赛end-->
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: "stuSkillContest",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Tab,
      TabItem,
      Cell,
      Group
    },
    methods: {
      stuSkillDatShow () {
        this.showStuSkillData = !this.showStuSkillData;
      }
    },
    created () {
    },
    data () {
      return {
        loading: false,
        skillData: '2017年中等职业学校师生职业能力大赛',
        showStuSkillData: true
      }
    }
  }
</script>
<style scoped>
  .stuSkillContest{
    background: #f2f2f2;
  }
  .stuSkillContest .stuSkillGroup{
    position: relative;
  }
  .stuSkillContest .firstLine-stuSkill{
    padding-top: 4px;
    padding-bottom: 12px;
    font-size: 16px;
  }
  .stuSkillContest .firstLine-stuSkill span{
    margin-right: 15px;
  }
  .stuSkillContest .firstLine-stuSkill a{
    padding: 1px 8px;
    font-size: 12px;
    color: #fff;
    border-radius: 4px;
  }
  .stuSkillContest .firstLine-stuSkill .firsta1{
    display: inline-block;
    background-color: #ff721a;
  }
  .stuSkillContest .firstLine-stuSkill .firsta2{
    display: inline-block;
    background-color: #06a659;
    opacity:0.8;
  }
  .stuSkillContest .secondLIne-stuSkill,
  .stuSkillContest .thirdLine-stuSkill,
  .stuSkillContest .forthLine-stuSkill{
    display: block;
    font-size: 12px;
    color: #999999;
  }
</style>
<style>
  .stuSkillContest .stuSkillGroup .weui-cells{
    width:100%;
    margin-top:0;
  }
  .stuSkillContest .weui-cells__title{
    padding-left: 4px;
    padding-top: 4px;
    padding-bottom: 8px;
    color: #333333;
  }
</style>
