<!--班级列表-->
<template>
  <div class="lst-box">
    <group v-for="(item, idx) in lst" :key="idx" :gutter="8" @click.native="goDetail(item, 0)">
      <cell :is-link="true" class="cell-box">
        <div slot="icon" class="class-icon school-wx-icon">&#xe68c;</div>
        <div slot="inline-desc">
          <p class="bjmc">{{item.bjmc}}</p>
          <p class="people-number">
            已填<span class="number-color" @click.stop="goDetail(item, 0)">{{item.submitSum}}</span>
            未填<span class="number-color" @click.stop="goDetail(item, 1)">{{item.claStuSum - item.submitSum}}</span>
          </p>
        </div>
      </cell>
    </group>
  </div>
</template>
<script>
  import { Group, Cell } from 'vux'
  export default {
    name: 'classLst',
    props: {
      lst: Array
    },
    components: {
      Group,
      Cell
    },
    data() {
      return {}
    },
    methods: {
      goDetail(val, tabIdx) {
        this.$emit('go-detail', val, tabIdx)
      }
    }
  }
</script>
<style scoped lang="less">
  .cell-box{
    padding:8px 16px;
  }
.lst-box{
  .class-icon{
    width: 36px;
    line-height: 36px;
    color: #fff;
    font-size: 22px;
    text-align: center;
    border-radius: 4px;
    background: #107EFF;
    padding-right: 0;
    margin-right:12px;
  }
  .bjmc{
    color:@color4;
    font-size: 15px;
    margin-bottom:4px;
    font-weight: bold;
  }
  .people-number{
    font-size: 12px;
    color: #7A7E80;
    .number-color{
      font-size: 14px;
      color: @tea-theme-color;
      font-weight: bold;
      padding:0 8px 0 4px;
    }
  }
}
</style>
