<template>
  <div class="leaveSelfApplyList eachPgBase">
    <select-status :valueLst="QD.applyStatusLst" :defaultStatus="defaultApplyStatus" :title="'申请状态'" @get-val="selectApplyStatusVal"></select-status>
    <div class="eachPgBase">
      <ex-scroller v-model="applyLst" ref="scrollerOne" :onGetList="getLeaveApplyLst" height="-90" class="scrollField">
        <div>
          <group v-for="(s, sidx) in applyLst" :key="sidx" class="gp">
            <cell :is-link="true" @click.native="goDetailPg(s.ApplyID)">
              <div slot="after-title" class="vux-label">
                <div class="first-stuLeaveApply">
                  <span v-if="s.Status===0" style="color: #bdb930;">未提交</span>
                  <span v-if="s.Status===1" style="color: #066dbd;">审核中</span>
                  <span v-if="s.Status===2" style="color: #7ed499;">审核通过</span>
                  <span v-if="s.Status===4" style="color: #bd2c00;">被退回</span>
                  <span>{{s.CreateDate}}</span>
                </div>
                <div class="stuIconImg">
                  <span class="school-wx-icon stu-icon" slot="icon">&#xe657;</span>
                  <span class="stuIconXM">{{s.StuName}}</span>
                </div>
                <div class="stuInfor">
                  <div class="second-stuLeaveApply">
                    <span>学号:{{s.XH}}</span>
                  </div>
                  <div class="third-stuLeaveApply">
                    <span>班级:{{s.BJMC}}</span>
                    <div style="color: #666666;">
                      <div style="color: #666666;">请假类型:{{s.ApplyType}}</div>
                      <span>开始时间:{{s.StartDate}}</span>
                      <div>结束时间:{{s.EndDate}}</div>
                      <span style="color:#3EA7C0;">时长:{{s.ApplyDay}} 天</span>
                      <span class="isShowSituation" v-if="s.ReturnSchool > 0 ? (s.ReturnSchool == 1 ?
                   leaveSchStatus='已离校' : leaveSchStatus='已返校') : (s.LeaveSchoolStatus == 1 ?
                   leaveSchStatus='需要离校' : (s.LeaveSchoolStatus == 2 ? leaveSchStatus='无需离校' : leaveSchStatus='不在校'))">
                    {{leaveSchStatus}}
                  </span>
                    </div>
                  </div>
                </div>
              </div>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--添加‘学生请假’-->
    <add-page @click.native="addLeaveApply()"></add-page>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import ExScroller from '../common/ExScroller.vue'
  import SelectStatus from '../common/SelectActionsheelVal.vue'
  import addPage from '../primaryKey/AddPage.vue'
  import { mapActions } from 'vuex'
  export default {
    name: "leaveSelfApplyList",
    components: {
      ExScroller,
      Cell,
      Group,
      SelectStatus,
      addPage
    },
    methods: {
      // 跳转到学生请假申请登记页面
      addLeaveApply () {
        this.$router.push({ path: '/stu/stuLeaveSelfApply/leaveApplyReg' });
      },
      // 到详情页面
      goDetailPg(id) {
        this.saveCurrPgData(); // 保存当前页面数据
        this.$router.push({path: '/stu/stuLeaveSelfApply/leaveApplyDetail', query: {id: id}})
      },
      selectApplyStatusVal (e) {
        console.log(e);
        this.defaultApplyStatus = e.info;
        this.setApplyWhereInfo(this.defaultApplyStatus.type);
        this.$refs.scrollerOne.initData(); // 重新加载第一页数据
      },
      // 设置教室申请时的查询条件
      setApplyWhereInfo (type) {
        if (type === -1) {
          this.whereApplyInfo = [];
        } else {
          this.whereApplyInfo = [{FieldName: 'Status', Operator: "Equal", NeedQuotes: false, Value: type}];
        }
      },
      // 获取学生请假申请信息
      async getLeaveApplyLst (index, size) {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuLeaveSelfApplyList', condition: JSON.stringify(this.whereApplyInfo), pageSize: size, pageIndex: index});
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log("lst", d.msg);
          return [];
        }
        console.log("lst =", d);
        return d;
      },
      // 保存当前页面数据
      saveCurrPgData () {
        this.QD.parentPageData = {whereApplyInfo: this.whereApplyInfo, defaultApplyStatus: this.defaultApplyStatus};
      },
      // 得到保存的页面数据
      getSaveCurrPgData () {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.whereApplyInfo = qd.whereApplyInfo;
          this.defaultApplyStatus = qd.defaultApplyStatus;
        }
      },
      ...mapActions([
        'updateLoadingStatus'
      ])
    },
    created () {
      this.getSaveCurrPgData(); // 得到保存的页面数据
    },
    data () {
      return {
        applyLst: [], // 学生请假列表
        whereApplyInfo: [],
        defaultApplyStatus: {
          label: '全部',
          type: -1
        } // 申请默认选中的状态值
      }
    }
  }
</script>
<style scoped>
  .scrollField .gp{
    margin-top: -9px;
  }
  .scrollField .gp:first-child{
    margin: 0;
  }
  /*头像*/
  .leaveSelfApplyList .stuIconImg{
    display: block;
    float: left;
  }
  .leaveSelfApplyList .stuIconImg .stu-icon{
    position: absolute;
    font-size: 35px;
    padding-right:0;
  }
  .leaveSelfApplyList .stuIconXM{
    position: relative;
    top: 13px;
    left: 0;
    width: 35px;
    display: inline-block;
    font-size: 12px;
    text-align: center;
    line-height: 12px;
    color: #ffffff;
  }
  /*头像结束*/
  .stuInfor{
    width:81%;
    float: left;
    font-size: 16px;
    margin-left: 8px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .leaveSelfApplyList .first-stuLeaveApply{
    margin-top: 8px;
  }
  .leaveSelfApplyList .first-stuLeaveApply,
  .leaveSelfApplyList .second-stuLeaveApply,
  .leaveSelfApplyList .third-stuLeaveApply
  {
    overflow: hidden;
    font-size: 14px;
    color: #333333;
  }
  .leaveSelfApplyList .first-stuLeaveApply span:nth-child(2){
    float: right;
    font-size: 12px;
    padding-left: 8px;
    color: #999999;
  }
  .leaveSelfApplyList .second-stuLeaveApply span:nth-child(1){
    color: #999999;
  }
  .leaveSelfApplyList .third-stuLeaveApply{
    color: #999999;
  }
  .leaveSelfApplyList .third-stuLeaveApply .isShowSituation{
    float: right;
    color: #3437ff;
  }
</style>

