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
      <cell
        v-if="registerType && registerType !== titleNameLst[2]"
        :is-link="true"
        :arrow-direction="showStuData ? 'up' : 'down'"
        @click.native="showStuData = !showStuData">
        <span slot="after-title">学生列表</span>
      </cell>
      <!-- 搜索学生 -->
      <template v-if="registerType && showStuData && registerType !== titleNameLst[2]">
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
      <!-- 学生考勤 - 学生列表 end -->

      <!-- 课堂纪律 学生列表 start -->
      <div v-if="showStuData && registerType === titleNameLst[1]" class="gap">
        <cell :border-intent="false" v-for="(s, sidx) in stuLst" :key="sidx">
          <span slot="after-title" class="xmxh">
            {{ s.XM }}
          </span>
          <span slot="inline-desc"><badge :text="s.XH" class="bg-badge"></badge></span>
          <span class="stumess">
            <span :class="`eachKtjltype btn-in ${p.selected ? 'selektjlTypeColor'+p.ops.itemid%4 : ''}`"  v-for="(p, kidx) in s.ktjlOps" :key="kidx">
              <label @click="checkStuKtjl(s.XH, p.ops, sidx)" style="display: inline-block;padding-right: 8px;">
                <span class="school-wx-icon demo-icon13">&#xe680;</span>
                <span v-if="p.ops.itemname.length <= 4">{{p.ops.itemname}}</span>
                <span v-if="p.ops.itemname.length > 4 && p.lookmore === false">{{p.ops.itemname.substr(0, 4)}}...</span>
                <span v-if="p.ops.itemname.length > 4 && p.lookmore === true">{{p.ops.itemname}}</span>
              </label>
              <label @click="lookMore(p.lookmore, sidx, kidx)" v-if="p.ops.itemname.length > 3 && p.lookmore === false" class="school-wx-icon more-icon">&#xe647;</label>
              <label @click="lookMore(p.lookmore, sidx, kidx)" v-if="p.ops.itemname.length > 3 && p.lookmore === true" class="school-wx-icon more-icon" >&#xe648;</label>
            </span>
          </span>
        </cell>
      </div>
      <!-- 课堂纪律 学生列表 end -->
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
      <div v-if="typeLists.length > 0" class="btn-box">
        <x-button type="primary" mini class="sub-but" @click.native="getStudentAttStatus">保 存</x-button>
      </div>
    </group>
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
      TabItem
    },
    methods: {
      lookMore(val, idx, oIdx) {
        this.stuLst[idx].ktjlOps[oIdx].lookmore = !val;
        this.$set(this.stuLst, idx, this.stuLst[idx]);
        console.log('fd p.lookmore, ')
      },
      // 选择登记内容
      selectTypeVal (type) {
        this.registerType = type;
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
      // 点击学生考勤
      checkStuKq(op, idx) {
        if (this.stuLst[idx].Category === op.value) {
          this.stuLst[idx].Category = 0;
        } else {
          this.stuLst[idx].Category = op.value;
        }
        this.$set(this.stuLst, idx, this.stuLst[idx]);
      },
      // 点击学生课堂纪律
      checkStuKtjl (xh, r, idx) {
        // console.log("选择课堂纪律", xh, r);
        let hasOps = false; // 没有保存的数据中不存在当前项
        // 选中的项和之前保存的数据一样，表示删除之前保存的课堂纪律项
        for (let i in this.saveKtjlData) {
          if (xh === this.saveKtjlData[i].XH && this.saveKtjlData[i].ItemId === r.itemid) {
            this.saveKtjlData.splice(i, 1);
            hasOps = true;
            break;
          }
        }
        if (!hasOps) {
          // 重新添加新学生的课堂纪律情况
          this.saveKtjlData.push({
            ItemId: r.itemid,
            ItemType: 3,
            ItemName: r.itemname,
            ItemResult: '',
            ItemScore: r.scorevalue,
            XH: xh,
            NodeNames: this.nodeIdxLst.toString()
          });
        }
        // console.log('保存', this.saveKtjlData);
        // 添加到对应的学生数据ktjlLst内
        if (this.stuLst[idx].XH === xh) {
          let ktjlOps = this.stuLst[idx].ktjlOps;
          for (let k in ktjlOps) {
            if (ktjlOps[k].ops.itemid === r.itemid) {
              this.stuLst[idx].ktjlOps[k].selected = !(this.stuLst[idx].ktjlOps[k].selected); // 选中的与保存中的数据一样，设置为未选中
              this.$set(this.stuLst, idx, this.stuLst[idx]);
              break;
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
          if (that.typeLists[0] === that.titleNameLst[0]) {
            that.upKqData(); // 上传学生考勤数据
          } else if (that.typeLists[0] === that.titleNameLst[1]) {
            that.upKtjlData(); // // 上传课堂纪律数据
          } else {
            that.upScore(); // 上传教师打分
          }
        });
      },
      // 上传教师打分
      async upScore () {
        console.log("saveTeaData", this.saveTeaData);
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
          // this.QD.alert('', '老师打分保存失败！');
          this.isSaveSuccess.teaScore = false;
          this.saveTeaScoreGoto(); // 保存老师打分之后的操作
          return;
        }
        if (d>0) {
          this.isSaveSuccess.teaScore = true;
          // this.QD.alert('', '老师打分保存成功！');
        } else {
          this.isSaveSuccess.teaScore = false; // {xskq: true, ktjl: true, teaScore: true} isSaveSuccess
          // this.QD.alert('', '老师打分保存失败！');
        }
        this.saveTeaScoreGoto(); // 保存老师打分之后的操作
      },
      // 保存老师打分之后的操作
      saveTeaScoreGoto () {
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
          ResultList: JSON.stringify(this.listCategory),
          CreatorType: 1,
          Code: this.userZGH
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          this.isSaveSuccess.ktjl = false;
          this.saveKqGoto(); // 保存考勤之后继续操作
          return;
        }
        console.log('学生考勤', d);
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
          if ( this.typeLists[1] === this.titleNameLst[1]) {
            this.upKtjlData(); // // 上传课堂纪律数据
          } else {
            this.upScore(); // 上传教师打分
          }
        }
      },
      // 上传课堂纪律数据
      async upKtjlData () {
        console.log("upKtjlData", this.saveKtjlData);
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
          DetailStr: JSON.stringify(this.saveKtjlData)
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          // this.QD.alert('', '课堂纪律保存失败！');
          this.isSaveSuccess.ktjl = false;
          this.saveXSKqGoto();
          return;
        }
        if (d>0) {
          this.isSaveSuccess.ktjl = true;
          // this.QD.alert('', '课堂纪律保存成功！');
          this.getStudentClassDiscipline(); // 课堂纪律-根据学期id,日期，班级id,上课节次获取班级内每个学生的课堂纪律情况
        } else {
          this.isSaveSuccess.ktjl = false; // {xskq: true, ktjl: true, teaScore: true} isSaveSuccess
          // this.QD.alert('', '课堂纪律保存失败！');
        }
        this.saveXSKqGoto();
      },
      // 保存学生考勤之后的操作
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
        console.log('attendance relative data d is', d);
        if (d.type === 1) { // 1代表老师显示
          this.typeLists.push(this.titleNameLst[0]);
          this.kqoptions = d.contents; // 考勤项
        }
        console.log("kq options", this.kqoptions);
        // 判断教学日志中的课堂纪律显示在哪个用户类型下和获取课堂纪律的选项内容
        this.getClassDiscipline();
      },
      // 判断教学日志中的课堂纪律显示在哪个用户类型下和获取课堂纪律的选项内容
      async getClassDiscipline() {
        // this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassDiscipline'
        });
        // this.loading = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
        }
        console.log('classDiscipline relative data d is', d);
        if (d.type === 1) { // 1代表老师显示
          this.typeLists.push(this.titleNameLst[1]);
          this.ktjloptions = d.contents; // 考勤项
        }
        // 教师是否登记教学日志中的老师打分 roleType-1代表老师用户
        this.getTeachSubScore();
      },
      // 教师是否登记教学日志中的老师打分 roleType-1代表老师用户
      async getTeachSubScore() {
        // this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetTeachSubScore',
          roleType: 1,
          semid: this.curricData.xqid,
          pkDay: this.curricData.PkDay,
          jxbid: this.curricData.jxbid,
          teachNode: this.nodeIdxLst.toString(),
          code: this.userZGH
        });
        // this.loading = false;
        console.log('GetTeachSubScore relative data d is', d);
        if (d.type === 1) { // 1代表老师
          this.typeLists.push(this.titleNameLst[2]);
          //this.kqoptions = d.contents; // 打分项
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
            // 判断‘教师打分’之前是否有过做题记录
            /*if (r[i].itemresult) {
             this.isRepeatSubmit = true; // 有过做题记录
             }*/
          }
        }
        if (this.typeLists.length > 0) {
          this.registerType = this.typeLists[0]; // 教学日志登记内容的第一项显示
          if (this.typeLists[0] === this.titleNameLst[0] || this.typeLists[0] === this.titleNameLst[1]) {
            this.getStuLstByJxb(); // 根据教学班id 获取学生数据
          }
        }
      },
      // 课堂纪律-根据学期id,日期，班级id,上课节次获取班级内每个学生的课堂纪律情况
      async getStudentClassDiscipline() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStudentClassDiscipline',
          semid: this.curricData.xqid,
          pkDay: this.curricData.PkDay,
          jxbid: this.curricData.jxbid,
          teachNode: this.nodeIdxLst.toString(),
          nodeIndex: this.nodeIdxLst.toString(),
          zgh: this.userZGH
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
        }
        console.log('ktjl', d);
        this.eachStuKtjl = d;
        this.saveKtjlData = []; // 点击课堂纪律中的保存按钮上传的数据参数置空
        // 课堂纪律情况为无
        if (this.eachStuKtjl.length === 0) {
          for (let j in this.stuLst) {
            this.stuLst[j].ktjlOps = [];
            for (let k in this.ktjloptions) {
              this.stuLst[j].ktjlOps.push({ops: this.ktjloptions[k], selected: false, lookmore: false}); // 不选中
            }
          }
          // this.judgeKQjl(); // 判断考勤记录是否有登记过
          // return;
        }
        if (this.eachStuKtjl.length > 0) {
          // this.isRepeatSubmit = true; // ‘课堂纪律’教师之前有登记过
          // 课堂纪律情况有值
          for (let i in this.eachStuKtjl) { // 获取之前有记录的课堂纪律学生保存
            let item = this.eachStuKtjl[i].item;
            for (let k in item) { // 添加 saveKtjlData 参数中- 点击课堂纪律中的保存按钮上传的数据
              this.saveKtjlData.push({
                ItemId: item[k].itemid,
                ItemType: 3,
                ItemName: item[k].itemname,
                ItemResult: '',
                ItemScore: item[k].itemscore,
                XH: this.eachStuKtjl[i].xh,
                NodeNames: this.nodeIdxLst.toString()
              });
            }
          }
          for (let j in this.stuLst) { // 将有课堂纪律的学生添加到学生数据内
            this.stuLst[j].ktjlOps = [];
            /*将课堂纪律的选项添加到学生数据中 start*/
            for (let k in this.ktjloptions) {
              this.stuLst[j].ktjlOps.push({ops: this.ktjloptions[k], selected: false, lookmore: false}); // 不选中
              for (let i in this.eachStuKtjl) { // 获取之前有记录的课堂纪律学生保存
                let item = this.eachStuKtjl[i].item;
                if (this.eachStuKtjl[i].xh === this.stuLst[j].XH) {
                  // console.log('stu xh', this.eachStuKtjl[i].xh, this.stuLst[j].XH);
                  for (let m in item) {
                    // console.log('stu item', this.ktjloptions[k].itemid, item[m].itemid);
                    if (this.ktjloptions[k].itemid === item[m].itemid) {
                      this.stuLst[j].ktjlOps[k].selected = true; // 选中
                    }
                  }
                }
              }
            }
            this.$set(this.stuLst, j, this.stuLst[j]);
          }
        }
      },
      // 根据教学班id 获取学生数据
      async getStuLstByJxb () {
        // this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStudentListDataByClaIdOrderByXH',
          claId: this.curricData.jxbid,
          teachDay: this.curricData.PkDay,
          isOrderByXH: true
        });
        // this.loading = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
        }
        this.stuData = d;
        this.stuLst = d;
        for (let i in this.typeLists) {
          if (this.typeLists[i] === this.titleNameLst[1]) {
            // 课堂纪律-根据学期id,日期，班级id,上课节次获取班级内每个学生的课堂纪律情况 {semid}/{pkDay}/{jxbid}/{nodeIndex}
            this.getStudentClassDiscipline();
            break;
          }
        }
      },
      // 得到配置的标题名称
      getTitleInfo () {
        if (this.QD.teachingLogTeaTitleLst) {
          this.titleNameLst = this.QD.teachingLogTeaTitleLst;
        }
      },
      // 得到课表中的相关数据
      getCurriculumData() {
        this.getTitleInfo(); // 得到配置的标题名称
        this.userZGH = this.QD.getLocalUserinfo().stuObj.ZGH; // 当前用户教师的职工号
        if (this.QD.currPgToOtherPg) { // 数据不为空
          this.curricData = this.QD.currPgToOtherPg;
          for (let i = 0; i < this.curricData.span; i++) {
            let node = i + this.curricData.nodeIndex;
            this.nodeIdxLst.push(node);
          }
        } else {
          this.QD.alert('', '请先选择课程');
          this.$router.go(-1);
          return;
        }
        // 判断教学日志中的学生考勤显示在哪个用户类型下和获取学生考勤的选项内容
        this.getStuAttenRelaData();
      },
      // 判断教学日志中的学生考勤、课堂日志、打分是否可以保存
      // SemId  学期 TeachDay  授课日期 JXBID 教学班Id TeachNode  授课节次 ZGH  学号/职工号 CreatorType  登记人类型 IsKTJL  是否登记了考勤
      async getStudentAttStatus() {
        let isKqdj = false;
        for (let i in this.typeLists) {
          if (this.typeLists[i] === this.titleNameLst[0]) {
            isKqdj = true;
            break;
          }
        }
        this.isCanSubmit = 0;
        if (this.QD.teachingLogCanRepeatRecord === false) {
          let j = {SemId: this.curricData.xqid, TeachDay: this.curricData.PkDay, JXBID: this.curricData.jxbid, TeachNode: this.nodeIdxLst.toString(), ZGH: this.userZGH, CreatorType: 1, IsKTJL: isKqdj};
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
          console.log('status', d, this.isCanSubmit);
        }
        this.saveAllResult(); // 保存所有作答结果
      }
    },
    created () {
      // 得到课表中的相关数据
      this.getCurriculumData();
    },
    data () {
      return {
        loading: false,
        titleNameLst: ['学生考勤', '课堂纪律', '老师打分'], // 配置的标题名称默认值
        isCanSubmit: 0, // 0-未提交，1-已提交，4-被退回, 0和4代表可以提交，1代表不可以提交
        userZGH: '', // 当前用户教师的职工号
        curricData: null, // 课表相关数据
        nodeIdxLst: [], // 课程节次集合
        registerType: '', // 登记内容,如:学生考勤，课堂纪律，老师打分
        typeLists: [], // 教学日志登记内容
        kqoptions: [], // 考勤项
        ktjloptions: [], // 课堂纪律项
        saveKtjlData: [], // 保存课堂纪律的数据
        eachStuKtjl: [], // 班级内每个学生的课堂情况
        studentName: '', // 搜索出来的学生姓名
        stuData: null, // 学生信息-stuLst的数据一样，stuLst数据会变-用搜索中
        stuLst: null, // 学生信息--渲染页面中的学生数据
        showStuData: true, // 显示学生数据
        operateScore: [], // 页面渲染教师打分题
        listCategory: [], // Category(Int)考勤类型迟到=2,早退=4,旷课=8,事假=16,病假=32S,tuNum(Int)考勤异常的学生数StuRemark,异常学生学号集合如：学号1,学号2, 学号3,此学生数与Category一一对应
        saveTeaData: [], // 保存老师打分的数据
        isSaveSuccess: {xskq: true, ktjl: true, teaScore: true} // 保存是否成功-默认学生考勤、课堂纪律、教师打分保存成功
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
  .selekqTypeColor2{
    color: #ffffff;
    border-color: #FF0000;
    margin-right: 5px;
    background-color: #FF0000;
  }
  .selekqTypeColor4{
    color: #ffffff;
    border-color: #ff760c;
    margin-right: 5px;
    background-color: #ff760c;
  }
  .selekqTypeColor8{
    color: #ffffff;
    border-color: #ff2c95;
    margin-right: 5px;
    background-color: #ff2c95;
  }
  .selekqTypeColor16{
    color: #ffffff;
    border-color: #348038;
    margin-right: 5px;
    background-color: #348038;
  }
  .selekqTypeColor32{
    color: #ffffff;
    border-color: #4245ff;
    margin-right: 5px;
    background-color: #4245ff;
  }
  .school-wx-icon{
    font-size: 13px;
    padding-right: 0;
  }
  .more-icon{
    font-size: 20px;
    line-height: 20px;
  }
  .selektjlTypeColor1 .more-icon,
  .selektjlTypeColor2 .more-icon,
  .selektjlTypeColor3 .more-icon,
  .selektjlTypeColor4 .more-icon{
    color: #ffffff;
  }
  .demo-icon.demo-icon13{
    padding-right: 2px;
  }
  .btn-in {
    color: #aaa;
    border-color: #aaa;
    margin-right:5px;
  }
  .demo-icon13{
    color: #aaa;
    font-size: 13px;
  }
  .selektjlTypeColor1 .demo-icon13,
  .selekqTypeColor2 .demo-icon13{
    color: #ffffff;
  }
  .selektjlTypeColor2 .demo-icon13,
  .selekqTypeColor4 .demo-icon13{
    color: #ffffff;
  }
  .selektjlTypeColor3 .demo-icon13,
  .selekqTypeColor8 .demo-icon13{
    color: #ffffff;
  }
  .selektjlTypeColor0 .demo-icon13,
  .selekqTypeColor16 .demo-icon13{
    color: #ffffff;
  }
  .selekqTypeColor32 .demo-icon13{
    color: #ffffff;
  }
  .selektjlTypeColor1{
    color: #ffffff;
    border-color: #FF0000;
    margin-right: 5px;
    background-color: #FF0000;
  }
  .selektjlTypeColor2{
    color: #ffffff;
    border-color: #ff760c;
    margin-right: 5px;
    background-color: #ff760c;
  }
  .selektjlTypeColor3{
    color: #ffffff;
    border-color: #ff2c95;
    margin-right: 5px;
    background-color: #ff2c95;
  }
  .selektjlTypeColor0{
    color: #ffffff;
    border-color: #348038;
    margin-right: 5px;
    background-color: #348038;
  }
  .eachtype {
    display: inline-block;
    padding-top: 4px;
  }
  .eachKtjltype {
    display: inline-block;
    margin-top: 15px;
    border: 1px solid;
    border-radius: 5px;
    padding: 0 0.5em;
    line-height: 2.3;
    font-size: 13px;
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
    background-color: #fff;
  }
  .sub-but{
    display: block;
    width: 90%;
    text-align: center;
    background-color: @tea-theme-color;
  }
</style>
