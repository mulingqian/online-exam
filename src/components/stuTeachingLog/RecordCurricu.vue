<template>
  <div class="record-curriculum">
    <tab>
      <tab-item v-if="typeLists.length > 0" :selected="tIndex === 0" v-for="(r, tIndex) in typeLists" @on-item-click="selectTypeVal(r)" :key="tIndex">{{r}}</tab-item>
      <tab-item v-if="typeLists.length < 1">无登记内容</tab-item>
    </tab>
    <group class="gp" v-if="classData">
      <cell>
        <span slot="after-title">课程日期</span>
        <span>{{classData.date}}</span>
      </cell>
      <cell>
        <span slot="after-title">班级名称</span>
        <span>{{classData.bjmc}}</span>
      </cell>
      <popup-picker v-if="seleNode[0] && classData.type === 'xzb'" title="节次" v-model="seleNode" :data="nodeIdxLst" @on-change="chooseNodes"></popup-picker> <!--行政班-->
      <popup-picker v-if="seleNode[0] && classData.type !== 'xzb'" title="节次" v-model="seleNode" :data="nodeIdxLst" @on-change="getseleNode"></popup-picker> <!-- 教学班 -->
      <cell v-if="!seleNode[0]">
        <span slot="after-title">节次</span>
        <span>无课程</span>
      </cell>
      <cell
        v-if="registerType && registerType !== titleNameLst[1]"
        :is-link="true"
        :arrow-direction="showStuData ? 'up' : 'down'"
        @click.native="showStuData = !showStuData">
        <span slot="after-title">学生列表</span>
      </cell>
      <!-- 搜索学生 -->
      <template v-if="registerType && showStuData && registerType !== titleNameLst[1]">
        <cell>
          <span slot="after-title">
            <x-input placeholder="请输入学生姓名" v-model="studentName" style="height: 6px" v-on:input="searchStudent">
              <x-button slot="right" type="primary" mini @click.native="searchStudent">搜索</x-button>
            </x-input>
          </span>
        </cell>
        <cell style="padding: 0;"></cell>
      </template>
      <!-- 学生考勤 - 学生列表 start-->
      <div v-if="showStuData && registerType === titleNameLst[0]" class="gap">
        <cell :border-intent="false" v-for="(s, sidx) in stuLst" :key="sidx">
          <span slot="after-title" class="xmxh">
            {{ s.XM }}
          </span>
          <span slot="inline-desc"><badge :text="s.XH" class="bg-badge"></badge></span>
          <span class="stumess">
            <span class="eachtype">
              <x-button mini plain :class="`${s.Category === p.value ? 'selekqTypeColor'+p.value: 'btn-in'}`" @click.native="checkStuKq(p, sidx)" v-for="(p, kidx) in kqoptions" :key="kidx">
                <span class="demo-icon demo-icon13">&#xe62f;</span>{{p.name}}
              </x-button>
            </span>
          </span>
        </cell>
      </div>

      <!-- 学生打分 start -->
      <div v-if="operateScore && registerType === titleNameLst[1]" style="background-color: #f2f2f2;" class="gap">
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
      <!-- 学生打分 end upScore-->
      <div v-if="typeLists.length > 0 && seleNode[0]" class="btn-box">
        <x-button type="primary" mini class="sub-but" @click.native="getStudentAttStatus">保 存</x-button>
      </div>
    </group>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Badge from 'vux/src/components/badge/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  import Checklist from 'vux/src/components/checklist/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import { mapActions } from 'vuex'
  export default {
    name: "stuTeachingLog-recordCurricu",
    directives: {
      TransferDom
    },
    components: {
      Cell,
      Group,
      Badge,
      XButton,
      XInput,
      Checklist,
      PopupPicker,
      Tab,
      TabItem
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 选择登记内容
      selectTypeVal (type) {
        this.registerType = type;
      },
      // 点击学生考勤
      checkStuKq(op, idx) {
        if (this.stuLst[idx].Category === op.value) {
          this.stuLst[idx].Category = 0;
        } else {
          this.stuLst[idx].Category = op.value;
        }
        this.$set(this.stuLst, idx, this.stuLst[idx]);
      },
      // 得到教学班的类型下选中的节次
      getseleNode (val) {
        console.log('jxb');
        this.seleNode[0] = val[0];
      },
      // 选择这一天的行政班节次，并根据节次来获取教学班级id
      chooseNodes(val) {
        // 以下是行政班，根据节次来获取教学班级id start
        console.log(val, this.seleNode);
        if (this.seleNode[0] === val[0]) { // 重复选择
          console.log('break');
          return;
        }
        this.seleNode[0] = val[0];
        console.log('seleNode', this.seleNode);
        for (let i in this.oldnodes) {
          if (this.oldnodes[i].node === parseInt(val[0])) {
            this.jxbId = this.oldnodes[i].jxbid; // 得到教学班id
            this.getStuLstByJxb(this.oldnodes[i].jxbid); // 根据教学班id获取班级的学生
          }
        }
        /* 以上是行政班，根据节次来获取教学班级id end */
      },
      // 学生打分--选择题 操作
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
          NodeNames: this.seleNode[0]
        });
        console.log('saveTeaData 1', this.saveTeaData);
      },
      //  学生打分- 填空题 操作
      setInputScore (r) {
        for (let i in this.saveTeaData) { // 此时操作的题目存在之前保存数据的题目中，将保存数据中的记录删除
          if (this.saveTeaData[i].ItemId === r.itemid) {
            this.saveTeaData.splice(i, 1);
            break;
          }
        }
        console.log('input', r, r.itemresult);
        this.saveTeaData.push({ // 当前题目选择完毕后，将选中的记录保存在saveTeaData记录内
          ItemId: r.itemid,
          ItemType: r.itemtype,
          ItemName: r.itemname,
          ItemResult: r.itemresult,
          ItemScore: 0,
          XH: '',
          NodeNames: this.seleNode[0]
        });
      },
      // 保存所有作答结果
      saveAllResult () {
        if (this.isCanSubmit === 1) {
          this.QD.alert('', '不能重复提交！');
          return;
        }
        this.isSaveSuccess.xskq = null;
        this.isSaveSuccess.stuScore = null;
        let that = this;
        this.QD.confirm('', '确定保存', async function(){
          if (that.typeLists.length === 2) {
            that.upKqData(); // 上传学生考勤数据
          } else {
            that.upScore(); // 上传学生打分
          }
        });
      },
      // 上传学生考勤数据
      async upKqData() {
        let types = [0, 0, 0, 0, 0];
        let cdXh = []; // 迟到=2
        let ztXh = []; // 早退=4
        let kkXh = []; // 旷课=8
        let sjXh = []; // 事假=16
        let bjXh = []; // 病假=32
        this.listCategory = [];
        // 计算每种考勤选项类型登记的学生集合和数目
        for (let i = 0; i < this.stuLst.length; i++){
          let n = this.stuLst[i];
          switch (n.Category) {
            case 2:
              types[0]++;
              cdXh.push(this.stuLst[i].XH);
              break;
            case 4:
              types[1]++;
              ztXh.push(this.stuLst[i].XH);
              break;
            case 8:
              types[2]++;
              kkXh.push(this.stuLst[i].XH);
              break;
            case 16:
              types[3]++;
              sjXh.push(this.stuLst[i].XH);
              break;
            case 32:
              types[4]++;
              bjXh.push(this.stuLst[i].XH);
          }
        }
        console.log("stu kq", cdXh);
        // 数据变为可传结构
        this.listCategory = [];
        for (let k in this.kqoptions) {
          console.log("stu kqoptions", this.kqoptions[k].value);
          if (this.kqoptions[k].value === 2) {
            this.listCategory.push({
              Category: 2,
              StuNum: types[0],
              StuRemark: cdXh.toString()
            });
          } else if (this.kqoptions[k].value === 4) {
            this.listCategory.push({
              Category: 4,
              StuNum: types[1],
              StuRemark: ztXh.toString()
            });
          } else if (this.kqoptions[k].value === 8) {
            this.listCategory.push({
              Category: 8,
              StuNum: types[2],
              StuRemark: kkXh.toString()
            });
          } else if (this.kqoptions[k].value === 16) {
            this.listCategory.push({
              Category: 16,
              StuNum: types[3],
              StuRemark: sjXh.toString()
            });
          } else if (this.kqoptions[k].value === 32) {
            this.listCategory.push({
              Category: 32,
              StuNum: types[4],
              StuRemark: bjXh.toString()
            });
          }
        }
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'InsertStudentAttendanceData',
          XQMC: '',
          KCMC: '',
          Times: '',
          Teacher: '',
          Category: '',
          TeachDay: this.classData.date,
          CategoryName: '',
          BJMCs: '',
          JSMC: '',
          SJRS: '',
          Nodes: this.seleNode[0],
          ListCategory: '',
          JXBID: this.jxbId,
          XH: '',
          XM: '',
          ResultList: JSON.stringify(this.listCategory),
          CreatorType: 2,
          Code: this.userXH
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log(d.msg);
          this.isSaveSuccess.xskq = false;
          // this.QD.alert('', '学生考勤保存失败！');
          if (this.typeLists.length===2) {
            this.upScore();  // 上传学生打分
          } else {
            this.QD.alert('', this.titleNameLst[0] + '保存失败！');
          }
          return;
        }
        console.log('学生考勤', d);
        if (d>0) {
          this.isSaveSuccess.xskq = true;
        } else {
          this.isSaveSuccess.xskq = false;
        }
        if (this.typeLists.length===2) {
          this.upScore();  // 上传学生打分
        } else {
          if (this.isSaveSuccess.xskq) {
            this.QD.alert('', this.titleNameLst[0] + '保存成功！');
          } else {
            this.QD.alert('', this.titleNameLst[0] + '保存失败！');
          }
        }
      },
      // 上传学生打分
      async upScore () {
        console.log("saveTeaData", this.saveTeaData);
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'InsertClassDiscipline',
          SemId: this.classData.xqID,
          TeachDay: this.classData.date,
          TeachNode: this.seleNode[0],
          JXBID: this.jxbId,
          TimeId: 0,
          ZGH: '',
          CreatorType: 2,
          XH: this.userXH,
          IsKTJL: false,
          DetailStr: JSON.stringify(this.saveTeaData)
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log(d.msg);
          this.isSaveSuccess.stuScore = false;
          this.saveDfGoto(); // 保存打分之后的操作
          return;
        }
        if (d>0) {
          this.isSaveSuccess.stuScore = true;
        } else {
          this.isSaveSuccess.stuScore = false;
        }
        this.saveDfGoto(); // 保存打分之后的操作
      },
      // 保存打分之后的操作
      saveDfGoto() {
        if (this.typeLists.length===2) {
          if (this.isSaveSuccess.xskq && this.isSaveSuccess.stuScore) {
            this.QD.alert('', this.titleNameLst[0] + '、' + this.titleNameLst[1] + '保存成功！');
          } else if (!this.isSaveSuccess.xskq && this.isSaveSuccess.stuScore) {
            this.QD.alert('', this.titleNameLst[0] + '保存失败！, ' + this.titleNameLst[1] + '保存成功');
          } else if (!this.isSaveSuccess.xskq && !this.isSaveSuccess.stuScore) {
            this.QD.alert('', '保存失败');
          } else {
            this.QD.alert('', this.titleNameLst[0] + '保存成功！, ' + this.titleNameLst[1] + '保存失败');
          }
        } else {
          if (this.isSaveSuccess.stuScore) {
            this.QD.alert('', this.titleNameLst[1] + '保存成功！');
          } else {
            this.QD.alert('', this.titleNameLst[1] + '保存失败！');
          }
        }
      },
      // 根据学生的名字来搜索到学生
      searchStudent () {
        let result = [];
        this.stuLst = this.stuData;
        if (this.studentName !== '') {
          for (let i = 0; i < this.stuLst.length; i++) {
            if (this.stuLst[i].XM.indexOf(this.studentName) >= 0) {
              result.push(this.stuLst[i]);
            }
          }
          this.stuLst = result;
        }
        // console.log(this.stuLst);
      },
      // 根据教学班id 获取学生数据
      async getStuLstByJxb (id) {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStudentListDataByClaIdOrderByXH',
          claId: id,
          teachDay: this.classData.date,
          isOrderByXH: true
        });
        if (d.status && d.status === "error") {
          console.log('获取数据失败', d.msg);
        }
        this.stuData = d;
        this.stuLst = d;
      },
      // 通过学期、时间、教学班ID,班级ID获取一天的节次
      async getDateNodes () {
        let jxbid = 0;
        let xzbid = 0;
        if (this.classData.type === 'xzb') { // 行政班
          xzbid = this.classData.bjid;
        } else { // 教学班
          jxbid = this.classData.bjid;
        }
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetDateNodes',
          semId: this.classData.xqID,
          teachDay: this.classData.date,
          jxbid: jxbid,
          bjid: xzbid
        });
        if (d.status && d.status === "error") {
          console.log('获取数据失败', d.msg);
        }
        console.log("nodes", d);
        this.oldnodes = d; // 从接口获取的节次数据集合
        this.nodeIdxLst[0] = [];
        let arr = [];
        let bid = 0;
        for (let k in d) {
          let nd = d[k].node;
          if (bid === d[k].jxbid) {
            arr[(arr.length - 1)] = arr[(arr.length - 1)] + ',' + nd;
          } else {
            bid = d[k].jxbid;
            arr.push(nd);
          }
        }
        this.nodeIdxLst[0] = arr;
        /*for (let i in d) {
         console.log('i', i, d[i].node);
         this.nodeIdxLst[0].push(d[i].node);
         }*/
        this.seleNode[0] = arr ? this.nodeIdxLst[0][0] : '';
        console.log('nodelst', this.nodeIdxLst, this.seleNode);
        if (this.seleNode[0]) { // 有节次并默认选中第一个节次
          this.jxbId = d[0].jxbid; // 教学班id
          this.getTeachSubScore(d[0].jxbid); // 学生是否登记教学日志中的学生打分 roleType-2代表学生用户
          this.getStuLstByJxb(d[0].jxbid); // 根据教学班id 、节次获取学生数据
        }
      },
      // 学生是否登记教学日志中的学生打分 roleType-2代表学生用户
      async getTeachSubScore(jxbid) {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetTeachSubScore',
          roleType: 2,
          semid: this.classData.xqID,
          pkDay: this.classData.date,
          jxbid: jxbid,
          teachNode: this.seleNode[0],
          code: this.userXH
        });
        console.log('GetTeachSubScore relative data d is', d);
        if (d.type === 1) { // 1代表学生用户可以登记，0表示不可以
          this.typeLists.push(this.titleNameLst[1]);
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
        this.registerType = this.typeLists[0]; // 教学日志登记内容的第一项显示
      },
      // 判断教学日志中的学生考勤是否显示在学生用户类型下和并获取学生考勤的选项内容
      async getStuAttenRelaData () {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuAttendanceContents'
        });
        if (d.status && d.status === "error") {
          console.log(d.msg);
          if (this.classData.bjid) {
            this.getDateNodes(); // 通过学期、时间、教学班ID,班级ID获取一天的节次
          }
          return;
        }
        console.log('attendance relative data d is', d);
        if (d.type === 2) { // 2 代表学生用户类型
          this.typeLists.push(this.titleNameLst[0]);
          this.kqoptions = d.contents; // 考勤项
        }
        console.log("kq options", this.kqoptions);
        if (this.classData.bjid) {
          this.getDateNodes(); // 通过学期、时间、教学班ID,班级ID获取一天的节次
        }
      },
      // 得到配置的标题名称
      getTitleInfo () {
        if (this.QD.teachingLogStuTitleLst) {
          this.titleNameLst = this.QD.teachingLogStuTitleLst;
        }
      },
      // 得到班级中的相关数据
      getClassReleData() {
        this.getTitleInfo(); // 得到配置的标题名称
        this.userXH = this.QD.getLocalUserinfo().stuObj.XH; // 当前用户学生的学号
        this.classData.bjid = this.$route.query.bjid; // 班id
        this.classData.bjmc = this.$route.query.bjmc; // 班名称
        this.classData.date = this.$route.query.date; // 日期
        this.classData.type = this.$route.query.type; // 类型-教学班或行政班
        this.classData.xqID = this.$route.query.xqid; // 学期id
        console.log(this.classData);
        this.getStuAttenRelaData();  // 判断教学日志中的学生考勤是否可以在学生用户下显示，若可以显示并获取学生考勤的选项内容
        this.getSetNodeTimes(); // 读取指定学期中每节课的上课时间
      },
      // 判断教学日志中的学生考勤、学生打分是否可以保存
      // SemId  学期 TeachDay  授课日期 JXBID 教学班Id TeachNode  授课节次 ZGH  学号/职工号 CreatorType  登记人类型 IsKTJL  是否登记了考勤
      async getStudentAttStatus() {
        let resultRule = false;
        let selectNodeIndex = parseInt(this.seleNode); // '1,2' // 得到是 1
        if (this.nodeTimes.length === 0) { // 采用原来的方式
          resultRule = this.setRegisterRule({PkDay: this.classData.date, nodeIndex: selectNodeIndex}); // 判断是否可以登记
        } else {
          for (let i=0; i<this.nodeTimes.length; i++) {
            let si = this.nodeTimes[i];
            if (si.nodeIndex === selectNodeIndex && !si.compareTime) { // 采用原来的方式
              resultRule = this.setRegisterRule({PkDay: this.classData.date, nodeIndex: selectNodeIndex}); // 判断是否可以登记
              break;
            }
            if (si.nodeIndex === selectNodeIndex && si.compareTime) { // 有设置登记时间
              if (si.timeLimitType === '随时') {
                resultRule = true; // 总是可以登记
              } else { // timeLimitType === '课前' ； timeLimitType === '课后'
                resultRule = this.judgeRegisterRule({PkDay: this.classData.date, nodeTime: si});
              }
              break; // 已经找到上课的最小节次对应的上课时间信息
            }
          }
        }
        if (!resultRule) {
          this.QD.alert('', '对不起, 当前班级的课程尚未上课, 不能进行登记 !');
          return;
        }
        let isKqdj = false;
        for (let i in this.typeLists) {
          if (this.typeLists[i] === this.titleNameLst[0]) {
            isKqdj = true;
            break;
          }
        }
        this.isCanSubmit = 0;
        if (this.QD.teachingLogCanRepeatRecord === false) {
          let j = {SemId: this.classData.xqID, TeachDay: this.classData.date, JXBID: this.jxbId, TeachNode: this.seleNode.toString(), ZGH: this.userXH, CreatorType: 2, IsKTJL: isKqdj};
          let d = await this.QD.getData('/ComApi/PostObject', {
            apiName: 'StudentAttendanceStatusData',
            detailStr: JSON.stringify(j)
          });
          if (d.status && d.status === "error") {
            console.log('status error', d);
            this.saveAllResult(); // 保存所有作答结果
            return;
          }
          this.isCanSubmit = d.status;
          console.log('status', d, this.isCanSubmit);
        }
        this.saveAllResult(); // 保存所有作答结果
      },
      /* 判断是否可以登记, 以下是判断规则
       * 第1节第2节：2019-10-10 10:00 后才能登记
       第3节第4节：2019-10-10 12:00 后才能登记
       第5节第6节：2019-10-10 14:30 后才能登记
       第7节后：2019-10-10 16:00 后才能登记
       * */
      setRegisterRule (c) {
        console.log('nodeIndex and pkDay', c);
        let curTime = this.QD.getDateOrTime('time'); // 当前日期+具体时间
        let curTimeLst = (curTime.substr(11, 8)).split(":"); // 当前时分秒
        let curSecond = parseInt(curTimeLst[0]) * 60 * 60 + parseInt(curTimeLst[1]) * 60 + parseInt(curTimeLst[2]); // 当前秒
        let curDate = curTime.substr(0, 10); // 当前日期
        let pkDay = new Date(c.PkDay).getTime();
        let curDay = new Date(curDate).getTime();
        if (pkDay === curDay) { // 授课日期与当前日期相同
          if (c.nodeIndex < 3 && curSecond > 10 * 60* 60) { // 第1节第2节
            return true;
          } else if (c.nodeIndex < 5 && curSecond > 12 * 60* 60) { // 第3节第4节
            return true;
          } else if (c.nodeIndex < 7 && curSecond > 14 * 60* 60 + 30 * 60) {  // 第5节第6节
            return true;
          } else if (curSecond > 16 * 60 * 60) { // 第7节后
            return true;
          } else {
            return false;
          }
        } else if (pkDay < curDay) { // 授课日期小于当前日期
          return true;
        } else { // 授课日期大于当前日期
          return false;
        }
      },
      // 根据用户设置的登记时间，判断登记时间到了，即可去登记考勤
      judgeRegisterRule (c) {
        console.log('nodeIndex | pkDay = ', c);
        let nodeTime = c.nodeTime; // 学校设置的上课时间和可以登记的时间
        let curTime = this.QD.getDateOrTime('time'); // 当前日期+具体时间
        let curTimeLst = (curTime.substr(11, 8)).split(":"); // 当前时分秒
        let curSecond = parseInt(curTimeLst[0]) * 60 * 60 + parseInt(curTimeLst[1]) * 60 + parseInt(curTimeLst[2]); // 当前秒
        let curDate = curTime.substr(0, 10); // 当前日期
        let pkDay = new Date(c.PkDay).getTime();
        let curDay = new Date(curDate).getTime();
        let skLst = nodeTime.compareTime.split(":"); // 登记时间的时、分
        let skSecond = parseInt(skLst[0]) * 60 * 60 + parseInt(skLst[1]) * 60; // 登记秒
        if (pkDay === curDay) { // 授课日期与当前日期相同
          if (skSecond <= curSecond) { // 登记时间已过了
            return true;
          } else { // 登记时间还未到
            return false;
          }
        } else if (pkDay < curDay) { // 授课日期小于当前日期
          return true;
        } else { // 授课日期大于当前日期
          return false;
        }
      },
      // 读取指定学期中每节课的上课时间
      async getSetNodeTimes () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSemesterNodeTimes', semId: this.classData.xqID});
        this.updateLoadingStatus(false);
        d = JSON.parse(d);
        this.nodeTimes = d.data;
        console.log("nodeTimes", this.nodeTimes);
      }
    },
    created () {
      // 得到班级中的相关数据
      this.getClassReleData();
    },
    data () {
      return {
        nodeTimes: [], // 节次的上课时间、下课时间、登记时间的设置
        titleNameLst: ['学生考勤', '学生打分'], // 配置的标题名称默认值
        isCanSubmit: 0, // 0-未提交，1-已提交，4-被退回, 0和4代表可以提交，1代表不可以提交
        userXH: '', // 当前学生用户的学号
        jxbId: '', // 教学班id
        classData: [], // 班级相关数据
        oldnodes: [], // 从接口中获取出来的节次
        nodeIdxLst: [], // 课程节次集合
        seleNode: [], // 选中的节次
        registerType: '', // 登记内容,如:学生考勤，课堂纪律，老师打分
        typeLists: [], // "学生考勤", "学生打分"
        kqoptions: [], // 考勤项
        ktjloptions: [], // 课堂纪律项
        studentName: '', // 搜索出来的学生姓名
        stuData: null, // 学生信息-stuLst的数据一样，stuLst数据会变
        stuLst: null, // 学生信息
        showStuData: true, // 显示学生数据
        operateScore: [],
        listCategory: [], // Category(Int)考勤类型迟到=2,早退=4,旷课=8,事假=16,病假=32S,tuNum(Int)考勤异常的学生数StuRemark,异常学生学号集合如：学号1,学号2, 学号3,此学生数与Category一一对应
        saveTeaData: [], // 保存学生打分的数据
        isSaveSuccess: {xskq: null, stuScore: null} // 保存是否成功-默认true学生考勤、true学生打分保存成功
      }
    }
  }
