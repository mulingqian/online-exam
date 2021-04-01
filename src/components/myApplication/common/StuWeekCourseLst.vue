<template>
  <div class="stu-week-course-field">
    <div v-if="currentXQ" class="head-box">
      <span class="title">我的课表</span>
      <span class="xq-info">{{currentXQ.XQMC}}第{{currentWeek}}周</span>
      <span class="btn course-btn" @click="goCoursePg">学期课表 》</span>
    </div>
    <div v-if="lst.length > 0" class="course-info">
      <div class="date-box clearfloat">
        <div class="week-index" v-for="(w, widx) in lst" :key="widx">
          <div :class="`content ${selectWeekIndex === widx + 1 ? 'active' : ''}`" @click="selectWeek(widx)">
            <p class="date">{{w.CourseDate.date.substr(5, 5)}}</p>
            <p class="week">{{w.CourseDate.weekVal}}</p>
          </div>
        </div>
      </div>
      <div class="content-lst">
        <div class="each" v-for="(item, idx) in lst[selectWeekIndex-1].Nodes" :key="idx">
          <span class="school-wx-icon sign-icon">&#xe674;</span>
          <div class="course-content">
            <p class="nodes">
              <span>{{item.NodeIndex}} — {{item.NodeIndex + item.span - 1}} 节</span>
            </p>
            <p class="desc ckmc">
              <span class="key">课程名称:</span>
              <span class="val">{{item.KCMC}}</span>
            </p>
            <p class="desc tea">
              <span class="key">上课老师:</span>
              <span class="val">{{item.Teachers}}</span>
            </p>
            <p class="desc jsmc">
              <span class="key">上课地点:</span>
              <span class="val">{{item.JSMCs}}</span>
            </p>
          </div>
        </div>
      </div>
      <divider v-if="lst[selectWeekIndex-1].Nodes.length === 0" class="no-data">无课程</divider>
    </div>
    <divider v-if="!loaded && lst.length === 0" class="no-data">无数据</divider>
  </div>
