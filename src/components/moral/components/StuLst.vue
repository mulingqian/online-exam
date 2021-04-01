<!--学生列表-->
<template>
  <div class="lst-box stu-box">
    <group>
      <cell :is-link="true" v-for="(item, idx) in lst" :key="idx" class="cell-box"  @click.native="goDetail(item)">
        <div slot="icon" class="class-icon">
          <svg class="icon-svg" aria-hidden="true">
            <use xlink:href="#qdicon-pingyu1"></use>
          </svg>
        </div>
        <div slot="inline-desc" class="inline-desc">
          <p class="bjmc">{{item.xm}} ({{item.xh}})</p>
          <p class="people-number">
            得分<span class="number-color">{{item.score}}</span>
            品德等第<span class="number-color">{{item.PDDD ? itme.PDDD : '无'}}</span>
            评语内容： <span class="py">{{item.PYNR}}</span>
          </p>
        </div>
      </cell>
    </group>
  </div>
</template>
<script>
  import { Group, Cell } from 'vux'
  export default {
    name: 'stuLst',
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
      goDetail(val) {
        this.$emit('go-stu-detail', val)
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
      font-size: 44px;
      text-align: center;
      margin-right:12px;
    }
    .bjmc{
      color:@color4;
      font-size: 15px;
      margin-bottom:4px;
      font-weight: bold;
    }
    .people-number{
      display: flex;
      font-size: 12px;
      color: #7A7E80;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .number-color{
        color: @tea-theme-color;
        font-weight: bold;
        padding:0 8px 0 4px;
      }
    }
  }

  .inline-desc{
    width:90%;
    .py{
      width:90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
<style lang="less">
  .stu-box{
    .vux-cell-primary{
      width:50%;
    }
  }
</style>
