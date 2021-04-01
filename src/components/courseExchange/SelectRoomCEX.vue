<template>
  <div>
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="search_box">
      <x-input placeholder="请输入教室名称或教室代码" v-model="searchName" v-on:input="searchNameBtn">
        <x-button slot="right" type="primary" mini @click.native="searchNameBtn">搜索</x-button>
      </x-input>
    </div>
    <div>
      <div class="gpBox">
        <group class="gp" v-if="searchClassroomInfo.length > 0">
          <cell :is-link="true" v-for="(s, sidx) in searchClassroomInfo" :key="sidx" @click.native="selectTeaInfo(s)">
            <div slot="after-title">
              {{s.jsmc}}
              <span class="jsdmVal"> ({{s.jsdm}})</span>
            </div>
          </cell>
        </group>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  export default {
    name: 'selectRoomCEX',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      XButton,
      XInput,
      Scroller
    },
    methods: {
      // 选中教师
      selectTeaInfo (s) {
        this.QD.otherPageData = s; // 调课教室
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 搜索教师的姓名
      searchNameBtn() {
        let result = [];
        if (this.searchName !== '') {
          for (let i = 0; i < this.classroomInfo.length; i++) {
            if (this.classroomInfo[i].jsmc.indexOf(this.searchName) >= 0 || this.classroomInfo[i].jsdm.indexOf(this.searchName) >= 0) {
              result.push(this.classroomInfo[i]);
            }
          }
        } else {
          result = this.classroomInfo;
        }
        this.searchClassroomInfo = result;
      },
      // 得到可选的教室
      async getClassroomData() {
        let selectSchedule = this.courseExInfo.oriScheduleSelect[0]; //  选中的课程信息
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassroomScheduleChange',
          semId: this.pkXqInfo.XQID, // 学期id
          jxbid: selectSchedule.JXBID, // 教学班ID
          pkWeeks: this.courseExInfo.weeksVal[0], // 传入其要排课的周次
          pkNodes: selectSchedule.WeekIndex + '_' + selectSchedule.NodeIndex, // 传入的其要排课的节次，格式：3_3 (星期索引_节次索引)
          minRNRS: 0, // 教室最小容纳人数, 0 表示不限制
          areaId: 0 // 教室所在校区id, 0 表示不区分
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取教师信息失败`);
          return;
        }
        d = JSON.parse(d);
        this.classroomInfo = d.Rooms;
        this.searchClassroomInfo = d.Rooms;
      },
      // 得到其他页面的相关数据
      getRelativeData () {
        if (this.QD.currPageData && this.QD.brotherPageData) {
          let cqd = this.QD.currPageData;
          let bqd = this.QD.brotherPageData;
          this.pkXqInfo = cqd.pkXqInfo; // 排课学期信息
          this.courseExInfo = bqd; // 调课内容信息
          console.log("room relative data = ", this.courseExInfo);
          this.getClassroomData(); // 得到可选的教室
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getRelativeData(); // 得到其他页面的相关数据
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        courseExInfo: null, // 调课内容信息
        pkXqInfo: null, // 排课学期信息
        searchName: '', // 搜索出来的教师姓名
        classroomInfo: [], // 可选教师信息-all
        searchClassroomInfo: [] // 查询得到的空闲教室
      }
    }
  }
</script>
<style scoped>
  .search_box{
    position: absolute;
    width: 100%;
    z-index: 100;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
    background-color: #fff;
  }
  .gpBox{
    position: relative;
    top: 50px;
    padding-top: 10px;
    background-color: #f5f5f9;
  }
  .gpBox .gp{
    margin-top: -1.25em;
  }
  .jsdmVal{
    font-size: 14px;
    color: #666666;
  }
</style>