</template>
<script>
  import Divider from 'vux/src/components/divider/index.vue'
  import { mapState } from 'vuex'
  export default {
    name: "stuWeekCourseLst",
    directives: {
    },
    components: {
      Divider
    },
    data () {
      return {
        loaded: true,
        todayWeekIndex: null, // 今日是星期几
        selectWeekIndex: null, // 选中查看的星期几
        lst: [],
        weekLst: ['周一', '周二', '周三', '周四', '周五'],
        currentXQ: null,
        currentWeek: null // 当前周次
      }
    },
    props: {
      courseObj: {
        type: Object,
        default: null
      }
    },
    created () {
      this.getCurrPgData(); // 得到本页面的数据
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    methods: {
      // 到课表页面
      goCoursePg () {
        this.$emit('go-course');
      },
      // 得到本页面的数据
      getCurrPgData () {
        if (this.courseObj) {
          this.loaded = this.courseObj.loaded;
          this.todayWeekIndex = this.courseObj.todayWeekIndex;
          this.selectWeekIndex = this.courseObj.selectWeekIndex;
          this.lst = this.courseObj.lst;
          this.currentXQ = this.courseObj.currentXQ;
          this.currentWeek = this.courseObj.currentWeek;
        } else {
          this.getDayVal(); // 得到今天是星期几
        }
      },
      // 设置学生课表需要保存本页的数据
      setSaveCurrPgData () {
        let courseInfo = {
          loaded: this.loaded,
          todayWeekIndex: this.todayWeekIndex,
          selectWeekIndex: this.selectWeekIndex,
          lst: this.lst,
          currentXQ: this.currentXQ,
          currentWeek: this.currentWeek
        };
        this.$emit('get-data', courseInfo);
      },
      // 选中星期
      selectWeek (widx) {
        this.selectWeekIndex = widx + 1
      },
      // 得到当天是星期几
      getDayVal() {
        this.todayWeekIndex = new Date().getDay();
        if (this.todayWeekIndex === 0 || this.todayWeekIndex === 6) { // 周六或周日 默认周一
          this.todayWeekIndex = 1;
        }
        this.selectWeekIndex = this.todayWeekIndex;
        this.getXQList(); // 得到学期和周次信息
      },
      // 得到学期和周次信息
      async getXQList () {
        if (!this.QD.currentXQ) {
          let xqList = await this.QD.getSmstLst();
          this.QD.xqList = xqList;
          this.QD.currentXQ = xqList.find((n) => n.CurrentXQ === true);
        }
        this.currentXQ = this.QD.currentXQ;
        // 周次
        let d = await this.QD.getData(this.QD.API.weeklst, {xqid: this.currentXQ.XQID});
        let currW = d.find((n) => n.IsCurrentWeekIndex === true);
        if (!currW) {
          this.currentWeek = 1;
        } else {
          this.currentWeek = currW.WeekIndex;
          if (this.todayWeekIndex === 6 || this.todayWeekIndex === 7) {
            this.currentWeek += 1;
          }
        }
        this.getList();
      },
      // 根据周次和学期得到课表数据
      async getList () {
        /*let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'TeaScheduleData',
          id: this.userinfo.stuObj.ZGH,
          semId: this.currentXQ.XQID,
          weekIndex: 2,
          type: "employee"
        });*/
        let d = await this.QD.getData('/School/StuClient/StudentSchedule', {xqid: this.currentXQ.XQID, weekIndex: this.currentWeek});
        this.loaded = false;
        if (d.status && d.status === "error") {
          console.log("获取课表数据失败", d);
          return
        }
        console.log('student schedule', JSON.parse(JSON.stringify(d)));
        this.lst = []; // 课程列表
        let nextj, nextNode;
        for (let i=0; i<d.CourseDate.length - 2; i++) {
          let xi = d.CourseDate[i];
          this.lst.push({CourseDate: {date: xi, weekVal: this.weekLst[i]}, Nodes: []});
          for (let j=0; j<d.Nodes.length; j++) {
            let yj = d.Nodes[j];
            let curNode = yj.list.find((n) => n.WeekIndex === (i + 1));
            if (curNode) {
              // 跨行显示
              if (curNode.span !== 0) {
                curNode.span = 1;
                nextj = j + 1;
                while (nextj < d.Nodes.length) {
                  nextNode = d.Nodes[nextj].list.find((n) => n.WeekIndex === (i + 1));
                  if (nextNode && nextNode.JXBID === curNode.JXBID) {
                    curNode.span++;        // 跨行span+1
                    nextNode.span = 0;     // 设置不显示
                    nextj++
                  } else {
                    break
                  }
                }
                this.lst[i].Nodes.push(curNode);
              }
            }
          }
        }
        this.setSaveCurrPgData();  // 设置学生课表需要保存本页的数据
        console.log("need lst", this.lst);
      }
    }
  }
</script>
<style scoped lang="less">
  .head-box{
    position: relative;
    padding: 20px 100px 18px 18px;
    .title{
      font-size: 18px;
      color: #000000;
    }
    .xq-info{
      font-size: 12px;
      color: #999999;
    }
    .course-btn{
      display: inline-block;
      position: absolute;
      top: 20px;
      right: 16px;
      padding: 4px 6px 4px 10px;
      font-size: 12px;
      color: #ffffff;
      background-color: #ffb300;
      border-radius: 12px;
    }
  }
  .course-info{
    position: relative;
    .date-box{
      position: relative;
    }
    .week-index{
      position: relative;
      float: left;
      width: 20%;
      text-align: center;
    }
    .week-index .content{
      position: relative;
      margin: 0 6px;
      box-sizing: border-box;
      background-color: #efefef;
      border-radius: 5px;
      padding: 8px;
    }
    .week-index .content.active{
      color: #ffffff;
      background-color: #26a69a;
      .week,
      .date{
        color: #ffffff;
      }
    }
    .date{
      font-size: 12px;
      color: #666666;
      padding-bottom: 2px;
    }
    .week{
      font-size: 16px;
      color: #333333;
      padding-top: 2px;
    }
  }
  .content-lst{
    position: relative;
    padding: 15px 0;
    .each{
      position: relative;
      padding: 0 14px;
    }
    .sign-icon{
      position: absolute;
      margin-top: 14px;
      margin-left: 0;
      color: #26a69a;
      font-size: 20px;
    }
    .course-content{
      position: relative;
      padding: 12px 0 12px 30px;
    }
    .nodes{
      padding: 2px 0 6px 0;
      font-size: 16px;
      color: #26a69a;
    }
    .desc{
      position: relative;
      padding: 6px 0;
      font-size: 14px;
      color: #333333;
    }
    .desc .key{
      position: absolute;
    }
    .desc .val{
      display: inline-block;
      position: relative;
      padding-left: 66px;
      line-height: 16px;
    }
    .course-content:after{
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #d9d9d9;
      color: #d9d9d9;
      -webkit-transform-origin: 0 100%;
      -moz-transform-origin: 0 100%;
      -ms-transform-origin: 0 100%;
      -o-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      -moz-transform: scaleY(0.5);
      -ms-transform: scaleY(0.5);
      -o-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
  .no-data{
    position: relative;
    width: 80%;
    left: 10%;
    padding: 20px 0;
  }
</style>
