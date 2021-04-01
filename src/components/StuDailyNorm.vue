<template>
  <div class="stuDailyNorm">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="stuDailyNormChart" id="stuDailyNormChart" :style="{width: '100%',height: '200px'}"></div>
    <div class="normTitle"><span>列表详情</span></div>
    <div>
      <ex-scroller v-model="stuNormData" :onGetList="getStudentProjectRequestByXH"
                   height="-272">
        <div style="margin-top: 18px;"></div>
        <div class="normDetail" v-if="stuNormData.length > 0" v-for="(s,sIdx) in stuNormData" :key="sIdx">
          <span v-if="s.Type === '0'">学分值：{{s.Point}}</span><!--学分类型，0 加分 1 减分-->
          <span v-if="s.Type === '1'" style="color: #ff0000">学分值：-{{s.Point}}</span>
          <div class="stuNote">{{s.Note}} {{s.DataChange_LastTime}}</div>
        </div>
      </ex-scroller>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import ExScroller from './common/ExScroller.vue'

  /*import echarts from 'echarts'*/
  /*import echarts from 'echarts/src/component/angleAxis.js'*/
  // 引入基本模板
  let echarts = require('echarts/lib/echarts');
  // 引入图组件
  require('echarts/lib/chart/gauge');
  export default {
    name: "stuDailyNorm",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      ExScroller
    },
    methods: {
      // 根据学号获取日常规范总分
      async getStudentTotalPointByXH() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStudentTotalPointByXH', XH: this.QD.getLocalUserinfo().stuObj.XH});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.stuDailyTotalPoint = d;
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('stuDailyNormChart'));
        /*指定图表的配置和数据start*/
        myChart.setOption({
          /*tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },*/
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: '成绩',
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              center: ['50%', '90%'],    // 默认全局居中
              radius: 120,
              axisLine: {            // 坐标轴线
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: [[0.6, '#ff7f50'], [0.7, '#87cefa'], [0.8, '#da70d6'], [0.9, '#32cd32'], [1.0, '#6495ed']],
                  width: 60
                }
              },
              axisTick: {            // 坐标轴小标记
                splitNumber: 10,   // 每份split细分多少段
                length: 6    // 属性length控制线长
              },
              axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                formatter: function (v) {
                  switch (v + '') {
                    case '60': return '合格';
                    case '70': return '中';
                    case '80': return '良';
                    case '90': return '优秀';
                    default: return '';
                  }
                },
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 'bolder'
                }
              },
              pointer: {
                width: 5,
                length: '90%'
              },
              title: {
                show: true,
                offsetCenter: [0, '-60%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  color: '#fff',
                  fontSize: 10
                }
              },
              detail: {
                show: true,
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 0,
                borderColor: '#ccc',
                color: '#999999',
                width: 100,
                height: 40,
                offsetCenter: [0, 10],       // x, y，单位px
                formatter: '{value}',
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontSize: 16
                }
              },
              data: [{ value: this.stuDailyTotalPoint }]
            }
          ]
        });
        /*指定图表的配置和数据end*/
      },
      /*根据学号获取日常登记信息*/
      async getStudentProjectRequestByXH(idx, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStudentProjectRequestByXH',
          XH: this.QD.getLocalUserinfo().stuObj.XH,
          pageIndex: idx,
          pageSize: size,
          status: 3
        });
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        return d;
      }
    },
    created () {
      this.getStudentTotalPointByXH();
    },
    data () {
      return {
        loading: false,
        stuDailyTotalPoint: '', // 学生日常规范总分
        stuNormData: [] // 学生日常规范信息
      }
    }
  }
</script>
<style scoped>
  .stuDailyNorm .normTitle{
    padding: 4px 15px;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }
  .stuDailyNorm .normTitle span{
    font-size: 16px;
    color: #333333;
  }
  .stuDailyNorm .normDetail{
    padding: 10px 15px;
    line-height: 20px;
    border-top: 1px solid #e5e5e5;
  }
  .stuDailyNorm .normDetail:last-child{
    border-bottom: 1px solid #e5e5e5;
  }
  .stuDailyNorm .normDetail span{
    font-size: 16px;
    color: #333333;
  }
  .stuDailyNorm .normDetail div{
    font-size: 14px;
    color: #666666;
  }
</style>
