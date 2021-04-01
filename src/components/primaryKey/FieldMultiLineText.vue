<template>
  <div class="fieldMultiLineText">
    <!--多行文本-->
    <group class="gp">
      <span slot="title" class="title">
        <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
        {{multiLineTextTitle}}
      </span>
      <x-textarea v-on:input="getVal" placeholder="请输入" v-model="multiLineTextVal" :show-counter="false" :rows="3" autosize></x-textarea>
    </group>
  </div>
</template>
<script>
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'primaryKey-fieldMultiLineText',
    components: {
      XTextarea,
      Group
    },
    props: {
      multiLineTextLst: Object
    },
    methods: {
      getVal () {
        this.$emit('get-val', {val: this.multiLineTextVal, labelpy: this.multiLineTextLst.labelpy});
      },
      // 获取type类型的所有值
      getAllVal () {
        this.multiLineTextTitle = this.multiLineTextLst.label;
        this.isRequired = this.multiLineTextLst.Isrequired;
        if (sessionStorage.getItem("field-" + this.multiLineTextLst.labelpy) !== null) {
          this.multiLineTextVal = sessionStorage.getItem("field-" + this.multiLineTextLst.labelpy);
        }
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
    },
    data () {
      return {
        multiLineTextTitle: '', // 多行文本的标题
        multiLineTextVal: '', // 多行文本绑定的值
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style scoped>
  .title{
    display: inline-block;
    padding-left: 10px;
    padding-top: 15px;
    font-size: 14px;
    color: #666666;
  }
</style>
<style>
  .fieldMultiLineText .gp .weui-cells{
    margin-top: 0;
  }
</style>

