<template>
  <div class="statusLog">
    <!--状态值-->
    <!--考勤-->
    <div class="logInstruction" v-show="showLenged">
      <span v-for="(item,index) in kqoptions" :key="index" class="logInstruction_child">
        <span class="school-wx-icon positi" slot="icon" :style="{color: statusColor[index]}">&#xe665;</span>
        <span style="font-size: 12px">{{item.name}}</span>
      </span>
    </div>
    <!--课堂纪律-->
    <div class="logInstruction" v-show="!showLenged">
      <span v-for="(item,index) in ktjloptions" :key="index" class="logInstruction_child">
        <span class="school-wx-icon positi" slot="icon" :style="{color: statusColor[index]}">&#xe665;</span>
        <span style="font-size: 12px">{{item.itemname}}</span>
      </span>
    </div>
    <!--教师讲台-->
    <div class="classLogStuLst">
      <div class="classLogStuLstTitle">
        <span class="teaHall">教师讲台</span>
      </div>
      <!--学生信息-->
      <ul>
        <!--考勤-->
        <template v-if="showLenged">
          <li v-for="(s, sIdx) in newLogStuLst" :key="sIdx" v-if="s.type===1"
              :class="s.XH === logInstruXH[sIdx] ? 'logInstruType' + logInstruType[sIdx] : ''">
            <a @click="isShowStuBlur(s.XM,s.XH,sIdx)">
              <span>{{s.XM}}</span><br/>{{s.XH.substr(s.XH.length-2, 2)}}
            </a>
          </li>
        </template>
        <!--课堂纪律-->
        <template v-else>
          <li v-for="(s, sIdx) in newLogStuLst" :key="sIdx"  v-if="s.type===1"
              :class="s.XH === logInstruXH[sIdx] ? 'chooseType' + chooseType[sIdx] : ''">
            <a v-if="s.type===1" @click="isShowStuBlur(s.XM,s.XH,sIdx)">
              <span>{{s.XM}}</span><br/>{{s.XH.substr(s.XH.length-2, 2)}}
            </a>
          </li>
        </template>
      </ul>

    </div>

    <!--学生信息弹框 start-->
    <div v-transfer-dom>
      <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
        <div class="stu-box">
          <div class="left-box">
            <!--头部-->
            <div class="dialogTitle">
              <span v-if="stuCourseInfo !== undefined">
                <span>{{stuCourseInfo.kcmc}}</span>
                <span>第{{stuCourseInfo.weekIndex}}周</span>
                <span>第{{stuCourseInfo.nodeIdxStr}}节</span>
              </span>
                <span v-if="stuClassInfo !== undefined">
                <span>{{stuClassInfo.bjmc}}</span>
                <span>第{{stuClassInfo.seleNode}}节</span>
              </span>
            </div>
            <!--用户信息-->
            <div class="dialog_user-info">
              <p class="stu-icon-box">
                <span class="school-wx-icon stu-icon" slot="icon">&#xe68f;</span>
              </p>
              <div class="content">
                <span class="user-name">姓名：{{logXM}}</span><br/>
                <span>学号：{{logXH}}</span>
              </div>
            </div>
            <!--右边-->
            <!--考勤-->
            <div class="dialog_right" v-show="showLenged">
              <p @click="logInstru(-1)" class="dialog_right_lenged lenged-normal">正常</p>
              <p @click="logInstru(item.value)" v-for="(item, index) in kqoptions" :key="index" class="dialog_right_lenged"  :style="{background: statusColor[index]}">
               {{item.name}}
              </p>
            </div>
            <!--课堂纪律-->
            <div class="dialog_right" v-show="!showLenged">
              <div @click="logInstru(item.itemid)" v-for="(item, index) in ktjloptions" :key="index" class="dialog_right_lenged" :style="{background: statusColor[index]}">
                {{item.itemname}}
              </div>
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
    <!--学生信息弹框 end-->

    <!--各类型人数 start-->
    <footer>
      <div class="classLogResult">
        <span>
          <span class="title">人数</span>
          <span class="all-number">{{stuSJRS}}</span>
        </span>
        <!--考勤-->
        <span v-for="(item, index) in kqoptions" :key="index"  v-show="showLenged" class="showLogResult">
          <span class="title">{{item.name}}</span>
          <span class="all-number">{{item.nums}}</span>
        </span>
        <!--课堂纪律-->
        <span v-for="(item, index) in ktjloptions " :key="index" v-show="!showLenged" class="showLogResult">
          <span class="title">{{item.itemname}}</span>
          <span class="all-number">{{item.nums}}</span>
        </span>
      </div>
    </footer>
    <!--各类型人数 end-->
  </div>
