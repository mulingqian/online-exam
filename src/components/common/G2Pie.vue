<template>
  <!--此处的id用变量，方便同一页面引用多次相同的组件-->
  <div :id="id">
    <slot></slot>
  </div>
</template>

<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Datetime from 'vux/src/components/datetime/index.vue'

  export default {
    name: "g2-pie",
    directives: {
      TransferDom
    },
    components: {
      Datetime
    },
    data () {
      return {
        chart: null
      };
    },
    props: {
      charData: {
        type: Array,
        default: function () {
          return [{name: '已签到', value: 10}, {name: '未签到', value: 10}] // 测试数据，根据自己需求自己设置数据
        }
      },
      id: String
    },
    watch: {
      charData: function (val, oldVal) {                             // 监听charData，当放生变化时，触发这个回调函数绘制图表
        console.log('new: %s, old: %s', val, oldVal);
        this.drawChart(val);
      }
    },
    mounted () {
      console.log(this.charData);
      this.drawChart(this.charData);
    },
    methods: {
      // 画饼图
      drawChart: async function (datas) {
        // 如果图形存在则删除再创建
        this.chart && this.chart.destroy();
        let data = datas;
        console.log(data);
        let G2 = await this.QD.getG2();
        this.chart = new G2.Chart({
          id: this.id,
          forceFit: true,
          height: 300,
          plotCfg: {
            margin: [40, 40, 80, 40]
          }
        });
        this.chart.source(data);
        this.chart.coord('polar', {
          startAngle: Math.PI, // 起始角度
          endAngle: Math.PI * (3 / 2) // 结束角度
        });
        this.chart.axis('value', {
          labels: null
        });
        this.chart.axis('name', {
          gridAlign: 'middle',
          labelOffset: 8,
          labels: {
            label: {
              textAlign: 'center' // 设置坐标轴 label 的文本对齐方向
            }
          }
        });
        this.chart.legend('name', {
          position: 'bottom',
          itemWrap: true // 图例换行，将该参数设置为 true, 默认为 false，不换行。
        });
        this.chart.interval().position('name*value')
          .color('name', 'rgb(252,143,72)-rgb(255,215,135)')
          .label('value', {offset: -10, label: {textAlign: 'center', fontWeight: 'bold'}})
          .style({
            lineWidth: 1,
            stroke: '#fff'
          });
        this.chart.render();
      }
    },
    created () {
    },
    computed: {
    }
  }
</script>
<style scoped>
</style>
