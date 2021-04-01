<template>
  <div class="eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-if="info" class="apply-field">
      <group class="gp">
        <cell>
          <span slot="after-title" class="titleName">申请人姓名</span>
          <span>{{info.xM}}</span>
        </cell>
        <cell>
          <span slot="after-title" class="titleName">申请人工号</span>
          <span>{{info.zGH}}</span>
        </cell>
      </group>
      <group>
        <cell :is-link="true" @click.native="goSelectTea">
          <span slot="after-title" class="titleValWid">顶班人</span>
          <span v-if="nameLstSub">{{nameLstSub}}</span>
          <span v-if="!nameLstSub">选择</span>
        </cell>
      </group>
      <group>
        <datetime :placeholder="'选择'" :end-date="'2166-12-10'" v-model="info.kSRQ" format="YYYY-MM-DD" @on-confirm="startDateChange">
          <span slot="title" class="titleName"><a class="school-wx-icon requireIcon">&#xe644;</a>顶班开始日期</span>
        </datetime>
      </group>
      <div class="checker-field">
        <checker
          style="padding-bottom: 15px;"
          v-model="startTimeRageIdx"
          :radio-required="true"
          @on-change="getStartTimeRage"
          :default-item-class="'category-item'"
          :selected-item-class="'category-item-selected'">
          <span class="cate-title">顶班开始日期范围</span>
          <checker-item v-for="(item, idx) in timeRageLst" :key="idx" :value="idx">{{item.value}}</checker-item>
        </checker>
      </div>
      <group class="gp">
        <datetime :end-date="'2166-12-10'" :placeholder="'选择'" v-model="info.jSRQ" format="YYYY-MM-DD" @on-confirm="endDateChange">
          <span slot="title" class="titleName"><a class="school-wx-icon requireIcon">&#xe644;</a>顶班结束日期</span>
        </datetime>
      </group>
      <div class="checker-field">
        <checker
          style="padding-bottom: 15px;"
          v-model="endTimeRageIdx"
          :radio-required="true"
          @on-change="getEndTimeRage"
          :default-item-class="'category-item'"
          :selected-item-class="'category-item-selected'">
          <span class="cate-title">顶班结束日期范围</span>
          <checker-item v-for="(item, idx) in timeRageLst" :key="idx" :value="idx">{{item.value}}</checker-item>
        </checker>
      </div>
      <group class="gp">
        <span style="display: inline-block;padding: 10px 15px;">共请假<a style="color: #008000;padding: 0 2px;">{{info.days}}</a>天</span>
      </group>
      <group>
        <span class="title-name-cell"><a class="school-wx-icon requireIcon">&#xe644;</a>顶班事由</span>
        <x-textarea placeholder="事由" :rows="2" autosize v-model="info.reasons"></x-textarea>
      </group>
      <group>
        <span class="title-name-cell">备注</span>
        <x-textarea placeholder="备注" :rows="2" v-model="info.remark" autosize></x-textarea>
      </group>
      <group>
        <cell>
          <span slot="after-title"  class="titleName">申请日期</span>
          <span>{{info.applyDate.substr(0, 10)}}</span>
        </cell>
      </group>
    </div>
    <x-buttonone v-if="info && info.dBID ===0" :titleVal="'创建'" @click-button="createApply"></x-buttonone>
    <x-buttonone :titleVal="'创建'" @click-button="createApply"></x-buttonone>
    <template v-if="info && info.dBID > 0">
      <button-two :titleOne="'保存'" :titleTwo="'取消'" @get-oneVal="saveJson" @get-twoVal="cancelWay" :oneButtonClass="'button1'"></button-two>
    </template>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Checker from 'vux/src/components/checker/checker.vue'
  import CheckerItem from 'vux/src/components/checker/checker-item.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import XButtonone from '../common/XButtonOne.vue'
  import ButtonTwo from '../common/ButtonTwo.vue'
  export default {
    name: 'bzrManage-BzrShiftsApply',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      Datetime,
      Checker,
      CheckerItem,
      XTextarea,
      XButtonone,
      ButtonTwo
    },
    methods: {
      // go 选择教师页面
      goSelectTea () {
        this.saveOtherData(); // 保存学生数据
        this.$router.push({path: '/commonSelect/selectMultiBzr'});
      },
      // 取消保存
      cancelWay () {
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 保存
      saveJson () {
        if (!this.verifyInfo()) {
          return false;
        }
        this.saveAndCreateInter('保存');
      },
        // 创建申请
      createApply () {
        if (!this.verifyInfo()) {
          return false;
        }
        this.saveAndCreateInter('创建');
      },
      saveAndCreateInter (type) {
        let that = this;
        console.log('info', this.info);
        this.QD.confirm('', '确定' + type, async function(){
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'ClassWorkInsteadApply',
            jsonData: JSON.stringify(that.info)
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            that.QD.alert(type + `失败`);
            return;
          }
          that.$router.push({path: '/bzrManage/bzrShiftsWorkDetail', query: {id: d.DBID, type: 1}});
        })
      },
      // 验证填写的信息
      verifyInfo () {
        if (!this.info.kSRQ && this.info.kSRQ === '选择') {
          this.QD.alert('', '请选择顶班开始日期');
          return false;
        }
        if (!this.info.jSRQ && this.info.jSRQ === '选择') {
          this.QD.alert('', '请选择顶班结束日期');
          return false;
        }
        if (this.info.kSRQ !== '选择' && this.info.kSRQ === this.info.jSRQ && this.info.jSRQFW === '上午' && this.info.kSRQFW === '下午') {
          this.QD.alert('', '在顶班日期相同下，顶班开始日期范围不能大于顶班结束日期范围!');
          return false;
        }
        if (!this.info.reasons) {
          this.QD.alert('', '请填写顶班事由');
          return false;
        }
        return true;
      },
      // 开始时间
      startDateChange (value) {
        this.countTimeGap(1);
      },
      // 开始时间
      endDateChange (value) {
        this.countTimeGap(2);
      },
      // 比较两个日期的大小和共请假多少天
      countTimeGap(type) {
        if (this.info.kSRQ !== '选择' && this.info.jSRQ !== '选择'){
          let startDate = this.info.kSRQ.replace(/-/g, '/');
          let endDate = this.info.jSRQ.replace(/-/g, '/');
          let begin = new Date(startDate);
          let end = new Date(endDate);
          if (begin - end > 0) {
            if (type === 1) {
              this.dateDays = 0;
              this.allDays();
              this.info.kSRQ = '选择';
              this.QD.alert('', '顶班开始日期不能大于顶班结束日期!');
            } else {
              this.dateDays = 0;
              this.allDays();
              this.info.jSRQ = '选择';
              this.QD.alert('', '顶班结束日期不能小于顶班开始日期!');
            }
          } else {
            // 计算共请假多少天
            this.dateDays = (end-begin) / (1000*60*60*24);
            if (!this.verifyRageDays()) {
              return;
            }
            this.allDays();
          }
        }
      },
        // 得到时间范围
      getStartTimeRage (value) {
        this.info.kSRQFW = this.startTimeRageIdx === 0 ? '上午' : '下午';
        this.mounRageDays();
      },
      // 得到顶班结束日期的范围
      getEndTimeRage (value) {
        this.info.jSRQFW = this.endTimeRageIdx === 0 ? '上午' : '下午';
        this.mounRageDays();
      },
      verifyRageDays () {
        // 同一天时间内，开始日期选择了下午，结束日期不能选择上午
        if (this.info.kSRQ !== '选择' && this.info.kSRQ === this.info.jSRQ && this.info.jSRQFW === '上午' && this.info.kSRQFW === '下午') {
          this.QD.alert('', '在顶班日期相同下，顶班开始日期范围不能大于顶班结束日期范围!');
          this.rageDays = 0;
          this.allDays();
          return false;
        }
        return true;
      },
      // 计算范围差
      mounRageDays () {
        if (!this.verifyRageDays()) {
          return;
        }
        if (this.info.kSRQFW === this.info.jSRQFW) {
          this.rageDays = 0.5;
          this.allDays();
        } else {
          this.rageDays = 1;
          this.allDays();
        }
      },
      // 计算共多少天
      allDays () {
        this.info.days = this.dateDays + this.rageDays;
      },
      // 详情
      async getDetail () {
        // 当前页面数据
        if (this.QD.currPageData) {
          let r = this.QD.currPageData;
          this.info = r.info;
          this.startTimeRageIdx = r.startTimeRageIdx;
          this.endTimeRageIdx = r.endTimeRageIdx;
          this.QD.currPageData = null;
        } else if (parseInt(this.$route.query.id) !== 0 ){
          this.loading = true;
          let d = await this.QD.getData('/ComApi/PostObject', {
            apiName: 'ClassWorkInsteadDetailData',
            applyId: parseInt(this.$route.query.id)
          });
          this.loading = false;
          if (d.status && d.status === "error") {
            this.QD.alert(`获取详情失败`);
            return;
          }
          this.info = d.Data;
          this.startTimeRageIdx = this.info.kSRQFW === '上午' ? 0 : 1;
          this.endTimeRageIdx =this.info.jSRQFW === '上午' ? 0 : 1;
        } else {
          this.currUserData(); // 获取当前用户的信息
          this.getCurrDate(); // 获取当前的日期，申请日期
          return;
        }
        this.getSaveBrzData(); // 获取保存班主任的数据
        if (this.info.dBID>0) {
          this.countTimeGap(2); // 计算日期相差的天数
          this.mounRageDays(); // 计算日期范围相差的天数
        }
      },
      // 保存之前选中的学生数据
      saveOtherData () {
        this.QD.otherPageData = {nameLst: this.nameLst, zghLst: this.zghLst, emId: this.emIdLst};// 保存顶班人数据-方便将已有数据渲染在选择班主任页面上
        this.QD.currPageData = {info: this.info, startTimeRageIdx: this.startTimeRageIdx, endTimeRageIdx: this.endTimeRageIdx};
      },
      getSaveBrzData () {
          // 将选中的教师保存起来
        if (this.QD.otherPageData) {
          let s = this.QD.otherPageData;
          this.nameLst = s.nameLst;
          this.zghLst = s.zghLst;
          this.emIdLst = s.emId;
          this.nameLstSub = s.nameLst.join(',');
          this.QD.otherPageData = null;
          if (this.nameLst.length !== 0) {
            let mlst = [];
            for (let i in this.nameLst) {
              mlst.push({
                empId: this.emIdLst[i],
                zgh: this.zghLst[i],
                xm: this.nameLst[i]
              })
            }
            this.info.MemberList = mlst;
          } else {
            this.info.MemberList = '';
          }
        } else if (this.info.dBID > 0 && this.info.MemberList) {
          for (let i in this.info.MemberList) {
            let n = this.info.MemberList[i];
            this.nameLst.push(n.xm);
            this.zghLst.push(n.zgh);
            this.emIdLst.push(n.empId);
          }
          this.nameLstSub = this.nameLst.join(',');
        }
      },
      // 当前时间
      getCurrDate () {
        let currDate = this.QD.getDateOrTime('time');
        let dt = currDate.substr(0, 10);
        this.info.applyDate = currDate;
        this.info.kSRQ = dt;
        this.info.jSRQ = dt;
      },
      // 得到当前用户的信息
      currUserData () {
        let userInfo =this.QD.getLocalUserinfo().stuObj;
        this.info.xM = userInfo.XM;
        this.info.zGH = userInfo.ZGH;
      }
    },
    created () {
      this.getDetail(); // 详情
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        nameLstSub: '', // 顶班教师姓名string
        nameLst: [], // 顶班教师姓名信息
        zghLst: [], // 顶班教师姓名信息
        emIdLst: [], // 顶班教师的职工号id
        startTimeRageIdx: 0, // 默认选中的顶班开始时间范围是上午
        endTimeRageIdx: 1, // 默认选中的顶班结束时间范围是下午
        rageDays: 1, // 默认是1天
        dateDays: 0, // 日期默认是 0 天
        timeRageLst: [{
          value: '上午',
          key: 1
        }, {
          value: '下午',
          key: 2
        }],
        applyDate: '', // 申请日期，只渲染在页面上
        info: {
          dBID: 0,
          states: 0,
          applyDate: '',
          xM: '', // 申请人姓名
          zGH: '',
          kSRQ: '', // 开始日期
          jSRQ: '', // 结束日期
          kSRQFW: '上午',
          jSRQFW: '下午',
          days: 1, // 顶班天数
          reasons: '', // 顶班事由
          remark: '', // 备注
          MemberList: '' // 顶班老师JSON集合
        }
      }
    }
  }
</script>
<style scoped>
  .apply-field{
    padding-bottom: 70px;
    background-color: #f5f5f9;
  }
  .gp{
    margin-top: -20px;
  }
  .checker-field{
    background-color: #fff;
  }
  .cate-title{
    display: inline-block;
    font-size: 14px;
    color: #000;
    padding: 0 15px;
  }
  .title-name-cell{
    display: inline-block;
    font-size: 16px;
    padding: 10px 15px;
  }
  .titleValWid{
    display: inline-block;
    width: 70px;
  }
  .category-item{
    width: 50px;
  }
</style>
