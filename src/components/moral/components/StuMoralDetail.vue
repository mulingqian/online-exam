<template>
  <div class="stu-moral-detail" v-if="info">
    <group gutter="0">
      <cell>
        <div slot="icon">
          <span class="school-wx-icon stu-icon">&#xe68b;</span>
        </div>
        <div slot="after-title">
          <span class="xm">{{info.xm}}</span>
          <span class="xh">({{info.xh}})</span>
        </div>
      </cell>
      <cell>
        <div slot="after-title">
          <span class="title-text">得分</span>
        </div>
        <span>{{info.score}}</span>
      </cell>
      <cell>
        <div slot="after-title">
          <span class="title-text">品德等第</span>
        </div>
        <span>{{info.pddd}}</span>
      </cell>
      <cell>
        <div slot="after-title">
          <span class="title-text">评语内容</span>
        </div>
        <div slot="inline-desc">{{info.pynr}}</div>
      </cell>
    </group>
  </div>

</template>
<script>
  import { Group, Cell } from 'vux'
  export default {
    name: 'stuMoralDetail',
    directives: {},
    components: {
      Group,
      Cell
    },
    props: {
      info: {
        type: Object,
        default: null
      } // 学生信息
    },
    data() {
      return {
      }
    },
    created () {
    },
    methods: {
    }
  }
</script>
<style scoped lang="less">
  .stu-icon{
    font-size: 22px;
    color: @tea-theme-color;
  }
  .xm{
    font-size: 16px;
    color: #18191A;
  }
  .xh{
    font-size: 16px;
    color: #666666;
  }
  /* 查看 title */
  .title-text{
    font-size: 16px;
    color: #333333;
  }
</style>
