<template>
  <div class="fieldMoney">
    <group class="gp">
      <!--金额-->
     <!-- <x-input type="text" required v-model="moneyVal" @on-change="clearNoNum" :placeholder="moneyLst.hint" :max="16">
        <span slot="label" class="title">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{moneyTiTle}}
        </span>
      </x-input>-->
      <cell>
        <span slot="after-title" class="vux-label">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{moneyTiTle}}
        </span>
        <span slot="default" class="rg-cell">
          <input v-on:input="clearNoNum()" type="text" class="moneyCase" v-model="moneyVal" :placeholder="moneyLst.hint" maxlength="16"/>
        </span>
      </cell>
    </group>
    <span class="chineseMoney">大写：{{chineseMoneyVal}}</span>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  /*import XInput from 'vux/src/components/x-input/index.vue'*/
  export default {
    name: 'primaryKey-fieldMoney',
    components: {
      Group,
      Cell
    },
    props: {
      moneyLst: Object
    },
    methods: {
      clearNoNum(){
        let len = this.moneyVal.length;
        if (this.moneyVal.charAt(len) === 'e' || this.moneyVal.charAt(len) === '-') {
          this.moneyVal=this.moneyVal.substring(0, this.moneyVal.length-1);
        }
        this.moneyVal = this.moneyVal.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        this.moneyVal = this.moneyVal.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        this.moneyVal = this.moneyVal.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        this.moneyVal = this.moneyVal.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        if (this.moneyVal.indexOf(".")< 0 && this.moneyVal !=="") {
            //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          this.moneyVal= parseFloat(this.moneyVal);
        }
        this.getChineseMoneyVal(this.moneyVal);
        this.$emit('get-val', {val: this.moneyVal, labelpy: this.moneyLst.labelpy});
      },
  // 获取type类型的所有值
      getAllVal () {
        this.moneyTiTle = this.moneyLst.label;
        this.isRequired = this.moneyLst.Isrequired;
        if (sessionStorage.getItem("field-" + this.moneyLst.labelpy) !== null) {
          this.moneyVal = sessionStorage.getItem("field-" + this.moneyLst.labelpy);
          this.getChineseMoneyVal(this.moneyVal);
        }
      },
      getChineseMoneyVal(n) {
        let fraction = ['角', '分'];
        let digit = [
          '零', '壹', '贰', '叁', '肆',
          '伍', '陆', '柒', '捌', '玖'
        ];
        let unit = [
          ['元', '万', '亿'],
          ['', '拾', '佰', '仟']
        ];
        let head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        let s = '';
        for (let i = 0; i < fraction.length; i++) {
          s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);
        for (let i = 0; i < unit[0].length && n > 0; i++) {
          let p = '';
          for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
          }
          s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        this.chineseMoneyVal = head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
    },
    data () {
      return {
        moneyTiTle: '', // 金额的标题
        moneyVal: '', // 金额绑定的值
        chineseMoneyVal: '', // 大写人民币
        isRequired: 'false' // 是否是必填的
      }
    },
    watch: {
    }
  }
</script>
<style scoped>
  .moneyCase{
    width: 100%;
    height: 25px;
    text-align: right;
    font-size: 16px;
    color: #666666;
    border: 0;
    outline: none;
  }
  .chineseMoney{
    display: block;
    font-size: 14px;
    padding-left: 15px;
    padding-top: 4px;
    padding-bottom: 4px;
    line-height: 20px;
    color: #666666;
    background-color: #fff;
  }
</style>
<style>
  .fieldMoney .gp .weui-cells:before,
  .fieldMoney .gp .weui-cells:after{
    border-bottom: 0;
  }
  .fieldMoney .gp .weui-input{
    width: 95%;
    padding-left: 10px;
    padding-right: 10px;
    text-align: right;
  }
 /* .fieldMoney .weui-cell .weui-cell__hd{
    width: 50%;
  }
  .fieldMoney .weui-cell .weui-cell__primary{
    padding-left: 8px;
  }
  .fieldMoney .weui-cell .weui-cell__primary input{
    text-align: right;
  }*/
</style>

