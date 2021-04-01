<template>
  <div class="srcollerlst scoller-wrapper">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <scroller v-if="loaded" lock-x scrollbar-y use-pulldown  :use-pullup="pullupEnabledValue" :height="height"  :pulldown-config="downConfig"
              @on-pullup-loading="onPullup" @on-pulldown-loading="onPulldown" v-model="status" ref="scroller">
      <slot></slot>
      <!--pullup slot-->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up">
        <div v-if="pullupEnabledValue">
          <span v-show="status.pullupStatus === 'default'">上拉加载</span>
          <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
          <span v-show="status.pullupStatus === 'loading'"><ex-spinner></ex-spinner></span>
        </div>
        <div class="nomore" v-if="!pullupEnabledValue" >
          <span>以上是全部记录</span>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  // import {Cell, Group, XProgress, Loading, Divider, TransferDom} from 'vux'
  import Loading from 'vux/src/components/loading/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import ExSpinner from './ExSpinner'

  export default {
    name: "ex-scroller",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      ExSpinner,
      Loading
    },
    props: {
      // 每页加载数量 默认20
      pageSize: {
        type: Number,
        default: 20
      },
      // Scroller 高度 默认-46（减去Header高度）
      height: {
        type: String,
        default: "-46"
      },
      // 是否自动加载数据，默认true
      autoLoad: {
        type: Boolean,
        default: true
      },
      // 是否允许上拉加载更多，默认true
      pullupEnabled: {
        type: Boolean,
        default: true
      },
      // 获取数据方法，传递两个参数（pageIndex, pageSize）
      onGetList: Function,

      // 获取数据方法回调函数，（lst）
      onGetCallback: Function,
      // 数据
      value: Array
    },
    methods: {
      // 上拉加载更多
      async onPullup () {
        if (this.pullupEnabledValue === false) {
          return;
        }
        this.pageIndex++; // 设为下一页
        console.log("ExScroller onPullup");

        let d = await this.getList({ pageIndex: this.pageIndex, pageSize: this.pageSize });
        console.log("ExScroller onPullup data loaded!");

        console.log(d);
        if (d.length === 0) {
          this.index = 0;
          console.log(this.index);
        }

        for (let i = 0; i < d.length; i++) {
          this.lst.push(d[i]);
        }

        console.log(this.lst);
        if (this.onGetCallback){
          this.onGetCallback(this.lst);
        }
        // this.loading = false;
        let _this = this;
        this.$nextTick(() => {
          setTimeout(() => {
            _this.$refs.scroller.donePullup();
            if (d.length < this.pageSize) {
              _this.pullupEnabledValue = false;
            }
            console.log("ExScroller onPullup done!");
          }, 10);
          _this.$refs.scroller.reset()
        })
      },
      // 下拉加载刷新
      async onPulldown () {
        console.log("ExScroller onPulldown");

        this.pageIndex = 1; // 设为第一页
        this.nomore = false;
        let d = await this.getList({ pageIndex: this.pageIndex, pageSize: this.pageSize });
        console.log("ExScroller onPulldown data loaded!");

        console.log('onPulldown', d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        let _this = this;
        // _this.loading = false;
        //清空数组
        _this.lst.splice(0, _this.lst.length);
        for (let i = 0; i < d.length; i++) {
          _this.lst.push(d[i]);
        }
        console.log(this.lst);
        if (this.onGetCallback){
          this.onGetCallback(this.lst);
        }
        _this.pullupEnabledValue = _this.pullupEnabled;
        this.$nextTick(() => {
          setTimeout(() => {
            _this.$refs.scroller.donePulldown();
            if (d.length < this.pageSize) {
              _this.pullupEnabledValue = false;
            }
            _this.pullupEnabledValue && _this.$refs.scroller.enablePullup();
            _this.$refs.scroller.reset({
              top: 0
            });
          }, 10);
        });
      },
      // 根据页码和每页显示奖学金个数来获取到奖学金
      async getList (ps) {
        let d = await this.onGetList(ps.pageIndex, ps.pageSize);
        console.log('getList()', d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        return d;
      },
      // 初始化加载列表， 显示loading
      async  initData () {
        console.log("ExScroller initData");
        // this.loading = true;
        await this.onPulldown();
        this.loaded = true;
        console.log("ExScroller initData done");
      }
    },
    mounted () {
      console.log("mounted..");
      if (this.autoLoad) {
        this.initData();
      }
    },
    data () {
      return {
        pullupEnabledValue: this.pullupEnabled,
        status: {
          pullupStatus: 'default',
          pulldownStatus: 'default'
        },
        downConfig: {
          content: '下拉刷新',
          downContent: '下拉刷新',
          upContent: '释放后更新',
          loadingContent: '加载中...'
        },
        pullup: {
          pullUpHeight: 20,
          height: 60
        },
        pageIndex: 1,
        loading: false,
        loaded: false,
        lst: []
      }
    },
    computed: {
    },
    watch: {
      value (val) {
        console.log("exscroller value wathing:" + val);
        this.lst = val;
      },

      lst (val) {
        console.log("exscroller lst watching:" + val);
        this.$emit('input', val);   // 调用input触发v-model更新
      }
    }
  }
</script>

<style>
  .rotate {
    display: inline-block;
    transform: rotate(-180deg);
  }
  .pullup-arrow {
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
  }
  .scoller-wrapper{
    height:100%;
  }
  .xs-plugin-pulldown-container{
    font-size: 13px;
    color: #555;
  }
  .xs-plugin-pullup-container{
    position: absolute;
    width: 100%;
    height: 60px;
    line-height: 40px;
    bottom: -60px;
    text-align: center;
    font-size: 13px;
    color: #555;
  }
</style>
