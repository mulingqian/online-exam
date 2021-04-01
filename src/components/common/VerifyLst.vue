<template>
  <div>
    <group :gutter="gutter">
      <cell :is-link="isLink" @click.native="clickCell">
        <div slot="after-title" class="after-title">
          <span v-if="showIconTitle" class="gp-left">
            <label :class="iconTitleType ? 'stuIconTitle iconTitle' : 'teaIconTitle iconTitle'">
              <slot name="iconTitle"></slot>
            </label>
          </span>
          <div :class="showIconTitle ? 'gp-right' : 'allwidthgp-right'">
            <slot name="right-info"></slot>
            <template v-if="showVerifyButton">
              <button-val :class="showLine? 'botton-box' : ''" @get-ButtonVal="getButtonVal" :buttonValLst="buttonValLst"></button-val>
            </template>
          </div>
        </div>
        <span class="keep-right">
          <slot name="keep-right"></slot>
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import ButtonVal from '../common/ButtonVal.vue'
  export default {
    name: 'commonVerifyLst',
    directives: {
    },
    components: {
      Group,
      Cell,
      ButtonVal
    },
    props: {
      gutter: {
        type: String,
        default: null
      },
      item: {
        type: Object,
        default: null
      }, // 信息，包括信息的id
      showIconTitle: { // 默认显示头像
        type: Boolean,
        default: true
      },
      iconTitleType: { // 默认显示学生用户 #27d1bf
        type: Boolean,
        default: true
      },
      showLine: { // 是否显示一条横杆
        type: Boolean,
        default: true
      },
      isLink: { // 是否显示右箭头
        type: Boolean,
        default: false
      },
      showVerifyButton: { // 审核的按钮默认不显示
        type: Boolean,
        default: false
      },
      buttonValLst: { // 退回和通过默认两个
        type: Array,
        default: function () {
          return [{label: '通过', type: 2}, {label: '拒绝', type: 4}]
        }
      }
    },
    methods: {
      // 点击 cell -在右箭头的情况下
      clickCell () {
        if (this.isLink) {
          this.$emit('click-cell', {info: this.item});
         // console.log('cell click');
        }
      },
      // 点击事件
      getButtonVal (e) {
        this.$emit('get-ButtonVal', {info: this.item, type: e.type});
      }
    },
    created () {
    },
    data () {
      return {
      }
    }
  }
</script>
<style scoped lang="less">
  .after-title{
    overflow: hidden;
  }
  .gp-left{
    float: left;
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    margin-top: 4px;
    font-size: 12px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    overflow: hidden;
  }
  .iconTitle{
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    color: #fff;
    letter-spacing: .1em;
  }
  .stuIconTitle{
    background-color: @stu-theme-color;
  }
  .teaIconTitle{
    background-color: @tea-theme-color;
  }
  .gp-right{
    float: left;
    width: 74%;
    display: inline-block;
  }
  .allwidthgp-right{
    width: 100%;
    display: inline-block;
  }
  .botton-box{
    border-top: 1px solid #f2f2f2;
  }
  .keep-right{
    font-size: 12px;
  }
</style>
