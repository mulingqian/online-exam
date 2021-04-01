<template>
  <div class="selectStuMoral">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="selectStuMoCont">
      <div class="gradeMo-left">
        <a>年级<span class="school-wx-icon" slot="icon" style="color:#333333;padding-right: 0;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="true" height="-116" style="padding-top: 20px;">
          <div>
            <a v-for="(grade, gidx) in gradeList" :key="gidx" v-on:click.stop.prevent="getClass(grade.NJID,gidx)" :class="{ 'gradebackgColor-link':gidx === isActiveGrade }">{{grade.NJMC}}</a>
          </div>
        </scroller>
      </div>
      <div class="classMo-midd">
        <a>班级<span class="school-wx-icon" slot="icon" style="color:#666666;padding-right: 0;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="true" height="-116" style="padding-top: 20px;">
          <div>
            <a v-for="(clas, cidx) in classList" :key="cidx" v-on:click.stop.prevent="getMEStuDetail(clas.BJID,cidx)" :class="{ 'classbackgColor-link':cidx === isActiveClass }">{{clas.BJMC}}</a>
          </div>
        </scroller>
      </div>
      <div class="nameMo-right">
        <a style="padding: 2px 0;">
          <!--姓名<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span>-->
          <span>
            <search
              placeholder="搜索学生"
              @on-result-click="resultClick"
              @on-change="getResult"
              @on-cancel="onCancel"
              :results="results"
              position="absolute"
              auto-scroll-to-top top="46px"
              @on-focus="onFocus"
            ></search>
          </span>
        </a>
        <scroller lock-x :scrollbar-y="true" height="-140" style="background-color: #f2f2f2;padding: 20px;" ref="scrollerLst">
          <div>
            <a v-for="(stu, stidx) in mEStuDetail" :key="stidx" v-on:click.stop.prevent="nameBackgColor(stidx)" :class="{ 'namebackgColor-link':stidx === isActiveName }">{{stu.XM}}({{stu.XH}})</a>
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import Search from 'vux/src/components/search/index.vue'
  export default {
    name: "selectStudentMoral",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Scroller,
      Search
    },
    methods: {
      // 点击选择搜索出来学生的事件
      resultClick (item) {
        if (this.$route.query.page === 'fieldSingleSStu') {
          // FieldSingleSStu.vue 组件
          let sName = item.xm;
          let stuID = item.stuId;
          sessionStorage.setItem("selectSingleStuNameLst_fieldSingleSStu", sName);
          sessionStorage.setItem("selectSingleStuIdLst_fieldSingleSStu", stuID);
          this.$router.replace({ path: '/userDefinded/officeTwo' });
        } else {
          // 点击姓名之后 跳转到请假申请登记页面，并把学生的信息保存在sessionstorage中 传参
          // 是否进入选择学生页面了选择学生了
          let isSelectStu = "true";
          sessionStorage.setItem("isSelectStuForME", isSelectStu);
          let sName = item.xm;
          let stuID = item.stuId;
          let selectStuMEList = JSON.stringify([{'name': sName, 'stuId': stuID, 'XH': item.other.XH}]);
          sessionStorage.setItem("selectStuMEList", selectStuMEList);
          if (this.backLoaded) { // 点击姓名之后 跳转到德育登记页面，并把学生的信息保存在sessionstorage中 传参
            this.backLoaded = false;
            this.$router.go(-1);
          }
        }
      },
      // 在input标签中输入文字是发生的事件
      getResult (val) {
        this.results = val ? this.getResults(val) : [];
      },
      // 查找输入的姓名事件
      getResults (val) {
        let rs = [];
        // 根据输入的职工号或姓名查找教师
        for (let i=0; i<this.mEStuDetail.length; i++) {
          if (this.mEStuDetail[i].XM.indexOf(val) !== -1 || this.mEStuDetail[i].XH.indexOf(val) !== -1) {
            rs.push({
              title: this.mEStuDetail[i].XM + '/' + this.mEStuDetail[i].XH,
              stuId: this.mEStuDetail[i].StuId,
              xm: this.mEStuDetail[i].XM,
              other: this.mEStuDetail[i]
            });
          }
        }
        return rs
      },
      // 点击搜索中的取消事件
      onCancel () {
        // 删除搜索中的老师信息，回到登录者教师的信息
        /*console.log("取消");*/
      },
      // input 获得焦点事件
      onFocus () {
        let rs = [];
        if (this.mEStuDetail.length !== 0) {
          for (let i = 0; i < this.mEStuDetail.length; i++) {
            rs.push({
              title: this.mEStuDetail[i].XM + "(" + this.mEStuDetail[i].XH + ")",
              stuId: this.mEStuDetail[i].StuId,
              xm: this.mEStuDetail[i].XM,
              other: this.mEStuDetail[i]
            });
          }
        }
        this.results = rs;
      },
        // 点击姓名，改变其背景颜色
      nameBackgColor(nameid) {
        this.isActiveName = nameid;
        if (this.$route.query.page === 'fieldSingleSStu') {
            // FieldSingleSStu.vue 组件
          let sName = this.mEStuDetail[this.isActiveName].XM;
          let stuID = this.mEStuDetail[this.isActiveName].StuId;
          sessionStorage.setItem("selectSingleStuNameLst_fieldSingleSStu", sName);
          sessionStorage.setItem("selectSingleStuIdLst_fieldSingleSStu", stuID);
          this.$router.replace({ path: '/userDefinded/officeTwo' });
        } else {
          // 并传值到 德育登记页面
          let sName = this.mEStuDetail[this.isActiveName].XM;
          let stuID = this.mEStuDetail[this.isActiveName].StuId;
          let xh = this.mEStuDetail[this.isActiveName].XH;
          let selectStuMEList = JSON.stringify([{'name': sName, 'stuId': stuID, 'XH': xh}]);
          // 是否进入选择学生页面了选择学生了
          let isSelectStu = "true";
          sessionStorage.setItem("isSelectStuForME", isSelectStu);
          sessionStorage.setItem("selectStuMEList", selectStuMEList);
          if (this.backLoaded) {  // 点击姓名之后 跳转到德育登记页面，并把学生的信息保存在sessionstorage中 传参
            this.backLoaded = false;
            this.$router.go(-1);
          }
        }
      },
        // 获取年级信息2015级2016级
      async getGrade() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuGrade'});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.gradeList = d;
        if (this.gradeList.length > 0) {
          this.getClass(this.gradeList[0].NJID, 0);
        }
      },
      // 根据专业id 和班级id 获取班级信息,0全部专业,0全部班级
      async getClass(njId, gindex) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuClass', ZYID: 0, NJID: njId});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.classList = d;
        this.isActiveGrade = gindex; // 年级背景颜色改变
        if (this.classList.length > 0) {
          this.getMEStuDetail(d[0].BJID, 0);
        }
      },
      // 根据班级id获取学生详细信息
      async getMEStuDetail(bjid, classid) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuDetailByBJID', BJID: bjid});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.mEStuDetail = d;
        this.isActiveClass = classid; // 班级背景颜色改变
        this.$nextTick(() => {
          this.$refs.scrollerLst.reset({top: 0})
        })
        // this.onFocus(); // input 获得焦点事件
      }
    },
    created (){
      this.getGrade();
    },
    data (){
      return {
        loading: false,
        backLoaded: true,
        isActiveGrade: 0, // 改变年级背景颜色
        isActiveClass: 0, // 改变班级背景颜色
        isActiveName: '', // 改变姓名背景颜色，开始不默认有颜色，只有等选择之后才会有颜色
        gradeList: [], // 年级信息
        classList: [], // 班级信息
        mEStuDetail: [], // 学生详细信息
        results: [] // 搜索出现的学生姓名
      }
    }
  }
