<template>
  <div class="select-actionsheel-val">
    <group class="gp">
      <cell :is-link="true" @click.native="showStatusPanelWay()">
        <span slot="after-title">{{title}}</span>
        <span>{{selectVal}}</span>
      </cell>
    </group>
    <actionsheet v-model="showLst" :menus="valueLst" :show-cancel="true" @on-click-menu="getStatusVal"></actionsheet>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Actionsheet from 'vux/src/components/actionsheet/index.vue'
  export default {
    name: 'selectActionsheelVal',
    directives: {
    },
    components: {
      Group,
      Cell,
      Actionsheet
    },
    props: {
      title: String,
      valueLst: Array,
      defaultStatus: {
        type: Object,
        default: null
      }
    },
    methods: {
      // 判断状态值面板是否出现
      showStatusPanelWay () {
        this.showLst = true;
      },
      // 选择状态值和状态值对应的数字
      getStatusVal (menuKey, menuItem) {
        if (menuItem !== undefined && this.selectVal !== menuItem.label) {
          this.selectVal = menuItem.label;
          this.$emit('get-val', {info: menuItem}); // 向父级传选中的信息
        }
      }
    },
    created () {
      this.selectVal = this.defaultStatus.label; // 得到默认选中的值
    },
    data () {
      return {
        showLst: false, // 是否显示列表
        selectVal: null // 选中的面板值
      }
    }
  }
</script>
<style>
  .select-actionsheel-val .weui-actionsheet__cell{
    font-size: 16px;
    color: #333333;
  }
</style>
<style scoped>
  .gp{
    margin-top: -20px;
  }
</style>
<!--  statusLst: [{ // 状态值列表
     label: '全部',
     type: -1
     }, { // 状态值列表
     label: '审核中',
     type: 2
     }, {
     label: '审核通过',
     type: 3
     }, {
     label: '审核退回',
     type: 1
     }, {
     label: '撤回',
     type: 9
     }]-->
