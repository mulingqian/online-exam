<template>
  <div class="freeClassRoomLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="search_box">
      <x-input placeholder="请输入教室名称或教室编码" v-model="jsmcOrJsdm" v-on:input="searchRoom">
        <x-button slot="right" type="primary" mini @click.native="searchRoom">搜索</x-button>
      </x-input>
    </div>
    <divider v-if="loaded && searchRoomInfo.length === 0" class="noData_field">无可选教室</divider>
    <div v-if="searchRoomInfo.length > 0" class="all_field">
      <div class="room-box" v-for="(r, ridx) in searchRoomInfo" :key="ridx" @click.stop.prevent="changeSelectVal(r, ridx)">
        <div class="left">
          <span v-if="!r.isSelected" class="school-wx-icon circleIcon_no">&#xe65d;</span>
          <span v-if="r.isSelected" class="school-wx-icon circleIcon_select">&#xe659;</span>
        </div>
        <div>
          <span class="orderNumber">{{ridx + 1}}</span>
        </div>
        <div class="right">
          <p class="primary-line">{{r.JSMC}}<span class="jsdm_mc">({{r.JSDM}})</span></p>
          <p class="desc-line">容纳人数: {{r.RNRS}}</p>
        </div>
      </div>
    </div>
    <div v-if="applyInfo" class="btn-box">
      <span class="btn-desc">已选择: {{selectInfo.length}}</span>
      <x-button @click.native="sureBtn" :class="`sure-btn ${selectInfo.length === 0 ? 'noCanClickBtn' : ''}`" type="primary" mini>确定({{selectInfo.length}}/{{applyInfo.RoomNum}})</x-button>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import ExScroller from '../common/ExScroller.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  export default {
    name: 'borrowClassroom-freeClassRoomLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      ExScroller,
      Group,
      Cell,
      XButton,
      XInput,
      Divider
    },
    methods: {
      // 确定选中的教室
      sureBtn () {
        if (this.selectInfo.length === 0) { // 选择的教室数量为0
          return;
        }
        this.QD.otherPageData = this.selectInfo;
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 搜索教室名称或教室代码
      searchRoom () {
        // console.log('jsmcOrJsdm', this.jsmcOrJsdm);
        let result = [];
        if (this.jsmcOrJsdm !== '') {
          for (let i = 0; i < this.roomInfo.length; i++) {
            if (this.roomInfo[i].JSMC.indexOf(this.jsmcOrJsdm) >= 0 || this.roomInfo[i].JSDM.indexOf(this.jsmcOrJsdm) >= 0) {
              result.push(this.roomInfo[i]);
            }
          }
        } else {
          result = this.roomInfo;
        }
        this.searchRoomInfo = result;
      },
      // 选择教室值- 选中或不选中
      changeSelectVal (v, vIdx) {
        if (!v.isSelected) { // 之前没有选中，现在选中
          if (this.applyInfo.RoomNum <= this.selectInfo.length) {
            this.QD.alert('', '选择的教室数超过了借用申请使用的教室数量');
            return;
          }
          this.selectInfo.push(v);
        } else { // 之前选中，现在不选中
          for (let i=0; i<this.selectInfo.length; i++) {
            if (this.selectInfo[i].JSDM === v.JSDM) {
              this.selectInfo.splice(i, 1); // 去掉
            }
          }
        }
        this.searchRoomInfo[vIdx].isSelected = !this.searchRoomInfo[vIdx].isSelected;
        this.$set(this.searchRoomInfo, vIdx, this.searchRoomInfo[vIdx]);
      },
      // 得到可选教室的信息
      async getRoomInfo () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'RoomBorrowApplyClassRoomData',
          objData: JSON.stringify(this.queryCondition)
        });
        this.loading = false;
        this.loaded = true;
        if (d.status && d.status === "error") {
          console.log(`${d.msg}`);
          return;
        }
        console.log("room", d);
        this.roomInfo = d.data;
        for (let i=0; i<this.roomInfo.length; i++) {
          this.roomInfo[i]['isSelected'] = false; // 开始默认没有选中教室
        }
        for (let i=0; i<this.selectInfo.length; i++) {
          let isHas = false; // 之前选中的教室，按现在的条件查询已找不到选中的教室了，需要删除
          for (let k=0; k<this.roomInfo.length; k++) {
            if (this.roomInfo[k].JSID === this.selectInfo[i].JSID) {
              this.roomInfo[k].isSelected = true;
              isHas = true;
              break;
            }
          }
          if (!isHas) {
            this.selectInfo.splice(i, 1); // 按现在的条件查询已找不到选中的教室了，删除
            i--;
          }
        }
        /* 查询得到的空闲教室 - 开始默认是全部 */
        this.searchRoomInfo = this.roomInfo;
      },
      // 得到获取可选教室的接口查询条件
      getQueryCondition () {
        if (this.QD.brotherPageData) {
          this.selectInfo = this.QD.brotherPageData.selectInfo; // 之前选中的教室信息- 有可能是 [] 的
          let obj = this.QD.brotherPageData.applyInfo;
          this.queryCondition = {
            SemId: obj.SemId,
            StartDay: obj.StartDay,
            EndDay: obj.EndDay,
            DayOfWeeks: obj.DayOfWeeks,
            UseNodes: obj.UseNodes,
            RoomType: obj.RoomType,
            RSRequire: obj.RSRequire,
            WeekList: obj.WeekList
          };
          this.applyInfo = this.queryCondition;
          this.applyInfo['RoomNum'] = obj.RoomNum;
          this.QD.brotherPageData = null;
          this.getRoomInfo(); // 得到可选教室的信息
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getQueryCondition(); // 得到获取可选教室的接口查询条件
    },
    data () {
      return {
        loading: false,
        loaded: false,
        backLoaded: true,
        applyInfo: null, // 教室申请的所有信息
        queryCondition: null, // 查询条件- 获取教室的查询条件
        roomInfo: [], // 可选教室信息-all
        searchRoomInfo: [], // 查询得到的空闲教室
        selectInfo: [], // 选中的所有教室信息
        jsmcOrJsdm: '' // 搜索出来的教室名称或教室代码
      }
    }
  }
