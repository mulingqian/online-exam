<template>
  <div class="teaRepairDetail eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-if="rDetail" class="eachPgBase">
      <group v-if="rDetail.States === '4'" title="维修结果" class="repairResult">
        <cell title="维修费用">
          <span>{{rDetail.RepairExpenses}}</span>
        </cell>
        <cell>
          <span slot="after-title" class="cell-title100">维修工作说明</span>
          <span>{{rDetail.ArrangeRemark}}</span>
        </cell>
        <cell>
          <span slot="after-title" class="cell-title80">维修结果</span>
          <span>{{rDetail.RepairResult}}</span>
        </cell>
      </group>

      <group v-if="rDetail" title="报修申请" class="repailDetail">
        <cell>
          <span slot="after-title" class="cell-title80">设备名称</span>
          <span>{{rDetail.DeviceName}}</span>
        </cell>
        <cell title="报修状态">
          <span>{{rDetail.StatesName}}</span>
        </cell>
        <cell title="申请人"><span>{{rDetail.Name}}</span></cell>
        <cell title="提交时间"><span>{{rDetail.SubmitTime}}</span></cell>
        <cell title="设备使用人"><span>{{rDetail.DeviceOwnerName}}</span></cell>
        <cell>
          <span slot="after-title" class="cell-title80">使用部门</span>
          <span>{{rDetail.KSMC}}</span>
        </cell>
        <cell title="使用人电话"><span>{{rDetail.DeviceOwnerTel}}</span></cell>
        <cell title="申请人电话"><span>{{rDetail.SubmitorTel}}</span></cell>
        <cell title="设备种类"><span>{{rDetail.DeviceCategory}}</span></cell>
        <cell>
          <span slot="after-title" class="cell-title80">设备地点</span>
          <span>{{rDetail.DeviceAddress}}</span>
        </cell>
        <cell>
          <span slot="after-title" class="cell-title80">问题描述</span>
          <span>{{rDetail.DeviceDescription}}</span>
        </cell>
      </group>
      <div v-if="rDetail.ImgPathOne || rDetail.ImgPathTwo || rDetail.ImgPathThree" class="img-box">
        <p>附件</p>
        <span v-if="rDetail.ImgPathOne"><x-img :default-src="rDetail.ImgPathOne" :src="rDetail.ImgPathOne"></x-img></span>
        <span v-if="rDetail.ImgPathTwo"><x-img :default-src="rDetail.ImgPathTwo" :src="rDetail.ImgPathTwo"></x-img></span>
        <span v-if="rDetail.ImgPathThree"><x-img :default-src="rDetail.ImgPathThree" :src="rDetail.ImgPathThree"></x-img></span>
      </div>

      <div v-if="repairType === 2 && rDetail.States !== '4'" class="footer"><!--v-if="repairType === 2 && rDetail.States !== '4'"-->
        <div @click="goRepairResultPage()"><a>输入维修结果</a></div>
      </div>
      <div v-if="rDetail.States === '4'" class="footer">
        <div @click="goRepairAssessPage()"><a>评价</a></div>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XImg from 'vux/src/components/x-img/index.vue'
  export default {
    name: 'teaRepairDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      XImg
    },
    methods: {
        // 到输入‘维修结果’页面
      goRepairResultPage () {
        this.$router.push({path: '/repair/repairResult', query: {id: this.wxid, type: this.repairType}});
      },
      // 到‘维修评价’页面
      goRepairAssessPage () {
        this.$router.push({path: '/repair/repairAssess', query: {id: this.wxid, type: this.repairType}});
      },
      // 得到维修详情
      async getRepairDetail () {
        // 判断是‘我的报修’详情(1)，还是‘我的维修’详情(2)
        this.repairType = parseInt(this.$route.query.type);
        this.wxid = this.$route.query.id;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetDeviceRepairInfoDetail', bxid: this.wxid});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.rDetail = d;
      }
    },
    created (){
      this.getRepairDetail(); // 得到维修详情
    },
    data () {
      return {
        loading: false,
        repairType: 1, // 判断是‘我的报修’详情(1)，还是‘我的维修’详情(2)
        wxid: -1, // 维修 id
        rDetail: null // 维修详情数据
      }
    }
  }
</script>
<style scoped>
  .repailDetail{
    padding-bottom: 20px;
  }
  .cell-title100{
    display: inline-block;
    width: 100px;
  }
  .cell-title80{
    display: inline-block;
    width: 75px;
  }
  .img-box{
    padding-bottom: 20px;
    overflow: hidden;
  }
  .img-box>p{
    font-size: 16px;
    padding: 0 16px 10px 16px;
  }
  .img-box>span{
    display: inline-block;
    float: left;
    width: 48%;
    height: 100px;
    text-align: center;
  }
  .img-box>img{
    width: 100px;
    height: 100px;
  }
  .footer{
    position: relative;
    width:100%;
  }
  .footer div{
    margin-top: 10px;
    text-align: center;
    background-color: #fff;
  }
  .footer div a{
    display: inline-block;
    padding: 12px 10px;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    color: #0f89e0;
    border-radius: 3px;
  }
</style>
<style>
  .teaRepairDetail .repairResult .weui-cells__title,
  .teaRepairDetail .repailDetail .weui-cells__title{
    font-size: 14px;
    margin-top:0;
    padding-top:0.77em;
  }
</style>
