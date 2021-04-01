<!--班级列表-->
<template>
  <div class="search-page" :class="searchObj? 'searchResult': ''">
    <div id="searchResult" class="menu-container">
      <van-search
        :autofocus="true"
        :clearable="true"
        v-model="searchVal"
        shape="round"
        show-action
        placeholder="请输入姓名/班级"
        @blur="blurSearch"
        ref="inputs"
        class="search-box"
      >
        <template #action>
          <div @click="searchCancelEvent">取消</div>
        </template>
      </van-search>

      <!--搜索历史 start-->
      <div class="history" v-if="!searchObj">
        <p class="history-title">
          <span class="title">搜索历史</span>
          <span class="school-wx-icon del-icon" @click="delHistory">&#xe68d;</span>
        </p>
        <div class="contain" v-if="histLst.length > 0">
          <span v-for="(item, idx) in histLst" :key="idx" @click="getSearchVal(item)">{{item}}</span>
        </div>
        <van-empty description="历史为空" v-if="histLst.length == 0"/>
      </div>
      <!--搜索历史 end-->

      <div v-if="searchObj">
        <!--搜索结果 班级 start-->
        <class-lst :lst="searchObj.clazz" v-if="searchObj.clazz.length > 0" @go-detail="goStuLst"></class-lst>
        <!--搜索结果 班级 end-->

        <!--搜索结果 学生 start-->
        <stu-lst :lst="searchObj.student" v-else-if="searchObj.student.length > 0" @go-stu-detail="goStuDetail"></stu-lst>
        <!--搜索结果 学生 end-->

        <van-empty description="搜索结果为空" v-else/>
      </div>
    </div>
  </div>
