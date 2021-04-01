<template>
  <div class="payList eachPgBase">
    <div class="selectStyle" v-if="seleYear !== ''">

      <a class="aTab" style="width: 30%;position: relative;top: 2px;">
        <group>
          <popup-picker :data="picketYearLists" @on-change="onChangeYear">
            <span slot="title">
              <span class="aTab">{{seleYear}}年</span>
              <span class="school-wx-icon arrowPoint aTabSpan" slot="icon" style="color: #cccccc;"></span>
            </span>
          </popup-picker>
        </group>
      </a>
      <a class="aTab" style="width: 30%;position: relative;top: 2px;">
        <group>
          <popup-picker :data="picketMonthLst" @on-change="onChangeMonth">
            <span slot="title">
              <span class="aTab">{{seleMonth}}月</span>
              <span class="school-wx-icon arrowPoint aTabSpan" slot="icon" style="color: #cccccc;"></span>
            </span>
          </popup-picker>
        </group>
      </a>
    </div>
    <group v-if="seleMonth !== ''">
      <!--隐藏合计以及合计数量 start-->
      <div v-if="showPayrollTotal">
        <cell :title="'总计：'" :value="wages+ '元'" class="allTotal" v-if="showPayrollTotal"></cell>
        <cell class="wageTypeInfo"
              is-link
              :key="item.subject"
              :title="item.subject"
              :value="item.total + '元'"
              :arrow-direction="item.isTipArr ? 'up' : 'down'"
              v-for="(item,index) in wageTypeLst"
              @click.native="isShowDetailMsg(item.subject, index, item.isTipArr), isTip(index)" >
          <div slot="after-title" class="tipTitle">(请点击查看工资明细)</div>
        </cell>
      </div>
      <!--隐藏合计以及合计数量 start-->
      <cell class="wageTypeInfo"
            is-link
            :key="item.subject"
            :title="item.subject"
            :arrow-direction="item.isTipArr ? 'up' : 'down'"
            v-for="(item,index) in wageTypeLst"
            v-else
            @click.native="isShowDetailMsg(item.subject, index, item.isTipArr), isTip(index)" >
        <div slot="after-title" class="tipTitle">(请点击查看工资明细)</div>
      </cell>
      <cell
        is-link
        :title="'细项'"
        :arrow-direction="detaisTipArrow ? 'up' : 'down'"
        @click.native="isShowDetailMsg('', 4, detaisTipArrow), isDetailTip()" >
        <div slot="after-title" class="tipTitle">(请点击查看工资明细)</div>
      </cell>
    </group>
      <div class="detailMsg"  style="background:#fff;" v-show="isShowDetail">
        <cell :title="currWageType+'细项'" class="wageTypeInfoMsg"></cell>
        <div v-if="this.detailLst.length>0">
          <!--显示合计 start-->
          <cell
            ref="detailInfoMsg"
            :class="{Remarks: detaiItem.itemName === '备注'}"
            :key="index1" :title="detaiItem.itemName"
            :value="detaiItem.itemValue + printfValue(detaiItem)"
            v-if="showPayrollTotal"
            v-for="(detaiItem,index1) in detailLst">
          </cell>
          <!--显示合计 end-->
          <!--不显示合计 start-->
          <cell
            ref="detailInfoMsg"
            :class="{Remarks: detaiItem.itemName === '备注'}"
            :key="index1" :title="detaiItem.itemName"
            :value="detaiItem.itemValue + printfValue(detaiItem)"
            v-if="!showPayrollTotal && detaiItem.itemName !== '合计'"
            v-for="(detaiItem,index1) in detailLst">
          </cell>
          <!--不显示合计 end-->
        </div>
      </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  /*import Actionsheet from 'vux/src/components/actionsheet/index.vue'*/

  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  export default {
    name: "payrollList",
    components: {
      Group,
      Cell,
      PopupPicker
    },
    methods: {
      printfValue (data) {
        if (data.itemName.indexOf('天')> 0){
          return '天'
        }
        switch (data.itemName) {
          case '备注':
            return ''
            break
          case '绩效系数':
            return ''
            break
          case '管理岗位绩效系数':
            return ''
            break
        }
        return '元'
      },
      // 选择年份
      onChangeYear (val) {
        this.seleYear = val[0];
        this.wages = 0;
        this.getEmployeeMonthDataList(); //调用根据年份 获取教师工资月份接口
      },
      // 选择月份
      onChangeMonth (val) {
        //console.log("选择月份=>", val)
        this.seleMonth = val[0];
        this.wages = 0;
        this.GetEmployeeWageTypeData();
      },
      // 下面的面板是否出现，选择年份
      showYearMsg () {
        this.isShowYear = !this.isShowYear;
      },
      //是否显示 明细项
      isShowDetailMsg (val, idx, upOrDown){
        //console.log('是否显示 明细项', val, idx, upOrDown)
        if (this.cellIndex === idx && this.isShowDetail) {
          this.isShowDetail = false
        } else {
          this.cellIndex = idx
          this.isShowDetail = true
        }
        // 判断点击值是否一致. 点击项不一致切下拉状态为true 调用接口
        if (idx !== this.oldSelectIdx && upOrDown){
          this.getEmployeeWageDetail(val); //工资单详细
          this.oldSelectIdx = idx;
        }
        this.currWageType = val;
      },
      // 每项工资详细
      isTip(idx){
        // console.log(idx)
        this.wageTypeLst[idx].isTipArr = !this.wageTypeLst[idx].isTipArr;
        for (let l=0; l<this.wageTypeLst.length; l++){
          if (l !== idx){
            this.wageTypeLst[l].isTipArr = true;
          }
        }
      },
      //详细图标
      isDetailTip(){
        for (let k=0; k<this.wageTypeLst.length; k++){
          this.$set(this.wageTypeLst[k], 'isTipArr', true)
        }
        this.detaisTipArrow = !this.detaisTipArrow;
      },
      // 根据年份 获取教师工资月份数据列表
      async getEmployeeMonthDataList () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'EmployeeWageMonthDataList', year: this.seleYear});
        if (d.status && d.status === "error") {
          this.QD.alert("", `获取数据失败:${d.msg}`);
        }
        this.picketMonthLst=[];
        this.monthLists=[];
        //console.log("获取教师工资月份数据列表=", d)
        for (let i=0; i<d.length; i++){
          if (this.monthLists.indexOf(d[i].Month) === -1){
            this.monthLists.push(d[i].Month); // 得到月份数据
          }
        }
        //console.log(this.monthLists, "月份数据")
        if (sessionStorage.getItem("payrollSeleMonth") !== null) {
          this.seleMonth = sessionStorage.getItem("payrollSeleMonth");
          sessionStorage.removeItem("payrollSeleMonth");
        } else {
          this.seleMonth = this.monthLists[this.monthLists.length-1];
        }
        this.picketMonthLst.push(this.monthLists);
        this.GetEmployeeWageTypeData();
      },
      // 获取教师工资年份数据列表
      async getEmployeeWageYearDataList () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'EmployeeWageYearDataList'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        this.yearLists = [];
        this.picketYearLists = [];
        //console.log("获取教师工资年份数据列表", d)
        if (d.length > 0) {
          for (let i=0; i<d.length; i++){
            this.yearLists.push(d[i].Year); // 得到年份数据
          }
          if (sessionStorage.getItem("payrollSeleYear") !== null) {
            this.seleYear = sessionStorage.getItem("payrollSeleYear");
            sessionStorage.removeItem("payrollSeleYear");
          } else {
            this.seleYear = this.yearLists[0];
          }
          this.picketYearLists.push(this.yearLists);
          this.getEmployeeMonthDataList();
        }
        //console.log(this.picketMonthLst, "年份数据")
      },
      // 根据年月筛选获取教师工资类别信息
      async GetEmployeeWageTypeData () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetEmployeeWageTypeData', year: this.seleYear, month: this.seleMonth});
        if (d.status && d.status === "error") {
          this.QD.alert("获取数据失败:", `${d.msg}`);
          return;
        }
        for (let j=0; j<d.data.length; j++){
          this.$set(d.data[j], 'isTipArr', true)
        }
        this.wageTypeLst = d.data;
        //console.log("根据年月筛选获取教师工资类别信息", this.wageTypeLst)
        for (let i =0; i<this.wageTypeLst.length; i++){
          let cWage = (this.wageTypeLst[i].total*100);
          this.wages += cWage;
        }
        this.wages = this.wages/100;
      },
      // 获取工资单详细方法
      async getEmployeeWageDetail (val){
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetEmployeeWageDetailData', year: this.seleYear, month: this.seleMonth, wageType: val});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        //console.log("获取工资单详细方法", d);
        this.detailLst = d.data;
      }
    },
    created() {
      if (this.QD.showPayrollTotal){
        this.showPayrollTotal = true
      }
      this.getEmployeeWageYearDataList(); // 获取教师工资年份数据列表
    },
    data () {
      return {
        isShowYear: false, // 是否显示年份面板
        isShowDetail: false, // 是否显示详细信息
        detaisTipArrow: true, // 详细图标
        showPayrollTotal: false, // 是否显示工资单合计
        currWageType: '',  // 当前点击的类别项
        wageTypeLst: [], //工资类别
        wages: 0, //总计
        monthLists: [], // 教师月数据列表 的数组
        picketMonthLst: [], // 下拉出现的月份
        yearLists: [], // 教师年份数据列表 的数组
        picketYearLists: [],
        seleYear: '', // 选择年
        seleMonth: '',  // 选择月
        detailLst: [],
        cellIndex: null, // 当前展开项id
        oldSelectIdx: -1 // 旧的index数据
      }
    }
  }
