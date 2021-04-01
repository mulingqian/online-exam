<template>
  <div class="teaEvalDetail">
    <div v-if="quest">
      <!-- 标题 {{quest.Subject}} -->
      <div class="headInfo">
        <p>{{relativeInfo.Subject}}</p>
        <span class="bjmc">{{relativeInfo.bjmc}}</span>
      </div>
      <!-- 测评项 start -->
      <div class="questField">
        <div v-for="(q, qIdx) in quest.ItemList" :key="qIdx">
          <p class="subject">{{qIdx + 1}}.{{q.Title}}</p>
          <!-- 选项 start -->
          <p :class="`optBox clearfloat ${op.IsSelected ? 'selectedOptBox' : ''}`" v-for="(op, opIdx) in q.ItemOpeionList" :key="opIdx">
            <label class="iconBox">
              <span v-if="!op.IsSelected" class="school-wx-icon noSelectedOpt">&#xe666;</span>
              <span v-if="op.IsSelected" class="school-wx-icon selectedOpt">&#xe665;</span>
            </label>
            <span @click="changeOptWay(op, opIdx, qIdx)" class="optVal">{{op.Name}}</span>
          </p>
          <!-- 选项 end -->
        </div>
      </div>
      <!-- 测评项 end -->
      <div v-if="this.relativeInfo.isCanEval" class="butBox">
        <x-button @click.native="submitWay" :mini="true" type="primary" class="btn">提交</x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  export default {
    name: "teaEvalStu-common-teaEvalDetail",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      XButton
    },
    props: {
      classEvalType: {
        type: Number,
        default: 1
      }// 班主任类型:1任课老师 2 班主任
    },
    methods: {
      // 提交的参数
      setEvalResults () {
        this.evalResults = [];
        for (let i=0; i<this.quest.ItemList.length; i++) {
          let ops = this.quest.ItemList[i].ItemOpeionList;
          for (let k=0; k<ops.length; k++) {
            if (ops[k].IsSelected) {
              this.evalResults.push({
                Itemid: ops[k].ItemId,
                OptionId: ops[k].OptId,
                ScoreValue: ops[k].Value
              });
              break;
            }
          }
        }
      },
      // 提交方法 RangeId={0}&amp;Bjid={1}&amp;EvalResults={2}
      async submitWay () {
        console.log("bjInfo = ", this.bjInfo);
        this.setEvalResults(); // 提交的参数
        console.log('evalResults = ', JSON.stringify(this.evalResults));
        if (this.evalResults.length < this.quest.ItemList.length) {
          let dlen = this.quest.ItemList.length - this.evalResults.length;
          this.QD.alert('', '还有'+ dlen + '道题未完成');
          return;
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'SubmitResultTeaEval',
          RangeId: this.bjInfo.FWID,  // 测评班级Id
          Bjid: this.bjInfo.BJID, // 班级Id
          EvalResults: this.evalResults
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`提交数据失败:${d.msg}`);
          return;
        }
        if (d.Status) {
          this.QD.alert('', '提交成功');
        } else {
          this.QD.alert('', '提交失败');
        }
        console.log("submit", d);
      },
      // 点击选择
      changeOptWay (o, idx, qIdx) {
        let ops = this.quest.ItemList[qIdx].ItemOpeionList;
        /* 将 选中的选项 设置为 不选中 */
        for (let i=0; i<ops.length; i++) {
          ops[i].IsSelected = false;
        }
        ops[idx].IsSelected = true; // 设置点击的选项为选中
      },
      // 得到测评表即测评题目
      async getTeaEvalQuest () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetTeaEvalQuest',
          rangeId: parseInt(this.$route.query.eID),  // 测评班级Id
          ClassEvalType: this.classEvalType // 教师类型 1任课教师 2班主任
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取题目数据失败:${d.msg}`);
          return;
        }
        console.log("quests info", d);
        this.quest = d.Data;
      },
      // 得到相关数据
      getRelativeData () {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.bjInfo = qd.selectInfo.bjInfo; // 班级信息
          this.relativeInfo.bjmc = qd.selectInfo.bjInfo.BJMC;
          this.relativeInfo.Subject = qd.selectInfo.pxInfo.Subject;
          this.relativeInfo.isCanEval = qd.selectInfo.pxInfo.IsCanEval;
          this.relativeInfo.isSubmit = qd.selectInfo.bjInfo.IsSave;
          this.getTeaEvalQuest(); // 得到测评表即测评题目
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getRelativeData(); // 得到相关数据
    },
    data () {
      return {
        loading: false,
        relativeInfo: {Subject: '', bjmc: '', isCanEval: false, isSubmit: false}, // isCanEval- 在测评时间范围内即为true； isSubmit -是否提交过
        bjInfo: null, // 班级信息
        quest: null, // 卷子信息
        evalResults: [] // 登记结果
      }
    }
  }
</script>
<style scoped>
  .headInfo{
    text-align: center;
    padding-top: 15px;
    padding-bottom: 20px;
    font-size: 16px;
  }
  .headInfo .bjmc{
    display: inline-block;
    font-size: 14px;
    color: #666666;
    padding-top: 6px;
  }
  .questField{
    padding: 0 15px 40px 15px;
  }
  .questField .subject{
    font-size: 14px;
    color: #44a9d4;
    padding-bottom: 6px;
  }
  /* 选项 start */
  .optBox{
    margin: 8px 0;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 4px;
  }
  .selectedOptBox{
    background-color: #fbfbfb;
  }
  .optBox label{
    float: left;
  }
  .optBox .optVal{
    float: left;
    display: inline-block;
    width: 89%;
    padding-left: 6px;
    font-size: 14px;
    line-height: 18px;
  }
  .optBox .iconBox>span{
    display: inline-block;
    width: 25px;
    height: 20px;
    padding: 0;
    vertical-align: middle;
  }
  .optBox .iconBox>.noSelectedOpt{
    height: 20px;
    font-size: 25px;
    color: #999999;
  }
  .iconBox>.selectedOpt{
    color: #44a9d4;
    font-size: 25px;
  }
  /* 选项 end */
  /* 提交 start */
  .butBox{
    width: 100%;
    padding-bottom: 20px;
    text-align: center;
    line-height: 40px;
  }
  .butBox .btn{
    width: 98%;
    line-height: 40px;
    font-size: 16px;
  }
  /* 提交 end */
</style>
