<!-- 管理员搜索出来的学生，点击查看学生品德评语详情 -->
<template>
  <div class="stu-detail-by-search" v-if="parentData">
    <div class="bj-info bottomHalfLine">
      <span class="inline">{{parentData.selectBjData.bjmc}}</span>
      <span v-if="parentData.pyType === 2" class="inline">{{parentData.selectXndInfo[0]}}年度</span>
      <span v-else-if="parentData.pyType === 1" class="inline">{{parentData.selectXqName}}</span>
    </div>
    <stu-moral-detail v-if="stuInfo" :info="stuInfo"></stu-moral-detail>
    <!-- 提示 学生未填写品德评语 -->
    <template v-if="!loaded && !stuInfo">
      <group gutter="0">
        <cell>
          <div slot="icon">
            <span class="school-wx-icon stu-icon">&#xe68b;</span>
          </div>
          <div slot="after-title">
            <span class="xm">{{parentData.selectBjData.xm}}</span>
            <span class="xh">({{parentData.selectBjData.xh}})</span>
          </div>
        </cell>
      </group>
      <van-divider>未填写品德评语</van-divider>
    </template>
  </div>
</template>
<script>
  import StuMoralDetail from './components/StuMoralDetail.vue'
  import { Group, Cell } from 'vux'
  import { Divider } from 'vant'
  import { mapActions } from 'vuex'
  export default {
    name: 'stuMoralDetailBySearch',
    directives: {},
    components: {
      StuMoralDetail,
      Group,
      Cell,
      [Divider.name]: Divider
    },
    data() {
      return {
        loaded: true,
        parentData: null, // 父级信息
        stuInfo: null // 学生详情信息
      }
    },
    created () {
      this.getParentPageData() // 得到父级的信息
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 得到父级的信息
      getParentPageData() {
        if (this.QD.parentPageData) {
          this.parentData = this.QD.parentPageData;
          this.getStuDetail() // 得到学生详情信息
        } else {
          this.$router.go(-1)
        }
      },
      // 得到学生详情信息 GetStuMoralComment/{xh}/{moralType}/{xn}
      async getStuDetail() {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuMoralComment',
          xh: this.$route.query.xh,
          moralType: parseInt(this.$route.query.pyType),
          xn: parseInt(this.$route.query.xn)
        });
        this.updateLoadingStatus(false);
        this.loaded = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
        } else {
          console.log(d);
          this.stuInfo = d.data
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .bj-info{
    position: relative;
    display: flex;
    padding: 18px 0 10px 0;
    .inline{
      flex: 1;
      padding: 0 15px;
      text-align: center;
      color: #000000;
      font-size: 14px;
    }
  }
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
</style>