</template>
<script>
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import Loading from 'vux/src/components/loading/index.vue'
  import XDialog from 'vux/src/components/x-dialog/index.vue'
  export default {
    name: 'statusLog',
    directives: {
      TransferDom
    },
    components: {
      XDialog,
      Loading
    },
    data () {
      return {
        loading: true,
        showBlurTitle: false, //是否显示弹框标题
        showHideOnBlur: false, // 是否显示弹框
        showLenged: true, //是否显示图例
        logXM: '', // 每个学生的姓名
        logXH: '', // 每个学生的学号
        logXHIndex: -1, // 点击学生姓名得到学生的index
        saveStuKtjlList: [], //保存的课堂纪律数据
        listCategory: [], // Category(Int)考勤类型迟到=2,早退=4,旷课=8,事假=16,病假=32S,tuNum(Int)考勤异常的学生数StuRemark,异常学生学号集合如：学号1,学号2, 学号3,此学生数与Category一一对应
        statusColor: ['#66B1F6', '#F6AB66', '#ff0000', '#3CBD29', '#5276F4', '#da3dc8', '#ffbe00'] //考勤、课堂纪律状态的颜色
      }
    },
    props: {
      typeLists: Array,  // 教学日志登记内容
      chooseType: Array, // 学生课堂纪律状态
      registerType: String, //登记内容,如:学生考勤，课堂纪律
      kqoptions: Array, //学生考勤项
      ktjloptions: Array, //课堂纪律项
      newLogStuLst: Array, //学生信息 type=1，代表是学生；type=0,代表是开头的数字
      logInstruXH: Array, //学生学号
      stuSJRS: Number, //学生人数
      logInstruType: Array, // 学生考勤状态
      stuCourseInfo: Object, //老师课程信息
      stuClassInfo: Object //学生班级、课程的信息
    },
    created(){
//      console.log("@@@@@@@@this.kqoptions", this.kqoptions)
    },
    watch: {
      registerType: {
        handler: function (newVal, oldVal) {
          if (newVal === this.typeLists[0]){
            this.showLenged=true
          } else if (newVal=== this.typeLists[1]){
            this.showLenged=false
          }
        },
        immediate: true
      },
      newLogStuLst: {
        handler: function (newVal, oldVal) {
//          console.log("监听newVal", newVal)
        },
        immediate: true
      }
    },
    methods: {
      // 点击学生姓名显示弹框
      isShowStuBlur (xm, xh, i) {
        this.logXM = xm;
        this.logXH = xh;
        this.logXHIndex = i;
        this.showHideOnBlur = true;
        //已点名学生再次点名，且未选择状态，则显示该学生未点名 状态为0
        for (let n in this.newLogStuLst){ //学生考勤
          if (this.registerType === this.typeLists[0]){
            for (let j in this.kqoptions){
              if (this.logInstruType[i] === this.kqoptions[j].value){
                this.kqoptions[j].nums--
                this.logInstruType[i] =0
              }
              if (this.logInstruXH[i] === this.newLogStuLst[n].XH){
                this.newLogStuLst[n].Category=0
              }
            }
          } else if (this.registerType=== this.typeLists[1]){ //课堂纪律
            for (let j in this.ktjloptions){
              if (this.chooseType[i] === this.ktjloptions[j].itemid){
                this.ktjloptions[j].nums--
                this.chooseType[i] =0
              }
              if (this.logInstruXH[i] === this.newLogStuLst[n].XH){
                for (let p in this.newLogStuLst[n].Ops){
                  this.newLogStuLst[n].Ops[p].itemid=0
                }
              }
            }
            this.getLogEditNumktjl()
          }
        }
      },
      // 选择学生考勤、课堂纪律状态
      logInstru (type) {
        this.logInstruXH[this.logXHIndex] = this.logXH;
        //学生考勤
        if (this.registerType === this.typeLists[0]){
          this.logInstruType[this.logXHIndex] = type;
          this.getLogEditNum();
        } else if (this.registerType=== this.typeLists[1]){ //课堂纪律状态
          this.chooseType[this.logXHIndex] = type;
          this.getLogEditNumktjl()
        }
        this.showHideOnBlur = false; // 关闭弹出框
      },
      /*计算考勤人数状态*/
      getLogEditNum () {
        this.listCategory = [];
        let checkStus=[]
        //初始化学生考勤人数、状态、学号
        for (let k in this.kqoptions){
          checkStus.push({
            type: this.kqoptions[k].value,
            nums: 0,
            xh: []
          })
        }
        //获取学生考勤状态
        for (let i = 0; i < this.logInstruType.length; i++){
          for (let m in checkStus){
            // 判断学生的考勤状态，获取该状态下的人数、学号总数
            if (checkStus[m].type===this.logInstruType[i]){
              checkStus[m].nums++
              checkStus[m].xh.push(this.logInstruXH[i])
              for (let k in this.kqoptions){
                if (checkStus[m].type===this.kqoptions[k].value){
                  this.kqoptions[k].nums=checkStus[m].nums
                }
              }
            }
          }
        }
//        console.log("获取学生考勤相关状态的人数", checkStus)
        //转换为可传格式
        for (let n in checkStus) {
          this.listCategory.push({
            Category: checkStus[n].type,
            StuNum: checkStus[n].nums,
            StuRemark: checkStus[n].xh.toString()
          });
        }
        this.$emit("kqStatusPerson", this.listCategory)
      },
      /*计算课堂纪律人数状态*/
      getLogEditNumktjl(){
        this.saveStuKtjlList=[]
        let checkStus=[]
//        console.log("this.ktjloptions", this.ktjloptions)
        //初始化课堂纪律人数、状态、学号
        for (let k in this.ktjloptions){
          checkStus.push({
            type: this.ktjloptions[k].itemid,
            name: this.ktjloptions[k].itemname,
            nums: 0,
            xh: [],
            scorevalue: this.ktjloptions[k].scorevalue
          })
        }
        //获取学生课堂纪律状态
        for (let i = 0; i < this.chooseType.length; i++){
          for (let m in checkStus){
            // 判断学生的课堂纪律状态，获取该状态下的人数、学号总数、分数
            if (checkStus[m].type===this.chooseType[i]){
              checkStus[m].nums++
              checkStus[m].xh.push(this.logInstruXH[i])
            }
          }
        }
//        console.log("获取学生课堂纪律相关状态的人数", checkStus)
        //转换为可传格式
        for (let n in checkStus) {
          for (let x in checkStus[n].xh){
            this.saveStuKtjlList.push({
              ItemId: checkStus[n].type,
              ItemType: 3,
              ItemName: checkStus[n].name,
              ItemResult: '',
              ItemScore: checkStus[n].scorevalue,
              XH: checkStus[n].xh[x],
              NodeNames: this.stuCourseInfo.nodeIdxStr.toString()
            })
          }
          for (let k in this.ktjloptions){
            if (checkStus[n].type===this.ktjloptions[k].itemid){
              this.ktjloptions[k].nums=checkStus[n].nums
            }
          }
        }
        this.$emit("ktjlStatusPerson", this.saveStuKtjlList)
      }
    }
  }
