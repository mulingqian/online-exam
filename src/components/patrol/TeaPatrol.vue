<template>
  <div class="home">
    <div v-transfer-dom>
      <loading v-model="loading"></loading>
    </div>
    <div v-show="(!loading && (objInfo === null ))">
      <divider style="margin-top:50px;">暂无数据</divider>
    </div>
    <div v-if="objInfo">
      <group>
        <div class="info-head">
          <x-button class="btn-tel btn-refresh" :plain="true" action-type="button" @click.native="doRefresh()" :mini="true" type="default">
            <span class="patrol-icon1 icon-refresh">&#xe600;</span>刷新
          </x-button>
          <h3 class="info-title" style="">
            {{objInfo.JSMC}}
          </h3>
          <div>
            <span class="time-info" style="background:none;">{{objInfo.CurrentTime}}</span>
            <badge  v-if="objInfo.Teaching" :class="{'on-teaching':objInfo.Teaching.Status ==='正在上课'}" :text="objInfo.Teaching.Status"></badge>
          </div>
        </div>
        <div v-if="!objInfo.Teaching">
          <divider style="margin-top:50px;">暂无该教室授课信息</divider>
        </div>
        <!--教师授课信息 start-->
        <div v-if="objInfo.Teaching" class="teaching">
          <cell>
            <span slot="after-title" ><span class="tea-title">课程名称：</span>{{objInfo.Teaching.KCMC}} （{{objInfo.Teaching.KSSJ}}~{{objInfo.Teaching.JSSJ}}）</span>
          </cell>
          <cell >
            <span slot="after-title" >
              <span class="tea-title">授课教师：</span>
              {{objInfo.Teaching.RealTeacher[0].XM}}
              <badge v-if="objInfo.Teaching.RealTeacher[0].Status">objInfo.Teaching.RealTeacher[0].Status</badge>
            </span>
            <a slot="value"  :href="`tel:${objInfo.Teaching.RealTeacher[0].Tel}`">
              <x-button class="btn-tel" text="联系老师" :plain="true" action-type="button" :mini="true" type="default"></x-button>
            </a>
          </cell>
          <cell  v-if="objInfo.Teaching.PlanTeacher">
            <span slot="after-title" >
              <span class="tea-title">原授课教师：</span>
              {{objInfo.Teaching.PlanTeacher[0].XM}}
               <badge v-if="objInfo.Teaching.PlanTeacher[0].Status">objInfo.Teaching.PlanTeacher[0].Status</badge>
            </span>
          </cell>
          <cell   v-if="objInfo.Teaching.BJMCs && objInfo.Teaching.BJMCs.length === 1">
            <span slot="after-title" ><span class="tea-title">授课班级：</span>{{objInfo.Teaching.BJMCs[0].BJMC}}</span>
            <div slot="value" >
              {{objInfo.Teaching.BJMCs[0].BZR}}
              <a :href="`tel:${objInfo.Teaching.BJMCs[0].BZRTel}`">
                <x-button class="btn-tel"  text="联系班主任" :plain="true" action-type="button" :mini="true" type="default"></x-button>
              </a>
            </div>
          </cell>
          <cell
            v-if="objInfo.Teaching.BJMCs && objInfo.Teaching.BJMCs.length > 1"
            title="授课班级："
            is-link
            :border-intent="false"
            :arrow-direction="showBJMCs ? 'up' : 'down'"
            @click.native="showBJMCs = !showBJMCs"></cell>

          <template v-if="showBJMCs && objInfo.Teaching.BJMCs && objInfo.Teaching.BJMCs.length > 1">
            <cell  v-for="(n, index) in objInfo.Teaching.BJMCs" :key="index"  class="sub-item" >
              <span slot="after-title" ><span class="tea-title"></span>{{n.BJMC}}</span>
              <div slot="value" >
                {{n.BZR}}
                <a :href="`tel:${n.BZRTel}`">
                  <x-button class="btn-tel"  text="联系班主任" :plain="true" action-type="button" :mini="true" type="default"></x-button>
                </a>
              </div>
            </cell>
          </template>
          <!--附件 start-->
          <!--<cell>
            <span slot="after-title">附件</span>
            <span><label for="uploadClassPatrolImg" class="patrol-icon" style="color:#f0ad4e;">&#xe614;</label></span>
          </cell>
          <x-img :src="srcImg1" :default-src="srcImg1" style="width: 90px;height: 100px;margin-right: -30px;margin-left: 5%;margin-bottom: 45px;" v-show="srcImg1 !== null"></x-img>
          <span class="patrol-icon" style="position: relative;top: -128px;left: -65px;" v-show="srcImg1 !== null" @click="clearImg(1)">&#xe627;</span>
          <x-img :src="srcImg2" :default-src="srcImg2" style="width: 90px;height: 100px;margin-right: -30px;margin-bottom: 45px;" v-show="srcImg2 !== null"></x-img>
          <span class="patrol-icon" style="position: relative;top: -128px;left: -65px;" v-show="srcImg2 !== null" @click="clearImg(2)">&#xe627;</span>
          <x-img :src="srcImg3" :default-src="srcImg3" style="width: 90px;height: 100px;margin-right: -30px;margin-bottom: 45px;" v-show="srcImg3 !== null"></x-img>
          <span class="patrol-icon" style="position: relative;top: -128px;left: -65px;" v-show="srcImg3 !== null" @click="clearImg(3)">&#xe627;</span>
          <input type="file"  multiple="multiple" accept="image/*" value="" id="uploadClassPatrolImg" style="display: none;" @change="flowDocImgFile($event)" ref="imgInput" />-->
          <!--附件 end-->
        </div>
        <!--教师授课信息 end-->
      </group>
      <!--提交-->
      <!--<group v-if="objInfo.Teaching" style="margin-top: -21px;">
        <div class="btn-item">
          <x-button @click.native="submitData" type="primary" class="btn-update" mini>提交</x-button>
        </div>
      </group>-->
      <!--学生信息 start-->
      <div class="stu-info" v-if="objInfo.Teaching" >
        <div class="weui-cells__title" style="margin-top: 0;">&nbsp;</div>
        <div class="info-head">
          <h4 class="info-title" style="">
            学生信息
          </h4>
        </div>
        <div class="stu-lst">
          <x-table :cell-bordered="false" style="background-color:#fff; font-size:13px; color:#666;">
            <thead>
            <tr style="background-color: #fcfcfc;">
              <th>学号</th>
              <th>姓名</th>
              <th>性别</th>
              <th>班级</th>
              <th>考勤情况</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(n, index) in objInfo.Teaching.StuList" :key="index">
              <td style="color:#4096de;">{{n.XH}}</td>
              <td>{{n.XM}}</td>
              <td>{{n.XB}}</td>
              <td>{{n.BJMC}}</td>
              <td :class="{'unnormal': n.Presence !== '正常'}">{{n.Presence}}</td>
            </tr>
            </tbody>
          </x-table>
        </div>
      </div>
      <!--学生信息 end-->
    </div>
  </div>
