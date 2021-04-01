<template>
  <div class="moral-stulst-bj">

    <div v-if="parentData" class="bj-info bottomHalfLine" ref="bjinfoBlock">
      <span class="inline">{{parentData.selectBjData.bjmc}}</span>
      <span v-if="parentData.pyType === 2" class="inline">{{parentData.selectXndInfo[0]}}年度</span>
      <span v-else-if="parentData.pyType === 1" class="inline">{{parentData.selectXqName}}</span>
    </div>
    <div v-show="!showWritePg" class="stu-content" :style="stuStyle">
      <van-divider v-if="!loaded && stuLst.length === 0">没有学生数据</van-divider>
      <stu-lst
        v-for="(s, sidx) in stuLst"
        :key="sidx"
        class="stu-box"
        :gutter="'0'"
        :item="s"
        :isLink="onlyQuery && s.write ? true: !(onlyQuery && !s.write)"
        :showIconTitle="true"
        :iconTitleType="false"
        @click-cell="goStuWritePg">
        <div slot="iconTitle">{{s.xm.substr(s.xm.length -2, 2)}}</div>
        <div slot="right-info" class="content-block">
          <div class="block">
            <span class="xm">{{s.xm}}</span>
            <span class="xh">({{s.xh}})</span>
          </div>
          <template v-if="s.write">
            <div class="block sore-desc">
              <template v-if="s.score">{{s.score}}分,</template>
              {{s.pddd}}
            </div>
            <div class="block pynr">评语内容: {{s.pynr}}</div>
          </template>
          <template v-else>
            <span class="no-write">未登记</span>
          </template>
        </div>
      </stu-lst>
    </div>

    <write-moral
      v-if="showWritePg"
      :write="writeStuInfo.write"
      :info="writeStuInfo"
      :canVerify="!onlyQuery"
      @cancel="cancelEvent"
      @success="successEvent"></write-moral>

  </div>
</template>
<script>
  import { Divider } from 'vant'
  import StuLst from '../common/VerifyLst.vue'
  import WriteMoral from './components/WriteMoral.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'stuLstByBj',
    directives: {
    },
    components: {
      [Divider.name]: Divider,
      StuLst,
      WriteMoral
    },
    data() {
      return {
        loaded: true,
        onlyQuery: this.$route.query.onlyQuery, // 管理员只能查看学生的品德评语
        showWritePg: false, // 默认不显示A学生的登记页面
        stuStyle: {top: '88px'}, // 学生数据距离顶部的高度
        parentData: null, // 父级信息
        stuLst: [], // 学生信息
        writeStuInfo: null // 要登记学生的信息
      }
    },
    created () {
      this.getParentPageData() // 得到父级的信息
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 到学生详情页面
      goStuWritePg (e) {
        console.log("...e", e)
        this.writeStuInfo = e.info;
        this.showWritePg = true
      },
      // 保存成功事件
      successEvent() {
        this.showWritePg = false
      },
      // 取消登记事件
      cancelEvent() {
        this.showWritePg = false
      },
      // 得到父级的信息
      getParentPageData() {
        if (this.QD.parentPageData) {
          this.parentData = this.QD.parentPageData;
          this.getBjInfoHeight(); // 得到班级信息的高度
          this.getBjData() // 得到班级内的所有学生信息
        } else {
          this.$router.go(-1)
        }
      },
      // 得到班级信息的高度
      getBjInfoHeight() {
        this.$nextTick(() => {
          let hei = this.$refs.bjinfoBlock.clientHeight;
          this.stuStyle.top = hei + 46 + 'px'; // 46 为头部的高度
        })
      },
      // 得到班级内的所有学生信息
      async getBjData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuMoralCommentList',
          classId: parseInt(this.$route.query.classId),
          moralType: parseInt(this.$route.query.pyType),
          xn: parseInt(this.$route.query.xn)
        });
        this.updateLoadingStatus(false);
        this.loaded = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          return []
        }
        console.log("stu = ", d)
        this.stuLst = d.data
      }
    }
  }
</script>
<style>
  .moral-stulst-bj .stu-box .weui-cells:before{
    border-top: 0;
  }
</style>
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
  .stu-content{
    position: absolute;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow-y: auto;
    .stu-box{
      position: relative;
    }
  }
  .content-block{
    .xm{
      font-size: 16px;
      color: #18191A;
    }
    .xh{
      font-size: 16px;
      color: #666666;
    }
    .sore-desc{
      font-size: 14px;
      color: @tea-theme-color;
    }
    .pynr{
      font-size: 14px;
      color: #666666;
      word-wrap: break-word;
      word-break: break-all;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      line-clamp: 4;
      -webkit-box-orient: vertical;
    }
    .no-write{
      font-size: 12px;
      color: #ff0000;
    }
  }
</style>

