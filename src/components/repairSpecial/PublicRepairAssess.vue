<template>
  <div class="repairAssess">
    <group>
      <cell title="打分">
        <rater v-model="starNum"></rater>
      </cell>
      <x-textarea title='评价内容' v-model="evalContent" placeholder="请输入评价内容" :show-counter="false" :rows="1" autosize></x-textarea>
    </group>
    <x-button-one :titleVal="'保存提交'" @click-button="addSubmit"></x-button-one>
  </div>
</template>
<script>
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import rater from 'vux/src/components/rater/index.vue'
  import XButtonOne from '../common/XButtonOne.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'special-repairAssess',
    components: {
      Group,
      rater,
      Cell,
      XTextarea,
      XButtonOne
    },
    data () {
      return {
        isStudent: true, // 判断用户类型，学生-true, 老师 - false
        starNum: 0, // 评价 0颗星
        evalScore: 0, // 评价分
        evalContent: '' // 评价内容
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    created () {
      this.judgeUserType(); // 判断用户类型
    },
    methods: {
      // 判断用户类型
      judgeUserType () {
        this.userinfo && this.userinfo.stuObj.XH ? this.isStudent = true : this.isStudent = false;
      },
      // 提交‘维修评价’
      async addSubmit () {
        if (this.evalContent ==='') {
          this.QD.alert('', '请输入评价内容！');
          return;
        }
        if (this.starNum !== 0) {
          if (this.starNum === 1) {
            this.evalScore = 2;
          }
          if (this.starNum === 2) {
            this.evalScore = 4;
          }
          if (this.starNum === 3) {
            this.evalScore = 6;
          }
          if (this.starNum === 4) {
            this.evalScore = 8;
          }
          if (this.starNum === 5) {
            this.evalScore = 10;
          }
        }
        let objInfo = {
          apiName: 'UpdateRepairEvalInfo',
          IsStudent: this.isStudent, // 是否是学生
          BXID: this.$route.query.id,
          EvalScore: this.evalScore,
          EvalContent: this.evalContent
        };
        let that = this;
        this.QD.confirm('', '确认保存提交', async function() {
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', objInfo);
          that.loading = false;
          d = JSON.parse(d);
          console.log('UpdateEval', d);
          if (d.status && d.status === "error") {
            console.log(d.msg);
            that.QD.alert(`保存提交失败`);
            return;
          }
          if (d.success) {
            // 跳转到绑定页面-'报修详情'
            that.$router.go(-1);
          }
        });
      }
    }
  }
</script>
<style scoped>
</style>
<style>
  .repairAssess .weui-cells{
    margin-top: 0;
  }
</style>
