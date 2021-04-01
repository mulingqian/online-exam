<template>
  <div class="upload-certificate">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="gp">
      <cell>
        <span slot="after-title">姓名</span>
        <span>{{stuXM}}</span>
      </cell>
      <cell>
        <span slot="after-title">班级</span>
        <span>{{bjmc}}</span>
      </cell>
      <cell>
        <span slot="after-title">班主任</span>
        <span>{{bzr}}</span>
      </cell>
      <popup-picker title="获得学期" v-model="hjXq" :data="xqLst" @on-change="getXqIdWay"></popup-picker>
      <popup-picker title="证书类别" v-model="seleCertifiTypeVal" :data="certifiType" @on-change="certifiTypeWay"></popup-picker>
      <x-input text-align="right" v-model="zsmc" placeholder="请填写证书名称">
        <span slot="label">证书名称<span class="school-wx-icon requireIcon">&#xe644;</span> </span>
      </x-input>
      <x-input title='证书编号' text-align="right" v-model="zsbh" placeholder="请填写证书编号"></x-input>
      <x-input title='发证单位' text-align="right" v-model="fzdw" placeholder="请填写发证单位"></x-input>
      <datetime title="发证日期" v-model="fzrq" format="YYYY-MM-DD"></datetime>
      <popup-picker title="证书级别" v-model="zslevelVal" :data="zslevel"></popup-picker>
      <popup-picker title="证书等级" v-model="zsRankVal" :data="zsRank"></popup-picker>
      <!--<x-input title='奖励学分' text-align="right" v-model="jlxf" placeholder="请填写奖励学分"></x-input>-->
      <x-input title='成绩' text-align="right" v-model="scoreValue" placeholder="请填写证书成绩"></x-input>
      <x-textarea title='备注' v-model="remark" placeholder="请填写备注" :max="100"></x-textarea>
    </group>
    <upload-img-file class="upload-img-box" :showImgLst="showImgLst" :imgInfoLst="imgLst" @get-imgLst="getImgLst"></upload-img-file>
    <div class="btn-box">
      <x-button type="primary" mini class="cancel-btn" @click.native="doCancel">返 回</x-button>
      <x-button type="primary" mini class="sub-but" @click.native="submitData">上 传</x-button>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import UploadImgFile from '../common/UploadImgFile.vue'
  export default {
    name: 'reviseCertificate',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      XInput,
      PopupPicker,
      Datetime,
      XButton,
      XTextarea,
      UploadImgFile
    },
    methods: {
      // 取消
      doCancel () {
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 得到上传的图片
      getImgLst (e) {
        this.imgLst = [];
        for (let i in e.imgLst) {
          if (e.imgLst[i].AttData !== '') {
            this.imgLst.push({src: e.imgLst[i].AttData}); // 新增
          } else {
            this.imgLst.push({src: '', DelFileIds: e.imgLst[i].DelFileIds}); // 保留下来的附件
          }
        }
      },
      // 上传资料
      submitData() {
        if (!this.zsmc) {
          this.QD.alert('', '请填写证书名称');
          return;
        }
        let persistImg = []; // 保留的原来的附件
        let attsStr = [];
        let deleteImgId = []; // 找到删除的原来的附件 id
        // 找到删除已有附件  in this.imgLst
        for (let i=0; i<this.imgLst.length; i++) {
          console.log("this.imgLst[i]", i, this.imgLst[i]);
          if (this.imgLst[i].src === '') { // 是原来的图片
            for (let m in this.hasImgLst) {
              if (this.hasImgLst[m].DelFileIds === this.imgLst[i].DelFileIds) { // 已有附件没有删除
                persistImg.push({DelFileIds: this.hasImgLst[m].DelFileIds}); // 保留的原来的附件
                break;
              }
            }
          } else {
            attsStr.push(this.imgLst[i].src); // 新增的附件
          }
        }
        console.log("persistImg", persistImg);
        for (let k in this.hasImgLst) {
          let has = false;
          for (let r in persistImg) { // 查看是否存在没有删的图片
            if (this.hasImgLst[k].DelFileIds === persistImg[r].DelFileIds) { // 原来的图片没有删
              has = true;
              break;
            }
          }
          if (!has) {
            deleteImgId.push(this.hasImgLst[k].DelFileIds);
          }
        }
        // console.log("attsStr", attsStr);
        // console.log('img info', this.stuXH, 'zsType = ', this.zsType, 'hjXq ', this.hjXq[0], 'zsmc', this.zsmc, 'zslevelVal', this.zslevelVal[0], 'fzdw', this.fzdw, 'zsRankVal', this.zsRankVal[0], 'fzrq', this.fzrq, 'zsbh', this.zsbh, 'scoreValue', this.scoreValue, 'jlxf', this.jlxf, this.remark);
        // console.log('img base64', this.imgLst);
        if (deleteImgId.length>0) {
          deleteImgId = deleteImgId.join(',');
        } else {
          deleteImgId = '';
        }
        let that = this;
        this.QD.confirm('', '确定上传', async function(){
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'InsertStuCertificateApply',
            XH: that.stuXH,
            AttsStrJson: JSON.stringify(attsStr),
            ZSType: that.zsType,
            SemId: that.semId,
            XQMC: that.hjXq[0],
            XMMC: that.zsmc,
            XMJB: that.zslevelVal[0],
            ZBDW: that.fzdw,
            HJDJ: that.zsRankVal[0],
            HJRQ: that.fzrq,
            ZSBH: that.zsbh,
            ScoreValue: that.scoreValue,
            JLCredit: that.jlxf,
            Remark: that.remark,
            States: 1,
            ZSID: parseInt(that.$route.query.id),
            DelFileIds: deleteImgId
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            console.log(`获取数据失败:${d.msg}`);
            return;
          }
          let msg = JSON.parse(d);
          if (msg.success) {
            that.QD.alert('', '申请成功');
            that.$router.go(-2);
          } else {
            that.QD.alert('', '申请失败');
          }
        });
      },
      // 获取学期id的方法
      getXqIdWay (val) {
        console.log('xqlist', this.QD.xqList);
        for (let i in this.QD.xqList) {
          if (val[0] === this.QD.xqList[i].XQMC) {
            this.semId = this.QD.xqList[i].XQID;
          }
        }
      },
      // 选择证书类别的值后，获得对应的value
      certifiTypeWay (val) {
        for (let i in this.certifitypeLst) {
          if (val[0] === this.certifitypeLst[i].text) {
            this.zsType = this.certifitypeLst[i].value;
            break;
          }
        }
      },
      // 获取证书类别
      async getZSType () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'StuCertificateApply'});
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
        }
        this.certifitypeLst = d; // 从接口中获取的证书类别数据
        let test = [];
        for (let i in d) {
          test.push(d[i].text);
        }
        this.certifiType.push(test);
      },
      // 获取学期信息
      async getXQData () {
        if (!this.QD.currentXQ) {
          let xqList = await this.QD.getSmstLst();
          this.QD.xqList = xqList;
          this.QD.currentXQ = xqList.find((n) => n.CurrentXQ === true);
        }
        let xqmc = [];
        for (let i in this.QD.xqList) {
          xqmc.push(this.QD.xqList[i].XQMC);
        }
        this.xqLst.push(xqmc); // 学期列表
        if (this.hjXq.length>0) { // 得到初始化的学期id
          for (let i in this.QD.xqList) {
            if (this.hjXq[0] === this.QD.xqList[i].XQMC) {
              this.semId = this.QD.xqList[i].XQID;
            }
          }
        }
      },
      // 获取当前用户学生信息
      stuData () {
        let info = this.QD.getLocalUserinfo();
        //console.log("stu data", info);
        this.stuXM = info.stuObj.XM;
        this.bjmc = info.stuObj.BJMC;
        this.bzr = info.stuObj.BZR;
        this.stuXH = info.stuObj.XH;
      },
      // 得到修改数据
      getReviseData () {
        if (this.QD.otherPageData && this.QD.otherPageData.info) {
          let reviseInfo = this.QD.otherPageData.info;
          this.hjXq[0] = reviseInfo.xqmc;
          this.seleCertifiTypeVal[0] = reviseInfo.zstype;
          this.zsType = reviseInfo.zstype;
          this.zsmc = reviseInfo.xmmc;
          this.zsbh = reviseInfo.zsbh;
          this.fzdw = reviseInfo.zbdw;
          this.fzrq = reviseInfo.hjrq;
          this.zslevelVal[0] = reviseInfo.xmjb;
          this.zsRankVal[0] = reviseInfo.hjdj;
          this.scoreValue = reviseInfo.scorevalue;
          this.remark = reviseInfo.remark;
          let fileImg = reviseInfo.filepathList;
          this.QD.otherPageData = null; // 防止 reviseInfo 参数改变
          this.getZSType(); // 获取证书类别
          this.getXQData(); // 得到学期信息
          this.stuData(); // 获取当前用户学生信息
          // 得到图片附件
          for (let i=0; i<fileImg.length; i++) {
            this.showImgLst.push({ src: this.QD.APIHOST + fileImg[i].filePath });
            this.hasImgLst.push({DelFileIds: fileImg[i].fileId});
            this.imgLst.push({DelFileIds: fileImg[i].fileId, src: '', AttData: ''});
          }
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getReviseData(); // 得到修改数据
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        imgLst: [], // 证书申请上传图片列表
        showImgLst: [], // 渲染在页面上面的图片
        hasImgLst: [], // 之前存在的图片
        stuXM: '', // 学生姓名
        stuXH: '', // 学生学号
        bjmc: '', // 班级名称
        bzr: '', // 班主任
        xqLst: [], // 学期列表
        hjXq: [], // 获奖学期
        semId: null, // 获奖学期id
        certifitypeLst: [], // 从接口中获取的证书类别数据
        certifiType: [], // 证书类别列表
        seleCertifiTypeVal: [], // 选中证书类别的值
        zsType: '', // 证书类别对应的值
        zsmc: '', // 证书名称
        zsbh: ' ', // 证书编号
        fzdw: '', // 发证单位
        fzrq: '', // 发证日期
        zslevel: [['国际级', '国家级', '省级', '市级', '区县级', '校级']], // 证书级别
        zslevelVal: ['省级'], // 选中的证书级别
        zsRank: [['特等奖', '一等奖', '二等奖', '三等奖', '无']], // 证书等级
        zsRankVal: ['一等奖'], // 选中的证书等级
        jlxf: '', // 奖励学分
        scoreValue: '', // 证书成绩/分数
        remark: '' // 备注 -备注长度不能超过100字
      }
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -20px;
    background-color: #f2f2f2;
  }
  .requireIcon{
    padding: 0;
    color: red;
    font-size: 16px;
  }
  .btn-box{
    background-color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding-bottom: 10px;
  }
  .cancel-btn,
  .sub-but{
    display: inline-block;
    width: 40%;
    text-align: center;
    background-color: #13c22b
  }
  .previewer-demo-img{
    width: 120px;
    height: 120px;
    background-color: #f1f1f1;
    margin: 5% 0% 5% 8%;
  }
  .upload-img-box {
    margin-top: -21px;
    padding-bottom: 60px;
    background-color: #f2f2f2;
  }
</style>
<style>
  .upload-certificate .weui-textarea{
    color: #666666;
    font-family: "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1";
  }
  .upload-certificate .weui-input{
    color: #999999;
  }
</style>