</script>
<style scoped>
  .selectStuMoral{background-color: #ffffff;}
  /* 清除浮动*/
  .selectStuMoral .selectStuMoCont{
    overflow: hidden;
  }
  .selectStuMoral .gradeMo-left{
    float: left;
    width:25%;
    background-color:#ffffff;
    border-right: 1px solid #f2f2f2;
  }
  .selectStuMoral .gradeMo-left a{
    display: block;
    line-height: 1.41176471;
    text-align: center;
    padding:10px 2px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectStuMoral .gradeMo-left .gradebackgColor-link{
    color: #ffa500;
    background-color: #f2f2f2;
  }
  .selectStuMoral .classMo-midd .classbackgColor-link{
    color: #ffa500;
    background-color: #f2f2f2;
  }
  .selectStuMoral .nameMo-right .namebackgColor-link{
    color: #ffa500;
    background-color: #f2f2f2;
  }
  .selectStuMoral .classMo-midd{
    float: left;
    width:25%;
    background-color:#ffffff;
    border-left: 1px solid #f2f2f2;
  }
  .selectStuMoral .classMo-midd a{
    display: block;
    text-align: center;
    line-height: 1.41176471;
    padding:10px 2px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectStuMoral .nameMo-right{
    float: left;
    width:48%;
    background-color:#ffffff;
    border-left: 1px solid #f2f2f2;
  }
  .selectStuMoral .nameMo-right a{
    display: block;
    text-align: center;
    line-height: 1.41176471;
    padding:10px 0;
    font-size: 16px;
    color: #999999;
    border-bottom: 1px solid #e5e5e5;
    word-wrap: break-word; /*强制换行*/
  }
</style>
<style>
  /*.selectStuMoral .xs-container {
    margin-top: 0;
  }*/
  .selectStuMoral .vux-search-fixed{
    position: relative!important;
    top: 0!important;
  }
  .selectStuMoral .vux-search-fixed .weui-search-bar__box{
    padding-right: 4px;
  }
  .selectStuMoral .weui-cells.vux-search_show{
    height:100%;
  }
  /*搜索中的字的位置设置*/
  .selectStuMoral .weui-search-bar__label{
    line-height: 22px;
  }
  /*搜索中出现字的位置设置*/
  .selectStuMoral .selectStuMoCont .nameMo-right .vux-search_show .weui-cell__bd{
    text-align: left;
    overflow: hidden;
    word-wrap: break-word;
  }
  .selectStuMoral .selectStuMoCont .nameMo-right .vux-search_show{
    background-color: #f2f2f2;
    width: 48%;
    top: 95px;
  }
</style>
