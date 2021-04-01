<template>
  <div class="eachPgBase stuSelectCourse">
    <div class="container">
      <tab class="tab-field">
        <tab-item class="item" :selected="showLst" @on-item-click="selectiveCourseTitle(0)">备选课程</tab-item>
        <tab-item class="item" :selected="!showLst" @on-item-click="selectiveCourseTitle(1)">已选课程</tab-item>
      </tab>
      <p class="sift-field" v-show="showLst">
        <span class="sift-default" v-if="!siftPKTimeInfo">
          <a class="sift-box" @click.stop.prevent="setSiftPkTime()">
            <span slot="icon" class="school-wx-icon selectIcon">&#xe6c5;</span>
            <span class="text">节次筛选</span>
          </a>
        </span>
        <span class="sift-selected" v-if="siftPKTimeInfo">
          <a class="sift-selected-a" @click.stop.prevent="cancelSiftWay">
            <span class="text">以下是{{siftPKTimeInfo.PkTime}}课程</span>
            <span class="text cancel-text">取消</span>
        </a>
        </span>
      </p>
      <p class="sift-field" v-show="!showLst">
        <span class="sift-default">
          <a class="sift-box" @click.stop.prevent="goLookTimetable()">
            <span slot="icon" class="school-wx-icon courseIcon">&#xe66b;</span>
            <span class="text">我的课表</span>
          </a>
        </span>
      </p>
      <!--备选课程-->
      <div class="selective-course-field" v-if="!loaded"  v-show="showLst">
        <divider v-if="selectiveList.length === 0">无数据</divider>
        <div v-for="(cs,csIdx) in selectiveList" :key="csIdx" :class="csIdx === selectiveList.length -1 ? 'last-lstInfo' : ''">
          <div class="course-info" @click.stop.prevent="showJxbData(csIdx)" :class="cs.CourseInfo.FullRS ? 'close-select-course' : 'open-select-course'">
            <p class="lf"><span class="school-wx-icon ive-icon">&#xe657;</span></p>
            <div class="rg">
              <div class="kcmc-field">
                <p class="kcmc-box">
                  <span class="kcmc">{{cs.CourseInfo.YHKCMC}}</span>
                </p>
                <span v-if="!cs.openExpand" class="school-wx-icon arrow-icon">&#xe638;</span> <!-- 向下的箭头-->
                <span v-if="cs.openExpand" class="school-wx-icon arrow-icon">&#xe9fb;</span> <!-- 展开的箭头-->
              </div>
              <p class="course-type-box">
                <span class="courseType">{{cs.CourseInfo.KCLX}}/{{cs.CourseInfo.ElectiveCourse}}</span>
                <span v-if="cs.CourseInfo.FullRS" class="close-text">不可选</span>
              </p> <!--课程类型/选修课类型-->
              <p class="zks-info">
                <span class="desc-zks">周课时: {{cs.CourseInfo.ZKS}}</span>
                <span>学分: {{cs.CourseInfo.XF}}</span>
              </p>
            </div>
          </div>
          <!-- 以下是展开的教学班信息 start -->
            <div :class="cs.openExpand ? 'animate jxb-box': 'jxb-box'">
            <div class="jxb-info" v-for="(s, sIdx) in cs.ClassList" :key="sIdx">
              <p>
                <span class="jxbmc">{{s.JXBMC}}</span>
                <span v-if="openXK === true && s.KXRS > 0" class="btn sure-btn" @click="doElectClass(s.JXBID)">选课</span> <!-- 可以选课-->
                <span v-if="openXK === true && s.KXRS <= 0" class="btn full-btn">已满</span> <!-- 人满按钮-->
                <span v-if="openXK === false" class="btn close-btn">结束</span> <!-- 人满按钮-->
              </p>
              <p class="desc1-1">
                <span class="tea-info">{{s.Teachers}}</span>
                <span class="kxre-info" v-if="s.KXRS > 0">可选人数: <a class="num">{{s.KXRS}}</a></span>
              </p>
              <p class="pk-time-box">{{s.PkTime}}</p>
            </div>
          </div>
          <!-- 以下是展开的教学班信息 end -->
        </div>
      </div>
      <!--备选课程end-->
      <!--已选课程 start -->
      <div class="selected-course-field" v-show="!showLst">
        <divider v-if="selectedList.length === 0">无数据</divider>
        <div v-for="(s,sIdx) in selectedList" :key="sIdx" class="selected-box" :class="sIdx === selectedList.length -1 ? 'last-lstInfo' : ''">
          <p class="lf">
            <span class="school-wx-icon selected-icon">&#xe659;</span>
          </p>
          <div class="rg">
            <p>
              <span class="jxbmc">{{s.JXBMC}}</span>
              <span v-if="openXK === true && s.IsXK === true" class="btn refund-btn" @click="doDropClass(s.JXBID)">退课</span>
            </p>
            <p class="tea-info-box">
              <span class="tea-info">{{s.Teachers}}</span>
            </p>
            <p class="zks-info">
              <span class="desc-zks">周课时: {{s.ZKS}}</span>
              <span>学分: {{s.XF}}</span>
            </p>
            <p class="pk-time-box">{{s.PkTime}}</p>
          </div>
        </div>
      </div>
      <!--已选课程end-->
      <!-- 节次筛选弹框内容 start -->
      <div v-transfer-dom>
        <x-dialog v-if="totalNodes !== -1" v-model="dialogShow.siftPkTime" class="dialog-selectCourse-pkTime" :hide-on-blur="true">
          <sift-pktime @getSelectInfo="getSelectPkTimeInfo" @hiddenPanel="hiddenPanel()" :selectedCoursePkTime="selectedCoursePkTime" :totalNodes="totalNodes"></sift-pktime>
        </x-dialog>
      </div>
      <!-- 节次筛选弹框内容 end -->
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import XDialog from 'vux/src/components/x-dialog/index.vue'
  import SiftPktime from './SiftPkTime.vue'
  import { mapActions } from 'vuex'
  export default {
    name: "stuSelectCourse",
    directives: {
      TransferDom
    },
    components: {
      Tab,
      TabItem,
      Group,
      Cell,
      Divider,
      XDialog,
      SiftPktime
    },
    data () {
      return {
        loaded: true,
        userInfo: null,
        showLst: true,
        dialogShow: {siftPkTime: false}, // dialogShow 弹出框是否显示
        xqInfo: null, // 学期信息
        totalNodes: -1, // 课表的节次总数
        selectedCoursePkTime: [[{"PkTime": "星期一第一节", "YHKCMC": ""}, {"PkTime": "星期二第一节", "YHKCMC": ""}, {"PkTime": "星期三第一节", "YHKCMC": ""}, {"PkTime": "星期四第一节", "YHKCMC": ""}, {"PkTime": "星期五第一节", "YHKCMC": ""}],
          [{"PkTime": "星期一第二节", "YHKCMC": ""}, {"PkTime": "星期二第二节", "YHKCMC": ""}, {"PkTime": "星期三第二节", "YHKCMC": ""}, {"PkTime": "星期四第二节", "YHKCMC": ""}, {"PkTime": "星期五第二节", "YHKCMC": ""}],
          [{"PkTime": "星期一第三节", "YHKCMC": ""}, {"PkTime": "星期二第三节", "YHKCMC": ""}, {"PkTime": "星期三第三节", "YHKCMC": ""}, {"PkTime": "星期四第三节", "YHKCMC": ""}, {"PkTime": "星期五第三节", "YHKCMC": ""}],
          [{"PkTime": "星期一第四节", "YHKCMC": ""}, {"PkTime": "星期二第四节", "YHKCMC": ""}, {"PkTime": "星期三第四节", "YHKCMC": ""}, {"PkTime": "星期四第四节", "YHKCMC": ""}, {"PkTime": "星期五第四节", "YHKCMC": ""}],
          [{"PkTime": "星期一第五节", "YHKCMC": ""}, {"PkTime": "星期二第五节", "YHKCMC": ""}, {"PkTime": "星期三第五节", "YHKCMC": ""}, {"PkTime": "星期四第五节", "YHKCMC": ""}, {"PkTime": "星期五第五节", "YHKCMC": ""}],
          [{"PkTime": "星期一第六节", "YHKCMC": ""}, {"PkTime": "星期二第六节", "YHKCMC": ""}, {"PkTime": "星期三第六节", "YHKCMC": ""}, {"PkTime": "星期四第六节", "YHKCMC": ""}, {"PkTime": "星期五第六节", "YHKCMC": ""}],
          [{"PkTime": "星期一第七节", "YHKCMC": ""}, {"PkTime": "星期二第七节", "YHKCMC": ""}, {"PkTime": "星期三第七节", "YHKCMC": ""}, {"PkTime": "星期四第七节", "YHKCMC": ""}, {"PkTime": "星期五第七节", "YHKCMC": ""}],
          [{"PkTime": "星期一第八节", "YHKCMC": ""}, {"PkTime": "星期二第八节", "YHKCMC": ""}, {"PkTime": "星期三第八节", "YHKCMC": ""}, {"PkTime": "星期四第八节", "YHKCMC": ""}, {"PkTime": "星期五第八节", "YHKCMC": ""}],
          [{"PkTime": "星期一第九节", "YHKCMC": ""}, {"PkTime": "星期二第九节", "YHKCMC": ""}, {"PkTime": "星期三第九节", "YHKCMC": ""}, {"PkTime": "星期四第九节", "YHKCMC": ""}, {"PkTime": "星期五第九节", "YHKCMC": ""}],
          [{"PkTime": "星期一第十节", "YHKCMC": ""}, {"PkTime": "星期二第十节", "YHKCMC": ""}, {"PkTime": "星期三第十节", "YHKCMC": ""}, {"PkTime": "星期四第十节", "YHKCMC": ""}, {"PkTime": "星期五第十节", "YHKCMC": ""}]
        ], // 已选课程时间列表，星期一第一节
        selectiveList: [], // 可选的课程列表信息
        selectedList: [], // 已选课程列表信息
        openXK: false, // 是否可以选课的开关
        siftPKTimeInfo: null, // 筛选节次信息
        isDealSelectedData: true // 是否处理已选课程的数据
      }
    },
    created () {
      this.getCurrPgData(); // 得到当前页面的已有数据
      this.userInfo = this.QD.getLocalUserinfo().stuObj; // 当前学生用户信息
      if (!this.userInfo) {
        this.$router.go(-1);
        return;
      }
      this.getStuXKInfo(); // 获取选课所有信息-学期、选课开关是否打开、已选课程信息、备选课程信息
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 得到当前页面的已有数据
      getCurrPgData() {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.showLst = qd.showLst;
          this.QD.parentPageData = null;
        }
      },
      // 保存当前页面数据
      saveCurrPgData () {
        this.QD.parentPageData = {pkTimeLst: this.selectedCoursePkTime, totalNodes: this.totalNodes, xqInfo: this.xqInfo, showLst: this.showLst};
      },
      // 设置标题
      setHeadTitle (val) {
        this.QD.setTitle(val); // 设置标题
      },
        /*备选课程和已选课程的标题栏*/
      selectiveCourseTitle (type) {
        this.showLst = type === 0;
      },
      // 查看我的课表信息
      goLookTimetable() {
        this.saveCurrPgData(); // 保存当前页面数据
        this.$router.push('/stuSelectCourseManage/timetable');
      },
      // 设置筛选节次弹框出现
      setSiftPkTime () {
        this.dialogShow.siftPkTime = true;
      },
      // 得到筛选节次的信息
      getSelectPkTimeInfo (obj) {
        console.log('sift pktime =', obj);
        this.siftPKTimeInfo = obj.course;
        this.getClassByTimeCourse(); // 根据选择时间（上课节次）学期课程id获取可选教学班列表列表
      },
      // 取消筛选的方法
      cancelSiftWay () {
        this.siftPKTimeInfo = null;
        this.isDealSelectedData = false;
        this.getStuXKInfo(); // 获取选课所有信息
      },
      // 筛选节次弹框隐藏
      hiddenPanel () {
        this.dialogShow.siftPkTime = false;
      },
      // 显示备选的教学班信息
      showJxbData (idx) {
        this.selectiveList[idx].openExpand = !this.selectiveList[idx].openExpand;
        this.$set(this.selectiveList, idx, this.selectiveList[idx]);
      },
      // 根据选择时间（上课节次）学号获取可选教学班列表
      async getClassByTimeCourse () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/School/WXAPI/SelectCourse/GetSelectiveClassByTimeCourse/'+ this.userInfo.XH + '/' + this.siftPKTimeInfo.PkTime );
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert(`通过节次筛选失败`);
          return;
        }
        console.log("sift course info is =", d);
        this.dealSiftJXBData(d.data);
      },
      // 处理 根据上课节次、学号得到的可选教学班数据
      dealSiftJXBData (data) {
        let iveLst = this.selectiveList; // 全部可选的教学班信息
        this.selectiveList = []; // 初始化
        for (let i=0; i<data.length; i++) {
          let si = data[i];
          for (let m=0; m<iveLst.length; m++) {
            let mi = iveLst[m].CourseInfo; // 课程
            if (si.SCID === mi.SCID) {
              let isHad = false;
              // 判断 selectiveList 中是否存在课程
              for (let k=0; k<this.selectiveList.length; k++) {
                let sk = this.selectiveList[k].CourseInfo;
                if (sk.SCID === si.SCID) {
                  isHad = true;
                  sk.ClassList.push(si);
                  break;
                }
              }
              if (!isHad) { // selectiveList 不存在课程
                let arr = [];
                arr.push(si);
                this.selectiveList.push({CourseInfo: mi, ClassList: arr});
              }
              break;
            }
          }
        }
        console.log('deal sift data=', this.selectiveList);
        this.dealSelectiveData(); // 处理备选课程信息数据
      },
      // 获取选课所有信息-学期、选课开关是否打开、已选课程信息、备选课程信息
      async getStuXKInfo () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/School/WXAPI/SelectCourse/ReadStuXKInfo/'+ this.userInfo.XH);
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.loaded = false;
          this.QD.alert('', '未获取到可选课程信息');
          return;
        }
        console.log("stuXKinfo is =", d);
        this.openXK = d.data.OpenXK;
        this.selectiveList = d.data.SelectiveList;
        this.selectedList = d.data.SelectedList;
        this.xqInfo = d.data.XQInfo; // 学期信息
        this.loaded = false;
        this.selectiveList = this.selectiveList ? this.selectiveList : [];
        this.selectedList = this.selectedList ? this.selectedList: [];
        // 当前存在筛选条件
        if (this.siftPKTimeInfo) {
          this.getClassByTimeCourse(); // 根据选择时间（上课节次）学期课程id获取可选教学班列表列表
        } else {
          this.dealSelectiveData(); // 处理备选课程信息数据
        }
        if (this.isDealSelectedData) { // 是否处理已选课程的数据
          this.isDealSelectedData = true;
          this.setSelectedCoursePkTime(); // selectedCoursePkTime 值初始化
        }
        // 代表第一次进入页面
        if (this.totalNodes === -1 && this.xqInfo) {
          let titleVal = '选课<span style="padding: 0 4px;font-size: 14px;">( '+this.xqInfo.XQMC+' )</span>';
          this.setHeadTitle(titleVal); // 设置标题
          this.getSemesterNodes(); // 根据学期id获取当前学期的节次
        }
      },
      // 处理备选课程信息数据-可选人数、课程是否可选、人满/结束的教学班
      dealSelectiveData () {
        for (let i=0; i<this.selectiveList.length; i++) {
          let si = this.selectiveList[i];
          si.openExpand = true; // 默认备选课程展开教学班的信息
          si.CourseInfo.FullRS = false; // 人数未满
          let fullRSLen = 0; // 课程下的教学班可选人数为0的数目
          // 循环教学班
          for (let m=0; m<si.ClassList.length; m++) {
            let sm = si.ClassList[m];
            sm.KXRS = sm.ZDRS - sm.SJRS; // 可选人数 = 最大人数(ZDRS)-已选人数（SJRS）,最大人数/已选人数-50/51
            if (sm.KXRS <= 0) {
              fullRSLen++;
            }
          }
          // 判断课程下的所有教学班人数是否已满
          if (fullRSLen === si.ClassList.length) {
            si.CourseInfo.FullRS = true; // 人数已满
          }
        }
      },
      // 根据学期id获取当前学期的节次
      async getSemesterNodes () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSemesterNodes', semId: this.xqInfo.XQID});
        this.updateLoadingStatus(false);
        console.log('当前学期的节次 =', d);
        if (d.status && d.status === "error") {
          this.QD.alert('', '未获取到当前学期的节次信息');
          return;
        }
        this.totalNodes = parseInt(d);
      },
      // selectedCoursePkTime 值初始化
      setSelectedCoursePkTime () {
        for (let k=0; k<this.selectedCoursePkTime.length; k++) {
          for (let m=0; m<this.selectedCoursePkTime[k].length; m++) {
            this.selectedCoursePkTime[k][m].YHKCMC = "";
            this.selectedCoursePkTime[k][m].Span = 1;
          }
        }
        this.dealSelectedCourse(); // 处理得到已选课数据
      },
      /*处理得到已选课数据*/
      dealSelectedCourse () {
        console.log("start deal selected jxb");
        for (let i = 0; i < this.selectedList.length; i++){
          let PkTimeArr = this.selectedList[i].PkTime.split('，');
          for (let j = 0; j < PkTimeArr.length; j++) {
            this.selectedPkTime(PkTimeArr[j], this.selectedList[i]);
          }
        }
      },
      /*循环selectedCoursePkTime，找出已选课程和数组中时间相同，课程赋值*/
      selectedPkTime (weekTime, s) {
        for (let i=0; i<this.selectedCoursePkTime.length; i++){
          for (let j=0; j<this.selectedCoursePkTime[i].length; j++){
            if (this.selectedCoursePkTime[i][j].PkTime === weekTime) {
              this.selectedCoursePkTime[i][j].YHKCMC = s.YHKCMC;
              this.selectedCoursePkTime[i][j].KcInfo = s; // 有关课程的信息
              return
            }
          }
        }
      },
      // 退课
      async doDropClass (id) {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/School/WXAPI/SelectCourse/GetDoDropClass/'+ this.userInfo.XH + '/' + id);
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          this.QD.alert('', '退课失败！');
          return;
        }
        console.log("drop info", d);
        let data = d.data;
        if (data === "1") {
          this.QD.alert('', '退课成功！');
          // 退课成功重新加载数据
          this.isDealSelectedData = true;
          this.getStuXKInfo(); // 获取选课所有信息
        } else {
          this.QD.alert('', '退课失败！');
        }
      },
      // 选课
      async doElectClass (id) {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/School/WXAPI/SelectCourse/GetDoElectClass/'+ this.userInfo.XH + '/' + id);
        this.updateLoadingStatus(false);
        console.log("doElect info", d);
        if (d.status && d.status === "error") {
          this.QD.alert('', '选课失败！');
          return;
        }
        let data = d.data;
        if (data === "1") {
          this.QD.alert('', '选课成功！');
        } else {
          this.QD.alert('', '选课失败，失败原因: ' + data + '!');
        }
        // 选课成功/选课失败重新加载数据
        this.isDealSelectedData = true;
        this.getStuXKInfo(); // 获取选课所有信息
      }
    }
  }
