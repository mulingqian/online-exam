<template>
  <div class="page-detail">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastMsg" position="top"></toast>
    <scroller lock-x height="-52" @on-scroll-bottom="onScroll" ref="scroller">
      <div>
        <group v-if="!!objInfo" label-width="5em">
          <cell>
            <span slot="after-title">晨检日期</span>
            <span slot="value" class="valuesize">{{ currDate }}</span>
          </cell>
          <cell>
            <span slot="after-title">班级名称</span>
            <span slot="value" class="valuesize">{{ bjmc }}</span>
          </cell>
          <cell>
            <span slot="after-title">班级代码</span>
            <span slot="value" class="valuesize">{{ bjdm }}</span>
          </cell>
          <cell
            title="学生列表"
            is-link
            :border-intent="false"
            :arrow-direction="showContent ? 'up' : 'down'">
            <x-button mini type="primary" @click.native="saveResult" :show-loading="saving">
              保存晨检结果
            </x-button>
          </cell>
          <cell>
            <span slot="after-title">
              <x-input placeholder="请输入学生姓名" v-model="studentName" style="height: 6px" v-on:input="searchStudent">
                <x-button slot="right" type="primary" mini @click.native="searchStudent">搜索</x-button>
              </x-input>
            </span>
          </cell>
          <template v-if="showContent">
            <cell :border-intent="false" v-for="(obj, index) in students" :key="index">
              <span slot="after-title" class="xmxh">{{ obj.XM }}
                <span v-if="obj.XB === '男'" class="demo-icon1">&#xe6d5;</span>
                <span v-if="obj.XB === '女'" class="demo-icon2">&#xe79f;</span>
              </span>
              <span slot="inline-desc"><badge :text="obj.XH" class="bg-badge"></badge></span>
              <span slot="value" class="stumess">
                <span v-on:click="checkStu(obj.StuId, 0)">
                  <x-button mini plain :class='obj.Item_SJ === true || obj.Item_SJ === "1" ? "btn-in btn-sj":"btn-in"'>
                    <span class="demo-icon demo-icon13">&#xe62f;</span>请假
                  </x-button>
                </span>
                <span v-on:click="checkStu(obj.StuId, 1)">
                  <x-button mini plain :class='obj.Item_BJ === true || obj.Item_BJ === "1" ? "btn-in btn-bj":"btn-in"'>
                    <span class="demo-icon demo-icon13" >&#xe611;</span>病假
                  </x-button>
                </span>
                <span v-on:click="checkStu(obj.StuId, 2)">
                  <x-button mini plain :class='obj.Item_QQ === true || obj.Item_QQ === "1" ? "btn-in btn-qq":"btn-in"'>
                    <span class="demo-icon demo-icon13" >&#xe624;</span>缺勤
                  </x-button>
                </span>
                <br />
                <div class="bj-info" v-if="obj.Item_BJ === true || obj.Item_BJ === '1'">病假说明：{{obj.Remark}}</div>
              </span>
            </cell>
          </template>
        </group>
      </div>
    </scroller>
  </div>
</template>

