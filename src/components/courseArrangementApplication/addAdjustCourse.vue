<template>
  <div class="addAdjustCourse">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group style="margin-bottom: 60px;">
      <datetime
        v-model="startTime"
        @on-change="startTimechange"
        title="开始时间"
        @on-cancel="log('cancel')"
        @on-confirm="log('confirm')"
        @on-hide="log('hide', $event)">
      </datetime>
      <datetime
        v-model="endTime"
        @on-change="endTimechange"
        title="结束时间"
        @on-cancel="log('cancel')"
        @on-confirm="log('confirm')"
        @on-hide="log('hide', $event)">
      </datetime>
      <cell>
        <span slot="after-title" class="vux-label">
          <span style="position: relative; display: inline-block;" v-for="n in totalNode">
            <span :class="`school-wx-icon courseWordColor icon-desk${courseArr[n-1]===1? ' selectedWordColor':''}`"  slot="icon"  v-on:click="chooseCourse(n)"><span>第{{n}}节</span></span>
            <span style="position: absolute;left: 10px;top: 16px;width: 30px;line-height: 15px;font-size: 4px;color: #000;display: none;">第{{n}}节</span>
          </span>
           <!--<span v-for="n in 7" class="school-wx-icon courseWordColor"  slot="icon" v-on:click="chooseCourse($event, n)">&#xe604;
             <span style="position: absolute;left: 8px;top: 8px;width: 30px;line-height: 15px;font-size: 4px;display: inline;">第{{n}}节课</span>
           </span>-->
        </span>
      </cell>
      <cell is-link>
        <span slot="after-title" class="vux-label">
         <span>调课类别</span>
        </span>
        <span slot="default">
          <span class="rg-cell" v-on:click.stop.prevent="showTypeMsg">{{typeValue}}</span>
        </span>
      </cell>
      <cell is-link>
        <span slot="after-title" class="vux-label">
         <span>事由类别</span>
        </span>
        <span slot="default">
          <span class="rg-cell" v-on:click.stop.prevent="showReasonTypeMsg">{{ReasonTypeValue}}</span>
        </span>
      </cell>
      <x-textarea placeholder="请填写备注" :show-counter="false" :rows="1" autosize v-model="ReasonRemarks"></x-textarea>
    </group>
    <div v-transfer-dom>
      <actionsheet v-model="showTypePanel" :menus="typeLists" show-cancel @on-click-menu="getValue"></actionsheet>
      <actionsheet v-model="showReasonTypePanel" :menus="reasonTypeLists" show-cancel @on-click-menu="getReasonTypeValue"></actionsheet>
    </div>
    <div class="btn-box">
      <x-button @click.native="addSubmit" type="primary" class="btn-save" mini>提交</x-button>
    </div>
  </div>
