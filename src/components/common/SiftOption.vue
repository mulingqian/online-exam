<template>
  <div class="block" v-if="objData">
    <van-cell :border="false"
              :is-link="objData.lst.length > defaultUnfold"
              :arrow-direction="objData.unfold ? 'up' : 'down'" @click="objData.unfold = !objData.unfold">
      <template #title>
        <span class="custom-title">{{title}}</span>
      </template>
    </van-cell>
    <div class="block-content clearfloat" v-if="objData.lst.length > 0">
      <div v-if="!objData.unfold && idx < defaultUnfold" v-for="(item, idx) in objData.lst" :key="idx" class="inline">
        <div class="text-box">
          <span :class="`text ${selectIndex === idx ? 'active' : ''}`" @click="getVal(item, idx)">{{item.name}}</span>
        </div>
      </div>
      <div v-if="objData.unfold" v-for="(item, idx) in objData.lst" :key="idx" class="inline">
        <div class="text-box" @click="getVal(item, idx)">
          <span :class="`text ${selectIndex === idx ? 'active' : ''}`">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Cell } from 'vant'
  export default {
    name: 'OptionPanel',
    components: {
      [Cell.name]: Cell
    },
    props: {
      cancelVal: { // 默认可以取消选中的值
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ''
      },
      objData: {
        type: Object,
        default: null
      },
      defaultUnfold: { // 开始默认展开的个数
        type: Number,
        default: 4
      },
      defaultSelectIndex: { // 默认选中的值
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        selectIndex: this.defaultSelectIndex
      }
    },
    watch: {
      defaultSelectIndex () {
        this.selectIndex = this.defaultSelectIndex
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      // 得到选中的值
      getVal(val, index) {
        let value = val;
        let idx = index;
        // 选中可以取消
        if (this.selectIndex !== index) {
          this.selectIndex = index;
        } else if (this.cancelVal) {
          this.selectIndex = -1;
          value = null;
          idx = -1;
        }
        this.$emit('get-val', {value: value, index: idx});
      }
    }
  }
</script>
<style>
</style>
<style scoped lang="less">
  .block{
    position: relative;
    padding: 6px;
  }
  .custom-title{
    color:#000;
    font-size: 16px;
    font-weight: bold;
  }
  .block-content{
    position: relative;
    width: 100%;
    .inline{
      display: inline-block;
      width: 50%;
      .text-box{
        margin: 8px 0;
        padding: 0 8px;
      }
      .text{
        display: inline-block;
        width: 100%;
        padding: 6px 2px;
        text-align: center;
        font-size: 14px;
        color: #626664;
        line-height: normal;
        letter-spacing: 0.2px;
        border-radius: 2px;
        background: #f2f5f3;
        border: 1px solid #f2f5f3;
      }
      .active{
        color: @tea-theme-color;
        background: #ffffff;
        border: 1px solid @tea-theme-color;
      }
    }
  }
</style>
