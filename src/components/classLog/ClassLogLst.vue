<template>
  <div class="classLogLst">
    <course-tea @log-load="loadSemesterData" ref="getCourseDate" :changeCourse="false"></course-tea>
    <div v-if="smstClassAttendData !== null && smstClassAttendData.length > 0" class="classLst">
      <group class="classLogGroup" v-for="(s,sIdx) in smstClassAttendData" :key="sIdx">
        <cell is-link @click.native="goClassLogEdit(s.KCMC, s.BJMCs, s.Teacher, s.Nodes, s.JXBID, s.TeachDay)">
          <div slot="after-title" class="vux-label">
            <div class="classLog-firstLine">
              <span>{{s.TeachDay}}</span>
              <span v-if="s.Times === 1">周一</span>
              <span v-else-if="s.Times === 2">周二</span>
              <span v-else-if="s.Times === 3">周三</span>
              <span v-else-if="s.Times === 4">周四</span>
              <span v-else-if="s.Times === 5">周五</span>
              <span v-else-if="s.Times === 6">周六</span>
              <span v-else>周日</span>
              <span v-if="s.IsAdd" class="isAdd">已登记</span>
            </div>
            <span class="classLog-secondLine">
              <span style="font-weight: 600;">{{s.KCMC}}</span>
              <span style="float: right;padding-right: 10px;">第{{s.Nodes}}节</span>
            </span>
            <span class="classLog-thirdLine">
              <span v-if="s.BJMCs.length > 0">{{s.BJMCs}}</span>
              <span v-if="s.JSMC.length > 0">{{s.JSMC}}</span>
              <a style="padding-left: 15px;">实际人数:{{s.SJRS}}</a>
            </span>
            <span class="classLog-forthLine">
              <span v-if="s.ListCategory.length > 0" v-for="(cgy,cIdx) in s.ListCategory" :key="cIdx" class="cgyInfor">
                <span v-if="cgy.Category === '2'">迟到:<a>{{cgy.StuNum}}</a></span>
                <span v-else-if="cgy.Category === '4'"> 早退:<a>{{cgy.StuNum}}</a></span>
                <span v-else-if="cgy.Category === '8'"> 旷课:<a>{{cgy.StuNum}}</a></span>
                <span v-else-if="cgy.Category === '16'"> 事假:<a>{{cgy.StuNum}}</a></span>
                <span v-else-if="cgy.Category === '32'"> 病假:<a>{{cgy.StuNum}}</a></span>
              </span>
              <span v-if="s.ListCategory.length === 0" class="cgyInfor">
                <span>迟到:0 </span>
                <span> 早退:0 </span>
                <span> 旷课:0 </span>
                <span> 事假:0 </span>
                <span> 病假:0</span>
              </span>
            </span>
          </div>
        </cell>
      </group>
    </div>
  </div>
