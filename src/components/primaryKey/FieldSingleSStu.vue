<template>
  <div class="fieldMultiSStu">
    <group class="gp">
      <!--选择教师-多选-->
      <cell :value="selectSingleValLst" @click.native="selectSingleStuWay" is-link>
        <span slot="after-title" class="vux-label">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{singleSStuTitle}}
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'fieldSingleSStu',
    components: {
      Cell,
      Group
    },
    props: {
      singleSStuLst: Object,
      scrollTop: Number
    },
    methods: {
      // 向父件传值
      getVal () {
        this.$emit('get-val', {val: this.selectSingleStuIdLst, valName: this.selectSingleStuNameLst, labelpy: this.singleSStuLst.labelpy});
      },
      // 单选 学生
      selectSingleStuWay () {
        if (this.selectSingleStuNameLst !== ''&& this.selectSingleStuUserIdLst !== '') {
          sessionStorage.setItem("selectSingleStuNameLst_fieldSingleSStu", this.selectSingleStuNameLst);
          sessionStorage.setItem("selectSingleStuIdLst_fieldSingleSStu", this.selectSingleStuUserIdLst)
        }
        // 记录 scrollTop的值
        sessionStorage.setItem("officeTwoBoxScrollTop", this.scrollTop);
        this.$router.push({path: '/selectStudentMoral', query: {page: 'fieldSingleSStu'}});
      },
      // 获取type类型的所有值
      getAllVal () {
        this.singleSStuTitle = this.singleSStuLst.label;
        this.isRequired = this.singleSStuLst.Isrequired;
        // 获取‘officeTwo’中的存值
        if (sessionStorage.getItem("field-" + this.singleSStuLst.labelpy) !== null && sessionStorage.getItem("fieldName-" + this.singleSStuLst.labelpy) !== null) {
          this.selectSingleStuNameLst = sessionStorage.getItem("fieldName-" + this.singleSStuLst.labelpy);
          this.selectSingleStuIdLst = sessionStorage.getItem("field-" + this.singleSStuLst.labelpy);
          this.selectSingleValLst = this.selectSingleStuNameLst;
        }
      },
      // 得到单选学生的信息
      getMultiSeaData () {
        if (sessionStorage.getItem("selectSingleStuNameLst_fieldSingleSStu") !== null && sessionStorage.getItem("selectSingleStuIdLst_fieldSingleSStu") !== null) {
          this.selectSingleStuNameLst = sessionStorage.getItem("selectSingleStuNameLst_fieldSingleSStu");
          this.selectSingleStuIdLst = sessionStorage.getItem("selectSingleStuIdLst_fieldSingleSStu");
          this.selectSingleValLst = this.selectSingleStuNameLst;
          sessionStorage.removeItem("selectSingleStuNameLst_fieldSingleSStu");
          sessionStorage.removeItem("selectSingleStuIdLst_fieldSingleSStu");
          /*向（控件）组件传值*/
          this.getVal();
        }
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
      // 得到单选学生的信息
      this.getMultiSeaData();
    },
    data () {
      return {
        singleSStuTitle: '', // 单选学生标题
        selectSingleValLst: '选择', // 多选框中选定的值'a,b,c'
        selectSingleStuNameLst: '', // 选中的值
        selectSingleStuIdLst: '', // 选中教师对应的stuId
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style>
</style>
