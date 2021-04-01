<template>
  <div class="bzr-moral-select">
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
    </group>

    <div class="bj-block">
      <div class="bj-desc">
        <span v-if="bjLst.length > 0" class="had-data">可以登记的班级</span>
        <span v-else-if="!bjLoaded" class="no-data">无班级信息</span>
      </div>
      <group gutter="0">
        <cell v-for="(bj, bjIndex) in bjLst" :key="bjIndex" :is-link="true" @click.native="goStuLstPg(bj)">
          <span slot="after-title">{{bj.bjmc}}</span>
        </cell>
      </group>
    </div>
    
  </div>
</template>
<script>
  import { RadioGroup, Radio } from 'vant'
  import { Group, Cell, PopupPicker, Checker, CheckerItem } from 'vux'
  import { mapActions } from 'vuex'
  export default {
    name: 'BzrMoralSelect',
    directives: {
    },
    components: {
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
      Group,
      Cell,
      PopupPicker,
      Checker,
      CheckerItem
    },
    data() {
      return {
        bjLoaded: true, // 获取班级 loaded
        pyType: 1, // 学期评语 = 1,学年评语 = 2
        selectXndInfo: [], // 选择学年信息
        selectXqInfo: [], // 选择学期信息
        selectXqName: '', // 选中的学期名称
        bjLst: [], // 班级信息，获取班主任身份所带的班级
        pyXndLst: [], // 评语学年
        xqLst: [] // 评语学期
      }
    },
    created () {
      this.getCurrPgData()
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 得到当前页面保存的数据
      getCurrPgData() {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.selectXqInfo = qd.selectXqInfo;
          this.selectXndInfo = qd.selectXndInfo;
          this.pyType = qd.pyType;
          this.QD.parentPageData = null
        }
        this.getBjData(); // 得到班级信息
        this.getYearsData(); // 得到学年度数据
        this.getXqData(); // 得到学期数据
      },
      // 到学生列表页面
      goStuLstPg (bj) {
        this.getSelectedXQData(); // 得到选中的学期信息
        let xn = this.selectXqInfo[0]
        if (this.pyType === 2) {
          xn = this.selectXndInfo[0]
        }
        this.QD.parentPageData = {
          selectBjData: bj,
          selectXqName: this.selectXqName,
          selectXqInfo: this.selectXqInfo,
          selectXndInfo: this.selectXndInfo,
          pyType: this.pyType
        }
        this.$router.push({path: '/stuLstByMoral', query: {classId: bj.bjid, pyType: this.pyType, xn: xn}})
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
      // 得到班级信息
      async getBjData() {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassDataForMorlComment'
        });
        this.updateLoadingStatus(false);
        this.bjLoaded = false;
        if (d.status && d.status === "error") {
          console.log(d.msg);
          return []
        }
        console.log("bj = ", d)
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
  .bzr-moral-select{
  }
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
  
  .bj-block{
    .bj-desc{
      font-size: 14px;
      color: #666666;
    }
    .had-data{
      display: block;
      padding: 10px 15px;
      background-color: @bg-color12;
    }
    .no-data{
      display: block;
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
<style lang="less">
  .bzr-moral-select .gp .vux-cell-value{
    color: #333333;
  }
</style>
