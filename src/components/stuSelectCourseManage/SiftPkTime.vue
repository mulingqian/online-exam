<template>
  <div>
    <div class="dialog-sift-box">
      <span class="hidden-panel school-wx-icon" @click.stop.prevent="hiddenPanelWay()">&#xe66c;</span>
      <p class="title-text">点击通过节次筛选</p>
      <table class="table">
        <tr>
          <td><span class="time-text"></span></td>
          <td><span class="circle"></span></td>
          <td v-for="(w, wIdx) in weeks" :key="wIdx">
            <span class="week-text circle">{{w}}</span>
          </td>
        </tr>
      </table>
      <div class="table-field">
        <table class="table">
          <tr class="tr-course" v-for="(n, nIdx) in totalNodes" :key="nIdx">
            <td v-if="nIdx === 0" rowspan="4"><span class="time-text">上午</span></td>
            <td v-if="nIdx === 4" :rowspan="totalNodes - 4"><span class="time-text">下午</span></td>
            <td class="td-node">
              <span :class="`circle ${nIdx < 4 ? 'morning-node': 'afternoon-node'}`">{{n}}</span>
              <span class="line-dashed line-right"></span>
              <span v-if="nIdx === 4" class="line-solid line-split"></span>
            </td>
            <td class="td-course" v-for="(c, cIdx) in selectedCoursePkTime[nIdx]" :key="cIdx">
              <span class="square have-course" v-if="c.YHKCMC">{{c.YHKCMC.substr(0, 2)}}</span>
              <span class="square no-course" v-if="!c.YHKCMC" @click.stop.prevent="selectWay(n, c)"></span>
              <span v-if="nIdx !== 4" class="line-dashed line-top"></span>
              <span v-if="nIdx === 4" class="line-solid line-split"></span>
              <span class="line-dashed line-left"></span>
              <span :class="`line-dashed ${cIdx !== 4 ? 'line-right' : ''}`"></span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "selectCourse-siftPkTime",
    directives: {
    },
    components: {
    },
    props: {
      selectedCoursePkTime: { // 已选课程时间列表
        type: Array,
        default: []
      },
      totalNodes: {
        type: Number,
        default: 8
      }
    },
    data () {
      return {
        weeks: ['周一', '周二', '周三', '周四', '周五'],
        siftInfo: {} // 筛选出来的信息-只能选择一个节次-如星期一第一节
      }
    },
    created () {
    },
    methods: {
      // 筛选的方法
      selectWay(node, course) {
        this.$emit('getSelectInfo', {node: node, course: course});
        this.hiddenPanelWay(); // 隐藏面板
      },
      // 隐藏面板
      hiddenPanelWay() {
        this.$emit('hiddenPanel');
      }
    }
  }
</script>
<style scoped>
  .hidden-panel{
    position: absolute;
    right: 0;
    padding: 14px 12px 10px 12px;
    color: #666666;
    font-size: 18px;
  }
  .title-text{
    padding-top: 14px;
    padding-bottom: 14px;
    font-size: 14px;
    color: #333333;
  }
  .table-field{
    position: absolute;
    top: 78px;
    bottom: 20px;
    left: 0;
    width: 100%;
    margin: auto;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .table{
    margin: 0 auto;
  }
  .table tr>td{
    padding-right: 6px;
  }
  .time-text{
    display: inline-block;
    width: 15px;
    font-size: 12px;
    color: #858585;
    line-height: 30px;
  }
  .circle{
    display: inline-block;
    width: 35px;
    height: 35px;
    color: #ffffff;
    font-size: 12px;
    line-height: 35px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .tr-course>td{
    position: relative;
    padding-top: 11px;
  }
  .tr-course .td-course{
    padding-left: 3px;
    padding-right: 9px;
    padding-top: 15px;
  }
  .afternoon-node,
  .week-text{
    background-color: #26a69a;
  }
  .morning-node{
    background-color: #66bb6a;
  }
  .square{
    display: inline-block;
    width: 27px;
    height: 27px;
    line-height: 27px;
    color: #c5c5c5;
    font-size: 10px;
    text-align: center;
    border-radius: 5px;
  }
  .have-course{
    border: 1px solid #c5c5c5;
  }
  .no-course{
    border: 1px solid #ffb300;
  }
  .line-solid,
  .line-dashed{
    position: absolute;
  }
  .td-node .line-split,
  .td-course .line-split{
    top: 6px;
    left: -6px;
    width: 43px;
    height: 0;
    border-top: 1px solid #d0d0d0;
  }
  .td-node .line-right{
    top: 30px;
    left: 35px;
    height: 1px;
    width: 4px;
    border-top: 1px dashed #26a69a;
  }
  .td-course .line-top{
    top: 0;
    left: 17px;
    height: 15px;
    width: 0;
    border-left: 1px dashed #26a69a;
  }
  .td-course .line-left{
    top: 30px;
    left: 0;
    height: 1px;
    width: 3px;
    border-top: 1px dashed #26a69a;
  }
  .td-course .line-right{
    top: 30px;
    left: 32px;
    height: 1px;
    width: 9px;
    border-top: 1px dashed #26a69a;
  }
</style>
