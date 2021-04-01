<template>
  <div class="teaReapair">
    <!--搜索功能，按设备名称进行搜索-->
    <div>
      <search
        placeholder="搜索"
        v-model="search"
        @on-change="getResult"
        @on-cancel="onCancel"
        position="absolute"
        auto-scroll-to-top top="46px"
      ></search>
    </div>

    <!--按状态值筛选-->
    <group class="selectType-group">
      <popup-picker title="状态值" :columns="1" :show-name="true" v-model="stateVal" :data="repairState" @on-change="onChangeProfession"></popup-picker>
    </group>

    <tab>
      <tab-item :selected="repairType === 0" @on-item-click="adjustMyRepairOrApplyWay(0)">我的报修</tab-item>
      <tab-item v-if="myRepair !== ''" :selected="repairType === 1" @on-item-click="adjustMyRepairOrApplyWay(1)">{{myRepair}}<span style="margin-left:4px;font-size: 12px;color: #999999;">未处理:{{noDoneNum}}</span></tab-item>
    </tab>

    <!--我的报修申请数据-->
    <div v-show="repairType === 0" class="showLst">
      <ex-scroller v-model="myRepairLst" ref="scrollerPageIndexOne" :onGetList="getMyRepairApplyLst" :pageSize="10" height="-186">
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
    <div v-if="myRepair !== ''">
      <div v-show="repairType === 1" class="showLst">
        <ex-scroller v-model="myApplyLst" :onGetList="getMyRepairHandle" ref="myServiceScrollerPageIndexOne" height="-186">
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
  import { mapState } from 'vuex'
  export default {
    name: "special-publicRepair",
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
    data () {
      return {
        canBrowse: false, // 默认当前用户没有权限查看‘我的维修’列表
        isStudent: true, // 判断用户类型，学生-true, 老师 - false
        myRepair: '', // ‘我的维修’
        statusNum: '0', // 状态值‘全部’对应的数字‘0’
        search: '', // 设备名称，开始默认为空
        condition: [], // 查询条件
        repairType: 0, //'我的报修'为0，‘报修审核’为1
        myRepairLst: [], // 我的报修
        myApplyLst: [], // 我的维修
        noDoneNum: 0, // ‘我的维修’未处理数目
        repairState: [
          {name: '全部', value: '0'},
          {name: '待处理', value: '1'},
          {name: '退回', value: '2'},
          {name: '维修中', value: '3'},
          {name: '已完成', value: '4'}
        ], //报修状态
        stateVal: ['0'] // 状态值开始默认‘全部’
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    created () {
      this.judgeUserType(); // 判断用户类型
    },
    methods: {
      // 判断用户类型
      judgeUserType () {
        this.userinfo && this.userinfo.stuObj.XH ? this.isStudent = true : this.isStudent = false;
        this.getCurrPgData(); // 保存当前页面数据
        if (!this.isStudent) { // 只有老师才与权限处理维修
          // 根据用户和菜单 获取对菜单的权限信息
          this.getSysUserPriorityData();
        }
      },
      // 保存当前页面数据
      saveCurrPgData () {
        this.QD.parentPageData = {repairType: this.repairType, condition: this.condition, stateVal: this.stateVal, search: this.search};
      },
      // 得到保存当前页面数据
      getCurrPgData () {
        if (this.QD.parentPageData) {
          let qd = this.QD.parentPageData;
          this.repairType = qd.repairType;
          this.condition = qd.condition;
          this.stateVal = qd.stateVal;
          this.search = qd.search;
          this.QD.parentPageData = null;
        }
      },
      // 到 ‘报修申请’页面
      goRepairApply () {
        this.$router.push({path: '/public/repairSpecial/repairApply'});
      },
      // 到‘报修详情’页面 type为1--我的报修 type为2---我的维修
      goMyRepairDetailPage(id, type) {
        this.saveCurrPgData(); // 保存当前页面数据
        this.$router.push({path: '/public/repairSpecial/publicRepairDetail', query: {id: id, type: type}});
      },
      // 在input标签中输入文字是发生的事件
      getResult (val) {
        this.setCondition(); // 设置查询条件
        // 重新加载第一页数据
        this.$refs.scrollerPageIndexOne.initData();
        // '我的维修'重新加载第一页数据
        this.$refs.myServiceScrollerPageIndexOne.initData();
      },
      // 点击搜索中的取消事件
      onCancel () {
        console.log('cancel');
        this.search = '';
        this.setCondition(); // 设置查询条件
        // 重新加载第一页数据
        this.$refs.scrollerPageIndexOne.initData();
        // '我的维修'重新加载第一页数据
        this.$refs.myServiceScrollerPageIndexOne.initData();
      },
      // 筛选状态值
      onChangeProfession (val) {
        console.log(val);
        this.stateVal = val; // 渲染在页面上的状态值
        this.setCondition(); // 设置查询条件
        // 重新加载第一页数据
        this.$refs.scrollerPageIndexOne.initData();
        // '我的维修'重新加载第一页数据
        this.$refs.myServiceScrollerPageIndexOne.initData();
      },
      // 判断是’我的报修‘列表，还是 报修审核’列表
      adjustMyRepairOrApplyWay (type) {
        this.repairType = type;
      },
      // 设置查询条件
      setCondition() {
        this.condition = [];
        if (this.stateVal[0] !== '0') {
          this.condition.push({FieldName: "States", Value: parseInt(this.stateVal[0]), NeedQuotes: false});
        }
        if (this.search) {
          this.condition.push({FieldName: "DeviceName", Value: this.search, Operator: "Like"});
        }
      },
      // 得到’我的报修‘列表 // { FieldName: "Stu_LeaveApply.StuId", Value: value.toString(), NeedQuotes: false }
      async getMyRepairApplyLst (index, size) {
        let obj = {
          pageSize: size,
          pageIndex: index,
          condition: this.condition,
          type: 1 // 1 报修申请 2 报修处理
        };
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'RepairReadApplyLst',
          objData: JSON.stringify(obj)
        });
        d = JSON.parse(d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取报修数据失败:${d.msg}`);
          return [];
        }
        return d.data;
      },
      // 得到‘我的维修处理’列表
      async getMyRepairHandle (index, size) {
        let obj = {
          pageSize: size,
          pageIndex: index,
          condition: this.condition,
          type: 2 // 1 报修申请 2 报修处理
        };
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'RepairReadApplyLst',
          objData: JSON.stringify(obj)
        });
        d = JSON.parse(d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取报修数据失败:${d.msg}`);
          return [];
        }
        console.log("handle", d);
        this.noDoneNum = d.data.length > 0 ? d.data[0].unDealCount : 0;
        return d.data;
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
