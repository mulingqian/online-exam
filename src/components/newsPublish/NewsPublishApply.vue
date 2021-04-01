<template>
  <div class="newsPublishApply">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <cell>
        <span slot="after-title" class="vux-label">
         *标题
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="newsTitle" v-model="xwbt" placeholder="请输入标题" />
        </span>
      </cell>
      <popup-picker title="*置顶显示" v-model="onTop" :data="onTopData" @on-change="onChangeOnTop"></popup-picker>
      <popup-picker title="发送范围" v-model="fsfw" :data="fsfwData" @on-change="onChangeFSFW"></popup-picker>
      <datetime
        v-model="deadlineDate"
        @on-change="deadlineChange"
        title="截止日期">
      </datetime>
      <popup-picker title="紧急度" v-model="urgentValue" :data="urgentData" @on-change="onChangeUrgent"></popup-picker>
      <popup-picker title="重要性" v-model="importValue" :data="importData" @on-change="onChangeImport"></popup-picker>
      <popup-picker title="自动记录已阅" v-model="autoRecordRead" :data="autoRecordReadData" @on-change="onChangeRecordRead"></popup-picker>
      <popup-picker title="要求阅读回复" v-model="readReply" :data="readReplyData" @on-change="onChangeReadReply"></popup-picker>
      <popup-picker title="是否已发布" v-model="isPublish" :data="isPublishData" @on-change="onChangeIsPublish"></popup-picker>
      <cell>
        <span slot="after-title" class="vux-label">附件</span>
        <span slot><label class="school-wx-icon" style="color:#f0ad4e;">&#xe614;</label></span>
      </cell>
    </group>
    <footer>
      <div class="submitNews"><a>保存</a></div>
    </footer>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'

  import PopupPicker from 'vux/src/components/popup-picker/index.vue'

  import XImg from 'vux/src/components/x-img/index.vue'
  import lrz from 'lrz'
  export default {
    name: 'newsPublishApply',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      PopupPicker,
      Datetime,
      XImg,
      lrz
    },
    methods: {
        // 选择 新闻 是否置顶
      onChangeOnTop (val) {
        this.onTop = [val[0]];
        if (val[0] === '否') {
          this.onTopNum = 0;
        } else {
          this.onTopNum = 1;
        }
      },
      // 选择 发布范围
      onChangeFSFW (val) {
        this.fsfw = [val[0]];
      },
      // 选择处理期限日期
      deadlineChange (value) {
        this.deadlineDate = value;
      },
      // 选择 紧急程度
      onChangeUrgent (val) {
        this.urgentValue = [val[0]];
      },
      // 选择 重要性
      onChangeImport (val) {
        this.importValue = [val[0]];
      },
      // 选择‘自动记录已阅’
      onChangeRecordRead (val) {
        this.autoRecordRead = [val[0]];
      },
      // 要求阅读回复
      onChangeReadReply (val) {
        this.onChangeReadReply = [val[0]];
      },
      // 是否已发布
      onChangeIsPublish (val) {
        this.isPublish = [val[0]];
      }
    },
    created () {},
    data () {
      return {
        loading: false,
        xwbt: '', // 新闻标题
        onTop: ['否'], // 0不置顶，1置顶
        onTopNum: 0, // 0不置顶
        onTopData: [['否', '是']],
        fsfw: ['全校'], // 发送范围
        fsfwData: [['全校', '部门内部']],
        deadlineDate: '请选择', // 截止日期
        urgentValue: ['普通'], // 紧急度
        urgentData: [['普通', '紧急', '非常紧急']],
        importValue: ['普通'], // 重要性
        importData: [['普通', '重要', '非常重要']],
        autoRecordRead: ['是'], // 自动记录已阅
        autoRecordReadData: [['是', '否']],
        readReply: ['是'], // 要求阅读回复
        readReplyData: [['是', '否']],
        isPublish: ['否'], // 是否已发布
        isPublishData: [['是', '否']]
      }
    }
  }
</script>
<style scoped>
  .newsTitle{
    width: 100%;
    height: 25px;
    text-align: right;
    font-size: 16px;
    color: #666666;
    border:0;
    outline: none;
  }
  footer{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  footer .submitNews{
    margin-top: 10px;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  footer .submitNews a{
    display: inline-block;
    padding:12px 10px;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
</style>
