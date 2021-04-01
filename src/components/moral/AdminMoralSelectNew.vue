<template>
  <div class="admin-moral-select">
    <div class="menu-container" id="adminMoralSelect">
      <van-search
        shape="round"
        placeholder="请输入姓名/班级"
        @focus="getFocus"
        class="serch-box"
      >
      </van-search>

      <!--评语类型 start-->
      <div class="radio-cell flex-block">
        <div class="title-block"> 评语类型:</div>
        <div class="content-block">
          <van-radio-group v-model="pyType" direction="horizontal" @change="getPYType">

            <van-radio :name="item.value" v-for="(item, idx) in pyTypeLst" :key="idx">{{item.title}}
              <template #icon="props">
                <span class="school-wx-icon" v-if="props.checked">&#xe69d;</span>
                <span class="school-wx-icon" v-else>&#xe65d;</span>
              </template>
            </van-radio>
          </van-radio-group>
        </div>
      </div>
      <!--评语类型 end-->

      <!--学期 and 学年 start-->
      <group gutter="0" class="gp">
        <popup-picker
          v-if="pyType === '2'"
          title="学  年:"
          v-model="selectXndInfo"
          :placeholder="'请选择学年'"
          :data="pyXndLst"
          :columns="1"
          :show-name="true"
          :value-text-align="'left'"
          @on-change="getSelectXn"
          class="popup-pick-style"
        >
        </popup-picker>

        <popup-picker
          v-if="pyType === '1' && xqLst.length > 0"
          title="学  期:"
          v-model="selectXqInfo"
          :placeholder="'请选择学期'"
          :data="xqLst"
          :columns="1"
          :show-name="true"
          :value-text-align="'left'"
          @on-change="getSelectXq"
          class="popup-pick-style"
        >
        </popup-picker>
      </group>
      <!--学期 and 学年 end-->

      <!--筛选 start-->
      <siftCondition
        v-if="currXQOrXnId"
        :currXQOrXnId="currXQOrXnId"
        :moralType="pyType"
        :searchInfo="searchInfo"
        @goStuLst="goStuLst"
        @get-selectVal="getSelectVal">
      </siftCondition>
      <!--筛选 end-->
    </div>

  </div>
