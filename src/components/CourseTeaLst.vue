<template>
  <div class="course-tealst">
    <course-tea v-if="!loaded"></course-tea>
  </div>
</template>
<script>
  import CourseTea from './CourseTea.vue'
  export default {
    name: "courseTeaLst",
    components: {
      CourseTea
    },
    methods: {
      // 查询是否有权限查看所有教师的课表
      async getOtherTeacherSchedule () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetAllowedLookupOtherTeacherSchedule'});
        if (d.status && d.status === "error") {
          console.log("GetAllowedLookupOtherTeacherSchedule", d);
          return;
        }
        this.loaded = false;
        sessionStorage.setItem("isAllowLookTeaSchedule", d);
      }
    },
    beforeDestroy () {
      sessionStorage.removeItem("isAllowLookTeaSchedule");
    },
    created () {
      // 查询是否有权限查看所有教师的课表
      this.getOtherTeacherSchedule();
    },
    data () {
      return {
        loaded: true
      }
    }
  }
</script>
