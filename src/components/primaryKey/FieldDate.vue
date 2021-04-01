<template>
  <div class="fieldDate">
    <group class="gp">
      <!--日期-->
      <datetime v-model="changeDate"
                @on-change="dateChange">
        <span slot="title">
          <a v-if="isRequired === 'true'" style="color: #ff0000;">*</a>
          {{dateTitle}}
        </span>
      </datetime>
    </group>
  </div>
</template>
<script>
  import Datetime from 'vux/src/components/datetime/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  export default {
    name: 'primaryKey-fieldDate',
    components: {
      Datetime,
      Group
    },
    props: {
      dateLst: Object
    },
    methods: {
      // 选择日期
      dateChange (value) {
        this.changeDate = value;
        console.log(this.changeDate);
        console.log(this.dateLst.labelpy);
        this.$emit('get-val', {val: this.changeDate, labelpy: this.dateLst.labelpy});
      },
      // 获取type类型的所有值
      getAllVal () {
        this.dateTitle = this.dateLst.label;
        this.isRequired = this.dateLst.Isrequired;
        if (sessionStorage.getItem("field-" + this.dateLst.labelpy) !== null) {
          this.changeDate = sessionStorage.getItem("field-" + this.dateLst.labelpy);
        }
      }
    },
    created () {
      // 获取type类型的所有值
      this.getAllVal();
    },
    data () {
      return {
        dateTitle: '', // 日期的标题
        changeDate: '选择', // 日期绑定的值
        isRequired: 'false' // 是否是必填的
      }
    }
  }
</script>
<style scoped>
</style>
<style>
  .fieldDate .gp .weui-cell_access .weui-cell__ft .vux-cell-value{
    color: #666666;
  }
</style>

