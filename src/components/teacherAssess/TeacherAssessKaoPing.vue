<template>
  <div class="teacherAssessKaoPing">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div>
      <div class="teaAssessSubject">
        <span>{{assessSubject}}</span>
      </div>
      <div class="teaAssessPaper">
        <span>老师：{{assessNameCode}}</span>
        <br/>
        <span>课程：{{assessKCMC}}</span>
        <span v-if="assessResultId > 0">（已提交）</span>
        <br/>
      </div>
      <div class="assessSubjectContent" v-if="teaItemList !== null && teaItemList.length > 1">
        <div v-for="(item,idx) in teaItemList" :key="idx" class="assessProblem">
          <span v-html="item.Title"></span>
          <div v-if="InputOnly == 'false'">
             <span
               v-for="(op,oIdx) in item.OptionList"
               :key="oIdx"
               style="display: block"
               @click="selectAssessVal(item.OptId,op.OptId,op.Value,idx,oIdx)"
               :class="resultList[idx].OptionId === op.OptId  || item.OptId === op.OptId? 'selectedBGColor':''">
            <input
              type="radio"
              :name="'optionTeaAssessValue' + idx"
              :value="op.Value"
              :checked="resultList[idx].OptionId === op.OptId || item.OptId === op.OptId"/>
            {{op.Name}}
          </span>
          </div>
          <div v-else class="InputScore">
            <span>评分：</span>
            <input
              type="number"
              ref="inp"
              @input="inputTeaScore(item.ItemId,idx)"
              v-model="item.Result">
          </div>
        </div>
        <div class="assessComment" v-if="teaSysEvalItemData.IsComment === 1" style="margin-bottom: 60px;">
          <span>对该老师的意见或建议：</span>
          <x-textarea
            placeholder="请输入评语"
            :show-counter="false"
            :rows="1"
            autosize
            v-model="assessRemarks">
          </x-textarea>
        </div>

        <div  v-if="isCanRepeat" class="assessSubmit" @click="assessSubmit()">
          <a>提交</a>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  export default {
    name: "teacherAssessKaoPing",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      XTextarea
    },
    methods: {
      //输入分数
      inputTeaScore(itemId, idx, item){
        console.log(this.$refs.inp[idx].value, itemId, item)
        let val = this.$refs.inp[idx].value-0;
        var allowInput = sessionStorage.getItem("teaAssessAllowInput"); // 是否允许输入选项以外的值
        // /判断是否允许输入选项以外的值  如果不允许判断该题的最大值以及最小值
        if (allowInput === 'false'){
          var maxScore = 0;
          var minScore = 100;
          item.OptionList.forEach(item => {
            console.log(typeof item.Value)
            if (item.Value > maxScore){
              maxScore = item.Value
            }
            if (item.Value < minScore){
              minScore = item.Value
            }
          })
          if (val > maxScore || val < minScore){
            this.QD.alert('', '请输入'+minScore+'到'+maxScore+'之间值')
          }
        }
        this.resultList[idx].OptionId = itemId;
        this.resultList[idx].Opidx = 0;
        this.resultList[idx].Result = val;
      },
      //获取配置项数据
      async getSystemConfigData (){
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetSystemConfigData',
          keyName: 'WebConfig_rblTeacherEvalFirstOptionSelected,WebConfig_rblTeacherEvalAllowSameResult,WebConfig_rblTeacherEvalStudentCommentRequired'
        });
        if (d.status && d.status === "error") {
          this.QD.alert(`获取配置项失败:${d.msg}`);
          return;
        }
        //console.log("获取配置项数据", d)
        this.loading = false;
        this.isSubmitResaultSame = d.data[0].itemValue //选中项一样是否可以提交
        this.isDefaultSelectFirstOP = d.data[1].itemValue //是否默认选中第一项
        this.mustInputPingYu = d.data[2].itemValue //是否必须输入评语
      },
      // 获取试题信息
      async getTeaSysEvalItemData() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject',
          {
            apiName: 'GetTeaSysEvalItemData',
            tableId: this.assessTableId,
            targetId: this.assessTargetId,
            employeeType: this.assessEmployeeType
          });
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        this.teaSysEvalItemData = d;
        //console.log("获取试题信息", d)
        this.teaItemList = this.teaSysEvalItemData.ItemList; // 试题内容
        this.assessRemarks = this.teaSysEvalItemData.Comments; // 评语
        for (let i = 0; i < this.teaItemList.length; i++){
          // 获取每一题的第一个选项的id
          this.isSelected = this.teaItemList[i].OptionList[0].OptId;
          // 解析每一题
          this.teaItemList[i].Title = this.teaItemList[i].Title.replace(new RegExp(/(\\n)/g), '<br />');
          // 未作答时默认选中第一个选项的value值
          let selectOptVal = this.teaItemList[i].OptionList[0].Value;
          // 已提交时找出该作答选项
          if (this.teaItemList[i].OptId > 0) {
            for (let j = 0; j < this.teaItemList[i].OptionList.length; j++) {
              // 已提交时找出该作答选项
              if (this.teaItemList[i].OptId === this.teaItemList[i].OptionList[j].OptId){
                selectOptVal = this.teaItemList[i].OptionList[j].Value;
              }
            }
          }
          // 保存每题默认选中的作答的值
          if (this.isDefaultSelectFirstOP === "1"){
            this.resultList.push({
              TargetId: this.assessTargetId,
              TableId: this.assessTableId,
              ItemId: this.teaItemList[i].ItemId,
              Opidx: 0,
              OptionNum: this.teaItemList[i].OptionNum,
              OptionId: this.teaItemList[i].OptId > 0 ? this.teaItemList[i].OptId > 0: this.teaItemList[i].OptionList[0].OptId,
              Result: this.teaItemList[i].OptionList[0].Value
            });
          } else {
            this.resultList.push({
              TargetId: this.assessTargetId,
              TableId: this.assessTableId,
              ItemId: this.teaItemList[i].ItemId,
              OptionNum: this.teaItemList[i].OptionNum,
              OptionId: 0,
              Opidx: 0,
              Result: this.teaItemList[i].Result
            });
          }
        }
      },
      // 从教师测评列表中获取sessionStorage的存储数据
      getTeaAssessLstPageData () {
        this.assessSubject = sessionStorage.getItem("teaAssessSubject");
        this.assessEmployeeType = parseInt(sessionStorage.getItem("teaAssesseEmployeeType"));
        this.assessKCMC = sessionStorage.getItem("teaAssessKCMC");
        this.assessNameCode = sessionStorage.getItem("teaAssessNameCode");
        this.assessTableId = parseInt(sessionStorage.getItem("teaAssessTableId"));
        this.assessTargetId = parseInt(sessionStorage.getItem("teaAssessTargetId"));
        this.assessResultId = sessionStorage.getItem("teaAssessResultId");
        // 判断是否显示提交按钮
        this.isCanRepeat = this.assessResultId > 0 ? this.QD.resubmitEval : true;
        this.getTeaSysEvalItemData(); // 获取试题
      },
      // 选择每题的值事件
      selectAssessVal (OptId, optId, val, idx, opidx) {
        // this.isSelected = optId;
        this.resultList[idx].OptionId = optId;
        this.resultList[idx].Opidx = opidx;
        this.resultList[idx].Result = val;
        this.teaItemList[idx].OptId = -1;
      },
      // 提交测评试卷
      /*"XH": "学号", 学生要加，老师不要加或加当前的UserId或职工ZGH
       "Comments": "sample string 2",   评语
       "ResultList": "sample string 3",
       "EmployeeType": 4,
       "UserType": 1   1是老师，4是学生
       XH={0}&amp;EmployeeType={1}&amp;ResultList={2}&amp;Comments={3}&amp;UserType={4}
       */
      async assessSubmit () {
        // 遍历双重数组，形成提交数据
        for (let i=0; i<this.resultList.length; i++){
          for (let j = 0; j < this.teaItemList.length; j++) {
            if (this.resultList[i].OptionId === 0 && this.resultList[i].Opidx === 0 && this.resultList[i].ItemId === this.teaItemList[j].ItemId) {
              for (let k = 0; k < this.teaItemList[j].OptionList.length; k++) {
                if (this.teaItemList[j].OptionList[k].OptId === this.teaItemList[j].OptId) {
                  this.resultList[i].OptionId = this.teaItemList[j].OptionList[k].OptId;
                  this.resultList[i].Opidx = k;
                  continue;
                }
              }
            }
          }
        }
        let isSameAns = true;
        let isDone = true;
        let userFirstAns = this.resultList[0].Opidx
        for (let i = 0; i < this.resultList.length; i++) {
          if (this.resultList[i].Opidx !== userFirstAns){
            isSameAns = false;
          }
          if (this.resultList[i].OptionId === 0) {
            isDone = false;
          }
        }
        // 判断是选项类型还是填空类型
        if (this.InputOnly === 'false'){ // 选项
          if (!isDone) {
            this.QD.alert('', '选项必填~');
            return;
          } else if (isSameAns && userFirstAns === 0 && this.isSubmitResaultSame === '0'){
            this.QD.alert('', '测评结果不能所有项目都选择最大值！');
            return;
          } else if (isSameAns && userFirstAns === this.resultList[0].OptionNum-1 && this.isSubmitResaultSame === '0'){
            this.QD.alert('', '测评结果不能所有项目都选择最小值！');
            return;
          } else if (isSameAns && this.isSubmitResaultSame === '0'){
            this.QD.alert('', '测评结果不能所有项目都选择相同！');
            return;
          }
        } else { // 填空
          var maxScore = sessionStorage.getItem("teaAssessMaxScore");
          var minScore = sessionStorage.getItem("teaAssessMinScore");
          maxScore = maxScore - 0;
          minScore = minScore - 0;
          let stuScore = 0;
          let isDone = true;
          this.resultList.forEach(item => {
            stuScore += item.Result
            if (item.Result === 0){
              isDone = false;
            }
          })
          if (!isDone) {
            this.QD.alert('', '选项必填~')
            return
          } else if (stuScore === minScore) {
            this.QD.alert('', '测评结果不能所有项目都填写最小值！')
            return
          } else if (stuScore === maxScore) {
            this.QD.alert('', '测评结果不能所有项目都填写最大值！')
            return
          }
        }
        if (this.mustInputPingYu !== '0'){
          this.QD.alert("", "请填写您的建议或评语")
          return
        }
        let mlen = this.assessRemarks.replace(/[\u0391-\uFFE5]/g, "a").length;
        if (mlen>200){
          this.QD.alert('', '评语不能超过200个字！');
          return;
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'InsertSysEvalResultData',
          XH: this.QD.getLocalUserinfo().stuObj.UserId,
          EmployeeType: this.assessEmployeeType,
          ResultList: JSON.stringify(this.resultList),
          Comments: this.assessRemarks,
          UserType: 1
        });
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        if (d === 1) {
          sessionStorage.removeItem("teaAssessSubject");
          sessionStorage.removeItem("teaAssesseEmployeeType");
          sessionStorage.removeItem("teaAssessKCMC");
          sessionStorage.removeItem("teaAssessNameCode");
          sessionStorage.removeItem("teaAssessTableId");
          sessionStorage.removeItem("teaAssessTargetId");
          sessionStorage.removeItem("teaAssessResultId");
          sessionStorage.removeItem("teaAssessInputOnly");
          this.$router.replace({ path: '/teacherAssess/teacherAssessLst' });
        } else {
          this.QD.alert('', '提交失败');
        }
      },
      // 判断是否可以反复测评,false只能提交一次，true 可以反复测评
      async getResubmitEval () {
        if (sessionStorage.getItem("kaoPinResubmitEval") === null) {
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetTeacherEvalCanResubmitEvalResult'});
          if (d.status && d.status === "error") {
            this.getTeaAssessLstPageData(); // 从教师测评列表中获取sessionStorage的存储数据
            this.QD.alert(`获取数据失败:${d.msg}`);
            return;
          }
          sessionStorage.setItem("kaoPinResubmitEval", d);
          this.QD.resubmitEval = d;
        }
        this.getTeaAssessLstPageData(); // 从教师测评列表中获取sessionStorage的存储数据
      }
    },
    created () {
      this.getResubmitEval(); // 判断是否可以反复测评,false只能提交一次，true 可以反复测评
      this.getSystemConfigData(); //配置项
      this.InputOnly = sessionStorage.getItem("teaAssessInputOnly");
    },
    data () {
      return {
        loading: true,
        InputOnly: 'false', // 题型是选项还是填空  默认false 代表选项
        isCanRepeat: false, // 是否可以测评
        teaSysEvalItemData: [], // 测评卷信息
        isDefaultSelectFirstOP: '0', //是否默认选中第一项 默认0->不选中
        isSubmitResaultSame: '0', //选中项一样是否可以提交 默认0-> 选中项一样不可以提交
        mustInputPingYu: '0', //是否必须输入评语 默认0->代表否
        teaItemList: [], // 试题内容
        assessSubject: '',
        assessEmployeeType: -1,
        assessKCMC: '',
        assessNameCode: '',
        assessTableId: -1,
        assessTargetId: -1,
        assessResultId: '', // 判断是否已经提交的id
        contentTitle: '',
        assessRemarks: '', // 评语
        resultList: [], // 保存每题的所做的选项
        isSelected: 0 // 默认选中第一个选项
      }
    }
  }
