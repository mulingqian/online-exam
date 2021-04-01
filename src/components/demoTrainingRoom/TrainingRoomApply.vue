<template>
  <div class="sxsApply eachPgBase">
    <div class="eachPgBase">
      <group class="group">
        <datetime placeholder="请选择" format="YYYY-MM-DD HH:mm"  @on-change="changeStartDate"  v-model="datetime1">
          <div slot="title" class="dateIcon">
            <span class="school-wx-icon requireIcon">&#xe644;</span>
            <span>借用开始日期</span>
          </div>
        </datetime>
        <datetime placeholder="请选择" format="YYYY-MM-DD HH:mm"  @on-change="changeEndDate"  v-model="datetime2">
          <div slot="title" class="dateIcon">
            <span class="school-wx-icon requireIcon">&#xe644;</span>
            <span>借用结束日期</span>
          </div>
        </datetime>
      </group>
      <group>
        <div class="checker-field">
          <divider class="divider-title"><span class="school-wx-icon requireIcon">&#xe644;</span>借用星期</divider>
          <checker v-model="demo1Checkbox" type="checkbox" :default-item-class="'category-item-pad'"
                   :selected-item-class="'category-item-pad-selected'">
            <checker-item v-for="(item,index) in week" :value="item" :key="index">{{item}}</checker-item>
          </checker>
        </div>
      </group>
      <group>
        <div class="checker-field">
          <divider class="divider-title"><span class="school-wx-icon requireIcon">&#xe644;</span>借用节次</divider>
          <checker v-model="demo2Checkbox" type="checkbox" :default-item-class="'category-item-pad'"
                   :selected-item-class="'category-item-pad-selected'">
            <checker-item v-for="(item,index) in jc" :value="item" :key="index">{{item}}</checker-item>
          </checker>
        </div>
      </group>
      <group>
        <x-input type="number" placeholder="请输入申请数量" placeholder-align="right" text-align="right" v-model="input1">
          <div slot="label" >
            <span class="school-wx-icon requireIcon">&#xe644;</span>
            <span>申请数量</span>
          </div>
        </x-input>
        <x-input type="number" placeholder="请输入实训人数" placeholder-align="right" text-align="right" v-model="input2">
          <div slot="label" >
            <span class="school-wx-icon requireIcon">&#xe644;</span>
            <span>实训人数</span>
          </div>
        </x-input>
        <x-input type="text" placeholder="请输入申请人姓名"  placeholder-align="right" text-align="right" v-model="input3">
          <div slot="label" >
            <span class="school-wx-icon requireIcon">&#xe644;</span>
            <span>申请人</span>
          </div>
        </x-input>
      </group>
      <group>
        <div class="title-name-cell"><span class="school-wx-icon requireIcon">&#xe644;</span>用途说明</div>
        <x-textarea :max="200" name="description" placeholder="请输入借用说明(最大长度为200字)" v-model="input4"></x-textarea>
      </group>
      <div style="height:60px;background:#f0f0f0;"></div>
      <x-button-one :titleVal="'提交'" @click-button="submitWay"></x-button-one>
    </div>
  </div>
</template>
<script>
  // import { Datetime, Group, PopupPicker, Cell, XInput, XTextarea, CheckerItem, Checker, Divider } from 'vux'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import Checker from 'vux/src/components/checker/checker.vue'
  import CheckerItem from 'vux/src/components/checker/checker-item.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import XButtonOne from '../common/XButtonOne.vue'
  export default {
    name: 'trainingRoomApply',
    components: {
      Datetime,
      PopupPicker,
      XInput,
      Group,
      Cell,
      XTextarea,
      CheckerItem,
      Checker,
      Divider,
      XButtonOne
    },
    methods: {
      // 借用开始日期改变
      changeStartDate (value) {
        console.log('change', value)
      },
      // 借用结束日期改变
      changeEndDate (value) {
        console.log('change', value)
      },
      // 提交实训室申请
      submitWay(){
        if (this.datetime1 === ""){
          this.QD.alert("", "请选择开始借用日期")
        } else if (this.datetime2 === ""){
          this.QD.alert("", "请选择结束借用日期")
        } else if (this.demo1Checkbox.length === 0){
          this.QD.alert("", "请选择借用星期")
        } else if ( this.demo2Checkbox.length === 0){
          this.QD.alert("", "请选择借用节次")
        } else if ( this.input1 === ""){
          this.QD.alert("", "申请数量不能为空")
        } else if ( this.input2 === ""){
          this.QD.alert("", "实训人数不能为空")
        } else if (this.input3 === ""){
          this.QD.alert("", "申请人不能为空")
        } else if (this.input4 === ""){
          this.QD.alert("", "请输入借用说明")
        } else if (this.QD.compareDateAndTime(this.datetime1, this.datetime2) !== "small"){
          this.QD.alert("", "请选择正确的结束或开始日期")
        } else {
          this.QD.alert("", "提交成功");
        }
      }
    },
    create(){

    },
    data () {
      return {
        format: 'YYYY-MM-DD HH:mm',
        week: [ '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期七' ],
        jc: [ '第1节', '第2节', '第3节', '第4节', '中午', '第5节', '第6节', '第7节', "第8节", "第9节", "第10节", "晚上" ],
        value1: ['星期一'],
        value2: ['第一节'],
        maskValue: '0',
        demo1Checkbox: [],
        demo2Checkbox: [],
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        datetime1: "",
        datetime2: ""
      }
    }
  }
</script>

<style scoped>
  .sxsApply{
    background: #f0f0f0;
  }
  .group{
    margin-top:-20px;
  }
  .title-name-cell{
    display: inline-block;
    font-size: 16px;
    padding: 10px 15px;
  }
  .box span{
    display:inline-block;
    padding:10px 0 10px 15px;
  }
  .vux-x-input span:last-child,
  .vux-datetime .dateIcon span:last-child{
    color:#595D6e;
  }
  /*.router-view .weui-cells,.router-view .vux-no-group-title{*/
  /*margin-top:0;*/
  /*}*/
  .group /deep/ .vux-cell-placeholder{
    color:#959cb6!important;
  }
</style>
