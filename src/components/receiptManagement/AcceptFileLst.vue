<template>
  <div class="acceptFileLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <tab>
      <tab-item :selected="showLst" @on-item-click="changeAcceptFileType(0)">未归档</tab-item>
      <tab-item :selected="!showLst" @on-item-click="changeAcceptFileType(1)">已归档</tab-item>
    </tab>
    <div style="background-color: #f2f2f2;">
      <ex-scroller ref="scrollerAcceptFileLstPageIdxOne" v-model="acceptFileLst" :onGetList="getFlowDocProcessData" height="-90">
        <div>
          <group v-if="acceptFileLst.length !== 0" v-for="(acceptFile,acIdx) in acceptFileLst" :key="acIdx">
            <cell @click.native="goAcceptFileDetail(acceptFile.DocId)">
            <span slot="after-title" class="vux-label">
              <span class="fileImportAndUrgent">
                <span class="fileImport">
                  <span :class="`school-wx-icon icon-importFile ${acceptFile.Importance === '1'? 'veryImporRed': (acceptFile.Importance === '2'? 'imporYellow': '')}`" slot="icon" style="font-size: 35px;">
                    <span v-if="acceptFile.Importance === '1'">非常重要</span>
                    <span v-if="acceptFile.Importance === '2'">重要</span>
                    <span v-if="acceptFile.Importance === '4'">普通</span>
                  </span>
                </span>
                <span class="fileUrgent">
                  <span :class="`school-wx-icon icon-urgentFile ${acceptFile.Urgent === '1'? 'veryUrgentRed': (acceptFile.Urgent === '2'? 'urgentYellow': '')}`" slot="icon" style="font-size: 35px;">
                    <span v-if="acceptFile.Urgent === '1'">非常紧急</span>
                    <span v-if="acceptFile.Urgent === '2'">紧急</span>
                    <span v-if="acceptFile.Urgent === '4'">普通</span>
                  </span>
                </span>
              </span>
              <span class="firstLine-acceptFile">
                <span>{{acceptFile.Subject}}</span>
                <span>[{{acceptFile.Secret}}]</span>
                <span v-if="acceptFile.State === 1">未签收</span>
                <span v-if="acceptFile.State === 2">已签收</span>
                <span v-if="acceptFile.State === 4">批阅完成</span>
              </span>
              <span class="secondLine-acceptFile">
                <span>创建日期：</span>
                <span>{{acceptFile.CreateDate}}</span>
                <br/>
                <span>处理期限：</span>
                <span>{{acceptFile.Deadline}}</span>
              </span>
              <!--是否可以批阅-->
              <span style="float: right;clear: both;" class="acceptApply" v-if="acceptFile.State === 2">
                <a @click.stop.prevent="setAcceptFileOpinion(acceptFile.DocId)">批阅</a>
              </span>
              <!--是否可以批阅-->
              <span class="thirdLine-acceptFile">
                <span>文号：</span>
                <span>{{acceptFile.Number}}</span>
              </span>
            </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--<span class="addAcceptFile">
      <span @click="goFlowDocApply()" class="school-wx-icon addFileIcon" slot="icon">&#xe668;</span>
    </span>-->
    <!--添加‘公文流转申请’-->
    <add-page @click.native="goFlowDocApply()"></add-page>
  </div>
