<template>
  <div class="eachPgBase mERegister">
    <div class="eachPgBase container">
      <group class="gp">
        <datetime
          format="YYYY-MM-DD HH:mm" :minute-list="['00','01', '02', '03', '04', '05', '06', '07', '08','09', '10', '11',
         '12', '13', '14', '15', '16','17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35',
         '36', '37', '38', '39', '40','41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']"
          v-model="breachTime">
          <span slot="title" class="vux-label">时间</span>
        </datetime>
        <cell @click.native="goSelectStuMoral()" :is-link="true">
          <span slot="after-title" class="vux-label">学生</span>
          <span class="cell-right">{{selectStuName}}</span>
        </cell>
        <cell @click.native="goSelectMEExamItem()" :is-link="true">
          <span slot="after-title" class="vux-label">项目</span>
          <div class="cell-right">
          <span class="each-item" v-if="itemInfo.length > 0"
                v-for="(s, sIdx) in itemInfo" :key="sIdx">
            <i v-if="sIdx !== 0"> , </i>
            {{s.ProjectName}}
          </span>
            <span v-if="itemInfo.length === 0">选择</span>
          </div>
        </cell>
        <div v-if="itemInfo.length > 0" class="gp-descTitle">加减分</div>
        <cell v-if="itemInfo.length > 0" v-for="(s, sIdx) in itemInfo" :key="sIdx">
          <span slot="after-title" class="autoWidth">{{s.ProjectName}}</span>
          <div class="cell-right">
            <span v-if="s.Type === '1'" class="negative-mark">-</span>
            <input type="number" v-model="s.Point" class="point-input" />
          </div>
        </cell>
        <div class="gp-descTitle">备注</div>
        <x-textarea class="remark-box" placeholder="请填写备注" :show-counter="false" :rows="1" autosize v-model="remark"></x-textarea>
      </group>
      <upload-img-file class="imgFileBox" :imgFileMulti="false" :showImgLst="imgData.showImgLst" :imgInfoLst="imgData.imgLst" @get-imgLst="getImgData"></upload-img-file>
      <x-button-one :titleVal="'保存'" @click-button="mEStudentProjectRequestInsert"></x-button-one>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import XButtonOne from './common/XButtonOne.vue'

  import UploadImgFile from './common/UploadImgFile.vue'
  import { mapActions } from 'vuex'
  export default {
    name: "dailyMeReg",
    directives: {
      TransferDom
    },
    components: {
      Datetime,
      Cell,
      Group,
      XTextarea,
      UploadImgFile,
      XButtonOne
    },
    methods: {
        // 选择德育项目
      goSelectMEExamItem () {
        this.saveCurrPageData();
        this.$router.push({path: '/selectMEExamItem'});
      },
      // 选择学生
      goSelectStuMoral () {
        this.saveCurrPageData();
        this.$router.push({path: '/selectStudentMoral'});
      },
      // 得到图片附件
      getImgData(e) {
        console.log("img", e);
        this.imgData = e;
        this.atts = [];
        for (let i=0; i<e.imgLst.length; i++) {
          let si = e.imgLst[i];
          this.atts.push({
            FileName: si.FileName, // 附件名称
            FilePath: si.AttData // 图片的base64编码
          })
        }
      },
        // 点击保存，德育登记
      async mEStudentProjectRequestInsert() {
        if (!this.stuXH){
          this.QD.alert('', '请选择学生');
          return;
        }
        if (this.itemInfo.length === 0){
          this.QD.alert('', '请选择项目');
          return;
        }
        // SaveStuMoralEduData
        let items = [];
        for (let i=0; i<this.itemInfo.length; i++) {
          let si = this.itemInfo[i];
          items.push({
            ItemId: si.ID, // 项目id
            ItemParent: si.ParentID, // 项目类型id
            AddOrSub: si.Type, // 加减分类型
            ScoreValue: si.Point // 分数
          })
        }
        let objData = {XH: this.stuXH, Remark: this.remark, BreachTime: this.breachTime, Items: items, Atts: this.atts};
        console.log("obj data", objData);
        let that = this;
        this.QD.confirm('', '确认登记', async function() {
          that.updateLoadingStatus(true);
          let d = await that.QD.getData('/ComApi/PostObject', {apiName: 'SaveStuMoralEduData', objData: JSON.stringify(objData)});
          that.updateLoadingStatus(false);
          console.log("d", d);
          if (d.status && d.status === "error") {
            that.QD.alert('', '登记失败');
            return;
          }
          that.$router.go(-1); // 登记成功
        }, '');
      },
        // 获取当前时间
      getCurrTime() {
        this.breachTime = this.QD.getDateOrTime(); // 得到当前时间
        this.breachTime = this.breachTime.substr(0, 16); // 去掉秒，保留年月日时分
      },
      // 从sessionStorage中取选择学生信息
      getStuData(){
        // 判断是扫码获取的学生信息（isSelectStu = 'false'），还是手动选择获取学生信息(isSelectStu = 'true')
        if (sessionStorage.getItem("isSelectStuForME") !== null) {
          this.isSelectStu = sessionStorage.getItem("isSelectStuForME");
        }
          // 从app.vue扫描结果中得到学号 学生的学号和姓名
        if (this.isSelectStu === "false" && sessionStorage.getItem("myClassStuQrCodeXM") !== null && sessionStorage.getItem("myClassStuQrCodeXH") !== null) {
          this.selectStuName = sessionStorage.getItem("myClassStuQrCodeXM");
          this.stuXH = sessionStorage.getItem("myClassStuQrCodeXH");
        } else if (this.isSelectStu === "true" && sessionStorage.getItem("selectStuMEList") !== null) {
          /*从选择学生中得到学生的姓名 和学生id*/
          let stuData = JSON.parse(sessionStorage.getItem("selectStuMEList")); // 从sessionStorage中取选择学生信息中的姓名
          this.selectStuName = stuData[0].name;
          this.stuXH = stuData[0].XH;
        } else {
          this.selectStuName = '选择';
        }
      },
      // 保存本页面的数据 - 时间
      saveCurrPageData () {
        this.QD.currPageData = {breachTime: this.breachTime, remark: this.remark, itemInfo: this.itemInfo, imgData: this.imgData, atts: this.atts};
      },
      // 得到当前页面保存的数据
      getCurPageData () {
        if (sessionStorage.getItem("semesterId") !== null) {
          this.xqId = sessionStorage.getItem("semesterId"); // 获得当前学期id
        } else {
          this.$router.go(-1); // 没有当前学期时，返回到列表页面
        }
        if (this.QD.currPageData) {
          let qd = this.QD.currPageData;
          this.breachTime = qd.breachTime;
          this.remark = qd.remark;
          this.itemInfo = qd.itemInfo; // 项目
          this.imgData = qd.imgData; // 附件
          this.atts = qd.atts;
          this.QD.currPageData = null;
        } else {
          this.getCurrTime(); // 获取当前时间
        }
        this.getXFInfo(); // 得到学分信息
        this.getStuData(); // 得到学生信息
      },
      // 得到学分信息
      getXFInfo () {
        console.log("itemInfo", this.itemInfo);
        if (this.QD.otherPageData || this.itemInfo) {
          let qd = [];
          if (this.QD.otherPageData) {
            qd = this.QD.otherPageData.itemInfo;
            this.QD.otherPageData = null;
          } else {
            qd = this.itemInfo;
          }
          this.itemInfo = qd;
          if (this.remark === '') { // 当用户没有写备注时，根据选中的项目自动生成备注
            for (let i=0; i<this.itemInfo.length; i++) {
              let si = this.itemInfo[i];
              if (i !== 0) {
                this.remark += ' , ';
              }
              this.remark += si.ProjectName;
            }
          }
        }
      },
      ...mapActions([
        'updateLoadingStatus'
      ])
    },
    created () {
      this.getCurPageData(); // 得到当前页面保存的数据
    },
    data () {
      return {
        breachTime: '', // 违纪时间
        remark: '', // 学分项目细则备注
        itemInfo: [], // 选中的项目信息
        imgData: {imgLst: [], showImgLst: []}, // 附件数据
        atts: [], // 传入接口的附件数据
        xqId: '', // 学期id
        isSelectStu: "false", // 是否进入选择学生页面
        selectStuName: '', // 存学生姓名
        stuXH: '' // 扫码得到的学号
      }
    }
  }