</script>
<style scoped>
  .commentContent{
    display: block;
    color: #333333;
    font-size: 14px;
    padding: 15px 10px;
  }
  .assessComment>span{
    color:#333;
    padding:10px 4px;
  }
</style>
<style>
  .teacherAssessKaoPing .xs-container {
    margin-top: 0;
  }
  .teacherAssessKaoPing .teaAssessSubject{
    padding: 10px 15px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .teacherAssessKaoPing .teaAssessPaper{
    font-size: 16px;
    color: #333333;
    line-height: 18px;
    padding:10px 4px;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessProblem{
    padding: 10px 12px;
    font-size: 14px;
    color: #666666;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessProblem span:nth-child(1){
    color: #333333;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessProblem span{
    padding-top: 2px;
    padding-bottom: 2px;
    margin-top: 2px;
    line-height: 18px;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessProblem .selectedBGColor{
    color: white;
    background-color: #44a9d4;
    border-radius: 3px;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessProblem input{
    width: 18px;
    height: 18px;
    margin-left: 4px;
    vertical-align: middle;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessProblem .InputScore{
    margin-top:10px;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessProblem .InputScore input{
    width:auto;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessComment .weui-cell{
    margin-top:8px;
  }
  .teacherAssessKaoPing .vux-x-textarea.weui-cell .weui-cell__bd textarea{
    font-size: 14px;
    color: #666666;
    margin-top:10px;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessSubmit{
    margin-bottom: 10px;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  .teacherAssessKaoPing .assessSubjectContent .assessSubmit a{
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
</style>
