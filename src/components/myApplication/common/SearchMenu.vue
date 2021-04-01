<template>
  <div class="search-menu-field">
    <div class="header-box">
      <div class="left-arrow" @click="goBack"></div>
      <div class="header-title">
        <div class="search-box">
          <input class="input-box" type="text" placeholder="搜索应用" v-model="menuTitle"/>
          <span class="school-wx-icon iconsousou">&#xe66f;</span>
          <span v-if="menuTitle" class="school-wx-icon delete-icon" @click="deleteSearchEvent">&#xe7be;</span>
        </div>
      </div>
      <a class="btn search-btn" v-if="resultMenuLst.length === 0 && menuTitle" @click="goBack">取消</a>
      <a class="btn search-btn" v-else="" @click="searchResultMenu">搜索</a>
    </div>
    <oa-menu-data v-if="userinfo.usertype === 2" @get-oaMenu="getOaMenu"></oa-menu-data>
    <div class="result-field">
      <group v-if="resultMenuLst.length > 0" class="gp">
        <cell :is-link="true" v-for="(item, idx) in resultMenuLst" :key="idx" @click.native="onItemClick(item)">
          <div slot="icon" class="icon-box">
            <!--<svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#iconyongzhangshenqing-copy"></use>
            </svg>-->
            <span class="school-wx-icon igrid-block-icon" :style="{ color: item.iconColor }" slot="icon" v-html="item.iconContent"></span>
          </div>
          <div slot="after-title" class="cell-title">
            <span>{{item.title}}</span>
          </div>
        </cell>
      </group>
      <!-- 搜索结果是空 start -->
      <div class="no-result" v-if="resultMenuLst.length === 0 && menuTitle">
        <img src="../../../assets/images/search_no.jpg" />
        <p class="desc">暂无搜索结果</p>
      </div>
      <!-- 搜索结果是空 end -->
      <!-- 显示历史搜索结果 start -->
      <div class="history-box" v-if="!menuTitle">
        <p class="head-title">搜索历史</p>
        <div class="title-box" v-if="searchHistoryLst.length > 0">
          <span class="title-text" v-for="(title, hIdx) in searchHistoryLst" :key="hIdx" @click="clickHistoryTitle(title)">{{title}}</span>
        </div>
        <div class="no-history" v-if="searchHistoryLst.length === 0">
          <p class="desc">暂无搜索历史</p>
        </div>
      </div>
      <!-- 显示历史搜索结果 end -->
    </div>
  </div>