</template>

<script>
  // import { Cell, Group, Badge } from 'vux'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Badge from 'vux/src/components/badge/index.vue'
  import Loading from 'vux/src/components/loading/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import CellBox from 'vux/src/components/cell-box/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import XTable from 'vux/src/components/x-table/index.vue'
  import TransferDom from 'vux/src/directives/transfer-dom/index.js'
  import XImg from 'vux/src/components/x-img/index.vue'
  import lrz from 'lrz'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'teaPatrol',
    directives: {
      TransferDom
    },
    components: {
      Cell,
      Group,
      Badge,
      Loading,
      Divider,
      XButton,
      XTable,
      XImg,
      lrz
    },
    created () {
      this.setHeadTitle(); // 设置标题
      this.getTeachingDetail()
    },
    computed: {
      ...mapState({
        jSDM: state => state.vux.jSDM   // 教师代码
      })

    },
    data () {
      return {
        loading: true,
        objInfo: null,
        showBJMCs: true,
        srcImg1: null, // 上传图片处理
        srcImg2: null, // 上传图片处理
        srcImg3: null, // 上传图片处理
        FURLImg1: '', // 上传图片处理
        FURLImg2: '', // 上传图片处理
        FURLImg3: '' // 上传图片处理
      }
    },
    methods: {
      doRefresh () {
        this.getTeachingDetail()
      },
      // 提交
      submitData () {
        this.QD.confirm('', '确定提交', async function(){})
      },
      // 设置标题
      setHeadTitle () {
        let titleVal = '<div><div class="home-title">巡视平台</div><div class="home-subtitle">班级授课信息</div></div>';
        this.QD.setTitle(titleVal); // 设置标题
      },
      // 删除图片
      clearImg (num) {
        if (num === 1) {
          this.srcImg1 = null;
        }
        if (num === 2) {
          this.srcImg2 = null;
        }
        if (num === 3) {
          this.srcImg3 = null;
        }
      },
      // 将图片转换成base64位并显示在页面上
      flowDocImgFile (e) {
        for (let i=0; i<e.target.files.length; i++) {
          let file = e.target.files[i];
          // 计算图片大小，默认是B，转换成KB
          let fsize = parseInt((file.size)/1024);
          if (!/image\/\w+/.test(file.type)) {
            alert("请确保文件为图像类型");
            return false;
          }
          let that = this;
          let qua = this.QD.compressSize / fsize;
          qua = Math.round(qua*100)/100;

          if (fsize > 200) {
            /*console.log('压缩');
             console.log(qua);*/
            lrz(file, {                  // 压缩图片
              quality: qua
            }).then(function (rst) {
              /* 处理成功后执行 */
              /*console.log(parseInt((rst.fileLen)/1024));*/
              if (i === 0) {
                that.srcImg1 = rst.base64;
              }
              if (i === 1) {
                that.srcImg2 = rst.base64;
              }
              if (i === 2) {
                that.srcImg3 = rst.base64;
              }
            }).catch( function () {
              /* 处理失败后执行 */
            }).always(function () {
              /* 必然执行 */
            })
          } else {
            /*console.log('不压缩');*/
            let reader = new FileReader();
            reader.onload = function(e){
              if (i === 0) {
                that.srcImg1 = this.result;
              }
              if (i === 1) {
                that.srcImg2 = this.result;
              }
              if (i === 2) {
                that.srcImg3 = this.result;
              }
            };
            reader.readAsDataURL(file);
          }
        }
      },
      //以可以上传的形式base64 保存图片
      saveImg () {
        if (this.srcImg1 !== null) {
          this.FURLImg1 = this.srcImg1.split(',')[1];
        } else {
          this.FURLImg1 = '';
        }
        if (this.srcImg2 !== null) {
          this.FURLImg2 = this.srcImg2.split(',')[1];
        } else {
          this.FURLImg2 = '';
        }
        if (this.srcImg3 !== null) {
          this.FURLImg3 = this.srcImg3.split(',')[1];
        } else {
          this.FURLImg3 = '';
        }
      },
      async getTeachingDetail () {
        this.loading = true;
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'TeachingInfo', JSDM: this.jSDM});
        this.loading = false;
        console.log(d);
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
          return;
        }
        this.objInfo = d;
        // this.QD.alert(`获取数据成功`)
      },
      ...mapActions([
        'updateJSDM'
      ])
    }
  }
