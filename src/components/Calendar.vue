<template>
    <div class="calen">
     <div style="position: relative;width:100%;height: auto;">
        <grid :cols="8" class="title-grids">
          <grid-item>
            <span class="grid-center">周次</span>
          </grid-item>
          <grid-item>
            <span class="grid-center">日</span>
          </grid-item>
          <grid-item>
            <span class="grid-center">一</span>
          </grid-item>
          <grid-item>
            <span class="grid-center">二</span>
          </grid-item>
          <grid-item>
            <span class="grid-center">三</span>
          </grid-item>
          <grid-item>
            <span class="grid-center">四</span>
          </grid-item>
          <grid-item>
            <span class="grid-center">五</span>
          </grid-item>
          <grid-item>
            <span class="grid-center">六</span>
          </grid-item>
        </grid>
      </div>
      <div v-if="isShowCurrDate">
        <grid :cols="8" v-if="currDayLst.length !== 0">
          <grid-item v-for="(cd, cdidx) in currDayLst" :key="cdidx">
            <span class="grid-center">
              <span v-if="!cd.firstDay" :class="cd.className">{{cd.day}}</span>
              <span v-if="cd.firstDay === true " style="color:red;" :class="cd.className" > {{cd.month + 1}}月</span>
            </span>
          </grid-item>
        </grid>
      </div>
      <scroller lock-x @on-scroll="onScroll" :scrollbar-y="true" :height="currDayLst.length !== 0 ? '-157' : '-102'">
        <div>
          <grid :cols="8" v-if="alldays.length !== 0">
            <grid-item v-for="(eachday, idx) in alldays" :key="idx">
            <span class="grid-center">
              <span v-if="!eachday.firstDay" :class="eachday.className">{{eachday.day}}</span>
              <span v-if="eachday.firstDay === true " style="color:red;" :class="eachday.className" > {{eachday.month + 1}}月</span>
            </span>
            </grid-item>
          </grid>
          <grid>
            <grid-item :cols="1" v-if="this.startDate != null && this.endDate != null">
              <span v-html="remarkDate" class="grid-center"></span>
            </grid-item>
          </grid>
          <grid v-for="(wRemak, widx) in wRemaks" :key="widx" v-if="wRemaks!== null">
            <grid-item>
              <span class="wRemak-center"><span class="wRR">{{wRemak.wNum}}</span>{{wRemak.wRem}}</span>
            </grid-item>
          </grid>
        </div>
      </scroller>
    </div>
