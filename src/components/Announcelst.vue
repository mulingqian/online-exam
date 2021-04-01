<template>
    <div class="announceL">
      <div style="width: 100%;overflow:scroll;-webkit-overflow-scrolling:auto;">
        <tab v-if="categories.length >0" :line-width=2 v-model="currentIndex" :custom-bar-width="getBarWidth">
          <tab-item :selected="currentIndex === idx"
                    v-for="(item, idx) in categories" :key="idx" @on-item-click="onItemClick(item.TypeName, idx)">
            {{ item.TypeName }}
          </tab-item>
        </tab>

      </div>
      <div v-if="categories" style="padding-top:10px;">
        <div v-if="currentIndex == idx"  v-for="(tab, idx) in categories" :key="idx">
          <ex-scroller v-model="tab.items" :onGetList="getPageList" :onGetCallback="getCallback"
                       :pageSize="20" height="-105" v-if="tab.loaded || idx === currentIndex" ref="scroll">
            <group>
              <cell v-for="(item2, idx) in tab.items" :key="item2" @click.native="goAnnounceNewsDetail(item2.DocID)" :is-link="true">
                <div slot="after-title" class="vux-label" style="overflow: hidden;">
                  <span v-if="item2.ImgUrl === ''" class="school-wx-icon stu-icon" slot="icon" style="color:#f0ad4e;font-size: 30px;float: left;width: 10%;">&#xe6fb;</span>
                  <span v-else style="display: inline-block;float: left;width: 40px;padding-right: 10px;overflow: hidden;"><img :src="item2.ImgUrl" width="40"/></span>
                  <span style="float: left;color: #333333;width: 75%;">
                  <span style="color: #333333;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden;">{{item2.Subject}}<br/></span>
                  <span style="color: #999999;font-size: 14px;">{{item2.CreateTime}}</span>
                </span>
                </div>
              </cell>
            </group>
          </ex-scroller>
        </div>
      </div>
    </div>
</template>
<script>
  import { Swiper, SwiperItem, Group, Cell } from 'vux'
  import Tab from 'vux/src/components/tab/tab.vue'
  import TabItem from 'vux/src/components/tab/tab-item.vue'
  import { mapState, mapActions } from 'vuex'
  import ExScroller from './common/ExScroller.vue'
  export default {
    name: "announcelst",
    components: {
      Group,
      Cell,
      ExScroller,
      Tab,
      TabItem,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        categories: [], // 存放 通知公告 的小标题类型
        tabsDocType: 0, // 新闻类型
        currentIndex: 0, // 确保可以切换
        getBarWidth: function (index) {
          if (index !== undefined) {
            if (this.currUserType === 0) {
              return (this.$parent.categories[index].TypeName.length) * 10 + 'px' // 学生tab
            } else {
              return (this.$parent.categories[index].TypeName.length) * 10 + 'px' // 教师 tab
            }
          }
        }
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    created() {
      this.getCategoriesData(); // 触发获取新闻类型类型1-公告 2-新闻 4-通知
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      onItemClick(keyword, index) {
        let barLeft = 0;
        document.getElementsByClassName('vux-tab-ink-bar')[0].style.right = '100%';
        for (let i = 0; i < this.categories.length; i++) {
          if (document.getElementsByClassName('vux-tab-item')[i].innerText === keyword) {
            barLeft += document.getElementsByClassName('vux-tab-item')[i].offsetWidth / 2;
            barLeft -= (keyword.length * 10) / 2; // 为什么是22.5？因为底部bar长度为44px，这样做可以让bar的中心对齐tab-item的中心<br>         barLeft -= 22.5
            break;
          }
          barLeft += document.getElementsByClassName('vux-tab-item')[i].offsetWidth;
        }
        document.getElementsByClassName('vux-tab-ink-bar')[0].style.left = (barLeft + 'px');
      },
      // 保存当前页面数据
      saveCurrPgData () {
        this.QD.parentPageData = {currentIndex: this.currentIndex, categories: this.categories}
      },
      // 得到当前页面数据
      getCurrPgData () {
        if (this.QD.parentPageData) {
          this.currentIndex = this.QD.parentPageData.currentIndex;
          this.QD.parentPageData = null;
        }
      },
      async getCategoriesData () {
        if (this.userinfo.usertype === 4 && this.QD.showStuNoticeAnnounce === 0){ // 学生用户
          return;
        }
        this.getCurrPgData();// 得到当前页面数据
        if (this.categories.length === 0) {
          // 获取新闻类型类型1-公告 2-新闻 4-通知
          let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetOfficeDocTypeData'});
          if (d.status && d.status === "error") {
            console.log(d.msg);
            this.QD.alert(`获取数据失败`);
            return
          }
          // 给categories[] 添加一个items 属性 用来存放每个类型下的列表
          let i = d.length-1;
          for (i; i>=1; i--){
            d[i].items=null;
            d[i].loaded = false;
          }
          this.categories = d;
        }
        this.$nextTick(function() {
          console.log("this.$refs");
          this.$refs.scroll[0].initData(); // 初始化加载列表， 显示loading {根据页码和每页显示onGetList  下拉加载刷新 onGetCallback}
        });
        setTimeout(() => {
          if (this.categories.length > 0) {
            this.onItemClick(this.categories[this.currentIndex].TypeName, this.currentIndex);
          }
        }, 100)
      },
      // 根据页码和每页个数显示 通知 的列表
      async getPageList (idx, size) {
        let zgh = '';
        if (this.userinfo.usertype === 2){
          zgh = this.userinfo.stuObj.ZGH;// 获取教师的 zgh 的值
        } else {
          zgh = this.userinfo.stuObj.XH; // 获取学生 学号xh 的值
        }
        let d2 = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetOfficeDocByProcedure', zgh: zgh, docType: this.categories[this.currentIndex].DocType, pageIndex: idx, pageSize: size});
        if (d2.status && d2.status === "error") {
          this.QD.alert(`获取数据失败:${d2.msg}`);
          return;
        }
        this.categories[this.currentIndex].loaded = true;
        return d2;
      },
      getCallback () {
        this.$set(this.categories, this.currentIndex, this.categories[this.currentIndex]);
      },
      // 去新闻详细页面
      goAnnounceNewsDetail (docId) {
        this.saveCurrPgData(); // 保存当前页面数据
        this.$router.push({path: '/announceNewsDetail', query: {id: docId}});
      }
    }
  }
</script>
<style scoped lang="less">
</style>
<style>
  .announceL .weui-cells{
    margin-top: 1em;
  }
  /*定义滚动条高宽及 高宽分别对应横竖滚动条的尺寸*/
  .announceL .tab-field::-webkit-scrollbar {
    display: none;
  }
  /* 修改 tab 的 样式 flex: none; */
  .announceL .vux-tab .vux-tab-item {
    position: relative;
    font-size: 14px;
    color: #333333;
    display: inline-block;
    width: auto;
    height: 100%;
    padding: 0 10px;
    flex: none;
  }
</style>
