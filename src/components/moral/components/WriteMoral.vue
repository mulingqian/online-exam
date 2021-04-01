<template>
  <div class="write-moral" v-if="info">
    <!-- 没有登记过，显示登记页面 -->
    <div v-if="!isWrite">
      <group gutter="0">
        <cell>
          <div slot="icon">
            <span class="school-wx-icon stu-icon">&#xe68b;</span>
          </div>
          <div slot="after-title">
            <span class="xm">{{info.xm}}</span>
            <span class="xh">({{info.xh}})</span>
          </div>
        </cell>
      </group>
      <van-field v-model="wScore" type="number" label="得分" placeholder="请输入得分" />
      <van-cell-group class="pddd-box">
        <div class="pddd-title">品德等第</div>
        <van-radio-group v-model="wPddd" direction="horizontal">
          <van-radio :icon-size="'16px'" :name="p" v-for="(p, pidx) in pdddLst" :key="pidx">{{p}}</van-radio>
        </van-radio-group>
      </van-cell-group>

      <van-field
        v-model="wPynr"
        required
        rows="1"
        autosize
        maxlength="2000"
        label="评语内容"
        type="textarea"
        placeholder="请输入评语内容"
      />
      <submit-btn @get-oneVal="submitEvent" @get-twoVal="cancelEvent" :oneButtonClass="'button1'"></submit-btn>
    </div>

    <div v-if="isWrite">
      <stu-moral-detail :info="info"></stu-moral-detail>
      <submit-btn v-if="canVerify" :titleOne="'修改'" @get-oneVal="verifyEvent" @get-twoVal="cancelVerifyEvent" :oneButtonClass="'button2'"></submit-btn>
      <submit-one v-if="!canVerify" :titleVal="'取消'" @click-button="cancelVerifyEvent"></submit-one>
    </div>
  </div>

</template>
<script>
  import { Group, Cell } from 'vux'
  import { Field, RadioGroup, Radio, CellGroup, Toast } from 'vant'
  import SubmitBtn from '../../common/ButtonTwo.vue'
  import SubmitOne from '../../common/XButtonOne.vue'
  import StuMoralDetail from './StuMoralDetail.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'writeMoral',
    directives: {},
    components: {
      Group,
      Cell,
      SubmitBtn,
      SubmitOne,
      StuMoralDetail,
      [Field.name]: Field,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [CellGroup.name]: CellGroup,
      [Toast.name]: Toast
    },
    props: {
      write: { // 是否有登记过, true 有登记过
        type: Boolean,
        default: true
      },
      canVerify: { // 是否有权限修改， 默认用户有权限修改
        type: Boolean,
        default: true
      },
      info: {
        type: Object,
        default: null
      } // 学生信息
    },
    data() {
      return {
        isWrite: this.write, // true 有登记过
        wScore: '', // 得分
        wPddd: '', // 品德等第
        wPynr: '', // 评语内容
        pdddLst: ['优', '良', '中', '合格', '不合格'] // 品德等第等级划分
      }
    },
    created () {
      this.getBaseData() // 得到学生的基础数据
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 点击保存按钮事件
      async submitEvent() {
        if (!this.wPynr) {
          Toast('请输入评语内容');
          return false
        }
        let obj = {
          XH: this.info.xh,
          XND: this.$route.query.xn,
          CommentType: this.info.pyType,
          CreditScore: this.wScore,
          PDDD: this.wPddd,
          PYNR: this.wPynr
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
          this.info.write = true; // 表示改学生已登记了品德评语
          this.info.score = this.wScore;
          this.info.pddd = this.wPddd;
          this.info.pynr = this.wPynr;
          this.$emit('success');
        }
      },
      // 点击修改事件
      verifyEvent() {
        this.isWrite = false
      },
      // 点击取消修改事件
      cancelVerifyEvent() {
        this.$emit('cancel');
      },
      // 点击保存取消
      cancelEvent() {
        if (!this.write) { // 若学生没有登记过
          this.$emit('cancel')
        } else {
          this.isWrite = true
        }
      },
      // 得到学生的基础数据
      getBaseData() {
        if (this.info) {
          this.wScore = this.info.score;
          this.wPddd = this.info.pddd;
          this.wPynr = this.info.pynr
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .write-moral{
    font-size: 14px;
    padding-bottom: 60px;
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
  .pddd-box{
    padding: 10px 0 10px 15px;
  }
  .pddd-title{
    padding: 0 0 10px 0;
    color: #646566;
    font-size: 14px;
  }
</style>
