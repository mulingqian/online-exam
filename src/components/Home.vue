<template>
  <div class="home" id="homePageField">
    <!--
    filter: drop-shadow(red 1800px 0);
    transform: translateX(-1800px);
    -->

    <div class="top-content">
      <div :class="`info-box ${pgScrollTop > 10 ? 'info-box2' : '' }`">
        <div class="search-box" @click="goSearchPg">
          <span class="school-wx-icon iconsousou">&#xe66f;</span>
          <span class="input-box"></span>
        </div>
        <!-- 图标菜单 start -->
        <div class="icon-menu">
          <span @click="goMsgCentrePg" class="school-wx-icon iconxiaoxi">&#xe670;</span>
        </div>
        <!-- 图标菜单 end -->
      </div>
      <!-- 滚动的高度 大于等于 54 end -->
      <div v-if="userinfo.usertype === 2">
        <img class="onlyImg" v-if="teaLoopBaseLst.length === 1" :src="teaLoopBaseLst[0].img" />
        <swiper class="loop-swiper" v-if="teaLoopBaseLst.length > 1" :loop="true" :auto="true" :aspect-ratio="500/750"
                :interval=10000 :list="teaLoopBaseLst" :show-desc-mask="false"></swiper>
      </div>
      <div v-if="userinfo.usertype === 4">
        <img class="onlyImg" v-if="stuLoopBaseLst.length === 1" :src="stuLoopBaseLst[0].img" />
        <swiper class="loop-swiper" v-if="stuLoopBaseLst.length > 1" :loop="true" :auto="true" :aspect-ratio="500/750"
                :interval=10000 :list="stuLoopBaseLst" :show-desc-mask="false"></swiper>
      </div>
      <!-- 学校设置的菜单 start -->
      <div class="menu-box deploy-menu-box" v-if="configMenuLst.length > 0">
        <div class="menu-content clearfloat">
          <div :class="`menu-block menu-block${configMenuLst.length > 4 ? 4 + ' more-config-menu' : configMenuLst.length}`" v-for="(item, midx) in configMenuLst" :key="midx" @click.prevent="onItemClick(item)">
            <!--<p class="igrid-block-icon">
              <svg class="icon-svg" aria-hidden="true">
                <use xlink:href="#iconyongzhangshenqing-copy"></use>
              </svg>
            </p>-->
            <span class="school-wx-icon igrid-block-icon" :style="{ color: item.iconColor }" slot="icon" v-html="item.iconContent"></span>
            <p class="igrid-block-title">{{item.title}}</p>
          </div>
        </div>
      </div>
      <!-- 学校设置的菜单 end -->
    </div>
    <div :class="`${userinfo.usertype === 4 ? 'stu-module-box' : 'tea-module-box'} module-box`">
      <!--最近使用-->
      <div class="igrid-box">
        <span class="igrid-title">最近使用</span>
        <div class="igrid">
          <a v-if="index < 5" v-for="(item, index) in newlyUseMenuLst" :key="index" @click.prevent="onItemClick(item)" class="igrid-block">
            <p class="igrid-block-p">
              <span class="school-wx-icon igrid-block-icon" :style="{ color: item.iconColor }" slot="icon" v-html="item.iconContent"></span>
              <span class="igrid-block-title" v-html="item.title"></span>
            </p>
          </a>
        </div>
      </div>
      <!--  我的应用面板 start-->
      <div class="igrid-box">
        <span class="igrid-title">我的应用</span>
        <div class="igrid">
          <a v-for="(item, index) in myDefaultMenuLst" :key="index" @click.prevent="onItemClick(item)" class="igrid-block">
            <p class="igrid-block-p">
              <span class="school-wx-icon igrid-block-icon" :style="{ color: item.iconColor }" slot="icon" v-html="item.iconContent"></span>
              <span class="igrid-block-title" v-html="item.title"></span>
            </p>
          </a>
          <a :href="QD.getUrl(moreMenuData.url)" @click.prevent="onMoreItemClick(moreMenuData)" class="igrid-block">
            <p class="igrid-block-p">
              <span class="school-wx-icon igrid-block-icon" :style="{ color: moreMenuData.iconColor }" slot="icon" v-html="moreMenuData.iconContent"></span>
              <span class="igrid-block-title" v-html="moreMenuData.title"></span>
            </p>
          </a>
        </div>
      </div>

    </div>

    <!-- 学生的课表显示 start -->
    <div v-if="userinfo.usertype === 4" class="stu-week-course">
      <week-course @go-course="goCoursePg" @get-data="getStuWeekCourseData" :courseObj="stuCourseObj"></week-course>
    </div>
    <!-- 学生的课表显示 end -->
    <!-- 用户的未读消息 start -->
    <msg-no-read-num :useInterfaceMsgNum="useInterfaceMsgNum" @get-num="getNoReadNum"></msg-no-read-num>
    <!-- 用户的未读消息 end -->
  </div>
