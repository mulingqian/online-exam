<template>
  <div class="fieldSingleSelect">
    <group class="gp">
      <!--单选框-->
      <popup-picker v-model="singleCaseVal" :data="singleCaseData" @on-change="onChangeSingleVal">
        <span slot="title">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{singleSelectTitle}}
        </span>
      </popup-picker>
    </group>
  </div>
</template>
<script>
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'fieldSingleSelect',
    components: {
      PopupPicker,
      Group
    },
    props: {
      singleSelectLst: Object
    },
    methods: {
      // 单选框 选择值
      onChangeSingleVal (val) {
        this.singleCaseVal = [val[0]];
        console.log("val[0] is:", val[0]);
        this.$emit('get-val', {val: this.singleCaseVal[0], labelpy: this.singleSelectLst.labelpy});
      },
      // 获取type类型的所有值
      getAllVal () {
        this.singleSelectTitle = this.singleSelectLst.label;
        this.isRequired = this.singleSelectLst.Isrequired;
        this.singleCaseData[0] = this.singleSelectLst.options;
        if (sessionStorage.getItem("field-" + this.singleSelectLst.labelpy) !== null) {
          this.singleCaseVal[0] = sessionStorage.getItem("field-" + this.singleSelectLst.labelpy);
        } else {
          this.singleCaseVal[0] = this.singleSelectLst.options[0];
        }
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
    },
    data () {
      return {
        singleSelectTitle: '', // 单选框的标题
        singleCaseVal: [], // 单选框的val
        singleCaseData: [], // 单选框中有哪些值如：['普通', '紧急', '非常紧急']
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style scoped>
</style>
<style>
  .fieldSingleSelect .gp .vux-popup-picker-select .vux-cell-value{
    color: #666666;
  }
</style>
