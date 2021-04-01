<template>
  <div>
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="gp">
      <popup-picker title="调课周次" v-model="weeksVal" :data="weeksLst" @on-change="changeWeeksVal"></popup-picker>
    </group>
    <!-- table start -->
    <div v-if="scheduleLst">
      <x-table>
        <thead>
        <tr>
          <td><span style="font-size:11px;color:#7b82b9;">节\周</span></td>
          <th class="tblHead" v-for="(x, index) in scheduleLst.CourseDate" v-if="index<5"><div class="datestr">{{x.substr(5,5)}}</div><div class="weekstr">{{weekDayLst[index]}}</div></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(y, idy) in scheduleLst.Nodes">
          <td class="node-index">{{idy+1}}</td>
          <td v-for="(x, idx) in scheduleLst.CourseDate" v-if="(!y[x] || y[x].span) > 0 && idx < 5" :rowspan="!y[x]?1:y[x].span"
              :class="[{'has-class': !!y[x] && y[x].KCMC}, (y[x] && y[x].KCMC && !y[x].isSelected ? y[x].bg : (y[x] && y[x].KCMC && y[x].isSelected) ? 'select_has_class': 'no-class')]" >
            <div v-if="!!y[x] && y[x].KCMC" @click="selectCourseData(y[x], idy, x)">
              <span>{{y[x].KCMC}}</span>
              <span>{{y[x].BJMCs}}</span>
              <span v-if="y[x].JSMCs">({{y[x].JSMCs}})</span>
            </div>
            <div v-else >&nbsp;</div>
          </td>
        </tr>
        </tbody>
      </x-table>
    </div>
    <!-- table end -->
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import XTable from 'vux/src/components/x-table/index.vue'
  export default {
    name: 'courseInTK',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      PopupPicker,
      XTable
    },
    props: {
      weekTitle: String, // 周次title
      p_weeksVal: Array, // 选中的周次
      weeksLst: Array, // 可选周次
      p_scheduleLst: {
        type: Object,
        default: function () {
          return { Nodes: [], CourseDate: [] }
        }
      }, // 课表内容
      curTeaInfo: Object, // 当前教师信息
      pkXqInfo: Object // 当前排课学期信息
    },
    methods: {
      // 改变调课周次
      changeWeeksVal (val) {
        console.log(val);
        this.getScheduleList(); // 当前周次下的教师课表数据
      },
      // 得到选中的课程
      selectCourseData (e, nodeIdx, c) {
        this.$emit('select-course', {item: e, nodeIdx: nodeIdx, c: c});
      },
      // 根据学期id 、周次、职工号获取读取指定老师一周的课表 "apiName":"TeaScheduleData","id":"ZJ002170","semId":4,"weekIndex":1,"type":"employee"
      async getScheduleList () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetTeacherScheduleExchange',
          zgh: this.curTeaInfo.ZGH,
          semId: this.pkXqInfo.XQID,
          weekIndex: this.weeksVal[0]
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.loading = false;
          this.QD.alert(`获取数据失败:${d.msg}`);
          return
        }
        d = JSON.parse(d);
        console.log('course self d = ', d);
        let x = d.CourseDate.length;
        let y = d.Nodes.length;
        let nextj, nextNode;
        let curNode = null;
        let tmpColor = null;
        let idxColor = 0;
        let mapColor = new Map();
        for (let j = 0; j < y; j++) {
          let nd = d.Nodes[j];
          for (let i = 0; i < x; i++) {
            curNode = nd.list.find((n) => n.WeekIndex === (i + 1));
            if (curNode) {
              // 跨行显示
              if (curNode.span !== 0) {
                // 设置颜色样式类
                tmpColor = mapColor.get(curNode.KCMC);
                if (tmpColor) {
                  curNode.bg = tmpColor
                } else {
                  curNode.bg = this.BgLst[idxColor++];
                  mapColor.set(curNode.KCMC, curNode.bg);
                  if (idxColor >= this.BgLst.length) {
                    idxColor = 0
                  }
                }
                curNode.span = 1;
                nextj = j + 1;
                curNode.isSelected = false; // 添加 isSelected 字段，判断课程是否被选中
              }
              nd[d.CourseDate[i]] = curNode
            } else {
              nd[d.CourseDate[i]] = null
            }
          }
        }
        this.scheduleLst = d;
        this.$emit('get-schedule', {scheduleLst: this.scheduleLst, weeksVal: this.weeksVal});
      },
      // 得到相关数据
      getRelativeData () {
        this.weeksVal = this.p_weeksVal; // 当前选中周次
        this.scheduleLst = this.p_scheduleLst;
        if (this.scheduleLst.Nodes.length <=0) {
          this.getScheduleList(); // 当前周次下的教师课表数据
        }
      }
    },
    created () {
      this.getRelativeData();
    },
    data () {
      return {
        loading: false,
        weeksVal: [], // 默认当前选中周次
        weekDayLst: ['一', '二', '三', '四', '五', '六', '日'],
        BgLst: ['course01', 'course02', 'course03', 'course04', 'course05', 'course06', 'course07', 'course08', 'course09', 'course10', 'course11', 'course12'],
        scheduleLst: {
          Nodes: [],
          CourseDate: []
        } // 课表数据
      }
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -1.25em;
  }
  .tblHead{
    background-color: #dfe2fa;
    font-size:14px;
    line-height:26px;
  }
  .node-index{
    background-color: #d8dcf9;
    width:35px;
  }
  .no-class{
    background-color: #eef0fe;
  }
  .has-class{
    width: 16.6667%;
    background-color: #fab882;
    font-size:12px;
    line-height:16px;
    color:#fff;
  }
  .select_has_class{
    background-color: #ff0000;
  }
  .has-class > div{
    padding: 10px 0;
  }
  .vux-table td:before, .vux-table th:before{
    border-bottom: 1px solid #fff;
    color: #fff;
  }
  .vux-table td:after, .vux-table th:after{
    border-right: 1px solid #fff;
    color: #fff;
  }
  .course01{
    background-color: #f79d54;;
  }
  .course02{
    background-color: #6070e9;
  }
  .course03{
    background-color: #5ba1f7;
  }
  .course04{
    background-color: #56a36c;
  }
  .course05{
    background-color: #a685e5;
  }
  .course06{
    background-color: #7e884f;
  }
  .course07{
    background-color: #31a79b;
  }
  .course08{
    background-color: #ee8077;
  }
  .course09{
    background-color: #6baf4a;
  }
  .course10{
    background-color: #2e68aa;
  }
  .course11{
    background-color: #e777ee;
  }
  .course12{
    background-color: #59b4d0;
  }
</style>