</template>
<script>
  import ExScroller from '../common/ExScroller.vue'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import addPage from '../primaryKey/AddPage.vue'

  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  export default {
    name: 'acceptFileLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      ExScroller,
      Tab,
      TabItem,
      Cell,
      Group,
      addPage
    },
    methods: {
      // 获取收文管理列表 参数type(0-未归档，1-已归档)
      async getFlowDocProcessData(index, size) {
        let doneType = parseInt(sessionStorage.getItem("doneAcceptFileType"));
        // 判断之前是否从 已归档列表 查看信息的
        if (sessionStorage.getItem("doneAcceptFileType") !== null) {
          if (doneType === 1){
            this.type = 1;
            this.showLst = false;
          } else {
            this.type = 0;
            this.showLst = true;
          }
          // 清除存已归档doneAcceptFileType
          sessionStorage.removeItem("doneAcceptFileType");
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetFlowDocProcessData', type: this.type, pageSize: size, pageIndex: index});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        return d;
      },
      // 改变收文管理的type(0-未归档，1-已归档)
      changeAcceptFileType (type) {
        this.type = type;
        this.$refs.scrollerAcceptFileLstPageIdxOne.initData();
      },
      // 根据收文id跳转到‘公文流转信息’页面
      goAcceptFileDetail(docId) {
        // 把已归档的type 存sessionStorage,从公文流转信息页面 可以返回已归档列表
        sessionStorage.setItem("doneAcceptFileType", this.type);
        this.$router.push({path: '/receiptManagement/acceptFileDetail', query: {id: docId}});
      },
      // 跳转到公文流转申请页面
      goFlowDocApply () {
        // 把已归档的type 存sessionStorage,从公文流转申请页面 可以返回已归档列表
        sessionStorage.setItem("doneAcceptFileType", this.type);
        this.$router.push({path: '/receiptManagement/flowDocApply'});
      },
      // 批阅事件
      async setAcceptFileOpinion (docid) {
        let _this = this;
        this.QD.confirm("提示: 请输入批示意见", "", async function (m) {
          let d = await _this.QD.getData('/ComApi/PostObject', {
            apiName: 'UpdateMulFlowDocProcess',
            DocId: docid,
            Opinion: m,
            ZGH: ''
          });
          if (d.status && d.status === "error") {
            _this.QD.alert(`获取数据失败:${d.msg}`);
          }
          if (d === 1){
            _this.QD.alert('', '审批成功');
            _this.$refs.scrollerAcceptFileLstPageIdxOne.initData();// 公文流转刷新
          } else {
            _this.QD.alert('', '审批失败');
          }
        }, null, {showInput: true, inputVal: "", required: true});
      }
    },
    created (){
    },
    data () {
      return {
        loading: false,
        type: 0, // 默认先加载未归档
        showLst: true,
        acceptFileLst: [] // 收文管理列表
      }
    }
  }
</script>
<style scoped>
  /*悬浮的加号end*/
  .acceptFileLst .vux-label .fileImportAndUrgent{
    float: right;
  }
  .acceptFileLst .vux-label .fileImportAndUrgent .fileImport,
  .acceptFileLst .vux-label .fileImportAndUrgent .fileUrgent{
    position: relative;
    display: inline-block;
    width: 35px;
  }
  .acceptFileLst .vux-label .icon-importFile:before,
  .acceptFileLst .vux-label .icon-urgentFile:before{
    position: absolute;
    top: -17px;
    padding-right:0;
    font-size: 36px;
    content: '\e622';
    color: #5ac389;
    z-index:0;
  }
  .acceptFileLst .vux-label .veryImporRed.icon-importFile:before{
    color: #ff0000;
  }
  .acceptFileLst .vux-label .imporYellow.icon-importFile:before{
    color: #ff501d;
  }
  .acceptFileLst .vux-label .veryUrgentRed.icon-urgentFile:before{
    color: #ff0000;
  }
  .acceptFileLst .vux-label .urgentYellow.icon-urgentFile:before{
    color: #ff501d;
  }
  .acceptFileLst .vux-label .icon-importFile > span,
  .acceptFileLst .vux-label .icon-urgentFile > span{
    position:absolute;
    width: 16px;
    left: 10px;
    top: -7px;
    line-height: 15px;
    font-size: 14px;
    z-index:1;
    text-align: center;
    color: #fff;
  }
  .acceptFileLst .vux-label .veryImporRed > span,
  .acceptFileLst .vux-label .veryUrgentRed > span{
    left: 0;
    top: -6px;
    width: 35px;
  }
  .acceptFileLst .vux-label .acceptApply a{
    display: inline-block;
    padding: 4px 8px;
    font-size: 16px;
    color: #ff0000;
    border: 1px solid #ff0000;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .acceptFileLst .firstLine-acceptFile,
  .acceptFileLst .secondLine-acceptFile,
  .acceptFileLst .thirdLine-acceptFile{
    display: block;
    color: #333333;
  }
  .acceptFileLst .firstLine-acceptFile span:nth-child(2),
  .acceptFileLst .firstLine-acceptFile span:nth-child(3){
    color: #ff0000;
    font-size: 14px;
  }
  .acceptFileLst .secondLine-acceptFile span,
  .acceptFileLst .thirdLine-acceptFile span{
    font-size:14px;
  }
  .acceptFileLst .secondLine-acceptFile span:nth-child(2),
  .acceptFileLst .secondLine-acceptFile span:nth-child(5){ color: #666666; }
  .acceptFileLst .thirdLine-acceptFile span:nth-child(2){ color: #666666; }
</style>
<style>
  .acceptFileLst .weui-cells {
    position: relative;
    left: 2%;
    width: 96%;
    margin-top: 18px;
  }
  .acceptFileLst .weui-cells .weui-cell{
    padding: 10px 4px;
  }
  .acceptFileLst .weui-cells .weui-cell:before{
    left:0;
  }
</style>

