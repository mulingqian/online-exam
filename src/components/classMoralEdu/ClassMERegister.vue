<template>
  <div class="classMERegister eachPgBase">
    <group class="eachPgBase gp">
      <datetime
        format="YYYY-MM-DD HH:mm" :minute-list="['00','01', '02', '03', '04', '05', '06', '07', '08','09', '10', '11',
         '12', '13', '14', '15', '16','17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35',
         '36', '37', '38', '39', '40','41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']"
        v-model="breachTime">
        <span slot="title" class="vux-label">违纪时间</span>
      </datetime>
      <cell @click.native="goSelectClassForME()" :is-link="true">
        <span slot="after-title" class="vux-label">班级</span>
        <span class="cell-right">{{bjmc}}</span>
      </cell>
      <cell @click.native="goSelectClassMEItem()" :is-link="true">
        <span slot="after-title" class="vux-label">项目</span>
        <div class="cell-right">
          <span class="each-item" v-if="itemInfo.length > 0"
                v-for="(s, sIdx) in itemInfo" :key="sIdx">
            <i v-if="sIdx !== 0"> , </i>
            {{s.ProjectName}}
          </span>
          <span v-if="itemInfo.length === 0">选择</span>
        </div>
      </cell>
      <div v-if="itemInfo.length > 0" class="gp-descTitle">加减分</div>
      <cell v-if="itemInfo.length > 0" v-for="(s, sIdx) in itemInfo" :key="sIdx">
        <span slot="after-title" class="autoWidth">{{s.ProjectName}}</span>
        <div class="cell-right">
          <span v-if="s.Type === '1'" class="negative-mark">-</span>
          <input type="number" v-model="s.Point" class="point-input" />
        </div>
      </cell>
      <div class="gp-descTitle">备注</div>
      <x-textarea class="remark-box" placeholder="请填写备注" :show-counter="false" :rows="1" autosize v-model="remark"></x-textarea>
    </group>
    <div class="btn-box">
      <x-button @click.native="addClassMEData" type="primary" class="btn-save" mini>保存</x-button>
    </div>
  </div>
</template>
<script>
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Datetime from 'vux/src/components/datetime/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'classMERegister',
    components: {
      XTextarea,
      Cell,
      Group,
      XButton,
      Datetime
    },
    methods: {
        // 跳转到选择班级页面
      goSelectClassForME () {
        this.saveCurrPageData(); // 保存本页面的数据
        this.$router.push('/selectClassForME');
      },
      // 跳转到选择班级项目的页面
      goSelectClassMEItem () {
        this.saveCurrPageData(); // 保存本页面的数据
        this.$router.push('/selectClassMEItem');
      },
      // 点击保存，德育登记
      async addClassMEData() {
        if (this.bjid === ''){
          this.QD.alert('', '请选择班级');
          return;
        }
        if (this.itemInfo.length === 0){
          this.QD.alert('', '请选择项目');
          return;
        }
        let items = [];
        for (let i=0; i<this.itemInfo.length; i++) {
          let si = this.itemInfo[i];
          items.push({
            ItemId: si.ID, // 项目id
            ItemParent: si.ParentID, // 项目类型id
            AddOrSub: si.Type, // 加减分类型
            ScoreValue: si.Point, // 分数
            SubType: si.parent.ProjectName // 项目类型名称
          })
        }
        console.log("items", items);
        let objData = {BJID: this.bjid, Remark: this.remark, BreachTime: this.breachTime, Items: items};
        let that = this;
        this.QD.confirm('', '确认登记', async function(){
          that.updateLoadingStatus(true);
          let d = await that.QD.getData('/ComApi/PostObject', {apiName: 'SaveClassEduData', objData: JSON.stringify(objData)});
          that.updateLoadingStatus(false);
          console.log("d", d);
          if (d.status && d.status === "error") {
            that.QD.alert('', '登记失败');
            return;
          }
          that.$router.go(-1); // 登记成功
        }, '');
      },
      // 获取当前时间
      getCurrTime() {
        this.breachTime = this.QD.getDateOrTime(); // 得到当前时间
        this.breachTime = this.breachTime.substr(0, 16); // 去掉秒，保留年月日时分
      },
      // 保存本页面的数据 - 时间
      saveCurrPageData () {
        this.QD.currPageData = {breachTime: this.breachTime, remark: this.remark, itemInfo: this.itemInfo};
      },
       // 得到当前页面保存的信息
      getCurPageData () {
        if (this.QD.currPageData) {
          let qd = this.QD.currPageData;
          this.breachTime = qd.breachTime;
          this.remark = qd.remark;
          this.itemInfo = qd.itemInfo; // 项目
          this.QD.currPageData = null;
        } else {
          this.getCurrTime(); // 获取当前时间
        }
        this.getSelectClassData();  // 得到选择班级中的信息
        this.getSelectProjectData(); // 得到选择项目中的信息
      },
        // 得到选择班级中的信息
      getSelectClassData (){
        if (sessionStorage.getItem("classMEData") !== null) {
          let classData = JSON.parse(sessionStorage.getItem("classMEData")); // 从sessionStorage中取学分项目信息
          this.bjmc = classData[0].BJMC;
          this.bjid = classData[0].BJID;
        } else {
          this.bjmc = '选择';
        }
      },
       // 得到选择项目中的信息
      getSelectProjectData () {
        console.log("itemInfo", this.itemInfo);
        if (this.QD.otherPageData || this.itemInfo) {
          let qd = [];
          if (this.QD.otherPageData) {
            qd = this.QD.otherPageData.itemInfo;
            this.QD.otherPageData = null;
          } else {
            qd = this.itemInfo;
          }
          this.itemInfo = qd;
          if (this.remark === '') { // 当用户没有写备注时，根据选中的项目自动生成备注
            for (let i=0; i<this.itemInfo.length; i++) {
              let si = this.itemInfo[i];
              if (i !== 0) {
                this.remark += ' , ';
              }
              this.remark += si.ProjectName;
            }
          }
        }
      },
      ...mapActions([
        'updateLoadingStatus'
      ])
    },
    created () {
      this.getCurPageData(); // 得到当前页面保存的信息
    },
    data () {
      return {
        breachTime: '', // 违纪时间
        bjmc: '', // 班级名称
        bjid: '', // 班级id
        itemInfo: [], // 选中的项目信息
        xfProDetail: '', // 细则项目名称
        remark: '' // 备注
      }
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -20px;
    margin-bottom: 60px;
  }
  .cell-right{
    color: #666666;
    font-size: 16px;
  }
  .each-item{
    display: inline-block;
    padding-left: 4px;
  }
  .classMERegister .vux-label{
    display: inline-block;
    width: 70px;
    color: #333333;
    font-size: 16px;
  }
  .autoWidth{
    color: #333333;
    font-size: 16px;
  }
  .negative-mark{
    color: #bd2c00;
  }
  .point-input{
    outline: none;
    width: 80px;
    height: 24px;
    border: 1px solid #d4d4dd;
    padding: 0 4px;
  }
  .remark-box{
    font-size: 14px;
    color: #666666;
    font-family:'Microsoft YaHei','\5FAE\8F6F\96C5\9ED1';
  }
  .btn-box{
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
  .btn-save{
    width: 100%;
    height: 40px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
  }
</style>
