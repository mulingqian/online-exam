<template>
  <div class="newsPublishApply">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group style="margin-bottom: 50px;">
      <cell>
        <span slot="after-title" class="vux-label">
         *标题
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="xnfwbTitle" v-model="xnfwbt" placeholder="请输入标题" />
        </span>
      </cell>
      <cell>
        <span slot="after-title" class="vux-label">
         *文号
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="applyNum" v-model="applyNum" placeholder="请输入文号" />
        </span>
      </cell>
      <cell>
        <span slot="after-title" class="vux-label">
         来文单位
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="receivedFileUnit" v-model="receivedFileUnit" placeholder="请输入来文单位" />
        </span>
      </cell>
      <datetime
        v-model="receiptFileDate"
        @on-change="receiptFileDateChange"
        title="来文日期">
      </datetime>
      <datetime
        v-model="deadlineDate"
        @on-change="deadlineChange"
        title="处理期限">
      </datetime>
      <popup-picker title="文件密级" v-model="secretsValue" :data="secretsValueData" @on-change="onChangeUrgent"></popup-picker>
      <popup-picker title="紧急度" v-model="urgentValue" :data="urgentData" @on-change="onChangeUrgent"></popup-picker>
      <popup-picker title="重要性" v-model="importValue" :data="importData" @on-change="onChangeImport"></popup-picker>
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
    name: 'campusDispatch-campusDispatchApply',
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
      receiptFileDateChange (value) {
        this.receiptFileDate = value;
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
      // 得到当前日期
      getCurDate () {
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        // 默认 ‘来文日期’是当前日期
        this.receiptFileDate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
      }
    },
    created () {
      // 得到当前日期
      this.getCurDate();
    },
    data () {
      return {
        loading: false,
        xnfwbt: '', // 标题
        applyNum: '', // 文号
        receivedFileUnit: '', // 来文单位
        receiptFileDate: '', // 来文日期
        deadlineDate: '请选择', // 处理期限
        secretsValue: ['保密'], // 文件密级
        secretsValueData: [['保密', '公开', '其他']],
        urgentValue: ['普通'], // 紧急度
        urgentData: [['普通', '紧急', '非常紧急']],
        importValue: ['普通'], // 重要性
        importData: [['普通', '重要', '非常重要']]
      }
    }
  }
</script>
<style scoped>
  .applyNum,
  .receivedFileUnit,
  .xnfwbTitle{
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