</script>
<style scoped lang="less">
  .payList .wageLst{
    padding: 10px 15px;
    color: #333;
    font-size: 14px;
    border-bottom:1px solid #f5f0f0;
    span:nth-child(2){
      position:absolute;
      right:56px;
      color:#999;
    }
    .jiantou{
      display:inline-block;
      float:right!important;
      color:#999;
    }
  }
  .payList .selectStyle{
    padding: 0 4px 0 12px;
    color: #999999;
    background-color: #fff;
  }
  .payList .selectStyle a{
    display: inline-block;
    text-align: center;
    font-size: 14px;
  }
  .payList .aTab{
    position: relative;
    top: 0;
  }
  .payList .aTab .aTabSpan{
    display: inline-block;
    position: relative;
    top: 0;
    padding-right: 6px;

  }
  .payList .selectStyle .arrowPoint:before{
    content: '\e61c';
  }
  .payList .detailMsg{
    background:#fff;
    margin-top:10px;
  }
  .payList .detailMsg .weui-cell:before{
    display: none;
  }
  .payList .allTotal,.payList .detailMsg .wageTypeInfoMsg{
    font-weight: bold;
    font-size:16px!important;
    color:#333;
  }
  /*标题提示 start*/
  .tipTitle{
    display: inline-block;
    font-size: 12px;
  }
  /*标题提示 end*/
  .payList .weui-cell_switch label{
    font-size: 16px;
  }
  .payList .weui-cell_switch label:nth-child(1){
    color: #333333;
  }
  .payList .weui-cell_switch label:nth-child(2){
    float:right;
    color: #666666;
  }
