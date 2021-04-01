<template>
  <div class="eachPgBase courseExDetail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <toast-info v-if="showHintMsg" :text="hintMsg"></toast-info>
    <div v-if="dInfo" class="eachPgBase container">
      <div style="position: relative;">
        <span class="school-wx-icon verifyIcon nosubmit-icon" v-if="dInfo.Status === 0">&#xe6b2;</span>
        <span class="school-wx-icon verifyIcon verifying-icon" v-if="dInfo.Status === 1">&#xe836;</span>
        <span class="school-wx-icon verifyIcon pass-icon" v-if="dInfo.Status === 2">&#xe651;</span>
        <span class="school-wx-icon verifyIcon lost-icon" v-if="dInfo.Status === 4" >&#xe68a;</span>
      </div>
      <div style="padding-bottom: 60px;">
        <group class="gp">
          <cell class="baseInfoHead" title="基本信息" :arrow-direction="'down'" :is-link="true"></cell>
          <div class="baseInfoBox">
            <p>
              <span class="title">授课学期</span>
              <span class="value">{{dInfo.XQMC}}</span>
            </p>
            <p>
              <span class="title">调课性质</span>
              <span class="value">{{dInfo.DKXZ}}</span>
            </p>
            <p>
              <span class="title">调课类别</span>
              <span class="value">{{dInfo.ChangeType}}</span>
            </p>
            <p>
              <span class="title">标题</span>
              <span class="value">{{dInfo.Subject}}</span>
            </p>
            <p>
              <span class="title">调课事由</span>
              <span class="value">{{dInfo.Reason}}</span>
            </p>
          </div>
        </group>
        <!--调课结果 exResultLst start -->
        <div class="resultField" v-for="(s, idx) in exResultLst" :key="idx">
          <div class="result_title">
            <span>调课内容({{idx+1}})</span>
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
            <tr>
              <td colspan="7" class="exClassName">班级：{{s.BJMCs}}</td>
            </tr>
            </tbody>
          </x-table>
        </div>
        <!--调课结果 end -->
        <!--审批结果 -->
        <audit-lst v-if="dInfo.AuditResultList.length > 0 && (dInfo.Status === 1 || dInfo.Status === 2 || dInfo.Status === 4)" :auditResults="dInfo.AuditResultList"></audit-lst>
      </div>
      <button-two v-if="dInfo.Status === 0" :titleOne="'修改'" :titleTwo="'提交'" :oneButtonClass="'button2'" :twoButtonClass="'button4'" @get-oneVal="reviseWay" @get-twoVal="submitWay"></button-two>
      <button-two v-if="uStates === 1" :titleOne="'拒绝'" :titleTwo="'通过'"
                  @get-oneVal="refuseWay" @get-twoVal="passWay" :oneButtonClass="'button6'" :twoButtonClass="'button5'"></button-two>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Group from "vux/src/components/group/index.vue"
  import Cell from "vux/src/components/cell/index.vue"
  import XTable from 'vux/src/components/x-table/index.vue'
  import ButtonTwo from '../common/ButtonTwo.vue'
  import AuditLst from '../common/AuditLst.vue'
  import ToastInfo from '../common/ToastInfo.vue'
  export default {
    name: 'courseEXDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      XTable,
      ButtonTwo,
      AuditLst,
      ToastInfo
    },
    methods: {
      // 修改
      reviseWay () {
        this.QD.currPgToOtherPg = {detail_exResultLst: this.exResultLst, detail_detailList: this.detailList, detail_applyinfo: this.applyinfo};
        this.$router.push({path: '/courseExchange/courseExBaseApply', query: {revise: 1}});
      },
      // 提交
      submitWay () {
        let that = this;
        this.QD.confirm('', '确定提交', async function () {
          let objData = {semid: that.dInfo.SemId, applyinfo: that.applyinfo, detaillist: that.detailList};
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
          console.log("submit", d2);
          if (!d2.success) {
            that.QD.alert('', d2.msg);
            return;
          }
          that.dInfo.Status = 1;
        });
      },
      // 拒绝
      refuseWay () {
        this.verifyWay(4);
      },
      // 通过
      passWay () {
        this.verifyWay(2);
      },
      // 审批方法
      verifyWay (states) {
        let that = this;
        this.QD.confirm("提示: 请输入审批说明", "", async function (m) {
          console.log("desc", m);
          let isPass = false;
          states === 2 ? isPass = true : isPass = false;
          let objData = {
            auditItemId: that.$route.query.itemId,
            applyId: that.dInfo.AppId, // 调课申请ID
            isPass: isPass, // 是否审批通过 true/false
            comments: m // 审批意见
          };
          that.loading = true;
          that.showHintMsg = false;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'DoAuditForTK',
            objData: JSON.stringify(objData)
          });
          that.loading = false;
          console.log('verify result', d);
          d = JSON.parse(d);
          that.showHintMsg = true;
          if (d.success) {
            that.hintMsg = d.msg;
            that.uStates = 2;
            that.getApplyDetail();  // 读取申请的详细信息
          } else {
            that.hintMsg = '审批失败';
          }
        }, null, {showInput: true, inputVal: "", required: false});
      },
      // 读取申请的详细信息
      async getApplyDetail () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetTeacherApplyInfoForTK',
          applyId: parseInt(this.$route.query.id)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取详情数据失败:${d.msg}`);
          return;
        }
        d = JSON.parse(d);
        this.exResultLst = [];
        this.dInfo = d.data;
        console.log("apply detail", d.data);
        if (this.dInfo.Status === 0) {
          this.applyinfo = {
            AppId: this.dInfo.AppId,
            DKXZ: this.dInfo.DKXZ,
            ChangeRange: this.dInfo.ChangeRange,
            Subject: this.dInfo.Subject,
            Reason: this.dInfo.Reason,
            Status: 1,
            ChangeType: this.dInfo.ChangeType // 调课类别
          } // 调课基本信息对象
        }
        this.detailList = this.dInfo.DetailList;
        /* 调课结果 start */
        for (let i=0; i<this.detailList.length; i++) {
          let si = this.detailList[i];
          let reslst = {
            BJMCs: si.BJMCs, // 班级
            OriKCMC: si.KCMC, // 原课表课程
            OriWeekIndex: si.OriWeekIndex, // 原课表周次
            OriWeekDayName: '星期' + this.WeekDayLst[si.OriDayOfWeek-1], // 原课表星期
            OriDayOfWeek: si.OriDayOfWeek, // 原课表星期
            OriNodeIndex: si.OriNodeIndex, // 原课表节次
            OriEmpName: this.dInfo.XM, // 原课表教师
            OriJSMCs: si.OriJSMC // 原课表的教室
          };
          // 1. 代课-周次、星期、节次、教室相同
          if (!si.ExEmpId && si.OriWeekIndex === si.NewWeekIndex && si.OriDayOfWeek === si.NewDayOfWeek && si.OriNodeIndex === si.NewNodeIndex && si.NewZGH !== si.OriZGH) {
            reslst.ChangeRange = 1;
            reslst.NewEmpName = si.NewXM;
          } else if (si.OriWeekIndex === si.NewWeekIndex && si.OriDayOfWeek === si.NewDayOfWeek && si.OriNodeIndex === si.NewNodeIndex && si.OriJSMC !== si.NewJSMC && si.NewZGH === si.OriZGH) {
            // 2. 教室 - 周次、星期、节次相同,教室不同 OriZGH
            reslst.ChangeRange = 2;
            reslst.NewJSMCs = si.NewJSMC;
          } else if (!si.ExEmpId && (si.OriWeekIndex !== si.NewWeekIndex || si.OriDayOfWeek !== si.NewDayOfWeek || si.OriNodeIndex !== si.NewNodeIndex) && si.NewZGH === si.OriZGH) {
            // 3. 时间 - 教室相同 , 时间不同（周次、星期、节次）,没有对调老师
            reslst.ChangeRange = 3;
            reslst.NewPkDate = si.NewPkDay.substr(0, 10);
            reslst.NewWeekDayName = this.WeekDayLst[si.NewDayOfWeek];
            reslst.NewNodeIndex = si.NewNodeIndex;
          } else if (si.ExEmpId) {
            // 4. 班内对调
            reslst.ChangeRange = 4;
            reslst.NewKCMC = si.ExchangeJxbmc;
            reslst.NewWeekIndex = si.NewWeekIndex;
            reslst.NewWeekDayName = '星期' + this.WeekDayLst[si.NewDayOfWeek - 1];
            reslst.NewNodeIndex = si.NewNodeIndex;
            reslst.NewEmpName = si.ExEmpName;
            reslst.NewJSMCs = si.ExRoomName;
          }
          this.exResultLst.push(reslst);
        }
        /* 调课结果 end */
      },
      // 得到当前页面数据
      getCurrData () {
        if (this.QD.currPgToOtherPg) {
          this.QD.currPgToOtherPg = null;
        }
      },
      // 判断是否从审批列表中过来
      judgeDetailType () {
        if (this.$route.query.states) {
          this.uStates = parseInt(this.$route.query.states);
          if (this.uStates === 1 && !this.QD.parentPageData) {
            this.$router.go(-1); // 刷新的时候返回到审批列表页面中
          }
        }
        this.getCurrData(); // 得到当前页面数据
        this.getApplyDetail(); // 读取申请的详细信息
      }
    },
    created () {
      this.judgeDetailType(); // 判断是否从审批列表中过来
    },
    data () {
      return {
        loading: false,
        uStates: 0, // 当前用户审批的状态值
        dInfo: null, // 详情的基本信息
        exResultLst: [], // 调课结果
        detailList: [], // 调课明细信息对象的数组集合（多节课调课，一节课为一个对象）
        WeekDayLst: ['一', '二', '三', '四', '五', '六', '日'],
        applyinfo: null, // 调课基本信息对象 - 提交、修改
        showHintMsg: false, // 是否显示提示信息
        hintMsg: '' // 提示内容
      }
    }
  }
</script>
<style scoped>
  .container{
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
  .baseInfoBox{
    padding: 10px 0;
  }
  .baseInfoBox>p:after{
    display: block;
    clear: both;
    content: '';
    height: 0;
    visibility: hidden;
  }
  .baseInfoBox>p{
    zoom: 1;
    padding: 2px 15px;
  }
  .baseInfoBox>p>.title{
    float: left;
    display: inline-block;
    width: 70px;
    padding-right: 12px;
    font-size: 14px;
    color: #666;
    text-align: right;
    box-sizing: border-box;
  }
  .baseInfoBox>p>.value{
    float: left;
    width: 75%;
    font-size: 14px;
    color: #333;
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
  /* 班级名称 */
  .exClassName{
    padding: 0 15px;
    text-align: left;
  }
  /* 调课结果 end */
</style>

