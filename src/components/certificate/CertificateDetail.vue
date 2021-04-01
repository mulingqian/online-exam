<template>
  <div class="certificate-detail">
    <group class="gp">
      <div class="icon-box">
        <span v-if="info.states === 3" class="school-wx-icon statusIcon" slot="icon">&#xe64d;</span>
        <span v-if="info.states === 1" class="school-wx-icon statusIcon" slot="icon" style="color: #e01616;">&#xe68a;</span>
      </div>
      <cell>
        <span slot="after-title">姓名</span>
        <span>{{userData.XM}}</span>
      </cell>
      <cell>
        <span slot="after-title">获得学期</span>
        <span>{{info.xqmc}}</span>
      </cell>
      <cell>
        <span slot="after-title">证书名称</span>
        <span>{{info.xmmc}}</span>
      </cell>
      <cell>
        <span slot="after-title">审核状态</span>
        <span>{{statesVal}}</span>
      </cell>
    </group>
    <group class="gp">
      <cell class="cell-box"
            is-link
            :arrow-direction="detailMore ? 'up' : 'down'"
            @click.native="detailMore = !detailMore">
        <span slot="after-title" class="group-title">详细信息</span>
        <span class="seeMore">查看更多</span>
      </cell>
    </group>

    <div v-if="detailMore" style="padding-bottom: 60px;background-color: #f2f2f2;">
      <group class="gpp">
        <cell>
          <span slot="after-title">班级</span>
          <span>{{info.bjmc}}</span>
        </cell>
        <cell>
          <span slot="after-title">班主任</span>
          <span>{{userData.BZR}}</span>
        </cell>
        <cell>
          <span slot="after-title">证书类别</span>
          <span>{{info.zstype}}</span>
        </cell>
        <cell>
          <span slot="after-title">证书编号</span>
          <span>{{info.zsbh}}</span>
        </cell>
        <cell>
          <span slot="after-title">发证单位</span>
          <span>{{info.zbdw}}</span>
        </cell>
        <cell>
          <span slot="after-title">发证日期</span>
          <span>{{info.hjrq}}</span>
        </cell>
        <cell>
          <span slot="after-title">证书级别</span>
          <span>{{info.xmjb}}</span>
        </cell>
        <cell>
          <span slot="after-title">证书等级</span>
          <span>{{info.hjdj}}</span>
        </cell>
        <!--<cell>
          <span slot="after-title">奖励学分</span>
          <span>{{info.jlcredit}}</span>
        </cell>-->
        <cell>
          <span slot="after-title">成绩</span>
          <span>{{info.scorevalue}}</span>
        </cell>
        <cell>
          <span slot="after-title">备注</span>
        </cell>
        <p class="remark">{{info.remark}}</p>
        <cell>
          <span slot="after-title">附件</span>
        </cell>
        <div v-for="(f, index) in info.filepathList" :key="index" style="position: relative;display: inline-block; width: 50%;">
          <img class="fileImg" height="120" width="120" :src="QD.APIHOST + f.filePath" />
        </div>
      </group>
      <!--  审批人的审批信息-->
      <group v-if="detailMore">
        <cell v-for="(r, ridx) in userAuditInfo" :key="ridx">
        <span slot="icon" class="xmicon">
          <a class="school-wx-icon stu-icon" slot="icon">&#xe657;</a>
          <a class="headXM">{{r.UserName.substr(r.UserName.length-2, 2)}}</a>
        </span>
          <span slot="after-title" class="after-title">
          <label>{{r.UserName}}</label>
          <label>{{r.UserState}}</label>
          <label style="font-size: 12px;color: #999999;float: right;">{{r.ApprovalTime}}</label>
        </span>
          <span slot="inline-desc">{{r.Comments}}</span>
        </cell>
      </group>
    </div>
    <!-- 当在退回状态时，学生可以重新编辑修改  -->
    <div v-if="statesVal === '审核退回'" class="btn-box">
      <x-button type="primary" mini class="revise-but" @click.native="doRevise">修 改</x-button>
    </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'

  export default {
    name: 'certificateDetail',
    directives: {
    },
    components: {
      Cell,
      Group,
      XButton
    },
    methods: {
      // 在退回的状态下，学生可以修改
      doRevise () {
        this.QD.otherPageData = {info: this.info}; // 将数据传到修改页面
        this.$router.push({path: '/certificate/reviseCertificate', query: {id: this.$route.query.id}});
      },
        // 得到证书的详细情况
      async getData () {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuCertificateApplyView',
          zsid: this.$route.query.id,
          xh: this.$route.query.xh,
          states: this.$route.query.states,
          pageIndex: 1,
          pageSize: 1
        });
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
          return;
        }
        this.getLoadStudentAuditResults(); // 学生查询证书审批结果及各种状态
        console.log(d);
        this.info = d[0];
      },
      // 学生查询证书审批结果及各种状态 {xh}/{bizId}/{auditedOnly}
      async getLoadStudentAuditResults () {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStudentAuditResults',
          xh: this.$route.query.xh,
          bizId: this.$route.query.id,
          auditedOnly: false
        });
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
          return;
        }
        let auditInfo = JSON.parse(d);
        if (auditInfo.success) {
          this.userAuditInfo = auditInfo.data;
        }
        console.log(this.userAuditInfo);
      },
      getUserData () {
        let info = this.QD.getLocalUserinfo();
        this.userData = info.stuObj;
        /* 判断状态值 start */
        let states = parseInt(this.$route.query.states);
        if (states === 0) {
          this.statesVal = '未提交';
        } else if (states === 1) {
          this.statesVal = '审核退回';
        } else if (states === 2) {
          this.statesVal = '审核中';
        } else if (states === 3) {
          this.statesVal = '审核通过';
        }
        /* 判断状态值 end */
      }
    },
    beforeDestroy () {
    },
    created (){
      this.getUserData(); // 用户信息
      this.getData(); // 得到证书的详细情况
    },
    data () {
      return {
        detailMore: false, // 详细信息
        statesVal: '', // 审核状态值
        userAuditInfo: [], // 对学生证书的审批结果及各种状态
        info: [], // 证书详细数据
        userData: [] // 学生用户数据
      }
    }
  }
</script>
<style scoped>
  .icon-box{
    position: absolute;
    top: 40px;
    width: 100%;
    z-index: 5;
  }
  /*通过的iconfont图片*/
  .statusIcon{
    float: right;
    margin-top: -30px;
    color: #1ea01e;
    font-size: 90px;
    padding-right: 10px;
    opacity: 0.6;
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
.gp{
  margin-top: -20px;
}
.gpp{
  margin-top: -21px;
}
.cell-box {
  padding: 4px 15px;
  background-color: #f2f2f2;
}
.group-title{
  color: #999999;
  font-size: 12px;
}
.seeMore{
  font-size: 12px;
  color: #586C94;
}
  .remark{
    padding: 10px 15px;
    font-size: 16px;
    color: #666666;
  }
  .fileImg{
    background-color: #f1f1f1;
    margin: 5% 0 5% 8%;
  }
  .after-title{
    font-size: 14px;
  }
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
  /* x-button 样式 */
  .btn-box{
    background-color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding-bottom: 10px;
  }
  .revise-but{
    display: block;
    width: 90%;
    text-align: center;
  }
</style>
