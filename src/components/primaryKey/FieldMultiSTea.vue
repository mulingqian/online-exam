<template>
  <div class="fieldMultiSTea">
    <group class="gp">
      <!--选择教师-多选-->
      <cell :value="selectMultiValLst" @click.native="selectMultiWay" is-link>
        <span slot="after-title" class="vux-label">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{multiSTeaTitle}}
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'fieldMultiSTea',
    components: {
      Cell,
      Group
    },
    props: {
      multiSTeaLst: Object,
      scrollTop: Number
    },
    methods: {
      // 向父件传值
      getVal () {
        this.$emit('get-val', {val: this.selectMultiEmployeeUserIdLst, valName: this.selectMultiEmployeeNameLst, labelpy: this.multiSTeaLst.labelpy});
      },
      // 获取type类型的所有值
      getAllVal () {
        this.multiSTeaTitle = this.multiSTeaLst.label;
        this.isRequired = this.multiSTeaLst.Isrequired;
        // 获取‘officeTwo’中的存值
        if (sessionStorage.getItem("field-" + this.multiSTeaLst.labelpy) !== null && sessionStorage.getItem("fieldName-" + this.multiSTeaLst.labelpy) !== null) {
          let name = sessionStorage.getItem("fieldName-" + this.multiSTeaLst.labelpy).split(",");
          let userId = sessionStorage.getItem("field-" + this.multiSTeaLst.labelpy).split(",");
          this.selectMultiEmployeeNameLst = name.join();
          this.selectMultiEmployeeUserIdLst = userId.join();
          this.selectMultiValLst = this.selectMultiEmployeeNameLst;
        }
      },
      selectMultiWay () {
        if (this.selectMultiEmployeeNameLst !== ''&& this.selectMultiEmployeeUserIdLst !== '') {
          sessionStorage.setItem("selectMultiEmployeeNameLst_fieldMultiSTea", this.selectMultiEmployeeNameLst);
          sessionStorage.setItem("selectMultiEmployeeUserIdLst_fieldMultiSTea", this.selectMultiEmployeeUserIdLst)
        }
        // 记录 scrollTop的值
        sessionStorage.setItem("officeTwoBoxScrollTop", this.scrollTop);
        this.$router.push({path: '/selectMultiTeacher', query: {page: 'fieldMultiSTea'}});
      },
      getMultiSeaData () {
        if (sessionStorage.getItem("selectMultiEmployeeNameLst_fieldMultiSTea") !== null && sessionStorage.getItem("selectMultiEmployeeUserIdLst_fieldMultiSTea") !== null) {
          let name = sessionStorage.getItem("selectMultiEmployeeNameLst_fieldMultiSTea").split(",");
          let userId = sessionStorage.getItem("selectMultiEmployeeUserIdLst_fieldMultiSTea").split(",");
          this.selectMultiEmployeeNameLst = name.join();
          this.selectMultiEmployeeUserIdLst = userId.join();
          this.selectMultiValLst = this.selectMultiEmployeeNameLst;
          sessionStorage.removeItem("selectMultiEmployeeNameLst_fieldMultiSTea");
          sessionStorage.removeItem("selectMultiEmployeeUserIdLst_fieldMultiSTea");
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
        multiSTeaTitle: '', // 多选框的标题
        selectMultiValLst: '选择', // 多选框中选定的值'a,b,c'
        selectMultiEmployeeNameLst: '', // 选中的值
        selectMultiEmployeeUserIdLst: '', // 选中教师对应的userId
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style>
  .fieldMultiSTea .weui-cell .weui-cell__ft {
    color: #666666;
    font-size: 16px;
    width: 50%;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
