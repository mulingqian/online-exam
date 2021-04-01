<template>
  <div class="write-stu-py">
    <van-field v-model="stuInfo.score" :readonly="stuInfo.onlyQuery ? true : false" type="number" label="得分" placeholder="请输入得分" @blur="getStuInfo"/>
    <van-field readonly clickable label="品德等第" :value="stuPddd" @click="stuInfo.onlyQuery ? null :showPicker= true"/>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="pdddLst"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>


    <van-field
      v-model="stuInfo.pynr"
      :readonly="stuInfo.onlyQuery ? true : false"
      rows="1"
      autosize
      maxlength="2000"
      label="评语内容"
      type="textarea"
      placeholder="请输入评语内容"
      @blur="getStuInfo"
    />
  </div>
</template>
<script>
  import { Field, Picker, Popup } from 'vant'
  export default {
    name: 'writeStuPy',
    components: {
      [Field.name]: Field,
      [Picker.name]: Picker,
      [Popup.name]: Popup
    },
    props: {
      stuInfo: {
        type: Object,
        default: function () {
          return {}
        }
      },
      pddd: { // 品德等第
        type: String,
        default: ''
      },
      pdddLst: { // 品德等第下拉选择数据
        type: Array,
        default: []
      }
    },
    data() {
      return {
        stuPddd: '',
        showPicker: false //品德等第下拉框
      }
    },
    created () {
      this.stuPddd = this.pddd
    },
    methods: {
      // 选择品德等第
      onConfirm(value) {
        this.stuPddd = value;
        this.showPicker = false;
        this.$emit('getStuInfo', this.stuInfo, this.stuPddd)
      },
      // 得分
      getStuInfo(val) {
        this.$emit('getStuInfo', this.stuInfo, this.stuPddd)
      }
    }
  }
</script>
<style lang="less">
  .write-stu-py{
    .weui-cells:before{
      display: none;
    }
    .van-field__label{
      color:#313233;
    }
  }
</style>
<style scoped lang="less">
  .write-stu-py{
    font-size: 14px;
    margin-bottom:20px;
    border:0.5px solid #f2f2f2;
    /*background: #E5E5E5;*/
  }
</style>
