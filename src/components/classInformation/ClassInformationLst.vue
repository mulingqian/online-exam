<template>
  <div class="classInforLst">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <group>
      <cell v-for="(item, idx) in classInforLst" :key="idx" :link="{path: '/classInformation/classInforDetail', query: {id: item.InfoId}}">
            <span slot="after-title" class="vux-label">
              <span class="classInforImportAndUrgent">
                <span class="classInforImport">
                  <span :class="`school-wx-icon icon-importMsg ${item.Importance === '非常重要'? 'veryImporRed': (item.Importance === '重要'? 'imporYellow': '')}`" slot="icon" style="font-size: 35px;">
                    <span v-if="item.Importance === '非常重要'">非常重要</span>
                    <span v-if="item.Importance === '重要'">重要</span>
                    <span v-if="item.Importance === '普通'">普通</span>
                  </span>
                </span>
                <span class="classInforUrgent">
                  <span :class="`school-wx-icon icon-urgentMsg ${item.Urgent === '非常紧急'? 'veryUrgentRed': (item.Urgent === '紧急'? 'urgentYellow': '')}`" slot="icon" style="font-size: 35px;">
                    <span v-if="item.Urgent === '非常紧急'">非常紧急</span>
                    <span v-if="item.Urgent === '紧急'">紧急</span>
                    <span v-if="item.Urgent === '普通'">普通</span>
                  </span>
                </span>
              </span>
              <span class="first-line">
                <span class="school-wx-icon person-icon" slot="icon">&#xe612;</span>
                <span>{{item.XM }}</span>
              </span>
              <div class="second-line">{{item.Title}}
                <div style="font-size: 12px;color: #999999;">{{ item.CreateTime}}</div>
              </div>
            </span>
      </cell>
    </group>
    <divider class="noMsg" v-if="classInforLst.length <= 0">暂无班级信息</divider>
    <!--添加‘班级信息’-->
    <add-page v-if="userinfo.usertype === 2" @click.native="goClassInforAdd()"></add-page>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import addPage from '../primaryKey/AddPage.vue'
  import Divider from 'vux/src/components/divider/index.vue'

  import { mapState } from 'vuex'
  export default {
    name: 'classInformationLst',
    directives: {
      TransferDom
    },
    components: {
      Loading,
      Group,
      Cell,
      addPage,
      Divider
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    methods: {
        /*跳转到 添加班级信息页面*/
      goClassInforAdd () {
        this.$router.push({path: '/classInformation/classInforAdd', query: {id: this.bjid}});
      },
      /*获取班级信息列表*/
      async getClassInfoListData () {
        if (this.userinfo.usertype === 4) {
          this.zghOrXhType = 4;
          this.bjid = this.userinfo.stuObj.BJID;
        } else {
          this.zghOrXhType = 1;
          this.bjid = this.$route.query.bjid;
        }
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetClassInfoListData', bjid: this.bjid, type: this.zghOrXhType});
        if (d.status && d.status === "error") {
          this.QD.alert('', `获取班级信息数据失败！`);
          return;
        }
        this.loading = false;
        this.classInforLst = d;
      }
    },
    created () {
      this.getClassInfoListData();
    },
    data () {
      return {
        loading: false,
        bjid: 0, // 班级id
        classInforLst: [], // 班级信息列表
        zghOrXhType: 1 // 判断是教师端还是学生端type(类型：1-教师，4-学生)
      }
    }
  }
</script>
<style scoped>
  .noMsg{
    padding: 60px 0 0 0;
  }
  .classInforLst{
    background-color: #f2f2f2;
  }
  .classInforLst .person-icon{
    position: relative;
    top: 5px;
    color: #478BCA;
    font-size: 28px;
    padding-right: 0px;
  }

  .classInforLst .vux-label .classInforImportAndUrgent{
    float: right;
  }
  .classInforLst .vux-label .classInforImportAndUrgent .classInforImport,
  .classInforLst .vux-label .classInforImportAndUrgent .classInforUrgent{
    position: relative;
    display: inline-block;
    width: 35px;
  }
  .classInforLst .vux-label .icon-importMsg:before,
  .classInforLst .vux-label .icon-urgentMsg:before{
    position: absolute;
    top: -16px;
    padding-right:0;
    font-size: 36px;
    content: '\e622';
    color: #5ac389;
    z-index:0;
  }
  .classInforLst .vux-label .veryImporRed.icon-importMsg:before{
    color: #ff0000;
  }
  .classInforLst .vux-label .imporYellow.icon-importMsg:before{
    color: #ff501d;
  }
  .classInforLst .vux-label .veryUrgentRed.icon-urgentMsg:before{
    color: #ff0000;
  }
  .classInforLst .vux-label .urgentYellow.icon-urgentMsg:before{
    color: #ff501d;
  }
  .classInforLst .vux-label .icon-importMsg > span,
  .classInforLst .vux-label .icon-urgentMsg > span{
    position:absolute;
    width: 16px;
    left: 10px;
    top: -7px;
    line-height: 15px;
    font-size: 14px;
    z-index:1;
    text-align: center;
    color: #fff;
  }
  .classInforLst .vux-label .veryImporRed > span,
  .classInforLst .vux-label .veryUrgentRed > span{
    left: 0;
    top: -6px;
    width: 35px;
  }

  .classInforLst .first-line{
    position: relative;
    display: block;
    font-size: 14px;
    color: #666666;
    overflow: hidden;
  }
  .classInforLst .first-line .imporAndUrg{
    position: relative;
    float: right;
    top: 15px;
  }
  .classInforLst .first-line .imporAndUrg a{
    display: inline-block;
    padding: 1px 8px;
    font-size: 12px;
    color: #fff;
    border-radius: 4px;
    background-color: #ff721a;
  }
  .classInforLst .second-line{
    position: relative;
    left: 30px;
    color: #333333;
  }
</style>
<style>
  .classInforLst .weui-cells{
   margin-top: 0;
  }
</style>
