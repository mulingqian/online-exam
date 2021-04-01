<template>
  <div class="write-moral" v-if="stuInfo">

    <group gutter="12">
      <cell class="stu-info">
        <div slot="icon">
          <span class="school-wx-icon stu-icon">&#xe68b;</span>
        </div>
        <div slot="after-title">
          <span class="xm">{{stuInfo.xm}}</span>
          <span class="xh">({{stuInfo.xh}})</span>
        </div>
      </cell>
    </group>
    <!--品德评语信息-->
    <write-stu-py :stuInfo="stuInfo" :pddd="pddd" :pdddLst="pdddLst" @getStuInfo="getStuInfo"></write-stu-py>
    <!--保存-->
    <div class="save-btn" v-if="!stuInfo.onlyQuery" @click="submitEvent()">
      <van-button type="primary" size="large" class="btn">保存</van-button>
    </div>

    <!--点击查看其他学年度品德评语 start-->
    <div class="other-year-pdpy-box">
      <p class="title" @click="showOtherYear = !showOtherYear">
        点击查看其他学年度品德评语
        <span class="school-wx-icon other-year-icon" v-if="showOtherYear">&#xe9fc;</span>
        <span class="school-wx-icon other-year-icon" v-else>&#xe68e;</span>
      </p>
      <div v-if="showOtherYear">
        <group :gutter="0" v-for="(item, idx) in otherYearLst" :key="idx">
          <cell
            :title="item.xn"
            is-link
            :border-intent="false"
            :arrow-direction="idx === selectOtherYearIdx ? 'up' : 'down'"
            @click.native="getSelectOtherYearIdx(idx)">
          </cell>
          <write-stu-py :stuInfo="item" :pddd="item.pddd" :pdddLst="pdddLst" v-if="idx === selectOtherYearIdx"></write-stu-py>
        </group>
      </div>
    </div>
    <!--点击查看其他学年度品德评语 end-->
  </div>

</template>
<script>
  import { Group, Cell } from 'vux'
  import { Toast, Button } from 'vant'
  import writeStuPy from './components/WriteStuPy.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'writeMoralDetail',
    directives: {},
    components: {
      Group,
      Cell,
      [Toast.name]: Toast,
      [Button.name]: Button,
      writeStuPy
    },
    props: {
    },
    data() {
      return {
        stuInfo: null, // 学生信息
        showOtherYear: false, //是否显示其他学年度品德评语
        selectOtherYearIdx: -1, //当前选中的其他年度idx值
        pddd: '', // 品德等第
        pdddLst: ['优', '良', '中', '合格', '不合格'], // 品德等第等级划分
        otherYearLst: [] // 其他年度品德评语列表
      }
    },
    created () {
      this.getBaseData() // 得到学生的基础数据
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 得到保存的数据
      getStuInfo(stuInfo, pddd) {
        this.stuInfo = stuInfo
        this.stuInfo.pddd = pddd
      },
      // 点击其他年度品德评语
      getSelectOtherYearIdx(idx) {
        console.log(idx)
        if (this.selectOtherYearIdx === idx) {
          this.selectOtherYearIdx = -1;
        } else {
          this.selectOtherYearIdx = idx;
        }
      },
      // 点击保存按钮事件
      async submitEvent() {
        if (!this.stuInfo.score) {
          Toast('请输入得分');
          return false
        }
        let obj = {
          XH: this.stuInfo.xh,
          XND: this.stuInfo.xn,
          CommentType: this.stuInfo.pyType,
          CreditScore: this.stuInfo.score,
          PDDD: this.stuInfo.pddd,
          PYNR: this.stuInfo.pynr
        }
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'SaveStuMoralComment',
          objData: JSON.stringify(obj)
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log(d.msg);
          Toast.fail(d.msg);
        } else {
          Toast.success('保存成功');
          this.stuInfo.write = true; // 表示改学生已登记了品德评语
          this.$router.go(-1)
        }
      },
      // 获取学生其他年度品德评语
      async getStuMoralOtherYear () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuMoralCommentRecord',
          xh: this.stuInfo.xh,
          moralType: this.stuInfo.pyType
        });
        this.updateLoadingStatus(false);
        this.loaded = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          return []
        }
        d.data.forEach( (item) => {
          item.onlyQuery = true
        })
        d.data.forEach( (item, idx) => {
          if (item.xn === this.stuInfo.selectXqName){
            d.data.splice(idx, 1)
          }
        })
        this.otherYearLst = d.data
        //console.log("otherYearLst => ", this.otherYearLst)
      },
      // 得到学生的基础数据
      getBaseData() {
        if (this.QD.brotherPageData) {
          this.stuInfo = this.QD.brotherPageData
          this.pddd =this.stuInfo.pddd
          this.QD.setTitle(this.stuInfo.xm)
          this.QD.brotherPageData = null
          this.getStuMoralOtherYear(); //获取学生其他年度品德评语
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>
<style lang="less">
  .write-moral{
    .weui-cells:before{
      display: none;
    }
    .van-field__label{
      color:#313233;
    }
    .other-year-pdpy-box{
      .vux-label{
        font-size: 14px;
      }
      .weui-cells:after{
        display: none;
      }
    }
  }
</style>
<style scoped lang="less">
  .write-moral{
    font-size: 14px;
    margin-top: -20px;
    padding-top: 20px;
    .stu-info{
      margin-top:-20px;
    }
  }
  .stu-icon{
    font-size: 22px;
    color: @tea-theme-color;
    padding-right:0;
    vertical-align: text-top
  }
  .xm{
    font-size: 16px;
    color: #000;
    margin-right:12px;
  }
  .xh{
    font-size: 16px;
    color: #666666;
  }
   /*保存按钮 start*/
  .save-btn{
    padding:0 16px;
    .btn{
      height:36px;
      font-size: 14px;
      background: @tea-theme-color;
      border:1px solid @tea-theme-color;
    }
  }
  /*点击查看其他学年度品德评语 start*/
  .other-year-pdpy-box{
    .title{
      color: @tea-theme-color;
      margin:28px 0 16px;
      padding:0 16px;
      .other-year-icon{
        font-size: 18px;
        vertical-align: middle;
      }
    }
  }
</style>