</template>
<script>
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'

  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  export default {
    name: 'addAdjustCourse',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      XTextarea,
      Actionsheet,
      Datetime,
      Cell,
      Group,
      XButton
    },
    methods: {
      // 下面的面板是否出现，选择调课类别值
      showTypeMsg () {
        this.showTypePanel = !this.showTypePanel;
      },
      // 下面的面板是否出现，选择事由类别值
      showReasonTypeMsg () {
        this.showReasonTypePanel = !this.showReasonTypePanel;
      },
      log (str1, str2 = '') {
        console.log(str1, str2)
      },
      // 当开始时间值改变是触发事件
      startTimechange (value) {
        this.startTime = value;
      },
      // 当结束时间值改变是触发事件
      endTimechange (value) {
        this.endTime = value;
      },
      // 当选定调课类别值时，得到 相应状态
      getValue (key, item) {
        if (item !== undefined && item !== this.typeValue) {
          this.typeValue = item;
          if (this.typeValue === '调老师') {
            this.typeNum = 1;
          }
          if (this.typeValue === '调教师') {
            this.typeNum = 2;
          }
          if (this.typeValue === '调时间') {
            this.typeNum = 3;
          }
        }
      },
      // 当选定事由类别值时，得到 相应状态
      getReasonTypeValue (key, item) {
        if (item !== undefined && item !== this.typeValue) {
          this.ReasonTypeValue = item;
          if (this.ReasonTypeValue === '私事') {
            this.reasonTypeNum = 1;
          }
          if (this.ReasonTypeValue === '公事') {
            this.reasonTypeNum = 2;
          }
        }
      },
      chooseCourse(num) {
        this.courseArr[num-1] = this.courseArr[num-1] === 1 ? 0 : 1;
        this.$set(this.courseArr, num-1, this.courseArr[num-1]);
//        if (e.target.className.indexOf("selectedWordColor") === -1){
//          e.target.className = "school-wx-icon courseWordColor icon-desk selectedWordColor"; //切换按钮样式
//          this.courseArr[num-1] = 1;
//          console.log(this.courseArr);
//        } else {
//          e.target.className = "school-wx-icon courseWordColor icon-desk";//切换按钮样式
//          this.courseArr[num-1] = 0;
//          console.log(`.....`);
//          console.log(this.courseArr);
//          console.log(`-------`);
//        }
      },
      async addSubmit () {
        let nodesString = '';
        for (let i=0; i<this.courseArr.length; i++) {
          if (this.courseArr[i] === 1) {
            if (nodesString !== ''){
              nodesString = nodesString + ',' + (i+1);
            } else {
              nodesString = nodesString + (i+1);
            }
          }
        }
        if (this.startTime === '请选择（必填）'|| this.endTime === '请选择（必填）'){
          this.QD.alert('', '请选择时间');
          return;
        }
        if (nodesString === ''){
          this.QD.alert('', '请选择课节次');
          return;
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'addLeaveAdjustCourse',
          UserId: this.QD.getLocalUserinfo().stuObj.UserId,
          StartDate: this.startTime,
          EndDate: this.endTime,
          LeaveRange: this.typeNum,
          ReasonType: this.reasonTypeNum,
          Nodes: nodesString,
          Reasons: this.ReasonRemarks
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log('登记失败', d.msg);
          this.QD.alert('', '登记失败！');
          return;
        }
        if (d > 0){
          this.$router.go(-1);
        } else if (d === -1) {
          this.QD.alert('', '无法获取审批流程！');
        } else if (d === -2) {
          this.QD.alert('', '登录用户与调课申请的用户不一致，无法进行调课申请！');
        } else if (d=== -3){
          this.QD.alert('', '无法获取相关联的教职工，请检查当前用户是否合法！');
        } else if (d === -4){
          this.QD.alert('', '无法获取默认的学期，请设置默认学期！');
        } else {
          this.QD.alert('', '登记失败！');
        }
      },
      // 默认学期下的每天节次
      async getNodesData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetDefaultSemesterNodes'
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        console.log(d);
        this.totalNode = d;
      }
    },
    created () {
      this.getNodesData(); // 默认学期下的每天节次
    },
    data () {
      return {
        loading: false,
        totalNode: 7, // 默认学期下的节次
        startTime: '请选择（必填）',
        endTime: '请选择（必填）',
        showTypePanel: false, // 调课类别是否出现
        showReasonTypePanel: false, // 事由类别面板是否出现
        typeLists: ["调老师", "调教室", "调时间"], // 类别(调老师=1，调教室=2，调时间=3)
        typeNum: 3, // 调时间=3
        reasonTypeLists: ["私事", "公事"], // 私事=1，公事=2
        reasonTypeNum: 2, // 公事=2
        typeValue: '调时间', // 调课类别赋值
        ReasonTypeValue: '公事', // 事由类别赋值
        ReasonRemarks: '', // 调课备注
        courseArr: [0, 0, 0, 0, 0, 0, 0] //课堂节次
      }
    }
  }
</script>
<style scoped>
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
  .btn-save{
    width: 100%;
    height: 40px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
  }
</style>
<style>
  .addAdjustCourse .weui-cells{ margin-top:0;}
  .addAdjustCourse .weui-cells .vux-datetime div p{
    color: #333333;
  }
  .addAdjustCourse .weui-cells .vux-datetime .vux-datetime-value .vux-cell-value{
    font-size: 16px;
    color: #666666;
  }
  .addAdjustCourse .weui-cell .vux-cell-primay p .vux-label span{
    font-size: 16px;
    color: #333333;
  }
  .addAdjustCourse .weui-cell .weui-cell__ft .rg-cell{
    padding-right: 10px;
    font-size: 16px;
    color: #666666;
  }
  .addAdjustCourse .vux-x-textarea.weui-cell .weui-cell__bd textarea{
    font-size: 14px;
    color: #333333;
  }
  /*没选择节次课前的字体颜色*/
  .addAdjustCourse .weui-cell .vux-label .courseWordColor{
    position: relative;
    /*padding-right:0;*/
    width:35px;
    height:40px;
    padding-right:5px;

    color: #555;
    display:block;
  }
  /*选择节次课改变字体颜色*/
  .addAdjustCourse .weui-cell .vux-label .selectedWordColor {
    color: #fff;
  }
  /*状态值面板*/
  .addAdjustCourse .weui-actionsheet__menu .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
  .addAdjustCourse .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
  .addAdjustCourse .weui-cell .vux-label .icon-desk:before{
    font-size: 38px;
    content: '\e632';
    color: #bdc0c3;
    position: absolute;
    top: -10px;
    z-index:0;
  }
  .addAdjustCourse .weui-cell .vux-label .selectedWordColor.icon-desk:before{
    color: #ff332f;
  }
  .addAdjustCourse .weui-cell .vux-label .icon-desk > span{
    position:absolute;
    font-size: 8px;
    z-index:1;
    text-align: center;
    width:40px;
    line-height: 36px;
    color: #333333;
  }
</style>
