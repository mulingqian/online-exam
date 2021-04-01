<template>
  <div class="controllField">
    <!--单行文本-->
    <field-sing-le-line-text v-if="singleTextShow" :singleTextLst="singleTextLst" @get-val="getVal"></field-sing-le-line-text>
    <!-- 多行文本-->
    <field-multi-line-text v-if="multiLineTextShow" :multiLineTextLst="multiLineTextLst" @get-val="getVal"></field-multi-line-text>
    <!--数字输入框-->
    <field-number-entry v-if="numberShow" :numberEntryLst="numberEntryLst" @get-val="getVal"></field-number-entry>
    <!--图片-->
    <field-img v-if="imgShow" :imgLst="imgLst" @get-val="getVal"></field-img>
    <!--说明文字-->
    <field-explain-word v-if="explainShow" :explainWordLst="explainWordLst" @get-val="getVal"></field-explain-word>
    <!--单选框-->
    <field-single-select v-if="singleSelectShow" :singleSelectLst="singleSelectLst" @get-val="getVal"></field-single-select>
    <!--多选框-->
    <field-multi-select-box v-if="multiSelectBoxShow" :multiSelectBoxLst="multiSelectBoxLst" @get-val="getVal"></field-multi-select-box>
    <!--日期-->
    <field-date v-if="dateShow" :dateLst="dateLst" @get-val="getVal"></field-date>
    <!--金额-->
    <field-money v-if="moneyShow" :moneyLst="moneyLst" @get-val="getVal"></field-money>
    <!--选择教师 多选-->
    <field-multi-s-tea v-if="multiSTeaLstShow" :multiSTeaLst="multiSTeaLst" :scrollTop="scrollTop" @get-val="getVal"></field-multi-s-tea>
    <!--选择教师 单选-->
    <field-single-s-tea v-if="singleSTeaLstShow" :singleSTeaLst="singleSTeaLst" :scrollTop="scrollTop" @get-val="getVal"></field-single-s-tea>
    <!--选择学生 单选-->
    <field-single-s-stu v-if="singleSStuLstShow" :singleSStuLst="singleSStuLst" :scrollTop="scrollTop" @get-val="getVal"></field-single-s-stu>
    <!--选择学生 多选-->
    <field-multi-s-stu v-if="multiSStuLstShow" :multiSStuLst="multiSStuLst" :scrollTop="scrollTop" @get-val="getVal"></field-multi-s-stu>

  </div>
</template>
<script>
  import FieldSingLeLineText from '../primaryKey/FieldSingleLineText.vue'
  import FieldMultiLineText from '../primaryKey/FieldMultiLineText.vue'
  import FieldNumberEntry from '../primaryKey/FieldNumberEntry.vue'
  import FieldImg from '../primaryKey/FieldImg.vue'
  import FieldExplainWord from '../primaryKey/FieldExplainWord.vue'
  import FieldSingleSelect from '../primaryKey/FieldSingleSelect.vue'
  import FieldMultiSelectBox from '../primaryKey/FieldMultiSelectBox.vue'
  import FieldDate from '../primaryKey/FieldDate.vue'
  import FieldMoney from '../primaryKey/FieldMoney.vue'
  import FieldMultiSTea from '../primaryKey/FieldMultiSTea.vue'
  import FieldSingleSTea from '../primaryKey/FieldSingleSTea.vue'
  import FieldSingleSStu from '../primaryKey/FieldSingleSStu.vue'
  import FieldMultiSStu from '../primaryKey/FieldMultiSStu.vue'

  export default {
    name: 'primaryKey-controllField',
    components: {
      FieldSingLeLineText,
      FieldMultiLineText,
      FieldNumberEntry,
      FieldImg,
      FieldExplainWord,
      FieldSingleSelect,
      FieldMultiSelectBox,
      FieldDate,
      FieldMoney,
      FieldMultiSTea,
      FieldSingleSTea,
      FieldSingleSStu,
      FieldMultiSStu
    },
    props: {
      fieldType: Object,
      scrollTop: Number
    },
    methods: {
      getVal (e) {
        this.$emit('get-val', {val: e.val, valName: e.valName, labelpy: e.labelpy});
      },
      /*判断加载哪一个子组件*/
      getSonComponent () {
        let fieldType = this.fieldType;
        let type = this.fieldType.type;
        switch (type) {
            /*单行文本显示*/
          case 'text':
            this.singleTextShow = true;
            this.singleTextLst = fieldType;
            break;
            /*多行文本*/
          case 'multiline':
            this.multiLineTextShow = true;
            this.multiLineTextLst = fieldType;
            break;
          /*数字输入框*/
          case 'number':
            this.numberShow = true;
            this.numberEntryLst = fieldType;
            break;
          /*图片*/
          case 'img':
            this.imgShow = true;
            this.imgLst = fieldType;
            break;
          /*说明文字*/
          case 'label':
            this.explainShow = true;
            this.explainWordLst = fieldType;
            break;
          /*单选框*/
          case 'radio':
            this.singleSelectShow = true;
            this.singleSelectLst = fieldType;
            break;
          /*多选框*/
          case 'checkbox':
            this.multiSelectBoxShow = true;
            this.multiSelectBoxLst = fieldType;
            break;
          /*日期*/
          case 'data':
            this.dateShow = true;
            this.dateLst = fieldType;
            break;
          /*金额*/
          case 'money':
            this.moneyLst = fieldType;
            this.moneyShow = true;
            break;
          /*选择教师 多选*/
          case 'multiSTea':
            this.multiSTeaLst = fieldType;
            this.multiSTeaLstShow = true;
            break;
          case 'singleSTea':
            this.singleSTeaLst = fieldType;
            this.singleSTeaLstShow = true;
            break;
          case 'singleSStu':
            this.singleSStuLst = fieldType;
            this.singleSStuLstShow = true;
            break;
          case 'multiSStu':
            this.multiSStuLst = fieldType;
            this.multiSStuLstShow = true;
            break;
        }
      }
    },
    mounted () {
      this.getSonComponent();
    },
    data () {
      return {
        singleTextShow: false, // 单行文本显示
        dateShow: false, // 日期
        singleSelectShow: false, // 单选框
        multiLineTextShow: false, // 多行文本
        multiSelectBoxShow: false, // 多选框
        numberShow: false, // 数字输入框
        moneyShow: false, // 金额
        explainShow: false, // 说明文字
        imgShow: false, // 图片
        multiSTeaLstShow: false, // 选择教师 多选
        singleSTeaLstShow: false, // 选择教师 单选
        singleSStuLstShow: false, // 选择学生 单选
        multiSStuLstShow: false, // 选择学生 多选
        singleTextLst: [], // 单行文本显示
        dateLst: [],  // 日期
        singleSelectLst: [],  // 单选框
        multiSelectBoxLst: [], // 多选框
        numberEntryLst: [], // 数字输入框
        moneyLst: [], // 金额
        explainWordLst: [], // 说明文字
        multiLineTextLst: [], // 多行文本
        imgLst: [], // 图片
        multiSTeaLst: [], // 选择教师 多选
        singleSTeaLst: [], // 选择教师 单选
        singleSStuLst: [], // 选择学生 单选
        multiSStuLst: [] // 选择学生 多选
      }
    }
  }
</script>
<style scoped>
  .controllField{
    background-color: #f2f2f2;
  }
</style>
