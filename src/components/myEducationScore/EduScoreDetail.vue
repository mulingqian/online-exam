<template>
  <div class="eduScoreDetail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="eduscore-lst" v-if="lst && lst.length >0">
      <verify-lst v-for="(item, idx) in lst" :key="idx" class="abnormal-detail">
        <a slot="iconTitle" class="stuIconfontStatiQuery">{{idx+1}}</a>
        <div slot="right-info" class="right-info">
          <p class="remarks">备注(原因)：{{item.remark}}</p>
          <p class="category">项目类别：{{item.itemType}}</p>
          <p class="stuInfo">违纪时间：
            <span v-if="item.breachTime !==''">{{item.breachTime}}</span>
            <span v-else>未填写</span>
          </p>
          <p class="stuInfo">登记时间：{{item.createTime}}</p>
          <p class="stuInfo">登记人：<span class="DEperson">{{item.creator}}</span></p>
          <p class="score" v-if="item.addOrSub === '减分'">
            <span class="scoreStyle reduceStyle addOrSubStyle">-</span>
            <san class="scoreStyle reduceStyle">{{item.score}}</san>分数
          </p>
          <p class="score" v-else>
            <span class="scoreStyle addScoreStyle addOrSubStyle">+</span>
            <san class="scoreStyle addScoreStyle">{{item.score}}</san>分数
          </p>

        </div>
      </verify-lst>
    </div>
    <divider style="margin-top:50px;" v-else>暂无数据</divider>
  </div>
</template>
<script>
import VerifyLst from '../common/VerifyLst.vue'
import Loading from 'vux/src/components/loading/index.vue'
import TransferDom from 'vux/src/directives/transfer-dom/index.js'
import Divider from 'vux/src/components/divider/index.vue'
export default {
  name: 'eduScoreDetail',
  components: {
    VerifyLst,
    Loading,
    Divider
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      loading: true,
      lst: []
    }
  },
  created () {
    this.getSemesterStuScoreDetail();// 获取学生指定学期的德育记录
  },
  methods: {
    // 获取学生指定学期的德育记录
    async getSemesterStuScoreDetail(){
      let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSemesterStuScoreDetail', semId: this.$route.query.currXQId});
      this.loading = false;
      //console.log(d, '获取学生指定学期的德育记录')
      if (d.status && d.status === "error") {
        this.QD.alert('', d.msg);
        return;
      }
      this.lst = d.data;
    }
  }
}
</script>
<style lang="less" scoped>
  .eduScoreDetail{
    .abnormal-detail{
      font-size:14px;
      color:#666;
      .remarks{
        width:80%;
        color: #333;
        font-weight: bold;
        margin-bottom:10px;
      }
      .category{
        color: #ff6f00;
        font-weight: bold;
        margin-bottom:16px;
      }
      .stuInfo{
        font-size:12px;
        color: #999;
        margin-bottom:2px;
      }
      .DEperson{
        display:inline-block;
        color:#26a69a;
        padding:4px 18px;
        background: #e9f6f5;
        border-radius: 14px;
      }
      .score{
        position:absolute;
        right:0;
        top:15px;
        font-size:12px;
        color:#999;
        .scoreStyle{
          font-size:24px;
          font-weight: bold;
          margin-right:6px;
        }
        .addOrSubStyle{
          margin-right:0;
        }
        .addScoreStyle{
          color:#13c22b;
        }.reduceStyle{
          color:#ff586d;
        }
      }
    }
  }
  @media screen and (max-width:360px){
    .eduScoreDetail{
      .abnormal-detail {
        .remarks {
          width:76%;
        }
      }
    }
  }
  @media screen and (max-width:320px){
    .eduScoreDetail{
      .abnormal-detail {
        .remarks {
          width:66%;
        }
      }
    }
  }
</style>
<style lang="less">
  .abnormal-detail{
    .weui-cells{
      margin-top:0;
    }
    .after-title{
      position: relative;
    }
    .gp-left{
      width:34px!important;
      height:34px!important;
      line-height: 34px!important;
      overflow: initial!important;
      margin:12px 12px 0 8px!important;
      .stuIconTitle{
        background:#26a69a;
        box-shadow: 0 0 0 8px #b2dfdb;
        .stuIconfontStatiQuery{
          font-size:18px;
        }
      }
    }
    .gp-right{
      margin-left:15px;
    }
  }
</style>
