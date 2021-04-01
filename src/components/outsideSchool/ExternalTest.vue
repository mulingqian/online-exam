<template>
  <div class="externalTest">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <smst @on-load="onLoad" @on-hide="onHide" :showName="true"></smst>
    <div>
      <ex-scroller ref="scrollerPageIndexOne" v-model="stuSkillExaminationData" :onGetList="getStuSkillExaminationData" v-if="xqId !== null" height="-88" style="position: relative;top: 15px;">
        <group>
          <cell is-link v-for="(s, sidx) in stuSkillExaminationData" :key="sidx">
            <div slot="after-title" class="vux-label">
              <div style="position: absolute;display: block;width: 100%;">
                <span v-if="s.EnrollStatus === '未报名'" class="school-wx-icon enroll-status-icon pass-icon" slot="icon" style="color: #D2CEC8;">&#xe653;</span>
                <span  v-if="s.EnrollStatus === '被退回'" class="school-wx-icon enroll-status-icon lost-icon" slot="icon" style="color: #d2322b;">&#xe617;</span>
                <span  v-if="s.EnrollStatus === '已报名'"  class="school-wx-icon enroll-status-icon pass-icon" slot="icon" style="color: #13c22b;">&#xe652;</span>
              </div>
              <div class="firstLine-external">{{s.ExamName}}</div>
              <div class="secondLine-external" style="display: block;">
                <span>报名时间：<a v-if="s.RegStartTime">{{s.RegStartTime}}到{{s.RetEndTime}}</a></span>
                <span  style="padding-left: 8px;">报名费：{{s.RegCost}}</span>
              </div>
              <div class="thirdLine-external">
                <span>考试时间：{{s.ExamDate}} {{s.ExamTime}}</span>
                <!--<span style="padding-left: 8px;">考试时长：125分钟</span>-->
              </div>
            </div>
          </cell>
          <!--<cell>
            <div slot="after-title" class="vux-label">
              <span style="position: absolute;display: block;width: 100%;">
                <span class="school-wx-icon stu-icon" slot="icon" style="color: #D2CEC8;float: right;font-size: 60px;padding-right: 30px;margin-top: -10px;">&#xe617;</span>
              </span>
              <div class="firstLine-external">全国大学英文四级</div>
              <span class="secondLine-external" style="display: block;">
                <span>报名时间：10月23日9:00-10月24日17:00</span>
                <span  style="padding-left: 8px;">报名费：50元/人</span>
              </span>
              <div class="thirdLine-external">
                <span>考试时间：9:00-11:20</span>
                <span style="padding-left: 8px;">考试时长：125分钟</span>
              </div>
            </div>
          </cell>-->
        </group>
      </ex-scroller>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import ExScroller from '../common/ExScroller.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'

  import Smst from '../Smst.vue'
  export default {
    name: 'outsideSchool-externalTest',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      Smst,
      ExScroller
    },
    methods: {
      onLoad (e) {
        this.xqId = e.XQID;
        this.loading = false;
      },
      onHide (t, e) {
        console.log("smst on hide");
        console.log(e);
        if (t === true && e && e.XQID) {
          this.loading = true;
          console.log(e.XQID);
          this.xqId = e.XQID;
          // 重新加载第一页数据
          this.$refs.scrollerPageIndexOne.initData();
        }
        this.loading = false;
      },
      // 学生查看校外考试安排
      async getStuSkillExaminationData (index, size) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'StuSkillExaminationData',
          XH: this.QD.getLocalUserinfo().stuObj.XH, // this.QD.getLocalUserinfo().stuObj.XH ; '09203116'
          SemId: this.xqId, // this.xqId  ; 27
          PageIndex: index,
          PageSize: size
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          // this.QD.alert(`获取数据失败:${d.msg}`);
          console.log(`获取数据失败:${d.msg}`);
          return [];
        }
        return d;
      }
    },
    created () {
    },
    data () {
      return {
        loading: false,
        xqId: null, // 学期id
        stuSkillExaminationData: []
      }
    }
  }
</script>
<style scoped>
  .externalTest .firstLine-external{
    padding-top: 4px;
    padding-bottom: 12px;
    font-size: 16px;
  }
  .externalTest .secondLine-external span,
  .externalTest .thirdLine-external span{
    font-size: 12px;
    color: #999999;
  }
  .enroll-status-icon{
    margin-top: -10px;
    float: right;
    font-size: 60px;
    padding-right: 30px;
  }
</style>
<style>
  .externalTest .weui-cells__title{
    margin: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 25px;
    color: #999999;
    font-size: 14px;
    background-color: #f2f2f2;
  }
</style>
