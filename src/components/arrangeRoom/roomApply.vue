<template>
  <div class="eachPgBase arrangeRoomApply">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="topField">
      <search class="searchBox"
            placeholder="搜索学生姓名或学号"
            @on-change="getResult"
            @on-result-click="selectResult"
            @on-focus="onFocus"
            :results="stuInfoResults"
            v-model="inputStuName"
            position="absolute"
            :auto-scroll-to-top="true"
            top="46px"
            ref="search">
      </search>
      <div style="overflow: hidden;">
        <!-- 筛选 start -->
        <sift-condition @clickEvent="setShowRoomPopup" class="siftConditionBox" v-if="teaUserInfo" @get-selectVal="getSelectInfo" @get-stuData="getStuData" :teaUserInfo="teaUserInfo"></sift-condition>
        <!-- 筛选 end -->
        <group class="gp">
          <cell :is-link="true" :arrow-direction="showRoomPopup ? 'up': 'down'" @click.native="showRoomPopup = !showRoomPopup">
            <span slot="after-title" :class="`roomTitle ${showRoomPopup && roomsPosInfo ? 'setRoomTitle' : ''}`">房间</span>
          </cell>
        </group>
      </div>
    </div>
    <!-- 选择房间 start -->
    <div v-transfer-dom>
      <div v-if="showRoomPopup && roomsPosInfo.length <= 0" class="roomPopupBox">
        <p style="padding-top: 20px;font-size: 12px;color: #666;text-align: center;">没有可以分配的寝室</p>
      </div>
      <div v-if="showRoomPopup && roomsPosInfo.length>0" class="roomPopupBox">
        <div class="roomInfoBox">
          <div class="left lf1">
            <a class="title">宿舍楼<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span></a>
            <div class="scrollbar">
              <a :class="selectRoomsPosIdx.dormIdx === sidx ? 'selectRelateRoomInfo': ''"
                 v-for="(s, sidx) in roomsPosInfo" :key="sidx" href="javascript:void(0)" @click="selectDorm(sidx)">{{s.dormName}}</a>
            </div>
          </div>
          <div class="left lf2">
            <a class="title">楼层<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span></a>
            <div class="scrollbar">
              <a :class="selectRoomsPosIdx.roomFloorIdx === sidx ? 'selectRelateRoomInfo': ''"
                 v-for="(s, sidx) in roomsPosInfo[selectRoomsPosIdx.dormIdx].roomFloorLst" :key="sidx" @click="selectRoomFloor(sidx)"
                 href="javascript:void(0)">
                <span>{{s.roomFloorName}}</span>
                <span v-if="s.roomFloorSex === 1">/男</span>
                <span v-if="s.roomFloorSex === 2">/女</span>
              </a>
            </div>
          </div>
          <div class="left lf3">
            <a class="title">房间<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span></a>
            <div class="scrollbar">
              <a :class="selectRoomsPosIdx.roomInfoIdx === sidx ? 'selectRelateRoomInfo': ''" @click="selectRoomInfo(sidx, s)"
                 v-for="(s, sidx) in roomsPosInfo[selectRoomsPosIdx.dormIdx].roomFloorLst[selectRoomsPosIdx.roomFloorIdx].roomInfoLst" :key="sidx"
                 href="javascript:void(0)">
                <span>{{s.RoomName}}</span>
                <span v-if="s.detail.SexRange === 1">/男</span>
                <span v-if="s.detail.SexRange === 2">/女</span>
                <span>/{{s.detail.BedNum}}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a @click="setShowRoomPopup" v-if="showRoomPopup" class="vux-popup-mask" href="javascript:void(0);" style="opacity: 1;margin-top: 140px;z-index: 20;"></a>
    <!-- 选择房间 end -->

    <div class="eachPgBase container" v-if="showStuData">
      <group class="gp" v-for="(s, sIdx) in showStuData" :key="sIdx">
        <!--<cell :is-link="true" :arrow-direction="s.showContent ? 'up' : 'down'" @click.native="s.showContent = !s.showContent">-->
        <cell :is-link="true" :arrow-direction="s.showContent ? 'up' : 'down'" @click.native="arrangeStuAccommodation(s)">
          <div slot="after-title">
            {{s.XM}} / {{s.XB}}
            <span class="descInfo">{{s.XH}}</span>
          </div>
          <div slot="inline-desc">
            <div class="zx-status-box">
              <span v-if="!s.IsZX">走读</span>
              <span v-if="s.IsZX">住校</span>
              <group class="zxStatus">
                <x-switch title="" v-model="s.IsZX" @click.stop.native="changeZxStatus(s)"></x-switch>
              </group>
            </div>
            <p v-if="s.IsZX && s.RoomName">房间: {{s.RoomName}}, 床号: {{s.BedNumber}}</p>
          </div>
        </cell>
        <div class="slide" :class="s.showContent?'animateContent':''">
          <checker v-model="s.bedNumber" :default-item-class="'default-checker'" :selected-item-class="'selected-checker'">
            <checker-item @click.native="setStuBedWay(s)" :disabled="r.stuInfo !== null ||
            (s.XB === '女' && selectRoomDetail.SexRange === 1) || (s.XB === '男' && selectRoomDetail.SexRange === 2)"
                          :class="r.stuInfo ? 'disabled-checker' : ''" v-for="(r, ridx) in roomsInfo" :key="ridx" :value="ridx">
              <span>{{ridx + 1}}号床位</span>
              <p class="bedInfo" v-if="r.stuInfo">{{r.stuInfo.XM}}<span v-if="r.stuInfo.XH">({{r.XH}})</span></p>
              <p class="bedInfo" v-if="!r.stuInfo">无学生</p>
            </checker-item>
            <div class="btnBox">
              <x-button mini type="primary" @click.native="saveStuResident(s, sIdx)">保存</x-button>
            </div>
          </checker>
        </div>
      </group>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import siftCondition from './siftStuCondition.vue'
  import Search from 'vux/src/components/search/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import Popup from 'vux/src/components/popup/index.vue'
  import Checker from 'vux/src/components/checker/checker.vue'
  import CheckerItem from 'vux/src/components/checker/checker-item.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XSwitch from 'vux/src/components/x-switch/index.vue'
  export default {
    name: 'arrangeRoom-roomApply',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      siftCondition,
      Group,
      Cell,
      Search,
      PopupPicker,
      Popup,
      Checker,
      CheckerItem,
      XButton,
      XSwitch
    },
    methods: {
      //修改住宿状态
      changeZxStatus (s) {
        var zxStatus;
        if (s.IsZX){
          zxStatus = '走读'
        } else {
          zxStatus = '住校'
        }
        let that = this;
        this.QD.confirm('', '是否将学生住宿状态改为'+zxStatus+'？',
          function(){
            that.setStudentJDFSData(s, s.XH, s.IsZX);
            if (!s.IsZX){ // 如果是改为退宿则关闭安排住宿框
              s.showContent = false
            }
          }, function() {
            s.IsZX = !s.IsZX
          })
      },
      async setStudentJDFSData (stu, xh, isZx) {
        let obj ={isNew: true, xh: xh, isZx: isZx}
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'SetStudentJDFSData',
          objData: JSON.stringify(obj)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取学生数据失败 ${d.msg}`);
          stu.IsZX = !stu.IsZX
          return;
        }
        console.log(d, '设置学生住宿状态')
      },
      // 安排学生寝室
      arrangeStuAccommodation (stu) {
        console.log('安排学生寝室', stu)
        if (!stu.IsZX) {
          this.QD.alert('', stu.XM + '是走读生!');
          return;
        } else {
          if (stu.RoomId && stu.RoomName && stu.BedNumber !== 0){
            this.roomsPosInfo.forEach((item, dormIdx) => {
              item.roomFloorLst.forEach((floorItem, floorIdx) => {
                floorItem.roomInfoLst.forEach((roomItem, roomIdx) => {
                  if (stu.RoomId === roomItem.RoomId && stu.RoomName === roomItem.RoomName){
                    this.selectRoomsPosIdx.dormIdx = dormIdx;
                    this.selectRoomsPosIdx.roomFloorIdx = floorIdx; // 将楼层选择为第一个
                    this.selectRoomsPosIdx.roomInfoIdx = roomIdx; // 将房间选择为第一个
                    let rInfoLst = this.roomsPosInfo[this.selectRoomsPosIdx.dormIdx].roomFloorLst[this.selectRoomsPosIdx.roomFloorIdx].roomInfoLst;
                    this.getRoomResidentInfo(rInfoLst[0].RoomId, rInfoLst[0].detail); // 读取指定房间的住宿信息
                    console.log('找到当前学生所在的楼层以及楼栋', floorItem, item)
                  }
                })
              })
            })
          }
          stu.showContent = !stu.showContent
        }
      },
      // 安排学生寝室的事件
      setStuBedWay (s) {
        console.log(s);
        if ((s.XB === '女' && this.selectRoomDetail.SexRange === 1) || (s.XB === '男' && this.selectRoomDetail.SexRange === 2)) {
          this.QD.alert('', '性别不符, 不能安排');
        }
      },
      // 保存学生的住宿安排
      async saveStuResident (s, sIdx) {
        //console.log('保存学生的住宿安排', s)
        if (!s.IsZX) {
          this.QD.alert('', s.XM + '是走读生!');
          return;
        }
        if (s.bedNumber === '' || s.bedNumber === -1) {
          this.QD.alert('', '请选择床位号!');
          return;
        }
        let bNum = s.bedNumber + 1;
        let rInfo = this.roomsPosInfo[this.selectRoomsPosIdx.dormIdx].roomFloorLst[this.selectRoomsPosIdx.roomFloorIdx].roomInfoLst[this.selectRoomsPosIdx.roomInfoIdx];
        this.loading = true;
        let obj={stuId: s.StuId, isNewStudent: true, roomId: rInfo.RoomId, bedNumber: bNum}
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'SaveStudentResident',
          objData: JSON.stringify(obj)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log('保存失败', d.msg);
          return;
        }
        console.log("save", d);
        this.getRoomResidentInfo(rInfo.RoomId, rInfo.detail); // 读取指定房间的住宿信息
        this.showStuData[sIdx].RoomName = rInfo.RoomName; // 房间
        this.showStuData[sIdx].BedNumber = bNum; // 床号
      },
      // 输入框获取到焦点时触发
      onFocus () {
        this.setShowRoomPopup(); // 设置房间的Popup不出现
      },
      // 根据输入框中的信息出现学生的信息
      getResult (val) {
        this.stuInfoResults = [];
        if (!val) { // 当输入框是空的，显示全部的学生，没有必要筛选学生
          for (let i=0; i<this.stuData.length; i++) {
            let s = this.stuData[i];
            this.stuInfoResults.push({
              title: s.XM + ''+ s.XH +'',
              other: s
            })
          }
          this.showStuData = this.stuData;
          return;
        }
        for (let i=0; i<this.showStuData.length; i++) {
          let s = this.showStuData[i];
          if (s.XM.indexOf(val) !== -1 || s.XH.indexOf(val) !== -1) {
            this.stuInfoResults.push({
              title: s.XM + ''+ s.XH +'',
              other: s
            })
          }
        }
        console.log('on-change', val)
      },
      // 从搜索到的信息中选择学生信息
      selectResult (item) {
        this.showStuData = [];
        this.showStuData.push(item.other);
        console.log("item", item);
      },
      // 得到筛选的信息
      getSelectInfo (e) {
        console.log("sift e=", e);
        this.whereInfo = [{FieldName: 'BD_Class.BJID', Value: e.classId, NeedQuotes: false}];
        this.getStudentsInfo();  // 得到学生信息
        this.getArrangeRooms(e.classId, e.gradeId); // 读取班主任可安排的宿舍
      },
      // 设置房间的Popup不出现
      setShowRoomPopup () {
        this.showRoomPopup = false;
      },
      // 选择宿舍楼
      selectDorm (idx) {
        this.selectRoomsPosIdx.dormIdx = idx;
        this.selectRoomsPosIdx.roomFloorIdx = 0; // 将楼层选择为第一个
        this.selectRoomsPosIdx.roomInfoIdx = 0; // 将房间选择为第一个
        let rInfoLst = this.roomsPosInfo[this.selectRoomsPosIdx.dormIdx].roomFloorLst[this.selectRoomsPosIdx.roomFloorIdx].roomInfoLst;
        this.getRoomResidentInfo(rInfoLst[0].RoomId, rInfoLst[0].detail); // 读取指定房间的住宿信息
      },
      // 选择楼层
      selectRoomFloor (idx) {
        this.selectRoomsPosIdx.roomFloorIdx = idx;
        this.selectRoomsPosIdx.roomInfoIdx = 0; // 将房间选择为第一个
        let rInfoLst = this.roomsPosInfo[this.selectRoomsPosIdx.dormIdx].roomFloorLst[this.selectRoomsPosIdx.roomFloorIdx].roomInfoLst;
        this.getRoomResidentInfo(rInfoLst[0].RoomId, rInfoLst[0].detail); // 读取指定房间的住宿信息
      },
      // 选择具体房间
      selectRoomInfo (idx, s) {
        this.selectRoomsPosIdx.roomInfoIdx = idx;
        this.setShowRoomPopup(); // 设置房间的Popup不出现
        this.getRoomResidentInfo(s.RoomId, s.detail); // 读取指定房间的住宿信息
      },
      // 加载完班级后，获取学生信息
      getStuData (e) {
        this.whereInfo = [{FieldName: 'BD_Class.BJID', Value: e.classId, NeedQuotes: false}];
        this.getStudentsInfo();  // 得到学生信息
        this.getArrangeRooms(e.classId, e.gradeId); // 读取班主任可安排的宿舍
      },
      // 得到学生信息 isNewStudent:true-新生、false-学生 JSON.stringify(this.whereInfo)   '[{"FieldName": "BD_Class.BJID","Value": 942,"NeedQuotes": false}]'
      async getStudentsInfo () {
        let obj = {isnewstudent: true, condition: JSON.stringify(this.whereInfo)};
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassMasterStudents',
          isNewStudent: true,
          objData: JSON.stringify(obj)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          // this.QD.alert(`获取学生数据失败`);
          console.log(`获取学生数据失败 ${d.msg}`);
          return;
        }
        let dlst = JSON.parse(d).data;
        for (let i=0; i<dlst.length; i++) {
          dlst[i].showContent = false; // 默认不展开宿舍信息
          dlst[i].bedNumber = -1; // 开始默认每个学生还未重新安排床位号 bedNumber 不为0
        }
        this.stuData = dlst;
        this.showStuData = dlst;
        this.stuInfoResults = []; // 搜索面板暂时为空-目的清空面板中原来的学生
        this.inputStuName = ''; // 目的清空原来搜索出来的学生姓名
        console.log("stuData", this.stuData, this.showStuData);
      },
      // 读取班主任可安排的宿舍 sexRange 宿舍的适用性别 1-男生，2-女生，0-全部
      async getArrangeRooms (bjid, njid) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClazzMasterArrangableRooms',
          bjid: bjid,
          njid: njid,
          sexRange: 0
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          // this.QD.alert(`获取宿舍数据失败`);
          console.log('获取宿舍数据失败', d.msg);
          return;
        }
        let rInfo = JSON.parse(d).data;
        console.log('0 roomsPosInfo = ', rInfo);
        this.roomsPosInfo = [];
        for (let i=0; i<rInfo.length; i++) {
          let si = rInfo[i];
          let sameDormName = false; // 宿舍楼不相同
          for (let k=0; k<this.roomsPosInfo.length; k++) {
            let sk = this.roomsPosInfo[k];
            if (si.JZMC === sk.dormName) { // 宿舍楼相同
              sameDormName = true;
              let sameFloorName = false; // 楼层不相同
              for (let m=0; m<sk.roomFloorLst.length; m++) {
                let sm = sk.roomFloorLst[m];
                if (si.FloorName === sm.roomFloorName) { // 楼层相同
                  sm.roomInfoLst.push({RoomId: si.RoomId, RoomName: si.RoomName, detail: si}); // // 房间
                  sameFloorName = true;
                  break;
                }
              }
              if (!sameFloorName) { // 当楼层不同，添加新的楼层
                sk.roomFloorLst.push({roomFloorName: si.FloorName, roomFloorSex: si.SexRange, roomInfoLst: [{RoomId: si.RoomId, RoomName: si.RoomName, detail: si}]});
              }
            }
          }
          if (!sameDormName) { // 不同宿舍楼
            // 添加新的宿舍楼
            this.roomsPosInfo.push({
              dormName: si.JZMC, // 宿舍楼
              roomFloorLst: [{
                roomFloorName: si.FloorName, // 楼层
                roomFloorSex: si.SexRange, // 性别
                roomInfoLst: [{RoomId: si.RoomId, RoomName: si.RoomName, detail: si}] // 房间
              }] // 楼层
            });
          }
        }
        console.log('roomsPosInfo = ', this.roomsPosInfo);
        if (this.roomsPosInfo.length >0) {
          // let rs = this.roomsPosInfo[this.selectRoomsPosIdx.dormIdx].roomFloorLst[this.selectRoomsPosIdx.roomFloorIdx].roomInfoLst[this.selectRoomsPosIdx.roomInfoIdx];
          let rs = this.roomsPosInfo[0].roomFloorLst[0].roomInfoLst[0];
          this.getRoomResidentInfo(rs.RoomId, rs.detail); // 读取指定房间的住宿信息
        }
      },
      // 读取指定房间的住宿信息
      async getRoomResidentInfo (roomId, dt) {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetRoomResidentInfo',
          roomId: roomId
        });
        if (d.status && d.status === "error") {
          console.log('获取房间的住宿信息数据失败', d.msg);
          return;
        }
        let rInfo = JSON.parse(d).data;
        console.log('get roomStuInfo = ', rInfo);
        let bedNum = parseInt(dt.BedNum);
        this.roomsInfo = [];
        for (let i=0; i<bedNum; i++) {
          this.roomsInfo.push({stuInfo: null}); // 共bedNum床位
        }
        for (let k=0; k<rInfo.length; k++) {
          let num = rInfo[k].BedNumber;
          this.roomsInfo[num-1].stuInfo = rInfo[k]; // 对应床位号的学生信息
        }
        this.selectRoomDetail = dt; // 选定的具体房间信息  dt.SexRange 1-男生，2-女生 宿舍安排的学生
        console.log('roomsInfo = ', this.roomsInfo);
        console.log('room detail = ', dt);
      },
      // 得到当前教师用户信息
      getTeaUserInfo() {
        this.teaUserInfo = this.QD.getLocalUserinfo().stuObj;
      }
    },
    created () {
      this.getTeaUserInfo();
    },
    data () {
      return {
        loading: false,
        teaUserInfo: null, // 当前教师用户信息
        inputStuName: '', // 输入学生姓名
        stuInfoResults: [], // 搜索出的学生信息结果
        stuData: [], // 学生数据
        showStuData: [], // 显示学生信息
        whereInfo: [], // 学生的查询条件
        roomsPosInfo: [{
          dormName: '', // 宿舍楼
          roomFloorLst: [{
            roomFloorName: '', // 楼层
            roomInfoLst: [] // 房间
          }]
        }],
        selectRoomsPosIdx: {
          dormIdx: 0,
          roomFloorIdx: 0,
          roomInfoIdx: 0
        },
        showRoomPopup: false, // 是否显示房间popup
        selectRoomDetail: null, // 选定的具体房间信息
        roomsInfo: [] // 选定的寝室信息
      }
    }
  }
</script>
<style scoped lang="less">
  .topField{
    position: absolute;
    width: 100%;
  }
  .searchBox{
    position: relative!important;
    top: 0!important;
    z-index: 20;
  }
  .siftConditionBox{
    float: right;
    width: 50%;
  }
  .topField .gp{
    position: relative;
    float: left;
    width: 50%;
    z-index: 10;
  }
  .topField .gp .roomTitle{
    display: inline-block;
    height: 30px;
  }
  .topField .gp .setRoomTitle{
    color: #ea1212;
  }
  .container{
    padding-top: 90px;
    padding-bottom: 20px;
  }
  .container .gp{
    margin-top: -16px;
  }
  .descInfo{
    font-size: 14px;
    color: #666;
  }
  .slide{
    padding: 0 20px;
    overflow: hidden;
    max-height: 0;
    -webkit-transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
    transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
  }
  .animateContent{
    max-height: 9999px;
    -webkit-transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
    -webkit-transition-delay: 0s;
    transition-delay: 0s;
  }
  /* 房间popup */
  .roomPopupBox{
    position: fixed;
    top: 140px;
    left: 0;
    right: 0;
    height: 300px;
    background-color: #ffffff;
    z-index: 501;
  }
  .roomInfoBox{
    overflow: hidden;
  }
  .roomInfoBox .left{
    float: left;
    height: 300px;
    border-right: 1px solid #e9e9e9;
  }
  .roomInfoBox .lf1{
    width: 25%;
  }
  .roomInfoBox .lf3,
  .roomInfoBox .lf2{
    width: 37%;
  }
  .roomInfoBox .left .title{
    background-color: #ffffff;
  }
  .roomInfoBox .left .scrollbar{
    height: 255px;
    overflow-y: auto;
  }
  .roomInfoBox .left a{
    display: inline-block;
    width: 100%;
    text-align: left;
    padding: 12px 8px;
    border-bottom: 1px solid #e9e9e9;
    font-size: 14px;
    color: #333;
    box-sizing: border-box;
    word-wrap: break-word;
  }
  .roomInfoBox .lf2 a{
    background-color: #f2f2f2;
  }
  .roomInfoBox .lf3 a{
    background-color: #f2f2f2;
  }
  .roomInfoBox .lf3>div>a{
    padding: 13px 8px;
    font-size: 12px;
  }
  /* 选择有关房间的信息 */
  .roomInfoBox .left .selectRelateRoomInfo {
    color: #ea1212;
    background-color: #f3d1d1;
  }
  /*.roomInfoBox .left .scrollbar::-webkit-scrollbar {
    display: none;
  }*/
  /* 床位号 start */
  .default-checker{
    width: 46%;
    margin-left: 2%;
    margin-bottom: 20px;
    padding: 4px 10px;
    color: #333333;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    box-sizing: border-box;
  }
  .disabled-checker{
    background-color: #ebeaea;
  }
  .selected-checker{
    background: #ffffff url(../../assets/images/selected_checker.png) no-repeat right bottom;
    border-color: #ff4a00;
  }
  .bedInfo{
    font-size: 12px;
    color: #666;
    word-wrap: break-word;
  }
  /* 床位号 end */
  .btnBox{
    margin-bottom: 20px;
    text-align: center;
  }

  /*开关*/
  .zx-status-box{
    margin-bottom:8px;
    >p{
      display: inline-block;
      .stu-zx-status-icon{
        vertical-align: middle;
      }
    }
    .zxStatus{
      position:relative;
      top:4px;
      display: inline-block;
    }
  }

</style>
<style>
  .arrangeRoomApply .weui-cells.vux-search_show{
    height: 100%;
  }
  /* 房间 标题 */
  .arrangeRoomApply .topField .gp .weui-cells{
    margin-top: 0;
    border-right: 1px solid #D9D9D9;
  }
  /*搜索中的字的位置设置*/
  .arrangeRoomApply .weui-search-bar__label{
    line-height: 22px;
  }
  /*住校状态*/
  .arrangeRoomApply .zxStatus .weui-cell__ft:after,
  .arrangeRoomApply .zxStatus .weui-cells:before,
  .arrangeRoomApply .zxStatus .weui-cells:after{
    display: none;
  }
  .arrangeRoomApply .zxStatus .weui-cells{
    margin-top: 0;
  }
  .arrangeRoomApply .zxStatus .vux-x-switch.weui-cell_switch{
    padding:0;
  }
  .arrangeRoomApply .zxStatus .weui-switch, .weui-switch-cp__box{
       height: 24px;
       width:40px;
       /*border-color: #ffe26d;*/
       /*background-color: #ffe26d;*/
     }
  .arrangeRoomApply .zxStatus .weui-switch:after, .weui-switch-cp__box:after{
    height: 20px;
    width:20px;
  }
  .arrangeRoomApply .zxStatus .weui-switch:before, .weui-switch-cp__box:before{
    width:0;
  }
</style>