</template>
<script>
  import { Group, Cell } from 'vux'
  import { Search, Empty } from 'vant'
  import { mapState, mapActions } from 'vuex'
  import classLst from './components/ClassLst.vue'
  import stuLst from './components/StuLst.vue'
  export default {
    name: 'searchPage_keepAlive',
    components: {
      [Search.name]: Search,
      [Empty.name]: Empty,
      Group,
      Cell,
      classLst,
      stuLst
    },
    activated () {
      console.log('%c home activated', 'color:blue', this.$route.meta)
      // 是从 home 进入请求数据或者菜单从一个地址跳转到另一个地址时，需要重新请求接口，获得数据
      if (this.$route.meta.isReflesh) {
        // 判断我的应用-是否有编辑过，若没有编辑过，我的应用数据从上一个页面得到
        //this.getCurrPgData(); // // 得到父级页面传过来的数据
      }
      this.$route.meta.isReflesh = false; // 不是从 home 进入
      this.setPgScrollTop(); // 设置页面滚动的高度
    },
    // 因为当钩子执行前，组件实例还没被创建
    beforeRouteEnter (to, from, next) {
      console.log('beforeRouteEnter');
      if (from.name === 'home') {
        to.meta.isReflesh = true; // 是从 home 进入
        next();
      } else {
        next();
      }
    },
    // beforeRouteLeave(to, from, next)：离开路由之前执行的函数,可用于页面的反向传值，页面跳转。
    beforeRouteLeave(to, from, next) {
      console.log('beforeRouteLeave', from.name, to.name);
      // 记录滚动的高度
      if (to.name !== 'home') {
        let ct = document.querySelector('#searchResult');
        console.log('scrollTop', ct, ct.scrollTop);
        let st = {scrollTop: ct.scrollTop, page: 'searchPage'}
        this.updateScrrollPage(st); // 记录滚动的高度
        next();
      } else {
        let st = {scrollTop: 0, page: 'searchPage'}
        this.updateScrrollPage(st); // 重置滚动的高度
        next();
      }
    },
    data() {
      return {
        parentInfo: null, // 父级数据
        searchVal: '', // 搜索出来的值
        searchObj: null, // 搜索结果{clazz, student}
        histLst: [] // 搜索历史
      }
    },
    created() {
      if (this.QD.parentPageData){
        this.parentInfo = this.QD.parentPageData
        this.searchVal = this.parentInfo.searchVal
        this.searchObj = this.parentInfo.searchObj
      } else {
        window.history.go(-1)
      }
      if (sessionStorage.getItem('morSearchHistoryLst')) {
        this.histLst = JSON.parse(sessionStorage.getItem('morSearchHistoryLst'))
      }
    },
    computed: {
      ...mapState({
        scrollTopVuxLst: state => state.vux.scrrollPage // 滚动的高度
      })
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus',
        'updateScrrollPage' // 滚动位置
      ]),
      // 设置页面滚动的高度
      setPgScrollTop () {
        console.log('设置页面滚动的高度', this.scrollTopVuxLst)
        for (let i=0; i< this.scrollTopVuxLst.length; i++){
          if (this.scrollTopVuxLst[i].page === 'searchPage'){
            this.scrollTop = this.scrollTopVuxLst[i].scroll ? this.scrollTopVuxLst[i].scroll : 0;
            break
          }
        }
        let content = document.querySelector('#searchResult');
        content.scrollTop = this.scrollTop; // 将记录的滚动高度再次渲染到页面上
      },
      // 搜索框失去焦点
      blurSearch() {
        if (this.histLst.indexOf(this.searchVal) === -1 && this.searchVal.trim() !== '') {
          this.histLst.unshift(this.searchVal)
        }
        sessionStorage.setItem('morSearchHistoryLst', JSON.stringify(this.histLst))
        this.searchEvent()
      },
      // 搜索事件取消
      searchCancelEvent() {
        this.searchVal = ''; // 搜索框值清空
        this.searchObj = null; // 搜索结果清空
      },
      // 点击搜索历史值
      getSearchVal(val) {
        this.searchVal = val;
        this.searchEvent()
      },
      // 清除历史
      delHistory() {
        this.histLst=[]
      },
      // 跳转到学生列表页面
      goStuLst(selectCla, tabIdx) {
        this.parentInfo.selectBjData= selectCla
        this.parentInfo.selectTab= tabIdx
        this.parentInfo.searchVal= this.searchVal
        this.parentInfo.searchObj = this.searchObj
        this.QD.parentPageData=this.parentInfo
        this.$router.push({
          path: '/stuLstByMoralNew',
          query: {
            classId: selectCla.bjid,
            pyType: this.parentInfo.pyType,
            xn: this.parentInfo.currXQOrXnId,
            onlyQuery: true,
            showSearch: false
          }
        })
      },
      // 跳转到学生详细页面
      goStuDetail(stu) {
        stu.onlyQuery = true
        stu.pyType= this.parentInfo.pyType
        let parentInfo = this.parentInfo
        parentInfo.searchVal = this.searchVal
        parentInfo.searchObj = this.searchObj
        this.QD.parentPageData= parentInfo
        this.QD.brotherPageData = stu
        this.$router.push('/stuWriteDetail')
      },
      // 搜索事件
      async searchEvent() {
        if (!this.searchVal) { // 没有查询条件
          return
        }
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetSearchClassOrStuDataV2',
          moralType: this.parentInfo.pyType * 1,
          xn: this.parentInfo.currXQOrXnId * 1,
          keyword: this.searchVal
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log(d.msg);
        }
        console.log('%c search=>', 'color:red', d)
        this.searchObj = d.data
      }
    }
  }
</script>
<style scoped lang="less">
  .search-page{
    position: static;
    overflow-y: auto;
  }
  /* 确保有滚动条，可以滑动*/
  .menu-container{
    position: absolute;
    top: 46px;
    bottom: 0;
    width: 100%;
    overflow-y: scroll;
  }
  .searchResult{
    background: #f5f5f5;
  }
  .search-box{
    padding:20px 16px 24px;
  }
  /*搜索历史 start*/
  .history{
    padding:0 16px;
    .history-title{
      .title{
        font-weight: bold;
        color:@color4;
      }
      .del-icon{
        float:right;
        padding-right: 0;
        color: #333;
      }
    }
    .contain{
      margin-top:22px;
      >span{
        display: inline-block;
        font-size: 14px;
        color:#656666;
        background:#F2F5F5;
        margin:0 12px 12px 0;
        border-radius:14px;
        padding: 8px 12px;
      }
    }
  }
  /*搜索历史 end*/
</style>
