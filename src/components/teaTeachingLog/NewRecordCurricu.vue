<template>
  <div class="record-curriculum">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <tab>
      <tab-item v-if="typeLists.length > 0" :selected="tIndex === 0" v-for="(r, tIndex) in typeLists" @on-item-click="selectTypeVal(r)" :key="tIndex">{{r}}</tab-item>
      <tab-item v-if="typeLists.length < 1">无登记内容</tab-item>
    </tab>
    <group v-if="curricData" class="gp">
      <cell>
        <span slot="after-title">课程日期</span>
        <span>{{curricData.PkDay}}</span>
      </cell>
      <cell>
        <span slot="after-title">课程名称</span>
        <span>{{curricData.kcmc}}</span>
      </cell>
      <cell>
        <span slot="after-title">节次</span>
        <span v-for="(node, idx) in nodeIdxLst" :key="idx"><a v-if="idx>0">,</a>{{node}}</span>
      </cell>
      <!-- 老师打分 start -->
      <div v-if="operateScore && registerType === titleNameLst[2]" style="background-color: #f2f2f2;" class="gap">
        <cell style="padding: 0;"></cell> <!--确保卷子上面有线-->
        <div class="eachsub" v-for="(s, sidx) in operateScore" :key="sidx">
          <label class="subjHead">{{s.itemname}}</label>
          <template v-if="s.itemtype === 1">
            <checklist :max="1" :options="s.option" v-model="s.modelName" @on-change="setOperateScore(s)"></checklist>
          </template>
          <template v-if="s.itemtype === 2">
            <x-input  v-model="s.itemresult" placeholder="请填写" @on-change="setInputScore(s)"></x-input>
          </template>
        </div>
      </div>
      <!-- 老师打分 upScore end -->
    </group>
    <!-- 学生考勤 - 学生列表 start-->
    <div v-if="registerType === titleNameLst[0]" class="gap">
      <status-log :kqoptions="kqoptions"
                  :newLogStuLst="newLogStuLst"
                  :logInstruXH="logInstruXH"
                  :stuSJRS="stuSJRS"
                  :logInstruType="logInstruType"
                  :stuCourseInfo="stuCourseInfo"
                  :registerType="registerType"
                  :typeLists="typeLists"
                  ref="statusLog"
                  @kqStatusPerson="saveResults"></status-log>
    </div>
    <!-- 学生考勤 - 学生列表 end -->
    <!-- 课堂纪律 学生列表 start -->
    <div v-if="registerType === titleNameLst[1]" class="gap">
      <status-log :ktjloptions="ktjloptions"
                  :logInstruXH="logInstruXH"
                  :newLogStuLst="newLogStuLst"
                  :chooseType="chooseType"
                  :stuSJRS="stuSJRS"
                  :registerType="registerType"
                  :typeLists="typeLists"
                  :stuCourseInfo="stuCourseInfo"
                  ref="statusLog1"
                  @ktjlStatusPerson="saveResults"></status-log>
    </div>
    <!-- 课堂纪律 学生列表 end -->
    <!--保存按钮-->
    <div class="btn-box">
      <x-button type="primary" mini class="sub-but" @click.native="getStudentAttStatus">保 存</x-button>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Badge from 'vux/src/components/badge/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  import Checklist from 'vux/src/components/checklist/index.vue'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import StatusLog from '../common/StatusLog.vue'
  export default {
    name: "teaTeachingLog-recordCurricu",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      Badge,
      XButton,
      XInput,
      Checklist,
      Tab,
      TabItem,
      StatusLog
    },
    data () {
      return {
        loading: false,
        kqList: [], //考勤的最新数据
        ktjlList: [], //课堂纪律的最新数据
        chooseType: [], // 学生课堂纪律状态
        operateScore: [], // 页面渲染教师打分题
        registerType: '', // 登记内容,如:学生考勤，课堂纪律，老师打分
        titleNameLst: ['学生考勤', '课堂纪律', '老师打分'], // 配置的标题名称默认值
        typeLists: [], // 教学日志登记内容
        isCanSubmit: 0, // 0-未提交，1-已提交，4-被退回, 0和4代表可以提交，1代表不可以提交
        curricData: null, // 课表相关数据
        saveTeaData: [], // 保存老师打分的数据
        userZGH: '', // 当前用户教师的职工号
        nodeIdxLst: [], // 课程节次集合
        kqoptions: [], // 考勤项
        ktjloptions: [], //课堂纪律项
        stuLst: null, // 学生信息--渲染页面中的学生数据
        stuSJRS: 0, //学生总人数
        newLogStuLst: [], // 学生列表
        logInstruType: [], // 学生考勤状态
        logInstruXH: [], // 学生学号
        stuCourseInfo: {}, // 点击学生的课程的信息
        isSaveSuccess: {xskq: true, ktjl: true, teaScore: true} // 保存是否成功-默认学生考勤、课堂纪律、教师打分保存成功
      }
    },
    created () {
      // 得到课表中的相关数据
      this.getCurriculumData();
    },
    methods: {
      //从子组件中获取最新的学生考勤、课堂纪律的情况
      saveResults(val){
        if (this.registerType === this.titleNameLst[0]){
          this.kqList=val
        } else if (this.registerType === this.titleNameLst[1]){
          this.ktjlList=val
        }
      },
      // 得到配置的标题名称
      getTitleInfo () {
        if (this.QD.teachingLogTeaTitleLst) {
          this.titleNameLst = this.QD.teachingLogTeaTitleLst;
        }
      },
      // 选择登记内容
      selectTypeVal (type) {
        this.registerType = type;
      },
      // 得到课表中的相关数据
      getCurriculumData() {
        this.getTitleInfo(); // 得到配置的标题名称
        this.userZGH = this.QD.getLocalUserinfo().stuObj.ZGH; // 当前用户教师的职工号
        if (this.QD.currPgToOtherPg) { // 数据不为空（课程名称、课程日期等）
          this.curricData = this.QD.currPgToOtherPg;
          let nodes = ''
          for (let i = 0; i < this.curricData.span; i++) { //获取课程节次集合
            let node = i + this.curricData.nodeIndex;
            this.nodeIdxLst.push(node);
            nodes += node.toString() + ','
          }
          //删除节次字符串的最后一个字符逗号
          nodes = nodes.substr(0, nodes.length - 1);
          this.stuCourseInfo.weekIndex = this.$route.params.weekIndex //获取周次
          this.stuCourseInfo.kcmc = this.curricData.kcmc //获取班级名称
          this.stuCourseInfo.nodeIdxStr = nodes //获取第几节课
        } else {
          this.QD.alert('', '请先选择课程');
          this.$router.go(-1);
          return;
        }
        // 判断教学日志中的学生考勤显示在哪个用户类型下和获取学生考勤的选项内容
        this.getStuAttenRelaData();
      },
      // 判断教学日志中的学生考勤显示在哪个用户类型下和获取学生考勤的选项内容
      async getStuAttenRelaData () {
        // this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuAttendanceContents'
        });
        // this.loading = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
        }
        if (d.type === 1) { // 1代表老师显示
          this.typeLists.push(this.titleNameLst[0]);// 教学日志登记内容
          this.kqoptions = d.contents; // 考勤项
        }
        // 判断教学日志中的课堂纪律显示在哪个用户类型下和获取课堂纪律的选项内容
        this.getClassDiscipline();
      },
      // 判断教学日志中的课堂纪律显示在哪个用户类型下和获取课堂纪律的选项内容
      async getClassDiscipline() {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassDiscipline'
        });
        if (d.status && d.status === "error") {
          console.log(d.msg);
        }
        if (d.type === 1) { // 1代表老师显示
          this.typeLists.push(this.titleNameLst[1]);// 教学日志登记内容
          this.ktjloptions = d.contents; // 课堂纪律项
        }
        // 教师是否登记教学日志中的老师打分 roleType-1代表老师用户
        this.getTeachSubScore();
      },
      // 教师是否登记教学日志中的老师打分 roleType-1代表老师用户
      async getTeachSubScore() {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetTeachSubScore',
          roleType: 1,
          semid: this.curricData.xqid,
          pkDay: this.curricData.PkDay,
          jxbid: this.curricData.jxbid,
          teachNode: this.nodeIdxLst.toString(),
          code: this.userZGH
        });
        if (d.type === 1) { // 1代表老师
          this.typeLists.push(this.titleNameLst[2]);// 教学日志登记内容
          let r = d.contents;
          for (let i in r) {
            let op = []; // 选项赋值为空
            let p = r[i].option; // 每题选项
            let modelName = [];
            for (let j in p) {
              if (p[j].optid.toString() === r[i].itemresult) {
                modelName[0] = p[j].optname;
              }
              op.push({
                optid: p[j].optid,
                value: p[j].optname,
                key: p[j].optname,
                scorevalue: p[j].scorevalue,
                optorder: p[j].optorder
              });
            }
            this.operateScore.push({
              itemtype: r[i].itemtype, // 题型
              itemname: r[i].itemname, // 题目
              itemid: r[i].itemid,
              itemresult: r[i].itemresult, // 作答结果 -选择题id, 填空题文本文字
              modelName: modelName, // 作答结果绑定的值
              scorevalue: r[i].scorevalue,
              option: op //选项
            });
          }
        }
        if (this.typeLists.length > 0) {
          this.registerType = this.typeLists[0]; // 教学日志登记内容的第一项显示
          if (this.typeLists[0] === this.titleNameLst[0] || this.typeLists[0] === this.titleNameLst[1]) {
            this.getStuLstByJxb(); // 根据教学班id 获取学生数据
          }
        }
      },
      // 根据教学班id 获取学生数据
      async getStuLstByJxb () {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStudentListDataByClaIdOrderByXH',
          claId: this.curricData.jxbid,
          teachDay: this.curricData.PkDay,
          isOrderByXH: true
        });
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          this.newLogStuLst = [];
          return;
        }
        this.stuLst = d;
        if (d.length === 0) {
          return;
        }
        let columnIdx = 1
        let kqNums=[]
        // 初始化各种考勤状态的总人数，默认为0
        for (let i in this.kqoptions){
          kqNums.push({
            type: this.kqoptions[i].value,
            nums: 0
          })
        }
        for (let i = 0; i < this.stuLst.length; i++) {
          for (let j in kqNums){
            //获取各个考勤状态的人数
            if (this.stuLst[i].Category===kqNums[j].type){
              kqNums[j].nums++
            }
            //向考勤项数组增加一个考勤人数的属性并赋值
            for (let m in this.kqoptions){
              if (this.kqoptions[m].value===kqNums[j].type){
                this.kqoptions[m].nums=kqNums[j].nums
              }
            }
          }
          this.stuSJRS = this.stuLst[i].SJRS//获取班级的总人数
          /*type=1，代表是学生；type=0,代表是开头的数字*/
          if (i % 8 === 0) {
            this.newLogStuLst.push({
              XM: '',
              XH: '',
              Category: 0,
              columnIdw: columnIdx++,
              type: 0
            });
          }
          this.newLogStuLst.push({
            XM: this.stuLst[i].XM,
            XH: this.stuLst[i].XH,
            Category: this.stuLst[i].Category,
            columnIdw: 0,
            type: 1
          });
        }
        console.log("this.newLogStuLst", this.newLogStuLst)
        for (let i = 0; i < this.newLogStuLst.length; i++) {
          // 初始化的时候判断学生考勤状况
          if (this.newLogStuLst[i].Category !== 0) {
            this.logInstruType[i] = this.newLogStuLst[i].Category;
            this.logInstruXH[i] = this.newLogStuLst[i].XH; //学生学号
          }
        }
        for (let i in this.typeLists) {
          if (this.typeLists[i] === this.titleNameLst[1]) {
            // 课堂纪律-根据学期id,日期，班级id,上课节次获取班级内每个学生的课堂纪律情况 {semid}/{pkDay}/{jxbid}/{nodeIndex}
            this.getStudentClassDiscipline();
            break;
          }
        }
      },
      // 课堂纪律-根据学期id,日期，班级id,上课节次获取班级内每个学生的课堂纪律情况
      async getStudentClassDiscipline() {
        this.loading = true;
        let data = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStudentClassDiscipline',
          semid: this.curricData.xqid,
          pkDay: this.curricData.PkDay,
          jxbid: this.curricData.jxbid,
          teachNode: this.nodeIdxLst.toString(),
          nodeIndex: this.nodeIdxLst.toString(),
          zgh: this.userZGH
        });
        this.loading = false;
        if (data.status && data.status === "error") {
          console.log(data.msg);
        }
        let ktjlNums=[]
        // 初始化各种课堂纪律状态的总人数，默认为0
        for (let i in this.ktjloptions) {
          ktjlNums.push({
            type: this.ktjloptions[i].itemid,
            nums: 0
          })
          this.ktjloptions[i].nums=0
        }
        // 获取学生的课堂纪律情况
        for (let i in this.newLogStuLst){
          this.newLogStuLst[i].Ops=[]
          for (let d in data){
            if (data[d].stuid !== 0){
              if (data[d].xh === this.newLogStuLst[i].XH){
                this.newLogStuLst[i].Ops=data[d].item
              }
            }
          }
        }
        //获取学生学号、课堂纪律状态、各个课堂纪律状态的人数
        if (data.length!==0) {
          for (let i in this.newLogStuLst){
            this.logInstruXH[i] = this.newLogStuLst[i].XH;//学生学号
            for (let j in this.newLogStuLst[i].Ops){
              this.chooseType[i]=this.newLogStuLst[i].Ops[j].itemid//课堂纪律状态
              for (let m in ktjlNums){
                //获取各个课堂纪律状态的人数
                if (this.newLogStuLst[i].Ops[j].itemid === ktjlNums[m].type){
                  ktjlNums[m].nums++
                }
                //向考勤项数组增加一个考勤人数的属性并赋值
                for (let k in this.ktjloptions){
                  if (this.ktjloptions[k].itemid===ktjlNums[m].type){
                    this.ktjloptions[k].nums=ktjlNums[m].nums
                  }
                }
              }
            }
          }
        }
      },
      // 老师打分--选择题 操作
      setOperateScore (r) {
        console.log('setOperateScore', r);
        for (let i in this.saveTeaData) { // 此时操作的题目存在之前保存数据的题目中，将保存数据中的记录删除
          if (this.saveTeaData[i].ItemId === r.itemid) {
            this.saveTeaData.splice(i, 1);
            break;
          }
        }
        if (r.modelName.length === 0) {
          return; // 当前题目没有选择任何答案
        }
        let optid; // 选项对应的optid
        let itemscore; // 选项对应的分值
        // 找到选型对应的optid
        for (let k in r.option) {
          if (r.option[k].value === r.modelName[0]) {
            optid = r.option[k].optid;
            itemscore = r.option[k].scorevalue;
            break;
          }
        }
        this.saveTeaData.push({ // 当前题目选择完毕后，将选中的记录保存在saveTeaData记录内
          ItemId: r.itemid,
          ItemType: r.itemtype,
          ItemName: r.itemname,
          ItemResult: optid.toString(),
          ItemScore: itemscore,
          XH: '',
          NodeNames: this.nodeIdxLst.toString()
        });
        console.log('saveTeaData 1', this.saveTeaData);
      },
      //  老师打分- 填空题 操作
      setInputScore (r) {
        for (let i in this.saveTeaData) { // 此时操作的题目存在之前保存数据的题目中，将保存数据中的记录删除
          if (this.saveTeaData[i].ItemId === r.itemid) {
            this.saveTeaData.splice(i, 1);
            break;
          }
        }
        // console.log('input', r, r.itemresult);
        this.saveTeaData.push({ // 当前题目选择完毕后，将选中的记录保存在saveTeaData记录内
          ItemId: r.itemid,
          ItemType: r.itemtype,
          ItemName: r.itemname,
          ItemResult: r.itemresult,
          ItemScore: 0,
          XH: '',
          NodeNames: this.nodeIdxLst.toString()
        });
      },
      // 上传学生考勤数据
      async upKqData(val){
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'InsertStudentAttendanceData',
          XQMC: '',
          KCMC: '',
          Times: '',
          Teacher: '',
          Category: '',
          TeachDay: this.curricData.PkDay,
          CategoryName: '',
          BJMCs: '',
          JSMC: '',
          SJRS: '',
          Nodes: this.nodeIdxLst.toString(),
          ListCategory: '',
          JXBID: this.curricData.jxbid,
          XH: '',
          XM: '',
          ResultList: JSON.stringify(val),
          CreatorType: 1,
          Code: this.userZGH
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log("考勤数据保存失败", d.msg);
          this.isSaveSuccess.xskq= false
          this.saveKqGoto(); // 保存考勤之后继续操作
          return;
        }
