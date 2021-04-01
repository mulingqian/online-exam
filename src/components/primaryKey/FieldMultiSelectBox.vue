<template>
  <div class="fieldMultiSelectBox">
    <group class="gp">
      <!--多选框-->
      <cell :value="selectMultiValLst" @click.native="selectWay" is-link>
        <span slot="after-title" class="vux-label">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{multiSelectBoxTitle}}
        </span>
      </cell>
    </group>
    <div v-transfer-dom>
      <popup v-model="showOptions" position="bottom" max-height="50%" :hide-on-blur=false>
        <div class="optionsCon">
          <a v-for="(p, idx) in newOptions" :key="idx" @click="chooseEmployee(idx)" v-if="newOptions.length !== 0">
            <span>{{p.xx}}</span>
            <span :class="`school-wx-icon ${newOptions[idx].selectedEmploy === true ? 'selectedMultiEmployeeIcon' : 'noSelectMultiEmployeeIcon'}`" slot="icon"></span>
          </a>
        </div>
        <div class="kg"></div>
        <div class="finishButt">
          <x-button class="x-button" @click.native="finishSelect()" plain type="primary">确定</x-button>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XSwitch from 'vux/src/components/x-switch/index.vue'
  import Popup from 'vux/src/components/popup/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import XButton from 'vux/src/components/x-button/index.vue'
  export default {
    name: 'fieldMultiSelectBox',
    directives: {
      TransferDom
    },
    components: {
      XButton,
      Popup,
      XSwitch,
      Cell,
      Group
    },
    props: {
      multiSelectBoxLst: Object
    },
    methods: {
      // 获取type类型的所有值
      getAllVal () {
        this.multiSelectBoxTitle = this.multiSelectBoxLst.label;
        this.isRequired = this.multiSelectBoxLst.Isrequired;
        this.options = this.multiSelectBoxLst.options;
        // 添加selectedEmploy字段 赋值为false
        for (let i=0; i<this.options.length; i++) {
          this.newOptions.push({
            xx: this.options[i],
            selectedEmploy: false
          })
        }
        if (sessionStorage.getItem("field-" + this.multiSelectBoxLst.labelpy) !== null) {
          this.selectedMultiValLst = sessionStorage.getItem("field-" + this.multiSelectBoxLst.labelpy).split(",");
          this.selectMultiValLst = this.selectedMultiValLst.join();
          this.isSelected();
        }
      },
      // 判断是否已选中
      isSelected () {
        for (let i=0; i<this.selectedMultiValLst.length; i++) {
          for (let j=0; j<this.newOptions.length; j++) {
            if (this.selectedMultiValLst[i] === this.newOptions[j].xx) {
              this.newOptions[j].selectedEmploy = true;
              break;
            }
          }
        }
      },
      // 点击教师姓名事件
      chooseEmployee (idx) {
        // 是否选中
        this.newOptions[idx].selectedEmploy = !this.newOptions[idx].selectedEmploy;
        console.log("选择", this.newOptions[idx].selectedEmploy);
        this.$set(this.newOptions, idx, this.newOptions[idx]);
        if (this.newOptions[idx].selectedEmploy === true) {
          this.selectedMultiValLst.push(this.newOptions[idx].xx);
        } else {
          // 去掉重复的
          for (let i=0; i<this.selectedMultiValLst.length; i++) {
            if (this.selectedMultiValLst[i] === this.newOptions[idx].xx) {
              this.selectedMultiValLst.splice(i, 1);
            }
          }
        }
      },
      // 出现弹出，选择
      selectWay () {
        this.showOptions = true;
      },
      // 完成选择多选内容
      finishSelect () {
        this.showOptions = false;
        if (this.selectedMultiValLst.length === 0) {
          this.selectMultiValLst = '选择';
        } else {
          console.log(this.selectedMultiValLst);
          this.selectMultiValLst = this.selectedMultiValLst.join();
          this.$emit('get-val', {val: this.selectMultiValLst, labelpy: this.multiSelectBoxLst.labelpy});
        }
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
    },
    data () {
      return {
        multiSelectBoxTitle: '', // 多选框的标题
        selectMultiValLst: '选择', // 多选框中选定的值'a,b,c'
        selectedMultiValLst: [], // 选中的值
        options: [], // 选项
        newOptions: [], // 选项
        showOptions: false, // 默认弹框不出现
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style scoped>
  .optionsCon a{
    display: block;
    line-height: 1.41176471;
    padding: 7px 15px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
  .school-wx-icon{
    float: right;
  }
 .noSelectMultiEmployeeIcon:before{
    content: '\e62a';
  }
  .selectedMultiEmployeeIcon:before{
    content: '\e692';
  }
  .kg{
    width: 100%;
    height: 90px;
  }
  .finishButt{
    position: fixed;
    left: 40%;
    width: 20%;
    bottom: 0;
    right: 0;
    padding: 8px;
  }
  .x-button{
    font-size: 16px;
    color: #fff;
    background-color: #ff711d;
    border: 1px solid #ff711d;
  }
</style>
<style>
  .fieldMultiSelectBox .weui-cell .weui-cell__ft {
    color: #666666;
    font-size: 16px;
    width: 70%;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
