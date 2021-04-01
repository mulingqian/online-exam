<template>
  <div class="eachPgBase moralEduStuStats">
    <div class="eachPgBase container">
      <divider class="dividerBox" v-if="!loaded && stuLst.length === 0">该班级暂无登记记录</divider>
      <div class="content-field" v-if="!loaded && stuLst.length > 0">
        <div class="info-box" v-for="(s, sIdx) in stuLst" :key="sIdx">
          <div class="stu-info">
            <div class="iconXm-box">
              <span class="iconXm">{{s.xm.substr(s.xm.length-2, 2)}}</span>
            </div>
            <div class="xm-box">
              <p>{{s.xm}}</p>
              <p class="desc">{{s.xh}}</p>
            </div>
            <span class="subScore">共扣 {{s.totalScore}} 分</span>
          </div>
          <div class="moral-score-box">
            <p class="each" v-for="(sj, sjIdx) in s.item">
              <span class="key">
                <i class="order">{{sjIdx + 1}}.</i>
                {{sj.item}}
              </span>
              <span class="value">- {{sj.value}} 分</span>
              <span v-if="sj.breachTime" class="date">{{sj.breachTime}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'moralEduStuStats',
    directives: {
    },
    components: {
      Divider
    },
    data () {
      return {
        loaded: true,
        stuLst: [] // 班级扣分列表
      }
    },
    created () {
      this.getStuScoreData(); // 班内学生扣分数据
    },
    methods: {
      // 班内学生扣分数据
      async getStuScoreData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStudentAddSubScoreData', bjid: this.$route.query.id});
        this.loaded = false;
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败`);
          console.log('学生德育扣分', d.msg);
          d = {data: []};
        }
        this.stuLst = d.data;
        console.log('stu score', d);
      },
      ...mapActions([
        'updateLoadingStatus'
      ])
    }
  }
</script>
<style scoped>
  .dividerBox{
    padding-top: 50px;
  }
  .content-field{

  }
  .info-box{
    position: relative;
    margin-bottom: 10px;
    padding: 15px 10px 4px 10px;
    background-color: #ffffff;
  }
  .stu-info{
    position: relative;
    padding-bottom: 10px;
  }
  .subScore{
    position: absolute;
    right: 15px;
    top: 10px;
    font-size: 14px;
    color: #e83b3b;
  }
  .stu-info:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .iconXm-box{
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    margin-top: 4px;
    font-size: 12px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    overflow: hidden;
  }
  .desc{
    padding: 6px 0;
    font-size: 14px;
    color: #666666;
  }
  .iconXm{
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    color: #fff;
    letter-spacing: .1em;
    background-color: #0f89e0;
  }
  .xm-box{
    position: absolute;
    left: 0;
    top: 8px;
    width: 100%;
    padding-left: 55px;
    box-sizing: border-box;
  }
  /* 德育扣分详细*/
  .moral-score-box{
    font-size: 14px;
  }
  .moral-score-box .each{
    position: relative;
    margin: 12px 0;
  }
  .moral-score-box .key{
    display: inline-block;
    width: 75%;
    color: #333333;
  }
  .moral-score-box .each .order{
    font-size: 12px;
    color: #824848;
  }
  .moral-score-box .value{
    position: absolute;
    right: 20px;
    width: 22%;
    text-align: right;
    color: #7a0d0d;
  }
  .moral-score-box .date{
    display: inline-block;
    width: 100%;
    color: #666666;
    font-size: 12px;
    padding-top: 6px;
    padding-left: 10px;
  }
</style>
