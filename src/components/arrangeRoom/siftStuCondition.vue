<template>
  <div class="siftConditionContainer">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <!-- 筛选 start -->
    <group class="siftBox">
      <cell @click.native="showPanelWay">
        <div slot="after-title">
          <span slot="icon" class="school-wx-icon selectIcon">&#xe65f;</span>
          <span class="siftText">筛选</span>
        </div>
      </cell>
    </group>
    <!-- 筛选 end -->
    <div v-transfer-dom>
      <popup :hide-on-blur="false" v-model="showPanel" position="right" width="80%" style="background-color: #ffffff;">
        <div>
          <span class="panel-Head">筛选</span>
        </div>
        <div style="padding:34px 0 55px 0;">
          <group style="margin-top: -1.25em;">
            <cell><span slot="after-title" class="category-Head">年级</span></cell>
            <div class="option-box clearfloat">
              <a v-if="gInfo && gInfo.length>0" @click="selectGradeInfo(allInfo, 0)" :class="selectId.gradeId === 0 ? 'select-a-BgC' : ''">{{allInfo.name}}</a>
              <a @click="selectGradeInfo(s, 1)" v-for="(s, sIndex) in gInfo" :key="sIndex" :class="selectId.gradeId === s.njid ? 'select-a-BgC' : ''">{{s.njmc}}</a>
            </div>
            <cell><span slot="after-title" class="category-Head">专业</span></cell>
            <div class="option-box clearfloat">
              <a v-if="mInfo && mInfo.length>0" @click="selectMajorInfo(allInfo, 0)" :class="selectId.majorId === 0 ? 'select-a-BgC' : ''">{{allInfo.name}}</a>
              <a @click="selectMajorInfo(s, 1)" v-for="(s, sIndex) in mInfo" :key="sIndex" :class="selectId.majorId === s.zyid ? 'select-a-BgC' : ''">{{s.zymc}}</a>
            </div>
            <cell><span slot="after-title" class="category-Head">班级</span></cell>
            <div class="option-box clearfloat">
              <!--<a v-if="cInfo && cInfo.length>0" @click="selectClassInfo(allInfo, 0)" :class="selectId.claId === 0 ? 'select-a-BgC' : ''">{{allInfo.name}}</a>-->
              <a @click="selectClassInfo(s, 1)" v-for="(s, sIndex) in cInfo" :key="sIndex" :class="selectId.claId === s.bjid ? 'select-a-BgC' : ''">{{s.bjmc}}</a>
            </div>
          </group>
        </div>
        <div class="button-box">
          <x-button mini type="primary" class="sureSeleVal" @click.native="sureButton">确定</x-button>
        </div>
      </popup>
    </div>

  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Popup from 'vux/src/components/popup/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  export default {
    name: 'arrangeRoom-siftStuCondition',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      Popup,
      XButton
    },
    props: {
      teaUserInfo: { // 当前教师用户信息
        type: Object,
        default: null
      }
    },
    methods: {
      // 显示右边的筛选内容
      showPanelWay () {
        this.showPanel = true; // 搜索面板显示
        this.$emit('clickEvent');
      },
      // 设置传向父级的值
      setEmitVal () {
        return {classInfo: this.selectInfo.cla, classId: this.selectId.claId, gradeId: this.selectId.gradeId}; //  gradeId-年级id,classId-班级id
      },
      // 点击确定按钮
      sureButton () {
        this.showPanel = false; // 搜索面板不显示 gradeId-年级id,classId-班级id
        // this.$emit('get-selectVal', this.setEmitVal());
      },
      // 选中的年级信息
      selectGradeInfo (s, type) {
        this.selectInfo.grade = s;
        if (type === 1) {
          this.selectId.gradeId = s.njid;
        } else {
          this.selectId.gradeId = 0;
        }
        this.getClassInfo(); // 读取班主任负责班级
      },
      // 选中的专业信息
      selectMajorInfo (s, type) {
        this.selectInfo.major = s;
        if (type === 1) {
          this.selectId.majorId = s.zyid;
        } else {
          this.selectId.majorId = 0;
        }
        this.getClassInfo(); // 读取班主任负责班级
      },
      // 选中的班级信息
      selectClassInfo (s, type) {
        this.selectInfo.cla = s;
        if (type === 1) {
          this.selectId.claId = s.bjid;
        } else {
          this.selectId.claId = 0;
        }
        this.$emit('get-selectVal', this.setEmitVal());
      },
      // 读取班主任负责班级对应的年级
      async getGradeInfo () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassMasterGrade'
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取年级数据失败`);
          console.log(d.msg);
          return;
        }
        this.gInfo = JSON.parse(d).data;
        console.log(this.gInfo);
      },
      // 读取班主任负责班级对应的专业
      async getMajorInfo () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassMasterSpecialty'
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败`);
          console.log(d.msg);
          return;
        }
        this.mInfo = JSON.parse(d).data;
        console.log(this.mInfo);
      },
      // 读取班主任负责班级 0 代表全部
      async getClassInfo () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetClassMasterClasses',
          njid: this.selectId.gradeId,
          zyid: this.selectId.majorId
        });
        this.loading = false;
        if (d.status && d.status === "error") {
          this.QD.alert(`获取班级数据失败`);
          console.log(d.msg);
          return;
        }
        this.cInfo = JSON.parse(d).data;
        if (this.cInfo.length > 0) {
          this.selectId.claId = this.cInfo[0].bjid; // 默认选中第一个
          this.selectInfo.cla = this.cInfo[0];
        } else {
          this.selectId.claId = 0; // 默认选中第一个
        }
        this.$emit('get-stuData', this.setEmitVal());
        console.log(this.cInfo);
      }
    },
    created () {
      console.log("showPanel = ", this.showPanel);
      this.getGradeInfo(); // 读取班主任负责班级对应的年级
      this.getMajorInfo(); // 读取班主任负责班级对应的专业
      this.getClassInfo(); // 读取班主任负责班级
    },
    data () {
      return {
        loading: false,
        showPanel: false,
        gInfo: null, // 年级信息
        mInfo: null, // 专业信息
        cInfo: null, // 班级信息
        allInfo: {name: '全部', id: 0}, // 默认全部
        selectInfo: {grade: null, major: null, cla: {name: '全部', id: 0}}, // 筛选信息-年级信息、专业信息、班级信息
        selectId: {gradeId: 0, majorId: 0, claId: 0} // 默认选中全部
      }
    }
  }
