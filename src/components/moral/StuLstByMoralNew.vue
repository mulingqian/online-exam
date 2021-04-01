<template>
  <div class="moral-stulst-bj fwrapper">
    <div v-if="parentData" class="top-title">
      <span class="claName">{{parentData.selectBjData.bjmc}}</span>
      <span class="xqName">{{parentData.selectXqName}}</span>
    </div>
    <div id="stuLstByMoral" class="menu-container">
      <van-search
        v-if="showSearch"
        v-model="searchVal"
        shape="round"
        placeholder="请输入姓名/学号"
        @focus="getFocus"
        @blur="blurSearch"
        class="serch-box"
      >
        <template #action>
          <div @click="searchCancelEvent">取消</div>
        </template>
      </van-search>

      <!--tab 标签 start-->
      <div class="stu-content" :class="showSearch? 'show-search-style': 'no-show-search-style'">
        <van-tabs v-model="tabType" sticky :animated="true">
          <van-tab title="已填">
            <stu-lst v-for="(item, rIdx) in finishWriteLst" :key="rIdx" :item="item" :isLink="showSearch" @click.native="item.write || showSearch ? goStuWritePg(item) : null"></stu-lst>
            <van-empty v-if="finishWriteLst.length <=0 " description="您还没有已填写的数据哦" />
          </van-tab>

          <van-tab title="未填">
            <stu-lst v-for="(item, rIdx) in awaitWriteLst" :key="rIdx" :item="item" :isLink="showSearch" @click.native="item.write || showSearch ? goStuWritePg(item) : null"></stu-lst>
            <van-empty v-if="awaitWriteLst.length <=0 " description="没有待填写的数据啦" />
          </van-tab>

        </van-tabs>
      </div>
      <!--tab 标签 end-->
    </div>
  </div>
