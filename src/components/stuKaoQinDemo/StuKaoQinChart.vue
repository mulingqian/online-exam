<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <button-tab style="padding: 15px;">
      <button-tab-item selected @on-item-click="changeDateType('day')">日</button-tab-item>
      <button-tab-item @on-item-click="changeDateType('week')">周</button-tab-item>
      <button-tab-item @on-item-click="changeDateType('month')">月</button-tab-item>
    </button-tab>
    <div class="weektime" v-if="dateType === 'week'">
      <span style="position: absolute; top: 0px; left:-20%;" @click="pre('week')"><</span>
      <span>{{start}}</span>~
      <span>{{end}}</span>
      <span style="position: absolute; top: 0px; left:60%;" @click="next('week')">></span>
    </div>
    <g2-pie :charData="serverData" :id="'c1'" v-if="dateType === 'week'" style="background-color: #fff;"></g2-pie>
    <div class="monthtime" v-if="dateType === 'month'">
      <span style="position: absolute; top: 0px; left:-30%;" @click="pre('month')"><</span>
      <span>{{month}}</span>
      <span style="position: absolute; top: 0px; left:44%;" @click="next('month')">></span>
    </div>
    <g2-pie :charData="serverData" :id="'c2'" v-if="dateType === 'month'" style="background-color: #fff"></g2-pie>
    <div class="daytime" v-if="dateType === 'day'">
      <span style="position: absolute; top: 0px; left:-30%;" @click="pre('day')"><</span>
      <span @click='showPlugin'>{{day}}</span>
      <span style="position: absolute; top: 0px; left:50%;" @click="next('day')">></span>
    </div>
    <g2-pie :charData="serverData" :id="'c3'" v-if="dateType === 'day'" style="background-color: #fff"></g2-pie>
  </div>
</template>

