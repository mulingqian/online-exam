<template>
  <div class="repairResult">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <datetime v-model="repairTime" format="YYYY-MM-DD" @on-change="startTimechange" title="维修时间"></datetime>
      <cell>
        <span slot="after-title" class="vux-label">
         <span>维修费用(元)</span>
        </span>
        <span slot="default" class="rg-cell">
          <input type="number" class="repairCost" v-model="RepairExpenses" placeholder="请输入维修费用" />
        </span>
      </cell>
      <x-textarea title='维修结果' v-model="repairResult" class="repairResult-textarea" placeholder="请输入维修结果" :show-counter="false" :rows="1" autosize></x-textarea>
    </group>
    <div class="btn-box">
      <x-button @click.native="addSubmit" type="primary" class="btn-save" mini>提交</x-button>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'

  import Datetime from 'vux/src/components/datetime/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'special-repairResult',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Datetime,
      Group,
      Cell,
      XTextarea,
      XButton
    },
    data () {
      return {
        loading: false,
        isStudent: true, // 判断用户类型，学生-true, 老师 - false
        repairTime: '选择', // 维修安排时间
        repairResult: '', // 维修结果
        RepairExpenses: '' // 维修费用
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
      // 选择‘维修时间’
      startTimechange (value) {
        this.repairTime = value;
      },
      // 提交‘维修结果’
      async addSubmit () {
        let rTime; // 维修时间
        if (this.repairResult ==='') {
          this.QD.alert('', '请输入维修结果！');
          return;
        }
        if (this.RepairExpenses !== '') {
          let patrn = /^(-)?\d+(\.\d+)?$/;
          if (patrn.exec(this.RepairExpenses) === null) {
            this.QD.alert('', '维修费用为数字！');
            return;
          }
        }
        if (this.repairTime === '选择') {
          rTime = '';
        } else {
          rTime = this.repairTime
        }
        let objInfo = {
          apiName: 'SaveRepairResult',
          IsStudent: this.isStudent,
          BXID: this.$route.query.id,
          States: 4,
          RepairResult: this.repairResult,
          RepairExpenses: parseInt(this.RepairExpenses),
          RepairTime: rTime
        };
        let that = this;
        this.QD.confirm('', '确认提交', async function() {
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', objInfo);
          that.loading = false;
          d = JSON.parse(d);
          if (!d.success) {
            console.log(d.msg);
            that.QD.alert(`提交失败`);
          } else {
            // 跳转到绑定页面-'报修详情'
            that.$router.go(-1);
          }
        });
      }
    }
  }
</script>
<style scoped>
  .vux-label{
    width: 100px;
  }
  .repairResult .rg-cell {
    padding-right: 10px;
    font-size: 16px;
    color: #666666;
  }
  .repairCost{
    width: 100%;
    height: 25px;
    text-align: right;
    font-size: 16px;
    color: #666666;
    border: 0;
    outline: none;
  }
  .repairResult-textarea{
    font-family: "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1";
  }
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
  .btn-save{
    width: 100%;
    height: 40px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
  }
</style>
<style>
  .repairResult .weui-cells{
    margin-top: 0;
  }
</style>
