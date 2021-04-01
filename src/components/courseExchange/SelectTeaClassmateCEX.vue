<template>
  <div class="eachPgBase selectTeaClassmate">
    <div class="eachPgBase container">
      <div v-transfer-dom>
        <loading v-model="loading"></loading>
      </div>
      <div class="tabField">
        <tab-change class="tab-box" :tabItemLst="tabTypeLst" :selectedTabType="1" @get-TabVal="typeTabClick"></tab-change>
        <template v-if="selectTabType === 2">
          <x-input placeholder="请输入教师姓名" v-model="searchName" v-on:input="searchNameBtn">
            <x-button slot="right" type="primary" mini @click.native="searchNameBtn">搜索</x-button>
          </x-input>
        </template>
      </div>
      <!-- 同班任课老师 start -->
      <div v-if="selectTabType === 1" class="teaInfoField1">
        <group class="gp">
          <cell v-for="(s, sidx) in sameBJTeaInfo" :key="sidx" :is-link="true" @click.native="selectTeaWay(s)">
            <div slot="after-title">
              <p>{{s.xm}}<span class="zghVal">({{s.zgh}})</span></p>
            </div>
          </cell>
        </group>
      </div>
      <!-- 同班任课老师 end -->
      <!-- 同教研组任课老师 start -->
      <div v-if="selectTabType === 2" class="teaInfoField2">
        <group class="gp">
          <cell :is-link="true" v-for="(s, idx) in searchJYZTeaInfo" :key="idx" @click.native="selectTeaWay(s)">
            <div slot="after-title">
              <p>{{s.xm}}<span class="zghVal">({{s.zgh}})</span></p>
            </div>
          </cell>
        </group>
      </div>
      <!-- 同教研组任课老师 end -->
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import TabChange from '../common/TabChange.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  export default {
    name: 'selectTeaClassmateCEX',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      PopupPicker,
      TabChange,
      XButton,
      XInput
    },
    methods: {
      // 选择对调教师
      selectTeaWay (s) {
        this.QD.otherPageData = {teaInfo: s, newCourseInfo: null};
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      // 点击tab标题，切换常用岗位申请和临时岗位申请
      typeTabClick(e) {
        this.selectTabType = e.type;
      },
      // 点击搜索教师姓名
      searchNameBtn () {
        let result = [];
        if (this.searchName !== '') {
          for (let i = 0; i < this.sameJYZTeaInfo.length; i++) {
            if (this.sameJYZTeaInfo[i].xm.indexOf(this.searchName) >= 0) {
              result.push(this.sameJYZTeaInfo[i]);
            }
          }
        } else {
          result = this.sameJYZTeaInfo;
        }
        this.searchJYZTeaInfo = result;
      },
      // 读取申请老师相同教研组的其他任课老师
      async getSameGroupTeaInfo () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetSameGroupTeacher',
          semId: this.pkXqInfo.XQID
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取申请数据失败:${d.msg}`);
          return;
        }
        d = JSON.parse(d);
        console.log("same jyz tea = ", d);
        this.sameJYZTeaInfo = d.teacherList;
        this.searchJYZTeaInfo = this.sameJYZTeaInfo;
      },
      // 读取申请老师相同授课行政班的其他任课老师-同班任课老师
      async getSameClassTeaInfo () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetSameClassTeacherForTK',
          semId: this.pkXqInfo.XQID
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          console.log(`获取申请数据失败:${d.msg}`);
          return;
        }
        d = JSON.parse(d);
        console.log("same class tea = ", d);
        this.sameBJTeaInfo = d.teacherList;
      },
      // 得到基础信息
      getBaseInfo () {
        if (this.QD.currPageData) {
          this.pkXqInfo = this.QD.currPageData.pkXqInfo; // 排课学期信息
          this.getSameClassTeaInfo(); // 同班任课老师
          this.getSameGroupTeaInfo(); // 读取申请老师相同教研组的其他任课老师
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getBaseInfo(); // 得到基础信息
    },
    data () {
      return {
        loading: false,
        backLoaded: true,
        searchName: '', // input输入教师的姓名
        selectTabType: 1, // 默认选中的是同班任课老师
        // tab 类型集合
        tabTypeLst: [{
          title: '同班任课老师',
          type: 1
        }, {
          title: '同教研组任课老师',
          type: 2
        }],
        pkXqInfo: null, // 排课学期信息
        sameBJTeaInfo: [], // 同班任课老师数据
        sameJYZTeaInfo: [], // 同教研组任课老师数据
        searchJYZTeaInfo: [] // 搜索教研组任课老师数据
      }
    }
  }
</script>
<style scoped>
  .selectTeaClassmate.selectTeaClassmate{
    position: relative;
    top: 0;
  }
  .tabField{
    position: fixed;
    width: 100%;
    z-index: 20;
    background-color: #fff;
  }
  .teaInfoField1{
    position: relative;
    top: 44px;
  }
  .zghVal{
    display: inline-block;
    padding-left: 6px;
    font-size: 14px;
    color: #666;
  }
  .teaInfoField2{
    position: relative;
    top: 93px;
    padding-top: 10px;
  }
.gp{
  margin-top: -1.25em;
}
</style>
