<template>
  <div class="fieldMultiSStu">
    <group class="gp">
      <!--选择学生-多选-->
      <cell :value="selectMultiValLst" @click.native="selectMultiWay" is-link>
        <span slot="after-title" class="vux-label">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{multiSStuTitle}}
        </span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'fieldMultiSStu',
    components: {
      Cell,
      Group
    },
    props: {
      multiSStuLst: Object,
      scrollTop: Number
    },
    methods: {
      // 向父件传值
      getVal () {
        this.$emit('get-val', {val: this.selectMultiStuIdLst, valName: this.selectMultiValLst, labelpy: this.multiSStuLst.labelpy});
      },
      // 获取type类型的所有值
      getAllVal () {
        this.multiSStuTitle = this.multiSStuLst.label;
        this.isRequired = this.multiSStuLst.Isrequired;
        // 获取‘officeTwo’中的存值
        if (sessionStorage.getItem("field-" + this.multiSStuLst.labelpy) !== null && sessionStorage.getItem("fieldName-" + this.multiSStuLst.labelpy) !== null) {
          let name = sessionStorage.getItem("fieldName-" + this.multiSStuLst.labelpy).split(",");
          let stuId = sessionStorage.getItem("field-" + this.multiSStuLst.labelpy).split(",");
          this.selectMultiStuIdLst = stuId.join();
          this.selectMultiStuNameLst = name.join();
          this.selectMultiValLst = this.selectMultiStuNameLst;
         /* console.log(sessionStorage.getItem("field-" + this.multiSStuLst.labelpy));*/
        }
      },
      /* 选择学生 多选的方法*/
      selectMultiWay () {
        if (this.selectMultiStuNameLst !== ''&& this.selectMultiStuIdLst !== '') {
          sessionStorage.setItem("selectMultiStuNameLst_fieldMultiSStu", this.selectMultiStuNameLst);
          sessionStorage.setItem("selectMultiStuIdLst_fieldMultiSStu", this.selectMultiStuIdLst)
        }
        // 记录 scrollTop的值
        sessionStorage.setItem("officeTwoBoxScrollTop", this.scrollTop);
        /*跳转到选择学生 页面*/
        this.$router.push({path: '/selectMultiStudent', query: {page: 'fieldMultiSStudent'}});
      },
      // 得到多选教师的信息
      getMultiSeaData () {
        if (sessionStorage.getItem("selectMultiStuNameLst_fieldMultiSStu") !== null && sessionStorage.getItem("selectMultiStuIdLst_fieldMultiSStu") !== null) {
          let name = sessionStorage.getItem("selectMultiStuNameLst_fieldMultiSStu").split(",");
          let stuId = sessionStorage.getItem("selectMultiStuIdLst_fieldMultiSStu").split(",");
          this.selectMultiStuNameLst = name.join();
          this.selectMultiStuIdLst = stuId.join();
          this.selectMultiValLst = this.selectMultiStuNameLst;
          sessionStorage.removeItem("selectMultiStuNameLst_fieldMultiSStu");
          sessionStorage.removeItem("selectMultiStuIdLst_fieldMultiSStu");
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
        multiSStuTitle: '', // 多选框的标题
        selectMultiValLst: '选择', // 多选框中选定的值'a,b,c'
        selectMultiStuNameLst: '', // 选中的值
        selectMultiStuIdLst: '', // 选中教师对应的userId
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style>
  /*.fieldMultiSStu .gp .weui-cells {
    margin-top: 0;
  }*/
  .fieldMultiSStu .weui-cell .weui-cell__ft {
    color: #666666;
    font-size: 16px;
    width: 50%;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
