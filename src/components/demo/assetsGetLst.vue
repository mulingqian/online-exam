<template>
  <div class="asset-getLst">
    <tab>
      <tab-item :selected="showLst" @on-item-click="adjShowAppVer(true)">资产领用申请</tab-item>
      <tab-item :selected="!showLst" @on-item-click="adjShowAppVer(false)">资产领用审核</tab-item>
    </tab>
    <!--资产领用申请 start-->
    <group v-if="showLst" style="margin-top: -20px;">
      <cell>
        <span slot="after-title">
          <span class="radius-xm"><span class="xm">赵晓沁</span></span>
          打印机
        </span>
        <span slot="inline-desc">
          <span class="p-detail" style="padding-left: 50px;">
            <span>日常办公</span>
            <br />
            <span>2018-06-22</span>
          </span>
        </span>
        <span style="color: #5ac389;font-size: 14px;">通过</span>
      </cell>
    </group>
    <!--资产领用申请 end-->
    <!--资产领用审核 start-->
    <group v-if="!showLst" style="margin-top: -20px;">
      <cell>
        <span slot="after-title">
           <span class="radius-xm"><span class="xm">王平</span></span>
          笔记本
        </span>
        <span slot="inline-desc">
          <span class="p-detail" style="padding-left: 50px;">
            <span>日常办公</span>
            <br />
            <span>2018-06-22</span>
          </span>
          <span class="confirm-box">
            <span>审核确认</span>
          </span>
        </span>
        <span style="color: #fcab53;">待审核</span>
      </cell>
    </group>
    <!--资产领用审核 end-->
    <!--增加资产领用事件-->
    <add-page @click.native="addAssetsGet()"></add-page>
  </div>
</template>
<script>
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import addPage from '../primaryKey/AddPage.vue'
  export default {
    name: 'assetsGetLst',
    components: {
      Tab,
      TabItem,
      Cell,
      Group,
      addPage
    },
    methods: {
        // 判断显示哪个列表 - 申请列表、审核列表
      adjShowAppVer (type) {
        this.showLst = type;
      },
      // 增加资产领用
      addAssetsGet () {
        this.$router.push('/demo/assetsGetAdd');
      }
    },
    data () {
      return {
        showLst: true // 开始默认资产领用申请列表显示
      }
    }
  }
</script>
<style scoped>
  .radius-xm{
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    font-size: 12px;
    text-align: center;
    line-height: 40px;
    color: #fff;
  }
  .xm{
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    color: #fff;
    letter-spacing: .1em;
    background-color: #27d1bf;
  }
  .p-detail{
    display: block;
    font-size: 12px;
    color: #999999;
  }
  /*编辑确认*/
  .confirm-box{
    display: block;
    font-size: 16px;
    margin-top: 4px;
    margin-left: 50px;
    padding-top: 8px;
    text-align: center;
    border-top: 1px dashed #e5e5e5;
  }
  .confirm-box span {
    padding: 4px 10px;
    color: #13c22b;
    border:1px solid #e5e5e5;
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
</style>
