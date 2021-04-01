<template>
  <div class="p-dylst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <smst @on-load="onLoad" @on-hide="onHide" :showName="true" ></smst>
    <group></group>
    <div v-show="(!loading && (lst.length === 0))">
      <divider style="margin-top:50px;">暂无数据</divider>
    </div>
    <card :header="{title:`<span>当前德育分数： <span style='color:red;'>${totalScore}</span></div>`}">
      <div  slot="content" style="background-color:#fff;" id="dy-chart">
        <canvas id="c1" style="width:100%;height:160px;"></canvas>
      </div>
    </card>
    <group v-for="(x, index) in lst" :title='`${x.month}月`'  :key="index">
      <div class="weui-panel weui-panel_access">
        <div class="weui-panel__bd">
            <a v-for="item in x.items" @click.prevent="onItemClick(item)" class="weui-media-box weui-media-box_appmsg">
              <div class="weui-media-box__hd" >
                <span :class="['vux-badge', 'vux-badge-single', {'badge-add': item.type !== '1'}]">
                  {{item.type !== '1' ? '+' : '-'}}{{item.score}}
                </span>
              </div>
              <div class="weui-media-box__bd">
                <h4 class="weui-media-box__title">{{item.item}}</h4>
                <p class="weui-media-box__desc">{{item.time}}</p>
              </div>
            </a>
        </div>
        <div class="weui-panel__ft">
        </div>
      </div>
    </group>
  </div>
</template>

<script>
// import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
import Cell from 'vux/src/components/cell/index.vue'
import Group from 'vux/src/components/group/index.vue'
import Loading from 'vux/src/components/loading/index.vue'
import Divider from 'vux/src/components/divider/index.vue'
import Card from 'vux/src/components/card/index.vue'
import TransferDom from 'vux/src/directives/transfer-dom/index.js'
import Smst from './Smst.vue'
const LST_MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const defaultBasePoint = 80;
export default {
  name: "dyLst",
  directives: {
    TransferDom
  },
  components: {
    Cell,
    Group,
    Smst,
    Loading,
    Divider,
    Card
  },
  methods: {
    onLoad (e) {
      console.log("smst on load")
      console.log(e)
      e && e.XQID && this.getList(e.XQID)
    },
    onHide (t, e) {
      console.log("smst on hide")
      console.log(e)
      if (t === true && e && e.XQID) {
        this.loading = true
        this.getList(e.XQID)
      }
    },
    async getList (xqid) {
      let d = await this.QD.getData('/School/StuClient/DyList', {xqid: xqid})
      console.log(d)
      if (d.status && d.status === "error") {
        this.QD.alert(`获取数据失败:${d.msg}`)
      }
      this.lst = d.lst
      this.loading = false

      if (d.lst) {
        // 记录图表数据源
        this.parseChartData(d)
        window.setTimeout(this.drawChart, 100)
      }
    },
    // 转换图表数据源
    parseChartData (d) {
      this.cdata.startMonth = parseInt(d.StartDate.split('-')[1]);
      this.cdata.endMonth = parseInt(d.EndDate.split('-')[1]);
      let endM = this.cdata.endMonth > this.cdata.startMonth ? this.cdata.endMonth : this.cdata.endMonth + 12; // 跨年月份
      endM++  // 多显示一个月的X轴
      this.cdata.basePoint = d.BasePoint ? parseInt(d.BasePoint) : defaultBasePoint;
      this.cdata.data = [];
      let realM;    // 实际月份数值
      let indexM;     // 月份的索引
      let tmpItem;    // 查找到的月份记录
      let countDone = 0;  // 已处理的月份数
      let currScore = this.cdata.basePoint;
      // X轴
      this.cdata.xCategory = [];

      for (let i = this.cdata.startMonth; i <= endM; i++) {
        realM = i <= 12 ? i : i - 12;
        indexM = i - this.cdata.startMonth;
        // 添加X轴坐标目录
        this.cdata.xCategory.push(LST_MONTHS[realM - 1]);
        if (this.lst.length > 0 && countDone < this.lst.length) {
          tmpItem = this.lst.find((n) => n.month === realM)
          if (tmpItem) {
            currScore = currScore + tmpItem.score;
            countDone++;
          }
          this.cdata.data.push({month: indexM, score: currScore});
        }
      }
      if (this.cdata.data.length === 0) {
        this.cdata.data.push({month: 0, score: this.cdata.basePoint})
      }
      this.totalScore = currScore;
    },
    drawChart: async function () {
      let data = this.cdata.data
      let G2 = await this.QD.getG2()
      let chart = new G2.Chart({
        id: 'c1',
        forceFit: true,
        height: 120,
        margin: [30, 10, 40, 10]
      })
      chart.source(data, {
        month: {
          type: 'cat',
          alias: '月份',
          values: this.cdata.xCategory
        },
        score: {
          alias: '得分'
        }
      })
      chart.line().position('month*score').color("#ff8a00");
      chart.point().position('month*score').color("#ff8a00");
      chart.axis('month', {
        title: null,
        line: null,
        grid: null,
        tickLine: null,
        label: function (text, index, total) {
          let cfg = {
            fill: '#555555',
            fontSize: '12'
          }
          return cfg;
        }
      })
      chart.axis('score', {
        title: null,
        line: null,
        grid: null,
        label: null,
        tickLine: null
      })
      // 绘制数据
      data.forEach(function (obj, index) {
        chart.guide().html([obj.month, obj.score], `<div style='${index === data.length - 1 ? "color: #ff8a00;font-weight:bold;font-size:.9em;" : "color: #aaa;font-size:.8em;"}'><span>${obj.score}</span></div>`, {
          align: 'cc',
          offset: [0, -20]
        });
      });
      chart.render()
    }
  },
  created () {
  },
  data () {
    return {
      loading: true,
      lst: [],
      currentXQ: null,
      totalScore: null,
      cdata: {}   // 图表数据源
    }
  },
  computed: {
  }
}
</script>


<style scoped lang="less">
  @import '~vux/src/styles/weui/widget/weui_media_box/weui_media_box';
  .weui-media-box__title{
    white-space: normal;
  }
  .weui-media-box__desc{
    height:28px;
    line-height:28px;
  }
  .vux-badge.badge-add{
    background: #1AAD19;
  }

  .vux-badge-single {
    padding: 0;
    height: 48px;
    line-height: 48px;
    width: 48px;
    font-size: 20px;
    border-radius: 50%;
  }
</style>