<script>
  // import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
  import Scroller from 'vux/src/components/scroller/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  import Badge from 'vux/src/components/badge/index.vue'
  import Toast from 'vux/src/components/toast/index.vue'

  export default {
    name: "morningCheckAddDetail",
    directives: {
      TransferDom
    },
    components: {
      Scroller,
      Cell,
      Group,
      Loading,
      Divider,
      XButton,
      XInput,
      Badge,
      Toast
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.scroller.reset({top: 0})
      })
    },
    methods: {
      // 根据学生的名字来搜索到学生
      searchStudent () {
        let k = 0;
        let result = [];
        this.students = this.s;
        if (this.studentName !== '') {
          for (let i=0; i<this.students.length; i++){
            if (this.students[i].XM.indexOf(this.studentName)>=0) {
              result.push(this.students[i]);
            }
          }
          this.students = result;
        }
        console.log(this.students);
      },
      // 保存
      async saveResult () {
        this.saving = true;
        let details = '[';
        for (let i=0; i<this.s.length; i++){
          details += i>0 ? "," : '';
          let stu = this.s[i];
          let sj = stu.Item_SJ === true ? "true" : "false";
          let bj = stu.Item_BJ === true ? "true" : "false";
          let qq = stu.Item_QQ === true ? "true" : "false";
          details += `{"XH": "${stu.XH}", "Item_SJ": ${sj}, "Item_BJ": ${bj},"Item_QQ": ${qq}, "Remark": "${stu.Remark}"}`;
        }
        details += ']';
        let d = await this.QD.getData('/School/StuClient/InsertStudentMorningCheckData', {zgh: this.zgh, bjid: this.id, attendDate: this.currDate, entityJson: details});
        this.saving = false;
        if (d.status === 'success') {
          this.toastMsg = "保存成功";
          this.showToast = true;
        } else {
          this.toastMsg = "保存失败";
          this.showToast = true;
        }
      },
      // 点击考勤
      checkStu (stuid, type) {
        for (let i=0; i<this.students.length; i++){
          let stu = this.students[i];
          if (stu.StuId === stuid){
            if (type === 0) { //  事假
              stu.Item_BJ = false;
              stu.Item_QQ = false;
              stu.Item_SJ = !stu.Item_SJ;
              stu.Remark = "";
              this.$set(this.students, i, this.students[i]);
            } else if (type === 1) {  // 病假
              // 病假要求填写Remark
              var that =this;
              if (!stu.Item_BJ) {
                this.QD.confirm("提示: 病假要求填写备注", "", function (m) {
                  stu.Item_SJ = false;
                  stu.Item_QQ = false;
                  stu.Item_BJ = !stu.Item_BJ;
                  stu.Remark = m;
                }, null, {showInput: true, inputVal: "", required: true});
              } else {
                stu.Item_BJ = !stu.Item_BJ;
                stu.Remark = "";
              }
              that.$set(this.students, i, this.students[i]);
            } else if (type === 2) {  // 缺勤
              stu.Item_SJ = false;
              stu.Item_BJ = false;
              stu.Item_QQ = !stu.Item_QQ;
              stu.Remark = "";
              this.$set(this.students, i, this.students[i]);
            }
          }
        }
      },
      onScroll () {
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
      },
      async getDetail () {
        let d = await this.QD.getData('/School/StuClient/StudentMorningCheckDetail', {zgh: this.zgh, bjid: this.id, attendDate: this.currDate})
        console.log(d)
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
        }
        this.s = d.Students;
        this.students = d.Students;
        this.loading = false
        // this.QD.alert(`获取数据成功`)
      }
    },
    created () {
      console.log(this.$route.query)
      console.log(this.xh);
      this.getDetail();
      // 开启自动保存
    },
    data () {
      return {
        zgh: this.QD.getLocalUserinfo().stuObj.ZGH,
        showToast: false,
        toastMsg: '',
        bjmc: this.$route.query.bjmc,
        bjdm: this.$route.query.bjdm,
        changed: false,
        saving: false,
        percent1: 30,
        loading: true,
        showContent: true,
        objInfo: {},
        s: [],
        students: [],
        studentName: ''
      }
    },
    computed: {
      id () {
        return this.$route.query.id
      },
      type () {
        return this.$route.query.type
      },
      xh () {
        return this.QD.getLocalUserinfo().stuObj.XH;
      },
      currDate () {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDate();
        return year + '-' + month + '-' + day;
      }

    }
  }
</script>
<style scoped>
  .signin{
    color: #428bca;

  }
  .demo-icon1{
    font-family: 'wxiconfont';
    font-size: 10px;
    color: #10aeff;
    padding-right: 10px;
  }
  .demo-icon2{
    font-family: 'wxiconfont';
    font-size: 10px;
    color: #ff7367;
    padding-right: 10px;
  }
  .demo-icon.demo-icon13{
    font-size: 13px;
    padding-right: 2px;
  }
  .xmxh{
    font-weight: normal;
    font-size: 15px;
  }
  .bg-badge{
    background-color: #56dd67;
  }
  .stumess{
    font-size: 14px;
  }
  .valuesize{
    font-size: 15px;
  }
  .btn-in {
    color: #aaa;
    border-color: #aaa;
    margin-right:5px;
  }
  .btn-in .demo-icon13{
    color: #aaa;
  }
  .btn-in.btn-sj  .demo-icon13,
  .btn-in.btn-sj {
    color: #ff973e;
    border-color: #ff973e;
  }
  .btn-in.btn-bj  .demo-icon13,
  .btn-in.btn-bj {
    color: #10aeff;
    border-color: #10aeff;
  }

  .btn-in.btn-qq  .demo-icon13,
  .btn-in.btn-qq {
    color: #ff1733;
    border-color: #ff1733;
  }
  .put-student{
    width: 60%;
    float: left;
    height: 20px;
    line-height: 20px;
  }
  .searchname{
    border-bottom: none;
  }
  .stumess{
    font-size: 14px;
  }
  .weui-btn_mini{
    line-height:1.8;
    padding: 0 .6em;
  }
  .bj-info{
    width:200px;
    height:20px;
    padding:3px;
    float:right;
    text-align:left;
    color: #10aeff;
    overflow:hidden
  }
</style>

