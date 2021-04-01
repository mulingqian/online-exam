<!-- 老师课表 -->
<template>
  <div class="courseTea">
    <div v-if="isAllowLookTeaSchedule">
      <search
        placeholder="搜索教师"
        @on-result-click="resultClick"
        @on-change="getResult"
        @on-cancel="onCancel"
        :results="results"
        v-model="teaXM"
        position="absolute"
        auto-scroll-to-top top="46px"
        @on-focus="onFocus"></search>
    </div>
    <smst @on-load="onLoad" @on-hide="onHide" :showName="true" :weekType="true" >
    </smst>

    <group style="position: relative;padding-bottom: 95px;">
      <div v-if="(!loaded && (lst && lst.CourseDate.length === 0))">
        <divider style="margin-top:50px;">暂无数据</divider>
      </div>

      <div style="margin-top: 10px;" v-if="lst && lst.CourseDate.length !== 0">
        <x-table>
          <thead>
          <tr>
            <td><span style="font-size:11px;color:#7b82b9;">节\周</span></td>
            <th class="tblHead" v-for="(x, index) in lst.CourseDate" v-if="index<5"><div class="datestr">{{x.substr(5,5)}}</div><div class="weekstr">{{WeekLst[index]}}</div></th>
          </tr>
          </thead>
          <tbody v-if="!ableClick">
            <tr v-for="(y, idy) in lst.Nodes">
              <td class="node-index">{{idy+1}}</td>
              <td v-for="(x, idx) in lst.CourseDate" v-if="(!y[x] || y[x].span) > 0 && idx < 5" :rowspan="!y[x]?1:y[x].span" :class="[{'has-class': !!y[x]}, (y[x]? y[x].bg : 'no-class')]">
                <div v-if="!!y[x]" :class="`${y[x].bg} course-text`">
                  <div >{{y[x].KCMC}}</div>
                  <div v-if="y[x].ClazzList.length > 0" v-for="(sy, syIdx) in y[x].ClazzList" :key="syIdx">
                    <p  @click.stop.prevent="changeCourse ? goClassCourse(sy.bjid, sy.bjmc) : ''">{{sy.bjmc}}</p>
                  </div>
                  <div v-if="y[x].JSMCs" @click.stop.prevent="changeCourse ? goRoomCourse(y[x].JSID, y[x].JSMC) : ''">{{y[x].JSMC}}</div>
                </div>
                <div v-else >&nbsp;</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(y, idy) in lst.Nodes">
              <td class="node-index">{{idy+1}}</td>
              <td v-for="(x, idx) in lst.CourseDate" v-if="(!y[x] || y[x].span) > 0 && idx < 5" :rowspan="!y[x]?1:y[x].span" :class="[{'has-class': !!y[x]}, (y[x]? y[x].bg : 'no-class')]"
                  @click="goLogpage(y[x].KCMC, y[x].JSMCs, y[x].JXBID, y[x].NodeIndex, y[x].span, y[x].PkDay)">
                <div v-if="!!y[x]" :class="`${y[x].bg} course-text`">
                  <div >{{y[x].KCMC}}</div>
                  <div v-if="y[x].ClazzList.length > 0" v-for="(sy, syIdx) in y[x].ClazzList" :key="syIdx">
                    <p>{{sy.bjmc}}</p>
                  </div>
                  <div v-if="y[x].JSMCs">{{y[x].JSMC}}</div>
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
  // import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
  import XTable from 'vux/src/components/x-table/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Smst from './Smst.vue'
  import Search from 'vux/src/components/search/index.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: "courseTea",
    directives: {
      TransferDom
    },
    components: {
      Cell,
      Group,
      Smst,
      Divider,
      XTable,
      Search
    },
    props: {
      urlHadZGH: { // 地址栏的路径中存在职工号
        type: Boolean,
        default: false
      },
      ableClick: {
        type: Boolean,
        default: false
      }, // 节次中有课时，是否添加点击事件
      changeCourse: { // 班级课表、教室课表、教师课表是否可以切换，默认可以切换
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        isAllowLookTeaSchedule: false, // 是否有权限查看所有教师的课表
        loaded: true,
        xqid: 0,
        weekIndex: 0,
        lst: {
          Nodes: [],
          CourseDate: []
        },
        showWeekend: false,
        WeekLst: ['一', '二', '三', '四', '五', '六', '日'],
        BgLst: ['course01', 'course02', 'course03', 'course04', 'course05', 'course06', 'course07', 'course08', 'course09', 'course10', 'course11', 'course12'],
        currentXQ: null,
        localZgh: null, //获取登录者的zgh 职工号
        semesterTeaData: [], // 教师列表
        results: [],
        teaXM: '', // 教师姓名
        rs: [], // 所有教师姓名列表
        searchTeaData: [] // 查询到的教师数据信息
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    created () {
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 到班级课表
      goClassCourse (bjid, bjmc) {
        this.QD.currPgToOtherPg = {njid: null, njmc: '', zyid: null, zymc: '', bjid: bjid, bjmc: bjmc}; // 班级信息
        this.$router.replace({path: '/courseClass/courseClassDetail'});
      },
      // 到教室课表
      goRoomCourse (jsid, jsmc) {
        this.QD.currPgToOtherPg = {jsmc: jsmc, jsid: jsid}; // 教室信息
        this.$router.replace({path: '/courseRoom/courseRoomDetail'});
      },
        // 到教学日志详情页面-teaTeachingLog curriculumlst
      // kcmc: 课程名称、jsmcs: 教室名称, nodeIndex: （首次）节次，span: 节次占几行
      goLogpage(kcmc, jsmcs, jxbid, nodeIndex, span, PkDay) {
        sessionStorage.setItem("logEditWeekIndex", this.weekIndex);
        this.$emit('go-page', {kcmc: kcmc, jsmcs: jsmcs, jxbid: jxbid, nodeIndex: nodeIndex, span: span, PkDay: PkDay, xqid: this.xqid});
      },
      // 查询是否有权限查看所有教师的课表
      async getOtherTeacherSchedule () {
        // 从CourseTeaLst.vue中得到数据
        if (sessionStorage.getItem("isAllowLookTeaSchedule") !== null){
          let isAllow = sessionStorage.getItem("isAllowLookTeaSchedule");
          this.isAllowLookTeaSchedule = isAllow === 'true';
        }
        if (this.isAllowLookTeaSchedule) {
          // 根据学期查询已排课的教师列表
          this.getSemesterTeacherData();
        }
      },
      // 点击选择教师的事件
      resultClick (item) {
        this.teaXM = item.title;
        this.zgh = item.zgh;
        sessionStorage.setItem("courseOtherTeaZGH", this.zgh);
        this.getUserZGH();
      },
      // 在input标签中输入文字是发生的事件
      getResult (val) {
        this.results = val ? this.getResults(val) : [];
      },
      // 查找输入的姓名事件
      getResults (val) {
        let rs = [];
        // 根据输入的职工号或姓名查找教师
        this.getSearchName(val);
        rs = this.searchTeaData;
        return rs
      },
      // 根据输入的职工号或姓名查找教师
      async getSearchName (val) {
        this.searchTeaData = [];
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSemesterTeacherData', semId: this.xqid, keyWord: val});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        if (d.length !== 0) {
          for (let i=0; i<d.length; i++) {
            this.searchTeaData.push({
              title: d[i].XM + '(' + d[i].ZGH + ')',
              zgh: d[i].ZGH,
              other: i
            });
          }
        }
      },
      // input 获得焦点事件
      onFocus () {
        if (this.rs.length !== 0) {
          this.results = this.rs;
        }
      },
      // 点击搜索中的取消事件
      onCancel () {
         // 删除搜索中的老师信息，回到登录者教师的信息
        if (sessionStorage.getItem("courseOtherTeaZGH") !== null) {
          sessionStorage.removeItem("courseOtherTeaZGH");
        }
        this.getUserZGH();
      },
      // 根据学期查询已排课的教师列表
      async getSemesterTeacherData () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSemesterTeacherData', semId: this.xqid, keyWord: ""});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        console.log("getSemesterTeacherData is");
        console.log(d);
        this.semesterTeaData = d;
        // 得到 getResultsLst 的值
        this.getResultsLst();
      },
      // 得到 getResultsLst 的值 --所有教师姓名列表
      getResultsLst () {
        for (let i = 0; i < this.semesterTeaData.length; i++) {
          this.rs.push({
            title: this.semesterTeaData[i].XM + "(" + this.semesterTeaData[i].ZGH + ")",
            zgh: this.semesterTeaData[i].ZGH,
            other: i
          });
        }
      },
      // 获取教师的职工号
      getUserZGH () {
        if (this.urlHadZGH && this.$route.query.zgh !== undefined) {
          this.localZgh = this.$route.query.zgh
        } else {
          if (sessionStorage.getItem("courseOtherTeaZGH") !== null) {
            this.localZgh = sessionStorage.getItem("courseOtherTeaZGH");
            sessionStorage.removeItem("courseOtherTeaZGH");
          } else {
            this.localZgh = this.userinfo.stuObj.ZGH;// 获取教师的 zgh 的值
          }
        }
        this.getList(this.xqid, this.weekIndex, this.localZgh); // 根据学期id 、周次、职工号获取课表信息
      },
      onLoad (e) {
        console.log("smst on load");
        console.log(e);
        this.xqid = e.XQID;
        this.weekIndex = e.weekIndex;
        e && e.XQID && this.getUserZGH();
        this.$emit('log-load', {XQID: e.XQID, weekIndex: e.weekIndex}); // 传学期id 和周次weekIndex 到课堂日志页面

        this.getOtherTeacherSchedule(); // 查询是否有权限查看所有教师的课表
      },
      onHide (t, e) {
        console.log("smst on hide");
        console.log(e);
        if (t === true && e && e.XQID) {
          this.$emit('log-load', {XQID: e.XQID, weekIndex: e.weekIndex}); // 传学期id 和周次weekIndex 到课堂日志页面
          this.xqid = e.XQID;
          this.weekIndex = e.weekIndex;
          // 根据学期id 、周次、职工号获取课表信息
          this.getList(e.XQID, e.weekIndex, this.localZgh);
        }
      },
      // 根据学期id 、周次、职工号获取课表信息
      async getList (xqid, weekIndex, zgh) {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'TeaScheduleData',
          id: zgh,
          semId: xqid,
          weekIndex: weekIndex,
          type: "employee"
        });
        this.updateLoadingStatus(false);
        this.loaded = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
          return
        }
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
                nextj = j + 1; // 下一个节次下标，nextNode: 对应下一节次的信息
                while (nextj < y) {
                  nextNode = d.Nodes[nextj].list.find((n) => n.WeekIndex === (i + 1));
                  if (curNode.NodeIndex <= 4 && nextj > 3) {
                    break // 上午课和下午的课不进行合并
                  }
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
        // console.log(JSON.stringify(d));
      }
    }
  }
</script>

<style scoped>
  .courseTea{
    /*min-height: 100%;*/
  }
  .failed .weui-progress__inner-bar,
  .failed .scoreval{
    color:red;
  }
  .scoreval{
    color: #428bca
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
  .course-text > div {
    padding: 4px 0;
  }
  .course01{
    background-color: #f79d54;;
  }
  .course02{
    background-color: #6070e9;
  }
  .course03{
    background-color: #5ba1f7;
  }
  .course04{
    background-color: #56a36c;
  }
  .course05{
    background-color: #a685e5;
  }
  .course06{
    background-color: #7e884f;
  }
  .course07{
    background-color: #31a79b;
  }
  .course08{
    background-color: #ee8077;
  }
  .course09{
    background-color: #6baf4a;
  }
  .course10{
    background-color: #2e68aa;
  }
  .course11{
    background-color: #e777ee;
  }
  .course12{
    background-color: #59b4d0;
  }
</style>
<style>
  .courseTea .vux-search-fixed{
    position: fixed!important;
  }
  .courseTea .weui-cells.vux-search_show{
    height:100%;
  }
  /*搜索中的字的位置设置*/
  .courseTea .weui-search-bar__label{
    line-height: 22px;
  }
</style>