</template>
<script>
  import { Empty, Search, Tab, Tabs } from 'vant'
  import StuLst from './components/StuLst.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'stuLstByMoral_keepAlive',
    directives: {
    },
    components: {
      [Empty.name]: Empty,
      [Search.name]: Search,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      StuLst
    },
    data() {
      return {
        loaded: true,
        tabType: 0, // 当前激活 tab 类型
        onlyQuery: '', // 管理员只能查看学生的品德评语
        showSearch: '', // 判断是否显示搜索框
        searchVal: '', // 搜索值
        searchLst: [], // 搜索出来的值
        parentData: null, // 父级信息
        stuLst: [], // 学生信息
        allStuLst: null, // 学生信息
        writeStuInfo: null, // 要登记学生的信息
        awaitWriteLst: [], // 未填学生列表
        finishWriteLst: [] // 已填学生列表
      }
    },
    created () {
      this.onlyQuery = this.$route.query.onlyQuery ? this.$route.query.onlyQuery: false // 管理员只能查看学生的品德评语
      this.showSearch = JSON.parse(this.$route.query.showSearch)// 判断是否显示搜索框
      // this.getParentPageData() // 得到父级的信息
    },

    activated () {
      console.log('%c home activated', 'color:blue', this.$route.meta)
      // 是从 home 进入请求数据或者菜单从一个地址跳转到另一个地址时，需要重新请求接口，获得数据
      if (this.$route.meta.isReflesh) {
        // 判断我的应用-是否有编辑过，若没有编辑过，我的应用数据从上一个页面得到
        this.getParentPageData(); // // 得到父级页面传过来的数据
      }
      this.getParentPageData(); // // 得到父级页面传过来的数据
      this.$route.meta.isReflesh = false; // 不是从 home 进入
      this.setPgScrollTop(); // 设置页面滚动的高度
    },
    // 因为当钩子执行前，组件实例还没被创建
    beforeRouteEnter (to, from, next) {
      console.log('beforeRouteEnter');
      if (from.name === 'stuWriteDetail') {
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
        let ct = document.querySelector('#stuLstByMoral');
        console.log('scrollTop', ct, ct.scrollTop);
        let st = {scrollTop: ct.scrollTop, page: 'stuLstByMoral'}
        this.updateScrrollPage(st); // 记录滚动的高度
        next();
      } else {
        let st = {scrollTop: 0, page: 'stuLstByMoral'}
        this.updateScrrollPage(st); // 重置滚动的高度
        next();
      }
    },
    computed: {
      ...mapState({
        scrollTopVuxLst: state => state.vux.scrrollPage // 滚动的高度
      })
    },
    methods: {
      ...mapActions([
        'updateScrrollPage', // 滚动位置
        'updateLoadingStatus'
      ]),
      // 设置页面滚动的高度
      setPgScrollTop () {
        console.log('设置页面滚动的高度', this.scrollTopVuxLst)
        for (let i=0; i< this.scrollTopVuxLst.length; i++){
          if (this.scrollTopVuxLst[i].page === 'stuLstByMoral'){
            this.scrollTop = this.scrollTopVuxLst[i].scroll ? this.scrollTopVuxLst[i].scroll : 0;
            break
          }
        }
        let content = document.querySelector('#stuLstByMoral');
        content.scrollTop = this.scrollTop; // 将记录的滚动高度再次渲染到页面上
      },
      // 搜索框失去焦点筛选满足条件的数据
      blurSearch() {
        console.log('$$$$$$$$$$$$$$$$$$', this.searchVal)
        let searchLst=[]
        let searchLstXh=[]
        this.stuLst.forEach(item => {
          if (item.xm.indexOf(this.searchVal) !== -1 || item.xh.indexOf(this.searchVal) !== -1) {
            if (searchLstXh.indexOf(item.xh) === -1){
              searchLst.push(item)
              searchLstXh.push(item.xh)
            }
          }
        })
        this.stuLst = searchLst
        this.judegIsWrite();
      },
      // 搜索框得到焦点
      getFocus() {
        this.stuLst = this.allStuLst
      },
      // 到学生详情页面
      goStuWritePg (stu) {
        this.parentData.selectTab = this.tabType
        console.log(stu, '到学生详情页面', this.tabType)
        stu.onlyQuery = this.onlyQuery
        stu.pyType = parseInt(this.$route.query.pyType)
        stu.selectXqName = this.parentData.selectXqName
        if (this.parentData.pyType === '2'){
          stu.xn = this.parentData.selectXndInfo[0]
        }
//        this.writeStuInfo = stu;
        this.QD.brotherPageData = stu
        this.$router.push({path: '/stuWriteDetail'})
      },
      // 得到父级的信息
      getParentPageData() {
        if (this.QD.parentPageData) {
          this.parentData = this.QD.parentPageData;
          this.tabType = this.parentData.selectTab;
          if (this.QD.parentPageData.allStuLst){
            this.loaded = false;
            this.stuLst = this.QD.parentPageData.allStuLst
            this.allStuLst = this.QD.parentPageData.allStuLst
            this.judegIsWrite();
          } else {
            this.getBjData() // 得到班级内的所有学生信息
          }
        } else {
          this.$router.go(-1)
        }
      },
      // 分类已填还是未填
      judegIsWrite() {
        this.finishWriteLst=[]
        this.awaitWriteLst=[]
        this.stuLst.forEach(item => {
          if (item.write){
            this.finishWriteLst.push(item)
          } else {
            this.awaitWriteLst.push(item)
          }
        })
        console.log(this.awaitWriteLst, this.finishWriteLst)
      },
      // 得到班级内的所有学生信息
      async getBjData () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuMoralCommentList',
          classId: parseInt(this.$route.query.classId),
          moralType: parseInt(this.$route.query.pyType),
          xn: parseInt(this.$route.query.xn)
        });
        this.updateLoadingStatus(false);
        this.loaded = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          return []
        }
        console.log("%c stu => ", 'color: red', d)
        this.stuLst = d.data
        this.allStuLst = d.data
        this.QD.parentPageData.allStuLst = d.data
        this.judegIsWrite(); // 判断未填还是已填
      }
    }
  }
</script>
<style lang="less">
  .moral-stulst-bj .stu-box .weui-cells:before{
    border-top: 0;
  }
  .moral-stulst-bj{
    .van-tab--active{
      color: @tea-theme-color;
      font-weight: 500;
    }
    .van-tabs__line{
      background: @tea-theme-color;
    }
    .van-sticky--fixed {
      top: 46px;
    }
  }
</style>
<style scoped lang="less">
  /*头部标题 .vux-tap-active start*/
 .moral-stulst-bj{
    position: static;
    overflow-y: auto;
  }

  /* 确保有滚动条，可以滑动*/
  .menu-container{
    position: absolute;
    top: 0px;
    bottom: 0;
    width: 100%;
    overflow-y: scroll;
  }
  .top-title{
    position:fixed;
    top: 0px;
    z-index: 1;
    width:100%;
    height:46px;
    line-height: 46px;
    color:#fff;
    padding:0 16px;
    background: @tea-theme-color;
    >span{
      display: inline-block;
      width:50%;
    }
    .claName{
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .xqName{
      float: right;
      position: relative;
      right:32px;
      font-size: 14px;
      text-align: right;
    }
  }
  /*头部标题 end*/
  .serch-box{
    margin-top:46px;
    padding:20px 16px;
  }
  .stu-content{
    .stu-box{
      position: relative;
    }
  }
  .show-search-style {
    margin-top:-20px;
  }
  .no-show-search-style{
    margin-top: 46px;
  }
</style>