</template>
<script>
  import CourseTea from '../CourseTea.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'classLogLst',
    directives: {
      TransferDom
    },
    components: {
      CourseTea,
      Cell,
      Group
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      loadSemesterData (e) {
        this.xqId = e.XQID;
        this.weekIndex = e.weekIndex;
        this.getSmstClassAttendData();
        if (this.loaded) {
          this.getSetNodeTimes(); // 读取指定学期中每节课的上课时间
        }
        this.loaded = false;
      },
      // 根据学期和授课周次获取当前周次内教师的授课信息
      async getSmstClassAttendData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSmstClassAttendData', semId: this.xqId, weekIndex: this.weekIndex});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log("当前周次内教师的授课信息 失败");
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        this.smstClassAttendData = d;
        console.log("list", this.smstClassAttendData);
      },
      // 跳转到学生考勤页面，并将相关数据存入sessionStorage中
      goClassLogEdit (kcmc, bjmc, teacher, nodes, jxbId, teachDay) {
        /* 找出数组中最大/最小的节次 start */
        let nodeLst = nodes.split(",");
        let maxNode = nodeLst[0]; // 初始化最大的节次
        let minNode = nodeLst[0]; // 初始化最小的节次
        for (let i=1; i<nodeLst.length; i++) {
          if (maxNode<nodeLst[i]) {
            maxNode = nodeLst[i];
          }
          if (minNode>nodeLst[i]) {
            minNode = nodeLst[i];
          }
        }
        console.log('maxNode = ', maxNode, 'minNode =', minNode);
        /* 找出数组中最大/最小的节次 end */
        let resultRule = false;
        // 学校设置的登记时间到了即可登记
        if (this.nodeTimes.length === 0) { // 采用原来的方式
          resultRule = this.setRegisterRule({PkDay: teachDay, nodeIndex: parseInt(maxNode)}); // 判断是否可以登记
        } else {
          minNode = parseInt(minNode);
          // 判断第 nodeIndex = parseInt(minNode) 节，是否有设置上课时间
          for (let i=0; i<this.nodeTimes.length; i++) {
            let si = this.nodeTimes[i];
            if (si.nodeIndex === minNode && !si.compareTime) { // 采用原来的方式
              resultRule = this.setRegisterRule({PkDay: teachDay, nodeIndex: parseInt(maxNode)}); // 判断是否可以登记
              break;
            }
            if (si.nodeIndex === minNode && si.compareTime) { // 有设置登记时间
              if (si.timeLimitType === '随时') {
                resultRule = true; // 总是可以登记
              } else { // timeLimitType === '课前' ； timeLimitType === '课后'
                resultRule = this.judgeRegisterRule({PkDay: teachDay, nodeTime: si});
              }
              break; // 已经找到上课的最小节次对应的上课时间信息
            }
          }
        }
        if (!resultRule) {
          this.QD.alert('', '对不起, 当前班级的课程尚未上课, 不能进行登记 !');
          return;
        }
        sessionStorage.setItem("logEditKCMC", kcmc); // 课程名称
        sessionStorage.setItem("logEditBJMCs", bjmc); // 班级名称
        sessionStorage.setItem("logEditTeacher", teacher); // 教师姓名
        sessionStorage.setItem("logEditNodes", nodes); // 第几节课
        sessionStorage.setItem("logEditWeekIndex", this.weekIndex); // 第几周
        sessionStorage.setItem("logEditJXBID", jxbId); // 教学班id
        sessionStorage.setItem("logEditTeachDay", teachDay); // 课堂日期
        this.$router.push({path: '/classLog/classLogEdit'});
      },
      /* 判断是否可以登记, 以下是判断规则
       * 第1节第2节：2019-10-10 10:00 后才能登记
       第3节第4节：2019-10-10 12:00 后才能登记
       第5节第6节：2019-10-10 14:30 后才能登记
       第7节后：2019-10-10 16:00 后才能登记
       * */
      setRegisterRule (c) {
        console.log('nodeIndex and pkDay', c);
        let curTime = this.QD.getDateOrTime('time'); // 当前日期+具体时间
        let curTimeLst = (curTime.substr(11, 8)).split(":"); // 当前时分秒
        let curSecond = parseInt(curTimeLst[0]) * 60 * 60 + parseInt(curTimeLst[1]) * 60 + parseInt(curTimeLst[2]); // 当前秒
        let curDate = curTime.substr(0, 10); // 当前日期
        let pkDay = new Date(c.PkDay).getTime();
        let curDay = new Date(curDate).getTime();
        if (pkDay === curDay) { // 授课日期与当前日期相同
          if (c.nodeIndex < 3 && curSecond > 10 * 60* 60) { // 第1节第2节
            return true;
          } else if (c.nodeIndex < 5 && curSecond > 12 * 60* 60) { // 第3节第4节
            return true;
          } else if (c.nodeIndex < 7 && curSecond > 14 * 60* 60 + 30 * 60) {  // 第5节第6节
            return true;
          } else if (curSecond > 16 * 60 * 60) { // 第7节后
            return true;
          } else {
            return false;
          }
        } else if (pkDay < curDay) { // 授课日期小于当前日期
          return true;
        } else { // 授课日期大于当前日期
          return false;
        }
      },
      // 根据用户设置的登记时间，判断登记时间到了，即可去登记考勤
      judgeRegisterRule (c) {
        console.log('nodeIndex | pkDay = ', c);
        let nodeTime = c.nodeTime; // 学校设置的上课时间和可以登记的时间
        /*nodeTime.compareTime = '21:25'; // 测试数据
        c.PkDay = '2020-06-01';*/ // 测试数据
        let curTime = this.QD.getDateOrTime('time'); // 当前日期+具体时间
        let curTimeLst = (curTime.substr(11, 8)).split(":"); // 当前时分秒
        let curSecond = parseInt(curTimeLst[0]) * 60 * 60 + parseInt(curTimeLst[1]) * 60 + parseInt(curTimeLst[2]); // 当前秒
        let curDate = curTime.substr(0, 10); // 当前日期
        let pkDay = new Date(c.PkDay).getTime();
        let curDay = new Date(curDate).getTime();
        let skLst = nodeTime.compareTime.split(":"); // 登记时间的时、分
        let skSecond = parseInt(skLst[0]) * 60 * 60 + parseInt(skLst[1]) * 60; // 登记秒
        if (pkDay === curDay) { // 授课日期与当前日期相同
          if (skSecond <= curSecond) { // 登记时间已过了
            return true;
          } else { // 登记时间还未到
            return false;
          }
        } else if (pkDay < curDay) { // 授课日期小于当前日期
          return true;
        } else { // 授课日期大于当前日期
          return false;
        }
      },
      // 读取指定学期中每节课的上课时间
      async getSetNodeTimes () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSemesterNodeTimes', semId: this.xqId});
        this.updateLoadingStatus(false);
        d = JSON.parse(d);
        this.nodeTimes = d.data;
        console.log("nodeTimes", this.nodeTimes);
      }
    },
    data () {
      return {
        loaded: true, // 第一次渲染页面
        xqId: 0,
        weekIndex: 0,
        smstClassAttendData: [], // 当前周次内教师的授课信息
        nodeTimes: [], // 节次的上课时间、下课时间、登记时间的设置
        setNodeTimes: true // 已设置的节次的上课时间
      }
    },
    created () {
    }
  }
</script>
<style scoped>
  .classLst{
    margin-top: -55px;
    padding-bottom:10px;
    background-color: #f2f2f2;
    z-index: 5;
  }
  .classLogLst .classLogGroup .classLog-secondLine {
    display: block;
    overflow: hidden;
    font-size: 14px;
  }
  .classLogLst .classLogGroup .classLog-thirdLine{
    display: block;
    font-size: 14px;
  }
  .classLogLst .classLogGroup .classLog-forthLine{
    color: #333333;
  }
  .classLogLst .classLogGroup .classLog-forthLine .cgyInfor{
    font-size: 14px;
  }
  .classLog-firstLine{
    position: relative;
  }
  .isAdd{
    position: absolute;
    right: 0;
    font-size: 14px;
    color: #ff0000;
  }
</style>

