<template>
  <div class="eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-if="rDetail" class="publicRepairDetail eachPgBase">
      <group v-if="rDetail.States === 4" class="gp">
        <cell class="baseInfoHead" title="维修结果" :arrow-direction="'down'" :is-link="true"></cell>
        <cell title="维修费用"><span>{{rDetail.RepairExpenses}}</span></cell>
        <cell>
          <span slot="after-title" class="cell-title100">维修工作说明</span>
          <span>{{rDetail.ArrangeRemark}}</span>
        </cell>
        <cell>
          <span slot="after-title" class="cell-title80">维修结果</span>
          <span>{{rDetail.RepairResult}}</span>
        </cell>
        <cell title="维修人员"><span>{{rDetail.RepairerNames}}</span></cell>
        <cell title="维修日期"><span>{{rDetail.RepairTimeStr.substr(0, 10)}}</span></cell>
      </group>
      <group v-if="rDetail.States === 4" class="gp">
        <cell class="baseInfoHead" title="维修评价" :arrow-direction="'down'" :is-link="true"></cell>
        <cell title="评价分数">
          <span>{{rDetail.EvalScore}}</span>
        </cell>
        <cell>
          <span slot="after-title" class="cell-title100">评价内容</span>
          <span>{{rDetail.EvalContent}}</span>
        </cell>
        <cell title="评价时间">
          <span>{{rDetail.EvalTimeStr}}</span>
        </cell>
      </group>

      <group v-if="rDetail" class="repailDetail gp">
        <cell class="baseInfoHead" title="报修申请" :arrow-direction="'down'" :is-link="true"></cell>
        <cell title="申请人"><span>{{rDetail.SubmitorName}}</span></cell>
        <cell title="申请人电话"><span>{{rDetail.SubmitorTel}}</span></cell>
        <cell title="提交时间"><span>{{rDetail.SubmitTimeStr}}</span></cell>
        <cell title="报修状态">
          <span>{{rDetail.StatusStr}}</span>
        </cell>
       <!-- <cell title="设备使用人"><span>{{rDetail.DeviceOwnerName}}</span></cell>
        <cell title="使用人电话"><span>{{rDetail.DeviceOwnerTel}}</span></cell>
        <cell title="使用部门"><span>{{rDetail.KSMC}}</span></cell>-->
        <cell>
          <span slot="after-title" class="cell-title80">设备名称</span>
          <span>{{rDetail.DeviceName}}</span>
        </cell>
        <cell>
          <span slot="after-title" class="cell-title80">维修部门</span>
          <span>{{rDetail.RepairDepartment}}</span>
        </cell>
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

      <upload-img-file
        v-if="rDetail.ImgPath1 || rDetail.ImgPath2 || rDetail.ImgPath3" class="img-box"
        :titleName="'附件'" :showImgLst="showImgLst" :ableOperate="false"></upload-img-file>

      <div v-if="repairType === 2 && rDetail.States !== 4 && rDetail.IsRepairer" class="footer"><!-- IsRepairer 是否是单子的维修人-->
        <div @click="goRepairResultPage()"><a>输入维修结果</a></div>
      </div>
      <!-- 梧州商贸学校 只能申请人添加评价 -->
      <div v-if="repairType === 1 && rDetail.States === 4" class="footer">
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
  import UploadImgFile from '../common/UploadImgFile.vue'
  export default {
    name: 'special-repairDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      UploadImgFile
    },
    data () {
      return {
        loading: false,
        repairType: 1, // 判断是‘我的报修’详情(1)，还是‘我的维修’详情(2)
        rDetail: null, // 维修详情数据
        showImgLst: [] // 渲染在页面上的图片附件
      }
    },
    created (){
      // 判断是‘我的报修’详情(1)，还是‘我的维修’详情(2)
      this.repairType = parseInt(this.$route.query.type);
      this.getRepairDetail(); // 得到维修详情
    },
    methods: {
      // 到输入‘维修结果’页面
      goRepairResultPage () {
        this.$router.push({path: '/public/repairSpecial/publicRepairResult', query: {id: this.rDetail.BXID}});
      },
      // 到‘维修评价’页面
      goRepairAssessPage () {
        this.$router.push({path: '/public/repairSpecial/publicRepairAssess', query: {id: this.rDetail.BXID}});
      },
      // 得到维修详情
      async getRepairDetail () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetRepariApplyInfo',
          bxid: parseInt(this.$route.query.id)
        });
        this.loading = false;
        this.rDetail = JSON.parse(d).data;
        console.log('rDetail', this.rDetail);
        let jwUrl = this.rDetail.UrlBase.substr(0, this.rDetail.UrlBase.length-1);
        if (this.rDetail.ImgPath1) {
          this.rDetail.ImgPath1 = jwUrl + this.rDetail.ImgPath1;
          this.showImgLst.push({src: this.rDetail.ImgPath1});
        }
        if (this.rDetail.ImgPath2) {
          this.rDetail.ImgPath2 = jwUrl + this.rDetail.ImgPath2;
          this.showImgLst.push({src: this.rDetail.ImgPath2});
        }
        if (this.rDetail.ImgPath3) {
          this.rDetail.ImgPath3 = jwUrl + this.rDetail.ImgPath3;
          this.showImgLst.push({src: this.rDetail.ImgPath3});
        }
      }
    }
  }
</script>
<style scoped>
  .baseInfoHead{
    padding: 4px 15px;
    font-size: 14px;
    color: #999;
    background-color: #f5f5f9;
  }
  .gp{
    margin-top: -20px;
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
    padding-bottom: 10px;
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
