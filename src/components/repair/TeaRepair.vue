<template>
  <div class="teaReapair">
    <!--搜索功能，按设备名称进行搜索-->
    <div>
      <search
        placeholder="搜索"
        @on-change="getResult"
        @on-cancel="onCancel"
        position="absolute"
        auto-scroll-to-top top="46px"
      ></search>
    </div>

    <!--按状态值筛选-->
    <group class="selectType-group">
      <popup-picker title="状态值" v-model="stateVal" :data="repairState" @on-change="onChangeProfession">
        <!--<span slot="title">
          <span class="aProfessionSpan">{{stateVal}}</span>
        </span>-->
      </popup-picker>
    </group>

    <tab>
      <tab-item :selected="showLst" @on-item-click="adjustMyRepairOrApplyWay(0)">我的报修</tab-item>
      <tab-item v-if="myRepair !== ''" :selected="!showLst" @on-item-click="adjustMyRepairOrApplyWay(1)">{{myRepair}}<span style="margin-left:4px;font-size: 12px;color: #999999;">未处理:{{noDoneNum}}</span></tab-item>
    </tab>

    <!--我的报修-->
    <div v-show="showLst" class="showLst">
      <ex-scroller v-model="myRepairLst" ref="scrollerPageIndexOne" :onGetList="getMyRepair" height="-186">
        <div>
          <group v-for="(r, cidx) in myRepairLst" :key="cidx">
            <cell @click.native="goMyRepairDetailPage(r.BXID,1)" is-link>
              <div slot="after-title" class="vux-label">
                <div class="reapair-first">设备名称:{{r.DeviceName}}</div>
                <div class="reapair-second">提交时间:{{r.SubmitTime}}</div>
                <div class="reapair-third" v-if="r.States === '1'" style="color: #666666;">待处理</div>
                <div class="reapair-third" v-if="r.States === '4'" style="color: #008000;">已完成</div>
              </div>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>

    <!--我的维修-->
    <div v-show="!showLst" class="showLst">
      <ex-scroller v-model="myApplyLst" :onGetList="getMyApply" ref="myServiceScrollerPageIndexOne" height="-186">
        <div>
          <group v-for="(r, cidx) in myApplyLst" :key="cidx">
            <cell @click.native="goMyRepairDetailPage(r.BXID,2)" is-link>
              <div slot="after-title" class="vux-label">
                <div class="reapair-first">设备名称:{{r.DeviceName}}</div>
                <div class="reapair-second">提交时间:{{r.SubmitTime}}</div>
                <div class="reapair-third" v-if="r.States === '1'" style="color: #666666;">待处理</div>
                <div class="reapair-third" v-if="r.States === '4'" style="color: #008000;">已完成</div>
              </div>
            </cell>
          </group>
        </div>
      </ex-scroller>
    </div>

    <!--添加‘报修申请’-->
    <add-page @click.native="goRepairApply()"></add-page>

  </div>
