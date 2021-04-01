<template>
  <div class="stuKaoQinEdit">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="group-top">
      <!--<cell title="时间">{{currTime}}</cell>-->
      <datetime title="时间" v-model="currDT" format="YYYY-MM-DD" @on-change="changeLeaveDate"></datetime>
      <cell title="学生" @click.native="selectStu" :is-link="true">
        <span v-if="stuLst">{{stuLst.XM}}</span>
        <span v-else>请选择</span>
      </cell>
      <popup-picker title="考勤类型" v-model="attendStateVal" :data="attendStateLst" @on-change="changeAttendVal"></popup-picker>
      <template v-if="stuLst">
        <popup-picker v-if="courseLst[0].length > 0" title="课程" v-model="courseVal" :data="courseLst"></popup-picker>
        <cell v-if="courseLst[0].length === 0" title="课程">今日无课程</cell>
      </template>
      <cell v-if="!stuLst" title="课程">请先选择学生</cell>
      <x-textarea placeholder="备注原因" :show-counter="false" :rows="1" autosize v-model="leaveReason"></x-textarea>
    </group>
    <submit-button :title="submitTitle" @click-button="saveData"></submit-button>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import SubmitButton from '../../components/common/SubmitButton.vue'
  export default {
    name: "stuKaoQinEdit",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      PopupPicker,
      Datetime,
      XTextarea,
      SubmitButton
    },
    methods: {
        // 改变考勤类型
      changeAttendVal (val) {
        if (val[0] === '迟到') {
          this.attendType = 2;
        }
        if (val[0] === '早退') {
          this.attendType = 4;
        }
        if (val[0] === '旷课') {
          this.attendType = 8;
        }
        if (val[0] === '事假') {
          this.attendType = 16;
        }
        if (val[0] === '病假') {
          this.attendType = 32;
        }
      },
      // 改变请假日期
      changeLeaveDate (value) {
        if (this.stuLst) {
          this.getStuSmstClassData(); //  根据学号和日期获取学生当天的所有课程信息
        }
      },
      // 选择学生
      selectStu () {
        this.QD.currPageData = {currDT: this.currDT, stateVal: this.attendStateVal, attendType: this.attendType, courseVal: this.courseVal, leaveReason: this.leaveReason};// 保存当前页面的数据
        this.$router.push({ path: '/stuLeaveApply/selectBZRStudent' });
      },
        // 提交学生考勤数据
      saveData () {
        if (!this.stuLst) {
          this.QD.alert('', '请选择学生！');
          return;
        }
        if (this.courseVal[0].length === 0) {
          this.QD.alert('', '请选择课程！');
          return;
        }
        let node = this.courseVal[0].substr(1, 1);
        let claId = null;
        for (let i in this.classData) {
          if (this.classData[i].NodeIndex === node) {
            claId = this.classData[i].ClaId;
            break;
          }
        }
        this.listCategory = [];
        this.listCategory.push({
          Category: this.attendType,
          StuNum: 1,
          StuRemark: this.stuLst.XH
        });
        console.log(node, claId, this.attendType);
        let that = this;
        this.QD.confirm("", "确定提交", async function (m) {
          let d = await that.QD.getData('/ComApi/PostObject', {apiName: 'InsertStuentAttendanceData',
            JXBID: claId,
            Nodes: node,
            TeachDay: that.currDT,
            ResultList: JSON.stringify(that.listCategory)
          });
          if (d.status && d.status === "error") {
            that.QD.alert(`获取数据失败:${d.msg}`);
          }
          if (d !== null) {
            if (parseInt(d) <= 0) {
              if (d === -1) {
                that.QD.alert('', '无法获取当前教师的信息！');
              } else if (d === -2) {
                that.QD.alert('', '无法获取当前登记教师的信息！');
              } else if (d === -3) {
                that.QD.alert('', '无法获取教学班信息！');
              } else if (d === 0) {
                that.QD.alert('', '当前考勤记录已添加，无法再次进行添加！');
              } else {
                that.QD.alert('', '学生考勤保存失败！');
              }
            } else if (parseInt(d) > 0) {
              that.QD.alert('', '学生考勤保存成功！');
              that.$router.go(-1);
            } else {
              that.QD.alert('', '学生考勤保存失败！');
            }
          }
        })
      },
        // 获取当前的时间
      getCurrPgData () {
        if (this.QD.currPageData) { // 当前页面的数据
          this.currDT = this.QD.currPageData.currDT; // 时间 yyyy-mm-dd
          this.attendStateVal = this.QD.currPageData.stateVal;
          this.attendType = this.QD.currPageData.attendType;
          this.courseVal = this.QD.currPageData.courseVal;
          this.leaveReason = this.QD.currPageData.leaveReason;
          this.QD.currPageData = null;
        } else {
          this.currTime = this.QD.getDateOrTime('time'); // 当前时间
          this.currDT = this.currTime.substr(0, 10); // 当前日期 yyyy-mm-dd
        }
        this.getPageData();
      },
      // 得到页面的原有数据
      getPageData () {
        console.log("otherPage stuData", this.QD.otherPageData);
        if (this.QD.otherPageData) { // 其他页面的数据
          this.stuLst = this.QD.otherPageData;
          this.QD.otherPageData = null;
        }
        if (this.stuLst) {
          this.getStuSmstClassData();
        }
      },
      // 根据学号和日期获取学生当天的所有课程信息
      async getStuSmstClassData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuSmstClassData', xh: this.stuLst.XH, date: this.currDT});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        if (d.length > 0) {
          this.classData = d;
          let ls = [];
          for (let i in d) {
            ls.push('第' + d[i].NodeIndex + '节 ' + d[i].KCMC);
          }
          this.courseLst[0] = ls;
          this.courseVal[0] = ls[0]; // 默认选中第一个列表中的第一个课程
        } else {
          this.courseLst = [[]];
        }
        console.log('classData', this.classData);
      }
    },
    created () {
      this.getCurrPgData();
    },
    data () {
      return {
        loading: false,
        submitTitle: '提交',
        leaveReason: '', // 备注原因
        currTime: '',
        currDT: '', // 当前日期
        stuLst: null, // 学生数据
        attendStateVal: ['迟到'], // 出勤类型-- 编辑
        attendStateLst: [['迟到', '早退', '旷课', '事假', '病假']], //考勤类型
        attendType: 2, // 迟到 = 2
        classData: null, // 学生的课表今日课表信息
        courseVal: [], // 选择的课程
        courseLst: [[]], // 课程列表
        listCategory: [] // Category(Int)考勤类型迟到=2,早退=4,旷课=8,事假=16,病假=32S,tuNum(Int)考勤异常的学生数StuRemark,异常学生学号集合如：学号1,学号2, 学号3,此学生数与Category一一对应
      }
    }
  }
</script>
<style scoped>

</style>

