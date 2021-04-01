<template>
  <div class="bzr-moral-select-new">
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

    <!--班级列表 start-->
    <div>
      <class-lst :lst = bjLst v-if="bjLst && bjLst.length > 0" @go-detail="goStuLstPg"></class-lst>
      <van-empty description="数据为空" v-else/>
    </div>
    <!--班级列表 end-->
  </div>
</template>
<script>
  import { RadioGroup, Radio, Empty } from 'vant'
  import { Group, Cell, PopupPicker, Checker, CheckerItem } from 'vux'
  import { mapActions } from 'vuex'
  import classLst from './components/ClassLst.vue'
  export default {
    name: 'BzrMoralSelectNew',
    directives: {
    },
    components: {
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      [Empty.name]: Empty,
      Group,
      Cell,
      PopupPicker,
      Checker,
      CheckerItem,
      classLst
    },
    data() {
      return {
        bjLoaded: true, // 获取班级 loaded
        pyType: '1', // 学期评语 = 1,学年评语 = 2
        selectXndInfo: [], // 选择学年信息
        selectXqInfo: [], // 选择学期信息
        selectXqName: '', // 选中的学期名称
        bjLst: [], // 班级信息，获取班主任身份所带的班级
        pyXndLst: [], // 评语学年
        xqLst: [], // 评语学期
        pyTypeLst: [{title: '学期', value: '1'}, {title: '学年', value: '2'}], // 评语类型
        currXQOrXnId: '', // 当前选中的学期、学年id
        lst: []
      }
    },
    created () {
      this.getCurrPgData()
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 切换评语类型
      getPYType() {
        this.getSelectedXQData(); // 得到选中的学期信息
        this.currXQOrXnId = this.selectXqInfo[0]
        if (this.pyType === '2') {
          this.currXQOrXnId = this.selectXndInfo[0]
        }
        console.log('切换评语类型', this.currXQOrXnId)
        this.getBjData(); // 得到班级信息
      },
      // 切换学期
      getSelectXq(value){
        this.selectXqInfo = value
        this.currXQOrXnId = this.selectXqInfo[0]
        this.getBjData(); // 得到班级信息
      },
      // 切换学年
      getSelectXn(value){
        this.selectXndInfo = value
        this.currXQOrXnId = this.selectXndInfo[0]
        this.getBjData(); // 得到班级信息
      },
      // 得到当前页面保存的数据
      getCurrPgData() {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.selectXqInfo = qd.selectXqInfo;
          this.selectXndInfo = qd.selectXndInfo;
          this.pyType = qd.pyType;
          this.QD.parentPageData = null
        }
        this.getYearsData(); // 得到学年度数据
        this.getXqData(); // 得到学期数据
      },
      // 到学生列表页面
      goStuLstPg (bj, tabIdx) {
        this.getSelectedXQData(); // 得到选中的学期信息
        let xn = this.selectXqInfo[0]
        if (this.pyType === 2) {
          xn = this.selectXndInfo[0]
        }
        this.QD.parentPageData = {
          selectTab: tabIdx,
          selectBjData: bj,
          selectXqName: this.selectXqName,
          selectXqInfo: this.selectXqInfo,
          selectXndInfo: this.selectXndInfo,
          pyType: this.pyType
        }
        this.$router.push({
          path: '/stuLstByMoralNew',
          query: {
            classId: bj.bjid,
            pyType: this.pyType,
            xn: xn,
            showSearch: true
          }
        })
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
      // 得到班级信息 GetClassDataForMorlComment
      async getBjData() {
        console.log('得到班级信息')
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassDataForMorlCommentV2',
          moralType: this.pyType *1,
          xn: this.currXQOrXnId * 1
        });
        this.updateLoadingStatus(false);
        this.bjLoaded = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          return []
        }
        console.log("班级信息bj = ", d)
        this.bjLst = d.data
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
        this.getPYType();
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
        this.getPYType();
      }
    }
  }
</script>
<style scoped lang="less">
  .bzr-moral-select-new{
    background: #f2f2f2;
  }
  .flex-block{
    display: flex;
  }
  .radio-cell{
    padding: 22px 16px 10px 16px;
    background: #fff;
    .title-block{
      width: 70px;
      padding-right: 20px;
      line-height: 26px;
    }
    .content-block{
      flex: 1;
      margin-top:2px;
    }
  }
</style>
<style lang="less">
  .bzr-moral-select-new {
    .gp{
      .vux-cell-value{
        color: @tea-theme-color;
        margin-left:52px;
      }
      .weui-cells:before,
      .weui-cells:after,
      .vux-cell-box:before{
        display: none;
      }
    }
  }
</style>
