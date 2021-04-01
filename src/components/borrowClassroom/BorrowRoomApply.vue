<template>
  <div class="borrow-room-apply">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-if="applyInfo.SemId !== 0" class="all_field">
      <group class="gp">
        <cell v-model="applyInfo.XQMC">
          <span class="popup-key" slot="after-title">借用学期</span>
        </cell>
        <popup-picker :data="roomTypePopupData" v-model="selectRoomTypeVal" :columns="1" :placeholder="selectRoomTypeVal.length === 0 ? '选择' : ''" @on-change="changeRoomType">
          <span class="popup-key" slot="title">借用教室类型</span>
        </popup-picker>
        <x-input placeholder="填写" v-model="roomNum" type="text" :text-align="'right'" ref="resetRoomNum" @on-change="changeRoomNum">
          <span slot="label" class="input-key"><span class="school-wx-icon requireIcon">&#xe644;</span>借用教室数量</span>
        </x-input>
        <datetime format="YYYY-MM-DD" v-model="applyInfo.StartDay" @on-change="changeBorrowStartDate">
          <span slot="title"><span class="school-wx-icon requireIcon">&#xe644;</span>借用开始日期</span>
        </datetime>
        <datetime format="YYYY-MM-DD" v-model="applyInfo.EndDay" @on-change="changeBorrowEndDate">
          <span slot="title"><span class="school-wx-icon requireIcon">&#xe644;</span>借用结束日期</span>
        </datetime>
      </group>
      <div class="check-field">
        <divider class="divider-title"><span class="school-wx-icon requireIcon">&#xe644;</span>借用周次</divider>
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
        <divider class="divider-title"><span class="school-wx-icon requireIcon">&#xe644;</span>借用星期</divider>
        <checker
          v-model="selectDayWeekData"
          type="checkbox"
          :default-item-class="'checker-item'"
          :selected-item-class="'checker-item-selected'"
        >
          <checker-item :disabled="true" v-for="(d, dIdx) in dayWeekCheckerData" :key="dIdx" :value="d.dayWeek">{{d.value}}</checker-item>
        </checker>
      </div>
      <div class="check-field">
        <divider class="divider-title"><span class="school-wx-icon requireIcon">&#xe644;</span>借用节次</divider>
        <checker
          v-model="selectNodeData"
          type="checkbox"
          :default-item-class="'checker-item'"
          :selected-item-class="'checker-item-selected'"
          @on-change="changeSelectNodeData"
        >
          <checker-item v-for="(n, nidx) in nodeCheckerData" :key="nidx" :value="n.node">{{n.value}}</checker-item>
        </checker>
      </div>
      <div class="check-field">
        <divider class="divider-title"><span class="school-wx-icon requireIcon">&#xe644;</span>用途说明</divider>
        <checker
          v-model="selectUseIllusData"
          type="radio"
          :default-item-class="'checker-item'"
          :selected-item-class="'checker-item-selected'"
          @on-change="changeUseIllusData"
        >
          <checker-item v-for="(u, uIdx) in useIllustrateData" :key="uIdx" :value="u">{{u}}</checker-item>
        </checker>
        <x-textarea v-if="selectUseIllusData === '其他'" :disabled="false" class="xTextarea" :rows="3" :placeholder="'详细描述用途说明'" v-model="useIllusRemark"></x-textarea>
      </div>
      <group v-if="selectRoomLst.length>0" title="已选教室">
        <cell v-for="(r, rIdx) in selectRoomLst" :key="rIdx">
          <span  class="primary-line" slot="after-title">{{r.JSMC}}</span>
          <span class="desc-line" slot="inline-desc">容纳人数: {{r.RNRS}}</span>
        </cell>
      </group>
      <div class="selectRoomBtn_box">
        <x-button class="btn" mini @click.native="goSelectRoom"><span class="school-wx-icon requireIcon">&#xe644;</span>查询选择空闲教室</x-button>
      </div>
    </div>
    <x-button-one :titleVal="'保存'" @click-button="saveApplyInfo"></x-button-one>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Checker from 'vux/src/components/checker/checker.vue'
  import CheckerItem from 'vux/src/components/checker/checker-item.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XButtonOne from '../common/XButtonOne.vue'

  export default {
    name: 'borrowClassroomApply',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      PopupPicker,
      XInput,
      Datetime,
      Checker,
      CheckerItem,
      Divider,
      XTextarea,
      XButton,
      XButtonOne
    },
    methods: {
      // 保存当前页面的数据
      saveCurData () {
        this.QD.currPageData = { // 保存
          applyInfo: this.applyInfo,
          selectWeekData: this.selectWeekData,
          selectDayWeekData: this.selectDayWeekData,
          selectNodeData: this.selectNodeData,
          selectUseIllusData: this.selectUseIllusData,
          roomNum: this.roomNum,
          selectRoomTypeVal: this.selectRoomTypeVal,
          weekCheckerData: this.weekCheckerData,
          nodeCheckerData: this.nodeCheckerData,
          useIllusRemark: this.useIllusRemark,
          roomTypePopupData: this.roomTypePopupData
        }; // 保存当前数据
      },
      // 判断必要字段填写是否正确，以及是否填写
      judgeInfo () {
        let gapDay = this.QD.getDateCount(this.applyInfo.StartDay, this.applyInfo.EndDay);
        if (gapDay < 0) {
          this.QD.alert('', '借用结束日期不能小于借用开始日期');
          return false;
        }
        // 判断周次
        if (this.selectWeekData.length === 0) {
          this.QD.alert('', '借用日期不在当前学期范围内');
          return false;
        }
        if (this.selectNodeData.length === 0) {
          this.QD.alert('', '请选择借用节次');
          return false;
        }
        /* 当用途说明选择的是‘其他’，详细描述用途说明 为必填 */
        if (this.selectUseIllusData === '其他' && !this.useIllusRemark) {
          this.QD.alert('', '请详细描述用途说明');
          return false;
        }
        return true;
      },
      // 选择教室
      goSelectRoom () {
        this.assignVal(); // 选中的值赋值到 applyInfo 参数中
        if (!(this.judgeInfo())) {
          return;
        }
        this.QD.brotherPageData = {applyInfo: this.applyInfo, selectInfo: this.selectRoomLst};
        this.saveCurData(); // 保存当前页面的数据
        this.$router.push('/borrowClassroom/freeClassRoomLst');
      },
      // 选中的值赋值到 applyInfo 参数中
      assignVal () {
        if (this.selectWeekData.length > 0) {
          this.applyInfo.WeekList = this.selectWeekData.join(','); // 借用周次
        }
        if (this.selectDayWeekData.length > 0) {
          this.applyInfo.DayOfWeeks = this.selectDayWeekData.join(','); // 借用星期
        }
        if (this.selectNodeData.length > 0) {
          this.applyInfo.UseNodes = this.selectNodeData.join(','); // 借用节次
        }
        this.applyInfo.RoomList.length > 0 ? this.applyInfo.RoomSelected = true : this.applyInfo.RoomSelected = false; // 是否选中了教室
        /* 判断选择用途说明 */
        this.selectUseIllusData === '其他' ? this.applyInfo.Usage = this.useIllusRemark : this.applyInfo.Usage = this.selectUseIllusData;
        // 教室借用数量 int 型
        this.applyInfo.RoomNum = parseInt(this.roomNum);
        if (this.selectRoomTypeVal.length > 0) {
          this.applyInfo.RoomType = this.selectRoomTypeVal[0];// 教室类型
        }
      },
      // 保存借用教室填写信息-- 下一步查询空闲教室操作
      saveApplyInfo () {
        this.assignVal(); // 选中的值赋值到 applyInfo 参数中
        if (!(this.judgeInfo())) {
          return;
        }
        /* 判断是否选择了空闲教室 */
        if (this.applyInfo.RoomList.length === 0) {
          this.QD.alert('', '请选择空闲教室');
          return false;
        }
        let that = this;
        console.log('info', this.applyInfo);
        this.QD.confirm('', '确定保存', async function(){
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'InsertRoomBorrowApply',
            objData: JSON.stringify(that.applyInfo)
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            that.QD.alert('', '保存失败');
            return;
          }
          console.log("insert", d);
          that.$router.replace({path: '/borrowClassroom/borrowRoomDetail', query: {id: d.data.borrowId, auditId: 0}});
        })
      },
      // 改变借用教室类型
      changeRoomType (value) {
        if (value.length === 0 || value[0] === '选择') {
          this.selectRoomTypeVal = [];
        } else {
          this.clearSelectRoomLst();  // 清空之前选中的教室- 借用日期改变或节次改变或用途说明、教室类型、教室使用人数
        }
      },
      // 改变教室借用的开始日期
      changeBorrowStartDate (value) {
        this.getWeedsAndDay(); // 根据借用日期判断选择的周次和选择的星期
      },
      // 改变教室借用的结束日期
      changeBorrowEndDate (value) {
        this.getWeedsAndDay(); // 根据借用日期判断选择的周次和选择的星期
      },
      // 改变选中的节次
      changeSelectNodeData (value) {
        this.clearSelectRoomLst();  // 清空之前选中的教室- 借用日期改变或节次改变或用途说明、教室类型、教室使用人数
      },
      // 改变用途说明
      changeUseIllusData (value) {
        this.clearSelectRoomLst();  // 清空之前选中的教室- 借用日期改变或节次改变或用途说明、教室类型、教室使用人数
      },
      // 清空之前选中的教室- 借用日期改变或节次改变或用途说明、教室类型、教室使用人数
      clearSelectRoomLst () {
        this.applyInfo.RoomList = [];
        this.selectRoomLst = [];
      },
      // 根据借用日期判断选择的周次和选择的星期
      getWeedsAndDay () {
        this.clearSelectRoomLst();  // 清空之前选中的教室- 借用日期改变或节次改变或用途说明、教室类型、教室使用人数
        let gapDay = this.QD.getDateCount(this.applyInfo.StartDay, this.applyInfo.EndDay);
        if (gapDay < 0) {
          this.QD.alert('', '借用结束日期不能小于借用开始日期');
          this.selectDayWeekData = []; // 重置选中的星期
          this.selectWeekData = []; // 重置选中的周次
          return;
        }
        /* 判断周次 start */
        this.applyInfo.StartWeek = 0; // 开始周次
        this.applyInfo.EndWeek = 0; // 结束周次
        // 1. 判断开始日期所在周次
        for (let i=0; i<this.weekCheckerData.length; i++) {
          let startT = new Date(this.applyInfo.StartDay);
          let weekStartT = new Date(this.weekCheckerData[i].StartDate);
          let weekEndT = new Date(this.weekCheckerData[i].EndDate);
          if (weekStartT <= startT && startT <= weekEndT) {
            this.applyInfo.StartWeek = this.weekCheckerData[i].week; // 开始周次
            break;
          }
        }
        // 2.判断结束日期所在周次
        for (let i=0; i<this.weekCheckerData.length; i++) {
          let endT = new Date(this.applyInfo.EndDay);
          let weekStartT = new Date(this.weekCheckerData[i].StartDate); // 周次对应下的开始日期
          let weekEndT = new Date(this.weekCheckerData[i].EndDate); // 周次对应下的结束日期
          if (weekStartT <= endT && endT <= weekEndT) {
            this.applyInfo.EndWeek = this.weekCheckerData[i].week; // 结束周次
            break;
          }
        }
        if (this.applyInfo.StartWeek === 0) {
          this.QD.alert('', '借用开始日期不在当前学期范围内');
          return;
        }
        if (this.applyInfo.EndWeek === 0) {
          this.QD.alert('', '借用结束日期不在当前学期范围内');
          return;
        }
        this.selectWeekData = [];
        for (let i=this.applyInfo.StartWeek; i<=this.applyInfo.EndWeek; i++) {
          this.selectWeekData.push(i); // 选中的周次-渲染在页面上
        }
        /* 判断周次 end */
        /* 判断day 星期 start */
        // 1. 判断两个日期相差多少天
        let sDayWeek = new Date(this.applyInfo.StartDay).getDay(); // 值是0 1 2 3 4 5 6。借用开始日期星期
        let eDayWeek = new Date(this.applyInfo.EndDay).getDay(); // 借用开始日期星期
        let selectDayWeekLst = [];
        if (gapDay >= 6) { // 借用期限超过7天
          selectDayWeekLst = [1, 2, 3, 4, 5, 6, 7];
        } else { // 借用期限不超过7天
          if (eDayWeek >= sDayWeek) { // 在同一个星期内
            for (let i=sDayWeek; i<=eDayWeek; i++) {
              let weeks = [7, 1, 2, 3, 4, 5, 6];
              selectDayWeekLst.push(weeks[i]);
            }
          } else { // 不在同一个星期内
            for (let i=0; i<=eDayWeek; i++) { // 0 星期天
              let weeks = [7, 1, 2, 3, 4, 5, 6];
              selectDayWeekLst.push(weeks[i]);
            }
            for (let i=sDayWeek; i<=6; i++) {
              let weeks = [7, 1, 2, 3, 4, 5, 6];
              selectDayWeekLst.push(weeks[i]);
            }
          }
        }
        // 将星期重新渲染在页面上
        this.selectDayWeekData = [];
        for (let i=0; i<selectDayWeekLst.length; i++) {
          this.selectDayWeekData.push(selectDayWeekLst[i]);
        }
        /* 判断day 星期 end */
      },
      // 教室数量 只能填数字
      changeRoomNum (value) {
        this.roomNum = value.replace(/[^0-9]/, '');
        this.$refs.resetRoomNum.reset(this.roomNum); // 重置值
      },
      // 获取教室类型
      async getRoomTypeData () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassRoomTypeData'
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`${d.msg}`);
          return;
        }
        for (let i=0; i<d.length; i++) {
          this.roomTypePopupData.push(d[i].JSLX); // 教师类型-下拉框可选的值
        }
        this.roomTypePopupData.splice(0, 0, '选择');
        console.log("room type", d);
      },
      // 获取当前学期内的共周次数、周次开始结束日期和节次（21 中午， 22 晚上）
      async getSemesterWeeksAndNodes () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetSemesterWeeksAndNodes',
          semId: this.applyInfo.SemId
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
        console.log(this.selectNodeData);
        this.getWeedsAndDay(); // 根据借用日期判断选择的周次和选择的星期
      },
      // 得到学期信息
      async getSmsInfo () {
        let xqList = await this.QD.getSmstLst();
        this.QD.xqList = xqList; // 学期列表
        this.QD.currentXQ = xqList.find((n) => n.CurrentXQ === true); // 当前学期
        if (this.QD.currentXQ) {
          this.applyInfo.XQMC = this.QD.currentXQ.XQMC; // 默认是当前学期
          this.applyInfo.SemId = this.QD.currentXQ.XQID;
          this.getSemesterWeeksAndNodes(); // 获取当前学期内的共周次数、周次开始结束日期和节次（21 中午， 22 晚上）
        }
      },
      getInitData () {
        let currDate = this.QD.getDateOrTime('date');
        this.applyInfo.StartDay = currDate; // 借用开始日期
        this.applyInfo.EndDay = currDate; // 借用结束日期
        this.getSmsInfo(); // 得到学期信息
      },
      // 得到当前页面的数据
      getCurData () {
        if (this.QD.currPageData) {
          let cd = this.QD.currPageData;
          this.applyInfo = cd.applyInfo;
          this.selectWeekData = cd.selectWeekData;
          this.selectDayWeekData = cd.selectDayWeekData;
          this.selectNodeData = cd.selectNodeData;
          this.selectUseIllusData = cd.selectUseIllusData;
          this.roomNum = cd.roomNum;
          this.selectRoomTypeVal = cd.selectRoomTypeVal;
          this.weekCheckerData = cd.weekCheckerData;
          this.nodeCheckerData = cd.nodeCheckerData;
          this.useIllusRemark = cd.useIllusRemark;
          this.roomTypePopupData = cd.roomTypePopupData;
          this.QD.currPageData = null;
          // 获取选中的教室信息
          if (this.QD.otherPageData) {
            let rd = this.QD.otherPageData;
            this.applyInfo.RoomList = [];
            let roomLst = [];
            for (let i=0; i<rd.length; i++) {
              roomLst.push(rd[i]);
              this.applyInfo.RoomList.push({RoomId: rd[i].JSID, JSDM: rd[i].JSDM}); // 需要上传的教室信息字段
            }
            this.selectRoomLst = roomLst;
            this.QD.otherPageData = null;
          } else {
            this.applyInfo.RoomList = []; // 重置教室为空
          }
        } else {
          this.getInitData(); // 得到初始化数据- 当前日期即借用开始日期、借用结束日期
          this.getRoomTypeData(); // 获取教室类型
        }
      }
    },
    created () {
      this.getCurData(); // 得到当前页面的数据
    },
    data () {
      return {
        loading: false,
        roomNum: '1', // // 借用教室数量
        applyInfo: {
          XQMC: '', // 学期名称
          SemId: 0, // 学期id
          RoomNum: 0, // 借用教室数量
          RSRequire: 0, // 使用人数-默认0人
          StartDay: '', // 借用开始日期
          EndDay: '', // 借用结束日期
          StartWeek: 0, // 开始周次
          EndWeek: 0, // 结束周次
          DayOfWeeks: '', // 借用星期
          UseNodes: '', // 借用节次
          RoomType: '', // 借用教室类型 string-教室类型名称
          Usage: '', // 用途说明
          WeekList: '', // 周次，如: 1,2
          RoomSelected: false, // 是否选择了教室 0-没有选择教室，1-选择了教室
          RoomList: [] // 选中的教室集合{RoomId: 0, JSDM: '教室代码'}
        }, // 教室申请填写的信息
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
        selectUseIllusData: '上课', // 选择的用途说明, 默认值‘上课’
        useIllustrateData: ['上课', '考试', '会议', '其他'], // 可选的所有用途说明数据
        useIllusRemark: '', // 用途说明详细描述
        roomTypePopupData: [], // 教室类型-下拉框中学期的选项列表
        selectRoomTypeVal: [], // 选中的教室类型的值
        selectRoomLst: [] // 选中的教室信息  {RoomId: v.JSID, JSDM: v.JSDM}
      }
    }
  }
</script>
<style scoped>
  .all_field,
  .borrow-room-apply{
    background-color: #f2f2f2;
  }
  .all_field{
    padding-bottom: 60px;
  }
  .gp{
    margin-top: -20px;
  }
  .popup-key{
    width: 90px;
  }
  .requireIcon{
    color: #FF0000;
    font-size: 16px;
    vertical-align: middle;
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
    display: inline-block;
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
  /* 选择教室 */
  .selectRoomBtn_box{
    text-align: center;
  }
  .selectRoomBtn_box .btn{
    margin-top: 40px;
    margin-bottom: 20px;
    padding: 0 18px;
    color: #666;
    font-size: 14px;
    background-color: #e5edef;
    vertical-align: middle;
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
  .borrow-room-apply .weui-input{
    color: #999;
  }
  .borrow-room-apply .weui-textarea{
    padding: 10px;
    font-size: 14px;
    font-family: inherit;
    box-sizing: border-box;
    background-color: #f2f2f2;
  }
  /* x-textarea border-top 线 设置无*/
  .borrow-room-apply .xTextarea.weui-cell:before{
    border-top: 0;
  }
</style>

