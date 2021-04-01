<template>
  <div class="fieldSingLineText">
    <group class="gp">
      <!--单行文本-->
      <x-input required v-model="oneLineVal" @on-change="getVal" :placeholder="singleTextLst.hint">
        <span slot="label" class="title">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{singleTextTitle}}
        </span>
      </x-input>
      <!--<cell>
        <span slot="after-title" class="vux-label">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{singleTextTitle}}
        </span>
        <span slot="default" class="rg-cell">
          <input v-on:input="getVal" type="text" class="singleLine" v-model="oneLineVal" placeholder="请输入" />
        </span>
      </cell>-->
    </group>
  </div>
</template>
<script>
  /*import Cell from 'vux/src/components/cell/index.vue'*/
  import Group from 'vux/src/components/group/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  export default {
    name: 'fieldSingleLineText',
    components: {
      XInput,
      Group
    },
    props: {
      singleTextLst: Object
    },
    methods: {
      getVal () {
        this.$emit('get-val', {val: this.oneLineVal, labelpy: this.singleTextLst.labelpy});
      },
      // 获取type类型的所有值
      getAllVal () {
        this.singleTextTitle = this.singleTextLst.label;
        this.isRequired = this.singleTextLst.Isrequired;
        if (sessionStorage.getItem("field-" + this.singleTextLst.labelpy) !== null) {
          this.oneLineVal = sessionStorage.getItem("field-" + this.singleTextLst.labelpy);
        }
      }
    },
    created () {
        // 获取type类型的所有值
      this.getAllVal();
    },
    data () {
      return {
        singleTextTitle: '', // 单行文本标题
        oneLineVal: '', // 单行文本绑定的值
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style scoped>
  .title{
    display: inline-block;
    width: 100%;
  }
  /*.singleLine{
    width: 100%;
    height: 25px;
    text-align: right;
    font-size: 16px;
    color: #666666;
    border: 0;
    outline: none;
  }*/
</style>
<style>
  .fieldSingLineText .weui-cell .weui-cell__hd{
    width: 50%;
  }
  .fieldSingLineText .weui-cell .weui-cell__primary{
    padding-left: 8px;
  }
  .fieldSingLineText .weui-cell .weui-cell__primary input{
    text-align: right;
  }
</style>
