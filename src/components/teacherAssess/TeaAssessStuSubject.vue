<template>
  <div class="assessStuSubject">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div>
      <div class="stuAssessSubject">
        <span>{{assessSubject}}</span>
      </div>
      <div class="stuAssessPaper">
        <span>学生：{{assessNameCode}}</span>
        <br/>
        <span>课程：{{assessKCMC}}</span>
        <span v-if="assessResultId > 0">（已提交）</span>
        <br/>
      </div>
      <div class="assessSubjectContent" v-if="stuItemList !== null && stuItemList.length > 1">
        <div v-for="(item,idx) in stuItemList" :key="idx" class="assessProblem">
          <span v-html="item.Title"></span>
          <div v-if="InputOnly === 'false'">
            <span v-for="(op,oIdx) in item.OptionList" :key="oIdx" style="display: block" @click="selectAssessVal(op.OptId,op.Value,idx,oIdx)" :class="resultList[idx].OptionId === op.OptId || item.OptId === op.OptId ? 'selectedBGColor':''">
              <input type="radio" :name="'optionTeaAssessValue' + idx" :value="op.Value" :checked="resultList[idx].OptionId === op.OptId || item.OptId === op.OptId"/>
              {{op.Name}}
            </span>
          </div>
          <div v-else class="InputScore">
            <span>评分：</span>
            <input type="number" ref="inp" @input="inputTeaScore(item.ItemId,idx)">
          </div>
        </div>
        <div class="assessComment" v-if="stuSysEvalItemData.IsComment === 1" style="margin-bottom: 60px;">
          <span>对该学生的意见或建议：</span>
          <x-textarea placeholder="请输入评语" :show-counter="false" :rows="1" autosize v-model="assessRemarks"></x-textarea>
        </div>
        <div class="assessSubmit" @click="assessSubmit">
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
    name: "teaAssessStuSubject",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      XTextarea
    },
    methods: {
        //输入分数
      inputTeaScore(itemId, idx){
        console.log(this.$refs.inp[idx].value, itemId)
        let val = this.$refs.inp[idx].value-0;
        console.log(typeof val)
        this.resultList[idx].OptionId = itemId;
        this.resultList[idx].Opidx = 0;
        this.resultList[idx].Result = val;
      },
      // 选择每题的值事件
      selectAssessVal (optId, val, idx, opidx) {
        // this.isSelected = optId;
        this.resultList[idx].OptionId = optId;
        this.resultList[idx].Opidx = opidx;
        this.resultList[idx].Result = val;
        this.stuItemList[idx].OptId = -1;
      },
      async assessSubmit(){
        for (let i=0; i<this.resultList.length; i++){
          for (let j=0; j<this.stuItemList.length; j++){
            if (this.resultList[i].OptionId === 0 && this.resultList[i].Opidx === 0 && this.resultList[i].ItemId === this.stuItemList[j].ItemId){
              for (let k=0; k<this.stuItemList[j].OptionList.length; k++){
                if (this.stuItemList[j].OptionList[k].OptId === this.stuItemList[j].OptId){
                  this.resultList[i].OptionId = this.stuItemList[j].OptionList[k].OptId;
                  this.resultList[i].Opidx = k;
                  continue;
                }
              }
            }
          }
        }
        let isSameAns = true;
        let userFirstAns = this.resultList[0].Opidx
        for (let i = 0; i < this.resultList.length; i++) {
          if (this.resultList[i].Opidx !== userFirstAns){
            isSameAns = false;
          }
        }
        if (this.InputOnly === 'false'){
          if (isSameAns && userFirstAns === 0){
            this.QD.alert('', '测评结果不能所有项目都选择最大值！');
            return;
          } else if (isSameAns && userFirstAns === this.resultList[0].OptionNum-1){
            this.QD.alert('', '测评结果不能所有项目都选择最小值！');
            return;
          } else if (isSameAns && this.isSubmitResaultSame === '0'){
            this.QD.alert('', '测评结果不能所有项目都选择相同！');
            return;
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
        /*let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'InsertSysEvalResultData',
          XH: this.QD.getLocalUserinfo().stuObj.UserId,
          EmployeeType: this.assessEmployeeType,
          ResultList: JSON.stringify(this.resultList),
          Comments: this.assessRemarks,
          UserType: 1
        });*/
        let d = -1;
        sessionStorage.removeItem("teaAssessSubject");
        sessionStorage.removeItem("teaAssesseEmployeeType");
        sessionStorage.removeItem("teaAssessKCMC");
        sessionStorage.removeItem("teaAssessNameCode");
        sessionStorage.removeItem("teaAssessTableId");
        sessionStorage.removeItem("teaAssessTargetId");
        sessionStorage.removeItem("teaAssessResultId");
        sessionStorage.removeItem("teaAssessInputOnly");
        if (d === 1) {
          /*sessionStorage.removeItem("teaAssessSubject");
          sessionStorage.removeItem("teaAssesseEmployeeType");
          sessionStorage.removeItem("teaAssessKCMC");
          sessionStorage.removeItem("teaAssessNameCode");
          sessionStorage.removeItem("teaAssessTableId");
          sessionStorage.removeItem("teaAssessTargetId");
          sessionStorage.removeItem("teaAssessResultId");
          sessionStorage.removeItem("teaAssessInputOnly");*/
          this.$router.replace({ path: '/teacherAssess/teaAssessStuLst' });
        } else {
          this.QD.alert('', '提交失败');
        }
      },
      //获取配置项
      async GetSystemConfigData (){
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSystemConfigData', keyName: 'WebConfig_rblTeacherEvalFirstOptionSelected,WebConfig_rblTeacherEvalAllowSameResult,WebConfig_rblTeacherEvalStudentCommentRequired'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        console.log("获取配置项数据", d)
        this.isSubmitResaultSame = d.data[0].itemValue //选中项一样是否可以提交
        this.isDefaultSelectFirstOP = d.data[1].itemValue //是否默认选中第一项
        this.mustInputPingYu = d.data[2].itemValue //是否必须输入评语
        this.getTeaAssessStuData();
      },
      // 获取试题信息
      getTeaAssessStuData () {
        this.stuSysEvalItemData = {"TargetId": "436",
          "TableId": "4",
          "IsComment": 1,
          "ItemList": [{
            "ItemId": 17,
            "Title": "1.教学素养",
            "OptionNum": 6,
            "OptionList":
            [{"OptId": 108, "ItemId": 17, "Name": "教仪、教态好", "Value": 6.00},
              {"OptId": 109, "ItemId": 17, "Name": "较好", "Value": 5.00},
              {"OptId": 110, "ItemId": 17, "Name": "一般", "Value": 4.00},
              {"OptId": 111, "ItemId": 17, "Name": "不好", "Value": 3.00}],
            "OptId": 108
          },
          {
            "ItemId": 18,
            "Title": "2.学生考勤",
            "OptionNum": 6,
            "OptionList":
            [{"OptId": 108, "ItemId": 17, "Name": "认真做好考勤", "Value": 6.00},
              {"OptId": 109, "ItemId": 17, "Name": "较认真考勤", "Value": 5.00},
              {"OptId": 110, "ItemId": 17, "Name": "一般考勤", "Value": 4.00},
              {"OptId": 111, "ItemId": 17, "Name": "基本不考勤", "Value": 3.00}],
            "OptId": 109
          }
          ]};
        this.stuItemList = this.stuSysEvalItemData.ItemList; // 试题内容
        // 试题内容
        for (let i = 0; i < this.stuItemList.length; i++){
          // 获取每一题的第一个选项的id
          this.isSelected = this.stuItemList[i].OptionList[0].OptId;
          // 解析每一题
          this.stuItemList[i].Title = this.stuItemList[i].Title.replace(new RegExp(/(\\n)/g), '<br />');
          // 未作答时默认选中第一个选项的value值
          let selectOptVal = this.stuItemList[i].OptionList[0].Value;
          // 已提交时找出该作答选项
          if (this.stuItemList[i].OptId > 0) {
            for (let j = 0; j < this.stuItemList[i].OptionList.length; j++) {
              // 已提交时找出该作答选项
              if (this.stuItemList[i].OptId === this.stuItemList[i].OptionList[j].OptId){
                selectOptVal = this.stuItemList[i].OptionList[j].Value;
              }
            }
          }
          // 保存每题默认选中的作答的值
          if (this.isDefaultSelectFirstOP === "1"){
            this.resultList.push({
              TargetId: this.assessTargetId,
              TableId: this.assessTableId,
              ItemId: this.stuItemList[i].ItemId,
              Opidx: 0,
              OptionId: this.stuItemList[i].OptId > 0 ? this.stuItemList[0].OptId : this.stuItemList[0].OptionList[0].OptId,
              Result: selectOptVal
            });
          } else {
            this.resultList.push({
              TargetId: this.assessTargetId,
              TableId: this.assessTableId,
              ItemId: this.stuItemList[i].ItemId,
              Opidx: 0,
              OptionId: 0,
              Result: selectOptVal
            })
          }
        }
      },
      getStuAssessLstPageData () {
        this.assessSubject = sessionStorage.getItem("teaAssessSubject");
        this.assessEmployeeType = parseInt(sessionStorage.getItem("teaAssesseEmployeeType"));
        this.assessKCMC = sessionStorage.getItem("teaAssessKCMC");
        this.assessNameCode = sessionStorage.getItem("teaAssessNameCode");
        this.assessTableId = parseInt(sessionStorage.getItem("teaAssessTableId"));
        this.assessTargetId = parseInt(sessionStorage.getItem("teaAssessTargetId"));
        this.assessResultId = sessionStorage.getItem("teaAssessResultId");
      }
    },
    created () {
      this.getStuAssessLstPageData(); // 从学生测评列表中获取sessionStorage的存储数据
      this.GetSystemConfigData();
      this.InputOnly = sessionStorage.getItem("teaAssessInputOnly");
//      this.InputOnly = true;
      console.log(this.InputOnly, "this.InputOnly")
    },
    data () {
      return {
        loading: false,
        InputOnly: false,
        isDefaultSelectFirstOP: true, //是否默认选中第一项
        isSubmitResaultSame: false, //选中项一样是否可以提交
        mustInputPingYu: false, //是否必须输入评语
        stuSysEvalItemData: [], // 测评卷信息
        stuItemList: [], // 试题内容
        assessSubject: '',
        assessEmployeeType: -1,
        assessKCMC: '',
        assessNameCode: '',
        assessTableId: -1,
        assessTargetId: -1,
        assessResultId: '', // 判断是否已经提交的id
        resultList: [], // 保存每题的所做的选项
        assessRemarks: '' // 评语
      }
    }
  }
</script>
<style scoped>
  .assessStuSubject .stuAssessSubject{
    padding: 10px 15px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .assessStuSubject .stuAssessPaper{
    font-size: 16px;
    color: #333333;
    line-height: 18px;
    padding:10px 4px;
  }
  .assessStuSubject .assessSubjectContent .assessProblem{
    padding: 10px 12px;
    font-size: 14px;
    color: #666666;
  }
  .assessStuSubject .assessSubjectContent .assessProblem span:nth-child(1){
    color: #333333;
  }
  .assessStuSubject .assessSubjectContent .assessProblem span{
    padding-top: 2px;
    padding-bottom: 2px;
    margin-top: 2px;
    line-height: 18px;
  }
  .assessStuSubject .assessSubjectContent .assessProblem .selectedBGColor{
    color: white;
    background-color: #44a9d4;
    border-radius: 3px;
  }
  .assessStuSubject .assessSubjectContent .assessProblem input{
    width: 18px;
    height: 18px;
    margin-left: 4px;
    vertical-align: middle;
  }
  .assessStuSubject .assessSubjectContent .assessProblem .InputScore{
    margin-top:10px;
  }
  .assessStuSubject .assessSubjectContent .assessProblem .InputScore input{
    width:auto;
  }
  .assessStuSubject .assessSubjectContent .assessSubmit{
    margin-top: 10px;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  .assessStuSubject .assessSubjectContent .assessSubmit a{
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
  .assessComment>span{
    color:#333;
    padding:10px 4px;
  }
  .assessComment .weui-cell{
    margin-top:10px;
  }

</style>
<style>
  .assessStuSubject .xs-container {
    margin-top: 0;
  }
  .assessStuSubject .vux-x-textarea.weui-cell .weui-cell__bd textarea{
    font-size: 14px;
    color: #666666;
  }
</style>
