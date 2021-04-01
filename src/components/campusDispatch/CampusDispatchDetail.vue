<template>
  <div class="campusDispatchDetail">
    <div class="containers-common">
      <div v-transfer-dom>
        <loading v-model="loading"></loading>
      </div>
      <div v-if="r">
        <div class="detail">
          <div class="deFirst">
            <span>{{r.CreatorName}}</span><br/>
            <span>{{rStates}}</span>
          </div>
          <span v-if="r.States === '3'" class="school-wx-icon pass" slot="icon">&#xe64d;</span>
          <div class="deSecond">
            <span class="bt"><span class="btword">标题</span><span class="ggbt">{{r.FWBT}}</span></span>
            <span class="bt"><span class="btword">文号</span>{{r.FWWH}}</span>
            <span class="bt"><span class="btword">来文单位</span>{{r.LWDW}}</span>
            <span class="bt"><span class="btword">来文日期</span>{{r.LWRQ}}</span>
            <span class="bt"><span class="btword">处理期限</span>{{r.CLQX}}</span>
            <span class="bt"><span class="btword">文件密级</span>{{r.WJMJ}}</span>
            <span class="bt"><span class="btword">紧急度</span>{{r.JJD}}</span>
            <span class="bt"><span class="btword">重要性</span>{{r.ZYX}}</span>
            <span class="bt" v-if="r.SubmitTime !== ''"><span class="btword">提交时间</span>{{r.SubmitTime}}</span>
            <span class="bt"><span class="btword">拟办意见</span>{{r.NBYJ}}</span>
          </div>
        </div>
        <div style="height: 20px;background-color: #f2f2f2;"></div>

        <!--附件 加 内容-->
        <div style="padding: 10px 15px;font-size: 16px;background-color: #fff;">
          <!--附件-->
          <div v-if="imgAtts.length > 0 || fileAtts.length > 0" class="fj">
            <span v-for="(a,idx) in imgAtts" :key="idx" style="position:relative;display: inline-block;width: 90px;">
                <img height="80" width="80" :src="QD.OAHOST + a.FilePath" />
            </span>
            <br/>
            <div v-for="(a,idx) in fileAtts" :key="idx" style="display: inline-block;padding: 25px;">
              <span class="school-wx-icon" slot="icon" style="padding-right: 0;">&#xe634;</span>
              <a :href="QD.OAHOST + a.FilePath" :download="a.FileName" style="color: #008000;font-size: 14px;">{{a.FileName}}</a>
            </div>
          </div>
          <!--内容-->
          <div class="nr">
            <span>内容</span>
            <span class="dContents" v-html="r.Contents"></span>
          </div>
        </div>
        <div v-if="r.States !== '0'" style="height: 20px;background-color: #f2f2f2;"></div>

        <!--撤回详细-->
        <div v-if="r.RevokedBy !== ''" class="cheHuiDetail">
          <span class="chXq"><span class="chml">撤回人</span><span class="chmlnr">{{r.RevokedBy}}</span></span>
          <span class="chXq"><span class="chml">撤回时间</span><span class="chmlnr">{{r.RevokedTime}}</span></span>
          <span class="chXq"><span class="chml">撤回说明</span><span class="chmlnr" v-html="r.RevokedComments"></span></span>
        </div>

        <div v-if="r.RevokedBy !== '' && auditResults.length>0" style="height: 20px;background-color: #f2f2f2;"></div>

        <!--审批结果-->
        <div class="verifyC" v-if="auditResults.length>0">
          <!--<div class="verfyTitle">审批结果</div>-->
          <div class="verifyResult" v-for="(r,idx) in auditResults" :key="idx">
            <span style="color: #666666;padding-right: 8px;">{{r.UserName}}</span>
            <span v-if="r.UserState === '通过'" style="color: #008000;">{{r.UserState}}</span>
            <span v-else-if="r.UserState === '退回'" style="color: #ff0000;">{{r.UserState}}</span>
            <span v-else style="color: #666666;">{{r.UserState}}</span>
            <span v-if="r.ApprovalTime !== ''" class="resultTime">{{r.ApprovalTime}}</span>
            <p>{{r.Comments}}</p>
          </div>
        </div>

        <div v-if="type === 0 && verifyedResults.length === 0 && this.r.States !== '0' && this.r.States !== '9'" style="height: 70px;background-color: #f2f2f2;"></div>

        <div v-if="type === 1 && flowAuditInfo.StepState === '审核中' && flowAuditInfo.allowAppoint === true" style="height: 160px;background-color: #f2f2f2;"></div>
        <div v-if="type === 1 && flowAuditInfo.StepState === '审核中' && flowAuditInfo.allowAppoint !== true" style="height: 120px;background-color: #f2f2f2;"></div>
      </div>
      <!--申请列表中可以撤销-->
      <footer v-if="r && type === 0 && verifyedResults.length === 0 && this.r.States !== '0' && this.r.States !== '9'" class="cancel">
        <a @click="revokeBizData()">撤回</a>
      </footer>

      <!--审批-->
      <footer v-if="type === 1 && flowAuditInfo.StepState === '审核中'" class="verify">
        <group>
          <x-textarea placeholder="请输入审批意见" :show-counter="false" :rows="1" autosize v-model="verifyContent"></x-textarea>
          <cell v-if="flowAuditInfo.allowAppoint === true" is-link @click.native="goSelectMultiTeacher()">
              <span slot="after-title" class="vux-label">
               <span>选择转发人员</span>
              </span>
            <span slot="default">
                <span class="rg-cell selectAppleEmploy">
                  <a v-for="(teacherName,tIdx) in selectMultiEmployeeNameLst" :key="tIdx">{{teacherName}}</a>
                </span>
              </span>
          </cell>
        </group>
        <div class="verifySubmit">
          <span class="verifyY" @click="doAudit(true)">通过</span>
          <span class="verifyN" @click="doAudit(false)">拒绝</span>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'

  export default {
    name: 'campusDispatchDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      XTextarea
    },
    methods: {
      // 选择教师（可以多选的）--- 转发人员
      goSelectMultiTeacher () {
        // 保存审批意见
        sessionStorage.setItem("campusDispatch-verifyContent", this.verifyContent);
        // 之前的选择的教师信息
        if (this.selectMultiEmployeeUserIdLst !== '') {
          sessionStorage.setItem("selectMultiEmployeeNameLst_campusDispatch", this.selectMultiEmployeeNameLst); // 存选择教师的姓名
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_campusDispatch", this.selectMultiEmployeeUserIdLst); // 存选择教师的UserId
        }
        this.$router.push({path: '/selectMultiTeacher', query: {page: 'campusDispatchDetail', type: this.$route.query.type, id: this.$route.query.id, aId: this.$route.query.aId, rId: this.$route.query.rId}});
      },
      // 审批‘通过’或 ‘拒绝’
      async doAudit (pass) {
        let appointUids = '';
        if (this.flowAuditInfo.allowAppoint === false) {
          appointUids = ''
        } else {
          if (this.selectMultiEmployeeUserIdLst.length === '') {
            appointUids = ''
          } else {
            appointUids = this.selectMultiEmployeeUserIdLst;
          }
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.DoAudit', resultId: this.$route.query.rId, pass: pass, comments: this.verifyContent, appointUids: appointUids});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        if (d.status === 'success') {
          this.getGetFlowInfo();
          this.QD.alert('', '审批成功！');
        }
        console.log("doAudit", d.status);
      },
      //  撤回操作type=0'校内发文申请'列表（所有审批人尚未进行过审批操作时，提交人进行的撤回）RevokeBizData
      async revokeBizData () {
        let name = this.QD.getLocalUserinfo().stuObj.XM;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.RevokeBizData', removerName: name, cellId: 'OA_FLOW_SQ_FWGL', bizId: this.bizId});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        console.log("RevokeBizData", d.status);
        if (d.status === 'success') {
          this.getGetFlowInfo();
          // 根据流程申请业务模块的CellID和键值读取审批结果（审批步骤-审批人-回复内容等）auditedOnly = true仅查看已经审批的结果---撤回是否显示
          this.isGetCustomAuditResults();
          this.QD.alert('', '撤回成功！');
        }
      },
      // 读取流程实体数据
      async getGetFlowInfo () {
        // 判断是从type=0'校内发文管理'列表，还是type=1'校内发文审批'列表的详情
        this.getType();
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetFlowInfo', cellId: this.cellId, bizId: this.$route.query.id});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        console.log("GetFlowInfo", d.data);
        this.r = d.data;
        let atts = d.atts;
        for (let i in atts) {
          if (this.QD.imgTypeLst.indexOf(atts[i].Extension) !== -1) {
            this.imgAtts.push(atts[i]); // 图片附件赋值
          } else {
            this.fileAtts.push(atts[i]); //文档附件赋值
          }
        }
        /*详情赋值*/
        this.rStates = this.r.States === '0' ? '未提交': (this.r.States === '2' ? '审核中': (this.r.States === '3' ? '通过': (this.r.States === '9' ? '撤回' : (this.r.States === '8' ? '退回并结束': '审核退回'))));
        // 根据提交的流程的键值读取流程审批结果（审批步骤-审批人-回复内容等）
        this.getAdminAuditResults();
        // 根据流程申请业务模块的CellID和键值读取审批结果（审批步骤-审批人-回复内容等）
        this.getCustomAuditResults();
      },
      // 根据提交的流程的键值读取流程审批结果（审批步骤-审批人-回复内容等）
      async getAdminAuditResults () {
        if (this.type === 1) {
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetAdminAuditResults', appId: this.$route.query.aId, auditedOnly: false});
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
          }
          console.log("getAdminAuditResults", d.data);
          this.auditResults = d.data;
          // 读取审批人对当前流程的审批结果及各种状态
          this.getFlowAuditInfo();
        }
      },
      // 根据流程申请业务模块的CellID和键值读取审批结果（审批步骤-审批人-回复内容等）
      async getCustomAuditResults () {
        if (this.type === 0) {
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetCustomAuditResults', bizId: this.$route.query.id, cellId: 'OA_FLOW_SQ_FWGL', auditedOnly: false});
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
          }
          console.log("getCustomAuditResults", d.data);
          this.auditResults = d.data;
        }
      },
      // 读取审批人对当前流程的审批结果及各种状态
      async getFlowAuditInfo () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetFlowAuditInfo', resultId: this.$route.query.rId});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        console.log("getFlowAuditInfo", d);
        this.flowAuditInfo = d;
      },
      // 判断是从type=0'校内发文管理'列表，还是type=1'校内发文审批'列表的详情
      getType () {
        this.type = parseInt(this.$route.query.type);
        this.bizId = parseInt(this.$route.query.id);
        if (this.type === 0) {
          this.cellId = 'OA_FLOW_SQ_FWGL';
        } else {
          this.cellId = 'OA_FLOW_SP_FWGL';
        }
      },
      // 根据流程申请业务模块的CellID和键值读取审批结果（审批步骤-审批人-回复内容等）auditedOnly = true仅查看已经审批的结果---用于判断是否显示‘撤回’
      async isGetCustomAuditResults () {
        if (this.type === 0) {
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetCustomAuditResults', bizId: this.$route.query.id, cellId: 'OA_FLOW_SQ_GGFB', auditedOnly: true});
          if (d.status && d.status === "error") {
            this.QD.alert(`获取数据失败:${d.msg}`);
          }
          console.log("isGetCustomAuditResults", d.data);
          this.verifyedResults = d.data;
        }
      },
      // 得到（多选）教师的信息
      getSelectMultiTeacherData () {
        if (sessionStorage.getItem("selectMultiEmployeeNameLst_campusDispatch") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_campusDispatch") !== null){
          let name = sessionStorage.getItem("selectMultiEmployeeNameLst_campusDispatch").split(",");
          let userId = sessionStorage.getItem("selectMultiEmployeeUserIdLst_campusDispatch").split(",");
          this.selectMultiEmployeeNameLst = name.join();
          this.selectMultiEmployeeUserIdLst = userId.join();
          console.log("this.selectMultiEmployeeUserIdLst", this.selectMultiEmployeeUserIdLst);
          sessionStorage.removeItem("selectMultiEmployeeNameLst_campusDispatch");
          sessionStorage.removeItem("selectMultiEmployeeUserIdLst_campusDispatch");
        } else {
          this.selectMultiEmployeeNameLst = ['选择'];
        }
        // 审批意见
        if (sessionStorage.getItem("campusDispatch-verifyContent") !== null) {
          this.verifyContent = sessionStorage.getItem("campusDispatch-verifyContent");
          sessionStorage.removeItem("campusDispatch-verifyContent");
        }
      }
    },
    created () {
      // 读取流程实体数据
      this.getGetFlowInfo();
      this.getSelectMultiTeacherData(); // 得到（多选）教师的信息
      // 根据流程申请业务模块的CellID和键值读取审批结果（审批步骤-审批人-回复内容等）auditedOnly = true仅查看已经审批的结果---撤回是否显示
      this.isGetCustomAuditResults();
    },
    data () {
      return {
        loading: false,
        type: 0, // 默认是'校内发文管理'列表详情
        cellId: '', // 流程申请业务模块ID
        bizId: -1, // 流程申请业务数据的主键值
        r: null, // 详情
        imgAtts: [], // 图片附件
        fileAtts: [], // 文件附件
        rStates: '', // 流程状态值
        auditResults: [], // ‘审批结果’
        verifyedResults: [], // 已经审批结果
        flowAuditInfo: [], // 审批人对当前流程的审批结果及各种状态
        verifyContent: '', // 审批意见
        selectMultiEmployeeNameLst: ['选择'], // 选择教师姓名数组
        selectMultiEmployeeUserIdLst: '' // 选择教师UserId数组
      }
    }
  }
