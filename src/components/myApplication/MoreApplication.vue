<template>
  <div class="more-application-field">
    <div class="header-box">
      <div class="left-arrow" @click="goBack"></div>
      <div class="header-title">
        <div class="search-box" @click="goSearchPg">
          <span class="school-wx-icon iconsousou">&#xe66f;</span><span class="input-box"></span>
        </div>
      </div>
    </div>

    <div class="menu-container" id="teaMenuContainer">
      <div class="igrid-field">
        <!-- 我的应用 start -->
        <div class="igrid-box default-igrid-box">
          <span class="igrid-title">我的应用</span>
          <!-- 我的应用 收起 最多显示6个 start -->
          <div v-if="!defaultMenuObj.expandDefaultMenu" class="shrink-default-igrid">
            <span v-if="index < 6" v-for="(item, index) in myDefaultMenuLst" :key="index"
                  class="school-wx-icon menu-icon" :style="{ color: item.iconColor }"
                  v-html="item.iconContent" @click.prevent="expandDefaultEvent"></span>
            <span class="school-wx-icon more-icon" slot="icon" style="color: #a6a6a6;" @click.prevent="expandDefaultEvent">&#xe62d;</span>
          </div>
          <!-- 我的应用 收起 最多显示6个 end -->
          <!-- 我的应用 全部展开 start -->
          <div v-if="defaultMenuObj.expandDefaultMenu" class="igrid">
            <a v-for="(item, index) in myDefaultMenuLst" :key="index" @click.prevent="onItemClick(item)" class="igrid-block">
              <p class="igrid-block-p">
                <span class="school-wx-icon igrid-block-icon" :style="{ color: item.iconColor }" slot="icon" v-html="item.iconContent"></span>
                <span class="igrid-block-title" v-html="item.title"></span>
              </p>
            </a>
            <!-- 收起 start -->
            <a class="igrid-block">
              <p class="igrid-block-p">
                <span class="school-wx-icon igrid-block-icon" :style="{ color: '#a6a6a6' }" @click.prevent="shrinkDefaultEvent">&#xe673;</span>
                <span class="igrid-block-title">收起</span>
              </p>
            </a>
            <!-- 收起 end -->
          </div>
          <!-- 我的应用 全部展开 end -->
          <div class="default-desc">
            <divider>以上应用展示在首页（最多{{QD.teacherApplicationNum}}个）</divider>
          </div>

          <div class="igrid">
            <a class="igrid-block" @click.prevent="goMyAppEdit()">
              <p class="igrid-block-p">
                <span class="school-wx-icon igrid-block-icon" :style="{ color: '#a6a6a6' }">&#xe672;</span>
                <span class="igrid-block-title">编辑</span>
              </p>
            </a>
          </div>
        </div>
        <!-- 我的应用 end -->
        <!-- 最近使用 start -->
        <div class="igrid-box">
          <span class="igrid-title">最近使用</span>
          <div class="igrid">
            <a v-for="(item, index) in newlyUseMenuLst" :key="index" @click.prevent="onItemClick(item)" class="igrid-block">
              <p class="igrid-block-p">
                <span class="school-wx-icon igrid-block-icon" :style="{ color: item.iconColor }" slot="icon" v-html="item.iconContent"></span>
                <span class="igrid-block-title" v-html="item.title"></span>
              </p>
            </a>
          </div>
        </div>
        <!-- 最近使用 end -->
        <!-- 全部应用 start -->
        <div class="igrid-box" v-for="(lst, idx) in allMenuList" :key="idx">
          <span class="igrid-title">{{lst.category}}</span>
          <div class="igrid">
            <a v-for="(item, index) in lst.items" :key="index" @click.prevent="onItemClick(item)" class="igrid-block">
              <p class="igrid-block-p">
                <span class="school-wx-icon igrid-block-icon" :style="{ color: item.iconColor }" slot="icon" v-html="item.iconContent"></span>
                <span class="igrid-block-title" v-html="item.title"></span>
              </p>
            </a>
          </div>
        </div>
        <!-- 全部应用 end -->
      </div>

    </div>

  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'moreApplication_keepAlive',
    directives: {
      TransferDom
    },
    components: {
      Group,
      Cell,
      Divider
    },
    activated () {
      // 是从 home 进入请求数据或者菜单从一个地址跳转到另一个地址时，需要重新请求接口，获得数据
      if (this.$route.meta.isReflesh || this.allMenuList.length === 0) {
        // 判断我的应用-是否有编辑过，若没有编辑过，我的应用数据从上一个页面得到
        this.initDataWay(); // 初始化数据
        this.getParentPgData(); // // 得到父级页面传过来的数据
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
        let ct = document.querySelector('#teaMenuContainer');
        console.log('scrollTop', ct.scrollTop);
        this.updateAllMenuPosition(ct.scrollTop); // 记录滚动的高度
        next();
      } else {
        this.updateAllMenuPosition(0); // 重置滚动的高度
        next();
      }
    },
    data () {
      return {
        backLoaded: true,
        myDefaultMenuLst: [],  // 我的应用 不包括 oa
        officeMenuList: [], // 我的办公
        newlyUseMenuLst: [], // 最近使用
        allMenuList: [], // 全部应用菜单, 包括 oa
        defaultMenuObj: {expandDefaultMenu: false} // 我的应用存储信息,expandDefaultMenu-展开显示我的应用菜单
      }
    },
    created () {
    },
    mounted () {
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo,   // 用户信息
        scrollTopVux: state => state.vux.scrollTopAllMenu // ‘全部应用’滚动的高度
      })
    },
    methods: {
      ...mapActions([
        'updateAllMenuPosition' // ‘全部应用’滚动位置
      ]),
      // 点击返回上一页
      goBack () {
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 到搜索页面
      goSearchPg () {
        this.$router.push('/myApplication/searchMenu');
      },
      // 展开显示 我的应用
      expandDefaultEvent () {
        this.defaultMenuObj.expandDefaultMenu = true;
      },
      // 部分 显示 我的应用
      shrinkDefaultEvent () {
        this.defaultMenuObj.expandDefaultMenu = false;
      },
      // 设置页面滚动的高度
      setPgScrollTop () {
        this.scrollTop = this.scrollTopVux ? this.scrollTopVux : 0;
        let content = document.querySelector('#teaMenuContainer');
        content.scrollTop = this.scrollTop; // 将记录的滚动高度再次渲染到页面上
      },
      // 保存本页面数据
      savePgData () {
        this.QD.application_currPageData = {allMenuList: this.allMenuList, myDefaultMenuLst: this.myDefaultMenuLst, newlyUseMenuLst: this.newlyUseMenuLst}; // ‘全部应用’、‘默认菜单’保存
      },
      // 到我的应用编辑页面
      goMyAppEdit () {
        this.savePgData();
        this.$router.push({path: '/myApplication/myApplicationEdit'});
      },
      // 点击菜单
      onItemClick (item) {
        this.setNewlyUseMenuLst(item); // 最近使用菜单变化处理,点击菜单
        this.saveNewlyUseMenuEvent(); // '最近菜单' 存入缓存中
        this.savePgData(); // 保存本页面数据
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
      // 得到‘我的办公’模块--通过接口获取。第一步
      async getMyOfficeLst () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'apiOA.GetUserMenus'});
        if (d.status && d.status === "error") {
          console.log("oa menus 报错", d.msg);
          this.updateNewlyUseLstData(); // 更新‘最近使用’
          this.updateDefaultMenuData();  // 更新'我的应用' 菜单， 是否存在于‘oa’菜单，否-删除
          return;
        }
        let data = d.data;
        if (data.length > 0) {
          for (let i=0; i<data.length; i++) {
            // 新闻发布
            if (data[i].applyCellId === 'OA_FLOW_SQ_XWFB') {
              this.officeMenuList.push({
                cid: 'OA_FLOW_SQ_XWFB',
                title: '新闻',
                url: {
                  path: '/newsPublish/newsPublish',
                  replace: false
                },
                iconContent: '&#xe667',
                iconColor: '#108fe9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_GGFB') { // 公告发布
              this.officeMenuList.push({
                cid: 'OA_FLOW_SQ_GGFB',
                title: '公告',
                url: {
                  path: '/noticePublish/noticePublish',
                  replace: false
                },
                iconContent: '&#xe6ce',
                iconColor: '#108fe9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_HYSQ') { // 会议
              this.officeMenuList.push({
                cid: 'OA_FLOW_SQ_HYSQ',
                title: '会议申请',
                url: {
                  path: '/meetingApply/meetingApply',
                  replace: false
                },
                iconContent: '&#xe636',
                iconColor: '#e96a25'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_FWGL') { // 校内发文
              this.officeMenuList.push({
                cid: 'OA_FLOW_SQ_FWGL',
                title: '校内发文',
                url: {
                  path: '/campusDispatch/campusDispatch',
                  replace: false
                },
                iconContent: '&#xe64e',
                iconColor: '#108fe9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_SWGL') { // 收文
              this.officeMenuList.push({
                cid: 'OA_FLOW_SQ_SWGL',
                title: '收文管理',
                url: {
                  path: '/receiptFile/receiptFileManage',
                  replace: false
                },
                iconContent: '&#xe637',
                iconColor: '#e96a25'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_ZGQJ') {
              this.officeMenuList.push({
                cid: 'OA_FLOW_SQ_ZGQJ',
                title: '职工请假',
                url: {
                  path: '/employeeLeave/employeeLeave',
                  replace: false
                },
                iconContent: '&#xe63a',
                iconColor: '#8e82e9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_KQSQ') {
              this.officeMenuList.push({
                cid: 'OA_FLOW_SQ_KQSQ',
                title: '考勤',
                url: {
                  path: '/attendance/teaAttendance',
                  replace: false
                },
                iconContent: '&#xe639',
                iconColor: '#8e82e9'
              })
            } else if (data[i].applyCellId === 'OA_FLOW_SQ_BXSQ') {
              this.officeMenuList.push({
                cid: 'OA_FLOW_SQ_BXSQ',
                title: '补休',
                url: {
                  path: '/deferHolidays/deferHolidays',
                  replace: false
                },
                iconContent: '&#xe64b',
                iconColor: '#8e82e9'
              })
            }
          }
        }
        // 将 ‘我的办公’添加进 ‘全部应用’中
        console.log("oa", this.officeMenuList);
        if (this.officeMenuList.length > 0) {
          this.allMenuList = JSON.parse(JSON.stringify(this.allMenuList)); // 克隆一个数组
          this.allMenuList.push({category: "我的办公", items: this.officeMenuList});
        }
        this.updateNewlyUseLstData(); // 更新‘最近使用’
        this.updateDefaultMenuData();  // 更新'我的应用' 菜单， 是否存在于‘oa’菜单，否-删除
      },
      // 是否 通过接口获取OA办公菜单
      isGetOAMyOfficeLst () {
        if (this.QD.OAHOST !== null && this.QD.OAHOST !== '') {
          this.getMyOfficeLst(); // 得到‘我的办公’模块
        } else {
          this.updateNewlyUseLstData(); // 更新‘最近使用’
        }
      },
      // '最近菜单' 存入缓存中
      saveNewlyUseMenuEvent () {
        let obj = {userId: this.userinfo.stuObj.UserId, newLyLst: this.newlyUseMenuLst};
        let strArr = JSON.stringify(obj);
        localStorage.setItem("teaNewlyUseLstData", strArr);
      },
      // '我的应用' 存入缓存中
      saveMyDefaultMenuEvent () {
        let obj = {userId: this.userinfo.stuObj.UserId, myDefaultMenuLst: this.myDefaultMenuLst};
        let strArr = JSON.stringify(obj);
        localStorage.setItem("tea_defaultMenuEdit_wxSchoolApp", strArr);
      },
      // 判断‘最近使用’中菜单是否存在于‘oa 我的办公’菜单，否-删除'最近使用'中的那个菜单
      updateNewlyUseLstData () {
        let nUserLst = [];
        for (let i = 0; i < this.newlyUseMenuLst.length; i++) {
          if (this.newlyUseMenuLst[i].isDefault === undefined) {
            for (let j = 0; j < this.officeMenuList.length; j++) {
              let item = this.officeMenuList[j];
              if (this.newlyUseMenuLst[i].cid === item.cid) {
                nUserLst.push(item);
                break;
              }
            }
          } else {
            nUserLst.push(this.newlyUseMenuLst[i]);
          }
        }
        this.newlyUseMenuLst = nUserLst;
        this.saveNewlyUseMenuEvent(); // '最近菜单' 存入缓存中
      },
      // 更新'我的应用' 菜单， 是否存在于‘oa’菜单，否-删除
      updateDefaultMenuData () {
        let newMyDefaultMenuLst = [];
        for (let i = 0; i < this.myDefaultMenuLst.length; i++) {
          let mainMenu = this.myDefaultMenuLst[i];
          // 判断OA 的菜单
          if (mainMenu.isDefault === undefined) {
            for (let j = 0; j < this.officeMenuList.length; j++) {
              let item = this.officeMenuList[j];
              if (mainMenu.cid === item.cid) {
                newMyDefaultMenuLst.push(item);
                break;
              }
            }
          } else {
            newMyDefaultMenuLst.push(mainMenu);
          }
        }
        this.myDefaultMenuLst = newMyDefaultMenuLst;
        this.QD.appLst_currPageData.myDefaultMenuLst = this.myDefaultMenuLst; // 确保首页中的应用也更新
        this.saveMyDefaultMenuEvent(); // '我的应用' 存入缓存中
      },
      // 得到父级页面传过来的数据
      getParentPgData () {
        if (this.QD.appLst_currPageData) {
          let qd = this.QD.appLst_currPageData;
          this.allMenuList = qd.allMenuLst; // 所有菜单
          this.newlyUseMenuLst = qd.newlyUseMenuLst; // 最近使用 菜单
          this.myDefaultMenuLst = qd.myDefaultMenuLst; // 我的应用 菜单
          // 是否 通过接口获取OA办公菜单
          this.isGetOAMyOfficeLst();
        } else {
          this.$router.go(-1);
        }
      },
      // 初始化数据
      initDataWay () {
        this.backLoaded = true;
        this.myDefaultMenuLst = [];
        this.officeMenuList = [];
        this.newlyUseMenuLst = [];
        this.allMenuList = [];
        this.defaultMenuObj = {expandDefaultMenu: false}
      }
    }
  }
</script>
<style scoped>
  .more-application-field{
    position: static;
    background-color: #f2f2f2;
    overflow-y: auto;
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
    margin: 0 88px;
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
    color: #696969;
  }
  .header-title .input-box{
    display: inline-block;
    position: relative;
    width: 100%;
    height: 30px;
    margin-top: 4px;
    border-radius: 16px;
    border: 1px solid #c1c1c1;
  }
  /* 确保有滚动条，可以滑动*/
  .menu-container{
    position: absolute;
    top: 46px;
    bottom: 0;
    width: 100%;
    overflow-y: scroll;
  }
  /*全部应用*/
  .igrid-field{
    position: relative;
  }
  .default-desc{
    position: relative;
    width: 80%;
    left: 10%;
    font-size: 12px;
    color: #7d7d7d;
    text-align: center;
  }
  .igrid-box{
    position: relative;
    margin-top: 10px;
    padding-top: 16px;
    padding-bottom: 16px;
    background-color: #fff;
  }
  .default-igrid-box{
    margin-top: 0;
    padding-top: 20px;
  }
  .shrink-default-igrid{
    padding: 10px 0 8px 0;
    vertical-align: middle;
    text-align: center;
    background-color: #ffffff;
    line-height: 30px;
  }
  .shrink-default-igrid .menu-icon{
    display: inline-block;
    width: 30px;
    height: 25px;
    padding: 0;
    font-size: 22px;
    vertical-align: middle;
  }
  .shrink-default-igrid .more-icon{
    display: inline-block;
    width: 25px;
    height: 25px;
    padding: 0;
    background-color: #f2f2f2;
    border-radius: 50%;
    vertical-align: middle;
  }
  .igrid-field .igrid-box:last-child{
    margin-bottom: 20px;
  }
  .igrid-title{
    display: inline-block;
    font-size: 18px;
    padding: 0 0 8px 18px;
    color: #000000;
    letter-spacing: 1px;
    font-weight: bold;
  }
  .igrid{
    overflow: hidden;
    background-color: #fff;
  }
  .igrid-block{
    position: relative;
    float: left;
    width: 20%;
    padding: 12px 0 4px 0;
    box-sizing: border-box;
    color: #fff;
  }
  .igrid-block-p{
    position:relative;
    height: 66px;
  }
  .school-wx-icon.igrid-block-icon{
    display: block;
    height: 35px;
    margin: 0 auto;
    padding-right: 0;
    font-size: 2em;
    text-align: center;
  }
  .igrid-block-title{
    display:block;
    padding: 0 2px;
    text-align: center;
    font-size: 12px;
    color: #000000;
    line-height: 14px;
  }
</style>

