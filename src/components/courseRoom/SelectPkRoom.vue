<template>
  <div class="select-pk-room">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="select-box">
      <div class="select-one-box">
        <a class="category_title">教室类型<span class="school-wx-icon arrow_icon">&#xe638;</span></a>
        <scroller :lock-x="true" :scrollbar-y="true" height="-116" style="padding-top: 19px;">
          <div>
            <a v-for="(r, ridx) in firstRowLst" :key="ridx" @click.stop.prevent="clickFirstRow(r, ridx)" :class="{ 'selectColorA': ridx === selectRowIdx.firstIdx }">{{r.lxmc}}</a>
          </div>
        </scroller>
      </div>
      <div class="select-two-box">
        <a class="category_title">教室名称<span class="school-wx-icon arrow_icon">&#xe638;</span></a>
        <scroller :lock-x="true" :scrollbar-y="true" height="-116" style="padding-top: 19px;">
          <div>
            <a v-for="(r, ridx) in secondRowLst" :key="ridx" @click.stop.prevent="clickSecondRow(r, ridx)" :class="{ 'selectColorA': ridx === selectRowIdx.secondIdx }">{{r.jsmc}}</a>
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
    name: "selectPkRoom",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      Scroller
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        firstRowLst: [], // 第一列，教室类型
        secondRowLst: [], // 第二列，教室
        selectInfo: {type: null, room: null}, // 选择的教室信息
        selectRowIdx: {firstIdx: 0, secondIdx: -1} // 第一列和第二列的背景颜色选中的样式
      }
    },
    created () {
      this.getClassroomTypeData(); // 得到教室类型数据
    },
    methods: {
      // 点击第一列
      clickFirstRow (r, rIdx) {
        this.selectInfo.type = r; // 记录选中的教室类别信息
        this.selectRowIdx.firstIdx = rIdx;
        this.selectRowIdx.secondIdx = -1; // 后面的初始化为未选中
        this.getClassroomDataById(r.lxid); // 根据教室类型id 得到教室列表数据
      },
      // 点击第二列
      clickSecondRow (r, rIdx) {
        this.selectInfo.room = r; // 记录选中的教室信息
        this.selectRowIdx.secondIdx = rIdx;
        this.QD.otherPageData = {selectRoomInfo: this.selectInfo, selectRowIdx: this.selectRowIdx};
        if (this.backLoaded) { // 返回到上一个页面（教室课表）
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 得到教室类型数据
      async getClassroomTypeData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassroomTypeData'});
        this.loading = false;
        d = JSON.parse(d);
        console.log('room type', d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取教室类型失败`);
          console.log(d.msg);
          return;
        }
        this.firstRowLst = d.data;
        if (this.firstRowLst.length > 0) {
          if (this.QD.otherPageData && this.QD.otherPageData.selectRoomInfo) { // 之前有选中的值
            this.selectInfo = this.QD.otherPageData.selectRoomInfo;
            this.selectRowIdx = this.QD.otherPageData.selectRowIdx;
            this.QD.otherPageData = null;
            this.getClassroomDataById(this.selectInfo.type.lxid); // 根据教室类型id 得到教室列表数据
          } else {
            this.getClassroomDataById(this.firstRowLst[0].lxid); // 根据教室类型id 得到教室列表数据
          }
        }
      },
      // 根据教室类型id 得到教室列表数据
      async getClassroomDataById (id) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassroomDataById', roomTypeId: id});
        this.loading = false;
        console.log("room = ", d);
        d = JSON.parse(d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取教室类型失败`);
          console.log(d.msg);
          return;
        }
        this.secondRowLst = d.data;
      }
    }
  }
</script>
<style scoped>
  .select-pk-room{
    background-color: #ffffff;
  }
  .select-box>div{
    float: left;
    background-color:#ffffff;
  }
  .select-one-box .selectColorA,
  .select-two-box .selectColorA{
    color: #ffa500;
    background-color: #f2f2f2;
  }
  .select-one-box{
    width: 60%;
    border-right: 1px solid #f2f2f2;
  }
  .select-two-box{
    width: 38%;
    border-left: 1px solid #f2f2f2;
  }
  .select-one-box a{
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
  .select-two-box a{
    display: inline-block;
    width: 100%;
    text-align: center;
    line-height: 1.41176471;
    padding: 10px 2px;
    font-size: 14px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
</style>
