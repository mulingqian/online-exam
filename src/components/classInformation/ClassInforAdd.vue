<template>
  <div class="classInfroAdd">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <cell>
          <span slot="after-title" class="vux-label">
           <span>*标题</span>
          </span>
        <span slot="default" class="rg-cell">
            <input type="text" class="classTitle" v-model="classInforTitle" placeholder="请输入标题" />
          </span>
      </cell>
      <cell is-link>
          <span slot="after-title" class="vux-label">
            <span>*紧急度</span>
          </span>
        <span slot="default">
            <span class="rg-cell" v-on:click.stop.prevent="showUrgentMsg">{{urgentValue}}</span>
          </span>
      </cell>
      <cell is-link>
          <span slot="after-title" class="vux-label">
            <span>*重要性</span>
          </span>
        <span slot="default">
            <span class="rg-cell" v-on:click.stop.prevent="showImportMsg">{{importValue}}</span>
          </span>
      </cell>
      <cell is-link>
          <span slot="after-title" class="vux-label">
            <span>*置顶</span>
          </span>
        <span slot="default">
            <span class="rg-cell" v-on:click.stop.prevent="showStickyTopicMsg">{{stickTopicValue}}</span>
          </span>
      </cell>
      <datetime
        v-model="deadlineDate"
        @on-change="deadlineChange"
        title="*处理期限">
      </datetime>
      <x-textarea placeholder="信息内容" :show-counter="false" :rows="1" autosize v-model="msgContent"></x-textarea>
    </group>

    <x-button-one :titleVal="'保存'" @click-button="submitClassInfor"></x-button-one>
    <div v-transfer-dom>
      <actionsheet v-model="showUrgentPanel" :menus="urgentLists" show-cancel @on-click-menu="getUrgentValue"></actionsheet>
      <actionsheet v-model="showImportPanel" :menus="importLists" show-cancel @on-click-menu="getImportValue"></actionsheet>
      <actionsheet v-model="showStickyTopicPanel" :menus="stickyTopicLst" show-cancel @on-click-menu="getStickTopicValue"></actionsheet>
    </div>

  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'

  import XButtonOne from '../common/XButtonOne.vue'
  export default {
    name: 'classInforAdd',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      XTextarea,
      Cell,
      Group,
      Actionsheet,
      Datetime,
      XButtonOne
    },
    methods: {
      // 选择处理期限日期
      deadlineChange (value) {
        this.deadlineDate = value;
      },
      // 下面的面板是否出现，选择紧急度
      showUrgentMsg () {
        this.showUrgentPanel = !this.showUrgentPanel;
      },
      // 下面的面板是否出现，选择重要性
      showImportMsg () {
        this.showImportPanel = !this.showImportPanel;
      },
      // 下面的面板是否出现，选择是否置顶
      showStickyTopicMsg () {
        this.showStickyTopicPanel = !this.showStickyTopicPanel;
      },
      // 在面板出现后，选择紧急度值
      getUrgentValue (key, item) {
        if (item !== undefined && item !== this.urgentValue) {
          this.urgentValue = item;
          if (this.urgentValue === '普通') {
            this.urgentNum = '4';
          }
          if (this.urgentValue === '紧急') {
            this.urgentNum = '2';
          }
          if (this.urgentValue === '非常紧急') {
            this.urgentNum = '1';
          }
        }
      },
      // 在面板出现后，选择重要性值
      getImportValue (key, item) {
        if (item !== undefined && item !== this.importValue) {
          this.importValue = item;
          if (this.importValue === '普通') {
            this.importNum = '4';
          }
          if (this.importValue === '重要') {
            this.importNum = '2';
          }
          if (this.importValue === '非常重要') {
            this.importNum = '1';
          }
        }
      },
      // 在面板出现后，选择是否置顶
      getStickTopicValue (key, item) {
        if (item !== undefined && item !== this.importValue) {
          this.stickTopicValue = item;
          if (this.stickTopicValue === '否') {
            this.stickTopicNum = '0';
          }
          if (this.stickTopicValue === '是') {
            this.stickTopicNum = '1';
          }
        }
      },
      // 提交班级信息
      async submitClassInfor () {
        let _this = this;
        let deadLineTime;
        let bjid = _this.$route.query.id; /*获取班级id*/
        if (this.deadlineDate === '请选择') {
          deadLineTime = '';
        } else {
          deadLineTime = this.deadlineDate;
        }
        if (this.classInforTitle === ''){
          this.QD.alert('', '请输入标题');
          return;
        }
        if (this.msgContent === ''){
          this.QD.alert('', '请输入信息内容');
          return;
        }
        this.QD.confirm('', '确认保存', async function(){
          _this.loading = true;
          let d = await _this.QD.getData('/ComApi/PostObject', {apiName: 'InsertClassInfoData',
            BJID: bjid,
            Title: _this.classInforTitle,
            Urgent: _this.urgentNum,
            Importance: _this.importNum,
            Content: _this.msgContent,
            OnTop: _this.stickTopicNum,
            Deadline: deadLineTime
          });
          if (d.status && d.status === "error") {
            _this.QD.alert(`获取数据失败:${d.msg}`);
          }
          _this.loading = false;
          if (d > 0){
            _this.QD.alert('', `登记成功`);
            // 跳转到绑定页面 班级信息列表
            _this.$router.replace({path: '/classInformation/classInformationLst', query: {bjid: bjid}});
          } else {
            _this.QD.alert('', `登记失败`);
          }
        }, '');
      }
    },
    data () {
      return {
        loading: false,
        showUrgentPanel: false, // 文件紧急度面板开始默认不显示
        urgentLists: ["普通", "紧急", "非常紧急"],
        urgentNum: '4', // 文件紧急度相对应的字符串数字 1 非常紧急 2紧急 4普通
        urgentValue: '普通', // 选择的紧急度值
        showImportPanel: false, // // 文件重要性面板开始默认不显示
        importLists: ["普通", "重要", "非常重要"],
        importNum: '4', // 文件重要性相对应的字符串数字 1 非常重要 2重要 4普通
        importValue: '普通', // 选择的重要性值
        showStickyTopicPanel: false, // 选择是否置顶
        stickyTopicLst: ["否", "是"], // 0---否，1--是
        stickTopicNum: '0', // 0---否，1--是
        stickTopicValue: '否',
        deadlineDate: '请选择', // 处理期限日期
        classInforTitle: '', // 班级信息标题
        msgContent: '' // 信息内容
      }
    }
  }
</script>
<style scoped>
  .classInfroAdd .classTitle{
    width: 100%;
    height: 25px;
    text-align: right;
    font-size: 16px;
    color: #666666;
    border:0;
    outline: none;
  }
  .classInfroAdd .vux-label{
    color: #333333;
  }
</style>
<style>
  .classInfroAdd .weui-cells{
    margin-top: 0;
  }
  .classInfroAdd .weui-cells .vux-datetime div p {
    color: #333333;
  }
  .classInfroAdd .vux-x-textarea.weui-cell .weui-cell__bd textarea{
    font-family: "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1";
    font-size: 14px;
    color: #333333;
  }
  /*状态值面板*/
  .classInfroAdd .weui-actionsheet__menu .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
  .classInfroAdd .weui-actionsheet__action .weui-actionsheet__cell{
    position: relative;
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
</style>
