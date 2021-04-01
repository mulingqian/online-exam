<template>
  <div class="officeTwo">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <!--添加‘自定义流程数据’-->
    <div class="differType" id="office_two_box">
      <controll-field v-for="(s, idx) in formData.option" :key="idx" :fieldType="s" :scrollTop="scrollTop" @get-val="getVal"></controll-field>
      <div class="kg"></div>
      <footer>
        <div class="submitOffice" @click="submitForm"><a>保存</a></div>
      </footer>
    </div>
  </div>
</template>
<script>
  import ControllField from '../primaryKey/ControllField.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: "officeTwo",
    directives: {
      TransferDom
    },
    components: {
      Loading,
      ControllField
    },
    /*activated () {
      console.log("start into activat-scrollTop---------", document.querySelector('#vux_view_box_body').scrollTop);
      console.log('this.demoTop is ', this.demoTop);
      setTimeout(() => {
        console.log('this.demoTop is ', this.demoTop);
        document.querySelector('#vux_view_box_body').scrollTop = this.demoTop;
        console.log("nextTicked:", document.querySelector('#vux_view_box_body').scrollTop);
      }, 1000);
      console.log("end into activated-scrollTop---------", document.querySelector('#vux_view_box_body').scrollTop);
    },*/
    mounted () {
      // 通过$refs获取dom元素
      this.officeBox = document.querySelector('#office_two_box');
      // 监听这个dom的scroll事件
      setTimeout(() => {
        this.officeBox.addEventListener('scroll', () => {
          this.scrollTop = this.officeBox.scrollTop;
        }, false);
      }, 1000);
      let timer = null;
      if (sessionStorage.getItem("officeTwoBoxScrollTop") !== null) {
        let top = parseInt(sessionStorage.getItem("officeTwoBoxScrollTop"));
        this.scrollTop = top;
        timer = setInterval(function () {
          if (top === document.querySelector('#office_two_box').scrollTop) {
            clearInterval(timer);
            console.log("end setInterval");
          } else {
            document.querySelector('#office_two_box').scrollTop = top;
            console.log("ing setInterval");
          }
        }, 20);
        console.log("top", top, typeof (top));
        console.log("document.querySelector('#office_two_box').scrollTop", document.querySelector('#office_two_box').scrollTop);
        sessionStorage.removeItem("officeTwoBoxScrollTop");
      }
    },
    beforeMount () {
    },
    methods: {
      loadScrollTop () {
      },
      // 获取表单
      getForm () {
        this.formData = {"fromName": "办公1",
          "formIllustrate": '表单说明',
          "formGroup": '分组1',
          "option": [{"type": 'text', "label": '单行文本对对对对方答复对方答复01', "hint": '请输入', 'Isrequired': 'true', 'labelpy': 'dhwb'},
            {"type": 'text', "label": '单行文本02', "hint": '请输入', 'Isrequired': 'true', 'labelpy': 'dhwb02'},
            {"type": 'radio', "label": '单选框', "hint": '请选择', 'Isrequired': 'true', 'options': ['ah', 'bh', 'ch'], 'labelpy': 'dxk'},
            {"type": 'checkbox', "label": '多选框', "hint": '请选择', "options": ['a1', 'b2', 'c3'], 'Isrequired': 'true', 'labelpy': 'mulitxk'},
            {"type": 'data', "label": '开始日期01', "datetype": '年-月-日 时:分', 'Isrequired': 'true', 'labelpy': 'date01'},
            {"type": 'data', "label": '日期02', "datetype": '年-月-日 时:分', 'Isrequired': 'true', 'labelpy': 'date02'},
            {"type": 'singleSStu', "label": '单选学生', "hint": '选择', 'Isrequired': 'true', 'labelpy': 'dhxs'},
            {"type": 'money', "label": '金额(元)', "hint": '请输入', 'Isrequired': 'true', 'labelpy': 'je'},
            {"type": 'number', "label": '数字输入框', "hint": '请输入', 'Isrequired': 'true', 'labelpy': 'sz'},
            {"type": 'label', "label": '说明', 'content': "说明文字", 'Isrequired': 'true', 'labelpy': 'sm'},
            {"type": 'img', "label": '图片', 'Isrequired': 'true', 'labelpy': 'img'},
            {"type": 'multiline', "label": '多行文本', "hint": '请输入', 'Isrequired': 'true', 'labelpy': 'multihwb'},
            {"type": 'multiSTea', "label": '选择教师', "hint": '选择', 'Isrequired': 'true', 'labelpy': 'multixjs'},
            {"type": 'singleSTea', "label": '单选教师', "hint": '选择', 'Isrequired': 'true', 'labelpy': 'dxjs'},
            {"type": 'multiSStu', "label": '多选学生', "hint": '选择', 'Isrequired': 'true', 'labelpy': 'multihxs'}]
        };
      },
      // 获取组件的值并保存在sessionStorage
      getVal (e) {
        console.log(e.labelpy, '----', e.val);
        sessionStorage.setItem("field-" + e.labelpy, e.val);
        if (e.valName !== undefined) {
          sessionStorage.setItem("fieldName-" + e.labelpy, e.valName);
          console.log("name", e.valName);
        }
      },
      /*提交*/
      submitForm () {
        console.log("提交");
      }
    },
    /*computed: {
      ...mapState({
        demoTop: state => state.vux.demoScrollTop
      })
    },*/
    created () {
      // 获取表单
      this.getForm();
      this.loadScrollTop();
    },
    data () {
      return {
        loading: false,
        formData: [], // 表单的数据
        repeatNum: [], // 调用几次主键
        singleTextTitle: '单行文本',
        dateTitle: '日期',
        singleSelectTitle: '单选框',
        multiSelectBoxTitle: '多选框',
        numberEntryTitle: '数字输入框',
        moneyTiTle: '金额',
        explainWordTitle: '这里是说明文字',
        multiLineTextTitle: '多行文本',
        imgTitle: '图片',
        singleTextShow: false, // 单行文本显示
        dateShow: false, // 日期
        singleSelectShow: false, // 单选框
        multiLineTextShow: false, // 多行文本
        multiSelectBoxShow: false, // 多选框
        numberShow: false, // 数字输入框
        moneyShow: false, // 金额
        explainShow: false, // 说明文字
        imgShow: false, // 图片
        officeBox: null,
        scrollTop: 0 // 滑动距离顶部的距离
      }
    }
  }
</script>
<style scoped>
  .officeTwo{
    background-color: #f2f2f2;
    /*overflow: auto;*/
  }
 .differType{
  height: 100%;
   background-color: #f2f2f2;
   overflow: auto;
  }
  .kg{
    width: 100%;
    height: 70px;
    background-color: #f2f2f2;
  }
  footer{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .submitOffice{
    margin-top: 10px;
    text-align: center;
    background-color: #0f89e0;
    border-radius: 5px;
  }
  .submitOffice a{
    display: inline-block;
    padding:12px 10px;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
  }
</style>
<style>
  .officeTwo .differType .controllField:nth-child(1) .weui-cells{
    margin-top: 0;
  }
</style>
