<template>
  <div class="myClassMembers">
    <tab>
      <tab-item :selected="showLst" @on-item-click="showStudandTeaData(0)">教师信息</tab-item>
      <tab-item :selected="!showLst" @on-item-click="showStudandTeaData(1)">学生信息</tab-item><!-- v-if="stuMembers.length !== 0"-->
    </tab>
    <scroller lock-x :scrollbar-y="true" height="-90" v-show="showLst">
      <group>
        <cell v-for="(teacher,sidx) in teaMembers" :key="sidx">
            <span slot="after-title" class="vux-label">
              <span class="stuIconImg">
                <span class="school-wx-icon stu-icon" slot="icon" style="color:#f0ad4e;">&#xe612;</span>
              </span>
              <span class="stuInfor">
                <span>{{teacher.XM}}</span>
                <span>{{teacher.XH}}</span>
                <br/><span>{{teacher.KCMC}}</span>
                <span v-if="teacher.SJHM !== ''">电话：{{teacher.SJHM}}</span>
              </span>
            </span>
        </cell>
      </group>
    </scroller>
    <scroller lock-x :scrollbar-y="true" height="-90" v-show="!showLst">
      <group>
        <cell v-for="(stu,sidx) in stuMembers" :key="sidx" @click.native="goMyClassStuDetail(stu.XH)">
              <span slot="after-title" class="vux-label">
                <span class="stuIconImg">
                  <span class="school-wx-icon stu-icon" slot="icon" style="color:#f0ad4e;">&#xe612;</span>
                </span>
                <span class="stuInfor">
                  <span>{{stu.XM}}</span>
                  <span>{{stu.XH}}</span>
                  <br/><span>{{stu.BJMC}}</span>
                  <span v-if="stu.SJHM !== ''">电话：{{stu.SJHM}}</span>
                </span>
              </span>
        </cell>
      </group>
    </scroller>
  </div>
</template>
<script>
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Scroller from 'vux/src/components/scroller/index.vue'
  export default {
    name: "myClassMembers",
    components: {
      Scroller,
      Tab,
      TabItem,
      Cell,
      Group
    },
    methods: {
      // 判断显示的是教师信息或显示学生信息
      showStudandTeaData (type) {
        this.showSTData = type;
        this.showLst = this.showSTData === 0;
      },
      // 跳转到学生详情页面
      goMyClassStuDetail (xh) {
        this.$router.push({path: '/myClassStuDetail', query: {xh: xh}});
        // 确保还回来的时候是在 学生列表上
        sessionStorage.setItem("myClassMemberType", this.showSTData);
      },
      // 获取学生成员信息
      async getStuInforLst () {
        if (sessionStorage.getItem("myClassMemberType") !== null) {
          this.showSTData = parseInt(sessionStorage.getItem("myClassMemberType"));
          this.showLst = this.showSTData === 0;
          sessionStorage.removeItem("myClassMemberType");
        }
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuInforLst', id: this.$route.query.bjid});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        for (let i=0; i<d.length; i++){
          if (d[i].UType === 2){
            this.stuMembers.push(d[i]); //当UType === 2 时，代表是学生成员
          } else {
            this.teaMembers.push(d[i]); //当UType === 1 时，代表是教师成员
          }
        }
      }
    },
    created () {
      this.getStuInforLst();
    },
    data () {
      return {
        showSTData: 0, // 教师信息为0,1是学生信息
        showLst: true, // 开始默认教师信息列表显示
        stuMembers: [], // 学生成员信息
        teaMembers: [] // 教师成员信息
      }
    }
  }
</script>
<style>
  .myClassMembers .weui-cells{
    margin-top: 1em;
  }
  .myClassMembers .weui-cells .weui-cell .vux-cell-bd .vux-label{
    font-size: 16px;
    color: #333333;
  }
  .myClassMembers .weui-cells .stuIconImg{
    display: block;
    float: left;
  }
  .myClassMembers .weui-cells .stuIconImg .stu-icon{
    font-size: 45px;
    padding-right:0;
  }
  .myClassMembers .weui-cells .vux-label .stuInfor{
    float: left;
    display:block;
    width:78%;
    padding-top: 10px;
    font-size: 14px;
    margin-left: 8px;
    color: #333333;
  }
  .myClassMembers .weui-cells .vux-label .stuInfor span{
    display: inline-block;
    margin-bottom: 8px;
  }
  .myClassMembers .weui-cells .vux-label .stuInfor span:nth-child(2){
    font-size: 14px;
    color: #666666;
  }
  .myClassMembers .weui-cells .vux-label .stuInfor span:nth-child(4){
    margin-right:14px;
  }
</style>
