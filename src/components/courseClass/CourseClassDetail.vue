<template>
  <div class="course-class-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group class="gp">
      <cell :is-link="true" @click.native="goSelectClass">
        <span slot="after-title" class="title-Key">班级</span>
        <span v-if="!classInfo" class="disabled-value">请选择班级</span>
        <span v-if="classInfo" class="disabled-value">
          <span v-if="classInfo.njmc">{{classInfo.njmc}}级</span> <!--年级存在时，显示年级-->
          {{classInfo.zymc}}{{classInfo.bjmc}}
        </span>
      </cell>
    </group>
    <smst @on-load="onLoad" @on-hide="onHide" :showName="true" :weekType="true" ></smst>
    <group style="position: relative;padding-bottom: 95px;">
      <div v-if="(!loading && (lst && lst.CourseDate.length === 0))">
        <divider style="margin-top:50px;">暂无数据</divider>
      </div>
      <div style="margin-top: 10px;" v-if="lst && lst.CourseDate.length !== 0">
        <x-table>
          <thead>
          <tr >
            <td><span style="font-size:11px;color:#7b82b9;">节\周</span></td>
            <th class="tblHead" v-for="(x, index) in lst.CourseDate" v-if="index<5"><div class="datestr">{{x.substr(5,5)}}</div><div class="weekstr">{{WeekLst[index]}}</div></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(y, idy) in lst.Nodes">
            <td class="node-index">{{idy+1}}</td>
            <td v-for="(x, idx) in lst.CourseDate" v-if="(!y[x] || y[x].span) > 0 && idx < 5" :rowspan="!y[x]?1:y[x].span" :class="[{'has-class': !!y[x]}, (y[x]? y[x].bg : 'no-class')]" >
              <div v-if="!!y[x]" :class="`${y[x].bg} course-text`">
                <div class="block" @click.stop.prevent="goUserCoursePg">{{y[x].KCMC}}</div>
                <div class="block" @click.stop.prevent="goRoomCourse(y[x].JSID, y[x].JSMC)" v-if="y[x].JSMC">{{y[x].JSMC}}</div>
                <div v-if="QD.allowLookCourseOtherTeaDetail">
                  <p class="tea-xm" v-for="(tea, tidx) in y[x].TeacherList" :key="tidx" @click.stop.prevent="goTeaCoursePg(tea)">{{tea.xm}}</p>
                </div>
                <div v-if="!QD.allowLookCourseOtherTeaDetail">
                  <p class="tea-xm" v-for="(tea, teaIndex) in y[x].TeacherList" :key="teaIndex">{{tea.xm}}</p>
                </div>
              </div>
              <div v-else >&nbsp;</div>
            </td>
          </tr>
          </tbody>
        </x-table>
      </div>
    </group>

  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Smst from '../Smst.vue'
  import XTable from 'vux/src/components/x-table/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'courseClassDetail',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      Smst,
      XTable,
      Divider
    },
    methods: {
      // 到用户课表页面
      goUserCoursePg () {
        this.$router.replace('/courseTeaLst');
      },
      // 到教室课表页面
      goRoomCourse (jsid, jsmc) {
        this.QD.currPgToOtherPg = {jsmc: jsmc, jsid: jsid}; // 教室信息
        this.$router.replace({path: '/courseRoom/courseRoomDetail'});
      },
      // 到教师课表
      goTeaCoursePg (tea) {
        this.QD.currPgToOtherPg = {tea: tea}; // 教室信息
        this.$router.replace({path: "/courseOtherTeaDetail", query: {zgh: tea.zgh}});
      },
      // 去选择班级
      goSelectClass() {
        if (this.otherPageData) {
          this.QD.otherPageData = this.otherPageData; // 保存之前选中的班级信息和样式信息
          sessionStorage.setItem("logEditWeekIndex", this.weekIndex); // 记录选中的周次
        }
        this.$router.push({path: "/classWholeSchool/classWholeSchoolLst"});
      },
      // 得到选中的班级信息
      getSelectClassInfo () {
        if (this.QD.otherPageData && this.QD.otherPageData.selectInfo) {
          this.classInfo = this.QD.otherPageData.selectInfo;
          this.otherPageData = this.QD.otherPageData;
          this.QD.otherPageData = null;
          this.QD.classInfoInCourseClass = {classInfo: JSON.parse(JSON.stringify(this.classInfo)), userinfo: this.userinfo.stuObj}; // 记录选择的班级信息，下次进入页面默认显示之前的班级信息
        } else {
          if (!this.QD.otherPageData && this.QD.currPgToOtherPg) { // 得到从‘课表’、‘教室课表’ 中的班级信息，并记录默认班级课表信息
            this.QD.classInfoInCourseClass = {classInfo: JSON.parse(JSON.stringify(this.QD.currPgToOtherPg)), userinfo: this.userinfo.stuObj};
            this.classInfo = this.QD.currPgToOtherPg;
            this.QD.currPgToOtherPg = null; // 清空传递数据的参数值
          } else {
            if (!this.QD.otherPageData && this.QD.classInfoInCourseClass) { // 进入页面默认显示之前选中的班级的课表信息
              let qd = this.QD.classInfoInCourseClass;
              if (this.userinfo.stuObj && this.userinfo.stuObj.ZGH && qd.userinfo.ZGH && this.userinfo.stuObj.ZGH === qd.userinfo.ZGH) { // 同一个教师
                this.classInfo = qd.classInfo;
              }
            }
          }
        }
      },
      onLoad (e) {
        console.log("smst on load");
        console.log(e);
        this.xqid = e.XQID;
        this.weekIndex = e.weekIndex;
        this.getClassScheduleData(); //  根据班级id学期id和周次得到班级课表
      },
      onHide (t, e) {
        console.log("smst on hide");
        console.log(e);
        if (t === true && e && e.XQID) {
          this.xqid = e.XQID;
          this.weekIndex = e.weekIndex;
          this.getClassScheduleData(); //  根据班级id学期id和周次得到班级课表
        }
      },
      // 根据班级id学期id和周次得到班级课表
      async getClassScheduleData () {
        if (!this.classInfo) { // 在没有班级的情况下，没有班级课表。不调用接口获取班级课表
          return;
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassScheduleData', bjid: this.classInfo.bjid, semId: this.xqid, weekindex: this.weekIndex});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return;
        }
        console.log("classSchedule", d);
        let x = d.CourseDate.length;
        let y = d.Nodes.length;
        let nextj, nextNode;
        let curNode = null;
        let tmpColor = null;
        let idxColor = 0;
        let mapColor = new Map();
        for (let j = 0; j < y; j++) {
          let nd = d.Nodes[j];
          for (let i = 0; i < x; i++) {
            curNode = nd.list.find((n) => n.WeekIndex === (i + 1));
            if (curNode) {
              // 跨行显示
              if (curNode.span !== 0) {
                // 设置颜色样式类
                tmpColor = mapColor.get(curNode.KCMC);
                if (tmpColor) {
                  curNode.bg = tmpColor
                } else {
                  curNode.bg = this.BgLst[idxColor++];
                  mapColor.set(curNode.KCMC, curNode.bg);
                  if (idxColor >= this.BgLst.length) {
                    idxColor = 0
                  }
                }
                curNode.span = 1;
                nextj = j + 1;
                while (nextj < y) {
                  nextNode = d.Nodes[nextj].list.find((n) => n.WeekIndex === (i + 1));
                  if (nextNode && nextNode.JXBID === curNode.JXBID) {
                    curNode.span++;       // 跨行span+1
                    nextNode.span = 0;   // 设置不显示
                    nextj++
                  } else {
                    break
                  }
                }
              }
              nd[d.CourseDate[i]] = curNode
            } else {
              nd[d.CourseDate[i]] = null
            }
          }
        }
        this.lst = d;
      }
    },
    beforeDestroy () {
    },
    created () {
      console.log("userinfo", this.userinfo);
      this.getSelectClassInfo(); // 得到选中的班级信息
    },
    data () {
      return {
        loading: false,
        otherPageData: null, // 其他页面的信息-选中的班级信息，选中班级index
        classInfo: null, // 班级信息
        xqid: 0, // 学期id
        weekIndex: 1, // 周次index,默认是第一周
        lst: {
          Nodes: [],
          CourseDate: []
        },
        showWeekend: false,
        WeekLst: ['一', '二', '三', '四', '五', '六', '日'],
        BgLst: ['course01', 'course02', 'course03', 'course04', 'course05', 'course06', 'course07', 'course08', 'course09', 'course10', 'course11', 'course12']
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -20px;
  }
  .title-Key{
    display: inline-block;
    width: 40px;
  }
  .disabled-value{
    font-size: 14px;
    color: #666666;
  }
  .tblHead{
    background-color: #dfe2fa;
    font-size:14px;
    line-height:26px;
  }
  .node-index{
    background-color: #d8dcf9;
    width:35px;
  }
  .no-class{
    background-color: #eef0fe;
  }
  .has-class{
    width: 16.6667%;
    font-size:12px;
    line-height:16px;
    color:#fff;
  }
  .has-class > div{
    padding: 6px 0;
  }
  .vux-table td:before, .vux-table th:before{
    border-bottom: 1px solid #fff;
    color: #fff;
  }
  .vux-table td:after, .vux-table th:after{
    border-right: 1px solid #fff;
    color: #fff;
  }
  .course-text > .block {
    padding: 4px 0;
  }
  .course-text .tea-xm {
    padding: 4px 0;
  }
</style>