</script>
<style scoped>
  .campusDispatchDetail{
    background-color: #f2f2f2;
  }
  /*通过的iconfont图片*/
  .pass{
    float: right;
    margin-top: -30px;
    color: #4DAB4D;
    font-size: 90px;
    padding-right: 10px;
    opacity: 0.9;
    animation: passIconfont 0.5s;
  }
  @keyframes passIconfont
  {
    from {
      margin-top: -10px;
      padding-right: 20px;
    }
    to {margin-top: -30px;
      padding-right: 10px;
    }
  }
  /*详情*/
  .detail{
    padding: 10px 15px;
    color: #333333;
    font-size: 16px;
    background-color: #fff;
  }
  .deFirst{
    border-bottom: 1px solid #e5e5e5;
  }
  .deFirst span{
    line-height: 20px;
  }
  .deFirst span:nth-child(3){
    display: block;
    color: #666666;
    margin-bottom: 10px;
    font-size: 12px;
  }
  .deSecond .bt{
    display: block;
    line-height: 30px;
    color: #333333;
  }
  .deSecond .bt .btword{
    display: inline-block;
    width: 65px;
    margin-right: 8px;
    color: #666666;
  }
  .verifyC{
    font-size: 14px;
    color: #333333;
    background-color: #f2f2f2;
  }
  .verifyC .verifyResult:last-child{
    border-bottom: 1px solid #e5e5e5;
  }
  .verifyResult{
    padding: 10px 15px;
    border-top: 1px solid #e5e5e5;
    background-color: #fff;
  }
  .resultTime{
    float: right;
    font-size: 12px;
    color: #999999;
  }
  .verifyResult p{
    font-size: 16px;
    line-height: 20px;
    padding-top: 4px;
  }
  /*附件*/
  .fj{
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
  }
  /*内容*/
  .nr{
    padding-top: 10px;
  }
  .nr span:nth-child(1) {
    color: #666666;
  }
  .dContents{
    display: block;
    line-height: 25px;
    color: #333333;
    word-break: break-all;
  }
  /*审批*/
  .verify{
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .verifySubmit{
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    background-color: #ffffff;
  }
  .verifyN,
  .verifyY{
    display: inline-block;
    width: 40%;
    height: 25px;
    line-height: 25px;
    color: #fff;
    text-align: center;
    border-radius: 5px;
  }
  .verifyY{
    background: #088007;
  }
  .verifyN{
    margin-left: 10px;
    background: #ff711d;
  }
  /*撤回*/
  .cancel{
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-top: 10px;
    text-align: center;
    background-color: #fff;
    border-top: 1px solid #e5e5e5;
  }
  .cancel a{
    display: inline-block;
    padding: 12px 10px;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    color: #0f89e0;
    border-radius: 3px;
  }
  /*撤回说明*/
  .cheHuiDetail{
    padding: 10px 15px;
    background-color: #ffffff;
  }
  .chXq{
    display: block;
    line-height: 30px;
    font-size: 16px;
    color: #333333;
  }
  .chml{
    display: inline-block;
    width: 65px;
    margin-right: 8px;
    color: #666666;
  }
  .chmlnr {
    line-height: 30px;
  }
</style>
<style>
  .campusDispatchDetail .verify .weui-cells__title{
    margin-top: 0;
    margin-bottom: 0;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    background-color: #e5e5e5;
  }
  .campusDispatchDetail .verify .weui-cell_access .weui-cell__ft {
    display: inline-block;
    width: 60%;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
