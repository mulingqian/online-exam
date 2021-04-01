<template>
  <change-pwd :initiativeChangePwd="true" :bindUserInfo="userinfo" ref="changePwd" @success-result="successUpdatePwd"></change-pwd>
</template>
<script>
  import ChangePwd from './ChangePwd.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'initiativeChangePwd',
    components: {
      ChangePwd
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    data () {
      return {
        backLoaded: true
      }
    },
    created () {
    },
    mounted () {
      this.$refs.changePwd.doShowPg();
    },
    methods: {
      // 成功修改密码
      successUpdatePwd () {
        let that = this;
        this.QD.alert('', '密码修改成功', function() {
          if (that.backLoaded) {
            that.backLoaded = false;
            that.$router.go(-1);
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .initiative-change-pwd{
    position: static;
  }
</style>

