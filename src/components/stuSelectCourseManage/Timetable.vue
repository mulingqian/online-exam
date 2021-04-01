<template>
  <div>
    <table>
      <tbody>
       <tr>
         <td style="color: #7B82B9;">节\周</td>
         <td class="tblHead" v-for="(w,wIdx) in weeks" :key="wIdx">{{w}}</td>
       </tr>
      </tbody>
      <tbody v-if="!loaded">
        <tr v-for="n in totalNodes">
          <td class="node-index">{{n}}</td>
          <td v-if="item.Span !== 0" :rowspan="item.Span" :class="[(item.YHKCMC ? item.Bg + ' has-class': 'no-class')]"
              v-for="(item, iIdx) in tableInfo[n-1]" :key="iIdx">
            <div v-if="item.YHKCMC">
              <p>{{item.YHKCMC}}</p>
              <p v-if="item.KcInfo.Teachers">{{item.KcInfo.Teachers}}</p>
              <p v-if="item.KcInfo.JSMC">{{item.KcInfo.JSMC}}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  export default {
    name: "stuTimetable",
    directives: {
    },
    components: {
    },
    data () {
      return {
        loaded: true,
        tableInfo: null,
        totalNodes: -1, // 默认
        weeks: ['周一', '周二', '周三', '周四', '周五'],
        BgLst: ['course01', 'course02', 'course03', 'course04', 'course05', 'course06', 'course07', 'course08', 'course09', 'course10', 'course11', 'course12']
      }
    },
    created () {
      this.getRelativeData(); // 得到相关的数据- 课表内容数据
    },
    methods: {
      // 得到相关的数据- 课表内容数据
      getRelativeData () {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.tableInfo = qd.pkTimeLst;
          this.totalNodes = qd.totalNodes;
          let titleVal = '我的课表<span style="padding: 0 4px;font-size: 14px;">( '+qd.xqInfo.XQMC+' )</span>';
          this.setHeadTitle(titleVal);
          this.dealMergeCourse(); // 处理课表内容数据，连上的课程合并
        } else {
          this.$router.go(-1);
        }
      },
      // 设置标题
      setHeadTitle (val) {
        this.QD.setTitle(val); // 设置标题
      },
      // 处理课表内容数据，连上的课程合并
      dealMergeCourse () {
        // 初始化，默认占一个格子
        let mapColor = new Map();
        let tmpColor = null;
        let idxColor = 0;
        for (let k=0; k<this.tableInfo.length; k++) {
          for (let m=0; m<this.tableInfo[k].length; m++) {
            let res = this.tableInfo[k][m];
            res.Span = 1;
            /* 设置背景 颜色 start */
            tmpColor = mapColor.get(res.YHKCMC);
            if (tmpColor) {
              res.Bg = tmpColor
            } else {
              res.Bg = this.BgLst[idxColor++];
              mapColor.set(res.YHKCMC, res.Bg);
              if (idxColor >= this.BgLst.length) {
                idxColor = 0
              }
            }
            /* 设置背景 颜色 end */
          }
        }
        for (let w=0; w<this.weeks.length; w++) {
          for (let n=0; n<this.totalNodes; n++) {
            n = this.judgeMergeWay(w, n, n+1);
          }
        }
        this.loaded = false;
        console.log("kkkkkkkk", this.tableInfo[5]);
      },
      // 判断上下节课程是否合并
      judgeMergeWay (w, n, comN) {
        let st = this.tableInfo[n][w];
        if (st.YHKCMC) {
          if (n !== 3 && comN !== 4) { // 当前课程不是第四节课
            if (comN <this.totalNodes) { // 被比较课程不是最后一节课
              let comNSt = this.tableInfo[comN][w]; // 被比较节次的信息
              if (comNSt.YHKCMC) { // 被比较课程的下一节课是空
                if (st.KcInfo.YHKCMC + st.KcInfo.Teachers + st.KcInfo.JSMC === comNSt.KcInfo.YHKCMC + comNSt.KcInfo.Teachers + comNSt.KcInfo.JSMC) { // 当前课程和下一节课程一样
                  this.tableInfo[n][w].Span++;
                  comNSt.Span = 0; // 合并后，被比较课占0个格子
                  return this.judgeMergeWay(w, n, comN + 1); // 判断下节课是否可以再次合并
                }
              }
            }
          }
        }
        return comN - n > 1 ? comN - 1 : n;
      }
    }
  }
</script>
<style scoped>
  table{
    width: 100%;
    border-collapse: collapse;
    line-height: 40px;
  }
 table td{
    width:12.5%;
    padding: 5px 0;
    text-align: center;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
    font-size: 12px;
    color: #333333;
  }
  table .tblHead{
    background-color: #dfe2fa;
    font-size: 14px;
    line-height: 26px;
  }
  .node-index{
    background-color: #d8dcf9;
    width: 35px;
  }
  .no-class{
    background-color: #eef0fe;
  }
  table .has-class{
    line-height: 16px;
    color: #fff;
  }
</style>
