<template>
  <div class="seleClassForME">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="seleClass">
      <div class="selectGrade-lf">
        <a>年级<span class="school-wx-icon" slot="icon" style="color:#333333;">&#xe638;</span></a>
        <scroller lock-x :scrollbar-y="true" height="-116" style="padding-top: 19px;">
          <div>
            <a v-for="(grad, gidx) in gradeList" :key="gidx" v-on:click.stop.prevent="getClass(grad.NJID,gidx)" :class="{ 'gradebackgColor-link':gidx === isActiveGrade }">{{grad.NJMC}}</a>
          </div>
        </scroller>
      </div>
      <div class="selectClass-rg">
        <a>班级<span class="school-wx-icon" slot="icon" style="color:#666666;">&#xe638;</span></a>
        <scroller ref="scrollerLst" lock-x :scrollbar-y="true" height="-116" style="background-color: #f2f2f2;padding-top: 19px;">
          <div>
            <a v-for="(cla, cidx) in classList" :key="cidx" v-on:click.stop.prevent="clickClass(cla.BJMC, cidx)">{{cla.BJMC}}</a>
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Scroller from 'vux/src/components/scroller/index.vue'
  export default {
    name: 'selectClassForME',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Scroller
    },
    methods: {
      clickClass (bjmc, id) {
        let bjid = this.classList[id].BJID; // 项目id
        let selectClassMEData = JSON.stringify([{'BJID': bjid, 'BJMC': bjmc}]);
        sessionStorage.setItem("classMEData", selectClassMEData); // bjmc 班级名称
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1); // 选择班级之后 跳转到德育登记页面，并把学生的信息保存在sessionstorage中 传参
        }
      },
      // 获取年级信息2015级2016级
      async getGrade() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuGrade'});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.gradeList = d;
        if (this.gradeList.length > 0) {
          this.getClass(d[0].NJID, 0);
        }
      },
      // 根据专业id 和班级id 获取班级信息,0全部专业,0全部班级
      async getClass(njId, gindex) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetMEStuClass', ZYID: 0, NJID: njId});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.classList = d;
        this.isActiveGrade = gindex;  //  年级背景颜色改变
        this.$nextTick(() => {
          this.$refs.scrollerLst.reset({top: 0})
        })
      }
    },
    created () {
      this.getGrade();
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        isActiveGrade: 0, // 改变年级背景颜色
        gradeList: [], // 年级信息
        classList: [] // 班级信息
      }
    }
  }
</script>
<style scoped>
  .seleClassForME{background-color: #ffffff;}
  .seleClassForME .seleClass .selectGrade-lf{
    float: left;
    width:30%;
    background-color:#ffffff;
    border-right: 1px solid #f2f2f2;
  }
  .seleClassForME .seleClass .selectGrade-lf a{
    display: block;
    line-height: 1.41176471;
    text-align: center;
    padding:10px 15px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .seleClassForME .seleClass .selectClass-rg{
    float: left;
    width:69%;
    background-color:#ffffff;
  }
  .seleClassForME .seleClass .selectClass-rg a{
    display: block;
    text-align: center;
    line-height: 1.41176471;
    padding:10px 15px;
    font-size: 16px;
    color: #999999;
    border-bottom: 1px solid #e5e5e5;
  }
  .seleClassForME .seleClass .selectGrade-lf .gradebackgColor-link{
    color: #ffa500;
    background-color: #f2f2f2;
  }
  .seleClassForME .seleClass .selectClass-rg .classbackgColor-link{
    color: #ffa500;
    background-color: #f2f2f2;
  }
</style>
<style>
 /* .seleClassForME .seleClass .selectClass-rg .xs-container{ margin-top: 0; }*/
</style>