</template>
<script>
  import oaMenuData from './OaMenuData.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'searchMenu',
    directives: {},
    components: {
      oaMenuData,
      Cell,
      Group
    },
    created () {
      this.getParentPgData();  // 得到首页中的数据
    },
    mounted () {
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    data () {
      return {
        backLoaded: true,
        menuTitle: '', // 应用名称，输入框中用户输入的值
        initAllMenuLst: [], // 微信数据库中所有显示的菜单
        officeMenuLst: [], // 我的办公
        newlyUseMenuLst: [], // 最近使用
        resultMenuLst: [], // 搜索结果的菜单
        searchHistoryLst: [] // 搜索历史记录
      }
    },
    watch: {
      menuTitle () { // 应用名称，输入框中用户输入的值
        this.searchResultMenu(); // 根据输入的应用名称，查找到相应的应用
      }
    },
    methods: {
      // 返回事件
      goBack () {
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 删除搜索结果
      deleteSearchEvent () {
        this.menuTitle = ''
      },
      // 设置搜索值为选中的菜单标题
      setMenuTitleVal (title) {
        this.menuTitle = title
      },
      // 点击历史记录
      clickHistoryTitle (title) {
        this.setMenuTitleVal(title); // 设置搜索值为选中的菜单标题
      },
      // 到对应的菜单页面
      onItemClick (item) {
        this.setMenuTitleVal(item.title); // 设置搜索值为选中的菜单标题
        this.setNewlyUseMenuLst(item); // 最近使用菜单变化处理,点击菜单
        this.saveNewlyUseMenuEvent(); // '最近菜单' 存入缓存中
        this.setSearchHistoryData(); // 设置搜索历史记录, 最多10 条记录。
        this.saveSearchHistoryData(); // 搜索历史存入缓存中
        this.QD.go(item.url, this.$router);
      },
      // 最近使用菜单变化处理,点击菜单
      setNewlyUseMenuLst (item) {
        // “最近使用”中是否存在 点击的菜单，存在移除数组数据
        for (let i=0; i<this.newlyUseMenuLst.length; i++) {
          if (this.newlyUseMenuLst[i].cid === item.cid) {
            this.newlyUseMenuLst.splice(i, 1);
            break;
          }
        }
        this.newlyUseMenuLst.splice(0, 0, item);// 点击的菜单 加入 '最近使用' 数组数据
        // 确保“最近使用”中的模块为10个
        if (this.newlyUseMenuLst.length > 10) {
          this.newlyUseMenuLst.splice(10, this.newlyUseMenuLst.length - 10);
        }
      },
      // 设置搜索历史记录, 最多10 条记录。
      setSearchHistoryData () {
        for (let i=0; i<this.searchHistoryLst.length; i++ ) {
          let si = this.searchHistoryLst[i];
          if (si === this.menuTitle) {
            this.searchHistoryLst.splice(i, 1);
            break;
          }
        }
        this.searchHistoryLst.splice(0, 0, this.menuTitle);// 点击的菜单 加入 '最近使用' 数组数据
        // 确保“最近使用”中的模块为10个
        if (this.searchHistoryLst.length > 10) {
          this.searchHistoryLst.splice(10, this.searchHistoryLst.length - 10);
        }
      },
      // 搜索历史存入缓存中
      saveSearchHistoryData () {
        let strArr = JSON.stringify(this.searchHistoryLst);
        if (this.userinfo.usertype === 2) {
          localStorage.setItem("tea_searchHistoryData_wxSchoolApp", strArr);
        } else if (this.userinfo.usertype === 4) {
          localStorage.setItem("stu_searchHistoryData_wxSchoolApp", strArr);
        }
      },
      // '最近菜单' 存入缓存中
      saveNewlyUseMenuEvent () {
        if (this.userinfo.usertype === 2) {
          let obj = {userId: this.userinfo.stuObj.UserId, newLyLst: this.newlyUseMenuLst};
          let strArr = JSON.stringify(obj);
          localStorage.setItem("teaNewlyUseLstData", strArr);
        } else if (this.userinfo.usertype === 4) {
          let obj = {xh: this.userinfo.stuObj.XH, newLyLst: this.newlyUseMenuLst};
          let strArr = JSON.stringify(obj);
          localStorage.setItem("stuNewlyUseLstData", strArr);
        }
      },
      // 根据输入的应用名称，查找到相应的应用
      searchResultMenu () {
        this.resultMenuLst = [];
        if (!this.menuTitle) {
          return
        }
        /* 微信数据库 全部应用 start */
        for (let j = 0; j < this.initAllMenuLst.length; j++) {
          let items = this.initAllMenuLst[j].items;
          for (let k = 0; k < items.length; k++) {
            let item = items[k];
            if (item.title.indexOf(this.menuTitle) >= 0) {
              this.resultMenuLst.push(item);
            }
          }
        }
        /* 微信数据库 全部应用 end */
        /* 办公 oa start */
        for (let m = 0; m < this.officeMenuLst.length; m++) {
          let oaItem = this.officeMenuLst[m];
          if (oaItem.title.indexOf(this.menuTitle) >= 0) {
            this.resultMenuLst.push(oaItem);
          }
        }
        /* 办公 oa end */
      },
      // 得到搜索历史记录
      getSearchHistoryData () {
        if (this.userinfo.usertype === 2) {
          if (localStorage.getItem("tea_searchHistoryData_wxSchoolApp") !== null) {
            this.searchHistoryLst = JSON.parse(localStorage.getItem("tea_searchHistoryData_wxSchoolApp"));
          }
        } else if (this.userinfo.usertype === 4) {
          if (localStorage.getItem("stu_searchHistoryData_wxSchoolApp") !== null) {
            this.searchHistoryLst = JSON.parse(localStorage.getItem("stu_searchHistoryData_wxSchoolApp"));
          }
        }
      },
      // 得到首页中的数据
      getParentPgData () {
        if (this.QD.appLst_currPageData) {
          this.initAllMenuLst = this.QD.appLst_currPageData.initAllMenuLst;
          this.newlyUseMenuLst = this.QD.appLst_currPageData.newlyUseMenuLst;
          this.getSearchHistoryData(); // 得到搜索历史记录
        } else {
          this.$router.go(-1)
        }
      },
      // 得到‘我的办公’模块--通过接口获取
      getOaMenu (d) {
        this.officeMenuLst = d;
      }
    }
  }
</script>
<style>
  .search-menu-field .gp .weui-cells{
    margin-top: 0;
  }
</style>
<style scoped lang="less">
  .search-menu-field{
    position: static;
  }
  .header-box{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 3px 0;
    background-color: #f8f8f8;
    z-index: 100;
  }
  .left-arrow{
    position: absolute;
    top: 9px;
    left: 12px;
    width: 30px;
    height: 30px;
  }
  .left-arrow:before{
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid #2c2c2c;
    border-width: 1px 0 0 1px;
    -webkit-transform: rotate(315deg);
    transform: rotate(315deg);
    top: 8px;
    left: 7px;
  }
  .header-title{
    position: relative;
    height: 40px;
    margin: 0 66px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
  }
  .header-title .search-box{
    position: relative;
    width: 100%;
    height: 40px;
  }
  .header-title .school-wx-icon.iconsousou{
    position: absolute;
    left: 10px;
    top: 2px;
    height: 30px;
    color: #696969;
  }
  .header-title .school-wx-icon.delete-icon{
    position: absolute;
    right: 0;
    top: 2px;
    height: 30px;
    color: #c3c3c3;
  }
  .header-title .input-box{
    display: inline-block;
    position: relative;
    width: 100%;
    height: 30px;
    margin-top: 4px;
    padding: 0 30px 0 34px;
    border-radius: 16px;
    border: 1px solid #c1c1c1;
    font-size: 14px;
    outline: 0;
    background-color: #f8f8f8;
    box-sizing: border-box;
  }
  .search-btn{
    display: inline-block;
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 14px;
    padding: 16px 10px 16px 10px;
    color: #333333;
  }
  .result-field{
    position: absolute;
    top: 46px;
    bottom: 0;
    width: 100%;
    .icon-box{
      padding: 0 10px 0 0;
    }
    .icon-svg{
      width: 26px;
      height: 26px;
    }
    .school-wx-icon.igrid-block-icon{
      display: block;
      margin: 0 auto;
      padding-right: 0;
      font-size: 22px;
      text-align: center;
    }
  }
  .no-result{
    padding-top: 56px;
    text-align: center;
  }
  .no-result img{
    width: 130px;
  }
  .no-result .desc{
    padding: 12px 0;
    font-size: 14px;
    color: #999999;
  }
  /* 显示历史搜索结果 start */
  .history-box{
    position: relative;
    padding: 10px 0 10px 0;
    .head-title{
      padding: 10px 15px 10px 15px;
      font-size: 14px;
      color: #333333;
    }
    .title-box{
      padding: 0 6px;
    }
    .title-text{
      display: inline-block;
      max-width: 100%;
      margin: 5px 4px;
      padding: 8px 10px;
      font-size: 12px;
      color: #333333;
      background-color: #f6f6f6;
      border-radius: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
    }
    .no-history{
      text-align: center;
      .desc{
        padding: 35px 0;
        font-size: 12px;
        color: #999999;
      }
    }
  }
  /* 显示历史搜索结果 end */
</style>
