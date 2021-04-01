<template>
  <div class="seeCert-approvalLst">
    <tab>
      <tab-item :selected="doneVal === 3" @on-item-click="changeDone(3)">审核通过</tab-item>
      <tab-item :selected="doneVal === 1" @on-item-click="changeDone(1)">审核退回</tab-item>
      <tab-item :selected="doneVal === 2" @on-item-click="changeDone(2)">审核中</tab-item>
      <tab-item :selected="doneVal === 0" @on-item-click="changeDone(0)">未提交</tab-item>
    </tab>
    <!-- 审核通过 start -->
    <div v-show="doneVal === 3">
      <ex-scroller v-model="passLst" :onGetList="getTgData" height="-90">
        <div>
          <group>
            <cell :is-link="true" @click.native="goDetail(r.zsid, 3)" v-for="(r, ridx) in passLst" :key="ridx">
              <span slot="after-title">{{r.xmmc}}</span>
              <span slot="inline-desc">
                {{r.xmjb}} {{r.hjdj}}
                <br />
                <a class="timeFont">{{r.submittime}}</a>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!-- 审核通过 end -->
    <!-- 审核退回 start -->
    <div v-show="doneVal === 1">
      <ex-scroller v-model="refuseLst" :onGetList="getRefuseData" height="-90">
        <div>
          <group>
            <cell :is-link="true" @click.native="goDetail(r.zsid, 1)" v-for="(r, ridx) in refuseLst" :key="ridx">
              <span slot="after-title">{{r.xmmc}}</span>
              <span slot="inline-desc">
                {{r.xmjb}} {{r.hjdj}}
                <br />
                <a class="timeFont">{{r.submittime}}</a>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!-- 审核退回 end -->
    <!-- 审核中 start -->
    <div v-show="doneVal === 2">
      <ex-scroller v-model="reviewingLst" :onGetList="getReviewingData" height="-90">
        <div>
          <group>
            <cell :is-link="true" @click.native="goDetail(r.zsid, 2)" v-for="(r, ridx) in reviewingLst" :key="ridx">
              <span slot="after-title">{{r.xmmc}}</span>
              <span slot="inline-desc">
                {{r.xmjb}} {{r.hjdj}}
                <br />
                <a class="timeFont">{{r.submittime}}</a>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!-- 审核中 end -->
    <!-- 未提交 start  -->
    <div v-show="doneVal === 0">
      <ex-scroller v-model="noSubLst" :onGetList="getNoSubmitData" height="-90">
        <div>
          <group>
            <cell :is-link="true" @click.native="goDetail(r.zsid, 0)" v-for="(r, ridx) in noSubLst" :key="ridx">
              <span slot="after-title">{{r.xmmc}}</span>
              <span slot="inline-desc">
                {{r.xmjb}} {{r.hjdj}}
                <br />
                <a class="timeFont">{{r.submittime}}</a>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!-- 未提交 end -->
    <!--添加‘班级信息’-->
    <add-page @click.native="goUploadCert()"></add-page>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import addPage from '../primaryKey/AddPage.vue'
  import ExScroller from '../common/ExScroller.vue'

  export default {
    name: 'seeCertApprovalLst',
    directives: {
    },
    components: {
      ExScroller,
      Cell,
      Group,
      Tab,
      TabItem,
      addPage
    },
    methods: {
        // 切换 切换 状态值
      changeDone(type) {
        this.doneVal = type
      },
      // 到上传证书页面
      goUploadCert () {
        this.saveCurrPgData();
        this.$router.push({path: '/certificate/uploadCertificate'});
      },
      // 到详情页面
      goDetail(zsid, states) {
        this.saveCurrPgData();
        console.log(this.QD.currPageData);
        this.$router.push({path: '/certificate/certificateDetail', query: {id: zsid, xh: this.stuXH, states: states}})
      },
      // 保存本页数据
      saveCurrPgData () {
        this.QD.currPageData = null;
        this.QD.currPageData = this.doneVal; // 保存本页数据
      },
      // 得到当前学生用户的证书申请-审核通过列表
      async getTgData (index, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuCertificateApplyView',
          zsid: 0,
          xh: this.stuXH,
          states: 3,
          pageIndex: index,
          pageSize: size
        });
        if (d.status && d.status === "error") {
          console.log(`审核通过，获取数据失败:${d.msg}`);
          return;
        }
        return d;
      },
      // 得到当前学生用户的证书申请-审核退回
      async getRefuseData (index, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuCertificateApplyView',
          zsid: 0,
          xh: this.stuXH,
          states: 1,
          pageIndex: index,
          pageSize: size
        });
        if (d.status && d.status === "error") {
          console.log(`审核退回，获取数据失败:${d.msg}`);
          return;
        }
        return d;
      },
      // 得到当前学生用户的证书申请-审核中列表
      async getReviewingData (index, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuCertificateApplyView',
          zsid: 0,
          xh: this.stuXH,
          states: 2,
          pageIndex: index,
          pageSize: size
        });
        if (d.status && d.status === "error") {
          console.log(`审核中，获取数据失败:${d.msg}`);
          return;
        }
        return d;
      },
      // 得到当前学生用户的证书申请-未提交列表
      async getNoSubmitData (index, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuCertificateApplyView',
          zsid: 0,
          xh: this.stuXH,
          states: 0,
          pageIndex: index,
          pageSize: size
        });
        if (d.status && d.status === "error") {
          console.log(`审核中，获取数据失败:${d.msg}`);
          return;
        }
        return d;
      },
      // 得到本页数据
      getCurrPgData() {
        if (this.QD.currPageData || this.QD.currPageData === 0) {
          this.doneVal = this.QD.currPageData;
          this.QD.currPageData = null;
        }
        /* 当前用户信息 start */
        let info = this.QD.getLocalUserinfo();
        this.stuXH = info.stuObj.XH;
        /* 当前用户信息 end */
      }
    },
    beforeDestroy () {
    },
    created (){
      this.getCurrPgData(); // 得到本页数据
    },
    data () {
      return {
        doneVal: 3, // 审核的状态切换的判断值 未提交 0，审核退回 1，审核中 2，审核通过 3
        stuXH: '', // 当前用户的学号
        passLst: [], // 审核通过数据
        reviewingLst: [], // 审核中的数据
        refuseLst: [], //审核退回数据
        noSubLst: [] // 未提交数据
      }
    }
  }
</script>
<style scoped>
  .timeFont{
    color: #999999;
    font-size: 12px;
  }
</style>
