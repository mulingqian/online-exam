<template>
  <div>
    <div class="vux-flexbox vux-flex-row"  style="padding:10px 0 0 0;flex: 0 0 80%;margin-bottom:-10px; " v-show="showCell">
      <div class="vux-flexbox-item" style="padding:10px 0 0 8px;flex: 0 0 70%; ">
        <div class="weui-flex__item">
          当前:
          <span v-if="!weekType && !displayFormat && showName && value.length && scoreTeaLstXqcm === ''">{{value | value2name(data)}}</span>
          <span v-if="!weekType && !displayFormat && showName && value.length && scoreTeaLstXqcm !== ''">{{scoreTeaLstXqcm}}</span>
          <span v-if="weekType">{{currentXQMC}}</span>
          <slot name="after-title"></slot>
        </div>
      </div>
      <div class="vux-flexbox-item" style="padding:0 25px 0 0;width:160px; text-align:right;">
        <span style="display:inline-block;"  v-if="weekType" class="weekinfo">第{{currentWeek}}周 </span>
        <span style="display:inline-block;" class="tool-icon placeholder icon-select" @click="onClick" ></span>
      </div>
    </div>
    <div v-transfer-dom="isTransferDom">
      <popup v-model="showValue" class="vux-popup-picker" :id="`vux-popup-picker-${uuid}`" @on-hide="onPopupHide" @on-show="onPopupShow">
        <div class="vux-popup-picker-container">
          <div class="vux-popup-picker-header">
            <flexbox>
              <flexbox-item class="vux-popup-picker-header-menu vux-popup-picker-cancel" @click.native="onHide(false)">{{cancelText}}</flexbox-item>
              <flexbox-item class="vux-popup-picker-header-menu vux-popup-picker-header-menu-right" @click.native="onHide(true)">{{confirmText}}</flexbox-item>
            </flexbox>
          </div>
          <picker
            :data="data"
            v-model="tempValue"
            @on-change="onPickerChange"
            :columns="columns"
            :fixed-columns="fixedColumns"
            :container="'#vux-popup-picker-'+uuid"
            :column-width="columnWidth"></picker>
        </div>
      </popup>
    </div>
  </div>
</template>


<script>
  // import {Cell, Picker, Popup, Flexbox, FlexboxItem, InlineDesc, TransferDom} from 'vux'
  import Cell from 'vux/src/components/cell/index.vue'
  import Picker from 'vux/src/components/picker/index.vue'
  import Popup from 'vux/src/components/popup/index.vue'
  import Flexbox from 'vux/src/components/flexbox/flexbox.vue'
  import FlexboxItem from 'vux/src/components/flexbox/flexbox-item.vue'
  import InlineDesc from 'vux/src/components/inline-desc/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'

  import array2string from 'vux/src/filters/array2String'
  import value2name from 'vux/src/filters/value2name'
  import uuidMixin from 'vux/src/libs/mixin_uuid'
