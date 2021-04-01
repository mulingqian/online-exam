<template>
  <div class="meetingLDetail">
    <scroller lock-x :scrollbar-y="true" height="-46">
      <div>
        <group>
          <cell title="会议名称" :value="meetingDetail.Name"></cell>
          <cell title="会议主题" :value="meetingDetail.Subject"></cell>
          <cell title="申请人" :value="meetingDetail.SQRXM"></cell>
          <cell title="开始时间" :value="meetingDetail.StartTime"></cell>
          <cell title="结束时间" :value="meetingDetail.EndTime"></cell>
          <cell title="会议室" :value="meetingDetail.HYSMC"></cell>
          <cell title="会议室管理员" :value="meetingDetail.Manager"></cell>
          <cell :value="meetingDetail.Devices">
            <span slot="after-title" style="display: inline-block;width: 100px;">会议室设备</span>
          </cell>
        </group>
        <group>
          <cell title="出席人员（内部）"></cell>
          <div class="weui-cell vux-x-textarea">
            <div class="weui-cell__bd">
              <span class="span-textarea" v-if="meetingDetail.PersonNames !==''">{{meetingDetail.PersonNames}}</span>
              <span class="span-textarea" v-if="meetingDetail.PersonNames ===''">{{meetingDetail.PersonNames}}</span>
            </div>
          </div>
        </group>
        <group>
          <cell title="出席人员（外部）"></cell>
          <div class="weui-cell vux-x-textarea">
            <div class="weui-cell__bd">
              <span class="span-textarea" v-if="meetingDetail.WBCXRY === ''">无</span>
              <span class="span-textarea" v-if="meetingDetail.WBCXRY !== ''">{{meetingDetail.WBCXRY}}</span>
            </div>
          </div>
        </group>
        <group>
          <cell title="迟到人员" :value="meetingDetail.LatePersons"></cell>
          <div class="weui-cell vux-x-textarea">
            <div class="weui-cell__bd">
              <span class="span-textarea" v-if="meetingDetail.WBCXRY === ''">无</span>
              <span class="span-textarea" v-if="meetingDetail.WBCXRY !== ''">{{meetingDetail.WBCXRY}}</span>
            </div>
          </div>
        </group>
        <group>
          <cell title="早退人员" :value="meetingDetail.LeavePersons"></cell>
          <div class="weui-cell vux-x-textarea">
            <div class="weui-cell__bd">
              <span class="span-textarea" v-if="meetingDetail.LeavePersons === ''">无</span>
              <span class="span-textarea" v-if="meetingDetail.LeavePersons !== ''">{{meetingDetail.LeavePersons}}</span>
            </div>
          </div>
        </group>
        <group>
          <cell title="缺席人员" :value="meetingDetail.AbsentPersons"></cell>
          <div class="weui-cell vux-x-textarea">
            <div class="weui-cell__bd">
              <span class="span-textarea" v-if="meetingDetail.AbsentPersons === ''">无</span>
              <span class="span-textarea" v-if="meetingDetail.AbsentPersons !== ''">{{meetingDetail.AbsentPersons}}</span>
            </div>
          </div>
        </group>
        <group>
          <cell title="附件" :value="meetingAttList.FileName"></cell>
        </group>
        <group>
          <cell title="会议主要内容"></cell>
          <div class="weui-cell vux-x-textarea">
            <div class="weui-cell__bd">
              <span class="span-textarea" v-if="meetingDetail.MainContent === ''">无</span>
              <span class="span-textarea" v-if="meetingDetail.MainContent !== ''" v-html="meetingMainCon"></span>
            </div>
          </div>
        </group>
      </div>
    </scroller>
  </div>
</template>
<script>
  import Scroller from 'vux/src/components/scroller/index.vue'
  import { Cell, Group, XTextarea, XInput } from 'vux'
  export default {
    name: "meetingListDetail",
    components: {
      Group,
      Cell,
      XInput,
      XTextarea,
      Scroller
    },
    methods: {
        // 根据会议MID 获取会议详细信息
      async getOfficeMeetingDetail() {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'OfficeMeetingDetail', mid: this.$route.query.mid});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.meetingDetail = d;
        this.meetingAttList = d.AttList;
        this.meetingMainCon = d.MainContent;
      }
    },
    created () {
      this.getOfficeMeetingDetail();
    },
    data () {
      return {
        meetingDetail: [], // 会议详情信息
        meetingAttList: [], //会议详情信息中的附件
        meetingMainCon: '' //会议的主要内容
      }
    }
  }
</script>
<style>
  .meetingLDetail{
    background-color: #e5e5e5;
  }
  .meetingLDetail .weui-cell .weui-cell__bd .span-textarea{
    color: #999999;
    font-size: 16px;
  }
  .meetingLDetail .weui-cell__ft{
    font-size: 16px;
  }
  .meetingLDetail .vux-label{
    font-size: 16px;
  }
</style>