<script>
  import dateFormat from 'vux/src/components/datetime/format.js'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import G2Pie from '../common/G2Pie.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import ButtonTab from 'vux/src/components/button-tab/button-tab.vue'
  import ButtonTabItem from 'vux/src/components/button-tab/button-tab-item.vue'

  export default {
    name: "stuKaoQinChart",
    directives: {
      TransferDom
    },
    components: {
      G2Pie,
      Cell,
      Group,
      Loading,
      dateFormat,
      ButtonTab,
      ButtonTabItem,
      Datetime
    },
    mounted () {
    },
    methods: {
      showPlugin () {
        this.visibility = true
      },
      // 向前
      pre (index) {
        let oneDayTime = 24*60*60*1000;
        console.log(index);
        if (index === 'day') {
          let dateTime = this.day.split('-');
          let now = new Date(dateTime[0], dateTime[1]-1, dateTime[2]);
          let yesterday = new Date(now.getTime() - oneDayTime);
          this.day = dateFormat(yesterday, 'YYYY-MM-DD');
        } else if (index === 'week') {
          let fisrt = this.start.split('-');
          let last = this.end.split('-');
          let firstWeekDay = new Date(fisrt[0], fisrt[1]-1, fisrt[2]);
          let lastWeekDay = new Date(last[0], last[1]-1, last[2]);
          let preFisrtWeekDay = new Date(firstWeekDay.getTime() - oneDayTime*7);
          let preLastWeekDay = new Date(lastWeekDay.getTime() - oneDayTime*7);
          this.start = dateFormat(preFisrtWeekDay, 'YYYY-MM-DD');
          this.end = dateFormat(preLastWeekDay, 'YYYY-MM-DD');
        } else if (index === 'month') {
          let fisrt = this.start.split('-');
          let firstDay = new Date(fisrt[0], fisrt[1]-2, fisrt[2]);
          firstDay.setDate(1); //第一天
          let start = firstDay;
          firstDay = new Date(fisrt[0], fisrt[1]-2, fisrt[2]);
          let currentMonth = firstDay.getMonth();
          let nextMonth = ++currentMonth;
          let nextMonthFirstDay = new Date(firstDay.getFullYear(), nextMonth, 1);
          let end = new Date(nextMonthFirstDay-oneDayTime);
          this.start = dateFormat(start, 'YYYY-MM-DD');
          this.end = dateFormat(end, 'YYYY-MM-DD');
        }
        this.getChartData();
      },
      // 向后
      next (index) {
        let oneDayTime = 24*60*60*1000;
        console.log(index);
        if (index === 'day') {
          let dateTime = this.day.split('-');
          let now = new Date(dateTime[0], dateTime[1]-1, dateTime[2]);
          let yesterday = new Date(now.getTime() + oneDayTime);
          this.day = dateFormat(yesterday, 'YYYY-MM-DD');
        } else if (index === 'week') {
          let fisrt = this.start.split('-');
          let last = this.end.split('-');
          let firstWeekDay = new Date(fisrt[0], fisrt[1]-1, fisrt[2]);
          let lastWeekDay = new Date(last[0], last[1]-1, last[2]);
          let preFisrtWeekDay = new Date(firstWeekDay.getTime() + oneDayTime*7);
          let preLastWeekDay = new Date(lastWeekDay.getTime() + oneDayTime*7);
          this.start = dateFormat(preFisrtWeekDay, 'YYYY-MM-DD');
          this.end = dateFormat(preLastWeekDay, 'YYYY-MM-DD');
        } else if (index === 'month') {
          let fisrt = this.start.split('-');
          let firstDay = new Date(fisrt[0], fisrt[1], fisrt[2]);
          firstDay.setDate(1); //第一天
          let start = firstDay;
          firstDay = new Date(fisrt[0], fisrt[1], fisrt[2]);
          let currentMonth = firstDay.getMonth();
          let nextMonth = ++currentMonth;
          let nextMonthFirstDay = new Date(firstDay.getFullYear(), nextMonth, 1);
          let end = new Date(nextMonthFirstDay-oneDayTime);
          this.start = dateFormat(start, 'YYYY-MM-DD');
          this.end = dateFormat(end, 'YYYY-MM-DD');
        }
        this.getChartData();
      },
      // 切换日 周 月 统计
      changeDateType (index) {
        this.dateType = index;
        this.start = '';
        this.getChartData();
      },
      // 根据index来获取不同的日期
      getDate (index) {
        let oneDayTime = 24*60*60*1000;
        let now = new Date();
        let start, end;
        if (index === 'week') {
          // 获取当前星期的星期一的日期和星期天的日期
          let nowTime = now.getTime();
          let day = now.getDay();
          //显示周一
          let MondayTime = nowTime - (day-1)*oneDayTime;
          //显示周日
          let SundayTime = nowTime + (7-day)*oneDayTime;
          //初始化日期时间
          start = new Date(MondayTime);
          end = new Date(SundayTime);
          let startTime = dateFormat(start, 'YYYY-MM-DD');
          let endTime = dateFormat(end, 'YYYY-MM-DD');
          return startTime + '/' + endTime;
        } else if (index === 'month') {
          let k = now;
          now.setDate(1); //第一天
          start = now;
          now = k;
          let currentMonth = now.getMonth();
          let nextMonth = ++currentMonth;
          let nextMonthFirstDay = new Date(now.getFullYear(), nextMonth, 1);
          end = new Date(nextMonthFirstDay-oneDayTime);
          let startTime = dateFormat(start, 'YYYY-MM-DD');
          let endTime = dateFormat(end, 'YYYY-MM-DD');
          return startTime + '/' + endTime;
        } else if (index === 'day') {
          let day = dateFormat(now, 'YYYY-MM-DD');
          return day;
        }
      },
      // 获取图表数据
      async getChartData () {
        let dates;
        if (this.dateType === 'day') {
          if (this.day === '') {
            dates = this.getDate(this.dateType);
            console.log(dates);
            this.day = dates;
          }
        } else {
          if (this.start === '') {
            dates = this.getDate(this.dateType);
            console.log(dates);
            this.start = dates.split('/')[0];
            this.end = dates.split('/')[1];
          }
          if (this.dateType === 'month') {
            let y = this.start.split('-')[0];
            let m = this.start.split('-')[1];
            this.month = y + '-' + m;
          }
        }
        let data = [];
        let early = { name: '早退', value: 5 };
        let late = { name: '迟到', value: 4 };
        let no = { name: '旷课', value: 3 };
        /*let out = { name: '公出', value: 8 };*/
        let sick = { name: '病假', value: 6 };
        let staff = { name: '事假', value: 7 };
        data.push(early);
        data.push(late);
        data.push(no);
        // data.push(out);
        data.push(sick);
        data.push(staff);
        console.log(data);
        this.serverData = data;
        console.log("djifjdk");
        this.loading = false;
      }
    },
    created () {
      this.getChartData();
    },
    data () {
      return {
        loading: true,
        serverData: [],
        dateType: 'day',  // 设置默认显示当天的签到图表
        start: '',
        end: '',
        month: '',
        day: '',
        percent: 0,       // 签到人数百分比
        detail: {},
        visibility: false
      }
    },
    computed: {
      id () {
        return this.QD.getLocalUserinfo().stuObj.UserId;
      }
    }
  }
</script>
<style scoped>
  .page-detail{
    background-color: #f2f2f2;
    overflow-x: hidden;
  }
  .weektime{
    position: relative;
    top: 10px; left: 28%;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .daytime{
    position: relative;
    top: 10px; left: 40%;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .monthtime{
    position: relative;
    top: 10px; left: 42%;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>

