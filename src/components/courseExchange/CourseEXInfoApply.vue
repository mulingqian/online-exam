<template>
  <div class="eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="container eachPgBase">
      <group style="margin-top: -1.25em;">
        <cell class="baseInfoHead" title="调课内容" :arrow-direction="'down'" :is-link="true"></cell>
        <!--<popup-picker title="调课周次" v-model="weeksVal" :data="weeksLst" @on-change="changeWeeksVal"></popup-picker>-->
      </group>
      <!-- table start -->
      <course-in-t-k v-if="curTeaInfo" :weekTitle="'调课周次'" :p_weeksVal="weeksVal" :weeksLst="weeksLst" :p_scheduleLst="scheduleLst" :curTeaInfo="curTeaInfo" :pkXqInfo="pkXqInfo"
                     @get-schedule="getScheduleData" @select-course="selectCourseData"></course-in-t-k>
      <!--<div v-if="scheduleLst">
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
      </div>-->
      <!-- table end -->
      <group v-if="baseInfo">
        <!-- 调课范围为代课，选择代课老师 start -->
        <cell v-if="baseInfo.ChangeRange === 1" :is-link="true" @click.native="goSelectTeaCEX">
          <span slot="after-title" class="cellTitleWid_100">选择代课老师</span>
          <span v-if="otherPgInfo.teaInfo">
            {{otherPgInfo.teaInfo.xm}}
            <span class="zghVal_r">({{otherPgInfo.teaInfo.zgh}})</span>
          </span>
        </cell>
        <!-- 调课范围为代课，选择代课老师 end -->
        <!-- 调课范围为教室，选择教室 start -->
        <cell v-if="baseInfo.ChangeRange === 2" :is-link="true" @click.native="goSelectRoomCEX">
          <span slot="after-title" class="cellTitleWid_100">选择上课教室</span>
          <span v-if="otherPgInfo.roomInfo">
            {{otherPgInfo.roomInfo.jsmc}}
            <span class="zghVal_r">({{otherPgInfo.roomInfo.jsdm}})</span>
          </span>
        </cell>
        <!-- 调课范围为教室，选择教室 end -->
        <!-- 调课范围为时间，选择课时 start -->
        <cell v-if="baseInfo.ChangeRange === 3" :is-link="true" @click.native="goSelectCourseCEX">
          <span slot="after-title">选择课时</span>
          <span v-if="otherPgInfo.newCourseInfo">
              {{otherPgInfo.newCourseInfo.weekIndex}}周 {{otherPgInfo.newCourseInfo.pkDate}} 第{{otherPgInfo.newCourseInfo.nodeIndex}}节
          </span>
        </cell>
        <!-- 调课范围为时间，选择课时 end -->
        <!-- 调课范围为班内对调 start -->
        <template  v-if="baseInfo.ChangeRange === 4">
          <!-- 选中课时 -->
          <cell :is-link="true" @click.native="goSelectCourseCEXbndt">
            <span slot="after-title">选择对调信息</span>
            <span v-if="otherPgInfo.newCourseInfo">
              {{otherPgInfo.newCourseInfo.weekIndex}}周 {{otherPgInfo.newCourseInfo.pkDate}} 第{{otherPgInfo.newCourseInfo.nodeIndex}}节
            </span>
          </cell>
        </template>
        <!-- 调课范围为班内对调 end -->
      </group>
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
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import XTable from 'vux/src/components/x-table/index.vue'
  import ButtonTwo from '../common/ButtonTwo.vue'
  import CourseInTK from './CourseInTK.vue'
  export default {
    name: 'courseEXInfoApply',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      PopupPicker,
      XTable,
      ButtonTwo,
      CourseInTK
    },
    methods: {
      // 取消
      cancelWay () {
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 确定调课内容
      sureWay () {
        if (this.baseInfo.ChangeRange === 1) { // 代课老师
          if (!this.otherPgInfo.teaInfo) {
            this.QD.alert("", "请选择代课教师");
            return;
          }
          // console.log('select schedule = ', this.oriScheduleSelect, 'select tea = ', this.otherPgInfo.teaInfo);
        } else if (this.baseInfo.ChangeRange === 2) { // 教室
          if (!this.otherPgInfo.roomInfo) {
            this.QD.alert("", "请选择上课教室");
            return;
          }
          // console.log('select schedule = ', this.oriScheduleSelect, 'select roomInfo = ', this.otherPgInfo.roomInfo);
        } else if (this.baseInfo.ChangeRange === 3) { // 时间
          if (!this.otherPgInfo.newCourseInfo) {
            this.QD.alert("", "请选择课时");
            return;
          }
        } else if (this.baseInfo.ChangeRange === 4) { // 班内对调
          if (!this.otherPgInfo.newCourseInfo) {
            this.QD.alert("", "请选择对调信息");
            return;
          }
          // console.log('select schedule = ', this.oriScheduleSelect, 'select newCourseInfo = ', this.otherPgInfo.newCourseInfo);
        }
        if (this.backLoaded) {
          this.backLoaded = false;
          this.saveCurrPgInfo();  // 保存当前页面的数据
          this.$router.go(-1); // 到基础信息页面
        }
      },
      // 选择代课教师
      goSelectTeaCEX () {
        if (this.oriScheduleSelect.length > 0) {
          this.saveCurrPgInfo();  // 保存当前页面的数据
          this.$router.push({path: '/courseExchange/selectTeaCEX'});
        } else {
          this.QD.alert('', '请在课表中选择要进行调课的课时!');
        }
      },
      // 选择上课教室
      goSelectRoomCEX () {
        if (this.oriScheduleSelect.length > 0) {
          this.saveCurrPgInfo();  // 保存当前页面的数据
          this.$router.push({path: '/courseExchange/selectRoomCEX'});
        } else {
          this.QD.alert('', '请在课表中选择要进行调课的课时!');
        }
      },
      // 选择课时-- 时间
      goSelectCourseCEX () {
        if (this.oriScheduleSelect.length > 0) {
          this.saveCurrPgInfo();  // 保存当前页面的数据
          this.$router.push({path: '/courseExchange/selectCourseCex'});
        } else {
          this.QD.alert('', '请在课表中选择要进行调课的课时!');
        }
      },
      // 选中课时- 班内对调
      goSelectCourseCEXbndt () {
        if (this.oriScheduleSelect.length <= 0) {
          this.QD.alert('', '请在课表中选择要进行调课的课时!');
          return;
        }
        this.saveCurrPgInfo();  // 保存当前页面的数据
        this.$router.push({path: '/courseExchange/selectCourseCEXbndt'});
      },
      // 记录的目标信息清空
      setClearForOtherData () {
        if (this.baseInfo.ChangeRange === 4) {
          this.otherPgInfo.newCourseInfo = null;
        } else if (this.baseInfo.ChangeRange === 2 || this.baseInfo.ChangeRange === 3) {
          this.otherPgInfo = {
            teaInfo: null, // 选中的教师信息
            roomInfo: null, // 选中的教室信息
            newCourseInfo: null // 选中的课时信息
          }
        }
      },
      // 得到选中的课程 item, nodeIdx, c
      selectCourseData (e) {
        let item = e.item;
        let nodeIdx = e.nodeIdx;
        let c = e.c;
        let hasSelected = false; // 默认开始没有被选中
        for (let i = 0; i<this.oriScheduleSelect.length; i++) {
          let s = this.oriScheduleSelect[i];
          if (s === item) { // 找出是否已经选中的，若之前是选中的，现在变为不选中
            this.oriScheduleSelect.splice(i, 1);
            this.scheduleLst.Nodes[nodeIdx][c].isSelected = false; // 去掉选中的原课表的样式
            this.$set(this.scheduleLst.Nodes, nodeIdx, this.scheduleLst.Nodes[nodeIdx]);
            hasSelected = true; // 之前有被选中了
            break;
          }
        }
        if ((this.baseInfo.ChangeRange === 2 || this.baseInfo.ChangeRange === 3 || this.baseInfo.ChangeRange === 4) && this.oriScheduleSelect.length >= 1) {
          this.QD.alert("", "一次最多只能选择一个课时进行调课");
          return;
        }
        if (!hasSelected) {
          this.scheduleLst.Nodes[nodeIdx][c].isSelected = true; // 设置选中的原课表的样式
          this.$set(this.scheduleLst.Nodes, nodeIdx, this.scheduleLst.Nodes[nodeIdx]);
          this.oriScheduleSelect.push(item); // 现在选中的课表信息，记录
        }
        this.setClearForOtherData(); // 记录的目标信息清空
        console.log("course = ", this.oriScheduleSelect);
      },
      // 得到课表数据和相对应的周次
      getScheduleData (e) {
        this.scheduleLst = e.scheduleLst;
        this.weeksVal = e.weeksVal;
        this.oriScheduleSelect = []; // 原来有选中的课时，现在清空
        this.setClearForOtherData(); // 记录的目标信息清空
      },
      // 保存当前页面的数据
      saveCurrPgInfo () {
        this.QD.brotherPageData = {
          weeksVal: this.weeksVal,
          weeksLst: this.weeksLst,
          oriScheduleSelect: this.oriScheduleSelect,
          scheduleLst: this.scheduleLst,
          otherPgInfo: this.otherPgInfo,
          curTeaInfo: this.curTeaInfo, // 当前教师用户信息
          eachBaseInfo: this.baseInfo // 保存每次调课内容中的基本信息
        }; // 当前页面
      },
      // 初始化学期信息
      initializeWeekInfo () {
        let wlst = [];
        for (let i=this.pkXqInfo.CurWeekIndex; i<=this.pkXqInfo.WeekCount; i++) {
          wlst.push(i);
        }
        this.weeksLst.push(wlst);
        this.weeksVal.push(this.pkXqInfo.CurWeekIndex); // 默认选中当前周次
        this.getCurrPgInfo(); // 保存当前页面的数据
      },
      // 得到当前页面的信息
      getCurrPgInfo () {
        if (this.QD.brotherPageData && this.QD.brotherPageData.weeksVal) {
          let qd = this.QD.brotherPageData;
          this.weeksVal = qd.weeksVal; // 选中的周次
          this.weeksLst = qd.weeksLst; // 可选的周次
          this.oriScheduleSelect = qd.oriScheduleSelect; // 选中的原科目信息
          this.scheduleLst = qd.scheduleLst; // 原课表信息
          this.otherPgInfo = qd.otherPgInfo; // 选中的其他页面信息
          this.curTeaInfo = qd.curTeaInfo; // 当前教师用户信息
          this.QD.brotherPageData = null;
        } else {
          this.curTeaInfo = this.QD.getLocalUserinfo().stuObj; // 当前教师用户信息
          // this.getScheduleList(); // 当前周次下的教师课表数据
        }
        this.getOtherPgInfo();
      },
      // 得到选中的其他页面信息
      getOtherPgInfo () {
        if (this.QD.otherPageData) {
          if (this.baseInfo.ChangeRange === 1) { // 调课范围(1-代课
            this.otherPgInfo.teaInfo = this.QD.otherPageData;
          } else if (this.baseInfo.ChangeRange === 2) { // 调课教室
            this.otherPgInfo.roomInfo = this.QD.otherPageData; // 选中的代课教室信息
          } else if (this.baseInfo.ChangeRange === 3) { // 时间
            this.otherPgInfo.newCourseInfo = this.QD.otherPageData.newCourseInfo; // 无冲突的课时
          } else if (this.baseInfo.ChangeRange === 4) { // 班内对调
            this.otherPgInfo.teaInfo = this.QD.otherPageData.teaInfo; // 教师
            this.otherPgInfo.newCourseInfo = this.QD.otherPageData.newCourseInfo; // 课时
          }
          this.QD.otherPageData = null;
        }
      },
      // 得到基础信息
      getBaseInfo () {
        if (this.QD.currPageData) {
          this.baseInfo = this.QD.currPageData.baseInfo; // 基础信息内容
          this.baseInfo = JSON.parse(JSON.stringify(this.baseInfo)); // 克隆- 调课范围可能每次选择的都不一样
          this.pkXqInfo = this.QD.currPageData.pkXqInfo; // 排课学期信息
          this.initializeWeekInfo();  // 初始化学期信息
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getBaseInfo(); // 得到基础信息
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        curTeaInfo: null, // 当前用户教师信息
        baseInfo: null, // 基础信息内容 - 调课范围(1-代课，2-教师，3-时间，4-班内对调)
        pkXqInfo: null, // 排课学期信息
        selectTeaInfo: null, // 选中的教师信息 - 代课、班内调课
        weeksVal: [], // 默认选中当前周次
        weeksLst: [], // 当前学期下，调课可选的调课周次
        scheduleLst: {
          Nodes: [],
          CourseDate: []
        }, // 课表数据
        oriScheduleSelect: [], // 选中原课表中的数据
        otherPgInfo: {
          teaInfo: null, // 选中的教师信息
          roomInfo: null, // 选中的教室信息
          newCourseInfo: null // 选中的课时信息
        }
      }
    }
  }
</script>
<style scoped>
  .container{
    padding-top: 1px;
    margin-bottom: 48px;
    padding-bottom: 20px;
  }
  .baseInfoHead{
    padding: 4px 15px;
    font-size: 14px;
    color: #999;
    background-color: #f5f5f9;
  }
  .cellTitleWid_100{
    display: inline-block;
    width: 100px;
  }
  .zghVal_r{
    font-size: 12px;
    color: #999999;
  }
</style>
