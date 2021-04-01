<template>
  <div class="eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="eachPgBase container">
      <group class="gp">
        <cell :is-link="true" @click.native="goSelectTeaClassmateCEX">
          <span slot="after-title">选择对调老师</span>
          <span v-if="selectTeaInfo">{{selectTeaInfo.xm}}<span class="zghVal">({{selectTeaInfo.zgh}})</span></span>
        </cell>
      </group>
      <course-in-t-k v-if="selectTeaInfo" :weekTitle="'调课目标周次'" :p_weeksVal="weeksVal" :weeksLst="weeksLst" :curTeaInfo="selectTeaInfo" :pkXqInfo="pkXqInfo"
                     :p_scheduleLst="scheduleLst" @get-schedule="getScheduleData" @select-course="selectCourseData"></course-in-t-k>
      <!-- btn start -->
      <button-two :titleOne="'取消'" :titleTwo="'确定'" :oneButtonClass="'button3'" :twoButtonClass="'button7'" @get-oneVal="cancelWay" @get-twoVal="sureWay"></button-two>
      <!-- btn end -->
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import CourseInTK from './CourseInTK.vue'
  import ButtonTwo from '../common/ButtonTwo.vue'
  export default {
    name: 'selectCourseCEXbndt',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      CourseInTK,
      ButtonTwo
    },
    methods: {
      // 取消
      cancelWay () {
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 确定按钮
      sureWay () {
        if (!this.selectTeaInfo) {
          this.QD.alert("", "请选择对调老师!");
          return;
        }
        if (!this.newCourseInfo) {
          this.QD.alert("", "请选择对调课时!");
          return;
        }
        this.QD.brotherPageData.otherPgInfo = {teaInfo: this.selectTeaInfo, newCourseInfo: this.newCourseInfo};
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-2);
        }
      },
      // 选择对调老师 - - 班内对调
      goSelectTeaClassmateCEX () {
        this.$router.push({path: '/courseExchange/selectTeaClassmateCEX'});
      },
      // 选择目标课时
      selectCourseData (e) {
        console.log("select new course", e);
        this.selectCourseIdx = e;
        let item = e.item;
        let nodeIdx = e.nodeIdx;
        let c = e.c;
        if (!this.scheduleLst.Nodes[nodeIdx][c].isSelected && this.newCourseInfo) {
          this.QD.alert("", "一次最多只能选择一个课时进行调课!");
          return;
        }
        this.scheduleLst.Nodes[nodeIdx][c].isSelected = !this.scheduleLst.Nodes[nodeIdx][c].isSelected; // 设置点击之后的课程样式
        if (!this.scheduleLst.Nodes[nodeIdx][c].isSelected) { // 之前选中，现在不选中
          this.newCourseInfo = null;
        } else {
          this.newCourseInfo = item;
          this.newCourseInfo.newWeeksVal = this.weeksVal; // 选中的目标周次
          this.getNewApplicableNodes(); // 读取目标课表 B 老师选中课程（无冲突的课时）
        }
      },
      // 得到课表数据和相对应的周次
      getScheduleData (e) {
        this.scheduleLst = e.scheduleLst;
        this.weeksVal = e.weeksVal;
        this.newCourseInfo = null; // 清空之前选中的对调课时
        console.log("select new week", this.weeksVal);
        this.getCurApplicableNodes(); // 读取原课表 A 老师选中课程（无冲突的课时）
      },
      // 读取原课表 A 老师选中课程（无冲突的课时）
      async getCurApplicableNodes () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetApplicableNodesForTK',
          changeRange: 4, // 调课范围，1-代课，2-教室，3-时间，4-班内对调
          semId: this.pkXqInfo.XQID,
          weekIndex: this.weeksVal[0], // 目标课时周次
          jxbid: this.oriScheduleSelect[0].JXBID, // 原教学班id
          jxbRoomId: 0 // 传0即可- 在pc端中是重新设置的新教室id
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取原课表无冲突课时的数据失败:${d.msg}`);
          return;
        }
        d = JSON.parse(d);
        console.log("current applicable notes = ", d);
        this.curApplicableNodes = d.nodes;
      },
      // 读取目标课表 B 老师选中课程（无冲突的课时）
      async getNewApplicableNodes () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetApplicableNodesForTK',
          changeRange: 4, // 调课范围，1-代课，2-教室，3-时间，4-班内对调
          semId: this.pkXqInfo.XQID,
          weekIndex: this.oriWeeksVal[0], // 原课时周次
          jxbid: this.newCourseInfo.JXBID, // 目标教学班id
          jxbRoomId: 0 // 传0即可- 在pc端中是重新设置的新教室id
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取目标课表无冲突课时的数据失败:${d.msg}`);
          return;
        }
        d = JSON.parse(d);
        console.log("new applicable notes = ", d);
        this.newApplicableNodes = d.nodes;
        this.judgeBNDT(); // 判断班内对调是否有冲突
      },
      // 判断班内对调是否有冲突
      judgeBNDT () {
        console.log("oriScheduleSelect", this.oriScheduleSelect);
        // 1.判断A老师的课程在B老师课表中是否冲突
        let oriApplicableNode = false; // 默认有冲突 - a
        let newApplicableNode = false; // 默认有冲突 - b
        for (let i=0; i<this.newApplicableNodes.length; i++) {
          let newN = this.newApplicableNodes[i];
          if (this.oriScheduleSelect[0].NodeIndex === newN.nodeIndex && this.oriScheduleSelect[0].DayIndex === newN.dayOfWeek) {
            oriApplicableNode = true; // 无冲突
            break;
          }
        }
        // 2.判断B老师的课程在A老师课表中是否冲突
        if (oriApplicableNode) {
          for (let k=0; k<this.curApplicableNodes.length; k++) {
            let oriN = this.curApplicableNodes[k];
            if (this.newCourseInfo.NodeIndex === oriN.nodeIndex && this.newCourseInfo.DayIndex === oriN.dayOfWeek) {
              newApplicableNode = true; // 无冲突
              break;
            }
          }
        }
        if (!oriApplicableNode || !newApplicableNode) {
          this.newCourseInfo = null;
          this.scheduleLst.Nodes[this.selectCourseIdx.nodeIdx][this.selectCourseIdx.c].isSelected = false;
          console.log("oriApplicableNode =", oriApplicableNode, "newApplicableNode =", newApplicableNode);
          this.QD.alert("", "对调课时有冲突!");
        }
      },
      // 得到对调的教师信息
      getOtherPgInfo () {
        if (this.QD.otherPageData && this.QD.otherPageData.teaInfo) {
          this.selectTeaInfo = this.QD.otherPageData.teaInfo;
          this.selectTeaInfo.ZGH = this.selectTeaInfo.zgh;
          this.QD.otherPageData = null;
        }
      },
      // 得到相关信息
      getRelativeInfo () {
        if (this.QD.currPageData && this.QD.brotherPageData && this.QD.brotherPageData.weeksVal) {
          let cqd = this.QD.currPageData;
          let qd = this.QD.brotherPageData;
          this.oriScheduleSelect = qd.oriScheduleSelect; // 选中原课表信息
          this.curTeaInfo = qd.curTeaInfo;
          this.pkXqInfo = cqd.pkXqInfo; // 排课学期信息
          this.weeksLst = qd.weeksLst; // 可选的周次
          this.weeksVal.push(this.weeksLst[0][0]); // 默认选中第一个可选的目标周次
          this.oriWeeksVal = qd.weeksVal; //  原课表中选中的周次
          this.getOtherPgInfo();  // 得到对调的教师信息
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getRelativeInfo(); // 得到相关信息
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        curTeaInfo: null, // 当前教师信息
        selectTeaInfo: null, // 选中目标教师的信息
        selectCourseIdx: null, // 选择的目标idx信息
        newCourseInfo: null, // 选中的目标课程信息
        pkXqInfo: null, // 排课学期信息
        oriWeeksVal: [], // 原课表中选中的周次
        weeksVal: [], // 默认选中当前目标周次
        weeksLst: [], // 当前学期下，调课可选的调课周次- 目标周次
        scheduleLst: { Nodes: [], CourseDate: [] }, // 目标课表信息
        oriScheduleSelect: [], // 选中原课表中的数据
        curApplicableNodes: [], // 原课表中选中课程无冲突的课时列表
        newApplicableNodes: [] // 目标无冲突的课时列表
      }
    }
  }
</script>
<style scoped>
  .container{
    margin-bottom: 48px;
    padding-bottom: 20px;
  }
  .gp{
    margin-top: -1.25em;
  }
  .zghVal{
    display: inline-block;
    padding-left: 6px;
    font-size: 14px;
    color: #666;
  }
</style>