</script>

<style scoped>
  .patrol-icon1 {
    margin-right: 15px;
  }
  .info-head{
    padding:5px 15px;
  }
  .info-title {
    vertical-align: middle;
    text-align: left;
    color: #555;
    display: inline-block;
    width: 240px;
    height: 40px;
    line-height: 40px;
  }
  .time-info{
    color: #00ceff;
    display: inline-block;
    text-align: center;
    background: #f74c31;
    font-size: 13px;
    height: 16px;
    line-height: 16px;
    padding: 0 6px 0 0;
    vertical-align: middle;
  }
  .on-teaching{
    background: #09bb07;
  }
  .tea-title{
    display: inline-block;
    width:100px;
  }
  .btn-tel{
    height:25px;
    line-height:23px;
    padding:0 5px;
    font-size:12px;
    color: #bbb;
    border-color: #ddd;
    border-radius: 4px;
  }
  .teaching .weui-cell{
    padding:8px 15px;
  }
  .stu-info .weui-cells__title{
    background-color: #f3f3f3;
    height:20px;
  }
  .unnormal{
    color:#ff6600;
  }
  .btn-refresh{
    position:absolute;
    right:15px;
    top:5px;
  }
  .icon-refresh{
    padding:0;
    margin:0;
    font-size:14px;
  }
  .btn-item{
    position: relative;
    width: 100%;
    line-height: 50px;
    text-align: center;
  }
  .btn-update{
    width: 80%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
