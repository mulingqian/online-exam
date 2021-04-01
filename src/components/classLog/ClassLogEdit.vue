<template>
  <div class="classLogEdit">
    <div class="container-field">
      <div v-transfer-dom>
        <loading v-model="loading"></loading>
      </div>
      <div class="logEdit-title">
        <span>教师：{{logEditTeacher}}<span style="padding-left: 10px;">课程：{{logEditKCMC}}</span></span>
        <br/>
        <span>班级：{{logEditBJMCs}}<span style="padding-left: 10px;">人数：{{stuNum}}</span></span>
      </div>
      <div class="logEdit-date">
        <!--<span>今天：{{currentDate}}</span>-->
        <span>{{logEditTeachDay}}</span>
      </div>
      <div class="logInstruction">
        <span>
          <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #999999;">&#xe60e;</span><span style="font-size: 12px;">正常</span>
        </span>
        <span>
          <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #ff0000;">&#xe604;</span><span style="font-size: 12px;">迟到</span>
        </span>
        <span>
          <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #ff760c;">&#xe604;</span><span style="font-size: 12px;">早退</span>
        </span>
        <span>
          <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #ff2c95;">&#xe604;</span><span style="font-size: 12px;">旷课</span>
        </span>
        <span>
          <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #348038;">&#xe604;</span><span style="font-size: 12px;">事假</span>
        </span>
        <span>
          <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #4245ff;">&#xe604;</span><span style="font-size: 12px;">病假</span>
        </span>
      </div>
      <div class="classLogStuLst" style="padding-bottom: 70px;">
        <div style="margin-top: 10px;margin-bottom: 10px;">
          <span class="teaHall">教师讲台</span>
        </div>
        <ul class="stuolumn">
          <li><a></a></li>
          <li v-for="n in 8">
            <a>{{n}}</a>
          </li>
        </ul>
        <ul v-if="newLogStuLst !== null">
          <li v-for="(s, sIdx) in newLogStuLst" :key="sIdx">
            <a v-if="s.type===1"
               v-model="showHideOnBlur"
               @click="isShowStuBlur(s.XM,s.XH,sIdx)"
               :class="s.XH === logInstruXH[sIdx] ? 'logInstruType' + logInstruType[sIdx] : ''">{{s.XM}}<br/>{{s.XH.substr(s.XH.length-2, 2)}}</a>
            <span v-if="s.type===0">{{s.columnIdw}}</span>
          </li>
        </ul>
      </div>

      <!--点击姓名弹出框内的信息-->
      <div v-transfer-dom>
        <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
          <div class="stu-box" style="overflow: hidden;">
            <div style="padding-top: 10px;padding-left: 10px;
          padding-bottom: 8px;font-size: 16px;line-height: 20px;border-bottom: 1px solid #e5e5e5;text-align: left;overflow: hidden;">
              <span>{{logEditBJMCs}}</span>
              <span>第{{logEditWeekIndex}}周</span>
              <span>第{{logEditNodes}}节</span>
              <span @click="showHideOnBlur=false" style="float: right;background-color: #f2f2f2;margin-right: 4px;">
              <span class="classLogVux-close" style="position: relative;display: inline-block;vertical-align: middle;color: #999;width: 24px;height: 24px;"></span>
            </span>
            </div>
            <div style="float: left;width: 60%;margin-top: 15px;">
            <span class="school-wx-icon stu-icon" slot="icon"
                  style="margin-top: 15px;color:#f0ad4e;font-size: 80px;padding-right: 0;">&#xe612;</span>
              <div style="font-size: 14px;line-height: 20px;text-align: left;margin-left: 10px;">
                <span>姓名：{{logXM}}</span><br/>
                <span>学号：{{logXH}}</span>
              </div>
            </div>
            <div style="float: right;width: 30%;text-align: right;line-height: 30px;padding-right: 20px;">
              <div @click="logInstru(-1)">
                <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #999999;">&#xe60e;</span><span style="font-size: 14px;">正常</span>
              </div>
              <div @click="logInstru(2)">
                <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #ff0000;">&#xe604;</span><span style="font-size: 14px;">迟到</span>
              </div>
              <div @click="logInstru(4)">
                <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #ff760c;">&#xe604;</span><span style="font-size: 14px;">早退</span>
              </div>
              <div @click="logInstru(8)">
                <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #ff2c95;">&#xe604;</span><span style="font-size: 14px;">旷课</span>
              </div>
              <div @click="logInstru(16)">
                <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #348038;">&#xe604;</span><span style="font-size: 14px;">事假</span>
              </div>
              <div @click="logInstru(32)">
                <span class="school-wx-icon" slot="icon" style="padding-right: 0;color: #4245ff;">&#xe604;</span><span style="font-size: 14px;">病假</span>
              </div>
            </div>
          </div>
        </x-dialog>
      </div>

      <footer>
        <div class="classLogResult">
          <span>人数 {{stuNum}}</span>
          <span>迟到</span><span>{{stuLateNum}}</span>
          <span>早退</span><span>{{stuLeaveEarlyNum}}</span>
          <span>旷课</span><span>{{stuAbsentNum}}</span>
          <span>事假</span><span>{{stuPrivateAffairNum}}</span>
          <span>病假</span><span>{{stuSickNum}}</span>
        </div>
        <div class="logSubmit" @click="classLogSubmit()"><a>保存</a></div>
      </footer>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import XDialog from 'vux/src/components/x-dialog/index.vue'
  import Grid from 'vux/src/components/grid/grid.vue'
  import GridItem from 'vux/src/components/grid/grid-item.vue'

  export default {
    name: 'classLogEdit',
    directives: {
      TransferDom
    },
    components: {
      Grid,
      GridItem,
      XDialog,
      Loading
    },
    methods: {
        // 提交
      async classLogSubmit () {
          /*ps="JXBID={0}&amp;Nodes={1}&amp;ListCategory={2}"*/
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'InsertStuentAttendanceData',
          JXBID: this.logEditJXBID,
          Nodes: this.logEditNodes,
          TeachDay: this.logEditTeachDay,
          ResultList: JSON.stringify(this.listCategory)
        });
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        if (d !== null) {
          if (parseInt(d) <= 0) {
            if (d === -1) {
              this.QD.alert('', '无法获取当前教师的信息！');
            } else if (d === -2) {
              this.QD.alert('', '无法获取当前登记教师的信息！');
            } else if (d === -3) {
              this.QD.alert('', '无法获取教学班信息！');
            } else {
              this.QD.alert('', '学生考勤保存失败！');
            }
          } else if (parseInt(d) > 0) {
            this.QD.alert('', '学生考勤保存成功！');
          } else {
            this.QD.alert('', '学生考勤保存失败！');
          }
        }
      },
        // 点击学生姓名显示弹框
      isShowStuBlur (xm, xh, i) {
        this.logXM = xm;
        this.logXH = xh;
        this.logXHIndex = i;
        this.showHideOnBlur = true;
      },
      /*计算考勤人数状态*/
      getLogEditNum () {
        let types = [0, 0, 0, 0, 0];
        this.listCategory = [];
        for (let i = 0; i < this.logInstruType.length; i++){
          let n = this.logInstruType[i];
          switch (n) {
            case 2:
              types[0]++;
              /*listCategory赋值*/
              this.listCategory.push({
                Category: 2,
                StuNum: types[0],
                StuRemark: this.logInstruXH[i]
              });
              break;
            case 4:
              types[1]++;
              this.listCategory.push({
                Category: 4,
                StuNum: types[1],
                StuRemark: this.logInstruXH[i]
              });
              break;
            case 8:
              types[2]++;
              this.listCategory.push({
                Category: 8,
                StuNum: types[2],
                StuRemark: this.logInstruXH[i]
              });
              break;
            case 16:
              types[3]++;
              this.listCategory.push({
                Category: 16,
                StuNum: types[3],
                StuRemark: this.logInstruXH[i]
              });
              break;
            case 32:
              types[4]++;
              this.listCategory.push({
                Category: 32,
                StuNum: types[4],
                StuRemark: this.logInstruXH[i]
              });
              break;
          }
          this.stuLateNum = types[0];
          this.stuLeaveEarlyNum = types[1];
          this.stuAbsentNum = types[2];
          this.stuPrivateAffairNum = types[3];
          this.stuSickNum = types[4];
        }
      },
      // 选择学生课堂考勤状态
      logInstru (type) {
        this.logInstruType[this.logXHIndex] = type;
        this.logInstruXH[this.logXHIndex] = this.logXH;
        this.getLogEditNum();
        this.showHideOnBlur = false; // 关闭弹出框
      },
      // 根据教学班ID查询学生列表和考勤信息
      async getStudentListDataByClaId () {
        let d;
        d = await this.QD.getData('/ComApi/PostObject', { apiName: 'GetStudentListDataByCondition', claId: this.logEditJXBID, teachDay: this.logEditTeachDay, nodes: this.logEditNodes, isOrderByXH: true });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          this.newLogStuLst = [];
          return;
        }
        /*sessionStorage.clear();*/// 清除sessionStorage中的数据
        this.logStudentLstData = d;
        if (this.logStudentLstData.length === 0) {
          return;
        }
        console.log("getStudentList", this.logStudentLstData);
        this.stuNum = this.logStudentLstData[0].SJRS; // 学生总人数
        let s = this.logStudentLstData;
        let columnIdx =1;
        /*type=1，代表是学生；type=0,代表是开头的数字*/
        for (let i=0; i < s.length; i++){
          if (i % 8 === 0){
            this.newLogStuLst.push({
              XM: '',
              XH: '',
              Category: 0,
              columnIdw: columnIdx++,
              type: 0
            });
          }
          this.newLogStuLst.push({
            XM: s[i].XM,
            XH: s[i].XH,
            Category: s[i].Category,
            columnIdw: columnIdx,
            type: 1
          });
        }
        for (let i in this.newLogStuLst) {
          // 初始化的时候判断学生考勤状况
          if (this.newLogStuLst[i].Category !== 0) {
            this.logInstruType[i] = this.newLogStuLst[i].Category;
            this.logInstruXH[i] = this.newLogStuLst[i].XH;
            // console.log("stu", i, this.newLogStuLst[i].XM, this.newLogStuLst[i].Category);
            this.getLogEditNum();
          }
        }
        // 清除sessionStorage中的数据
        sessionStorage.removeItem("logEditKCMC");
        sessionStorage.removeItem("logEditBJMCs");
        sessionStorage.removeItem("logEditTeacher");
        sessionStorage.removeItem("logEditNodes");
        sessionStorage.removeItem("logEditJXBID");
        sessionStorage.removeItem("logEditTeachDay");
      },
      // 得到从课堂日志中存入sessionStorage中的数据 和获取当前的时间
      getLogSessStorage () {
        if (sessionStorage.getItem("logEditJXBID") !== null){
          this.logEditKCMC = sessionStorage.getItem("logEditKCMC"); // 课程名称
          this.logEditBJMCs = sessionStorage.getItem("logEditBJMCs"); // 班级名称
          this.logEditTeacher = sessionStorage.getItem("logEditTeacher"); // 教师姓名
          this.logEditNodes = sessionStorage.getItem("logEditNodes"); // 第几节课
          this.logEditWeekIndex = sessionStorage.getItem("logEditWeekIndex"); // 第几周
          this.logEditJXBID = parseInt(sessionStorage.getItem("logEditJXBID")); // 教学班id
          this.logEditTeachDay = sessionStorage.getItem("logEditTeachDay"); // 课堂日期
          // 根据教学班ID查询学生列表和考勤信息
          this.getStudentListDataByClaId();
        }
        // 获取当前的时间
        let date = new Date();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let Hours = date.getHours();
        let Minutes = date.getMinutes();
        if (Hours >= 0 && Hours <= 9) {
          Hours = "0" + Hours;
        }
        if (Minutes >= 0 && Minutes <= 9) {
          Minutes = "0" + Minutes;
        }
        this.currentDate = month + '月' + strDate + '日' + " " + Hours + ":" + Minutes;
      }
    },
    created () {
      this.getLogSessStorage(); // 得到从课堂日志中存入sessionStorage中的数据
    },
    data () {
      return {
        loading: true,
        logStudentLstData: [], // 学生列表和考勤信息
        logEditKCMC: '',
        logEditBJMCs: '',
        logEditTeacher: '',
        logEditNodes: '',
        logEditWeekIndex: 0,
        logEditJXBID: -1, // 教学班id
        logEditTeachDay: '', // 课堂日期
        currentDate: '', // 当前时间
        newLogStuLst: [], // 学生列表
        stuNum: 0, // 学生总人数
        showHideOnBlur: false,
        logXM: '', // 每个学生的姓名
        logXH: '', // 每个学生的学号
        logXHIndex: -1, // 点击学生姓名得到学生的index
        logInstruType: [], // 学生考勤状态
        logInstruXH: [], // 学生学号
        stuLateNum: 0, // 学生迟到人数
        stuLeaveEarlyNum: 0, // 学生早退人数
        stuAbsentNum: 0, // 学生旷课人数
        stuPrivateAffairNum: 0, // 学生事假人数
        stuSickNum: 0, // 学生病假人数 /*迟到=2,早退=4,旷课=8,事假=16,病假=32(int)*/
        recordSeleXH: [], // 记录选择学生的学号
        listCategory: [] // Category(Int)考勤类型迟到=2,早退=4,旷课=8,事假=16,病假=32S,tuNum(Int)考勤异常的学生数StuRemark,异常学生学号集合如：学号1,学号2, 学号3,此学生数与Category一一对应
      }
    }
  }
