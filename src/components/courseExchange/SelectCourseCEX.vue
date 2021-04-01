<template>
  <div class="eachPgBase">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="eachPgBase">
      <group class="gp">
        <popup-picker title="调课目标周次" v-model="weeksVal" :data="weeksLst" @on-change="changeWeeksVal"></popup-picker>
      </group>
      <group class="gp">
        <cell v-for="(s, sIdx) in applicableNodes" :key="sIdx" :is-link="true" @click.native="selectCourse(s)">
          <div slot="after-title">
            <span>{{s.pkDate}} 星期{{WeekDayLst[s.dayOfWeek-1]}}</span> <!--日期-->
            <span class="nodeIndexVal">第{{s.nodeIndex}}节</span>
          </div>
        </cell>
      </group>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  export default {
    name: 'selectCourseCEX',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      PopupPicker
    },
    methods: {
      // 选择的课时
      selectCourse (s) {
        s.weekIndex = this.weeksVal[0]; // 记录对应的周次
        s.weekDayName = this.WeekDayLst[s.dayOfWeek-1];
        this.QD.otherPageData = {newCourseInfo: s};
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 改变调课目标周次
      changeWeeksVal (val) {
        console.log(val);
        this.getApplicableNodes(); // 读取可申请调课的课时（无冲突的课时）
      },
      // 读取可申请调课的课时（无冲突的课时）
      async getApplicableNodes () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetApplicableNodesForTK',
          changeRange: 3, // 调课范围，1-代课，2-教室，3-时间，4-班内对调
          semId: this.pkXqInfo.XQID,
          weekIndex: this.weeksVal[0],
          jxbid: this.oriScheduleSelect[0].JXBID,
          jxbRoomId: 0
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取申请数据失败:${d.msg}`);
          return;
        }
        d = JSON.parse(d);
        console.log("time applicable nodes = ", d);
        this.applicableNodes = d.nodes;
      },
      // 得到相关信息
      getRelativeInfo () {
        if (this.QD.currPageData && this.QD.brotherPageData && this.QD.brotherPageData.weeksVal) {
          let cqd = this.QD.currPageData;
          let qd = this.QD.brotherPageData;
          this.pkXqInfo = cqd.pkXqInfo; // 排课学期信息
          this.oriScheduleSelect = qd.oriScheduleSelect; // 选中原课表信息
          this.weeksLst = qd.weeksLst; // 可选的周次
          this.weeksVal.push(this.weeksLst[0][0]); // 默认选中第一个可选的周次
          this.getApplicableNodes(); // 读取可申请调课的课时（无冲突的课时）
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getRelativeInfo(); // 得到相关信息
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        pkXqInfo: null, // 排课学期信息
        weeksVal: [], // 默认选中当前周次
        weeksLst: [], // 当前学期下，调课可选的调课周次- 目标周次
        oriScheduleSelect: [], // 选中原课表中的数据
        applicableNodes: [], // 可以对调的课程信息
        WeekDayLst: ['一', '二', '三', '四', '五', '六', '日']
      }
    }
  }
</script>
<style scoped>
.gp{
  margin-top: -1.25em;
}
</style>

