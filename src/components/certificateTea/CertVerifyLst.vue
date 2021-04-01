<template>
  <div class="cerverifylst-tea">
    <tab>
      <tab-item :selected="doneVal === 0" @on-item-click="changeDone(0)">未审批</tab-item>
      <tab-item :selected="doneVal === 3" @on-item-click="changeDone(3)">审核通过</tab-item>
      <tab-item :selected="doneVal === 1" @on-item-click="changeDone(1)">审核退回</tab-item>
    </tab>
<!--未审批 start-->
    <div v-show="doneVal === 0">
      <ex-scroller v-model="auditlst" :onGetList="getStuCertAuditData" height="-90">
        <div>
          <group>
            <cell v-for="(r, ridx) in auditlst" :key="ridx" :is-link="true" @click.native="godetailpg(r.BizId, r.REID)">
             <span slot="icon" class="xmicon">
                <a class="school-wx-icon stu-icon" slot="icon">&#xe657;</a>
                <a class="headXM">{{r.SubmitorName.substr(r.SubmitorName.length-2, 2)}}</a>
              </span>
              <span slot="after-title">
                <label>
                  <a class="xmmc">{{r.BizData4}}</a>
                  <br /><a class="xmdj">{{r.BizData6}} {{r.BizData8}}</a>
                  <br /><a class="createtime">{{r.SubmitedTime.substr(0, 10)}}</a>
                </label>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--未审批 end-->
    <!--审核通过 start-->
    <div v-show="doneVal === 3">
      <ex-scroller v-model="passlst" :onGetList="getStuCertPassData" height="-90">
        <div>
          <group>
            <cell v-for="(r, ridx) in passlst" :key="ridx" :is-link="true" @click.native="godetailpg(r.BizId, r.REID)">
             <span slot="icon" class="xmicon">
                <a class="school-wx-icon stu-icon" slot="icon">&#xe657;</a>
                <a class="headXM">{{r.SubmitorName.substr(r.SubmitorName.length-2, 2)}}</a>
              </span>
              <span slot="after-title">
                <label>
                  <a class="xmmc">{{r.BizData4}}</a>
                  <br /><a class="xmdj">{{r.BizData6}} {{r.BizData8}}</a>
                  <br /><a class="createtime">{{r.SubmitedTime.substr(0, 10)}}</a>
                </label>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--审核通过 end-->
    <!--审核退回 start-->
    <div v-show="doneVal === 1">
      <ex-scroller v-model="refuselst" :onGetList="getStuCerRefuseData" height="-90">
        <div>
          <group>
            <cell v-for="(r, ridx) in refuselst" :key="ridx" :is-link="true" @click.native="godetailpg(r.BizId, r.REID)">
             <span slot="icon" class="xmicon">
                <a class="school-wx-icon stu-icon" slot="icon">&#xe657;</a>
                <a class="headXM">{{r.SubmitorName.substr(r.SubmitorName.length-2, 2)}}</a>
              </span>
              <span slot="after-title">
                <label>
                  <a class="xmmc">{{r.BizData4}}</a>
                  <br /><a class="xmdj">{{r.BizData6}} {{r.BizData8}}</a>
                  <br /><a class="createtime">{{r.SubmitedTime.substr(0, 10)}}</a>
                </label>
              </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <!--审核退回 end-->
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import ExScroller from '../common/ExScroller.vue'
  export default {
    name: 'certVerifyLst',
    directives: {},
    components: {
      Cell,
      Group,
      Tab,
      TabItem,
      ExScroller
    },
    methods: {
        // 到详情页面
      godetailpg (zsid, reid) {
        this.saveCurrPgData();
        this.$router.push({path: '/certificateTea/certVerifyDetail', query: {id: zsid, userid: this.userData.UserId, reid: reid}});
      },
      // 保存本页数据
      saveCurrPgData () {
        this.QD.currPageData = null;
        this.QD.currPageData = this.doneVal; // 保存本页数据
      },
      // 切换 状态值
      changeDone(type) {
        this.doneVal = type
      },
      // 教师获取可以审批的学生证书申请的数据 - 未审批
      // {userid}/{pageIndex}/{pageSize}/{conditionList}
      async getStuCertAuditData (index, size) {
        // 查询条件- 当前登录人的审核状态 :0为未审批  3为审核通过  1为审核退回
        let queryInfo = [{FieldName: 'Sys_ApprovalInfoResult.userState', Value: 0, NeedQuotes: false, Operator: 'Equal'}];
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'LoadStuCertificateAuditData',
          Userid: this.userData.UserId,
          PageIndex: index,
          PageSize: size,
          ConditionList: JSON.stringify(queryInfo)
        });
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
          return;
        }
        let result = JSON.parse(d).data;
        // console.log(result);
        return result
      },
      /* 审核通过 start */
      async getStuCertPassData (index, size) {
        // 查询条件- 当前登录人的审核状态 :0为未审批  3为审核通过  1为审核退回
        let queryInfo = [{FieldName: 'Sys_ApprovalInfoResult.userState', Value: 3, NeedQuotes: false, Operator: 'Equal'}];
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'LoadStuCertificateAuditData',
          Userid: this.userData.UserId,
          PageIndex: index,
          PageSize: size,
          ConditionList: JSON.stringify(queryInfo)
        });
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
          return;
        }
        let result = JSON.parse(d).data;
        // console.log(result);
        return result
      },
      /* 审核通过 end */
      /* 审核退回 start */
      async getStuCerRefuseData (index, size) {
        // 查询条件- 当前登录人的审核状态 :0为未审批  3为审核通过  1为审核退回,退回并结束 = 8; 撤回 = 9
        let queryInfo = [{FieldName: 'Sys_ApprovalInfoResult.userState', Value: 1, NeedQuotes: false, Operator: 'Equal'},
          {FieldName: 'Sys_ApprovalInfoResult.userState', Value: 8, NeedQuotes: false, Operator: 'Equal'},
          {FieldName: 'Sys_ApprovalInfoResult.userState', Value: 9, NeedQuotes: false, Operator: 'Equal'}
        ];
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'LoadStuCertificateAuditData',
          Userid: this.userData.UserId,
          PageIndex: index,
          PageSize: size,
          ConditionList: JSON.stringify(queryInfo)
        });
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
          return;
        }
        let result = JSON.parse(d).data;
        // console.log(result);
        return result
      },
      /* 审核退回 end */
      // // 得到当前用户的信息
      getUserData () {
        if (this.QD.currPageData || this.QD.currPageData === 0) {
          this.doneVal = this.QD.currPageData;
          this.QD.currPageData = null;
        }
        let info = this.QD.getLocalUserinfo();
        this.userData = info.stuObj;
      }
    },
    created (){
      this.getUserData(); // 得到当前用户的信息
    },
    beforeDestroy () {
    },
    data () {
      return {
        doneVal: 0, // 审核状态切换的判断值
        userData: [], // 用户的信息
        auditlst: [], // 教师要审批的学生证书申请的数据
        passlst: [], // 教师已审批并审批通过的学生证书申请的数据
        refuselst: [] //  教师已审批并审批退回的学生证书申请的数据
      }
    }
  }
</script>
<style scoped>
.xmicon{
  display: inline-block;
  width: 40px;
  height: 50px;
}
.stu-icon{
  position: absolute;
  font-size: 35px;
}
.headXM{
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
  .xmmc{
    color: #333333;
  }
  .xmdj{
    font-size: 14px;
    color: #666666;
  }
  .createtime{
    font-size: 12px;
    color: #999999;
  }
</style>