</script>
<style scoped>
  div{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .freeClassRoomLst{
    background-color: #f2f2f2;
  }
  .search_box{
    position: absolute;
    width: 100%;
    z-index: 100;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
    background-color: #fff;
  }
  .noData_field{
    position: relative;
    top: 100px;
  }
  .all_field{
    position: relative;
    top: 50px;
    padding-bottom: 60px;
    padding-top: 10px;
    background-color: #f2f2f2;
  }
  .room-box{
    position: relative;
    width: 100%;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
  }
  .room-box>.left{
    padding: 10px 0 10px 15px;
  }
  .room-box>.right{
    padding: 10px 15px 10px 0;
  }
  .room-box>.right:before{
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 45px;
  }
  .circleIcon_no{
    font-size: 18px;
    color: #989494;
  }
  .circleIcon_select{
    font-size: 18px;
    color: #0f89e0;
  }
  .orderNumber{
    padding-right: 10px;
    color: #666;
    font-size: 14px;
  }
  .primary-line{
    font-size: 16px;
    color: #333;
    line-height: 1.41176471;
  }
  .jsdm_mc{
    display: inline-block;
    padding-left: 6px;
    font-size: 14px;
    color: #666;
  }
  .desc-line{
    font-size: 14px;
    color: #666;
    line-height: 1.41176471;
  }
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    border-top: 1px solid #f2f2f2;
    background-color: #fff;
  }
  .btn-desc{
    float: left;
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    color: #333;
    line-height: 29px;
  }
  .sure-btn{
    float: right;
    right: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .noCanClickBtn{
    background-color: #9fd2f6;
  }
</style>
