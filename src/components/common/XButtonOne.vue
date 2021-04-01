<template>
  <div class="but-box">
    <x-button type="primary" :class="`btn ${userType === 4 ? 'stuBtn' : 'teaBtn'}`" :mini="true" @click.native="clickButton">{{titleVal}}</x-button>
  </div>
</template>
<script>
  import XButton from 'vux/src/components/x-button/index.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'commonXButtonOne',
    directives: {
    },
    components: {
      XButton
    },
    props: {
      titleVal: {
        type: String,
        default: '保存'
      }
    },
    data () {
      return {
        userType: 4 // 4 是学生，2 是老师
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    created () {
      this.userinfo && this.userinfo.usertype === 4 ? this.userType = 4 : this.userType = 2;
      console.log('userType', this.userType);
    },
    methods: {
      clickButton () {
        this.$emit('click-button');
      }
    }
  }

</script>
<style scoped lang="less">
  .but-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    line-height: 40px;
    background-color: #fff;
  }
  .btn{
    width: 98%;
    line-height: 40px;
    font-size: 16px;
  }
  .teaBtn{
    background-color: @tea-theme-color;
  }
  .stuBtn{
    background-color: @stu-theme-color
  }
</style>

