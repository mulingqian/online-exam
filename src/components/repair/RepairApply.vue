<template>
  <div class="repairApply">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <cell is-link @click.native="goSelectDevuceUserPage()">
        <span slot="after-title" class="vux-label">
         <span>*设备使用人</span>
        </span>
        <span slot="default" class="rg-cell">
          <span v-if="deviceOwnerName === ''">选择</span>
          <span v-if="deviceOwnerName !== ''">{{deviceOwnerName}}</span>
        </span>
      </cell>
      <cell>
        <span slot="after-title" class="vux-label">
         <span>*设备名称</span>
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="repairInput" v-model="deviceName" placeholder="请输入设备名称" />
        </span>
      </cell>
      <popup-picker title="设备种类" v-model="deviceCategory" :data="deviceCategoryData" @on-change="onChange" placeholder="选择"></popup-picker>
      <cell :is-link="true" @click.native="showNewCategory = !showNewCategory" v-model="newCategoryVal">
        <span slot="after-title">新增设备种类</span>
      </cell>
      <cell>
        <span slot="after-title" class="vux-label">
         <span>申请人联系方式</span>
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="repairInput" v-model="submitorTel" placeholder="请输入联系方式" />
        </span>
      </cell>
      <cell>
        <span slot="after-title" class="vux-label">
         <span>使用人联系方式</span>
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="repairInput" v-model="deviceOwnerTel" placeholder="请输入联系方式" />
        </span>
      </cell>
      <x-textarea title='设备地点' placeholder="请输入设备地点" v-model="deviceAddress" :show-counter="false" :rows="1" autosize></x-textarea>
      <x-textarea title='*内容描述' placeholder="请输入内容描述" v-model="deviceDescription" :show-counter="false" :rows="1" autosize></x-textarea>

      <cell>
        <span slot="after-title" class="vux-label">附件</span>
        <span slot><label for="uploadRepairDeviceImg" class="school-wx-icon" style="color:#f0ad4e;">&#xe614;</label></span>
      </cell>
      <x-img :src="srcImg1" :default-src="srcImg1" style="width: 90px;height: 100px;margin-right: -30px;margin-left: 5px;margin-bottom: 45px;" v-show="srcImg1 !== null"></x-img>
      <span class="school-wx-icon" style="position: relative;top: -128px;left: -65px;" v-show="srcImg1 !== null" @click="clearImg(1)">&#xe627;</span>
      <x-img :src="srcImg2" :default-src="srcImg2" style="width: 90px;height: 100px;margin-right: -30px;margin-bottom: 45px;" v-show="srcImg2 !== null"></x-img>
      <span class="school-wx-icon" style="position: relative;top: -128px;left: -65px;" v-show="srcImg2 !== null" @click="clearImg(2)">&#xe627;</span>
      <x-img :src="srcImg3" :default-src="srcImg3" style="width: 90px;height: 100px;margin-right: -30px;margin-bottom: 45px;" v-show="srcImg3 !== null"></x-img>
      <span class="school-wx-icon" style="position: relative;top: -128px;left: -65px;" v-show="srcImg3 !== null" @click="clearImg(3)">&#xe627;</span>

      <input type="file"  multiple="multiple" accept="image/*" value="" id="uploadRepairDeviceImg" style="display: none;" @change="flowDocImgFile($event)" ref="imgInput" />
      <div class="submitGap"></div>
      <x-button-one :titleVal="'提交'" @click-button="addSubmit"></x-button-one>
    </group>
    <div v-transfer-dom>
    <confirm v-model="showNewCategory"
             :show-input="true"
             :title="'新增设备种类'"
             :placeholder="'请填写的设备种类'"
             @on-confirm="onConfirm"
             ref="confirmCategory">
    </confirm>
  </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'

  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import Confirm from 'vux/src/components/confirm/index.vue'

  import XImg from 'vux/src/components/x-img/index.vue'
  import lrz from 'lrz'
  import XButtonOne from '../common/XButtonOne.vue'

  export default {
    name: 'repairApply',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      XTextarea,
      PopupPicker,
      Confirm,
      XImg,
      lrz,
      XButtonOne
    },
    methods: {
      /*onHide () {
        this.newCategoryVal = this.$refs.confirmCategory.msg; // // 新增设备种类值
      },*/
      onConfirm (val) {
        this.newCategoryVal = val; // // 新增设备种类值
      },
      // 删除图片
      clearImg (num) {
        if (num === 1) {
          this.srcImg1 = null;
        }
        if (num === 2) {
          this.srcImg2 = null;
        }
        if (num === 3) {
          this.srcImg3 = null;
        }
      },
      // 将图片转换成base64位并显示在页面上
      flowDocImgFile (e) {
        for (let i=0; i<e.target.files.length; i++) {
          let file = e.target.files[i];
          // 计算图片大小，默认是B，转换成KB
          let fsize = parseInt((file.size)/1024);
          if (!/image\/\w+/.test(file.type)) {
            alert("请确保文件为图像类型");
            return false;
          }
          let that = this;
          let qua = this.QD.compressSize / fsize;
          qua = Math.round(qua*100)/100;

          if (fsize > 200) {
            /*console.log('压缩');
             console.log(qua);*/
            lrz(file, {                  // 压缩图片
              quality: qua
            }).then(function (rst) {
              /* 处理成功后执行 */
              /*console.log(parseInt((rst.fileLen)/1024));*/
              if (i === 0) {
                that.srcImg1 = rst.base64;
              }
              if (i === 1) {
                that.srcImg2 = rst.base64;
              }
              if (i === 2) {
                that.srcImg3 = rst.base64;
              }
            }).catch( function () {
              /* 处理失败后执行 */
            }).always(function () {
              /* 必然执行 */
            })
          } else {
            /*console.log('不压缩');*/
            let reader = new FileReader();
            reader.onload = function(e){
              if (i === 0) {
                that.srcImg1 = this.result;
              }
              if (i === 1) {
                that.srcImg2 = this.result;
              }
              if (i === 2) {
                that.srcImg3 = this.result;
              }
            };
            reader.readAsDataURL(file);
          }
        }
      },
      //以可以上传的形式base64 保存图片
      saveImg () {
        if (this.srcImg1 !== null) {
          this.FURLImg1 = this.srcImg1.split(',')[1];
        } else {
          this.FURLImg1 = '';
        }
        if (this.srcImg2 !== null) {
          this.FURLImg2 = this.srcImg2.split(',')[1];
        } else {
          this.FURLImg2 = '';
        }
        if (this.srcImg3 !== null) {
          this.FURLImg3 = this.srcImg3.split(',')[1];
        } else {
          this.FURLImg3 = '';
        }
      },
        // 到选择 设备使用人页面
      goSelectDevuceUserPage () {
        this.QD.brotherPageData = {srcImg1: this.srcImg1, srcImg2: this.srcImg2, srcImg3: this.srcImg3, newCategoryVal: this.newCategoryVal}; // 保存附件
        sessionStorage.setItem("deviceName", this.deviceName);
        sessionStorage.setItem("submitorTel", this.submitorTel);
        sessionStorage.setItem("deviceOwnerTel", this.deviceOwnerTel);
        sessionStorage.setItem("deviceAddress", this.deviceAddress);
        sessionStorage.setItem("deviceDescription", this.deviceDescription);
        if (this.deviceCategory[0] === '选择' || this.deviceCategory[0] === null || this.deviceCategory[0] === '') {
          this.deviceCategory = ['选择'];
        }
        let category = JSON.stringify(this.deviceCategory);
        sessionStorage.setItem("deviceCategory", category);
        this.$router.push('/repair/selectDeviceUser');
      },
        // 提交‘维修申请’
      async addSubmit () {
        if (this.deviceOwnerName ==='') {
          this.QD.alert('', '请选择设备使用人！');
          return;
        }
        if (this.deviceName ==='') {
          this.QD.alert('', '请输入设备名称！');
          return;
        }
        if (this.deviceDescription ==='') {
          this.QD.alert('', '请输入内容描述！');
          return;
        }
        this.saveImg();
        let category = '';
        if (!this.newCategoryVal) {
          if (this.deviceCategory[0] === '选择' || this.deviceCategory[0] === null || this.deviceCategory[0] === '') {
            category = '';
          } else {
            category = this.deviceCategory[0];
          }
        } else {
          category = this.newCategoryVal;
        }
        if (this.deviceName !== ''&& this.deviceDescription !==''){
          let that = this;
          this.QD.confirm('', '确认提交', async function(){
            that.loading = true;
            let d = await that.QD.getData('/ComApi/PostObject', {
              apiName: 'InsertDeviceRepairInfo',
              DeviceName: that.deviceName,
              DeviceDescription: that.deviceDescription,
              DeviceCategory: category,
              DeviceAddress: that.deviceAddress,
              SubmitorTel: that.submitorTel,
              DeviceOwnerId: that.deviceOwnerId,
              DeviceOwnerTel: that.deviceOwnerTel,
              ImgPath1: that.FURLImg1,
              ImgPath2: that.FURLImg2,
              ImgPath3: that.FURLImg3
            });
            that.loading = false;
            if (d.status && d.status === "error") {
              that.QD.alert(`获取数据失败:${d.msg}`);
            }
            if (d.status === 'success') {
              // 跳转到绑定页面
              //that.$router.replace('/repair/teaRepair');
              that.$router.go(-1);
            }
          });
        }
      },
      // 得到用户之前填写的数据
      getPageData () {
        // 本页信息
        if (this.QD.brotherPageData) { // 附件
          this.srcImg1 = this.QD.brotherPageData.srcImg1;
          this.srcImg2 = this.QD.brotherPageData.srcImg2;
          this.srcImg3 = this.QD.brotherPageData.srcImg3;
          this.newCategoryVal = this.QD.brotherPageData.newCategoryVal;
          this.QD.brotherPageData = null;
        }
        if (sessionStorage.getItem("deviceName") !== null && sessionStorage.getItem("submitorTel") !== null &&
          sessionStorage.getItem("deviceOwnerTel") !== null && sessionStorage.getItem("deviceAddress") !== null && sessionStorage.getItem("deviceDescription") !== null &&
        sessionStorage.getItem("deviceCategory") !== null) {
          this.deviceName = sessionStorage.getItem("deviceName");
          this.submitorTel = sessionStorage.getItem("submitorTel");
          this.deviceOwnerTel = sessionStorage.getItem("deviceOwnerTel");
          this.deviceAddress = sessionStorage.getItem("deviceAddress");
          this.deviceDescription = sessionStorage.getItem("deviceDescription");
          this.deviceCategory = JSON.parse(sessionStorage.getItem("deviceCategory"));
          sessionStorage.removeItem("deviceName");
          sessionStorage.removeItem("submitorTel");
          sessionStorage.removeItem("deviceOwnerTel");
          sessionStorage.removeItem("deviceAddress");
          sessionStorage.removeItem("deviceDescription");
          sessionStorage.removeItem("deviceCategory");
        }
        if (sessionStorage.getItem("selectDeviceUserName") !== null && sessionStorage.getItem("selectDeviceUserZGH") !== null) {
          this.deviceOwnerId = sessionStorage.getItem("selectDeviceUserZGH");
          this.deviceOwnerName = sessionStorage.getItem("selectDeviceUserName");
          sessionStorage.removeItem("selectDeviceUserZGH");
          sessionStorage.removeItem("selectDeviceUserName");
        }
      },
      // 获取设备种类数据deviceCategoryData
      async getDeviceCategory () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'DeviceRepairCategoryData'});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        let c = [];
        for (let i=0; i<d.length; i++) {
          c[i] = d[i].DeviceCategory;
        }
        this.deviceCategoryData.push(c);
      },
      // 选择设备种类
      onChange (val) {
        if (val[0] === '') {
          this.deviceCategory = ['选择']
        } else {
          this.deviceCategory[0] = val[0];
        }
      }
    },
    created () {
        // 得到用户之前填写的数据
      this.getPageData();
      // 得到设备种类
      this.getDeviceCategory();
    },
    data () {
      return {
        loading: false,
        deviceName: '', // 设备名称
        submitorTel: '', // 提交人联系电话
        deviceOwnerTel: '', // 设备使用人联系电话
        deviceOwnerId: '', // 设备使用人职工号
        deviceOwnerName: '', //设备使用人姓名
        deviceAddress: '', // 设备地点
        deviceDescription: '', // 设备或物品的问题描述
        deviceCategoryData: [], // 设备种类数据
        deviceCategory: ['选择'], //设备种类的值
        showNewCategory: false, // 新增设备种类
        newCategoryVal: '', // 新增设备种类值
        srcImg1: null, // 上传图片处理
        srcImg2: null, // 上传图片处理
        srcImg3: null, // 上传图片处理
        FURLImg1: '', // 上传图片处理
        FURLImg2: '', // 上传图片处理
        FURLImg3: '' // 上传图片处理
      }
    }
  }

</script>
<style scoped>
  .vux-label{
    width: 114px;
  }
  .repairApply .rg-cell {
    padding-right: 10px;
    font-size: 16px;
    color: #666666;
  }
  .repairInput{
    width: 100%;
    height: 25px;
    text-align: right;
    font-size: 16px;
    color: #666666;
    border: 0;
    outline: none;
  }
  .submitGap{
    height: 30px;
  }
</style>
<style>
  .repairApply .weui-cells{
    margin-top: 0;
  }
  .repairApply textarea{
    text-align: right;
  }
</style>
