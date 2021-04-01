<template>
  <div class="myEduScore">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="header">
      <group class="slect-box">
        <popup-picker
          title="请选择"
          v-model="currentXQ"
          :data="lst"
          @on-change="getCurrentXQID"
          value-text-align="left">
          <template slot="title" slot-scope="props">
            <span style="height:24px;">
              <svg class="icon xq-icon" aria-hidden="true">
                <use xlink:href="#iconxueqizhuce"></use>
              </svg>
            </span>
          </template>
        </popup-picker>
      </group>
      <span class="currXQ">当前学期</span>
    </div>
    <div class="eduScoreBox">
      <div class="stu-edu-score" @click="goMyEduScoreDetail">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconhuaban" v-if="eduScore>0"></use>
            <use xlink:href="#iconhuaban-copy" v-else></use>
          </svg>
        <span :class="[eduScore>0? 'positivescore':'negativescore']">{{eduScore}}</span>
      </div>
      <p>
        <span class="school-wx-icon broken-line">&#xe685;</span>
        <span>德育学分</span>
        <span class="school-wx-icon broken-line">&#xe685;</span>
      </p>
    </div>
  </div>
</template>

<script>
  import Loading from 'vux/src/components/loading/index.vue'
  import Smst from '../../components/Smst.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import {Group, PopupPicker} from 'vux'

  export default {
    name: "myEduScore",
    directives: {
      TransferDom
    },
    components: {
      Smst,
      Loading,
      Divider,
      Group,
      PopupPicker
    },
    methods: {
      //跳转到德育分详细页面
      goMyEduScoreDetail(){
        if (this.isGetEduScore){
          this.$router.push({path: './eduScoreDetail', query: {currXQId: this.currXQId}})
        }
      },
      // 选择学期
      getCurrentXQID (val){
        this.xqLst.forEach(item => {
          if (val[0] === item.XQMC){
            this.currXQId = item.XQID
            this.getSemesterStuScoreData(item.XQID)
          }
        })
      },
      // 获取学期
      async getXQList(){
        let xqList = await this.QD.getSmstLst();
        this.xqLst = xqList;
        let xq = []
        xqList.forEach(item => {
          if (item.CurrentXQ){
            this.currentXQ.push(item.XQMC)
          }
          xq.push(item.XQMC)
        })
        this.lst = [xq]
      },
      // 获取学生指定学期的总分
      async getSemesterStuScoreData(semId){
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSemesterStuScoreData', semId: semId});
        //console.log(d, '获取学生指定学期的总分')
        if (d.status && d.status === "error") {
          this.QD.alert('', d.msg);
          this.loading = false;
          return;
        }
        this.loading = false;
        this.eduScore = d.data.score;
        this.isGetEduScore = true;
        // 把选择的学期、以及德育学分数 存sessionStorage, 从'德育详情'页面 返回该页面
        let obj ={
          xqLst: this.xqLst,
          lst: this.lst,
          currentXQ: this.currentXQ
        }
        sessionStorage.setItem("eduScoreCurrentXQAndEduScore", JSON.stringify(obj));
      }
    },
    created () {
      // 判断sessionStorage中eduScoreCurrentXQ 是否有值
      if (sessionStorage.getItem('eduScoreCurrentXQAndEduScore') !== null){
        let currVal = JSON.parse(sessionStorage.getItem('eduScoreCurrentXQAndEduScore'))
        this.xqLst = currVal.xqLst;
        this.lst = currVal.lst;
        this.currentXQ= currVal.currentXQ
        this.getCurrentXQID(currVal.currentXQ)
      } else {
        this.getXQList();
      }
    },
    data () {
      return {
        loading: true,
        isGetEduScore: false,
        eduScore: 0, // 德育总分
        currXQId: 0, //选择的学期id
        currentXQ: [],
        xqLst: [],
        lst: []

      }
    },
    computed: {
    }
  }
</script>

<style scoped lang="less">
  .xqHead{
    position: absolute;
    width: 100%;
    top: 46px;
    height: 40px;
    background-color: #fff;
    z-index: 5;
  }
  .myEduScore{
    .header {
      display: flex;
      .slect-box {
        width: 80%;
        .xq-icon {
          width: 24px;
          height: 32px;
          vertical-align: middle;
          margin-right:8px;
        }
      }
      .currXQ {
        width: 80px;
        height:24px;
        line-height: 24px;
        text-align: center;
        font-size:14px;
        color:#26a69a;
        margin:22px 16px 0 0;
        background: #e9f6f5;
        box-sizing: border-box;
        border: 1px solid #26a69a;
        border-radius: 0 15px 0 15px;
      }
    }
    .eduScoreBox{
      margin-top:50px;
      text-align: center;
      .stu-edu-score{
        position:relative;
        >span{
          position:absolute;
          left:50%;
          top:50%;
          transform: translate(-50%,-78%);
          font-size: 36px;
          letter-spacing: 1px;
          background-size: contain;
          margin: auto;
        }
        .positivescore{
          color:#689f38;
        }
        .negativescore{
          color:#ff586c;
        }
      }
      >p{
        color:#7cb342;
        margin-top:22px;
        .broken-line{
          color: #7cb342;
          padding:0;
        }
        span:nth-child(2){
          font-size: 20px;
          letter-spacing: 1px;
        }
      }
    }
  }

</style>
<style lang="less">
  .myEduScore{
    .weui-cells{
      margin-top:0;
    }
    .weui-cells:before, .weui-cells:after{
      display: none;
    }
    .weui-cell{
      padding-top:20px;
    }
    .vux-cell-value{
      color:#333;
      font-size:18px;
      font-weight: bold;
    }
    .vux-cell-primary{
      margin-right:14px;
    }
  }
</style>