</script>
<style scoped>
  .container{
    margin-bottom: 60px;
  }
  .gp{
    margin-top: -20px;
  }
  .mERegister .vux-label{
    display: inline-block;
    width: 40px;
    color: #333333;
    font-size: 16px;
  }
  .cell-right{
    color: #666666;
    font-size: 16px;
    text-align: right;
  }
  .each-item{
    display: inline-block;
    padding-left: 4px;
  }
  .autoWidth{
    color: #333333;
    font-size: 16px;
  }
  .negative-mark{
    color: #bd2c00;
  }
  .point-input{
    outline: none;
    width: 80px;
    height: 24px;
    border: 1px solid #d4d4dd;
    padding: 0 4px;
  }
  .remark-box{
    font-size: 14px;
    color: #666666;
    font-family:'Microsoft YaHei','\5FAE\8F6F\96C5\9ED1';
  }
  .imgFileBox{
    margin-top: -10px;
  }
  .mERegister .weui-cell .dweui-textarea{
    width: 100%;
    height: 80px;
    display: block;
    padding: 4px;
    resize: none;
    color: #333333;
    font-size: 14px;
    line-height: inherit;
    outline: 0;
    border: 1px solid #efe9e9;
  }
</style>
<style>
  .mERegister .weui-cell .weui-cell__bd .span-textarea{
    color: #999999;
    font-size: 16px;
  }
</style>