</template>
<script>
  import ExScroller from '../common/ExScroller.vue'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'

  import PopupPicker from 'vux/src/components/popup-picker/index.vue'
  import Search from 'vux/src/components/search/index.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import addPage from '../primaryKey/AddPage.vue'
  export default {
    name: "teaRepair",
    components: {
      ExScroller,
      Tab,
      TabItem,
      PopupPicker,
      Group,
      Cell,
      Search,
      addPage
    },
    methods: {
        // 到 ‘报修申请’页面
      goRepairApply () {
        this.$router.push({path: '/repair/repairApply'});
      },
        // 到‘报修详情’页面 type为1--我的报修 type为2---我的维修
      goMyRepairDetailPage(id, type) {
        // 记录到‘详情’页面中，是从‘我的报修’还是从‘我的维修’列表中进入的
        sessionStorage.setItem("teaRepairShowType", type);
        this.$router.push({path: '/repair/teaRepairDetail', query: {id: id, type: type}});
      },
      // 在input标签中输入文字是发生的事件
      getResult (val) {
        this.search = val;
        // 重新加载第一页数据
        this.$refs.scrollerPageIndexOne.initData();
        // '我的维修'重新加载第一页数据
        this.$refs.myServiceScrollerPageIndexOne.initData();
      },
      // 点击搜索中的取消事件
      onCancel () {
        console.log('cancel');
        this.search = '';
        // 重新加载第一页数据
        this.$refs.scrollerPageIndexOne.initData();
        // '我的维修'重新加载第一页数据
        this.$refs.myServiceScrollerPageIndexOne.initData();
      },
      // 筛选状态值
      onChangeProfession (val) {
        this.stateVal = [val[0]];
        if (this.stateVal[0] === '全部') {
          this.statusNum = '0';
        }
        if (this.stateVal[0] === '待处理') {
          this.statusNum = '1';
        }
        if (this.stateVal[0] === '退回') {
          this.statusNum = '2';
        }
        if (this.stateVal[0] === '维修中') {
          this.statusNum = '3';
        }
        if (this.stateVal[0] === '已完成') {
          this.statusNum = '4';
        }
        // 重新加载第一页数据
        this.$refs.scrollerPageIndexOne.initData();
        // '我的维修'重新加载第一页数据
        this.$refs.myServiceScrollerPageIndexOne.initData();
      },
        // 判断是’我的报修‘列表，还是 报修审核’列表
      adjustMyRepairOrApplyWay (type) {
        this.repairType = type;
        this.showLst = this.repairType === 0;
      },
      // 得到’我的报修‘列表
      async getMyRepair (index, size) {
        // 判断显示哪个列表
        if (sessionStorage.getItem("teaRepairShowType") !== null) {
          let type = parseInt(sessionStorage.getItem("teaRepairShowType"));
          // 判断是’我的报修‘列表，还是 报修审核’列表
          this.showLst = type === 1;
          // 清除teaRepairShowType
          sessionStorage.removeItem("teaRepairShowType");
        }
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'DeviceRepairInfoLst', PageSize: size, PageIndex: index, Status: this.statusNum, Search: this.search, Type: 1});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        return d;
      },
      // 得到‘我的维修’列表
      async getMyApply (index, size) {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'DeviceRepairInfoLst', PageSize: size, PageIndex: index, Status: this.statusNum, Search: this.search, Type: 2});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.noDoneNum = d.length > 0 ? d[0].NoDoneNum : 0;
        return d;
      },
      // 根据用户和菜单 获取对菜单的权限信息
      async getSysUserPriorityData () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetSysUsersPriorityData', cellId: 'OF_BXGL_BXCL'});
        if (d.status && d.status === "error") {
          // this.QD.alert(`获取数据失败:${d.msg}`);
          console.log('获取数据失败:', d.msg);
        }
        this.canBrowse = d.CanBrowse;
        if (this.canBrowse === true) {
          this.myRepair = '我的维修';
        }
      }
    },
    created (){
      // 根据用户和菜单 获取对菜单的权限信息
      this.getSysUserPriorityData();
    },
    data () {
      return {
        canBrowse: false, // 默认当前用户没有权限查看‘我的维修’列表
        myRepair: '', // ‘我的维修’
        repairState: [['全部', '待处理', '退回', '维修中', '已完成']], //报修状态
        stateVal: ['全部'], // 状态值开始默认‘全部’
        statusNum: '0', // 状态值‘全部’对应的数字‘0’
        search: '', // 设备名称，开始默认为空
        showLst: true, // 开始默认'我的报修'列表显示
        repairType: 0, //'我的报修'为0，‘报修审核’为1
        myRepairLst: [], // 我的报修
        myApplyLst: [], // 我的维修
        noDoneNum: 0 // ‘我的维修’未处理数目
      }
    }
  }

</script>
<style scoped>
  .teaReapair .showLst{
    background-color: #f2f2f2;
  }
  .reapair-first{
    font-size: 16px;
    color: #333333;
    margin-top: 8px;
  }
  .reapair-second{
    font-size: 14px;
    color: #666666;
  }
  .reapair-third{
    font-size: 14px;
    margin-bottom: 10px;
  }
</style>
<style>
  .teaReapair .showLst .xs-container{
    margin-top: 0;
  }
  .teaReapair .showLst .weui-cells {
    position: relative;
    left: 2%;
    width: 96%;
    margin-top: 18px;
  }
  .teaReapair .selectType-group .weui-cells{
    margin-top: 8px;
  }
  .teaReapair .vux-search-fixed{
    position: static!important;
  }
  /*搜索中的字的位置设置*/
  .teaReapair .weui-search-bar__label{
    line-height: 22px;
  }
</style>
