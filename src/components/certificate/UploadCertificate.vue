<template>
  <div class="upload-certificate eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="gp eachPgBase">
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
      <cell>
        <span slot="after-title" class="vux-label">附件</span>
        <span><label class="school-wx-icon" for="uploadCertifImg" style="color:#f0ad4e;">&#xe614;</label></span>
      </cell>
      <div v-for="(item, index) in imgLst" :key="index" style="position: relative;display: inline-block; width: 50%;">
        <x-img :src="item.src":default-src="item.src" class="previewer-demo-img"></x-img>
        <span class="school-wx-icon" style="position: absolute; left: 120px; margin-left: 8%; color: #ee8077;" @click="clearImg(index)">&#xe627;</span>
      </div>
      <input type="file" accept="image/*" value="" id="uploadCertifImg" style="display: none" @change="uploadImg($event)"  multiple="multiple"/>
    </group>
    <x-button-one :titleVal="'上 传'" @click-button="submitData"></x-button-one>
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
  import XImg from 'vux/src/components/x-img/index.vue'
  import XButtonOne from '../common/XButtonOne.vue'

  let lrz = require('lrz');
  export default {
    name: 'uploadCertificate',
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
      XImg,
      XButtonOne
    },
    methods: {
        // 上传资料
      submitData() {
        if (!this.zsmc) {
          this.QD.alert('', '请填写证书名称');
          return;
        }
        let attsStr = [];
        for (let i in this.imgLst) {
          attsStr.push(this.imgLst[i].src.split(',')[1]);
        }
        console.log('img base64', attsStr);
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
            ZSID: 0,
            DelFileIds: '' // 找到删除的原来的附件 id
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            console.log(`获取数据失败:${d.msg}`);
            return;
          }
          let msg = JSON.parse(d);
          if (msg.success) {
            that.QD.alert('', '申请成功');
            that.$router.go(-1);
          } else {
            that.QD.alert('', '申请失败');
          }
        });
      },
      // 删除图片
      clearImg (idx) {
        // console.log(idx);
        this.imgLst.splice(idx, 1);
      },
      // 将图片转换成base64位并显示在页面上
      uploadImg (e) {
        // console.log(e);
        this.imgLst = [];
        let files = e.target.files;
        for (let i in files) {
          if (i === '3') {
            break;
          }
          let file = files[i];
          if (!/image\/\w+/.test(file.type)) {
            console.log("请确保文件为图像类型");
            return false;
          }
         // let name = file.name;
          // let type = '.' + name.split('.')[1];
          let fsize = parseInt((file.size)/1024); // 计算图片大小，默认是B，转换成KB
          let that = this;
          let qua = this.QD.compressSize / fsize;
          qua = Math.round(qua*100)/100;
          if (fsize > this.QD.compressSize) {
            //console.log('压缩');
           // console.log(qua);
            lrz(file, {                  // 压缩图片
              quality: qua
            }).then(function (rst) {
              /* 处理成功后执行 */
             //  console.log(parseInt((rst.fileLen)/1024));
              let srcImg = rst.base64;
              let src = {src: srcImg};
              that.imgLst.push(src);
             // let obj = { ContentType: '', FileId: 0, GroupId: '', ParentId: 0, ImgSrc: srcImg.split(',')[1], FileName: name, Extension: type, FileSize: rst.fileLen.toString(), ImgChange: true };
              // that.detail.Attaches.push(obj);
            }).catch( function () {
              /* 处理失败后执行 */
            }).always(function () {
              /* 必然执行 */
            })
          } else {
            let reader = new FileReader();
            reader.onload = function(e){
              let srcImg = this.result;
              let src = {src: srcImg};
              that.imgLst.push(src);
              // let obj = { ContentType: '', FileId: 0, GroupId: '', ParentId: 0, ImgSrc: srcImg.split(',')[1], FileName: name, Extension: type, FileSize: file.size.toString(), ImgChange: true };
              // that.detail.Attaches.push(obj);
            };
            reader.readAsDataURL(file);
          }
        }
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
        this.seleCertifiTypeVal[0] = test[0]; // // 选中证书类别的值
        this.certifiType.push(test);
        this.zsType = d[0].value; // 证书类别值对应的值-要传的值
      },
      // 获取学期信息
      async getXQData () {
        if (!this.QD.currentXQ) {
          let xqList = await this.QD.getSmstLst();
          this.QD.xqList = xqList;
          this.QD.currentXQ = xqList.find((n) => n.CurrentXQ === true);
        }
        this.hjXq[0]= this.QD.currentXQ.XQMC; // 获奖学期
        this.semId = this.QD.currentXQ.XQID; // 获奖学期ID
        let xqmc = [];
        for (let i in this.QD.xqList) {
          xqmc.push(this.QD.xqList[i].XQMC);
        }
        this.xqLst.push(xqmc); // 学期列表
        this.fzrq = this.QD.getDateOrTime('date');  // 获取当前日期为发证日期
      },
      // 获取当前用户学生信息
      stuData () {
        let info = this.QD.getLocalUserinfo();
        //console.log("stu data", info);
        this.stuXM = info.stuObj.XM;
        this.bjmc = info.stuObj.BJMC;
        this.bzr = info.stuObj.BZR;
        this.stuXH = info.stuObj.XH;
      }
    },
    created () {
      this.getZSType(); // 获取证书类别
      this.getXQData(); // 得到学期信息
      this.stuData(); // 获取当前用户学生信息
    },
    data () {
      return {
        loading: false,
        imgLst: [], // 证书申请上传图片列表
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
  padding-bottom: 60px;
}
.requireIcon{
  padding: 0;
  color: red;
  font-size: 16px;
}
.previewer-demo-img{
  width: 120px;
  height: 120px;
  background-color: #f1f1f1;
  margin: 5% 0% 5% 8%;
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
