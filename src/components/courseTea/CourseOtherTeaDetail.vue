<template>
  <div class="course-tealst">
    <group v-if="teaInfo" class="gp">
      <cell :is-link="false">
        <span slot="after-title" class="title-Key">老师</span>
        <span class="disabled-value">{{teaInfo.xm}}</span>
      </cell>
    </group>
    <course-tea :urlHadZGH="true"></course-tea>
  </div>
</template>
<script>
  import CourseTea from '../CourseTea.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  export default {
    name: "courseOtherTeaDetail",
    components: {
      CourseTea,
      Group,
      Cell
    },
    data () {
      return {
        teaInfo: null
      }
    },
    created () {
      this.getTeaInfo(); // 得到老师的相关信息
    },
    methods: {
      // 得到老师的相关信息
      getTeaInfo () {
        if (this.QD.currPgToOtherPg) {
          this.teaInfo = this.QD.currPgToOtherPg.tea;
          this.QD.currPgToOtherPg = null;
        } else {
          this.$router.go(-1);
        }
      }
    },
    beforeDestroy () {
    }
  }
</script>
<style scoped>
  .gp{
    margin-top: -20px;
  }
  .title-Key{
    display: inline-block;
    width: 40px;
  }
  .disabled-value{
    font-size: 14px;
    color: #666666;
  }
</style>
