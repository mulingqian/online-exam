<template>
  <div class="acceptFileDetail">
    <div v-if="acceptFileDetail">
      <group :gutter="'0'">
        <cell :value="acceptFileDetail.Subject">
          <span slot="after-title" class="vux-label" style="display: inline-block;width: 40px;">标题</span>
        </cell>
        <cell :value="acceptFileDetail.Number">
          <span slot="after-title" class="vux-label">文号</span>
        </cell>
        <cell :value="acceptFileDetail.FromBy">
          <span slot="after-title" class="vux-label">来文单位</span>
        </cell>
        <cell :value="acceptFileDetail.FromDay">
          <span slot="after-title" class="vux-label">来文日期</span>
        </cell>
        <cell title="紧急度" :value="fileUrgentVal"></cell>
        <cell title="重要性" :value="fileImportanceVal"></cell>
        <cell title="文件密级" :value="acceptFileDetail.Secret"></cell>
        <cell :value="acceptFileDetail.Deadline">
          <span slot="after-title" class="vux-label">处理期限</span>
        </cell>
        <cell :value="acceptFileDetail.KSMC">
          <span slot="after-title" class="vux-label">发文人部门</span>
        </cell>
        <cell :value="acceptFileDetail.XM">
          <span slot="after-title" class="vux-label">发文人</span>
        </cell>
        <cell>
          <span slot="after-title" class="vux-label">
            <span>拟办意见</span>
            <br/>
            <span>{{acceptFileDetail.Opinion}}</span>
          </span>
        </cell>
        <cell>
          <span slot="after-title" class="vux-label">
            <span>处理结果</span>
            <br/>
            <span>{{acceptFileDetail.DocResult}}</span>
          </span>
        </cell>
      </group>

        <uploader
          v-model="fileLst"
          :viewType="2"
          :disabled="true"
          @click-preview-file="previewFileEvent"
          >
        </uploader>

      <group>

        <div v-if="acceptFileDetail.Content !== undefined && acceptFileDetail.Content" class="fileContent-field">
          <p class="title-p">内容</p>
          <p class="content-field" v-html="acceptFileDetail.Content"></p>
        </div>
        <cell v-if="!acceptFileDetail.HasGD && acceptFileDetail.State === 2" is-link @click.native="goSelectTeacher()">
          <span slot="after-title" class="vux-label" style="display: inline-block;width: 120px;">
            <span>选择转发的人员</span>
          </span>
          <span v-if="selectOtherEmployee">{{selectOtherEmployee}}</span>
          <span v-if="!selectOtherEmployee">选择</span>
        </cell>
        <cell v-if="!acceptFileDetail.HasGD && acceptFileDetail.State === 2"><!--未归档可以批阅，可以签收，并未归档state===2已签收可以显示批阅-->
          <span slot="after-title" class="vux-label">
            <span style="display: inline-block;width: 100%;margin-top: 4px;margin-bottom: 4px;text-align: center">
              <a @click="setAcceptFileOpinion()" style="padding: 5px;color: #ff0000;border: 1px solid #ff0000;border-radius: 5px;">批阅</a>
            </span>
          </span>
        </cell>
        <cell  v-if="suggestionList !== null && suggestionList.length > 0">
          <span slot="after-title" class="vux-label">
            <span class="suggestTitle">批示意见</span>
            <span class="suggestLst" v-for="(sug, sgIdx) in suggestionList" :key="sgIdx">
              <span>{{sug.XM}} [{{sug.StateName}}]</span>
              <br/>
              <span>{{sug.Signtime2}} 签收</span>
              <span v-if="sug.Finishtime2.length > 0" style="display: block;">{{sug.Finishtime2}} 完成</span>
              <span class="file-suggest">{{sug.Suggestion}}</span>
            </span>
          </span>
        </cell>
      </group>
    </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Uploader from '../common/Uploader.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'acceptFileDetail',
    directives: {
    },
    components: {
      Cell,
      Group,
      Uploader
    },
    data () {
      return {
        acceptFileDetail: null, // 公文流转信息
        fileLst: [], // 所有附件信息，包括 图片、pdf、word等
        suggestionList: [], //审批意见列表
        selectOtherEmployee: '', // 批阅中所选的转发教师人员
        selectOtherEmployeeZGH: '', // 批阅中所选的转发教师人员的职工号
        fileUrgentVal: '', // 紧急度
        fileImportanceVal: '' // 重要度
      }
    },
    created () {
      this.getSaveData(); // 获取所有保存的数据
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 打开预览
      previewFileEvent(file) {
        console.log("..", file)
      },
      // 根据收文id获取公文流转信息
      async getAcceptFileDetail () {
        if (this.QD.currPageData) {
          this.acceptFileDetail = this.QD.currPageData.acceptFileDetail;
          this.QD.currPageData = null;
        } else {
          this.updateLoadingStatus(true);
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetFlowDocProcessDetail', docId: this.$route.query.id});
          this.updateLoadingStatus(false);
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
            return;
          }
          this.acceptFileDetail = d;
        }
        let attLst = this.acceptFileDetail.AttList; // 附件赋值
        this.fileUrgentVal = this.acceptFileDetail.Urgent === '1' ? '非常紧急' : (this.acceptFileDetail.Urgent === '2' ? '紧急' : '普通'); // 紧急度 1 非常紧急 2紧急 4普通
        this.fileImportanceVal = this.acceptFileDetail.Importance === '1' ? '非常重要' : (this.acceptFileDetail.Importance === '2' ? '重要' : '普通'); // 重要度  1 非常重要 2重要 4普通
        this.fileLst = []; // 所有附件数据
        for (let i=0; i<attLst.length; i++) {
          let item = attLst[i];
          if (this.QD.imgTypeLst.indexOf(item.Extension) !== -1) {
            this.fileLst.push({file: {name: item.FileName, size: parseFloat(item.FileSize) * 1024, type: "image", url: item.FilePath}, url: item.FilePath});
          } else {
            this.fileLst.push({file: {name: item.FileName, size: parseFloat(item.FileSize) * 1024, type: item.Extension, url: item.FilePath}, url: item.FilePath});
          }
        }
        this.suggestionList = this.acceptFileDetail.SuggestionList; // 审批意见赋值
      },
      // 批阅事件
      async setAcceptFileOpinion () {
        let _this = this;
        this.QD.confirm("提示: 请输入批示意见", "", async function (m) {
          _this.updateLoadingStatus(true);
          let d = await _this.QD.getData('/ComApi/PostObject', {
            apiName: 'UpdateMulFlowDocProcess',
            DocId: _this.$route.query.id,
            Opinion: m,
            ZGH: _this.selectOtherEmployeeZGH
          });
          _this.updateLoadingStatus(false);
          if (d.status && d.status === "error") {
            _this.QD.alert(`获取数据失败:${d.msg}`);
          }
          if (d === 1){
            _this.QD.alert('', '审批成功');
            _this.getAcceptFileDetail(); // 公文流转信息刷新
          } else {
            _this.QD.alert('', '审批失败');
          }
        }, null, {showInput: true, inputVal: "", required: true});
      },
      // 跳转到选择教师页面
      goSelectTeacher () {
        this.savePgData();
        this.$router.push({path: '/commonSelect/selectMultiTea'});
      },
      // 从sessionStorage得到选择教师的信息
      // 保存本页面信息
      savePgData () {
        this.QD.currPageData = {acceptFileDetail: this.acceptFileDetail};
        let nameLst = [];
        let zghLst = [];
        if (this.selectOtherEmployee) {
          nameLst = this.selectOtherEmployee.split(',');
          zghLst = this.selectOtherEmployeeZGH.split(',');
          this.QD.otherPageData = {nameLst: nameLst, zghLst: zghLst}; // 保存选择教师的信息
        }
      },
      // 获取所有保存的数据
      getSaveData () {
        //得到选择教师的信息
        if (this.QD.otherPageData) {
          let s = this.QD.otherPageData;
          this.selectOtherEmployee = s.nameLst.join(',');
          this.selectOtherEmployeeZGH = s.zghLst.join(',');
          this.QD.otherPageData = null;
        }
        this.getAcceptFileDetail(); // 根据收文id获取公文流转信息
      }
    }
  }
</script>
<style scoped>
  .file-suggest{
    display: block;
    font-size: 14px;
    color: #666666;
  }
  /* 公文内容 */
  .fileContent-field{
    position: relative;
    padding: 10px 15px;
    font-size: 16px;
  }
  .fileContent-field:before{
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
  }
  .title-p{
    color: #333;
  }
  .content-field{
    color: #666;
  }
</style>
<style lang="less">
  .acceptFileDetail{
    .weui-cells .vux-label span:nth-child(1){
      color: #333333;
    }
    .weui-cells .weui-cell__ft{
      color: #666666;
    }
    .vux-label .suggestTitle{
      display:inline-block;
      width:100%;
      text-align: center;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 5px;
    }
    .vux-label .suggestLst{
      display:inline-block;
      width:100%;
      padding-top: 4px;
      padding-bottom: 4px;
      border-bottom: 1px dotted #e5e5e5;
    }
    .vux-label .suggestLst:last-child{
      border-bottom:0;
    }
    .content-field img{
      width: 100% !important;
    }
  }
</style>