</style>
<style>
  .payList .wageTypeInfo .weui-cell__ft{
    padding-right:0!important;
  }
  .payList .selectStyle .weui-cell{
    padding: 0;
  }
  .payList .selectStyle .aTab .weui-cells{
    margin-top: 0;
    font-size: 14px;
  }
  .payList .selectStyle .aTab .weui-cell__ft:after{
    width: 0;
    height: 0;
    border-width: 0;
  }
  .payList .weui-cells{
    margin-top: 0;
  }
  .payList .vux-label {
    font-size: 14px;
    color: #333333;
  }
  .payList .weui-cell_access .weui-cell__ft {
    font-size: 14px;
  }
  /*箭头*/
  .weui-cell_access .weui-cell__ft.vux-cell-arrow-down:after,
  .weui-cell_access .weui-cell__ft.vux-cell-arrow-up:after{
    position:relative;
    margin-left:10px;
  }
  .payList .allTotal .weui-cell__ft,
  .payList .allTotal .vux-label{
    color:#333!important;
  }
  /*备注*/
  .payList .detailMsg .Remarks{
    align-items: inherit;
  }
  .payList .detailMsg .Remarks .weui-cell__ft{
    width:80%;
  }
  .payList .allTotal .vux-label{
    font-size:16px;
  }
</style>
