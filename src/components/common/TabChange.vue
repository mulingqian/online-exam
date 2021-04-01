<template>
  <tab v-if="tabItemLst.length > 0" class="tab-change" :bar-active-color="userType ? '#13c22b' : '#13c22b'" :line-width=2>
    <tab-item @on-item-click="typeMenuClick" :active-class="userType ? 'tea-active-tab-item' : 'stu-active-tab-item'" v-for="(item, tIdx) in tabItemLst" :key="tIdx" :selected="item.type === defaultTypeVal">{{item.title}}</tab-item>
  </tab>
</template>
<script>
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  export default {
    name: 'commonTabChange',
    directives: {
    },
    components: {
      Tab,
      TabItem
    },
    props: {
      userType: { // 用户类型，默认是老师
        type: Boolean,
        default: true
      },
      selectedTabType: {
        type: Number,
        default: 1 // 默认选中第一个
      },
      tabItemLst: { // tab中的标题 [{ title: '', type: 1}],type 从1开始
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    methods: {
      // 选中 tab中的事件
      typeMenuClick(index) {
        this.defaultTypeVal = this.tabItemLst[index].type;
        this.$emit('get-TabVal', {type: this.defaultTypeVal});
      }
    },
    created () {
      this.defaultTypeVal = this.selectedTabType;
    },
    data () {
      return {
        defaultTypeVal: {
          type: Number,
          default: 1 // 默认选中第一个
        }
        /*getBarWidth: function (index) {
          if (index !== undefined) {
            return (this.$parent.tabItemLst[index].title.length) * 16 + 'px' // 设置tab的长度
          }
        }*/
      }
    }
  }
</script>
<style>
  /* tab 滚动天宽度 */
  .tab-change .scrollable .vux-tab-item {
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 27%;
    flex: 0 0 27%;
  }
</style>
<style scoped>
  .stu-active-tab-item{ /* tab的颜色 */
    color: #13c22b!important;
    border-color: #13c22b!important;
  }
  .tea-active-tab-item{
    color: #13c22b!important;
    border-color: #13c22b!important;
  }
</style>
