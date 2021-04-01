<!-- 管理员的品德评语 -->
<template>
  <!-- @cancel="searchCancelEvent" -->
  <div class="admin-moral-select">
    <van-search
      v-model="searchVal"
      show-action
      label=""
      placeholder="请输入姓名、学号、班级名称"
      @blur="blurSearch"
      @input="changeSearchVal"
    >
      <!-- 输入的值为空 或搜索有结果时 显示 ‘取消’ || searchObj && (searchObj.clazz.length>0 || searchObj.student.length>0) -->
      <template #action>
        <div v-if="!searchVal || !hadChangeSearchVal" @click="searchCancelEvent">取消</div>
        <div  v-else>搜索</div>
      </template>
    </van-search>
    <!-- 搜索结果 start -->
    <div v-if="showSearchResult && searchObj" class="search-content">
      <group v-if="searchObj.clazz.length>0" gutter="0">
        <!-- 班级-->
        <cell v-for="(cla, claIdx) in searchObj.clazz" :key="claIdx" @click.native="selectClaEvent(cla)" :is-link="true">
          <span slot="after-title" class="bjmc">{{cla.bjmc}}</span>
          <span slot="icon" class="school-wx-icon bj-icon">&#xe68c;</span>
        </cell>
      </group>
      <!-- 学生 -->
      <group v-else-if="searchObj.student.length>0" gutter="0">
        <cell v-for="(stu, stuIdx) in searchObj.student" :key="stuIdx" @click.native="selectStuEvent(stu)" :is-link="true">
          <div slot="after-title">
            <span class="xm">{{stu.xm}}</span>
            <span class="xh">({{stu.xh}})</span>
          </div>
          <span slot="icon" class="school-wx-icon stu-icon">&#xe68b;</span>
        </cell>
      </group>
      <van-empty v-else image="search" description="请换个词搜索" />
    </div>

    <!-- 搜索结果 end -->
    <div class="radio-cell flex-block">
      <div class="title-block">
        评语类型
      </div>
      <div class="content-block">
        <checker
          v-model="pyType"
          :default-item-class="'category-item-pad'"
          :selected-item-class="'category-item-pad-selected'"
        >
          <checker-item :value="1">学期</checker-item>
          <checker-item :value="2">学年</checker-item>
        </checker>
      </div>
    </div>
    <group gutter="0" class="gp">
      <popup-picker
        v-if="pyType === 2"
        title="学年"
        :placeholder="'请选择学年'"
        v-model="selectXndInfo"
        :data="pyXndLst"
        :columns="1"
        :show-name="true"
        :value-text-align="'center'"
      >
      </popup-picker>

      <popup-picker
        v-if="pyType === 1 && xqLst.length > 0"
        title="学期"
        :placeholder="'请选择学期'"
        v-model="selectXqInfo"
        :data="xqLst"
        :columns="1"
        :show-name="true"
        :value-text-align="'center'"
      >
      </popup-picker>
      <cell :is-link="true" value-align="left" @click.native="doSelectBjEvent">
        <span slot="after-title" class="bj-title">班级</span>
        <span v-if="classInfo" class="bj-value">
          {{classInfo.bjmc}}
        </span>
        <span v-else class="bj-placeholder">请选择班级</span>
      </cell>
    </group>
    <div class="btn-box">
      <van-button v-if="classInfo" class="look-btn" plain type="primary" @click="selectTargetCla">查看学生信息</van-button>
    </div>

  </div>
