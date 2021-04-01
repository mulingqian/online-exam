<template>
  <div class="selectMEItems">
    <div class="seleMeExamItCont">
      <div class="select-one-field">
        <a>学分项目<span class="school-wx-icon" slot="icon" style="color:#333333;padding-right: 0;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="true" height="-95">
          <div>
            <a v-for="(s, sIdx) in xfProject" :key="sIdx" v-on:click.stop.prevent="selectOneWay(sIdx, s)"
               :class="{ 'selectBgColor':sIdx === selectOneInfo.idx }">{{s.ProjectName}}</a>
          </div>
        </scroller>
      </div>
      <div class="select-two-field">
        <a>学分细则<span class="school-wx-icon" slot="icon" style="color:#333333;padding-right: 0;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="true" height="-95" ref="scrollerLst" style="background-color: #f2f2f2;">
          <div>
            <a v-for="(s, sIdx) in xfProDetail" :key="sIdx" v-on:click.stop.prevent="selectTwoWay(sIdx, s)">
              <span class="selectedIcon" :class="`school-wx-icon ${s.selected === true ? 'selectIconColor' : 'defaultIcon'}`" slot="icon"></span>
              <span>{{s.ProjectName}}</span>
            </a>
            <span style="display: inline-block;height: 50px;width: 100%;"></span>
          </div>
        </scroller>
        <div class="finishSelect" @click="finishSelectStuData()"><a class="text">完成</a></div>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import { mapActions } from 'vuex'

  export default {
    name: 'selectMEItems',
    directives: {
      TransferDom
    },
    components: {
      Scroller
    },
    props: {
      // 原始选中的学分项目细则
      selectOriginInfo: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      // 点击 ‘完成’
      finishSelectStuData () {
        this.$emit('get-SelectVal', {itemInfo: this.selectTwoInfo});
      },
      // 获取学分项目
      async getMEStuXMProject() {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuXMProject'});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败`);
          console.log('学分项目', d.msg);
          return;
        }
        this.xfProject = d;
        if (this.xfProject.length > 0) {
          this.getMEDetail(d[0].ID);
        }
      },
      // 根据父ID（项目ID）获取学分细则信息
      async getMEDetail(pid) {
        this.xfProDetail = [];
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetUserMEProjectDetail', ParentID: pid});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败`);
          console.log('学分细则', d.msg);
          d = [];
        }
        this.xfProDetail = d;
        for (let i=0; i<this.xfProDetail.length; i++) {
          this.xfProDetail[i].selected = false; // 默认全部不选中
          this.xfProDetail[i].parent = this.xfProject[this.selectOneInfo.idx]; // 父级的信息
        }
        this.setSelectWay(); // 将已经选中的项设置为选中
        this.$nextTick(() => {
          this.$refs.scrollerLst.reset({top: 0})
        })
      },
      // 将已经选中的项设置为选中
      setSelectWay () {
        for (let i=0; i<this.selectTwoInfo.length; i++) {
          let si = this.selectTwoInfo[i];
          for (let k=0; k<this.xfProDetail.length; k++) {
            let sk = this.xfProDetail[k];
            if (si.ID === sk.ID) {
              sk.selected = true; // 设置选中
              break;
            }
          }
        }
      },
      // 点击学分项目事件
      selectOneWay(idx, item) {
        this.selectOneInfo.idx = idx;
        this.getMEDetail(item.ID);
      },
      // 点击学分细则事件
      selectTwoWay(idx, item) {
        this.xfProDetail[idx].selected = !this.xfProDetail[idx].selected; // 选中/不选中
        this.$set(this.xfProDetail, idx, this.xfProDetail[idx]);
        if (!this.xfProDetail[idx].selected) { // 现在不选中，将不选中的item 移除数组
          for (let i=0; i<this.selectTwoInfo.length; i++) {
            let si = this.selectTwoInfo[i];
            if (si.ID === this.xfProDetail[idx].ID) {
              this.selectTwoInfo.splice(i, 1); // 移除数组
              break;
            }
          }
        } else {
          this.selectTwoInfo.push(item); // 选择选中，将选中的item 放在数组内
        }
        console.log("selectTwo info", this.selectTwoInfo);
      },
      ...mapActions([
        'updateLoadingStatus'
      ])
    },
    created (){
      this.selectTwoInfo = this.selectOriginInfo; // 得到原始选中的学分项目细则
      this.getMEStuXMProject(); // 获取学分项目
    },
    data (){
      return {
        xfProject: [], // 学分项目信息
        xfProDetail: [], // 学分项目细则
        selectOneInfo: {idx: 0, info: null}, // 选中的学分项目信息
        selectTwoInfo: [] // 选中的学分项目细则
      }
    }
  }
</script>
<style>
  .selectMEItems .xs-container {
    margin-top: 0;
  }
</style>
<style scoped>
  .selectMEItems{
    background-color: #ffffff;
  }
  .seleMeExamItCont {
    overflow: hidden;
  }
  .selectMEItems .select-one-field{
    float: left;
    width:38%;
    background-color:#ffffff;
    border-right: 1px solid #f2f2f2;
  }
  .selectMEItems .select-one-field a{
    display: block;
    line-height: 1.41176471;
    text-align: center;
    padding:10px 15px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectMEItems .select-one-field .selectBgColor{
    background-color: #f2f2f2;
    color: #ffa500;
  }
  .selectMEItems .select-two-field{
    float: left;
    width:60%;
    background-color:#ffffff;
    border-left: 1px solid #f2f2f2;
  }
  .selectMEItems .select-two-field a{
    position: relative;
    display: block;
    text-align: center;
    line-height: 1.41176471;
    padding: 10px 15px 10px 31px;
    font-size: 14px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
  .defaultIcon:before{
    content: '\e62a';
  }
  .selectIconColor:before{
    content: '\e692';
  }
  .select-two-field .finishSelect{
    position: fixed;
    bottom:0;
    width: 60%;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
 .select-two-field .finishSelect .text{
    display: inline-block;
    padding: 8px 10px;
    font-size: 16px;
    line-height: 20px;
    color: #fff;
    border:0;
  }
  .selectedIcon{
    position: absolute;
    left: 10px;
    padding-right: 0;
    vertical-align: middle;
  }
</style>

