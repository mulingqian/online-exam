<template>
  <div class="infirmSickLst">
    <div class="leaveApplyShowLst">
      <ex-scroller v-show="stuLeaveApplyLst.length > 0" v-model="stuLeaveApplyLst" ref="scrollerLeaveApplyLstPageIdxOne" :onGetList="getLeaveApplyLst" height="-46">
        <div>
          <group v-for="(stuLeaveApply, stuIdx) in stuLeaveApplyLst" :key="stuIdx">
            <cell :link="{path: '/stuLeaveApply/leaveApplyDetail', query: {id: stuLeaveApply.ApplyID}}">
            <span slot="after-title" class="vux-label">
              <div class="first-stuLeaveApply">
                <span v-if="stuLeaveApply.Status===0">未提交</span>
                <span v-if="stuLeaveApply.Status===1">审核中</span>
                <span v-if="stuLeaveApply.Status===2" style="color: #008000;">审核通过</span>
                <span v-if="stuLeaveApply.Status===4" style="color: #ff7549;">被退回</span>
                <span>{{stuLeaveApply.CreateDate}}</span>
              </div>
              <div class="stuIconImg">
                <span class="school-wx-icon stu-icon" slot="icon">&#xe657;</span>
                <span class="stuIconXM">{{stuLeaveApply.StuName}}</span>
              </div>
              <div class="stuInfor">
                <div class="second-stuLeaveApply">
                  <span>学号:{{stuLeaveApply.XH}}</span>
               </div>
              <div class="third-stuLeaveApply">
                <span>班级:{{stuLeaveApply.BJMC}}</span>
                <div style="color: #666666;">
                  <div style="color: #666666;">请假类型:{{stuLeaveApply.ApplyType}}</div>
                  <span>开始时间:{{stuLeaveApply.StartDate}}</span>
                  <div>结束时间:{{stuLeaveApply.EndDate}}</div>
                  <span style="color:#3EA7C0;">时长:{{stuLeaveApply.ApplyDay}} 天</span>
                  <span class="isShowSituation" v-if="stuLeaveApply.ReturnSchool > 0 ? (stuLeaveApply.ReturnSchool == 1 ? leaveSchStatus='已离校' : leaveSchStatus='已返校') : (stuLeaveApply.LeaveSchoolStatus == 1 ? leaveSchStatus='需要离校' : (stuLeaveApply.LeaveSchoolStatus == 2 ? leaveSchStatus='无需离校' : leaveSchStatus='不在校'))">{{leaveSchStatus}}</span>
                </div>
                <span class="school-wx-icon stuLeaveApplyDelete" slot="icon" v-if="stuLeaveApply.Status===0 || stuLeaveApply.Status===4" style="color:#2a7af0;" @click.stop.prevent="deleteStuLeaveApply(stuLeaveApply.ApplyID,stuIdx)">&#xe600;</span>
              </div>
              </div>
            </span>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>
    <divider style="padding-top: 50px;" v-show="stuLeaveApplyLst.length <= 0">暂无数据</divider>
    <!--添加‘学生请假’-->
    <add-page @click.native="addLeaveApply()"></add-page>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import ExScroller from '../common/ExScroller.vue'
  import addPage from '../primaryKey/AddPage.vue'
  export default {
    name: 'infirmSickLst',
    components: {
      ExScroller,
      Cell,
      Group,
      Divider,
      addPage
    },
    methods: {
      // 跳转到学生请假申请登记页面
      addLeaveApply () {
        this.$router.push({ path: '/infirmaryDemo/infirmSickReg' });
      },
      // 获取学生请假申请信息
      async getLeaveApplyLst (index, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuLeaveApplyLst', pageSize: size, pageIndex: index});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        return d;
      },
      // 根据学生请假申请id删除学生请假申请数据
      async deleteStuLeaveApply (id, stuIdx) {
        let _this = this;
        this.QD.confirm('', '确定删除', async function(){
          let d = await _this.QD.getData('/ComApi/PostObject', {apiName: 'DeleteStuLeaveApplyData', applyId: id});
          if (d.status && d.status === "error") {
            _this.QD.alert(`获取数据失败:${d.msg}`);
          }
          if (d === 0) {
            _this.QD.alert('', `删除失败`);
          } else {
            _this.QD.alert('', `删除成功`);
            _this.stuLeaveApplyLst.splice(stuIdx, 1); // 改变当前删除的数据
            // 重新加载请假审批列表的第一页数据
            _this.$refs.scrollerLeaveAuditLstPageIdxOne.initData();
          }
        }, '');
      }
    },
    created () {
    },
    data () {
      return {
        stuLeaveApplyLst: [] // 学生请假列表
      }
    }
  }
</script>
<style scoped>
  /*头像*/
 .stuIconImg{
    display: block;
    float: left;
  }
  .stuIconImg .stu-icon{
    position: absolute;
    font-size: 35px;
    padding-right:0;
  }
  .stuIconXM{
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

 .leaveApplyShowLst {
    background-color: #f2f2f2;
  }
 .first-stuLeaveApply{
    margin-top: 8px;
  }
 .first-stuLeaveApply,
 .second-stuLeaveApply,
  .third-stuLeaveApply
  {
    overflow: hidden;
    font-size: 14px;
    color: #333333;
  }
 .first-stuLeaveApply span:nth-child(2){
    float: right;
    font-size: 12px;
    padding-left: 8px;
    color: #999999;
  }
  .second-stuLeaveApply span:nth-child(1){
    color: #999999;
  }
 .third-stuLeaveApply{
    color: #999999;
  }
 .third-stuLeaveApply .isShowSituation{
    float: right;
    color: #3437ff;
  }
 .third-stuLeaveApply .stuLeaveApplyDelete{
    float: right;
    width: 20px;
    height: 20px;
    padding-right: 0;
    font-size: 20px;
    vertical-align: middle;
    background-size: cover;
  }
</style>
<style>
  .infirmSickLst .weui-cells {
    position: relative;
    left: 2%;
    width: 96%;
    margin-top: 18px;
  }
  .infirmSickLst .leaveApplyShowLst .weui-cell:before{
    left:0;
  }
</style>

