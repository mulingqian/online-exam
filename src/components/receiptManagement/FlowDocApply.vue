<template>
  <div class="flowDocApply">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="flowDocApplyGroup" style="padding-bottom: 60px;">
      <x-input placeholder="请输入标题" v-model="documentTitle" :text-align="'right'">
        <div slot="label">
          <span><span class="school-wx-icon requireIcon">&#xe644;</span>标题</span>
        </div>
      </x-input>
      <x-input placeholder="请输入文号" v-model="applyNum" :text-align="'right'">
        <div slot="label">
          <span><span class="school-wx-icon requireIcon">&#xe644;</span>文号</span>
        </div>
      </x-input>
      <datetime
        v-model="fromDay"
        @on-change="fromDayChange"
        title="来文日期">
      </datetime>
      <cell :value="fromByUnit" is-link @click.native="goSelectFlowDocFromBy()" class="fromByUnitCell">
        <span slot="after-title" class="vux-label">
         <span>来文单位</span>
        </span>
      </cell>
      <cell :is-link="true" @click.native="showUrgentMsg">
        <div slot="after-title" class="vux-label">
         <span><span class="school-wx-icon requireIcon">&#xe644;</span>紧急度</span>
        </div>
        <span slot="default">
          <span class="rg-cell">{{urgentValue}}</span>
        </span>
      </cell>
      <cell :is-link="true" @click.native="showImportMsg">
        <div slot="after-title" class="vux-label">
         <span><span class="school-wx-icon requireIcon">&#xe644;</span>重要性</span>
        </div>
        <span slot="default">
          <span class="rg-cell">{{importValue}}</span>
        </span>
      </cell>
      <cell :is-link="true" @click.native="showFileSecretMsg">
        <div slot="after-title" class="vux-label">
         <span><span class="school-wx-icon requireIcon">&#xe644;</span>文件密级</span>
        </div>
        <span slot="default">
          <span class="rg-cell">{{fileSecretValue}}</span>
        </span>
      </cell>
      <datetime
        v-model="deadlineDate"
        @on-change="deadlineChange" :placeholder="'请选择'">
        <div slot="title" class="vux-label"><span class="school-wx-icon requireIcon">&#xe644;</span>处理期限</div>
      </datetime>
      <cell :is-link="true" @click.native="goSelectMultiTeacher()">
        <span slot="after-title" class="vux-label" style="display:inline-block;width: 120px;">
         <span>选择批阅的人员</span>
        </span>
        <span>
          <span class="rg-cell">
            <a>{{selectMultiEmployeeNameLst}}</a>
          </span>
        </span>
      </cell>

      <x-textarea placeholder="拟办意见" :show-counter="false" :rows="1" autosize v-model="fileOpinion"></x-textarea>
      <x-textarea placeholder="处理结果" :show-counter="false" :rows="1" autosize v-model="applyResult"></x-textarea>
      <cell>
        <span slot="after-title" class="vux-label">附件</span>
        <span slot><label for="uploadFlowDocImg" class="school-wx-icon" style="color:#f0ad4e;">&#xe614;</label></span>
      </cell>
      <x-img :src="srcImg" :default-src="srcImg" style="width: 120px;height: 120px;margin-left: 30%;" v-show="this.srcImg !== null"></x-img>
      <span class="school-wx-icon" style="position: relative;top: -105px;left: -5px;" v-show="this.srcImg !== null" @click="clearImg">&#xe627;</span>
      <input type="file" accept="image/*" value="" id="uploadFlowDocImg" style="display: none;" @change="flowDocImgFile($event)" ref="imgInput" />
    </group>
    <div v-transfer-dom>
      <actionsheet v-model="showUrgentPanel" :menus="urgentLists" show-cancel @on-click-menu="getUrgentValue"></actionsheet>
      <actionsheet v-model="showImportPanel" :menus="importLists" show-cancel @on-click-menu="getImportValue"></actionsheet>
      <actionsheet v-model="fileSecretPanel" :menus="fileSecretLists" show-cancel @on-click-menu="getFileSecretValue"></actionsheet>
    </div>

    <div class="btn-box">
      <x-button @click.native="submitFlowDocApply" type="primary" class="btn-save" mini>保存</x-button>
    </div>

  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Scroller from 'vux/src/components/scroller/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'

  import XButton from 'vux/src/components/x-button/index.vue'

  import XImg from 'vux/src/components/x-img/index.vue'
  import lrz from 'lrz'
  export default {
    name: 'flowDocApply',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      XTextarea,
      Scroller,
      Cell,
      Group,
      Actionsheet,
      Datetime,
      XButton,
      XImg,
      lrz,
      XInput
    },
    methods: {
      // 删除图片
      clearImg () {
        this.srcImg = null;
      },
      // 将图片转换成base64位并显示在页面上
      flowDocImgFile (e) {
        let file = e.target.files[0];
        // 计算图片大小，默认是B，转换成KB
        let fsize = parseInt((file.size)/1024);
        if (!/image\/\w+/.test(file.type)) {
          alert("请确保文件为图像类型");
          return false;
        }
        let _this = this;
        let qua = this.QD.compressSize / fsize;
        qua = Math.round(qua*100)/100;

        if (fsize > 200) {
          /* 压缩 qua */
          lrz(file, {                  // 压缩图片
            quality: qua
          }).then(function (rst) {
            /* 处理成功后执行 */
            _this.srcImg = rst.base64;
          }).catch( function () {
            /* 处理失败后执行 */
          }).always(function () {
            /* 必然执行 */
          })
        } else {
          /* 不压缩 */
          let reader = new FileReader();
          reader.onload = function(e){
            _this.srcImg = this.result;
          };
          reader.readAsDataURL(file);
        }
      },
      //以可以上传的形式base64 保存图片
      saveLog () {
        if (this.srcImg !== null) {
          this.FileDataImg = this.srcImg.split(',')[1];
        } else {
          this.FileDataImg = '';
        }
      },
      // 选择来文日期
      fromDayChange (value) {
        this.fromDay = value;
      },
      // 选择处理期限日期
      deadlineChange (value) {
        this.deadlineDate = value;
      },
      // 下面的面板是否出现，选择紧急度
      showUrgentMsg () {
        this.showUrgentPanel = !this.showUrgentPanel;
      },
      // 下面的面板是否出现，选择重要性
      showImportMsg () {
        this.showImportPanel = !this.showImportPanel;
      },
      // 下面的面板是否出现，选择文件密级
      showFileSecretMsg () {
        this.fileSecretPanel = !this.fileSecretPanel;
      },
      // 在面板出现后，选择紧急度值
      getUrgentValue (key, item) {
        if (item !== undefined && item !== this.urgentValue) {
          this.urgentValue = item;
          if (this.urgentValue === '普通') {
            this.urgentNum = '4';
          }
          if (this.urgentValue === '紧急') {
            this.urgentNum = '2';
          }
          if (this.urgentValue === '非常紧急') {
            this.urgentNum = '1';
          }
        }
      },
      // 在面板出现后，选择重要性值
      getImportValue (key, item) {
        if (item !== undefined && item !== this.importValue) {
          this.importValue = item;
          if (this.importValue === '普通') {
            this.importNum = '4';
          }
          if (this.importValue === '重要') {
            this.importNum = '2';
          }
          if (this.importValue === '非常重要') {
            this.importNum = '1';
          }
        }
      },
      // 在面板出现后，选择文件密级
      getFileSecretValue (key, item) {
        if (item !== undefined && item !== this.typeValue) {
          this.fileSecretValue = item;
          if (this.fileSecretValue === '甲') {
            this.fileSecretNum = '1';
          }
          if (this.fileSecretValue === '乙') {
            this.fileSecretNum = '2';
          }
          if (this.fileSecretValue === '丙') {
            this.fileSecretNum = '4';
          }
          if (this.fileSecretValue === '丁') {
            this.fileSecretNum = '8';
          }
        }
      },
      // 选择教师（可以多选的）
      goSelectMultiTeacher () {
        this.setCurPageData();
        this.saveMultiTeaData(); // 保存多选教师的信息
        this.$router.push({path: '/commonSelect/selectMultiTea'});
      },
      // 保存多选的教师信息
      saveMultiTeaData () {
        let nameLst = [];
        let zghLst = [];
        if (this.selectMultiEmployeeZGHLst.length > 0) {
          nameLst = this.selectMultiEmployeeNameLst.split(',');
          zghLst = this.selectMultiEmployeeZGHLst.split(',');
          this.QD.otherPageData = {nameLst: nameLst, zghLst: zghLst}; // 保存选择教师的信息
        }
      },
      // 得到（多选）教师的信息
      getSelectMultiTeacherData () {
        //得到选择教师的信息
        if (this.QD.otherPageData) {
          let s = this.QD.otherPageData;
          this.selectMultiEmployeeNameLst = s.nameLst.join(',');
          this.selectMultiEmployeeZGHLst = s.zghLst.join(',');
          this.QD.otherPageData = null;
        } else {
          this.selectMultiEmployeeNameLst = '选择';
        }
      },
      // 选择来文单位
      goSelectFlowDocFromBy () {
        this.setCurPageData();
        this.saveMultiTeaData(); // 保存多选教师的信息
        this.$router.push({path: '/receiptManagement/selectFlowDocFromBy'});
      },
      // 得到来文单位
      getSelectFlowDocFromBy () {
        if (sessionStorage.getItem("flowDocUnit") !== null) {
          this.fromByUnit = sessionStorage.getItem("flowDocUnit");
          sessionStorage.removeItem("flowDocUnit");
        }
      },
      // 得到本页存在sessionStorage中的数据
      getCurrPageData () {
        if (this.QD.brotherPageData) {
          let cd = this.QD.brotherPageData;
          this.documentTitle = cd.documentTitle;
          this.applyNum = cd.applyNum;
          this.fromDay = cd.fromDay;
          this.deadlineDate = cd.deadlineDate;
          this.urgentValue = cd.urgentValue;
          this.importValue = cd.importValue;
          this.fileSecretValue = cd.fileSecretValue;
          this.fileOpinion = cd.fileOpinion;
          this.applyResult = cd.applyResult;
          this.srcImg = cd.srcImg;
          this.QD.brotherPageData = null;
        } else {
          let curDate = this.QD.getDateOrTime("date");
          this.fromDay = curDate; // 来文日期
          this.deadlineDate = curDate; // 处理期限
        }
      },
      // 提交公文流转申请
      async submitFlowDocApply () {
        let newFromByUnit;
        let _this = this;
        this.saveLog(); // 得到图片
        if (this.documentTitle === ''){
          this.QD.alert('', '请输入标题');
          return;
        }
        if (this.applyNum === ''){
          this.QD.alert('', '请输入文号');
          return;
        }
        if (this.applyResult.length > 300){
          this.QD.alert('', '处理结果长度不能超过300个字');
          return;
        }
        if (this.fileOpinion.length > 300){
          this.QD.alert('', '拟办意见长度不能超过300个字');
          return;
        }
        if (this.fromByUnit === '请选择') { // 来文单位
          newFromByUnit = '';
        } else {
          newFromByUnit = this.fromByUnit;
        }
        this.QD.confirm('', '确认保存', async function(){
          _this.loading = true;
          let d = await _this.QD.getData('/ComApi/PostObject', {apiName: 'InsertFlowDocProcessData',
            Subject: _this.documentTitle,
            Number: _this.applyNum,
            FromDay: _this.fromDay,
            FromBy: newFromByUnit,
            Urgent: _this.urgentNum,
            Importance: _this.importNum,
            Secret: _this.fileSecretNum,
            Deadline: _this.deadlineDate,
            Opinion: _this.fileOpinion,
            DocResult: _this.applyResult,
            ZGH: _this.selectMultiEmployeeZGHLst,
            FileData: _this.FileDataImg
          });
          if (d.status && d.status === "error") {
            _this.QD.alert(`获取数据失败:${d.msg}`);
          }
          _this.loading = false;
          if (d > 0){
            _this.$router.go(-1);
          } else {
            _this.QD.alert('', `登记失败`);
          }
        }, '');
      },
      // 保存本页面的信息
      setCurPageData () {
        this.QD.brotherPageData = {
          documentTitle: this.documentTitle, // 公文流转的标题
          applyNum: this.applyNum, // 公文流转的文号
          fromDay: this.fromDay, // 来文日期
          deadlineDate: this.deadlineDate, // 处理期限日期
          urgentValue: this.urgentValue, // 紧急度值
          importValue: this.importValue, // 重要性值
          fileSecretValue: this.fileSecretValue, // 文件密级
          fileOpinion: this.fileOpinion, // 拟办意见
          applyResult: this.applyResult, // 处理结果
          srcImg: this.srcImg
        };
        // 存公文流转申请的来文单位
        sessionStorage.setItem("flowDocUnit", this.fromByUnit);
      }
    },
    beforeDestroy () {
    },
    created (){
      this.getSelectMultiTeacherData(); // 得到（多选）教师的信息
      this.getSelectFlowDocFromBy(); // 得到来文单位信息 文件紧急度
      this.getCurrPageData(); // 得到当前页面sessionStorage中的数据
    },
    data () {
      return {
        loading: false,
        documentTitle: '', // 输入标题的内容
        applyNum: '', // 文号
        fromDay: '请选择', // 来文日期
        deadlineDate: '', // 处理期限日期
        fromByUnit: '请选择', // 来文单位
        showUrgentPanel: false, // 文件紧急度面板开始默认不显示
        urgentLists: ["普通", "紧急", "非常紧急"],
        urgentNum: '2', // 文件紧急度相对应的字符串数字 1 非常紧急 2紧急 4普通
        urgentValue: '紧急', // 选择的紧急度值
        showImportPanel: false, // // 文件重要性面板开始默认不显示
        importLists: ["普通", "重要", "非常重要"],
        importNum: '4', // 文件重要性相对应的字符串数字 1 非常重要 2重要 4普通
        importValue: '普通', // 选择的重要性值
        fileSecretPanel: false, // 文件密级开始默认不显示
        fileSecretLists: ["甲", "乙", "丙", "丁"], // 甲 1，乙2，丙 4，丁 8
        fileSecretValue: '丙', // 文件密级
        fileSecretNum: '4', // 文件密级对应的数字
        fileOpinion: '', // 拟办意见
        applyResult: '', // 处理结果
        selectMultiEmployeeNameLst: '选择', // 选择教师姓名数组
        selectMultiEmployeeZGHLst: '', // 选择教师职工号数组
        srcImg: null, // 上传图片处理
        FileData: '' // 上传图片处理
      }
    }
  }
