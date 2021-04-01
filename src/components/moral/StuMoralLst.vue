<template>
  <div class="stu-moral-lst">
    <div v-show="(!loading && (!lst || lst.length === 0))">
      <van-empty description="暂无数据" />
    </div>
    <div>
      <group gutter="0">
        <cell :is-link="true" v-for="(item, idx) in lst" :key="idx"
              :arrow-direction="item.isLink ? 'up' : 'down'" class="cell-box" @click.native="item.isLink = !item.isLink">
          <div slot="icon" class="class-icon">
            <svg class="icon-svg" aria-hidden="true">
              <use xlink:href="#qdicon-pingyu1"></use>
            </svg>
          </div>
          <div slot="inline-desc" class="inline-desc">
            <div class="stu-info-box">
              <span class="stu-name">{{item.xn}}</span>
              <p class="stu-score">
                <span>得分：{{item.score}}</span>
                <span class="pddd">{{item.pddd}}</span>
              </p>
            </div>
            <p class="stu-py" :class="!item.isLink? 'active': ''">评语内容：{{item.pynr}}</p>
          </div>
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import { Empty } from 'vant'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'stuMoralLst',
    components: {
      Cell,
      Group,
      [Empty.name]: Empty
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      // 获取学生年度品德评语
      async getStuMoralLst () {
        this.updateLoadingStatus(true);
        let d = await this.QD.getData('/ComApi/PostObject', {
          apiName: 'GetStuMoralCommentRecord',
          xh: this.userinfo.stuObj.XH,
          moralType: 1
        });
        this.updateLoadingStatus(false);
        if (d.status && d.status === "error") {
          console.log(d.msg);
          return []
        }
        this.lst = d.data
        this.lst.forEach(item => {
          this.$set(item, 'isLink', true)
        })
      }
    },
    created () {
      this.getStuMoralLst();
    },
    data () {
      return {
        loading: false,
        lst: []
      }
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    }
  }
</script>

<style scoped lang="less">
  /*学生列表 start*/
  .cell-box{
    position: relative;
    .class-icon{
      width: 36px;
      line-height: 36px;
      color: #fff;
      font-size: 26px;
      margin-right:12px;
      text-align: center;
      .icon-svg{
        position:absolute;
        top:9px;
        left:22px;
      }
    }
    .stu-info-box{
      color:@color4;
      font-size: 15px;
      margin:0 8px 12px 0;
      .stu-name{
        font-weight: bold;
      }
      .stu-xh{
        color: #000;
        font-weight: normal;
        font-style: normal;
      }
      .stu-score{
        display: inline-block;
        float: right;
        margin-right:8px;
        color:#626666;
        font-size: 14px;
        text-align: right;
        .pddd{
          margin:0 8px;
          color:@tea-theme-color;
        }
      }
      .do-write{
        margin:0 8px;
        color:@tea-theme-color;
      }
    }
    .stu-py{
      color: #494C4D;
      font-size: 12px;
      margin-right:12px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;/*想省略几行就写几*/
      -webkit-box-orient: vertical;
      .more{
        color:@tea-theme-color;
      }
    }
    .active{
      display: block;
    }
  }
</style>

<style lang="less">
  .stu-moral-lst{
    .cell-box{
      .weui-cell__ft{
        position:absolute;
        right:16px;
        top:18px;
      }
    }
  }
</style>
