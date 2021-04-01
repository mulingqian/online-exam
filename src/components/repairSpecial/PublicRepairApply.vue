<template>
  <div class="repair-apply-spec eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-if="userinfo && userinfo.stuObj" class="gp eachPgBase">
      <group class="public-group">
        <cell>
          <span slot="after-title">申请人</span>
          <span>{{userinfo.stuObj.XM}}</span>
        </cell>
        <!-- 学生申请信息 start -->
        <cell v-if="userinfo.stuObj.XH">
          <span slot="after-title">班级</span>
          <span>{{userinfo.stuObj.BJMC}}</span>
        </cell>
        <!-- 学生申请信息 end -->
        <x-input v-model="applyInfo.SubmitorTel" :text-align="'right'" placeholder="请填写申请人电话" :max="11" :type="'number'">
          <span slot="label">申请人电话</span>
        </x-input>
        <x-input v-model="applyInfo.DeviceName" :text-align="'right'" placeholder="请填写设备名称">
        <span slot="label">
          <span class="school-wx-icon requireIcon">&#xe644;</span>
          设备名称
        </span>
        </x-input>
        <popup-picker :title="'维修部门'" :data="departLst" :columns="1" :show-name="true" v-model="applyInfo.RepairDepartment" @on-change="changeDepartVal"></popup-picker>
        <popup-picker :data="deviceCategoryLst" :columns="1" :show-name="true" v-model="applyInfo.DeviceCategory" :placeholder="'请选择'">
          <span slot="title">
            <span class="school-wx-icon requireIcon">&#xe644;</span>
            设备种类
          </span>
        </popup-picker>
        <x-input v-model="applyInfo.DeviceAddress" :text-align="'right'" placeholder="请填写设备地点">
        <span slot="label">
          <span class="school-wx-icon requireIcon">&#xe644;</span>
          设备地点
        </span>
        </x-input>
        <cell class="gpTitle">
          <p slot="after-title"><span class="school-wx-icon requireIcon">&#xe644;</span>问题描述</p>
        </cell>
        <x-textarea v-model="applyInfo.DeviceDescription" :placeholder="'请填写问题描述'" :rows="2"></x-textarea>
      </group>
      <upload-img-file class="uploadImgBox" :titleName="'上传图片'" :limitImgFileNum="3" @get-imgLst="getImgLst"></upload-img-file>
      <div class="btnBottomGap"></div>
      <x-button-one :titleVal="'提交'" @click-button="submitWay"></x-button-one>
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
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import UploadImgFile from '../common/UploadImgFile.vue'
  import XButtonOne from '../common/XButtonOne.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'special-repairApply',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      XInput,
      PopupPicker,
      XTextarea,
      UploadImgFile,
      XButtonOne
    },
    data () {
      return {
        loading: false,
        applyInfo: {
          BXID: 0,
          IsStudent: true, // 判断用户类型，学生-true, 老师 - false
          States: 1,
          SubmitorTel: '', // 申请人电话
          DeviceName: '', // 设备名称
          RepairDepartment: [], // 维修部门
          DeviceCategory: [], // 设备种类
          DeviceAddress: '', // 设备地点
          DeviceDescription: '', // 问题描述
          ImgPath1: "",
          ImgPath2: "",
          ImgPath3: ""
        },
        departLst: [], // 维修部门列表
        deviceCategoryData: {}, // 设备种类列表
        deviceCategoryLst: [], // 渲染在页面上的设备种类列表
        oldRepairDepartment: [] // 记录之前选中的维修部门- 选中相同的维修部门，changeDepartVal 方法同样会被调用（当值改变时才会被调用）
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    created () {
      this.judgeUserType(); // 判断用户类型
    },
    methods: {
      // 判断用户类型
      judgeUserType () {
        this.userinfo && this.userinfo.stuObj.XH ? this.applyInfo.IsStudent = true : this.applyInfo.IsStudent = false;
        this.getRepairDepart(); // 得到维修部门
      },
      // 提交
      submitWay () {
        let telReg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (this.applyInfo.SubmitorTel && !telReg.test(this.applyInfo.SubmitorTel)) {
          this.QD.alert('', '请正确填写申请人电话！');
          return;
        }
        if (this.applyInfo.DeviceName === '') {
          this.QD.alert('', '请填写设备名称！');
          return;
        }
        if (!this.applyInfo.DeviceCategory[0]) {
          this.QD.alert('', '请选择设备种类！');
          return;
        }
        if (this.applyInfo.DeviceAddress ==='') {
          this.QD.alert('', '请填写设备地点！');
          return;
        }
        if (this.applyInfo.DeviceDescription ==='') {
          this.QD.alert('', '请填写问题描述！');
          return;
        }
        let objInfo = JSON.parse((JSON.stringify(this.applyInfo)));
        objInfo.RepairDepartment = objInfo.RepairDepartment[0]; // 维修部门
        objInfo.DeviceCategory = objInfo.DeviceCategory[0]; // 设备种类
        /* 找到维修部门name start */
        for (let i=0; i<this.departLst.length; i++) {
          let si = this.departLst[i];
          if (si.value === objInfo.RepairDepartment) {
            objInfo.RepairDepartment = si.name;
            break;
          }
        }
        console.log("applyInfo", this.applyInfo, objInfo);
        /* 找到维修部门name end */
        objInfo.apiName = 'SaveRepairApplyInfo'; // 参数一个一个传到后台
        let that = this;
        this.QD.confirm('', '确认提交', async function() {
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', objInfo);
          that.loading = false;
          d = JSON.parse(d);
          if (d.status && d.status === "error") {
            that.QD.alert(`提交失败`);
            return;
          }
          // 跳转到绑定页面
          that.$router.go(-1);
        });
      },
      // 得到上传图片的信息
      getImgLst (e) {
        console.log(e);
        this.applyInfo.ImgPath1 = '';
        this.applyInfo.ImgPath2 = '';
        this.applyInfo.ImgPath3 = '';
        for (let i=0; i<e.imgLst.length; i++) {
          let si = e.imgLst[i];
          if (i === 0) {
            this.applyInfo.ImgPath1 = si.AttData;
          } else if (i === 1) {
            this.applyInfo.ImgPath2 = si.AttData;
          } else if (i === 2) {
            this.applyInfo.ImgPath3 = si.AttData;
          }
        }
      },
      // 改变维修部门
      changeDepartVal (value) {
        if (this.oldRepairDepartment[0] !== value[0]) {
          this.oldRepairDepartment[0] = value[0]; // 记录选中的维修部门
          this.applyInfo.DeviceCategory = []; // 清空之前选中的设备种类
          this.deviceCategoryLst = this.deviceCategoryData[value[0]]; // 改变设备种类列表
          console.log('deviceCategoryLst', this.deviceCategoryLst);
        }
      },
      // 梧州商贸报修-设备种类
      async getDeviceCategory () {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetDeviceCategory'
        });
        d = JSON.parse(d);
        if (d.status && d.status === "error") {
          console.log(`获取设备种类数据失败:${d.msg}`);
          return;
        }
        console.log("device category", d);
        let cateLst = d.data; // 设备种类
        for (let i=0; i<this.departLst.length; i++) {
          let si = this.departLst[i];
          for (let k=0; k<cateLst.length; k++) {
            let sk = cateLst[k];
            if (si.value === sk.departCode) {
              sk.value = sk.name;
              this.deviceCategoryData[si.value].push(sk); // 种类设备对象（每种维修部门）赋值
            }
          }
        }
        // console.log("deviceCategoryData", this.deviceCategoryData);
        this.deviceCategoryLst = this.deviceCategoryData[this.departLst[0].value];
      },
      // 得到维修部门
      async getRepairDepart () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'ReadRepairDepartment'
        });
        this.loading = false;
        d = JSON.parse(d);
        if (d.status && d.status === "error") {
          console.log(`获取维修部门数据失败:${d.msg}`);
          return;
        }
        console.log("depart", d);
        for (let i=0; i<d.data.length; i++) {
          let si = d.data[i];
          this.deviceCategoryData[si.code] = []; // 种类设备对象添加属性并赋值
          this.departLst.push({
            name: si.name,
            value: si.code,
            parent: 0
          });
        }
        if (this.departLst.length > 0) {
          this.applyInfo.RepairDepartment.push(this.departLst[0].value);
          this.getDeviceCategory(); // 梧州商贸报修-设备种类
        }
      }
    }
  }
</script>
<style scoped>
  .repair-apply-spec .gp{
    margin-top: -1.25em;
  }
  .gpTitle{
    padding: 4px 15px;
    font-size: 14px;
    color: #666;
    background-color: #f5f5f9;
  }
  .uploadImgBox{
    margin-top: -10px;
  }
  .btnBottomGap{
    height: 60px;
  }
</style>

