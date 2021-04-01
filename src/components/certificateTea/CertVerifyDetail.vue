<template>
  <div class="certVerify-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="gp">
      <div class="icon-box">
        <span v-if="info.states === 3" class="school-wx-icon statusIcon" slot="icon">&#xe64d;</span>
        <span v-if="info.states === 1" class="school-wx-icon statusIcon" slot="icon" style="color: #e01616;">&#xe68a;</span>
      </div>
      <cell>
        <span slot="after-title">姓名</span>
        <span>{{info.xm}}</span>
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
      <cell v-if="info.states !== 2">
        <span slot="after-title">审批意见</span>
      </cell>
      <p class="contents" v-if="info.states !== 2">{{userAuditInfo.comments}}</p>
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
    <group v-if="detailMore" class="gpp">
      <cell>
        <span slot="after-title">班级</span>
        <span>{{info.bjmc}}</span>
      </cell>
      <cell>
        <span slot="after-title">班主任</span>
        <span>{{info.bzrxm}}</span>
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
    <div v-show="userAuditInfo.userState === '未审批'" class="btn-box">
      <x-button type="primary" mini class="sub-pass" @click.native="aduitCertWay(true)">通 过</x-button>
      <x-button type="primary" mini class="sub-refuse" @click.native="aduitCertWay(false)">拒 绝</x-button>
    </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  export default {
    name: 'certificateDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Cell,
      Group,
      XButton
    },
    methods: {
        // 教师审核的方法同意或拒绝
      aduitCertWay (type) {
        let that = this;
        this.QD.confirm("提示: 请输入审批意见", "", async function (m) {
          that.loading = true;
          let d = await that.QD.getData('/ComApi/PostObject', {
            apiName: 'DoStuCertificateAudit',
            UserId: that.$route.query.userid,
            ResultId: that.$route.query.reid,
            Pass: type,
            Comments: m
          });
          that.loading = false;
          if (d.status && d.status === "error") {
            console.log(`获取数据失败:${d.msg}`);
            return;
          }
          console.log(d);
          let result = JSON.parse(d);
          if (result.success) {
            that.QD.alert('', '审批成功');
            if (result.flowState !== 2) {
              that.getUpdateBizDataState(result.bizId, type); // 所有审批人已审核完毕调用接口-更新数据
            }
            that.getData(); // 得到证书的详细情况
          } else {
            if (!result.errMsg) {
              that.QD.alert('', '审批失败');
            } else {
              that.QD.alert('', result.errMsg);
            }
          }
        }, null, {showInput: true, inputVal: "", required: true});
      },
      // 所有审批人已审核完毕调用接口-更新数据 {zsid}/{states}
      async getUpdateBizDataState (zsid, type) {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetUpdateBizDataState',
          zsid: zsid,
          states: type? 3 : 1
        });
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
        }
        console.log(d);
      },
      // 获取审批人对学生证书的审批结果及各种状态
      async getStuCertificateAuditInfo () {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuCertificateAuditInfo',
          userid: this.$route.query.userid,
          keyid: this.$route.query.reid
        });
        if (d.status && d.status === "error") {
          console.log(`获取数据失败:${d.msg}`);
          return;
        }
        this.userAuditInfo = JSON.parse(d);
        console.log('d', this.userAuditInfo);
      },
      // 得到证书的详细情况
      async getData () {
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuCertificateApplyView',
          zsid: this.$route.query.id,
          xh: '0',
          states: '-1',
          pageIndex: 1,
          pageSize: 1
        });
        this.getStuCertificateAuditInfo(); // 获取审批人对学生证书的审批结果及各种状态
        if (d.status && d.status === "error") {
          console.log(`detail，获取数据失败:${d.msg}`);
          return;
        }
        console.log(d);
        if (d.length > 0) {
          this.info = d[0];
        }
        /* 判断状态值 start */
        if (this.info.states === 1) {
          this.statesVal = '审核退回';
        } else if (this.info.states === 2) {
          this.statesVal = '审核中';
        } else if (this.info.states === 3) {
          this.statesVal = '审核通过';
        }
        /* 判断状态值 end */
      }
    },
    beforeDestroy () {
    },
    created (){
      this.getData(); // 得到证书的详细情况
    },
    data () {
      return {
        loading: false,
        detailMore: false, // 详细信息
        statesVal: '', // 审核状态值
        info: [], // 证书详细数据
        userAuditInfo: [] // 对学生证书的审批结果及各种状态
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
    margin-bottom: 60px;
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
  .btn-box{
    background-color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .sub-pass{
    width: 40%;
    text-align: center;
    background-color: #008000;
  }
  .sub-refuse{
    margin-left: 20px;
    width: 40%;
    background-color: #be2828;
  }
  .contents {
    padding: 0 15px 10px 15px;
    color: #999999;
    font-size: 16px;
  }
</style>