</template>
<script>
  import { RadioGroup, Radio, Button, Search, Empty } from 'vant'
  import { Group, Cell, PopupPicker, Checker, CheckerItem } from 'vux'
  import { mapActions } from 'vuex'
  export default {
    name: 'BzrMoralSelect',
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
      Checker,
      CheckerItem
    },
    data() {
      return {
        searchVal: '', // 搜索出来的值
        searchObj: null, // 搜索结果{clazz, student}
        hadChangeSearchVal: false, // 默认搜索框值没有发生改变
        showSearchResult: false, // 默认不显示搜索结果
        pyType: 1, // 学期评语 = 1,学年评语 = 2
        selectXndInfo: [], // 选择学年信息
        selectXqInfo: [], // 选择学期信息
        selectXqName: '', // 选中的学期名称
        pyXndLst: [], // 评语学年
        xqLst: [], // 评语学期
        classPgData: null, // 班级页面信息
        classInfo: null // 选中的班级信息
      }
    },
    created () {
      this.getCurrPgData()
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 搜索事件取消
      searchCancelEvent() {
        this.searchVal = ''; // 搜索框值清空
        this.searchObj = null; // 搜索结果清空
        this.showSearchResult = false
      },
      // 搜索框失去焦点
      blurSearch(val) {
        this.hadChangeSearchVal = false; // 搜索值不再发生改变
        this.searchEvent()
      },
      // 搜索框值改变时触发
      changeSearchVal(val) {
        this.hadChangeSearchVal = true
      },
      // 搜索事件
      async searchEvent() {
        if (!this.searchVal) { // 没有查询条件
          return
        }
        this.showSearchResult = true; // 显示搜索结果
        let njid = this.classInfo ? this.classInfo.njid : 0;
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetSearchClassOrStuData',
          njid: njid,
          keyword: this.searchVal
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log(d.msg);
        }
        console.log('search', d)
        this.searchObj = d.data
      },
      // 点击搜索出来的学生事件
      selectStuEvent(stu) {
        this.getSelectedXQData(); // 得到选中的学期信息
        this.QD.parentPageData = {
          selectBjData: stu,
          classInfo: this.classInfo,
          selectXqName: this.selectXqName,
          selectXqInfo: this.selectXqInfo,
          selectXndInfo: this.selectXndInfo,
          pyType: this.pyType,
          classPgData: this.classPgData
        };
        let xn = this.selectXqInfo[0]
        if (this.pyType === 2) {
          xn = this.selectXndInfo[0]
        }
        this.$router.push({path: '/stuMoralDetailBySearch', query: {xh: stu.xh, pyType: this.pyType, xn: xn}})
      },
      // 点击搜索出来的班级事件
      selectClaEvent(cla) {
        this.getSelectedXQData(); // 得到选中的学期信息
        this.QD.parentPageData = {
          selectBjData: cla, // 学生列表页面需要显示班级名称
          classInfo: this.classInfo,
          selectXqName: this.selectXqName,
          selectXqInfo: this.selectXqInfo,
          selectXndInfo: this.selectXndInfo,
          pyType: this.pyType,
          classPgData: this.classPgData
        };
        this.goStuLstPg(cla.bjid) // 到学生列表页面
      },
      // 点击选择目标班级事件
      selectTargetCla() {
        this.getSelectedXQData(); // 得到选中的学期信息
        this.QD.parentPageData = {
          selectBjData: this.classInfo,
          classInfo: this.classInfo,
          selectXqName: this.selectXqName,
          selectXqInfo: this.selectXqInfo,
          selectXndInfo: this.selectXndInfo,
          pyType: this.pyType,
          classPgData: this.classPgData
        };
        this.goStuLstPg(this.classInfo.bjid) // 到学生列表页面
      },
      // 到学生列表页面
      goStuLstPg (bjid) {
        let xn = this.selectXqInfo[0]
        if (this.pyType === 2) {
          xn = this.selectXndInfo[0]
        }
        // onlyQuery 表示管理员只能查看，不能修改品德评语
        this.$router.push({path: '/stuLstByMoral', query: {classId: bjid, pyType: this.pyType, xn: xn, onlyQuery: true}})
      },
      // 得到当前页面保存的数据
      getCurrPgData() {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.selectXqInfo = qd.selectXqInfo;
          this.selectXndInfo = qd.selectXndInfo;
          this.pyType = qd.pyType;
          this.classPgData = qd.classPgData;
          this.classInfo = qd.classInfo;
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
        for (let i=0; i<this.xqLst.length; i++) {
          let item = this.xqLst[i]
          if (this.selectXqInfo[0] === item.value) {
            this.selectXqName = item.name
          }
        }
      },
      // 做选择班级
      doSelectBjEvent() {
        // 选择班级页面中选择数据 渲染在页面上
        if (this.classPgData) {
          this.QD.otherPageData = this.classPgData;
        }
        this.$router.push({path: "/classWholeSchool/classWholeSchoolLst"});
      },
      // 得到学年度数据
      async getYearsData() {
        if (this.QD.xndList.length === 0) {
          this.updateLoadingStatus(true);
          this.QD.xndList = await this.QD.getSmsXNDData()
          this.updateLoadingStatus(false);
          this.QD.currentXnd = this.QD.xndList.find((n) => n.isDefault === true) // 当前学期
        }
        for (let i=0; i<this.QD.xndList.length; i++) {
          let item = this.QD.xndList[i];
          this.pyXndLst.push({name: item.xnd + '', value: item.xnd + '', parent: 0})
        }
        if (this.selectXndInfo.length === 0) { // 当选择的学年度无信息时，初始化才赋值
          if (this.QD.currentXnd) {
            this.selectXndInfo[0] = this.QD.currentXnd.xnd + ''
          } else if (this.pyXndLst.length > 0) {
            this.selectXndInfo[0] =this.pyXndLst[0].name
          }
        }
      },
      // 得到学期数据
      async getXqData() {
        this.xqLst = [];
        if (this.QD.xqList.length === 0) {
          this.QD.xqList = await this.QD.getSmstLst();
          this.QD.currentXQ = this.QD.xqList.find((n) => n.CurrentXQ === true)
        }
        for (let i=0; i<this.QD.xqList.length; i++) {
          let item = this.QD.xqList[i];
          this.xqLst.push({name: item.XQMC, value: item.XQID + '', parent: 0})
        }
        if (this.selectXqInfo.length === 0) { // 当选择的学期无信息时，初始化才赋值
          if (this.QD.currentXQ) {
            this.selectXqInfo[0] = this.QD.currentXQ.XQID + ''
            this.selectXqName = this.QD.currentXQ.XQMC
          } else if (this.xqLst.length > 0) {
            this.selectXqInfo[0] =this.xqLst[0].XQID
            this.selectXqName = this.xqLst[0].name
          }
        }
      }
    }
  }