//        console.log('学生考勤', d);
        if (d>0) {
          this.isSaveSuccess.xskq = true;
        } else {
          this.isSaveSuccess.xskq = false; // {xskq: true, ktjl: true, teaScore: true} isSaveSuccess
        }
        this.saveKqGoto(); // 保存考勤之后继续操作
      },
      // 保存考勤之后继续操作
      saveKqGoto() {
        if (this.typeLists.length === 1) {
          if (this.isSaveSuccess.xskq) {
            this.QD.alert('', this.titleNameLst[0] + '保存成功！');
          } else {
            this.QD.alert('', this.titleNameLst[0] + '保存失败！');
          }
        } else {
          if (this.ktjlList.length !== 0) {
            this.upKtjlData(this.ktjlList);  // 上传课堂纪律数据
          } else {
            this.upScore(); // 上传教师打分
          }
        }
      },
      // 上传课堂纪律数据
      async upKtjlData(val){
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'InsertClassDiscipline',
          SemId: this.curricData.xqid,
          TeachDay: this.curricData.PkDay,
          TeachNode: this.nodeIdxLst.toString(),
          JXBID: this.curricData.jxbid,
          TimeId: 0,
          ZGH: this.userZGH,
          CreatorType: 1,
          XH: '',
          IsKTJL: true,
          DetailStr: JSON.stringify(val)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          this.isSaveSuccess.ktjl = false;
          this.saveXSKqGoto();
          return;
        }
        if (d>0) {
          this.isSaveSuccess.ktjl = true;
//          this.getStudentClassDiscipline(); // 课堂纪律-根据学期id,日期，班级id,上课节次获取班级内每个学生的课堂纪律情况
        } else {
          this.isSaveSuccess.ktjl = false; // {xskq: true, ktjl: true, teaScore: true} isSaveSuccess
        }
        this.saveXSKqGoto();
      },
      // 保存课堂纪律之后的操作
      saveXSKqGoto () {
        for (let i=0; i<this.typeLists.length; i++) {
          if (this.typeLists[i] === this.titleNameLst[1]) {
            if (i<this.typeLists.length) {
              this.upScore(); // 上传教师打分
            } else if (i === this.typeLists.length) {
              if (i === 1) {
                if (this.isSaveSuccess.ktjl) {
                  this.QD.alert('', this.titleNameLst[1] + '保存成功！');
                } else {
                  this.QD.alert('', this.titleNameLst[1] + '保存失败！');
                }
              } else {
                if (this.isSaveSuccess.xskq && this.isSaveSuccess.ktjl) {
                  this.QD.alert('', this.titleNameLst[0] + '、' + this.titleNameLst[1] + '保存成功！');
                } else if (!this.isSaveSuccess.xskq && this.isSaveSuccess.stuScore) {
                  this.QD.alert('', this.titleNameLst[0] + '保存失败！, '+ this.titleNameLst[1] + '保存成功');
                } else if (!this.isSaveSuccess.xskq && !this.isSaveSuccess.stuScore) {
                  this.QD.alert('', '保存失败');
                } else {
                  this.QD.alert('', this.titleNameLst[0] + '保存成功！, '+ this.titleNameLst[1] + '保存失败');
                }
              }
            }
            break;
          }
        }
      },
      // 上传教师打分
      async upScore () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'InsertClassDiscipline',
          SemId: this.curricData.xqid,
          TeachDay: this.curricData.PkDay,
          TeachNode: this.nodeIdxLst.toString(),
          JXBID: this.curricData.jxbid,
          TimeId: 0,
          ZGH: this.userZGH,
          CreatorType: 1,
          XH: '',
          IsKTJL: false,
          DetailStr: JSON.stringify(this.saveTeaData)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          this.isSaveSuccess.teaScore = false;
          this.saveTeaScoreGoto(); // 保存老师打分之后的操作
          return;
        }
        if (d>0) {
          this.isSaveSuccess.teaScore = true;
        } else {
          this.isSaveSuccess.teaScore = false; // {xskq: true, ktjl: true, teaScore: true} isSaveSuccess
        }
        this.saveTeaScoreGoto(); // 保存老师打分之后的操作
      },
      // 保存老师打分之后的操作
      saveTeaScoreGoto() {
        if (this.typeLists.length === 1) {
          if (this.isSaveSuccess.teaScore) {
            this.QD.alert('', this.titleNameLst[2] + '保存成功！');
          } else {
            this.QD.alert('', this.titleNameLst[2] + '保存失败！');
          }
        } else if (this.typeLists.length === 3) {
          if (this.isSaveSuccess.xskq && this.isSaveSuccess.ktjl && this.isSaveSuccess.teaScore) {
            this.QD.alert('', '保存成功！');
          } else if (!this.isSaveSuccess.xskq && !this.isSaveSuccess.ktjl && !this.isSaveSuccess.teaScore) {
            this.QD.alert('', '保存失败！');
          } else if (this.isSaveSuccess.xskq && !this.isSaveSuccess.ktjl && !this.isSaveSuccess.teaScore) {
            this.QD.alert('', this.titleNameLst[0] + '保存成功、' + this.titleNameLst[1] + '和' + this.titleNameLst[2] + '保存失败！');
          } else if (this.isSaveSuccess.xskq && !this.isSaveSuccess.ktjl && this.isSaveSuccess.teaScore) {
            this.QD.alert('', this.titleNameLst[0] + '和' + this.titleNameLst[2] + '保存成功、' + this.titleNameLst[1] + '保存失败！');
          } else if (this.isSaveSuccess.xskq && this.isSaveSuccess.ktjl && !this.isSaveSuccess.teaScore) {
            this.QD.alert('', this.titleNameLst[0] + '和' + this.titleNameLst[1] + '保存成功、'+ this.titleNameLst[2] + '保存失败！');
          } else if (!this.isSaveSuccess.xskq && this.isSaveSuccess.ktjl && !this.isSaveSuccess.teaScore) {
            this.QD.alert('', this.titleNameLst[1] + '保存成功、'+ this.titleNameLst[0] + '和'+ this.titleNameLst[2] + '保存失败！');
          } else if (!this.isSaveSuccess.xskq && this.isSaveSuccess.ktjl && this.isSaveSuccess.teaScore) {
            this.QD.alert('', this.titleNameLst[1] + '和' + this.titleNameLst[2] + '保存成功、' + this.titleNameLst[0] + '保存失败！');
          } else if (!this.isSaveSuccess.xskq && !this.isSaveSuccess.ktjl && this.isSaveSuccess.teaScore) {
            this.QD.alert('', this.titleNameLst[2] + '保存成功、' + this.titleNameLst[1] + '和' + this.titleNameLst[0] + '保存失败！');
          }
        } else {
          if (this.typeLists[0] === this.titleNameLst[0]) {
            if (this.isSaveSuccess.xskq && this.isSaveSuccess.teaScore) {
              this.QD.alert('', '保存成功！');
            } else if (this.isSaveSuccess.xskq && !this.isSaveSuccess.teaScore) {
              this.QD.alert('', this.titleNameLst[0] + '保存成功、' + this.titleNameLst[2] + '保存失败！');
            } else if (!this.isSaveSuccess.xskq && this.isSaveSuccess.teaScore) {
              this.QD.alert('', this.titleNameLst[2] + '保存成功、' + this.titleNameLst[0] + '保存失败！');
            } else if (!this.isSaveSuccess.xskq && !this.isSaveSuccess.teaScore) {
              this.QD.alert('', '保存失败！');
            }
          } else {
            if (this.isSaveSuccess.ktjl && this.isSaveSuccess.teaScore) {
              this.QD.alert('', '保存成功！');
            } else if (this.isSaveSuccess.ktjl && !this.isSaveSuccess.teaScore) {
              this.QD.alert('', this.titleNameLst[1] + '保存成功、' + this.titleNameLst[2] + '保存失败！');
            } else if (!this.isSaveSuccess.ktjl && this.isSaveSuccess.teaScore) {
              this.QD.alert('', this.titleNameLst[2] + '保存成功、' + this.titleNameLst[1] + '保存失败！');
            } else if (!this.isSaveSuccess.ktjl && !this.isSaveSuccess.teaScore) {
              this.QD.alert('', '保存失败！');
            }
          }
        }
      },
      // 保存所有作答结果
      saveAllResult () {
        if (this.isCanSubmit === 1) {
          this.QD.alert('', '不能重复提交！');
          return;
        }
        let that = this;
        this.QD.confirm('', '确定保存', async function(){
          if (that.kqList.length !== 0) {
            that.upKqData(that.kqList) //学生考勤学生人数信息
          } else if (that.ktjlList.length === 0 && that.registerType === that.titleNameLst[0]){
            that.$refs.statusLog.getLogEditNum();
            that.upKqData(that.kqList) //学生考勤学生人数信息
          }
          if (that.ktjlList.length !== 0) {
            that.upKtjlData(that.ktjlList) //课堂纪律学生人数信息
          } else if (that.ktjlList.length === 0 && that.registerType === that.titleNameLst[1]){
            that.$refs.statusLog1.getLogEditNumktjl();
            that.upKtjlData(that.ktjlList) //课堂纪律学生人数信息
          }
          that.upScore(); // 上传教师打分
        });
      },
      // 判断教学日志中的学生考勤、课堂纪律、打分是否可以保存
      // SemId  学期 TeachDay  授课日期 JXBID 教学班Id TeachNode  授课节次 ZGH  学号/职工号 CreatorType  登记人类型 IsKTJL  是否登记了考勤
      async getStudentAttStatus(){
        let isKqdj = false;
        for (let i in this.typeLists) {
          if (this.typeLists[i] === this.titleNameLst[0]) {
            isKqdj = true;
            break;
          }
        }
        this.isCanSubmit = 0;
        if (this.QD.teachingLogCanRepeatRecord === false) { // 教学日志是否可以重复提交, 默认不可以重复提交 false
          let j = {
            SemId: this.curricData.xqid,
            TeachDay: this.curricData.PkDay,
            JXBID: this.curricData.jxbid,
            TeachNode: this.nodeIdxLst.toString(),
            ZGH: this.userZGH,
            CreatorType: 1,
            IsKTJL: isKqdj
          };
          let d = await this.QD.getData('/ComApi/PostObject', {
            apiName: 'StudentAttendanceStatusData',
            detailStr: JSON.stringify(j)
          });
          if (d.status && d.status === "error") {
            console.log('status error', d);
            this.saveAllResult();  // 保存所有作答结果
            return;
          }
          this.isCanSubmit = d.status;
        }
        this.saveAllResult(); // 保存所有作答结果
      }
    }
  }
</script>
<style scoped lang="less">
  .gp{
    margin-top: -20px;
  }
  .gap{
    padding-bottom: 60px;
    padding-top: 6px;
    background: #ffffff;
  }
  /*老师打分*/
  .eachsub{
    margin-top: 8px;
    background-color: #fff;
  }
  .subjHead{
    line-height: 36px;
    padding:10px 20px 10px 20px;
    color: #666666;
  }
  /*保存按钮*/
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding-bottom: 10px;
    padding-top: 10px;
    z-index: 10;
    background-color: #fff;
  }
  .sub-but{
    display: block;
    width: 90%;
    text-align: center;
    background-color: @tea-theme-color;
  }
</style>
