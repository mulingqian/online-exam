<template>
  <div class="borrow-room-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-if="dInfo" class="all_field">
      <div style="position: relative;">
        <span class="school-wx-icon verifyIcon nosubmit-icon" v-if="dInfo.Status === 0">&#xe6b2;</span>
        <span class="school-wx-icon verifyIcon verifying-icon" v-if="dInfo.Status === 1">&#xe836;</span>
        <span class="school-wx-icon verifyIcon pass-icon" v-if="dInfo.Status === 2">&#xe651;</span>
        <span class="school-wx-icon verifyIcon lost-icon" v-if="dInfo.Status === 4" >&#xe68a;</span>
      </div>
      <group class="gp">
        <cell>
          <span slot="after-title">借用学期</span>
          <span>{{dInfo.XQMC}}</span>
        </cell>
        <cell>
          <span slot="after-title">借用教室类型</span>
          <span>{{dInfo.RoomType}}</span>
        </cell>
        <cell>
          <span slot="after-title">借用教室数量</span>
          <span>{{dInfo.RoomNum}}</span>
        </cell>
        <!--<cell>
          <span slot="after-title">使用人数</span>
          <span>{{dInfo.RSRequire}}</span>
        </cell>-->
        <cell>
          <span slot="after-title">借用开始日期</span>
          <span>{{dInfo.StartDay.substr(0, 10)}}</span>
        </cell>
        <cell>
          <span slot="after-title">借用结束日期</span>
          <span>{{dInfo.EndDay.substr(0, 10)}}</span>
        </cell>
        <cell>
          <span slot="after-title">借用开始周次</span>
          <span>{{dInfo.StartWeek}}</span>
        </cell>
        <cell>
          <span slot="after-title">借用结束周次</span>
          <span>{{dInfo.EndWeek}}</span>
        </cell>
      </group>
      <div class="check-field">
        <divider class="divider-title">借用周次</divider>
        <checker
          v-model="selectWeekData"
          type="checkbox"
          :default-item-class="'checker-item'"
          :selected-item-class="'checker-item-selected'"
        >
          <checker-item :disabled="true" v-for="(w, wIdx) in weekCheckerData" :key="wIdx" :value="w.week">{{w.week}}</checker-item>
        </checker>
      </div>
      <div class="check-field">
        <divider class="divider-title">借用星期</divider>
        <checker
          v-model="selectDayWeekData"
          type="checkbox"
          :default-item-class="'checker-item'"
          :selected-item-class="'checker-item-selected'"
        >
          <checker-item v-for="(d, dIdx) in dayWeekCheckerData" :key="dIdx" :value="d.dayWeek">{{d.value}}</checker-item>
        </checker>
      </div>
      <div class="check-field">
        <divider class="divider-title">借用节次</divider>
        <checker
          v-model="selectNodeData"
          type="checkbox"
          :default-item-class="'checker-item'"
          :selected-item-class="'checker-item-selected'"
        >
          <checker-item :disabled="true" v-for="(n, nidx) in nodeCheckerData" :key="nidx" :value="n.node">{{n.value}}</checker-item>
        </checker>
      </div>
      <div class="check-field">
        <divider class="divider-title">用途说明</divider>
        <checker
          v-model="selectUseIllusData"
          type="radio"
          :default-item-class="'checker-item'"
          :selected-item-class="'checker-item-selected'"
        >
          <checker-item :disabled="true" v-for="(u, uIdx) in useIllustrateData" :key="uIdx" :value="u">{{u}}</checker-item>
        </checker>
        <x-textarea v-if="selectUseIllusData === '其他' && dInfo.Usage !== '其他'" :disabled="true" class="xTextarea" :rows="3" :placeholder="'详细描述用途说明'" v-model="dInfo.Usage"></x-textarea>
      </div>
      <group v-if="dInfo.RoomList.length>0" title="已选教室">
        <cell v-for="(r, rIdx) in dInfo.RoomList" :key="rIdx">
          <span  class="primary-line" slot="after-title">{{r.JSMC}}</span>
          <span class="desc-line" slot="inline-desc">容纳人数: {{r.RNRS}}</span>
        </cell>
      </group>
      <!-- 审批结果 -->
      <audit-lst v-if="dInfo.AuditList.length > 0" :auditResults="dInfo.AuditList"></audit-lst>
    </div>
    <button-two v-if="dInfo && (dInfo.Status === 0 || dInfo.Status === 4)" :titleOne="'修改'" :titleTwo="'提交审批'" :twoButtonClass="'button4'" @get-oneVal="reviseBtn" @get-twoVal="submitBtn"></button-two>
    <button-two v-if="dInfo && dInfo.AuditStates === 1" :titleOne="'拒绝'" :titleTwo="'同意'" :oneButtonClass="'button6'" :twoButtonClass="'button5'" @get-oneVal="doAuditNo" @get-twoVal="doAuditYes"></button-two>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Checker from 'vux/src/components/checker/checker.vue'
  import CheckerItem from 'vux/src/components/checker/checker-item.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import ButtonTwo from '../common/ButtonTwo.vue'
  import AuditLst from '../common/AuditLst.vue'
  export default {
    name: 'borrowClassroomDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      Checker,
      CheckerItem,
      Divider,
      XTextarea,
      ButtonTwo,
      XButton,
      AuditLst
    },
    methods: {
      // 点击修改教室申请借用
      reviseBtn () {
        this.QD.currPgToOtherPg = this.dInfo; // 教室申请详情信息
        this.$router.push('/borrowClassroom/borrowRoomRevise');
      },
      // 审批拒绝
      doAuditNo () {
        this.auditWay(4);
      },
      // 审批同意
      doAuditYes () {
        this.auditWay(2);
      },
      // 审批方法 targetId:教室借用申请Id，auditId:审批Id,passed:true(通过)/false(拒绝)，comment:审批意见
      auditWay (type) {
        let that = this;
        let typeVal = '拒绝';
        let pV = false; // passed:true(通过)/false(拒绝)
        if (type === 2) {
          pV = true;
          typeVal = '同意';
        }
        this.QD.confirm("提示: 请输入" +typeVal+ "说明", "", async function (m) {
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'DoAuditRoomBorrowApply',
            targetId: that.dInfo.BorrowId,
            auditId: parseInt(that.$route.query.auditId),
            passed: pV,
            comment: m
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            that.QD.alert(`审批失败`);
            return;
          }
          that.getRoomApplyDetail(); // 获取教室借用申请信息
        }, null, {showInput: true, inputVal: "", required: true});
      },
      // 提交 RoomList
      submitBtn () {
        if (this.dInfo.RoomList.length === 0) {
          this.QD.alert('', '请选择空闲教室！');
          return;
        }
        let that = this;
        this.QD.confirm('', '确定提交', async function(){
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'SubmitRoomBorrowApplyData',
            targetId: parseInt(that.$route.query.id)
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            that.QD.alert('', '提交失败');
            return;
          }
          that.getRoomApplyDetail(); // 获取教室借用申请信息
        })
      },
      // 获取当前学期内的共周次数、周次开始结束日期和节次（21 中午， 22 晚上）
      async getSemesterWeeksAndNodes () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetSemesterWeeksAndNodes',
          semId: this.dInfo.SemId
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`${d.msg}`);
          return;
        }
        console.log("total weeks and nodes", d);
        let totalNodes = d.data.Nodes; // 当前学期下的所有节次
        let totalWeeks = d.data.Weeks; // 当前学期下的所有周次
        this.weekCheckerData = totalWeeks;
        for (let i=this.dInfo.StartWeek; i<=this.dInfo.EndWeek; i++) { // 教室借用选中的所有周次
          this.selectWeekData.push(i);
        }
        for (let i=0; i<totalNodes.length; i++) { // 当前学期下的所有节次-渲染到页面
          let nd = totalNodes[i].node;
          let nodeVal = '';
          if (nd === 21 || nd === 22) {
            nd === 21 ? nodeVal = '中午' : nodeVal = '晚上';
          } else {
            nodeVal = '第' + nd +'节';
          }
          this.nodeCheckerData.push({value: nodeVal, node: nd}); // 当前学期下的所有节次
        }
        // 选择的节次
        let useNodes = this.dInfo.UseNodes.split(',');
        for (let i=0; i<useNodes.length; i++) {
          this.selectNodeData.push(parseInt(useNodes[i]));
        }
        // 选中的星期
        let dayWeeks = this.dInfo.DayOfWeeks.split(',');
        for (let i=0; i<dayWeeks.length; i++) {
          this.selectDayWeekData.push(parseInt(dayWeeks[i]));
        }
        // 选中的用途说明
        for (let i=0; i<this.useIllustrateData.length; i++) {
          if (this.dInfo.Usage === this.useIllustrateData[i]) {
            this.selectUseIllusData = this.dInfo.Usage;
            break;
          }
        }
        // 选择的用途说明是其他
        if (!this.selectUseIllusData) {
          this.selectUseIllusData = '其他';
        }
        console.log(this.selectNodeData);
      },
      // 获取教室借用申请信息
      async getRoomApplyDetail () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetRoomBorrowApplyDetail',
          applyId: parseInt(this.$route.query.id),
          auditId: parseInt(this.$route.query.auditId)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`${d.msg}`);
          return;
        }
        console.log("detail", d);
        this.dInfo = d.data;
        if (this.weekCheckerData.length === 0) {
          this.getSemesterWeeksAndNodes(); // 获取当前学期内的共周次数、周次开始结束日期和节次（21 中午， 22 晚上）
        }
      }
    },
    created () {
      this.getRoomApplyDetail(); // 获取教室借用申请信息
    },
    data () {
      return {
        loading: false,
        dInfo: null, // 借用教室详细信息
        selectWeekData: [], // 选择的周次数据
        weekCheckerData: [], // 可选所有周次数据
        selectDayWeekData: [], // 选择的星期数据
        dayWeekCheckerData: [
          {value: '星期一', dayWeek: 1},
          {value: '星期二', dayWeek: 2},
          {value: '星期三', dayWeek: 3},
          {value: '星期四', dayWeek: 4},
          {value: '星期五', dayWeek: 5},
          {value: '星期六', dayWeek: 6},
          {value: '星期天', dayWeek: 7}], // 可选所有星期数据
        selectNodeData: [], // 选择的借用节次
        nodeCheckerData: [], // 可选的所有节次
        selectUseIllusData: '', // 选择的用途说明
        useIllustrateData: ['上课', '考试', '会议', '其他'], // 可选的所有用途说明数据
        roomUseTableLst: [] // 选中的空闲教室
      }
    }
  }
