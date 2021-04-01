<template>
  <div class="page-detail">
    <group class="gp">
      <cell title="姓名">
        <span class="demo-icon" slot="icon" style="color:#f0ad4e;">&#xe642;</span>
        <span slot="value">{{ userInfo.XM }}</span>
      </cell>
      <cell title="学号">
        <span class="demo-icon" slot="icon" style="color:#f0ad4e;">&#xe668;</span>
        <span slot="value">{{ userInfo.XH }}</span>
      </cell>
      <cell title="班级">
        <span class="demo-icon" slot="icon" style="color:#f0ad4e;">&#xe612;</span>
        <span slot="value">{{ userInfo.BJMC }}</span>
      </cell>
      <cell title="年级">
        <span class="demo-icon" slot="icon" style="color:#f0ad4e;">&#xe62e;</span>
        <span slot="value">{{ userInfo.NJMC }}</span>
      </cell>
      <cell title="专业">
        <span class="demo-icon" slot="icon" style="color:#f0ad4e;">&#xe655;</span>
        <span slot="value">{{ userInfo.ZYMC }}</span>
      </cell>
    </group>
  </div>
</template>

<script>
  // import {Group, XInput, XImg, Selector, XButton} from 'vux'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'

  export default {
    name: 'mydetail',
    directives: {
    },
    components: {
      Group,
      Divider,
      Cell
    },
    methods: {
      getUserInfo () {
        this.userInfo = this.QD.getLocalUserinfo().stuObj;
        console.log(this.userInfo);
      }
    },
    created () {
      this.getUserInfo();
    },
    data () {
      return {
        userInfo: {}
      }
    },
    computed: {
    },
    watch: {
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -1.25em;
  }
</style>
