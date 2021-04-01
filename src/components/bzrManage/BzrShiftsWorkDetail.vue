<template>
  <div class="eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <toast-info v-if="showHintMsg" :text="hintMsg"></toast-info>
    <div v-if="info" style="position: relative;top: 0;">
      <span class="school-wx-icon verifyIcon nosubmit-icon" v-if="info.states === 0">&#xe6b2;</span>
      <span class="school-wx-icon verifyIcon verifying-icon" v-if="info.states === 1">&#xe836;</span>
      <span class="school-wx-icon verifyIcon pass-icon" v-if="info.states === 2">&#xe651;</span>
      <span class="school-wx-icon verifyIcon lost-icon" v-if="info.states === 4" >&#xe68a;</span>
    </div>
    <div class="detail-field" v-if="info">
      <group class="gp">
        <cell>
          <span slot="after-title">姓名</span>
          <span>{{info.xM}}</span>
        </cell>
        <cell>
          <span slot="after-title">申请人工号</span>
          <span>{{info.zGH}}</span>
        </cell>
        <cell :is-link="type === 2 && info.states === 1" @click.native="goSelectTea">
          <span slot="after-title" class="titleValWid">顶班人</span>
          <div>
            <span v-if="info.states <= 1 && info.MemberList.length > 0" v-for="(s, sidx) in info.MemberList" :key="sidx"><a v-if="sidx !== 0">,</a>{{s.xm}}({{s.zgh}})</span>
            <span v-if="type === 2 && info.MemberList.length === 0">选择</span>
            <span v-if="info.states > 1 && info.MemberList.length === 0">无</span>
          </div>
        </cell>
        <cell>
          <span slot="after-title">顶班开始日期</span>
          <span>{{info.kSRQ}} {{info.kSRQFW}}</span>
        </cell>
        <cell>
          <span slot="after-title">顶班结束日期</span>
          <span>{{info.jSRQ}} {{info.jSRQFW}}</span>
        </cell>
      </group>
      <group class="gp">
        <span style="display: inline-block;padding: 10px 15px;">共请假<a style="color: #008000;padding: 0 2px;">{{info.days}}</a>天</span>
      </group>
      <group class="gp">
        <span class="title-name-cell">顶班事由</span>
        <div class="desc-detail">{{info.reasons}}</div>
      </group>
      <group class="gp">
        <span class="title-name-cell">备注</span>
        <div class="desc-detail">{{info.remark}}</div>
        <cell>
          <span slot="after-title"  class="titleName">申请日期</span>
          <span>{{info.applyDate}}</span>
        </cell>
      </group>
    </div>
    <button-two v-if="type === 1 && info && info.states === 0" :titleOne="'提交'" :titleTwo="'修改'"
                @get-oneVal="submitWay" @get-twoVal="reviseWay" :oneButtonClass="'button4'" :twoButtonClass="'button2'"></button-two>
    <button-two v-if="type === 2 && info && info.states === 1" :titleOne="'拒绝'" :titleTwo="'通过'"
                @get-oneVal="refuseWay" @get-twoVal="passWay" :oneButtonClass="'button6'" :twoButtonClass="'button5'"></button-two>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import ButtonTwo from '../common/ButtonTwo.vue'
  import ToastInfo from '../common/ToastInfo.vue'
  export default {
    name: 'bzrManage-BzrShiftsWorkDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      ButtonTwo,
      ToastInfo
    },
    methods: {
         // 选择顶班人
      goSelectTea () {
        this.saveUserData(); // 保存当前用户信息
        if (this.type === 2 && this.info.states === 1) {
          this.saveDbrData();
          this.$router.push({path: '/commonSelect/selectMultiBzr'});
        }
      },
        // 审批验证-顶班人有且只能为一个人
      verifyData () {
        if (this.info.MemberList.length === 0) {
          this.QD.alert('', '请选择顶班人');
          return false;
        }
        if (this.info.MemberList.length > 1) {
          this.QD.alert('', '只能有一个顶班人');
          return false;
        }
        return true;
      },
        // 同意
      passWay () {
        if (!this.verifyData()) {
          return;
        }
        this.auditWay('同意');
      },
        // 拒绝
      refuseWay () {
        if (!this.verifyData()) {
          return;
        }
        this.auditWay('拒绝');
      },
      // 审批方法
      auditWay (type) {
        let that = this;
        console.log('info', this.info);
        this.QD.confirm("提示: 请输入" +type+ "说明（限100字）", "", async function (m) {
          let mlen = m.replace(/[\u0391-\uFFE5]/g, "a").length;
          if (mlen>100){
            that.QD.alert('', '通过说明不能超过100个字！');
            return;
          }
          let states = 4;
          if (type === '同意') {
            states = 2;
          }
          that.loading = true;
          that.showHintMsg = false;
          let jsonData = {
            dBEmpId: that.info.MemberList[0].empId,
            dBXM: that.info.MemberList[0].xm,
            dBZGH: that.info.MemberList[0].zgh,
            UserId: that.userInfo.UserId,
            auditorName: that.userInfo.XM,
            auditResult: m,
            states: states,
            dBID: that.info.dBID};
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'AuditClassWorkInsteadData',
            jsonData: JSON.stringify(jsonData)
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            that.QD.alert(`审批失败`);
            return;
          }
          console.log('d', d);
          if (type === '拒绝') {
            that.info.states = 4; // 审核拒绝
          } else {
            that.info.states = 2; // 审核同意
          }
          that.showHintMsg = true;
          that.hintMsg = '审批成功';
        }, null, {showInput: true, inputVal: "", required: true});
      },
        // 提交
      submitWay () {
        let that = this;
        console.log('info', this.info);
        this.QD.confirm('', '确定提交', async function(){
          that.loading = true;
          that.showHintMsg = false;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'SubmitClassWorkInsteadApply',
            applyId: that.info.dBID
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            that.QD.alert(`提交失败`);
            return;
          }
          console.log('d', d);
          that.showHintMsg = true;
          that.hintMsg = '提交成功';
          that.info.states = 1; // 审核中
        })
      },
      // 修改
      reviseWay () {
        this.saveData();
        this.$router.push({path: '/bzrManage/bzrShiftsWorkApply', query: {id: this.info.dBID}});
      },
        // 详情
      async getDetail () {
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
        this.getDbrData1(); // 得到选择的顶班人
        if (this.type === 2 && this.info.states === 1) {
          console.log('get user data');
          this.getSaveUserData(); // 得到当前用户
        }
      },
      // 保存顶班人数据-方便将已有数据渲染在选择班主任页面上
      saveDbrData () {
        let nameLst = [];
        let zghLst = [];
        let emIdLst = [];
        for (let i in this.info.MemberList) {
          let n = this.info.MemberList[i];
          nameLst.push(n.xm);
          zghLst.push(n.zgh);
          emIdLst.push(n.empId);
        }
        if (zghLst.length > 0) {
          this.QD.otherPageData = {nameLst: nameLst, zghLst: zghLst, emId: emIdLst};// 保存顶班人数据-方便将已有数据渲染在选择班主任页面上
        }
      },
      // 得到选择的顶班人
      getDbrData1 () {
        console.log('ee 0', this.QD.otherPageData);
        if (this.QD.otherPageData) {
          let s = this.QD.otherPageData;
          let nameLst = s.nameLst;
          let zghLst = s.zghLst;
          let emIdLst = s.emId;
          this.QD.otherPageData = null;
          let mlst = [];
          for (let i in nameLst) {
            mlst.push({
              empId: emIdLst[i],
              zgh: zghLst[i],
              xm: nameLst[i]
            })
          }
          this.info.MemberList = mlst;
        }
        console.log('ee 1', this.info.MemberList);
      },
      // 得到当前用户的信息
      currUserData () {
        this.userInfo =this.QD.getLocalUserinfo().stuObj;
      },
      // 保存用户信息
      saveUserData () {
        this.QD.brotherPageData = {userInfo: this.userInfo};
      },
      getSaveUserData () {
        if (this.QD.brotherPageData) {
          this.userInfo = this.QD.brotherPageData.userInfo;
          this.QD.brotherPageData = null;
        } else {
          this.currUserData();
        }
        console.log('user xm', this.userInfo.XM);
      },
      saveData () {
        let startTimeRageIdx = this.info.kSRQFW === '上午' ? 0 : 1;
        let endTimeRageIdx = this.info.jSRQFW === '上午' ? 0 : 1;
        this.QD.currPageData = {info: this.info, startTimeRageIdx: startTimeRageIdx, endTimeRageIdx: endTimeRageIdx};
      }
    },
    created () {
      this.type = parseInt(this.$route.query.type);
      this.getDetail();
    },
    data () {
      return {
        loading: false,
        type: 1, // 默认是申请详情, 2是审核详情
        showHintMsg: false, // 是否显示提示信息
        hintMsg: '成功', // 提示内容
        userInfo: null, // 用户信息
        info: null
      }
    }
  }
</script>
<style scoped>
  .detail-field{
    padding-bottom: 70px;
    background-color: #f5f5f9;
  }
  .gp{
    margin-top: -20px;
  }
  .title-name-cell{
    display: inline-block;
    font-size: 16px;
    padding: 10px 15px;
  }
  .desc-detail{
    padding: 0 15px 10px 15px;
    color: #666666;
  }
  .titleValWid{
    display: inline-block;
    width: 70px;
  }
</style>