</script>
<style scoped>
  .all_field,
  .borrow-room-detail{
    background-color: #f2f2f2;
  }
  .all_field{
    padding-bottom: 60px;
  }
  .gp{
    margin-top: -20px;
  }
  .divider-title{
    position: relative;
    left: 15%;
    width: 70%;
    text-align: center;
    font-size: 14px;
  }
  .check-field{
    margin-top: 10px;
    padding: 10px 10px 15px 10px;
    background-color: #fff;
    text-align: center;
  }
  .checker-item {
    padding: 0 10px;
    height: 26px;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 6px;
    font-size: 14px;
    color: #333;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
  }
  .checker-item-selected {
    color: #fff;
    background-color: #13c22b;
  }
  .xTextarea{
    margin-top: 15px;
  }
  /* 选中的教室 */
  .primary-line{
    font-size: 16px;
    color: #333;
    line-height: 1.41176471;
  }
  .desc-line{
    font-size: 14px;
    color: #666;
    line-height: 1.41176471;
  }
</style>
<style>
  .borrow-room-detail .weui-textarea{
    padding: 10px;
    font-size: 14px;
    font-family: inherit;
    box-sizing: border-box;
    background-color: #f2f2f2;
  }
  /* x-textarea border-top 线 设置无*/
  .borrow-room-detail .xTextarea.weui-cell:before{
    border-top: 0;
  }
</style>
