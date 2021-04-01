<template>
  <div class="p-entry">
    <div class="loading" >
      <div class="loading-logo-wrap">
        <div class="loading-logo">
          <div class="welcome">正在跳转... </div>
          <div class="loading-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'qdssoentry',
  components: {
  },
  methods: {
    // 跳转第三方系统
    async jumpTo (){
      console.log("this.$route.params", this.$route.params.cid);
      let uInfo = this.QD.getLocalUserinfo();
      let schoolUserId = uInfo.usertype === 4 ? uInfo.stuObj.XH : uInfo.stuObj.UserId;
      let d = await this.QD.getData('/ComApi/GetSsoEntry', {userId: schoolUserId, cid: this.$route.params.cid});
      console.log("GetSsoEntry is -------------", d);
      if (d.status && d.status === "error") {
        console.log("报错", d.msg);
        var that = this;
        this.QD.alert('', d.msg, () => {
          that.QD.go('BACK', that.$router);
        });
        return;
      }
      this.QD.go(d.redir, this.$router);
    }
  },
  created () {
    console.log(`qdsso entry created`)
    this.jumpTo();
  },
  data () {
    return {tip: '正在加载'}
  },
  computed: {
    ...mapState({
      userinfo: state => state.vux.userinfo,   // 用户信息
      qrcodescankey: state => state.vux.qrcodescankey // // 绑定后的扫码登录，路径的参数值
    })

  },
  watch: {
    userinfo (userinfo) {
      console.log(`entry waching userinfo changed:${userinfo}`)
      this.checkAccess()
    }
  }
}
</script>
<style scoped>
  .p-entry{
    background-color: #fff;
    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
  }
  .loading{
    width:100%;
    height:100%;
    background-color: #fdb933;
    position: fixed;
    z-index:99;
  }
  .loading-logo-wrap{
    width:80%;
    position: absolute;
    top: 20%;
    transform: translate3d(-50%,-50%,0);
    -webkit-transform: translate3d(-50%,-50%,0);
    left: 50%;
  }
  .loading-bg{
    display: block;
    width:90%;
    margin:0 auto;
    max-width: 300px;
  }
  .loading-logo{
    display: block;
    position: absolute;
    width:60%;
    top:14%;
    left:50%;
    -webkit-transform:translateX(-50%);
    transform:translateX(-50%);
    max-width: 200px;
    color: #fff;
    text-align: center;
  }
  .loading-logo .welcome{
    line-height:1.6em;
  }
  .loading-logo img{
    width:100%;
  }
  .loading-line{
    width:100%;
    position: absolute;
    height:1px;
    background-color: rgba(255,255,255,.7);
    bottom:-10%;
    animation:lineAnimate 2s infinite;
    -webkit-animation:lineAnimate 2s infinite;
    -webkit-transform-origin: 0 0;
  }
  @keyframes lineAnimate{
    from {transform: scaleX(0)}
    to {transform: scaleX(1)}
  }
  @-webkit-keyframes lineAnimate{
    from {-webkit-transform: scaleX(0)}
    to {-webkit-transform: scaleX(1)}
  }
</style>
