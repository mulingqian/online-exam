<template>
  <span class="verifyTitle">
    <a :class="'a-button'+v.type" v-for="(v, vidx) in buttonValLst" :key="vidx" @click.stop.prevent="clickButtonWay(v)">{{v.label}}</a>
  </span>
</template>
<script>
  export default {
    name: 'commonButtonVal',
    directives: {},
    components: {
    },
    props: {
      item: { // 信息，包括id-调用接口时用的id
        type: Object,
        default: null
      },
      itemIndex: { // 信息所在数组对象中的位置
        type: Number,
        default: 0
      },
      buttonValLst: { // 退回和通过默认两个
        type: Array,
        default: function () {
          return [{label: '通过', type: 2}, {label: '拒绝', type: 4}]
        }
      }
    },
    methods: {
      // 点击事件
      clickButtonWay (type) {
        this.$emit('get-ButtonVal', {type: type, info: this.item, itemIndex: this.itemIndex});
      }
    }
  }
</script>
<style scoped>
  .verifyTitle{
    overflow: hidden;
    display: block;
    margin-top: 6px;
  }
  .verifyTitle>a{
    float: right;
    margin: 8px 0 0 10px;
    padding: 0 8px;
    border-radius: 8px;
  }
  .a-button2{
    color: #2971d7;
    border: 1px solid #2971d7;
  }
  .a-button4{
    color: #d14629;
    border: 1px solid #d14629;
  }
</style>