</script>
<style scoped lang="less">
  /*图例*/
  .logInstruction{
    margin-bottom: 4px;
    padding: 4px 15px;
  }
  .logInstruction_child{
    padding-right: 16px;
  }
  /*讲台及学生*/
  .positi{
    padding-right: 0px;
    font-size:14px;
  }
  .classLogStuLst{
    padding:0 16px;
    padding-bottom: 70px;
  }
  .classLogStuLstTitle{
    /*padding:0 16px;*/
    margin:12px 0;
  }
  .classLogStuLst ul{
    margin-bottom: 10px;
    margin-top: 10px;
    list-style: none;
    overflow: hidden;
  }
  .classLogStuLst ul li{
    float: left;
    width: 11.1111%;
    line-height: 16px;
    font-size: 12px;
    text-align: center;
    /*color: #18191A;*/
    /*padding:0 4px;*/
    margin:0 4px 12px;
    border-radius: 4px;
  }
  .classLogStuLst ul li a{
    display: inline-block;
    /*height: 36px;*/
    padding:4px 0;
  }
  .classLogStuLst ul li span{
    display: inline-block;
    font-size: 10px;
  }
  /*.classLogStuLst ul li span{*/
    /*display: inline-block;*/
    /*height: 50px;*/
    /*width: 100%;*/
  /*}*/
  .classLogStuLst .stuolumn li a{
    display: inline-block;
    height: 10px;
  }
  .classLogStuLst .teaHall{
    display: block;
    /*width: 88.11%;*/
    /*margin-left:11.11%;*/
    padding:10px 0;
    color: #626666;
    font-size: 14px;
    text-align: center;
    background-color: #F5F7F7;
  }
  .classLogStuLst ul li .logInstruType-1{
    color: #18191A;
  }
  .classLogStuLst ul .logInstruType2, .chooseType5{
    background: #66B1F6;
    color: #fff;
  }
  .classLogStuLst ul .logInstruType4, .chooseType21{
    background: #F6AB66;
    color: #fff;
  }
  .classLogStuLst ul .logInstruType8, .chooseType22{
    background: #ff0000;
    color: #fff;
  }
  .classLogStuLst ul .logInstruType16, .chooseType23{
    background: #3CBD29;
    color: #fff;
  }
  .classLogStuLst ul .logInstruType32, .chooseType24{
    background: #5276F4;
    color: #fff;
  }
  .chooseType25{
    color: #fff;
    background: #da3dc8;
  }
  .chooseType26{
    color: #fff;
    background: #ffbe00;
  }
  /*弹出框样式start*/
  .stu-box{
    overflow: hidden;
  }
  .dialogTitle{
    padding: 16px;
    color: @color4;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 0.5px solid #e5e5e5;
    text-align: center;
    overflow: hidden;
  }
  .classLogVux{
    float: right;
    background-color: #f2f2f2;
    margin-right: 4px;
  }
  .classLogVux-close{
    position: relative;
    display: inline-block;
    vertical-align: middle;
    color: #999;
    width: 24px;
    height: 24px;
  }
  .classLogVux-close:before,
  .classLogVux-close:after{
    content: '';
    position: absolute;
    left: 0;
    top: 11px;
    width: 24px;
    height: 1px;
    background-color: currentColor;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .classLogVux-close:after {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  /*弹出框样式end*/
  .dialog_user-info{
    display: inline-block;
    margin-top: 12px;
    padding:12px 16px;
    text-align: center;
    background: #F5F6F7;
    .content{
      color: @color4;
      font-size: 14px;
      line-height: 24px;
      text-align: left;
      .user-name{
        display: inline-block;
        margin-bottom:4px;
      }
    }
  }
  .stu-icon-box{
    display: inline-block;
    padding: 6px;
    margin-bottom: 12px;
    background: #f0ad4e;
    border-radius: 4px;
    .stu-icon{
      /*margin: 12px 0;*/
      color:#fff;
      font-size: 20px;
      padding-right: 0;
    }
  }
  .dialog_right{
    max-height: 146px;
    margin: 10px 0;
    padding: 0 8px;
    text-align: left;
    overflow-y: scroll;
  }
  .dialog_right_lenged{
    display: inline-block;
    color:#fff;
    margin: 8px;
    padding: 5px;
    font-size: 14px;
    border-radius: 4px;
  }
  .lenged-normal{
    color:#666;
    border:0.5px solid #999;
  }
  /*底部*/
  footer{
    position: fixed;
    bottom: 49px;
    width: 100%;
    background: #fff;
  }
  footer .classLogResult{
    .title{
      padding:0 8px 0 16px;
    }
    .all-number{
      color:#10AEFF;
    }
  }
  footer .classLogResult span{
    font-size: 12px;
    color: #7A7E80;
  }
</style>