</script>
<style scoped lang="less">
  .gp{
    margin-top: -20px;
  }
  .eachsub{
    margin-top: 8px;
    background-color: #fff;
  }
  .subjHead{
    line-height: 36px;
    padding:10px 20px 10px 20px;
    color: #666666;
  }
  .bg-badge{
    background-color: #56dd67;
  }
  .stumess{
    font-size: 14px;
  }
  .demo-icon.demo-icon13{
    font-size: 13px;
    padding-right: 2px;
  }
  .selekqTypeColor2{
    color: #ffffff;
    border-color: #FF0000;
    margin-right: 5px;
    background-color:  #FF0000;
  }
  .selekqTypeColor4{
    color: #ffffff;
    border-color: #ff760c;
    margin-right: 5px;
    background-color:  #ff760c;
  }
  .selekqTypeColor8{
    color: #ffffff;
    border-color: #ff2c95;
    margin-right: 5px;
    background-color:  #ff2c95;
  }
  .selekqTypeColor16{
    color: #ffffff;
    border-color: #348038;
    margin-right: 5px;
    background-color:  #348038;
  }
  .selekqTypeColor32{
    color: #ffffff;
    border-color: #4245ff;
    margin-right: 5px;
    background-color:  #4245ff;
  }
  .demo-icon.demo-icon13{
    font-size: 13px;
    padding-right: 2px;
  }
  .btn-in {
    color: #aaa;
    border-color: #aaa;
    margin-right:5px;
  }
  .btn-in .demo-icon13{
    color: #aaa;
  }
  .selekqTypeColor2 .demo-icon13,
  .selekqTypeColor4 .demo-icon13,
  .selekqTypeColor8 .demo-icon13,
  .selekqTypeColor16 .demo-icon13,
  .selekqTypeColor32 .demo-icon13{
    color: #ffffff;
  }
  .eachtype {
    display: inline-block;
    padding-top: 4px;
  }
  .gap{
    padding-bottom: 60px;
  }
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding-bottom: 10px;
    padding-top: 10px;
    z-index: 10;
    background-color: #ffffff;
  }
  .sub-but{
    display: block;
    width: 90%;
    text-align: center;
    background-color: @stu-theme-color;
  }
</style>