//  import TransferDom from 'vux/src/directives/transfer-dom'

  const getObject = function (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  export default {
    name: "smst",
    directives: {
      TransferDom
    },
    created () {
      this.getWeeksIdx(); // 得到当天是星期几
    },
    mixins: [uuidMixin],
    components: {
      Picker,
      Cell,
      Popup,
      Flexbox,
      FlexboxItem,
      InlineDesc
    },
    filters: {
      array2string,
      value2name
    },
    props: {
      valueTextAlign: {
        type: String,
        default: 'right'
      },
      title: String,
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      placeholder: String,
      columns: {
        type: Number,
        default: 0
      },
      fixedColumns: {
        type: Number,
        default: 0
      },
      // 是否选择周次
      weekType: {
        type: Boolean,
        default: false
      },
      showName: Boolean,
      inlineDesc: [String, Number, Array, Object, Boolean],
      showCell: {
        type: Boolean,
        default: true
      },
//      show: Boolean,
      displayFormat: Function,
      isTransferDom: {
        type: Boolean,
        default: true
      },
      columnWidth: Array
    },
    methods: {
      // 得到当天是星期几
      getWeeksIdx() {
        this.todayWeekIdx = new Date().getDay();
        this.getXQList();
      },
      async getXQList () {
        let xqs = [];
        let wks = [];
        let xqList = await this.QD.getSmstLst();
        if (!this.QD.currentXQ) {
          this.QD.xqList = xqList;
          this.QD.currentXQ = xqList.find((n) => n.CurrentXQ === true)
        }
        this.currentXQ = this.QD.currentXQ;
        if (!this.weekType) {
          // 选择学期
          for (let xq of xqList) {
            xqs.push({
              name: xq.XQMC,
              value: xq.XQID.toString()
            })
          }
          console.log("CourseLst got XQLIST");
          console.log(xqList);
          console.log(xqs);
          this.data = [xqs];
          this.value = [this.QD.currentXQ.XQID.toString()];
          this.tempValue = getObject(this.value);
          this.currentData = JSON.stringify(this.data);
          // 从学生端 的考勤信息 中取学期名称 start
          if (sessionStorage.getItem("attendXqData") !== null) {
            let attendXqData = JSON.parse(sessionStorage.getItem("attendXqData"));
            this.scoreTeaLstXqcm = attendXqData.XQMC;
            this.currentXQ = attendXqData; // 从考勤信息页面取出的学期信息
            this.value = [this.currentXQ.XQID.toString()];
            this.tempValue = getObject(this.value);
            sessionStorage.removeItem("attendXqData");
          }
          // 从学生端 的考勤信息 中取学期名称 end
          // 从教师端 的成绩单 中取学期名称 start
          if (sessionStorage.getItem("scoreTeaXqData") !== null) {
            let scoreXqData = JSON.parse(sessionStorage.getItem("scoreTeaXqData"));
            this.scoreTeaLstXqcm = scoreXqData.XQMC;
            this.currentXQ = scoreXqData;
            this.value = [this.currentXQ.XQID.toString()];
            this.tempValue = getObject(this.value);
            sessionStorage.removeItem("scoreTeaXqData");
          }
          // 从教师端 的成绩单 中取学期名称 end
          this.$emit('on-load', this.currentXQ)
        } else {
          // 选择周次
          let d = await this.QD.getData(this.QD.API.weeklst, {xqid: this.currentXQ.XQID});
          console.log(d);
          // 选择学期
          for (let w of d) {
            wks.push({
              name: `第 ${w.WeekIndex} 周`,
              value: w.WeekIndex.toString()
            })
            // xqs.push(xq.XQMC)
          }
          console.log("CourseLst got XQLIST");
          console.log(d)
          console.log(wks)
          this.data = [wks]
          let currW = d.find((n) => n.IsCurrentWeekIndex === true);
          // 教师端的课堂日志，从学生考勤返回到课堂日志，判断之前选择的周次； 教师端或学生端的教学日志，从登记教学日志返回到课表，还是之前选中的周次.3.班级课表
          if (sessionStorage.getItem("logEditWeekIndex") !== null) {
            this.currentWeek = sessionStorage.getItem("logEditWeekIndex");
            sessionStorage.removeItem("logEditWeekIndex");
          } else {
            if (!currW) {
              this.currentWeek = 1;
            } else {
              this.currentWeek = currW.WeekIndex;
              if (this.todayWeekIdx === 6 || this.todayWeekIdx === 0) {
                this.currentWeek += 1;
              }
            }
          }
          this.value = [this.currentWeek.toString()];
          this.tempValue = getObject(this.value);
          this.currentData = JSON.stringify(this.data);
          this.$emit('on-load', {XQID: this.QD.currentXQ.XQID, weekIndex: this.currentWeek})
        }
      },
      value2name,
      getNameValues () {
        return value2name(this.currentValue, this.data)
      },
      onClick () {
        console.log(`on click`);
        this.showValue = true
      },
      onHide (type) {
        console.log(`on hide ${type}`);
        this.showValue = false;
        if (type) {
          this.closeType = true;
          this.currentValue = getObject(this.tempValue)
        }
        if (!type) {
          this.closeType = false;
          if (this.value.length > 0) {
            this.tempValue = getObject(this.currentValue)
          }
        }
      },
      onPopupShow () {
        // reset close type to false
        console.log("onPopupShow");
        this.closeType = false;
        this.$emit('on-show')
      },
      onPopupHide () {
        console.log(`on popup hide`);
        if (this.value.length > 0) {
          this.tempValue = getObject(this.currentValue)
        }
        // this.$emit('on-hide', this.closeType, {name: value2name(this.value, this.data), value: this.value[0]})
        if (!this.weekType) {
          if (this.closeType !== false) {
            this.$emit('on-hide', this.closeType, this.QD.xqList.find((n) => n.XQID.toString() === this.value[0]));
            this.scoreTeaLstXqcm = ''; // 清空 教师端成绩查询 成绩单 中的学期名称
          } else {
            this.tempValue = getObject(this.value);
          }
        } else {
          /*在周次上，点击‘取消’，使之前周次位置不变*/
          if (this.closeType === false) {
            this.tempValue = getObject(this.value);
          }
          if (this.tempValue.length !== 0) {
            this.currentWeek = parseInt(this.tempValue);
            this.$emit('on-hide', this.closeType, {XQID: this.QD.currentXQ.XQID, weekIndex: this.currentWeek})
          }
        }
      },
      onPickerChange (val) {
        if (JSON.stringify(this.currentValue) !== JSON.stringify(val)) {
          // if has value, replace it
          if (this.value.length) {
            const nowData = JSON.stringify(this.data)
            if (nowData !== this.currentData && this.currentData !== '[]') {
              this.tempValue = getObject(val)
            }
            this.currentData = nowData
          } else { // if no value, stay quiet
            // if set to auto update, do update the value
          }
        }
        this.$emit('on-shadow-change', getObject(val))
      }
    },
    watch: {
      value (val) {
        if (JSON.stringify(val) !== JSON.stringify(this.tempValue)) {
          this.tempValue = getObject(val)
        }
      },
      currentValue (val) {
        this.value = getObject(val)
        this.$emit('on-change', getObject(val))
        this.$emit('input', getObject(val))
      }
//      showValue (val) {
//        console.log(`showValue changed ${val}`)
//        this.show = val
//      }
    },
    data () {
      return {
        data: [],
        value: [],
        onShowProcess: false,
        tempValue: null,
        closeType: false,
        currentData: JSON.stringify([]), // used for detecting if it is after data change
        showValue: false,
        currentValue: [],
        currentXQ: null,
        currentWeek: 1,
        scoreTeaLstXqcm: '', // 教师端成绩单 中的学期名称
        todayWeekIdx: null // 今天是星期几
      }
    },
    computed: {
      currentXQMC () {
        return this.currentXQ ? this.currentXQ.XQMC : ''
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/variable.less';
  @import '~vux/src/styles/1px.less';

  .vux-cell-box {
    position: relative;
  }
  .vux-cell-box:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    left: 15px;
  }
  .vux-popup-picker-header {
    height: 44px;
    color: @popup-picker-header-text-color;
    background-color: @popup-picker-header-bg-color;
    font-size: @popup-picker-header-font-size;
    position: relative;
    &:after {
      .setBottomLine(#e5e5e5);
    }
  }
  .vux-popup-picker-value {
    /* display: inline-block; */
  }
  .vux-popup-picker-header-menu {
    text-align: left;
    padding-left: 15px;
    line-height: 44px;
  }
  .vux-popup-picker-header-menu-right {
    text-align: right;
    padding-right: 15px;
  }
  .vux-popup-picker-select {
    width: 100%;
    position: relative;
  }
  .vux-popup-picker-select-box.weui-cell__bd:after {
    content: " ";
    display: inline-block;
    transform: rotate(45deg);
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    right: 15px;
    margin-top: -3px;
  }
  .vux-popup-picker-cancel {
    color: @popup-picker-header-cancel-text-color;
  }
  .vux-popup-picker-placeholder {
    color: #999;
  }
</style>