</script>
<style scoped>
  .container-field{
    position: relative;
    width: 100%;
  }
</style>
<style>
  .classLogEdit .logEdit-title{
    padding: 10px 15px;
    font-size: 16px;
    line-height: 18px;
  }
  .classLogEdit .logEdit-title span{
    display: inline-block;
  }
  .classLogEdit .logEdit-date{
    margin-bottom: 4px;
    padding: 4px 15px;
    line-height: 18px;
    border-bottom: 1px solid #e5e5e5;
  }
  .classLogEdit .logEdit-date span{
    font-size: 12px;
    color: #666666;
  }
  .classLogEdit .xs-container{
    margin-top:0;
  }
  .classLogEdit .classLogStuLst ul{
    margin-bottom: 10px;
    margin-top: 10px;
    list-style: none;
    overflow: hidden;
  }
  .classLogEdit .classLogStuLst ul li{
    float: left;
    width: 11.1111%;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    color: #333333;
  }
  .classLogEdit .classLogStuLst ul li a{
    display: inline-block;
    height: 50px;
  }
  .classLogEdit .classLogStuLst ul li span{
    display: inline-block;
    height: 50px;
    width: 100%;
  }
  .classLogEdit .classLogStuLst .stuolumn li a{
    display: inline-block;
    height: 20px;
  }
  .classLogEdit .classLogStuLst .teaHall{
    display: block;
    width: 88.11%;
    margin-left:11.11%;
    text-align: center;
    color: #333333;
    font-size: 14px;
    padding-top: 4px;
    padding-bottom: 4px;
    background-color: #999999;
  }
  .classLogEdit .logInstruction{
    margin-bottom: 4px;
    padding: 4px 15px;
  }
  .classLogEdit .classLogStuLst ul li .logInstruType-1{
    color: #000000;
  }
  .classLogEdit .classLogStuLst ul li .logInstruType2{
    color: #ff0000;
  }
  .classLogEdit .classLogStuLst ul li .logInstruType4{
    color: #ff760c;
  }
  .classLogEdit .classLogStuLst ul li .logInstruType8{
    color: #ff2c95;
  }
  .classLogEdit .classLogStuLst ul li .logInstruType16{
    color: #348038;
  }
  .classLogEdit .classLogStuLst ul li .logInstruType32{
    color: #4245ff;
  }
  .classLogEdit footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
  }
  .classLogEdit footer .classLogResult{
    padding-left: 15px;
  }
  .classLogEdit footer .classLogResult span{
    font-size: 14px;
    color: #666666;
  }
  .classLogEdit footer .logSubmit{
    margin-top: 10px;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  .classLogEdit footer .logSubmit a{
    display: inline-block;
    padding: 12px 10px;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
  /*弹出框样式start*/
  .classLogVux-close:before,
  .classLogVux-close:after{
    content: '';
    position: absolute;
    left: 0;
    top: 11px;
    width: 24px;
    height: 1px;
    background-color: currentColor;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .classLogVux-close:after {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  /*弹出框样式end*/
</style>