</script>
<style scoped>
  .siftBox{
    position: relative;
    width: 100%;
    z-index: 10;
  }
  .selectIcon{
    font-size: 20px;
    color: #666666;
  }
  .siftText{
    vertical-align: top;
  }
  .panel-Head{
    position: fixed;
    width: 100%;
    display: block;
    margin-bottom: 40px;
    padding: 10px 15px;
    font-size: 14px;
    color: #999999;
    background-color: #f2f2f2;
    z-index: 2;
  }
  .category-Head{
    display: block;
    font-size: 14px;
    color: #666666;
  }
  .option-box{
    padding-bottom: 4px;
    padding-left: 10px;
  }
  .option-box a{
    display: inline-block;
    float: left;
    width: 45%;
    margin: 5px;
    font-size: 14px;
    color: #333333;
    padding: 10px 0 10px 0;
    text-align: center;
    background-color: #f2f2f2;
  }
  .option-box .select-a-BgC{
    background-color: #f3d1d1;
    color: #ea1212;
  }
  .button-box{
    position: fixed;
    width: 100%;
    bottom: 0;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #ffffff;
    z-index: 502;
  }
  .sureSeleVal {
    margin-left: 120px;
    border-radius:99px;
    background-color: #F05C2B;
  }
</style>
<style>
  .siftConditionContainer .siftBox .weui-cells{
    margin-top: 0;
  }
</style>
