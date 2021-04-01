<template>
  <div class="stuTeachingMaterial">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <smst @on-load="onLoad" @on-hide="onHide" :showName="true" ></smst>
    <div>
      <ex-scroller ref="scrollerPageIndexOne" v-model="studentBookData" :onGetList="getStudentBookData" v-if="xqId !== null" height="-88" style="position: relative;top: 15px;">
        <group>
          <cell v-for="(s, sidx) in studentBookData" :key="sidx">
            <div slot="after-title" class="vux-label">
              <div class="stuBookLst">
                <div class="bookShow"></div>
                <div class="bookData">
                  <span>{{s.JCMC}}</span>
                  <span>课程：{{s.KCMC}}</span>
                  <span>作者：{{s.Author}}</span>
                  <!--<span>出版社：科学技术文晓出版社</span>-->
                  <span>￥ 39</span>
                </div>
              </div>
            </div>
          </cell>
        </group>
      </ex-scroller>
    </div>
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import ExScroller from '../common/ExScroller.vue'
  import Smst from '../Smst.vue'

  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: "stuTeachingMaterial",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      ExScroller,
      Smst,
      Cell,
      Group
    },
    methods: {
      onLoad (e) {
        console.log(e.XQID);
        this.xqId = e.XQID;
        this.loading = false;
      },
      onHide (t, e) {
        if (t === true && e && e.XQID) {
          this.loading = true;
          console.log(e.XQID);
          this.xqId = e.XQID;
          // 重新加载第一页数据
          this.$refs.scrollerPageIndexOne.initData();
        }
        this.loading = false;
      },
      //学生查询跟人教材信息及费用
      async getStudentBookData (index, size) {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'StudentBookData',
          XH: this.QD.getLocalUserinfo().stuObj.XH,
          SemId: this.xqId,
          PageIndex: index,
          PageSize: size
        });
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.loading = false;
        return d;
      }
    },
    created () {
    },
    data () {
      return {
        loading: false,
        xqId: null, // 学期id
        studentBookData: []
      }
    }
  }
</script>
<style scoped>
  .stuTeachingMaterial .bookShow{
    float: left;
    width: 40%;
    height: 170px;
    border: 1px solid #f2b964;
  }
  .stuTeachingMaterial .stuBookLst{
    overflow: hidden;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .stuTeachingMaterial .bookData{
    float: left;
    width:50%;
    margin-left: 20px;
  }
  .stuTeachingMaterial .bookData span{
    display: block;
    font-size: 14px;
  }
  .stuTeachingMaterial .bookData span:first-child{
    font-size: 16px;
  }
  .stuTeachingMaterial .bookData span:nth-child(1){
    margin-bottom: 30px;
  }
  .stuTeachingMaterial .bookData span:nth-child(2),
  .stuTeachingMaterial .bookData span:nth-child(3),
  .stuTeachingMaterial .bookData span:nth-child(4){
    color: #666666;
  }
  .stuTeachingMaterial .bookData span:nth-child(5){
    padding-top: 10px;
    color: #ff0000;
  }
</style>
