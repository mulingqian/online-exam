<template>
  <div class="eachPgBase moralEduBjStats">
    <div class="eachPgBase container">
      <divider class="dividerBox" v-if="!loaded && bjLst.length === 0">暂无登记记录</divider>
      <group class="gp" v-for="(s, sIdx) in bjLst" :key="sIdx">
        <cell class="cell" :is-link="true" @click.native="goStuDetailPg(s.bjid)">
          <div slot="after-title" class="lfBox">
            <span class="subScore">共扣 {{s.totalScore}} 分</span>
            <p class="bjmc-value">{{s.bjmc}}</p>
          </div>
        </cell>
        <div class="detailBox" v-if="s.item.length > 0">
          <p class="each" v-for="(sj, sjIdx) in s.item" :key="sjIdx">
            <span class="key">
              <i class="order">{{sjIdx + 1}}.</i>
              {{sj.item}}
            </span>
            <span class="value">- {{sj.value}} 分</span>
            <span v-if="sj.breachTime" class="date">{{sj.breachTime}}</span>
          </p>
        </div>
      </group>
    </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'moralEduBjStats',
    directives: {
    },
    components: {
      Cell,
      Group,
      Divider
    },
    data () {
      return {
        loaded: true,
        bjLst: [] // 班级扣分列表
      }
    },
    created () {
      this.getBjScoreData(); // 班级扣分数据
    },
    methods: {
      // 到班内学生德育扣分页面
      goStuDetailPg (bjid) {
        this.$router.push({path: '/moralEduStuStats', query: {id: bjid}});
      },
      // 班级扣分数据
      async getBjScoreData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassAddSubScoreData'});
        this.loaded = false;
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败`);
          console.log('班级德育扣分', d.msg);
          d = {data: []};
        }
        this.bjLst = d.data;
        console.log('bj score', d);
      },
      ...mapActions([
        'updateLoadingStatus'
      ])
    }
  }
</script>
<style>
</style>
<style scoped>
  .dividerBox{
    padding-top: 50px;
  }
  .container .gp{
    margin-top: -10px;
  }
  .container .gp:first-child{
    margin-top: -20px;
  }
  .lfBox{
    position: relative;
  }
  .subScore{
    position: absolute;
    right: 10px;
    width: 22%;
    color: #e83b3b;
    font-size: 14px;
    text-align: right;
  }
  .bjmc-value{
    position: relative;
    width: 75%;
  }
  .detailBox{
    position: relative;
    padding: 10px 20px 15px 20px;
    font-size: 14px;
    color: #666666;
  }
  .moralEduBjStats .detailBox:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px dashed #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .detailBox .each{
    position: relative;
    margin: 12px 0;
  }
  .detailBox .each .key {
    display: inline-block;
    width: 75%;
    color: #333333;
  }
  .detailBox .each .key i{
    font-size: 12px;
    color: #824848;
  }
  .detailBox .each .value {
    position: absolute;
    right: 10px;
    width: 22%;
    text-align: right;
    color: #7a0d0d;
  }
  .detailBox .each .date {
    display: inline-block;
    width: 100%;
    color: #666666;
    font-size: 12px;
    padding-top: 0;
    padding-left: 10px;
  }
</style>
