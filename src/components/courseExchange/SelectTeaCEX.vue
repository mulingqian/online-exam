<template>
  <div>
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div class="search_box">
      <x-input placeholder="请输入教师名字或职工号" v-model="searchName" v-on:input="searchNameBtn">
        <x-button slot="right" type="primary" mini @click.native="searchNameBtn">搜索</x-button>
      </x-input>
    </div>
    <div>
      <div class="gpBox">
        <group class="gp" v-if="searchTeaInfo.length > 0">
          <cell :is-link="true" v-for="(s, sidx) in searchTeaInfo" :key="sidx" @click.native="selectTeaInfo(s)">
            <span slot="after-title">{{s.xm}} <span class="zghVal"> ({{s.zgh}})</span></span>
          </cell>
        </group>
      </div>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  export default {
    name: 'selectTeaCEX',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      XButton,
      XInput,
      Scroller
    },
    methods: {
      // 选中教师
      selectTeaInfo (s) {
        this.QD.otherPageData = s; // 代课老师
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 搜索教师的姓名
      searchNameBtn() {
        let result = [];
        if (this.searchName !== '') {
          for (let i = 0; i < this.teaInfo.length; i++) {
            if (this.teaInfo[i].xm.indexOf(this.searchName) >= 0 || this.teaInfo[i].zgh.indexOf(this.searchName) >= 0 ) {
              result.push(this.teaInfo[i]);
            }
          }
        } else {
          result = this.teaInfo;
        }
        this.searchTeaInfo = result;
      },
      // 得到可选的教师 semTeacherOnly - true：从本学期有上课的老师中选择代课老师 ; false：从全校范围选择代课老师
      async getEmployeeData() {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetEmployeeScheduleChange', semTeacherOnly: true, semId: this.pkXqInfo.XQID});
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取教师信息失败`);
          return;
        }
        d = JSON.parse(d); // 将字符串化成对象
        console.log(d);
        this.teaInfo = d.Teachers;
        this.searchTeaInfo = d.Teachers;
      },
      // 得到其他页面的相关数据
      getRelativeData () {
        if (this.QD.currPageData) {
          let cqd = this.QD.currPageData;
          this.pkXqInfo = cqd.pkXqInfo; // 排课学期信息
          console.log("tea relative data = ", this.pkXqInfo);
          this.getEmployeeData(); // 得到可选的教师
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getRelativeData(); // 得到其他页面的相关数据
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        pkXqInfo: null, // 排课学期信息
        searchName: '', // 搜索出来的教师姓名
        teaInfo: [], // 可选教师信息-all
        searchTeaInfo: [] // 查询得到的空闲教室
      }
    }
  }
</script>
<style scoped>
  .search_box{
    position: absolute;
    width: 100%;
    z-index: 100;
    font-size: 14px;
    border-bottom: 1px solid #f2f2f2;
    background-color: #fff;
  }
  .gpBox{
    position: relative;
    top: 50px;
    padding-top: 10px;
    background-color: #f5f5f9;
  }
  .gpBox .gp{
    margin-top: -1.25em;
  }
  .zghVal{
    font-size: 14px;
    color: #666666;
  }
</style>
