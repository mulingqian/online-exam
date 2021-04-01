<template>
  <div class="stuArrears">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group style="margin-top:0;">
      <popup-picker
        :title="'当前班级'"
        :data="classList"
        v-model="currentClass"
        @on-change="getCurrentBJID"
      ></popup-picker>
    </group>
    <div v-if="freeLst.length>0">
      <verify-lst
        v-for="(item, idx) in freeLst"
        :key="idx"
        class="abnormal-detail"
        @click.native="getStuIdx(idx)">
        <a slot="iconTitle"
           class="stuIconfontStatiQuery">
          {{(item.XM).slice(1)}}
        </a>
        <div slot="right-info" class="right-info">
          <p class="remarks">学号：{{item.XH}}</p>
          <div class="stuInfo"
               v-if="item.FeeList.length > 0"
               v-for="(freeIten,index) in item.FeeList"
               :key="index"
               @click="getFreeIdx(index)"
          >
            <cell
              :title="freeIten.QJMC + '年份'"
              is-link
              class="free-lst"
              :border-intent="false"
              :arrow-direction="currStuIdx === idx && currFreeIdx === index? 'up' : 'down'"
              @click.native="currStuIdx = idx">
              <div slot="icon" class="arrears-year-icon">欠</div>
              <!--<div slot="icon" class="normal-year-icon">正</div>-->
            </cell>
            <div class="slide"
                 :class="currStuIdx ===idx && currFreeIdx === index?'animate':''">
              <div v-for="(item, inx) in freeIten.ItemList" class="SFitem">
                <p class="freeItem XMmc">收费项目名称：{{item.XMMC}}</p>
                <p class="freeItem">应收金额：{{item.YSJE}}</p>
                <p class="freeItem">已退费金额：{{item.TJJE}}</p>
                <p class="freeItem">实收金额：<span class="SSJE">{{item.SSJE}}</span></p>
                <p class="freeItem">欠费金额：<span class="QFJE">{{item.QFJE}}</span></p>
              </div>
            </div>
          </div>
          <p v-if="item.FeeList.length <=0" style="font-size:14px;margin-left:10px;">暂无数据</p>
        </div>
      </verify-lst>
    </div>
    <div v-else>
      <divider style="margin-top:50px;">暂无数据</divider>
    </div>
  </div>
</template>

<script>
  import Loading from 'vux/src/components/loading/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Smst from './Smst.vue'
  import {PopupPicker, Group, Cell, Divider} from 'vux'
  import VerifyLst from './common/VerifyLst.vue'

  export default {
    name: "stuArrears",
    directives: {
      TransferDom
    },
    components: {
      Smst,
      PopupPicker,
      Divider,
      Group,
      Cell,
      Loading,
      VerifyLst
    },
    methods: {
      // 选择学期
      getCurrentBJID (val){
        this.list.forEach(item => {
          if (val[0] === item.BJID){
            //console.log('选择BJ=>', val)
            this.currentClass = item.BJMC
            this.ReadStudentPaymentDataByClass(item.BJDM)
          }
        })
      },
      // 学生idx
      getStuIdx(stuIdx) {
        this.currStuIdx = stuIdx
      },
      // 项目idx
      getFreeIdx(freeIdx) {
        let old = this.currFreeIdx
        if (old === freeIdx){
          this.currFreeIdx = -1
        } else {
          this.currFreeIdx = freeIdx
        }
      },
      // 获取班级信息
      async getClassLst () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassInforLst', id: this.QD.getLocalUserinfo().stuObj.ZGH});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        //console.log('获取班级信息', d)
        this.list = d;
        let classLst = []
        if (d.length > 0){
          this.currentClass = [d[0].BJMC]
          this.list.forEach(item => {
            classLst.push(item.BJMC)
          })
          this.classList = [classLst]
          this.ReadStudentPaymentDataByClass(d[0].BJDM)
//          this.ReadStudentPaymentDataByClass('522B64')
        }
      },
      // 获取班级学生欠费信息
      async ReadStudentPaymentDataByClass(bjdm){
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'ReadStudentPaymentDataByClass', clazzCode: bjdm});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取班级学生欠费信息数据失败:${d.msg}`);
        }
        console.log('获取班级学生欠费信息', JSON.parse(d))
        this.freeLst = JSON.parse(d).data;
        //第一步 去除freeLst为空的数据
        this.freeLst = this.freeLst.filter((item) => {
          return item.FeeList.length >0
        })
        //第二步 过滤欠费金额不为0的数据
        this.freeLst.forEach((item) => {
          item.FeeList.forEach((feeItem, feeIdx) => {
            if (feeItem.ItemList.length > 0){
              feeItem.ItemList = feeItem.ItemList.filter((feeItem) => {
                return feeItem.QFJE > 0
              })
            } else {
              item.FeeList.splice(feeIdx, 1)
            }
          })
        })
        // 过滤每一项itemList不为空的数据
        this.freeLst.forEach(item => {
          item.FeeList = item.FeeList.filter((item) => {
            return item.ItemList.length > 0
          })
        })
        // 过滤修改数组后FeeLst为空的数据
        this.freeLst = this.freeLst.filter((item) => {
          return item.FeeList.length >0
        })
//        this.freeLst = JSON.parse(d).data
      }
    },
    created () {
      this.getClassLst(); // 获取班级信息
    },
    data () {
      return {
        loading: false,
        currStuIdx: 0,
        currFreeIdx: -1, //当前选中的项目
        list: [], // 班级信息
        currentClass: [],
        classList: [], // 班级列表
        freeLst: [] // 班级欠费列表
      }
    },
    computed: {
    }
  }
</script>

<style scoped lang="less">
  .stuArrears{
    margin-top:-21px;
    color:#333;
    .abnormal-detail{
      margin-top:-21px;
      .stuIconfontStatiQuery{
        font-size:14px;
      }
    }
    .free-lst{
      padding:0;
      /*color:#108fe9;*/
    }
    .SFitem{
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;
      .freeItem{
        font-size:14px;
        color:#666;
      }
      .SSJE{
        color:green;
      }
      .QFJE{
        color:red;
      }
      .XMmc{
        color:#108fe9;
      }
    }
    .SFitem:last-child{
      border:none;
    }
    .slide {
      padding: 0 10px;
      overflow: hidden;
      max-height: 0;
      transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
    }
    .animate {
      max-height: 9999px;
      transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
      transition-delay: 0s;
    }
  }
</style>

<style lang="less">
  .stuArrears{
    .free-lst .arrears-year-icon{
      display: inline-block;
      width: 24px;
      height:16px;
      font-size:10px;
      color:red;
      text-align: center;
      margin-right: 10px;
      position: relative;
      top: -2px;
      box-sizing: border-box;
      border: 1px solid red;
      border-radius: 0 6px 0 7px;
    }
    .free-lst .normal-year-icon{
      display: inline-block;
      width: 24px;
      height:16px;
      font-size:14px;
      color:#26a69a;
      text-align: center;
      margin-right: 10px;
      background: #e9f6f5;
      box-sizing: border-box;
      border: 1px solid #26a69a;
      border-radius: 0 6px 0 7px;
    }
  }
</style>
