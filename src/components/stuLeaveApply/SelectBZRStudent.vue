<template>
  <div class="selectBZRStudent">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="selectContent">
      <div class="selectClass">
        <a>班级<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="true" height="-116" style="padding-top: 20px;">
          <div>
            <a v-for="(cl, cidx) in classList" :key="cidx" v-on:click.stop.prevent="getStuInforLst(cl.BJID,cidx)" :class="{ 'classbackgColor-link':cidx === isActiveClass }">{{cl.BJMC}}</a>
          </div>
        </scroller>
      </div>
      <div class="selectStudent">
        <a style="padding: 2px 0;">
          <!--姓名<span class="school-wx-icon" slot="icon" style="color:#666666;">&#xe638;</span>-->
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
        <scroller ref="scrollerLst" lock-x :scrollbar-y="true" height="-116" style="background-color: #f2f2f2;padding-top: 20px;">
          <div>
            <a v-for="(stu, stidx) in stuMembers" :key="stidx" v-on:click.stop.prevent="goLeaveApplyReg(stu.XH,stu.XM)">{{stu.XM}}({{stu.XH}})</a>
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
    name: "stuLeave-selectBzRStudent",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Scroller,
      Search
    },
    methods: {
      // 点击选择学生的事件
      resultClick (item) {
        // 点击姓名之后 跳转到请假申请登记页面，并把学生的信息保存在sessionstorage中 传参
        this.goLeaveApplyReg(item.xh, item.xm);
      },
      // 在input标签中输入文字是发生的事件
      getResult (val) {
        this.results = val ? this.getResults(val) : [];
      },
      // 查找输入的姓名事件
      getResults (val) {
        let rs = [];
        // 根据输入的职工号或姓名查找教师
        for (let i=0; i<this.stuMembers.length; i++) {
          if (this.stuMembers[i].XM.indexOf(val) !== -1 || this.stuMembers[i].XH.indexOf(val) !== -1) {
            rs.push({
              title: this.stuMembers[i].XM + '/' + this.stuMembers[i].XH,
              xh: this.stuMembers[i].XH,
              xm: this.stuMembers[i].XM,
              other: i
            });
          }
        }
        return rs
      },
      // 点击搜索中的取消事件
      onCancel () {
        // 删除搜索中的老师信息，回到登录者教师的信息
      },
      // input 获得焦点事件
      onFocus () {
        let rs = [];
        if (this.stuMembers.length !== 0) {
          for (let i = 0; i < this.stuMembers.length; i++) {
            rs.push({
              title: this.stuMembers[i].XM + "(" + this.stuMembers[i].XH + ")",
              xh: this.stuMembers[i].XH,
              xm: this.stuMembers[i].XM,
              other: i
            });
          }
        }
        this.results = rs;
      },
      // 获取班级信息
      async getClassLst () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassInforLst', id: this.QD.getLocalUserinfo().stuObj.ZGH});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.classList = d;
        if (this.classList.length > 0) {
          this.getStuInforLst(this.classList[0].BJID, 0); // 根据班级id获取学生成员
        }
      },
      // 获取学生成员信息
      async getStuInforLst (bjid, idx) {
        this.stuMembers.splice(0, this.stuMembers.length); //清空之前的学生成员
        this.isActiveClass = idx; // 班级背景颜色改变
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuInforLst', id: bjid});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        for (let i=0; i<d.length; i++){
          if (d[i].UType === 2){
            this.stuMembers.push(d[i]); //当UType === 2 时，代表是学生成员,当UType === 1 时，代表是教师成员
          }
        }
        this.$nextTick(() => {
          this.$refs.scrollerLst.reset({top: 0})
        })
      },
      goLeaveApplyReg (xh, xm){
        this.QD.otherPageData = null;
        this.QD.otherPageData = {XM: xm, XH: xh};
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1); // 点击姓名之后 跳转到请假申请登记页面，并把学生的信息保存在sessionstorage中 传参
        }
      }
    },
    created (){
      this.getClassLst();
    },
    data (){
      return {
        loading: false,
        backLoaded: true,
        classList: [], // 班级信息
        stuMembers: [], // 学生成员信息
        isActiveClass: 0, // 改变班级背景颜色
        results: [] // 搜索出现的学生姓名
      }
    }
  }
</script>
<style scoped>
  .selectBZRStudent{background-color: #ffffff;}
  /*清除浮动*/
  .selectBZRStudent .selectContent{
    overflow: hidden;
  }
  .selectBZRStudent .selectContent .selectClass .classbackgColor-link{
    color: #ffa500;
    background-color: #f2f2f2;
  }
  .selectBZRStudent .selectContent .selectClass{
    float: left;
    width:30%;
    background-color:#ffffff;
    border-right: 1px solid #f2f2f2;
  }
  .selectBZRStudent .selectContent .selectClass a{
    display: block;
    line-height: 1.41176471;
    text-align: center;
    padding:10px 15px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectBZRStudent .selectContent .selectStudent{
    float: left;
    width:68%;
    background-color:#ffffff;
    border-left: 1px solid #f2f2f2;
  }
  .selectBZRStudent .selectContent .selectStudent a{
    display: block;
    text-align: center;
    line-height: 1.41176471;
    padding:10px 15px;
    font-size: 16px;
    color: #666666;
    border-bottom: 1px solid #e5e5e5;
  }
</style>
<style>
 /* .selectBZRStudent .xs-container {
    margin-top: 0;
  }*/
  .selectBZRStudent .vux-search-fixed{
    position: relative!important;
    top: 0!important;
  }
  .selectBZRStudent .weui-cells.vux-search_show{
    height:100%;
  }
  /*搜索中的字的位置设置*/
  .selectBZRStudent .weui-search-bar__label{
    line-height: 22px;
  }
  /*搜索中出现字的位置设置*/
  .selectBZRStudent .selectContent .selectStudent .vux-search_show .weui-cell__bd{
    text-align: left;
  }
  .selectBZRStudent .selectContent .selectStudent .vux-search_show{
    background-color: #f2f2f2;
    width: 68%;
    top: 95px;
  }
</style>
