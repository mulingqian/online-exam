<template>
  <div class="manageClassLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="gp">
      <datetime title="教学日期" v-model="seleDate" format="YYYY-MM-DD" @on-change="changeDate"></datetime>
      <!-- 行政班 start -->
      <cell v-if="dutyXzbClassLst.length>0" @click.native="goRecordPG(x.bjid, x.bjmc, 'xzb')" v-for="(x, index) in dutyXzbClassLst" :key="index" :is-link="true">
        <div slot="icon" class="sizebox communityLst">
          <div :class="`thumb-texticon bg${index%11}`">行政班</div>
        </div>
        <div slot="after-title" class="sizebox communityLst">
          <a>{{x.bjmc}}班</a>
        </div>
      </cell>
      <!-- 行政班 end -->
      <!-- 教学班 start -->
      <cell v-if="dutyJxbClassLst.length>0" @click.native="goRecordPG(x.jxbid, x.jxbmc, 'jxb')" v-for="(x, index) in dutyJxbClassLst" :key="index" :is-link="true">
        <div slot="icon" class="sizebox communityLst">
          <div :class="`thumb-texticon bg${index%11}`">教学班</div>
        </div>
        <div slot="after-title" class="sizebox communityLst">
          <a>{{x.jxbmc}}</a>
        </div>
      </cell>
      <!-- 教学班 end -->
    </group>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'

  export default {
    name: "stuTeachingLog-manageClassLst",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Datetime,
      Cell,
      Group
    },
    methods: {
        // 到登记学生教学日志页面中去
      goRecordPG(id, mc, type) {
        this.QD.currPageData = null;
        this.QD.currPageData = this.seleDate; // 将选中的日期保存，目的：在登记学生的教学日志页面后，还回到当前页面时是原来选中的日期
        if (this.QD.showNewTeachingLog){
          // 新版本  学生端的教学日志
          this.$router.push({path: '/stuTeachingLog/newRecordCurricu', query: {type: type, bjid: id, bjmc: mc, date: this.seleDate, xqid: this.currentXQ.XQID}});
        } else {
          // 旧版本  学生端的教学日志
          this.$router.push({path: '/stuTeachingLog/recordCurricu', query: {type: type, bjid: id, bjmc: mc, date: this.seleDate, xqid: this.currentXQ.XQID}});
        }
      },
      // 选择日期
      changeDate (value) {
        this.seleDate = value;
        this.getDutyClass(); // 根据日期得到值周学生管理的班级列表
      },
      /* 根据日期得到值周学生管理的班级列表 */
      async getDutyClass() {
        console.log('get xq list');
        let xqList = await this.QD.getSmstLst();
        this.QD.xqList = xqList;
        this.QD.currentXQ = xqList.find((n) => n.CurrentXQ === true);
        this.currentXQ= this.QD.currentXQ;
        if (!this.currentXQ || (this.currentXQ && !this.currentXQ.XQID)) {
          return;
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetDutyClass',
          semId: this.currentXQ.XQID,
          teachDay: this.seleDate,
          xh: this.stuXH
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
        }
        console.log('get duty =', d);
        for (let i in d) {
          if (d[i].type === 'xzb') {
            this.dutyXzbClassLst = d[i].value; // 行政班
          } else {
            this.dutyJxbClassLst = d[i].value; // 教学班
          }
        }
        console.log('dutyJxbClassLst', this.dutyJxbClassLst);
      },
      // 得到当前日期/保存的日期
      getCurrDate() {
        this.stuXH = this.QD.getLocalUserinfo().stuObj.XH; // 当前用户学生的学号
        if (this.QD.currPageData) {
          this.seleDate = this.QD.currPageData;
          this.QD.currPageData = null;
        } else {
          this.seleDate = this.QD.getDateOrTime('date'); // 当前日期
        }
        this.getDutyClass(); // 得到值周学生管理的班级列表
      }
    },
    created () {
      this.getCurrDate(); // 得到当前日期/保存的日期 和 当前用户信息
    },
    data () {
      return {
        loading: false,
        currentXQ: null, // 当前学期信息
        stuXH: '', // 当前用户学生的学号
        seleDate: '', // 选择得到的日期
        dutyXzbClassLst: [], // 值周学生管理的行政班级列表数据
        dutyJxbClassLst: [] // 值周学生管理的教学班级列表数据
      }
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -20px;
  }
  .communityLst{
    font-size: 14px;
  }
  .sizebox div{
    display: inline-block;
    height: 50px;
    width: 50px;
    text-align: center;
    line-height: 50px;
    margin-right: 10px;
  }
</style>
