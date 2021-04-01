<template>
  <div class="curriculumlst">
    <teaching-course @log-load="getXqInfo" @go-page="goLogpage"></teaching-course>
  </div>
</template>
<script>
  import TeachingCourse from './TeachingLogCourse.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import { mapActions } from 'vuex'
  export default {
    name: "teaTeachingLog-curriculumLst",
    directives: {
      TransferDom
    },
    components: {
      TeachingCourse
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
     // 得到学期和周次相关信息
      getXqInfo (e) {
        this.xqId = e.XQID;
        this.weekIndex = e.weekIndex;
        if (this.loaded) {
          this.getSetNodeTimes(); // 读取指定学期中每节课的上课时间
        }
        this.loaded = false;
      },
      // 跳转页面
      goLogpage(e) {
        console.log("go e", e, this.weekIndex);
//        let resultRule = false;
//        if (this.nodeTimes.length === 0) { // 采用原来的方式
//          resultRule = this.setRegisterRule(e); // 判断是否可以登记
//        } else {
//          for (let i=0; i<this.nodeTimes.length; i++) {
//            let si = this.nodeTimes[i];
//            if (si.nodeIndex === e.nodeIndex && !si.compareTime) { // 采用原来的方式
//              resultRule = this.setRegisterRule({PkDay: e.PkDay, nodeIndex: e.nodeIndex}); // 判断是否可以登记
//              break;
//            }
//            if (si.nodeIndex === e.nodeIndex && si.compareTime) { // 有设置登记时间
//              if (si.timeLimitType === '随时') {
//                resultRule = true; // 总是可以登记
//              } else { // timeLimitType === '课前' ； timeLimitType === '课后'
//                resultRule = this.judgeRegisterRule({PkDay: e.PkDay, nodeTime: si});
//              }
//              break; // 已经找到上课的最小节次对应的上课时间信息
//            }
//          }
//        }
//        if (!resultRule) {
//          // this.QD.alert('', '对不起, 当前班级的课程尚未上课, 不能进行登记 !');
//          this.QD.alert('', '对不起, 当前班级不在登记范围内, 不能进行登记 !');
//          return;
//        }
        this.QD.currPgToOtherPg = null;
        this.QD.currPgToOtherPg = e;
        if (this.QD.showNewTeachingLog){
          // 新版本  教师端的教学日志
          this.$router.push({name: 'teaTeachingLog/newRecordCurricu', params: {weekIndex: this.weekIndex}});
        } else {
          // 旧版本  教师端的教学日志
          this.$router.push({path: '/teaTeachingLog/recordCurricu'})
        }
      },
      /* 判断是否可以登记, 以下是判断规则
      * 第1节第2节：2019-10-10 10:00 后才能登记
       第3节第4节：2019-10-10 12:00 后才能登记
       第5节第6节：2019-10-10 14:30 后才能登记
       第7节后：2019-10-10 16:00 后才能登记
      * */
      setRegisterRule (c) {
        console.log('nodeIndex and pkDay', c);
        let curTime = this.QD.getDateOrTime('time'); // 当前日期+具体时间
        let curTimeLst = (curTime.substr(11, 8)).split(":"); // 当前时分秒
        let curSecond = parseInt(curTimeLst[0]) * 60 * 60 + parseInt(curTimeLst[1]) * 60 + parseInt(curTimeLst[2]); // 当前秒
        let curDate = curTime.substr(0, 10); // 当前日期
        let pkDay = new Date(c.PkDay).getTime();
        let curDay = new Date(curDate).getTime();
        if (pkDay === curDay) { // 授课日期与当前日期相同
          if (c.nodeIndex < 3 && curSecond > 10 * 60* 60) { // 第1节第2节
            return true;
          } else if (c.nodeIndex < 5 && curSecond > 12 * 60* 60) { // 第3节第4节
            return true;
          } else if (c.nodeIndex < 7 && curSecond > 14 * 60* 60 + 30 * 60) {  // 第5节第6节
            return true;
          } else if (curSecond > 16 * 60 * 60) { // 第7节后
            return true;
          } else {
            return false;
          }
        } else if (pkDay < curDay) { // 授课日期小于当前日期
          return true;
        } else { // 授课日期大于当前日期
          return false;
        }
      },
      // 根据用户设置的登记时间，判断登记时间到了，即可去登记考勤
      judgeRegisterRule (c) {
        console.log('nodeIndex | pkDay = ', c);
        let nodeTime = c.nodeTime; // 学校设置的上课时间和可以登记的时间
        let curTime = this.QD.getDateOrTime('time'); // 当前日期+具体时间
        let curTimeLst = (curTime.substr(11, 8)).split(":"); // 当前时分秒
        let curSecond = parseInt(curTimeLst[0]) * 60 * 60 + parseInt(curTimeLst[1]) * 60 + parseInt(curTimeLst[2]); // 当前秒
        let curDate = curTime.substr(0, 10); // 当前日期
        let pkDay = new Date(c.PkDay).getTime();
        let curDay = new Date(curDate).getTime();
        let skLst = nodeTime.compareTime.split(":"); // 登记时间的时、分
        let skSecond = parseInt(skLst[0]) * 60 * 60 + parseInt(skLst[1]) * 60; // 登记秒
        // 如果允许在其他时间登记
        if (this.QD.isAllowTheSameDayWriteLog) {
          if (pkDay === curDay) { // 授课日期与当前日期相同
            if (skSecond <= curSecond) { // 登记时间已过了
              return true;
            } else { // 登记时间还未到
              return false;
            }
          } else if (pkDay < curDay) { // 授课日期小于当前日期
            return true;
          } else { // 授课日期大于当前日期
            return false;
          }
        } else { // 只能在当天时间段登记
          if (pkDay === curDay) { // 授课日期与当前日期相同
            if (skSecond <= curSecond) { // 登记时间已到
              return true;
            } else { // 登记时间还未到
              return false;
            }
          } else { // 授课日期不等于当前日期
            return false;
          }
        }
//        if (pkDay === curDay) { // 授课日期与当前日期相同
//          if (skSecond <= curSecond) { // 登记时间已过了
//            return true;
//          } else { // 登记时间还未到
//            return false;
//          }
//        } else if (pkDay < curDay) { // 授课日期小于当前日期
//          return true;
//        } else { // 授课日期大于当前日期
//          return false;
//        }
      },
      // 读取指定学期中每节课的上课时间
      async getSetNodeTimes () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSemesterNodeTimes', semId: this.xqId});
        this.updateLoadingStatus(false);
        d = JSON.parse(d);
        this.nodeTimes = d.data;
        console.log("nodeTimes", this.nodeTimes);
      }
    },
    data () {
      return {
        loaded: true,
        xqId: 0,
        weekIndex: 0,
        ableClick: true, // 节次中有课时，是否添加点击事件
        nodeTimes: [] // 节次的上课时间、下课时间、登记时间的设置
      }
    },
    created () {
    }
  }
</script>
<style scoped>
</style>