</template>

<script>
  import Swiper from 'vux/src/components/swiper/swiper.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import weekCourse from './myApplication/common/StuWeekCourseLst.vue'
  import MsgNoReadNum from './myApplication/common/MsgNoReadNum.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'home',
    directives: {
    },
    components: {
      Swiper,
      Cell,
      Group,
      Divider,
      weekCourse,
      MsgNoReadNum
    },
    data () {
      return {
        pgScrollTop: 0, // 整个页面滑动的高度
        initAllMenuLst: [], // 初始的所有菜单信息 不包括 oa
        allMenuLst: [], // 去重之后的所有菜单信息，学校设置固定的菜单不在里面, 不包括 oa
        myDefaultMenuLst: [], // 我的应用 菜单 不包括 oa
        newlyUseMenuLst: [], // '最近使用'
        moreMenuData: null, // 更多菜单信息的设置
        configMenuLst: [], // 学校配置的菜单
        stuCourseObj: null, // 学生课表信息
        useInterfaceMsgNum: true, // 用户未读消息数量- 是否调用接口
        // 老师默认的菜单配置 学校概况 通知公告 校园地图 校历 校内通讯录
        teaConfigModules: ['学校概况', '通知公告', '校园地图', '校历'],
        // 学生默认菜单的配置
        stuConfigModules: ['学校概况', '通知公告', '校园地图'],
        teaLoopBaseLst: [], // 定义轮播图片路径地址
        stuLoopBaseLst: []
      }
    },
    created () {
      this.getCurrPgSaveData(); // 得到 home.vue 页面到‘全部应用’页面保存数据
    },
    mounted () {
      this.setSearchScrollTop();  // 设置搜索框固定在顶部
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo,   // 用户信息
        msgCentreSumNum: state => state.vux.msgCentreSumNum // 待办和我的消息未读消息总数
      })
    },
    methods: {
      // 到课表页面
      goCoursePg () {
        this.saveCurrPgData(); // 保存当前页面的数据
        this.$router.push('/stu/courselst')
      },
      // 到消息中心页面
      goMsgCentrePg () {
        this.$router.push('/messageCenter/messageCentre')
      },
      // 得到学生周课表的数据
      getStuWeekCourseData (e) {
        this.stuCourseObj = e;
      },
      // 得到用户未读消息数
      getNoReadNum (e) {
        this.useInterfaceMsgNum = false;
      },
      // 根据用户的身份得到相应的信息
      getUserDataByUsertype () {
        if (this.userinfo.usertype === 4) {
          this.addStuMoreMenuData(); // 添加学生端更多菜单
          this.getStuNewlyMenuData(); // 得到学生端的“最近使用”模块
          this.getStuSelfDefaultMenuData(); // 取缓存中的学生端 ‘我的应用’菜单
        } else if (this.userinfo.usertype === 2) {
          this.addTeaMoreMenuData(); // 添加老师端更多菜单
          this.getTeaNewlyMenuData();  // 得到教师端的“最近使用”模块
          this.getTeaSelfDefaultMenuData();  // 取缓存中的老师端 ‘我的应用’菜单
        }
      },
      // 得到 home.vue 页面到‘全部应用’页面保存数据
      getCurrPgSaveData() {
        this.setLoopBaseLst(); // 设置首页中图片名称，根据移动端的类型的不同
        if (this.QD.appLst_currPageData) {
          let qd = this.QD.appLst_currPageData;
          this.initAllMenuLst = qd.initAllMenuLst;
          this.myDefaultMenuLst = qd.myDefaultMenuLst;
          this.allMenuLst = qd.allMenuLst;
          this.newlyUseMenuLst = qd.newlyUseMenuLst;
          this.configMenuLst = qd.configMenuLst;
          this.pgScrollTop = qd.pgScrollTop;
          this.stuCourseObj = qd.stuCourseObj;
          this.useInterfaceMsgNum = qd.useInterfaceMsgNum;
          this.QD.appLst_currPageData = null;
        }
        if (this.allMenuLst.length > 0) {
          if (this.userinfo.usertype === 4) {
            this.addStuMoreMenuData(); // 添加学生端更多菜单
            this.getStuNewlyMenuData(); // 得到学生端的“最近使用”模块
          } else if (this.userinfo.usertype === 2) {
            this.addTeaMoreMenuData(); // 添加老师端更多菜单
            this.getTeaNewlyMenuData();  // 得到教师端的“最近使用”模块
          }
        } else {
          this.getUserDataByUsertype(); // 根据用户的身份得到相应的数据
        }
      },
      // 保存当前页面的数据
      saveCurrPgData () {
        this.QD.appLst_currPageData = {
          initAllMenuLst: this.initAllMenuLst,
          myDefaultMenuLst: this.myDefaultMenuLst,
          allMenuLst: this.allMenuLst,
          newlyUseMenuLst: this.newlyUseMenuLst,
          configMenuLst: this.configMenuLst,
          pgScrollTop: this.pgScrollTop,
          stuCourseObj: this.stuCourseObj,
          useInterfaceMsgNum: this.useInterfaceMsgNum
        }; // 我的应用
      },
     // 设置搜索框固定在顶部
      setSearchScrollTop () {
        let that = this;
        this.pgScrollTop = this.pgScrollTop ? this.pgScrollTop : 0;
        let box = document.querySelector('#homePageField');
        box.scrollTop = this.pgScrollTop; // 将记录的滚动高度再次渲染到页面上
        // 监听这个dom的scroll事件
        console.log("....pgScrollTop", this.pgScrollTop);
        box.addEventListener('scroll', () => {
          that.pgScrollTop = box.scrollTop;
        }, false);
      },
      // 到搜索页面
      goSearchPg () {
        this.saveCurrPgData(); // 保存当前页面的数据
        this.$router.push('/myApplication/searchMenu');
      },
      // 设置首页中图片名称，根据移动端的类型的不同
      setLoopBaseLst () {
        if (this.QD.EndClientType === 'DING') {
          this.teaLoopBaseLst = [{
            url: 'javascript:',
            img: './static/imgs/tea_ding_index01.jpg?v=' + this.QD.productVersionNum,
            title: ''
          }];
          this.stuLoopBaseLst = [{
            url: 'javascript:',
            img: './static/imgs/stu_ding_index01.jpg?v=' + this.QD.productVersionNum,
            title: ''
          }]
        } else {
          this.teaLoopBaseLst = [{
            url: 'javascript:',
            img: './static/imgs/tea_app_index01.jpg?v=' + this.QD.productVersionNum,
            title: ''
          }];
          this.stuLoopBaseLst = [{
            url: 'javascript:',
            img: './static/imgs/stu_app_index01.jpg?v=' + this.QD.productVersionNum,
            title: ''
          }]
        }
      },
      // 点击 ‘全部’
      onMoreItemClick(item) {
        this.saveCurrPgData(); // 保存当前页面的数据
        this.QD.go(item.url, this.$router);
      },
      // 点击菜单，除了更多菜单
      onItemClick (item) {
        this.setNewlyUseMenuLst(item); // 最近使用菜单变化处理,点击菜单
        this.saveNewlyUseMenuEvent(); // '最近菜单' 存入缓存中
        this.saveCurrPgData(); // 保存当前页面的数据
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
      // 得到当前教师/当前学生用户的'我的应用'列表 isDefault为true显示
      async getAllMenu () {
        let d = [];
        d = await this.QD.getData('/ComApi/AllMenuList', {userId: this.userinfo.stuObj.UserId, userType: this.userinfo.usertype});
        console.log("all menu = ------", d);
        if (d.status && d.status === "error") {
          console.log("报错", d.msg);
          return;
        }
        this.initAllMenuLst = d;
        this.removeDuplicateMenu(d);  // 去重，‘我的应用’和更多页面中所有菜单和学校设置菜单不重复
        if (this.myDefaultMenuLst.length <= 0) { // 我的应用菜单数据不存在缓存中
          this.getCommonDefaultMenuData(); // 整理得到数据库中设置的显示在首页中的默认菜单
        } else {
          this.updateDefaultMenuData();  // 更新'我的应用' 菜单， 是否存在于‘全部应用’菜单，否-删除
        }
        this.updateNewlyUseLstData(); // 判断‘最近使用’中菜单是否存在于‘全部应用’菜单，否-删除'最近使用'中的那个菜单
      },
      // 整理得到数据库中设置的显示在首页中的默认菜单
      getCommonDefaultMenuData () {
        let getLst = [];
        for (let i=0; i<this.allMenuLst.length; i++){
          let lst = this.allMenuLst[i].items;
          for (let j=0; j<lst.length; j++) {
            if (lst[j].isDefault === true) {
              getLst.push(lst[j]);
            }
          }
        }
        let len = getLst.length;
        this.myDefaultMenuLst = getLst;
        // 教师用户
        if (this.userinfo.usertype === 2) {
          // 数据库中设置的默认菜单数量大于系统中设置数目，删除多余的菜单
          if (len > this.QD.teacherApplicationNum) {
            this.myDefaultMenuLst.splice(this.QD.teacherApplicationNum, len - this.QD.teacherApplicationNum);
          }
        } else if (this.userinfo.usertype === 4) { // 学生用户
          // 数据库中设置的默认菜单数量大于系统中设置数目，删除多余的菜单
          if (len > this.QD.studentApplicationNum) {
            this.myDefaultMenuLst.splice(this.QD.studentApplicationNum, len - this.QD.studentApplicationNum);
          }
        }
      },
      // 得到固定菜单数据
      getFixMenuData () {
        let fixMenuLst = []; // 固定菜单
        if (this.QD.homeModules) {
          if (this.userinfo.usertype === 2) {
            if (this.QD.homeModules.TeaHome && this.QD.homeModules.TeaHome.Icons.length > 0) {
              fixMenuLst = this.QD.homeModules.TeaHome.Icons
            }
          } else if (this.userinfo.usertype === 4) {
            if (this.QD.homeModules.StuHome && this.QD.homeModules.StuHome.Icons.length > 0) {
              fixMenuLst = this.QD.homeModules.StuHome.Icons
            }
          }
        }
        // 若设置的菜单为空，固定菜单取默认的
        if (fixMenuLst.length === 0) {
          this.getConfigModulesMenuData(); // 得到默认的固定菜单信息：菜单iconfont、url 路径地址
          fixMenuLst = this.configMenuLst;
        }
        this.configMenuLst = fixMenuLst;
      },
      // 去重，‘我的应用’和更多页面中所有菜单和学校设置菜单不重复
      removeDuplicateMenu (d) {
        let obj = {allMenuLst: d, configMenuLst: []};
        this.getFixMenuData(); // 得到固定菜单数据
        let difInitAllMenuLst = JSON.parse(JSON.stringify(d)); // 相同的对象数据，不同的存储空间
        obj = this.QD.setMustAllMenuLst(difInitAllMenuLst, this.configMenuLst);
        this.allMenuLst = obj.allMenuLst;
        this.configMenuLst = obj.configMenuLst;
      },
      // 添加学生端更多菜单
      addStuMoreMenuData () {
        this.moreMenuData = {
          title: '全部',
          url: {
            path: '/myApplication/stuMoreApplication',
            replace: false
          },
          iconContent: '&#xe629',
          iconColor: '#ADABAB'
        }
      },
      // 添加老师端更多菜单
      addTeaMoreMenuData () {
        this.moreMenuData = {
          title: '全部',
          url: {
            path: '/myApplication/moreApplication',
            replace: false
          },
          iconContent: '&#xe629',
          iconColor: '#ADABAB'
        }
      },
      // 得到学生最近使用的菜单
      getStuNewlyMenuData () {
        // 得到学生端的“最近使用”模块
        if (localStorage.getItem("stuNewlyUseLstData") !== null) {
          let stuNewLyLst = JSON.parse(localStorage.getItem("stuNewlyUseLstData"));
          if (stuNewLyLst.xh === this.userinfo.stuObj.XH) {
            this.newlyUseMenuLst = stuNewLyLst.newLyLst;
          }
        }
      },
      // 得到老师最近使用的菜单
      getTeaNewlyMenuData () {
        if (localStorage.getItem("teaNewlyUseLstData") !== null) {
          let teaNewlyUseLst = JSON.parse(localStorage.getItem("teaNewlyUseLstData"));
          if (teaNewlyUseLst.userId === this.userinfo.stuObj.UserId) { // 保存的最近使用模块是当前教师用户的
            this.newlyUseMenuLst = teaNewlyUseLst.newLyLst;
          }
        }
      },
      // 取缓存中的学生端 ‘我的应用’菜单
      getStuSelfDefaultMenuData () {
        if (localStorage.getItem("stu_defaultMenuEdit_wxSchoolApp") !== null) {
          let obj = JSON.parse(localStorage.getItem("stu_defaultMenuEdit_wxSchoolApp"));
          if (obj.xh === this.userinfo.stuObj.XH) {
            this.myDefaultMenuLst = obj.myDefaultMenuLst;
          }
          if (this.myDefaultMenuLst.length === 0 || (this.myDefaultMenuLst.length > this.QD.studentApplicationNum)) {
            localStorage.removeItem("stu_defaultMenuEdit_wxSchoolApp");
          }
        }
        // 得到当前学生用户的'我的应用'列表 isDefault为true显示
        this.getAllMenu();
      },
      // 取缓存中的老师端 ‘我的应用’菜单
      getTeaSelfDefaultMenuData () {
        if (localStorage.getItem("tea_defaultMenuEdit_wxSchoolApp") !== null) {
          let obj = JSON.parse(localStorage.getItem("tea_defaultMenuEdit_wxSchoolApp"));
          if (obj.userId === this.userinfo.stuObj.UserId) {
            this.myDefaultMenuLst = obj.myDefaultMenuLst;
          }
          if (this.myDefaultMenuLst.length === 0 || (this.myDefaultMenuLst.length > this.QD.teacherApplicationNum)) {
            localStorage.removeItem("tea_defaultMenuEdit_wxSchoolApp");
          }
        }
        // 得到当前教师的'我的应用'列表 isDefault为true显示
        this.getAllMenu();
      },
      // '我的应用' 存入缓存中
      saveMyDefaultMenuEvent () {
        if (this.userinfo.usertype === 2) {
          let obj = {userId: this.userinfo.stuObj.UserId, myDefaultMenuLst: this.myDefaultMenuLst};
          let strArr = JSON.stringify(obj);
          localStorage.setItem("tea_defaultMenuEdit_wxSchoolApp", strArr);
        } else if (this.userinfo.usertype === 4) {
          let obj = {xh: this.userinfo.stuObj.XH, myDefaultMenuLst: this.myDefaultMenuLst};
          let strArr = JSON.stringify(obj);
          localStorage.setItem("stu_defaultMenuEdit_wxSchoolApp", strArr);
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
      // 得到默认的固定菜单信息：菜单iconfont、url 路径地址
      getConfigModulesMenuData () {
        if (this.userinfo.usertype === 2) {
          if (this.configMenuLst.length === 0) {
            this.configMenuLst = this.teaConfigModules;
          }
        } else if (this.userinfo.usertype === 4) {
          if (this.configMenuLst.length === 0) {
            this.configMenuLst = this.stuConfigModules;
          }
        }
      },
      // 更新'我的应用' 菜单， 是否存在于‘全部应用’菜单，否-删除
      updateDefaultMenuData () {
        let newMyDefaultMenuLst = [];
        for (let i = 0; i < this.myDefaultMenuLst.length; i++) {
          let mainMenu = this.myDefaultMenuLst[i];
          // 不判断OA 的菜单
          if (mainMenu.isDefault === undefined) {
            newMyDefaultMenuLst.push(mainMenu);
            continue; // 用来跳过循环，继续往下循环
          }
          let m = 0;
          for (let j = 0; j < this.initAllMenuLst.length; j++) {
            let items = this.initAllMenuLst[j].items;
            for (let k = 0; k < items.length; k++) {
              if (mainMenu.cid === items[k].cid) {
                m = 1;
                newMyDefaultMenuLst.push(items[k]);
                break;
              }
            }
            if (m === 1) {
              break;
            }
          }
        }
        this.myDefaultMenuLst = newMyDefaultMenuLst;
        this.saveMyDefaultMenuEvent(); // '我的应用' 存入缓存中
      },
      // 判断‘最近使用’中菜单是否存在于‘全部应用’菜单，否-删除'最近使用'中的那个菜单
      updateNewlyUseLstData () {
        let nUseLst = [];
        for (let i = 0; i < this.newlyUseMenuLst.length; i++) {
          let mainMenu = this.newlyUseMenuLst[i];
          // 不判断OA 的菜单
          if (mainMenu.isDefault === undefined) {
            nUseLst.push(mainMenu);
            continue; // 用来跳过循环，继续往下循环
          }
          let m = 0;
          for (let j = 0; j < this.initAllMenuLst.length; j++) {
            let items = this.initAllMenuLst[j].items;
            for (let k = 0; k < items.length; k++) {
              if (mainMenu.cid === items[k].cid) {
                m = 1;
                nUseLst.push(items[k]);
                break;
              }
            }
            if (m === 1) {
              break;
            }
          }
        }
        this.newlyUseMenuLst = nUseLst;
        this.saveNewlyUseMenuEvent(); // '最近菜单' 存入缓存中
      }
    }
  }
</script>
<style>
  /* 轮播图片背景图片样式 start */
  .home .vux-slider > .vux-swiper > .vux-swiper-item > a > .vux-img{
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .home .vux-slider > .vux-indicator, .vux-slider .vux-indicator-right{
    bottom: 58px;
    width: 100%;
    text-align: center;
  }
  .home .vux-slider > .vux-indicator > a > .vux-icon-dot.active, .vux-slider .vux-indicator-right > a > .vux-icon-dot.active{
    background-color: #ffffff;
  }
  .home .vux-slider > .vux-indicator > a > .vux-icon-dot, .vux-slider .vux-indicator-right > a > .vux-icon-dot{
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #bcd2f3;
  }
  .home .vux-slider > .vux-indicator > a, .vux-slider .vux-indicator-right > a{
    float: none;
  }
  /* 轮播图片背景图片样式 end */
</style>
<style scoped>
  .home{
    position: static;
    height: 100%;
    background-color: #f7f7f7;
    overflow-y: auto;
  }
  .top-content{
    position: relative;
    padding-bottom: 10px;
    background-color: #ffffff;
  }
  .top-content .info-box{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    background-color: rgba(255, 255, 255, .2);
    /*box-shadow: 0 0 2px rgba(0, 0, 0, .3);*/
    box-shadow: 0 5px 10px 0 rgba(151, 151, 151, 0.2);
  }
  .top-content .info-box2{
    background-color: #ffffff;
  }
  .top-content .search-box{
    position: relative;
    padding: 10px 10px 8px 20px;
  }
  .top-content .info-box2 .search-box{
    left: 10%;
    width: 80%;
    padding: 10px 0 8px 0;
  }
  .top-content  .info-box2 .icon-menu{
    display: none;
  }
  .top-content .icon-menu{
    position: absolute;
    top: 14px;
    right: 6px;
  }
  .top-content .icon-menu .iconxiaoxi{
    position: relative;
    color: #ffffff;
    font-size: 26px;
    padding-right: 4px;
    padding-left: 4px;
    vertical-align: middle;
  }
  .top-content .iconsousou{
    position: absolute;
    top: 16px;
    left: 30px;
    color: #ffffff;
    font-size: 22px;
  }
  .top-content .input-box{
    display: inline-block;
    position: relative;
    width: 76%;
    height: 30px;
    border: 1px solid #ffffff;
    border-radius: 16px;
  }
  .top-content .info-box2 .search-box .iconsousou{
    left: 10px;
    color: #d9d9d9;
  }
  .top-content .info-box2 .search-box .input-box{
    width: 100%;
    border: 1px solid #d9d9d9;
  }
  .top-content .onlyImg{
    position: relative;
    width: 100%;
    z-index: 1;
  }
  .top-content .loop-swiper{
    position: relative;
    z-index: 1;
  }
  /* 学校设置的固定菜单 start */
  .top-content .menu-box{
    position: relative;
    margin-top: -48px;
    padding: 0 20px;
    z-index: 1;
  }
  .top-content .menu-box .menu-content{
    position: relative;
    padding: 12px 0;
    text-align: center;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 0 5px 10px 0 rgba(151, 151, 151, 0.2)
  }
  .top-content .menu-box .menu-content .menu-block{
    position: relative;
    float: left;
    box-sizing: border-box;
  }
  .more-config-menu{
    padding: 12px 0 4px 0;
  }
  .top-content .menu-box .menu-content .menu-block1{
    width: 90%;
  }
  .top-content .menu-box .menu-content .menu-block2{
    width: 50%;
  }
  .top-content .menu-box .menu-content .menu-block3{
    width: 33.3%;
  }
  .top-content .menu-box .menu-content .menu-block4{
    width: 25%;
  }
  /* 学校设置的固定菜单 end */
  .module-box{
    position: relative;
    background-color: #ffffff;
  }
  .stu-module-box{
    padding-bottom: 12px;
    margin-bottom: 10px;
  }
  .tea-module-box{
    padding-bottom: 20px;
  }
  /*我的应用*/
  .igrid-box{
    padding: 10px 0 4px 0;
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
  /*微信端学生端单独模块end*/
  .deploy-menu-box .icon-svg{
    width: 34px;
    height: 34px;
  }
  .igrid-block-title{
    display: block;
    padding: 0 2px;
    text-align: center;
    font-size: 12px;
    color: #000000;
    line-height: 14px;
  }
  .deploy-menu-box .igrid-block-title{
    color: #464847;
  }
  /*教师模块iconfont*/
  .school-wx-icon.igrid-block-icon{
    display: block;
    height: 35px;
    margin: 0 auto;
    padding-right: 0;
    font-size: 2em;
    text-align: center;
  }
  /* 学生课表 start */
  .stu-week-course{
    padding-bottom: 20px;
    background-color: #ffffff;
  }
</style>