</script>
<style>
  .dialog-selectCourse-pkTime .weui-dialog{
    display: block;
    top: 10px;
    bottom: 10px;
    width: 90%;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    background-color: #ffffff;
  }
</style>
<style scoped>
  .stuSelectCourse.stuSelectCourse{
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
  }
  .container{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
  .tab-field{
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 4;
  }
  .tab-field .item{
    font-size: 16px;
  }
  .sift-field{
    position: relative;
    padding-right: 0;
    font-size: 14px;
    color: #26a69a;
  }
  .sift-default{
    display: inline-block;
    width: 100%;
    text-align: right;
  }
  .sift-selected{
    display: inline-block;
    width: 100%;
    padding-bottom: 6px;
    text-align: center;
  }
  .sift-selected-a{
    display: inline-block;
    width: 66%;
    margin-top: 7px;
    padding: 2px 20px;
    background-color: #e0f2f1;
    border: 1px solid #26a69a;
    border-radius: 25px;
  }
  .sift-selected-a .text{
    color: #666666;
    font-size: 14px;
  }
  .sift-selected-a .cancel-text{
    padding-left: 10px;
    font-size: 14px;
    color: #06897d;
    line-height: 14px;
  }
  .sift-box{
    display: inline-block;
    padding-top: 9px;
    padding-right: 15px;
    padding-bottom: 8px;
    padding-left: 15px;
  }
  .sift-field .selectIcon{
    padding-right: 0;
    color: #26a69a;
    font-size: 18px;
    vertical-align: middle;
  }
  .courseIcon{
    display: inline-block;
    height: 18px;
    padding-right: 0;
    color: #26a69a;
    font-size: 20px;
    vertical-align: middle;
  }
  .sift-field .text{
    vertical-align: middle;
  }
  .selected-course-field,
  .selective-course-field{
    position: absolute;
    top: 79px;
    bottom: 0;
    width: 100%;
    background-color: #f5f5f9;
    overflow: scroll;
  }
  .last-lstInfo{
    padding-bottom: 110px;
  }
  .selected-box:before,
  .course-info:before{
       content: " ";
       position: absolute;
       top: 0;
       width: 100%;
       height: 1px;
       border-top: 1px solid #eff1f0;
       -webkit-transform-origin: 0 0;
       transform-origin: 0 0;
       -webkit-transform: scaleY(0.5);
       transform: scaleY(0.5);
       left: 0;
  }
  .selected-box,
  .course-info{
    position: relative;
    padding: 10px 15px;
    color: #000;
    line-height: 1.5;
    background-color: #ffffff;
  }
  .selected-course-field .last-lstInfo{
    padding: 10px 15px 110px 15px;
  }
  .selected-box .lf,
  .course-info .lf{
    position: absolute;
  }
  .selected-box .selected-icon,
  .course-info .ive-icon{
    display: inline-block;
    height: 22px;
    color: #26a69a;
    padding-right: 8px;
    font-size: 14px;
    vertical-align: middle;
    overflow: hidden;
  }
  .selected-box .rg,
  .course-info .rg{
    position: relative;
    padding-left: 26px;
  }
  .course-info .kcmc-box{
    display: inline-block;
    width: 90%;
  }
  .selected-box .jxbmc,
  .course-info .kcmc{
    font-size: 16px;
    color: #000000;
  }
  .arrow-icon{
    position: absolute;
    right: 5px;
    padding-right: 0;
    font-size: 20px;
    color: #C8C8CD;
  }
  .course-type-box{
    position: relative;
    padding-top: 10px;
    font-size: 14px;
    color: #666666;
  }
  .zks-info{
    padding-top: 10px;
    position: relative;
    font-size: 12px;
    color: #06897d;
  }
  .desc-zks{
    margin-right: 68px;
  }
  .jxb-box{
    position: relative;
    background-color: #f5f6f7;
    overflow: hidden;
    max-height: 0;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
  }
  .animate {
    max-height: 9999px;
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-delay: 0s;
  }
  .jxb-info{
    position: relative;
    padding: 10px 15px 10px 41px;
    line-height: 1.5;
    border-top: 1px solid #ffffff;
  }
  .jxb-info>p{
    position: relative;
  }
  .selected-box .jxbmc,
  .jxb-info .jxbmc{
    display: inline-block;
    width: 75%;
    font-size: 16px;
    color: #333333;
  }
  .tea-info-box,
  .desc1-1{
    padding-top: 10px;
  }
  .selected-box .tea-info,
  .desc1-1 .tea-info{
    margin-right: 8px;
    font-size: 14px;
    color: #d68817;
    padding: 2px 14px;
    background-color: #eaeaea;
    border-radius: 20px;
  }
  .kxre-info{
    font-size: 12px;
    color: #666666;
  }
  .kxre-info .num{
    color: #06897d;
  }
  .pk-time-box{
    padding-top: 10px;
    font-size: 14px;
    color: #666666;
  }
  .btn{
    position: absolute;
    top: 5px;
    right: 0;
    width: 50px;
    text-align: center;
    color: #ffffff;
    border-radius: 25px;
    padding: 4px 6px;
    font-size: 14px;
    z-index: 1;
  }
  .sure-btn{
    background-color: #26a69a;
  }
  .full-btn{
    background-color: #969a95;
  }
  .close-btn{
    background-color: #b2b5b1;
  }
  .refund-btn{
    background-color: #eca704;
  }
  /* 不可以选的备选课程 start */
  .close-select-course .ive-icon{
    color: #bdbdbd;
  }
  .close-select-course .kcmc,
  .close-select-course .course-type-box,
  .close-select-course .zks-info
  {
    color: #959595;
  }
  .close-select-course .courseType{
    display: inline-block;
    width: 82%;
  }
  .close-select-course .close-text{
    position: absolute;
    right: 6px;
    font-size: 12px;
    color: #ff5722;
  }
  /* 不可以选的备选课程 end */
  /* 备选课程 样式 start */
  .selected-box .selected-icon{
  }
  /* 备选课程 样式 end */
</style>