</template>
<script>
  import { RadioGroup, Radio, Button, Search, Empty } from 'vant'
  import { Group, Cell, PopupPicker } from 'vux'
  import { mapState, mapActions } from 'vuex'
  import siftCondition from './components/SiftCondition.vue'
  export default {
    name: 'adminMoralSelectNew_keepAlive',
    directives: {
    },
    components: {
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Button.name]: Button,
      [Search.name]: Search,
      [Empty.name]: Empty,
      Group,
      Cell,
      PopupPicker,
      siftCondition
    },
    activated () {
      console.log('%c home activated', 'color:blue', this.$route.meta)
      // 是从 home 进入请求数据或者菜单从一个地址跳转到另一个地址时，需要重新请求接口，获得数据
      if (this.$route.meta.isReflesh) {
        // 判断我的应用-是否有编辑过，若没有编辑过，我的应用数据从上一个页面得到
        this.getCurrPgData(); // // 得到父级页面传过来的数据
      }
      this.getCurrPgData(); // // 得到父级页面传过来的数据
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
        let ct = document.querySelector('#adminMoralSelect');
        console.log('scrollTop', ct, ct.scrollTop);
        let st = {scrollTop: ct.scrollTop, page: 'adminMorSelect'}
        this.updateScrrollPage(st); // 记录滚动的高度
        next();
      } else {
        let st = {scrollTop: 0, page: 'adminMorSelect'}
        this.updateScrrollPage(st); // 重置滚动的高度
        next();
      }
    },
    data () {
      return {
        pgScrollTop: 0, // 整个页面滑动的高度
        searchInfo: null, // 筛选条件
        pyType: '1', // 学期评语 = 1,学年评语 = 2
        selectXndInfo: [], // 选择学年信息
        selectXqInfo: [], // 选择学期信息
        selectXqName: '', // 选中的学期名称
        pyXndLst: [], // 评语学年
        xqLst: [], // 评语学期
        classPgData: null, // 班级页面信息
        classInfo: null, // 选中的班级信息
        pyTypeLst: [{title: '学期', value: '1'}, {title: '学年', value: '2'}], // 评语类型
        currXQOrXnId: '' // 当前选中的学期、学年id
      }
    },
    created () {
      console.log('scrollTopVuxLst', this.scrollTopVuxLst)
    },
    mounted () {
    },
    computed: {
      ...mapState({
        scrollTopVuxLst: state => state.vux.scrrollPage // 滚动的高度
      })
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus',
        'updateScrrollPage', // 滚动位置
        'updateAllMenuPosition' // ‘全部应用’滚动位置
      ]),
      // 设置页面滚动的高度
      setPgScrollTop () {
        console.log('设置页面滚动的高度', this.scrollTopVuxLst)
        for (let i=0; i< this.scrollTopVuxLst.length; i++){
          if (this.scrollTopVuxLst[i].page === 'adminMorSelect'){
            this.scrollTop = this.scrollTopVuxLst[i].scroll ? this.scrollTopVuxLst[i].scroll : 0;
            break
          }
        }
        let content = document.querySelector('#adminMoralSelect');
        content.scrollTop = this.scrollTop; // 将记录的滚动高度再次渲染到页面上
      },
      // 搜索框得到焦点
      getFocus() {
        this.QD.parentPageData = {
          searchInfo: this.searchInfo,
          selectXqInfo: this.selectXqInfo,
          selectXndInfo: this.selectXndInfo,
          selectXqName: this.selectXqName,
          currXQOrXnId: this.currXQOrXnId,
          pyType: this.pyType
        };
        this.$router.push('/searchPage')
      },
      // 切换评语类型
      getPYType() {
        this.getSelectedXQData(); // 得到选中的学期信息
        this.currXQOrXnId = this.selectXqInfo[0]
        if (this.pyType === '2') {
          this.currXQOrXnId = this.selectXndInfo[0]
        }
      },
      // 切换学期
      getSelectXq(value){
        this.selectXqInfo = value
        this.currXQOrXnId = this.selectXqInfo[0]
        //this.getBjData(); // 得到班级信息
      },
      // 切换学年
      getSelectXn(value){
        this.selectXndInfo = value
        this.currXQOrXnId = this.selectXndInfo[0]
        // this.getBjData(); // 得到班级信息
      },

      // 点击班级
      goStuLst(selectCla, tabIdx) {
        this.getSelectedXQData(); // 得到选中的学期信息
        this.QD.parentPageData = {
          selectTab: tabIdx,
          selectBjData: selectCla,
          selectXqName: this.selectXqName,
          selectXqInfo: this.selectXqInfo,
          selectXndInfo: this.selectXndInfo,
          pyType: this.pyType,
          searchInfo: this.searchInfo
        };
        let xn = this.selectXqInfo[0]
        if (this.pyType === '2') {
          xn = this.selectXndInfo[0]
        }
        this.$router.push({
          path: '/stuLstByMoralNew',
          query: {
            classId: selectCla.bjid,
            pyType: this.pyType,
            xn: xn,
            showSearch: false,
            onlyQuery: true // onlyQuery 表示管理员只能查看，不能修改品德评语
          }
        })
      },
      // 得到筛选内容
      getSelectVal(selectIdxObj, selectInfoObj, gradeObj, yxObj, zyObj, claObj) {
        //console.log('点击班级', selectIdxObj, selectInfoObj)
        this.searchInfo = {selectIdxObj, selectInfoObj, gradeObj, yxObj, zyObj, claObj}
      },
      // 得到当前页面保存的数据
      getCurrPgData() {
        console.log('this.得到当前页面保存的数据得到当前页面保存的数据.meta=>', 'color:blue')
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.selectXqInfo = qd.selectXqInfo;
          this.selectXndInfo = qd.selectXndInfo;
          this.pyType = qd.pyType;
          this.classPgData = qd.classPgData;
          this.classInfo = qd.classInfo;
          this.searchInfo = qd.searchInfo;
          this.QD.parentPageData = null
        }
        if (this.QD.otherPageData && this.QD.otherPageData.selectInfo) {
          this.classPgData = this.QD.otherPageData;
          this.classInfo = this.QD.otherPageData.selectInfo;
          this.QD.otherPageData = null;
        }
        this.getYearsData(); // 得到学年度数据
        this.getXqData(); // 得到学期数据
      },
      // 得到选中的学期信息
      getSelectedXQData() {
        for (let i = 0; i < this.xqLst.length; i++) {
          let item = this.xqLst[i]
          if (this.selectXqInfo[0] === item.value) {
            this.selectXqName = item.name
          }
        }
      },
      // 得到学年度数据
      async getYearsData() {
        if (this.QD.xndList.length === 0) {
          this.updateLoadingStatus(true);
          this.QD.xndList = await this.QD.getSmsXNDData()
          this.updateLoadingStatus(false);
          this.QD.currentXnd = this.QD.xndList.find((n) => n.isDefault === true) // 当前学期
        }
        for (let i = 0; i < this.QD.xndList.length; i++) {
          let item = this.QD.xndList[i];
          this.pyXndLst.push({name: item.xnd + '', value: item.xnd + '', parent: 0})
        }
        if (this.selectXndInfo.length === 0) { // 当选择的学年度无信息时，初始化才赋值
          if (this.QD.currentXnd) {
            this.selectXndInfo[0] = this.QD.currentXnd.xnd + ''
          } else if (this.pyXndLst.length > 0) {
            this.selectXndInfo[0] = this.pyXndLst[0].name
          }
        }
        this.getPYType();
      },
      // 得到学期数据
      async getXqData() {
        this.xqLst = [];
        if (this.QD.xqList.length === 0) {
          this.QD.xqList = await this.QD.getSmstLst();
          this.QD.currentXQ = this.QD.xqList.find((n) => n.CurrentXQ === true)
        }
        for (let i = 0; i < this.QD.xqList.length; i++) {
          let item = this.QD.xqList[i];
          this.xqLst.push({name: item.XQMC, value: item.XQID + '', parent: 0})
        }
        if (this.selectXqInfo.length === 0) { // 当选择的学期无信息时，初始化才赋值
          if (this.QD.currentXQ) {
            this.selectXqInfo[0] = this.QD.currentXQ.XQID + ''
            this.selectXqName = this.QD.currentXQ.XQMC
          } else if (this.xqLst.length > 0) {
            this.selectXqInfo[0] = this.xqLst[0].XQID
            this.selectXqName = this.xqLst[0].name
          }
        }
        this.getPYType();
      }
    }
  }
</script>
<style lang="less">
  .admin-moral-select .gp .vux-cell-value{
    color: @tea-theme-color;
    margin-left:52px;
  }
</style>
<style scoped lang="less">
  .admin-moral-select{
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
  /* 搜索 */
  .serch-box{
    padding:20px 16px 4px;
  }

  /*评语类型 start*/
  .flex-block{
    display: flex;
  }
  .radio-cell{
    padding: 12px 16px 10px 16px;
    font-family: PingFang SC;
    background: #fff;
    .title-block{
      width: 70px;
      color: @color4;
      padding-right: 20px;
      line-height: 26px;
    }
    .content-block{
      flex: 1;
      margin-top:2px;
    }
    .category-item-pad{
      margin-top: 0;
    }
  }
  /*评语类型 end*/
</style>

