<template>
  <div class="course-exchange-apply eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-if="pkXqInfo" class="container eachPgBase">
      <group class="gp">
        <cell class="baseInfoHead" title="基本信息" :arrow-direction="'down'" :is-link="true"></cell>
        <cell>
          <span slot="after-title">授课学期</span>
          <span>{{pkXqInfo.XQMC}}</span>
        </cell>
        <cell>
          <span slot="after-title">学期起始日期</span>
          <span>{{pkXqInfo.KSRQStr}}</span>
        </cell>
        <cell>
          <span slot="after-title">学期结束日期</span>
          <span>{{pkXqInfo.JSRQStr}}</span>
        </cell>
        <popup-picker title="调课性质" v-model="baseInfo.DKXZ" :data="natureLst" @on-change="changeNatureVal"></popup-picker>
        <x-input v-model="baseInfo.Subject" :title="'标题'" :text-align="'right'" :placeholder="'请填写标题'" ></x-input>
      </group>
      <group class="gp">
        <cell class="gpTitle">
          <p slot="after-title"><span class="school-wx-icon requireIcon">&#xe644;</span>调课事由</p>
        </cell>
        <x-textarea v-model="baseInfo.Reason" :placeholder="'请填写调课事由'" :rows="2"></x-textarea>
      </group>
      <div class="checker-field">
        <divider class="divider-title"><span class="school-wx-icon requireIcon">&#xe644;</span>调课范围</divider>
        <checker v-model="baseInfo.ChangeRange" :default-item-class="'category-item-pad'"
                 :selected-item-class="'category-item-pad-selected'">
          <checker-item :value="s.value" v-for="(s, sIdx) in rangeLst" :key="sIdx">{{s.title}}</checker-item>
        </checker>
      </div>
      <div class="buttonBox" @click="goAddContainPg"><span class="school-wx-icon addIcon">&#xe686;</span>增加调课内容</div>
      <!--调课结果 exResultLst start -->
      <div class="resultField" v-for="(s, idx) in exResultLst" :key="idx">
        <div class="result_title">
          <span>调课内容({{idx+1}})</span>
          <span class="delete_text" @click="deleteExResult(idx)">删除</span>
        </div>
        <x-table class="table">
          <thead>
            <tr>
              <th>名称</th>
              <th>课程</th>
              <th>周次</th>
              <th>星期</th>
              <th>节次</th>
              <th>老师</th>
              <th>教室</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="mcTitle">原课表内容</td>
              <td>{{s.OriKCMC}}</td>
              <td>{{s.OriWeekIndex}}</td>
              <td>{{s.OriWeekDayName.substr(s.OriWeekDayName.length-1, 1)}}</td>
              <td>{{s.OriNodeIndex}}</td>
              <td>{{s.OriEmpName}}</td>
              <td>{{s.OriJSMCs}}</td>
            </tr>
            <!-- 代课 start -->
            <tr v-if="s.ChangeRange === 1">
              <td class="newExInfo" colspan="7">代课老师: {{s.NewEmpName}}</td>
            </tr>
            <!-- 代课 end -->
            <!-- 教室 start -->
            <tr v-if="s.ChangeRange === 2">
              <td class="newExInfo" colspan="7">上课教室: {{s.NewJSMCs}}</td>
            </tr>
            <!-- 教室 end -->
            <!--时间 start -->
            <tr v-if="s.ChangeRange === 3">
              <td class="newExInfo" colspan="7">调时间: {{s.NewPkDate}} 周{{s.NewWeekDayName}}第{{s.NewNodeIndex}}节</td>
            </tr>
            <!--时间 end -->
            <!-- 班内对调 start -->
            <tr v-if="s.ChangeRange === 4">
              <td class="mcTitle">班内对调目标内容</td>
              <td>{{s.NewKCMC}}</td>
              <td>{{s.NewWeekIndex}}</td>
              <td>{{s.NewWeekDayName.substr(s.NewWeekDayName.length-1, 1)}}</td>
              <td>{{s.NewNodeIndex}}</td>
              <td>{{s.NewEmpName}}</td>
              <td>{{s.NewJSMCs}}</td>
            </tr>
            <!-- 班内对调 end -->
          </tbody>
        </x-table>
      </div>
      <!--调课结果 end -->
      <button-two :titleOne="'保存'" :titleTwo="'提交'" :oneButtonClass="'button1'" :twoButtonClass="'button4'" @get-oneVal="saveWay" @get-twoVal="submitWay"></button-two>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import Checker from 'vux/src/components/checker/checker.vue'
  import CheckerItem from 'vux/src/components/checker/checker-item.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import ButtonTwo from '../common/ButtonTwo.vue'
  import XTable from 'vux/src/components/x-table/index.vue'
  export default {
    name: 'courseExBaseApply',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      PopupPicker,
      XInput,
      XTextarea,
      Checker,
      CheckerItem,
      Divider,
      XButton,
      ButtonTwo,
      XTable
    },
    methods: {
      // 增加调课内容
      goAddContainPg () {
        if (this.pkXqInfo.CurWeekIndex > this.pkXqInfo.WeekCount) {
          this.QD.alert('', '授课学期已经结束!');
          return;
        }
        console.log("baseInfo.ChangeRange = ", this.baseInfo.ChangeRange);
        if (!this.baseInfo.ChangeRange) {
          this.QD.alert('', '请选择调课范围!');
          return;
        }
        this.QD.currPageData = {
          baseInfo: this.baseInfo,
          pkXqInfo: this.pkXqInfo,
          exInfoLst: this.exInfoLst,
          exResultLst: this.exResultLst
        }; // 当前页面
        this.$router.push({path: '/courseExchange/courseEXInfoApply'});
      },
      // 调课明细信息对象的数组集合（多节课调课，一节课为一个对象）
      getDetailList () {
        this.detailList = [];
        for (let i=0; i<this.exInfoLst.length; i++) {
          let si = this.exInfoLst[i];
          let schedule = si.eachOriSchedule; // 选中的原课表信息
          let oriXM = si.curTeaInfo.XM ? si.curTeaInfo.XM : this.curTeaInfo.XM;
          // console.log(i, schedule);
          let orig = {
            ClaId: schedule.JXBID, // 要进行调课的教学班ID
            OriXM: oriXM, // 原上课老师姓名
            OriZGH: this.curTeaInfo.ZGH,
            OriPkDay: schedule.PkDay, // 要进行调课的原授课日期
            OriDayOfWeek: schedule.DayIndex, // 要进行调课的原授课日期对应的星期索引（从1开始，周日为7）
            OriWeekIndex: si.weeksVal[0], // 要进行调课的原日期所在的周次
            OriNodeIndex: schedule.NodeIndex, // 要进行调课的原课时（节次）
            OriRoomId: schedule.JSID // 教学班原上课地点（教室）
          };
          if (si.eachBaseInfo.ChangeRange === 1 || si.eachBaseInfo.ChangeRange === 2) {
            Object.assign(orig, {
              NewPkDay: schedule.PkDay, // 调课的目标日期
              NewDayOfWeek: schedule.DayIndex, // 调课目标日期对应的星期索引
              NewWeekIndex: si.weeksVal[0], // 调课的目标周次
              NewNodeIndex: schedule.NodeIndex // 调课的目标课时节次
            });
          }
          if (si.eachBaseInfo.ChangeRange === 1) { // 代课
            orig.NewRoomId = schedule.JSID; // 调课的目标教室id
            orig.NewEmpId = si.otherPgInfo.teaInfo.emid; // 代课的目标任课老师
            this.detailList.push(orig);
          } else if (si.eachBaseInfo.ChangeRange === 2) { // 教室
            orig.NewRoomId = si.otherPgInfo.roomInfo.jsid; // 调课的目标教室id
            this.detailList.push(orig);
          } else if (si.eachBaseInfo.ChangeRange === 3) {
            Object.assign(orig, {
              NewPkDay: si.otherPgInfo.newCourseInfo.pkDate, // 调课的目标日期
              NewDayOfWeek: si.otherPgInfo.newCourseInfo.dayOfWeek, // 调课目标日期对应的星期索引
              NewWeekIndex: si.otherPgInfo.newCourseInfo.weekIndex, // 调课的目标周次
              NewNodeIndex: si.otherPgInfo.newCourseInfo.nodeIndex // 调课的目标课时节次
            });
            this.detailList.push(orig);
          } else if (si.eachBaseInfo.ChangeRange === 4) { // 班内对调
            let newCourse = si.otherPgInfo.newCourseInfo;
            Object.assign(orig, {
              NewPkDay: newCourse.PkDay, // 调课的目标日期
              NewDayOfWeek: newCourse.DayIndex, // 调课目标日期对应的星期索引
              NewWeekIndex: newCourse.newWeeksVal[0], // 调课的目标周次
              NewNodeIndex: newCourse.NodeIndex, // 调课的目标课时节次
              ExChangeJxbid: newCourse.JXBID, // 班内对调时，要互调的目标教学班ID
              ExRoomId: newCourse.JSID, // 班内对调时，要互调的目标教学班原有安排的教室Id
              ExEmpId: si.otherPgInfo.teaInfo.emid // 班内对调时，要互调的目标教学班原有安排的任课老师ID
            });
            this.detailList.push(orig);
          }
        }
        // 两个数组合并
        this.detailList.push.apply(this.detailList, this.pdetailList);
        console.log("detailList", this.detailList);
      },
      // 提交
      submitWay () {
        if (!this.baseInfo.Reason) {
          this.QD.alert("", "请填写调课事由!");
          return;
        }
        if (this.detailList.length <=0) {
          this.QD.alert("", "请填写调课内容!");
          return;
        }
        console.log("save");
        let appId = 0;
        if (this.detailPgInfo) {
          appId = this.detailPgInfo.detail_applyinfo.AppId;
        }
        let cType = '代课';
        this.baseInfo.ChangeRange === 1 ? cType = '代课' : cType = '调课';
        let that = this;
        this.QD.confirm('', '确定提交', async function () {
          let aInfo = {
            AppId: appId,
            DKXZ: that.baseInfo.DKXZ[0],
            ChangeRange: that.baseInfo.ChangeRange,
            Subject: that.baseInfo.Subject,
            Reason: that.baseInfo.Reason,
            Status: 0,
            ChangeType: cType
          }; // 调课基本信息对象
          let objData = {semid: that.pkXqInfo.XQID, applyinfo: aInfo, detaillist: that.detailList};
          console.log("objData", JSON.stringify(objData));
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'SubmitScheduleChangeApplyData',
            objData: JSON.stringify(objData)
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            that.QD.alert('', '提交失败!');
            return;
          }
          d = JSON.parse(d);
          console.log("1 step save", d);
          if (!d.success) {
            that.QD.alert('', d.msg);
            return;
          }
          // d.applyId
          // 以下是 提交
          aInfo.Status = 1; // 审核中
          aInfo.AppId = d.applyId; // applyinfo 里需要传入申请的主键字段（AppId），否则会当成是添加
          that.loading = true;
          let d2 = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'SubmitScheduleChangeApplyData',
            objData: JSON.stringify(objData)
          });
          that.loading = false;
          if (d2.status && d2.status === "error") {
            that.QD.alert('', '提交失败!');
            return;
          }
          d2 = JSON.parse(d2);
          console.log("2 step submit", d2);
          if (!d2.success) {
            that.QD.alert('', d2.msg);
            return;
          }
          that.$router.go(-1); // 返回到列表
        });
      },
      // 保存
      async saveWay () {
        if (!this.baseInfo.Reason) {
          this.QD.alert("", "请填写调课事由!");
          return;
        }
        if (this.detailList.length <=0) {
          this.QD.alert("", "请填写调课内容!");
          return;
        }
        console.log("save");
        let appId = 0;
        if (this.detailPgInfo) {
          appId = this.detailPgInfo.detail_applyinfo.AppId;
        }
        let cType = '代课';
        this.baseInfo.ChangeRange === 1 ? cType = '代课' : cType = '调课';
        let that = this;
        this.QD.confirm('', '确定保存', async function () {
          /* DKXZ: ['因公'],ChangeRange: 1, //  调课范围(1-代课，2-教师，3-时间，4-班内对调)Subject: '', // 填写的申请标题Reason: '' // 调课原因*/
          let aInfo = {AppId: appId, DKXZ: that.baseInfo.DKXZ[0], ChangeRange: that.baseInfo.ChangeRange, Subject: that.baseInfo.Subject, Reason: that.baseInfo.Reason, Status: 0, ChangeType: cType}; // 调课基本信息对象
          let objData = {semid: that.pkXqInfo.XQID, applyinfo: aInfo, detaillist: that.detailList};
          console.log("objData", JSON.stringify(objData));
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'SubmitScheduleChangeApplyData',
            objData: JSON.stringify(objData)
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            that.QD.alert('', '保存失败!');
            return;
          }
          d = JSON.parse(d);
          if (!d.success) {
            that.QD.alert('', d.msg);
            return;
          }
          that.$router.go(-1); // 返回到列表
        });
      },
      // 调课申请的调课性质
      changeNatureVal (val) {},
      // 删除调课结果
      deleteExResult (idx) {
        this.exResultLst.splice(idx, 1); // 调课结果
        if (!this.detailPgInfo) {
          this.exInfoLst.splice(idx, 1); // 调课信息
          this.getDetailList(); // 调课明细信息对象的数组集合
        } else {
          if (this.exInfoLst.length < idx +1) { // 删除的是详情中的
            this.doDeleteNoHaveInDetailPg(); // 详情中的是否有删除，若删除，记录中的数据也对应删除
          } else { // 删除的是新添加的
            this.exInfoLst.splice(idx, 1); // 调课信息
            this.getDetailList(); // 调课明细信息对象的数组集合
          }
        }
      },
      // 得到每次选中的调课内容信息数据
      getExInfo () {
        let doEx = null; // 每次调课内容
        if (this.QD.brotherPageData && this.QD.brotherPageData.otherPgInfo) {
          doEx = this.QD.brotherPageData;
          this.QD.brotherPageData = null; // 清空调课内容
          // 1.重复的调课结果-删除最初的一条记录
          for (let j=0; j<doEx.oriScheduleSelect.length; j++) {
            let sj = doEx.oriScheduleSelect[j];
            for (let m=0; m<this.exInfoLst.length; m++) {
              let sm = this.exInfoLst[m];
              let smOriS = sm.eachOriSchedule;
              if (sj.NodeIndex === smOriS.NodeIndex && doEx.weeksVal[0] === sm.weeksVal[0] && sj.DayIndex === smOriS.DayIndex) { // 周次、星期、节次
                this.exInfoLst.splice(m, 1); // 删除最初的一条记录
                break;
              }
            }
            this.exInfoLst.push({eachOriSchedule: sj, eachBaseInfo: doEx.eachBaseInfo, otherPgInfo: doEx.otherPgInfo, weeksVal: doEx.weeksVal, curTeaInfo: doEx.curTeaInfo});
          }
          console.log("no repeat exInfoLst", this.exInfoLst);
        }
        this.getExResultData(); // 调课结果
      },
      // 调课结果
      getExResultData () {
        // 调课结果的整理
        this.exResultLst = [];
        for (let i=0; i<this.exInfoLst.length; i++) {
          let si = this.exInfoLst[i];
          let siOriS = si.eachOriSchedule;
          let newKCMC; // 目标课表课程
          let newWeekIndex; // 目标课表周次
          let newWeekName; // 目标表星期
          let newNodeIndex; // 目标课表节次
          let newEmpName; // 目标课表教师
          let newJSMCs; // 目标课表的教室
          let newPkDate; // 班内对调时间
          if (si.eachBaseInfo.ChangeRange === 1 || si.eachBaseInfo.ChangeRange === 2) { // 代课、教室
            newKCMC = siOriS.KCMC;
            newWeekIndex = si.weeksVal[0];
            newWeekName = siOriS.WeekName;
            newNodeIndex = siOriS.NodeIndex;
            if (si.eachBaseInfo.ChangeRange === 1) {
              newEmpName = si.otherPgInfo.teaInfo.xm;
              newJSMCs = siOriS.JSMCs;
            } else { // 教室
              newJSMCs = si.otherPgInfo.roomInfo.jsmc;
            }
          }
          if (si.eachBaseInfo.ChangeRange === 3) { // 调时间
            newWeekName = si.otherPgInfo.newCourseInfo.weekDayName;
            newWeekIndex = si.otherPgInfo.newCourseInfo.weekIndex;
            newNodeIndex = si.otherPgInfo.newCourseInfo.nodeIndex;
            newPkDate = si.otherPgInfo.newCourseInfo.pkDate;
          }
          if (si.eachBaseInfo.ChangeRange === 4) { // 班内对调
            let newCourse = si.otherPgInfo.newCourseInfo;
            newKCMC = newCourse.KCMC;
            newWeekIndex = newCourse.newWeeksVal[0]; // 调课的目标周次
            newWeekName = newCourse.WeekName;
            newNodeIndex = newCourse.NodeIndex;
            newEmpName = si.otherPgInfo.teaInfo.xm;
            newJSMCs = newCourse.JSMCs;
          }
          this.exResultLst.push({
            ChangeRange: si.eachBaseInfo.ChangeRange, // 调课范围
            OriKCMC: siOriS.KCMC, // 原课表课程
            OriWeekIndex: si.weeksVal[0], // 原课表周次
            OriWeekDayName: siOriS.WeekName, // 原课表星期
            OriDayOfWeek: siOriS.DayIndex, // 原课表星期 如 1， 2
            OriNodeIndex: siOriS.NodeIndex, // 原课表节次
            OriEmpName: siOriS.Teachers, // 原课表教师
            OriJSMCs: siOriS.JSMCs, // 原课表的教室
            NewKCMC: newKCMC, // 目标课表课程
            NewWeekIndex: newWeekIndex, // 目标课表周次
            NewWeekDayName: newWeekName, // 目标表星期
            NewNodeIndex: newNodeIndex, // 目标课表节次
            NewEmpName: newEmpName, // 目标课表教师
            NewJSMCs: newJSMCs, // 目标课表的教室
            NewPkDate: newPkDate
          });
        }
        console.log("exResultLst = ", this.exResultLst);
        this.doDeleteConflictInDetailPg(); // 排查。调课内容与详情中历史的调课内容是否有冲突，若有冲突，删除原来的历史调课内容
      },
      // 排查。调课内容与详情中历史的调课内容是否有冲突，若有冲突，删除原来的历史调课内容
      doDeleteConflictInDetailPg () {
        if (this.detailPgInfo) {
          this.pexResultLst = this.detailPgInfo.detail_exResultLst;
          this.pdetailList = this.detailPgInfo.detail_detailList;
          for (let i=0; i<this.pexResultLst.length; i++) {
            let psi = this.pexResultLst[i];
            for (let k=0; k<this.exResultLst.length; k++) {
              let sk = this.exResultLst[k];
              // 周次、星期、节次相同代表有冲突
              if (psi.OriWeekIndex === parseInt(sk.OriWeekIndex) && psi.OriDayOfWeek === sk.OriDayOfWeek && psi.OriNodeIndex === sk.OriNodeIndex) {
                this.pexResultLst.splice(i, 1);
                this.pdetailList.splice(i, 1);
                i--;
                break;
              }
            }
          }
          // 两个数组合并
          this.exResultLst.push.apply(this.exResultLst, this.pexResultLst);
          this.QD.currPgToOtherPg = {detail_exResultLst: this.pexResultLst, detail_detailList: this.pdetailList, detail_applyinfo: this.detailPgInfo.detail_applyinfo}; // 重新记录
        }
        this.getDetailList(); // 调课明细信息对象的数组集合
      },
      // 详情中的是否有删除，若删除，记录中的数据也对应删除
      doDeleteNoHaveInDetailPg () {
        for (let i=0; i<this.pexResultLst.length; i++) {
          let psi = this.pexResultLst[i];
          let haveData = false; // 默认不存在数据
          for (let k=0; k<this.exResultLst.length; k++) {
            let sk = this.exResultLst[k];
            // 周次、星期、节次相同，代表存在
            if (psi.OriWeekIndex === parseInt(sk.OriWeekIndex) && psi.OriDayOfWeek === sk.OriDayOfWeek && psi.OriNodeIndex === sk.OriNodeIndex) {
              haveData = true; // 存在
              break;
            }
          }
          if (!haveData) { // 不存在
            this.pexResultLst.splice(i, 1);
            this.pdetailList.splice(i, 1);
            i--;
          }
        }
        this.QD.currPgToOtherPg = {detail_exResultLst: this.pexResultLst, detail_detailList: this.pdetailList, detail_applyinfo: this.detailPgInfo.detail_applyinfo}; // 重新记录
        this.getDetailList(); // 调课明细信息对象的数组集合
      },
      // 得到排课学期信息
      async getPkSemesterInfo () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetPkSemesterInfo'
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取学期信息数据失败:${d.msg}`);
          return;
        }
        this.pkXqInfo = JSON.parse(d);
        // this.pkXqInfo.CurWeekIndex = 6; // ---------这是测试用的周次
        console.log("pkSemester info", this.pkXqInfo, this.pkXqInfo.CurWeekIndex);
      },
      // 得到当前页面的数据
      getCurrPageData () {
        if (this.QD.currPageData && this.QD.currPageData.baseInfo) {
          let qd = this.QD.currPageData;
          this.baseInfo = qd.baseInfo; // 基本内容信息
          this.pkXqInfo = qd.pkXqInfo; // 学期信息
          this.exInfoLst = qd.exInfoLst; // 调课集合信息
          this.exResultLst = qd.exResultLst; // 调课内容
          this.QD.currPageData = null;
        } else {
          this.getPkSemesterInfo(); // 得到排课学期信息
        }
        this.getExInfo(); // 得到每次选中的调课内容信息数据
      },
      // 从详情页面传过来的信息
      getDetailPgInfo () {
        if (parseInt(this.$route.query.revise) === 1) { // 从详情页面来
          if (this.QD.currPgToOtherPg && this.QD.currPgToOtherPg.detail_exResultLst) {
            this.detailPgInfo = this.QD.currPgToOtherPg;
            let binfo = this.detailPgInfo.detail_applyinfo;
            this.baseInfo.DKXZ[0] = binfo.DKXZ;
            this.baseInfo.ChangeRange = binfo.ChangeRange;
            this.baseInfo.Subject = binfo.Subject;
            this.baseInfo.Reason = binfo.Reason;
            this.getCurrPageData(); // 得到当前页面的数据
          } else {
            this.$router.go(-1);
          }
        } else {
          this.getCurrPageData(); // 得到当前页面的数据
        }
      }
    },
    created () {
      this.curTeaInfo = this.QD.getLocalUserinfo().stuObj; // 当前教师用户信息
      this.getDetailPgInfo();  // 从详情页面传过来的信息
    },
    data () {
      return {
        loading: false,
        curTeaInfo: null,
        pkXqInfo: null, // 排课学期信息
        natureLst: [['因公', '因私']],
        rangeLst: [{title: '代课', value: 1}, {title: '教室', value: 2}, {title: '时间', value: 3}, {title: '班内对调', value: 4}], // 调课范围
        baseInfo: {
          DKXZ: ['因公'],
          ChangeRange: 1, //  调课范围(1-代课，2-教师，3-时间，4-班内对调)
          Subject: '', // 填写的申请标题
          Reason: '' // 调课原因
        }, // 填写的基本信息
        exInfoLst: [], // 调课信息- 每次选择的调课信息的集合
        exResultLst: [], // 调课结果
        detailList: [], // 调课明细信息对象的数组集合（多节课调课，一节课为一个对象）
        detailPgInfo: null, // 详细页面中的信息，详细中需要修改的信息
        pexResultLst: [], // 详细页面中的信息-渲染在页面的调课结果数据
        pdetailList: [] // 详细页面中的信息-需要提交的调课结果数据
      }
    }
  }
</script>
<style scoped>
  .container{
    position: relative;
    margin-bottom: 48px;
    padding-bottom: 20px;
  }
  .gp{
    margin-top: -1.25em;
  }
  .baseInfoHead{
    padding: 4px 15px;
    font-size: 14px;
    color: #999;
    background-color: #f5f5f9;
  }
  .gpTitle{
    padding: 4px 15px;
    font-size: 14px;
    color: #666;
    background-color: #f5f5f9;
  }
  .buttonBox{
    position: relative;
    margin-top: 10px;
    text-align: center;
    padding: 10px 15px;
    color: #0f89e0;
    font-size: 16px;
    vertical-align: middle;
    background-color: #ffffff;
  }
  .buttonBox>.addIcon{
    font-size: 18px;
    color: #0f89e0;
    vertical-align: middle;
  }
  .buttonBox:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  /* 调课结果 start */
  .resultField{
    font-size: 14px;
    color: #666666;
  }
  .resultField>.table{
    background-color: #ffffff;
  }
  .mcTitle{
    color: #333333;
  }
  .newExInfo{
    color: #333;
  }
  .resultField>.table>thead>tr>th{
    width: 14.28%;
    color: #333333;
  }
  .result_title{
    margin-top: 0.77em;
    margin-bottom: 0.3em;
    padding-left: 15px;
    padding-right: 15px;
    color: #999999;
    font-size: 13px;
  }
  .result_title > .delete_text{
    position: absolute;
    display: inline-block;
    right: 4px;
    color: #0f89e0;
    padding: 0 16px;
  }
</style>
