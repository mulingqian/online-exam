<template>
  <div class="fieldNumberEntry">
    <group class="gp">
      <!--数字输入框-->
      <cell>
        <span slot="after-title" class="vux-label">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
         {{numberEntryTitle}}
        </span>
        <span slot="default" class="rg-cell">
          <input type="number" class="numCase" v-on:input="getNumVal" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="numberVal" placeholder="请输入" />
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'fieldNumberEntry',
    components: {
      Cell,
      Group
    },
    props: {
      numberEntryLst: Object
    },
    methods: {
      getVal () {
        this.$emit('get-val', {val: this.numberVal, labelpy: this.numberEntryLst.labelpy});
      },
      getNumVal () {
        this.getVal();
      },
      // 获取type类型的所有值
      getAllVal () {
        this.numberEntryTitle = this.numberEntryLst.label;
        this.isRequired = this.numberEntryLst.Isrequired;
        if (sessionStorage.getItem("field-" + this.numberEntryLst.labelpy) !== null) {
          this.numberVal = sessionStorage.getItem("field-" + this.numberEntryLst.labelpy);
        }
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
    },
    data () {
      return {
        numberEntryTitle: '', // 数字输入框的标题
        numberVal: '', // 数字绑定的值
        isRequired: 'false' // 是否是必填的
      }
    },
    watch: {
    }
  }
</script>
<style scoped>
  .numCase{
    width: 100%;
    height: 25px;
    text-align: right;
    font-size: 16px;
    color: #666666;
    border: 0;
    outline: none;
  }
</style>
<style>
  /*.fieldNumberEntry .gp .weui-cells {
    margin-top: 0;
  }*/
  .fieldNumberEntry .weui-cell .weui-cell__ft {
    width: 50%;
  }
</style>
