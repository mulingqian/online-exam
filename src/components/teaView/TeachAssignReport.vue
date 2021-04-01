<template>
  <div class="eachPgBase">
    <div :class="`eachPgBase container ${fixTop ? 'theadFixTop': ''}`" id="teachAssignReport">
      <group class="gp-popup" gutter="0">
        <popup-picker :title="'授课学期'" :columns="1" :show-name="true" v-model="selectXqInfo" :data="xqLst" @on-change="changeXqInfo"></popup-picker>
      </group>
      <div class="content-box">
        <div class="notice-words" ref="noticeWordsBox">
          <p class="teaXM">{{userinfo.stuObj.XM}}老师：</p>
          <p class="desc" v-if="noticeWords">{{noticeWords}}</p>
        </div>
        <x-table class="table-container">
          <thead>
          <tr>
            <th>班级</th>
            <th>课程</th>
            <th>教学大纲编号</th>
            <th>是否考试科目</th>
            <th>本课程总学时</th>
            <th>已完成学时</th>
            <th>本学期应完成学时</th>
            <th>周课时</th>
            <th>任课起止时间</th>
            <th>备注</th>
          </tr>
          </thead>
        </x-table>
        <x-table class="table-container info-table-box">
          <tbody>
          <tr :class="`${sIdx % 2 === 0 ? 'tr-even' : 'tr-odd'}`" v-for="(s, sIdx) in lst" :key="sIdx">
            <td>{{s.bjmc}}</td> <!--班级-->
            <td>{{s.kcmc}}</td> <!--课程-->
            <td>{{s.jxdgbh}}</td> <!--教学大纲编号-->
            <td>{{s.sfkskm}}</td><!--是否考试科目-->
            <td>{{s.totalNode}}</td><!--本课程总学时-->
            <td>{{s.doneNode}}</td><!--已完成学时-->
            <td>{{s.bxqDoneNode}}</td><!--本学期应完成学时-->
            <td>{{s.weekNode}}</td><!--周课时-->
            <td>{{s.rkqzsj}}</td><!--任课起止时间-->
            <td>{{s.remark}}</td><!--备注-->
          </tr>
          </tbody>
        </x-table>

      </div>
    </div>
  </div>
</template>
<script>
  import Group from 'vux/src/components/group/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import XTable from 'vux/src/components/x-table/index.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: "teaView-teachAssignReport",
    directives: {},
    components: {
      XTable,
      PopupPicker,
      Group
    },
    data () {
      return {
        loaded: true,
        selectXqInfo: [], // 学期信息
        noticeWords: '', // 表头语
        lst: [], // 当前教师的 ‘教学任务书’数据
        xqLst: [], // 渲染到页面的可选学期数据
        fixTop: false, // 表格头标题不固定顶部
        noticeHeight: 0 // 表头语的高度
      }
    },
    created () {
      console.log(this.userinfo);
      this.getXqInfo(); // 获取学期信息数据
    },
    mounted () {
      this.setScrollFixTop(); // 表格的头部吸顶
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 表格的头部吸顶
      setScrollFixTop () {
        let box=document.querySelector("#teachAssignReport");
        // 监听这个dom的scroll事件
        box.addEventListener('scroll', () => {
          console.log("mmmm", box.scrollTop, this.noticeHeight);
          if (box.scrollTop >= this.noticeHeight) {
            this.fixTop = true;
          } else {
            this.fixTop = false;
          }
          console.log('aaaaaaa', this.fixTop);
        }, false);
      },
      // 改变学期
      changeXqInfo (val) {
        console.log("val", val);
        this.getReportData(); // 根据学期id得到教学任务书的数据
      },
      // 获取学期信息
      async getXqInfo() {
        let xqList = await this.QD.getSmstLst();
        this.QD.xqList = xqList;
        this.QD.currentXQ = xqList.find((n) => n.CurrentXQ === true);
        let currXQ = this.QD.currentXQ;
        if (!this.QD.currentXQ && this.QD.xqList.length > 0) {
          currXQ = this.QD.xqList[0];
        }
        console.log("currXQ is", currXQ);
        // selectXqInfo
        this.selectXqInfo = [currXQ.XQID + ''];
        this.dealXqData(); // 处理学期数据
        // this.getReportData(); // 根据学期id得到教学任务书的数据
      },
      // 处理学期数据
      dealXqData () {
        for (let i=0; i<this.QD.xqList.length; i++) {
          let si = this.QD.xqList[i];
          this.xqLst.push({name: si.XQMC, value: si.XQID + '', parent: 0});
        }
        console.log('xq', this.xqLst);
      },
      // 根据学期id得到教学任务书的数据-pc端的表单类别为授课任务通知书3 GetTeachTaskNoticeThreeReport
      async getReportData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetTeachTaskNoticeThreeReport', semId: parseInt(this.selectXqInfo)});
        this.updateLoadingStatus(false);
        this.loaded = false;
        console.log("report info", d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败`);
          return;
        }
        let data = d.data;
        this.noticeWords = data.noticeWords;
        this.lst = data.lst;
        this.noticeHeight = this.$refs.noticeWordsBox.offsetHeight; // 表头语的高度
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
  .theadFixTop .table-container thead{
    position: fixed;
    top: 88px;
    z-index: 5;
  }
  .gp-popup{
    position: fixed;
    top: 44px;
    width: 100%;
    z-index: 5;
    background-color: #ffffff;
  }
  .container{
    position: relative;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }
  .gp-popup{
  }
  .content-box{
    position: relative;
    top: 44px;
    width: 100%;
    height: 100%;
    background-color: #f5f5f9;
  }
  .notice-words{
    padding: 10px 15px;
    background-color: #ffffff;
  }
  .notice-words>p{
    font-size: 16px;
    line-height: 1.5;
  }
  .notice-words .teaXM{
    color: #000;
  }
  .notice-words .desc{
    color: #333333;
    text-indent: 32px;
  }
  .info-table-box{
    margin-bottom: 80px;
  }
  .table-container tr > th,
  .table-container tr > td{
    width: 10%;
    padding: 2px;
    font-size: 12px;
    color: #333333;
    line-height: 20px;
    -ms-word-break: break-all;
    word-break: break-all;
  }
  .table-container tr > th{
    background-color: #DFE4EB;
  }
  .table-container tr > td{
  }
  /*Odd 和 even 是可用于匹配下标是奇数或偶数的子元素的关键词*/
  .table-container .tr-odd{
    background-color: #f3f6f8;
  }
  .table-container .tr-even{
    background-color: #ffffff;
  }
</style>