</template>
<script>
  import { Scroller, Grid, GridItem } from 'vux'
  export default {
    name: "calendar",
    components: {
      Scroller,
      Grid,
      GridItem
    },
    methods: {
        // 滑动处理事件
      onScroll (pos) {
        let currRange = (this.currWeekIndex-1) * 55;
        if (currRange < pos.top){
          this.isShowCurrDate = true;
        } else {
          this.isShowCurrDate = false;
        }
        /*console.log(`pos.top is ${pos.top}`);*/
      },
      // 获取校历信息
      async getOfficeSchoolCalendar(){
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'OfficeSchoolCalendar'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败`);
          return;
        }
        this.QD.setTitle(d.XQMC); // 设置标题，当前校历的学期名称为页面的标题
        this.startDate = new Date(d.StartDate); //开始日期
        this.endDate = new Date(d.EndDate); //结束日期
        this.remarkDate = d.StartDate + ' 至 ' + d.EndDate;
        console.log(`end is ${this.endDate}....start is ${this.startDate}`);
        if (d !== null && d.StartDate !== null && d.EndDate !== null) {
          let currDate = new Date(); //当前日期
          let cday = this.startDate;  // 记录当前循环处理的天数据
          let startDay = this.startDate.getDay();
          let wIndex = 1; // 周次
          let dIndex = 0; // 天索引
          // 处理开始空白天数
          this.alldays.push({data: 0, day: wIndex++});  // 第一周
          for (let i= 0; i< startDay; i++) {
            this.alldays.push({type: 1, day: ""});
          }
          while (cday <= this.endDate) {
            // 判断是否添加周次
            if ((startDay + dIndex) % 7 === 0){
              this.alldays.push({type: 0, day: wIndex++});
            }
            // 添加实际每一天,firstDay:是否每月的1号
            this.alldays.push({
              firstDay: cday.getDate() === 1, // 是否每月的1号
              type: 1,
              day: cday.getDate(),
              month: cday.getMonth(),
              className: currDate.toLocaleDateString() === cday.toLocaleDateString() ? "aCurrCalendar" : ""
            });
            // 获取当前时间 所在的周次
            if (currDate.toLocaleDateString() === cday.toLocaleDateString()) {
              this.currWeekIndex = wIndex - 1;
              this.ddIdx = dIndex+wIndex-cday.getDay()-1;
              /*this.currDayLst = this.alldays[this.ddIdx];*/
              console.log(`aaa day is ${this.currDayLst.day} and dindex is ${this.ddIdx} `);
            }
            //设置下一天
            cday.setDate(cday.getDate() + 1);
            dIndex++;
          }// while end
          // 给当前日期一周数据赋值
          if (this.currWeekIndex !== '' && this.ddIdx !== '') {
            for (let c=0; c<8; c++){
              this.currDayLst.push(this.alldays[this.ddIdx++]);
            }
          }
          /*console.log(this.currDayLst);*/
           //显示周备注
          if (d.WeekRemark !== null && d.WeekRemark.length > 0) {
            let weekRemaks = d.WeekRemark.split('$');
            for (let i = 0; i < weekRemaks.length; i++) {
              if (weekRemaks[i].length > 0) {
                console.log(`weekRemarks is ${weekRemaks[i]} and i is ${i+1}`);
                this.wRemaks.push({wRem: weekRemaks[i], wNum: i+1});
              }
            }
          } // 显示周备注 if end
        }//if end (d != null && d.StartDate != null && d.EndDate != null)
      }
    },
    created (){
      this.getOfficeSchoolCalendar();
    },
    data (){
      return {
        currentXQ: null, // 当前学期信息
        isShowCurrDate: false, // 是否显示当前日期
        currDayLst: [], // 当前日期一周数据
        ddIdx: '', // 当前日期所在周 开始第一行的索引
        alldays: [],
        startDate: '', //开始日期
        endDate: '', //结束日期
        currWeekIndex: '', // 记录当前时间所在的周次
        remarkDate: '', //备注从开始日期到结束日期
        wRemaks: [] //周备注
      }
    }
  }
</script>
<style>
  .calen .xs-container {
    margin-top: 0;
  }
  .calen .title-grids{
    border-bottom: 1px solid #D9D9D9;
  }
  .calen .weui-grids:before{
    border-top: 0 solid #D9D9D9;
  }
  .calen .weui-grid{
    padding: 10px 4px;
  }
  .calen .weui-grid:before{
    border-right:0 solid #D9D9D9;
  }
  .calen .weui-grid:after{
    border-bottom:0 solid #D9D9D9;
  }
  .calen .weui-grid .grid-center{
    display: block;
    width:100%;
    line-height: 35px;
    font-size: 14px;
    color: #444;
    text-align: center;
  }
  .calen .weui-grid .wRemak-center{
    display: block;
    width:100%;
    line-height: 35px;
    font-size: 14px;
    color: #444;
  }
  .calen .weui-grid .wRR{
    margin-left: 10px;
    margin-right: 8px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    -webkit-border-radius: 15px;
    font-size: 16px;
    background: #00ABEC;
    color: #fff;
    text-align: center;
    display: inline-block;
  }
  .calen .aCurrCalendar {
    width: 100%;
    height: 100%;
    background-color: #00ABEC;
    margin: 0 auto;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    color: #fff;
    display: inline-block;
    text-align: center;
  }
</style>