</script>
<style scoped lang="less">
  /* 搜索 start */
  .search-content{
    position: absolute;
    top: 100px;
    bottom: 0;
    width: 100%;
    overflow-y: auto;
    z-index: 2;
    background-color: #ffffff;
    .bj-icon,
    .stu-icon{
      font-size: 22px;
      color: @tea-theme-color;
    }
    .bjmc,
    .xm{
      font-size: 16px;
      color: #18191A;
    }
    .xh{
      font-size: 16px;
      color: #666666;
    }
  }
  /* 搜索 end */
  .flex-block{
    display: flex;
  }
  .radio-cell{
    padding: 22px 16px 10px 16px;
    .title-block{
      width: 70px;
      padding-right: 20px;
      line-height: 26px;
    }
    .content-block{
      flex: 1;
    }
    .category-item-pad{
      margin-top: 0;
    }
  }
  .bj-value{
    display: block;
    text-align: center;
    color: #333333;
  }
  .bj-placeholder{
    display: block;
    text-align: center;
    color: #999999;
  }
  .btn-box{
    width: 100%;
    padding-top: 20px;
    text-align: center;
    .look-btn{
      border: 1px solid @color3;
      color: @color3;
    }
  }
</style>
<style lang="less">
  .admin-moral-select .gp .vux-cell-value{
    color: #333333;
  }
</style>