</script>
<style scoped>
  .flowDocApply{
    height: auto;
  }
  .flowDocApply .vux-label{
    color: #333333;
  }
  .requireIcon{
    color: #FF0000;
    font-size: 16px;
    vertical-align: middle;
  }
  .flowDocApply .fileTitle,
  .flowDocApply .applyNumber{
    width: 100%;
    height: 25px;
    text-align: right;
    font-size: 16px;
    color: #666666;
    border:0;
    outline: none;
  }
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
  .btn-save{
    width: 100%;
    height: 40px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
  }
</style>
<style>
  .flowDocApply .weui-input{
    color: #666;
  }
  .flowDocApply .flowDocApplyGroup .weui-cells{
    margin-top: 0;
  }
  .flowDocApply .weui-cells .vux-datetime div p{
    color: #333333;
  }
  .flowDocApply .weui-cells .vux-datetime .vux-datetime-value .vux-cell-value{
    font-size: 16px;
    color: #666666;
  }
  .flowDocApply .weui-cell .vux-cell-primay p .vux-label span{
    font-size: 16px;
    color: #333333;
  }
  .flowDocApply .weui-cell .weui-cell__ft .rg-cell{
    padding-right: 10px;
    font-size: 16px;
    color: #666666;
  }
  .flowDocApply .fromByUnitCell .weui-cell__ft{
    width: 70%;
    font-size: 16px;
    color: #666;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /*状态值面板*/
  .flowDocApply .weui-actionsheet__menu .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
  .flowDocApply .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
  .flowDocApply .vux-x-textarea.weui-cell .weui-cell__bd textarea{
    font-family: "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1";
    font-size: 14px;
    color: #333333;
  }
</style>

