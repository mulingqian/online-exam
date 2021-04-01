<template>
  <div class="repairAssess">
    <group>
      <cell title="打分">
        <rater v-model="starNum"></rater>
      </cell>
      <x-textarea title='评价内容' v-model="evalContent" placeholder="请输入评价内容" :show-counter="false" :rows="1" autosize></x-textarea>
    </group>
    <div class="submit" @click="addSubmit()">
      <a>保存提交</a>
    </div>
  </div>
</template>
<script>
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import rater from 'vux/src/components/rater/index.vue'

  export default {
    name: 'repairAssess',
    components: {
      Group,
      rater,
      Cell,
      XTextarea
    },
    methods: {
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
        let that = this;
        this.QD.confirm('', '确认保存', async function(){
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'UpdateDeviceRepairEvalInfo',
            BXID: that.$route.query.id,
            EvalScore: that.evalScore,
            EvalContent: that.evalContent
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            console.log(d.msg);
            that.QD.alert(`保存提交失败`);
            return;
          }
          if (d.status === 'success') {
            that.QD.alert('', `保存成功！`);
            // 跳转到绑定页面-'报修详情'
            that.$router.go(-1);
          }
        });
      }
    },
    data () {
      return {
        starNum: 0, // 评价 0颗星
        evalScore: 0, // 评价分
        evalContent: '' // 评价内容
      }
    }
  }
</script>
<style scoped>
  .submit{
    position: absolute;
    width: 100%;
    bottom: 0;
    margin-top: 30px;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  .submit a{
    display: inline-block;
    padding: 12px 10px;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    border-radius: 3px;
  }
</style>
<style>
  .repairAssess .weui-cells{
    margin-top: 0;
  }
</style>
