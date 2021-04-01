<template>
  <div class="fieldMultiSTea">
    <group class="gp">
      <!--选择教师-多选-->
      <cell :value="selectSingleValLst" @click.native="selectSingleSTeaWay" is-link>
        <span slot="after-title" class="vux-label">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{singleSTeaTitle}}
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'fieldSingleSTea',
    components: {
      Cell,
      Group
    },
    props: {
      singleSTeaLst: Object,
      scrollTop: Number
    },
    methods: {
      // 向父件传值
      getVal () {
        this.$emit('get-val', {val: this.selectSingleEmployeeUserIdLst, valName: this.selectSingleEmployeeNameLst, labelpy: this.singleSTeaLst.labelpy});
      },
      // 获取type类型的所有值
      getAllVal () {
        this.singleSTeaTitle = this.singleSTeaLst.label;
        this.isRequired = this.singleSTeaLst.Isrequired;
        // 获取‘officeTwo’中的存值
        if (sessionStorage.getItem("field-" + this.singleSTeaLst.labelpy) !== null && sessionStorage.getItem("fieldName-" + this.singleSTeaLst.labelpy) !== null) {
          this.selectSingleEmployeeNameLst = sessionStorage.getItem("fieldName-" + this.singleSTeaLst.labelpy);
          this.selectSingleEmployeeUserIdLst = sessionStorage.getItem("field-" + this.singleSTeaLst.labelpy);
          this.selectSingleValLst = this.selectSingleEmployeeNameLst;
        }
      },
      // 跳转到选择教师页面
      selectSingleSTeaWay () {
        if (this.selectSingleEmployeeNameLst !== ''&& this.selectSingleEmployeeUserIdLst !== '') {
          sessionStorage.setItem("selectSingleEmployeeNameLst_fieldSingleSTea", this.selectSingleEmployeeNameLst);
          sessionStorage.setItem("selectSingleEmployeeUserIdLst_fieldSingleSTea", this.selectSingleEmployeeUserIdLst)
        }
        // 记录 scrollTop的值
        sessionStorage.setItem("officeTwoBoxScrollTop", this.scrollTop);
        this.$router.push({path: '/selectTeacher', query: {page: 'fieldSingleSTea'}});
      },
      getMultiSeaData () {
        if (sessionStorage.getItem("selectSingleEmployeeNameLst_fieldSingleSTea") !== null && sessionStorage.getItem("selectSingleEmployeeUserIdLst_fieldSingleSTea") !== null) {
          this.selectSingleEmployeeNameLst = sessionStorage.getItem("selectSingleEmployeeNameLst_fieldSingleSTea");
          this.selectSingleEmployeeUserIdLst = sessionStorage.getItem("selectSingleEmployeeUserIdLst_fieldSingleSTea");
          this.selectSingleValLst = this.selectSingleEmployeeNameLst;
          sessionStorage.removeItem("selectSingleEmployeeNameLst_fieldSingleSTea");
          sessionStorage.removeItem("selectSingleEmployeeUserIdLst_fieldSingleSTea");
          /*向（控件）组件传值*/
          this.getVal();
        }
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
      // 得到多选教师的信息
      this.getMultiSeaData();
    },
    data () {
      return {
        singleSTeaTitle: '', // 单选教师标题
        selectSingleValLst: '选择', // 多选框中选定的值'a,b,c'
        selectSingleEmployeeNameLst: '', // 选中的值
        selectSingleEmployeeUserIdLst: '', // 选中教师对应的userId
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style>
</style>
