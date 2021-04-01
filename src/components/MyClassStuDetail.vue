<template>
  <div class="myClassStuDetail">
    <group>
      <cell>
        <span slot="after-title" class="vux-label">
           <span class="stuIconImg">
            <span class="school-wx-icon stu-icon" slot="icon" style="color:#f0ad4e;">&#xe612;</span>
          </span>
          <span class="stuname">{{stuInfroDetail.XM}}</span>
        </span>
      </cell>
      <cell title="二维码" @click.native="goMyClassStuQrCode()" is-link>
        <qrcode class="qrCode" :value="xhAndXM"></qrcode>
      </cell>
      <cell title="学号" :value="stuInfroDetail.XH">
        <span class="school-wx-icon myclassStuDe-icon" slot="icon" style="color:#f0ad4e;">&#xe60b;</span>
      </cell>
      <cell title="性别" :value="stuInfroDetail.XB">
        <span class="school-wx-icon myclassStuDe-icon" slot="icon" style="color:#f0ad4e;">&#xe62c;</span>
      </cell>
      <cell title="班级名称" :value="stuInfroDetail.BJMC">
        <span class="school-wx-icon myclassStuDe-icon" slot="icon" style="color:#f0ad4e;">&#xe635;</span>
      </cell>
      <cell title="年级名称" :value="stuInfroDetail.NJMC">
        <span class="school-wx-icon myclassStuDe-icon" slot="icon" style="color:#f0ad4e;">&#xe609;</span>
      </cell>
      <cell title="专业名称" :value="stuInfroDetail.ZYMC">
        <span class="school-wx-icon myclassStuDe-icon" slot="icon" style="color:#f0ad4e;">&#xe62b;</span>
      </cell>
      <cell title="联系电话">
        <span class="school-wx-icon myclassStuDe-icon" slot="icon" style="color:#f0ad4e;">&#xe61f;</span>
        <span><a :href="'tel:' + stuInfroDetail.SJHM"  style="color: #666666;">{{stuInfroDetail.SJHM}}</a></span>
      </cell>
      <cell title="监护人姓名" :value="stuInfroDetail.JHRXM">
        <span class="school-wx-icon myclassStuDe-icon" slot="icon" style="color:#f0ad4e;">&#xe67f;</span>
      </cell>
      <cell title="监护人电话">
        <span class="school-wx-icon myclassStuDe-icon" slot="icon" style="color:#f0ad4e;">&#xe61f;</span>
        <span><a :href="'tel:' + stuInfroDetail.JHRDH"  style="color: #666666;">{{stuInfroDetail.JHRDH}}</a></span>
      </cell>
    </group>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Qrcode from 'vux/src/components/qrcode/index.vue'
  export default {
    name: "myClassStuDetail",
    components: {
      Cell,
      Group,
      Qrcode
    },
    methods: {
        //  到二维码页面
      goMyClassStuQrCode () {
        /*sessionStorage.setItem("QrCodeXhAndXM", this.xhAndXM);*/
        this.$router.push({path: '/myClassStuQrCode', query: {xm: this.stuInfroDetail.XM, xh: this.stuInfroDetail.XH}});
      },
      // 获取学生详细信息
      async getStuInforDetail () {
        let d = await this.QD.getData('/ComApi/PostObject', {apiName: 'GetStuInforDetail', xh: this.$route.query.xh});
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`);
        }
        this.stuInfroDetail = d;
        let out = this.futf16to8(this.stuInfroDetail.XM);
        this.xhAndXM = out + '-' + this.stuInfroDetail.XH;
      },
      // 在二维码编码前把字符串转换成UTF-8
      futf16to8(str) {
        let out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
          c = str.charCodeAt(i);
          if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
          } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
          }
        }
        return out;
      }
    },
    created () {
      this.getStuInforDetail();
    },
    data () {
      return {
        stuInfroDetail: [], // 学生详情
        xhAndXM: '' // 学号加姓名 用来生成二维码
      }
    }
  }
</script>
<style scoped>
  .myClassStuDetail .qrCode{
    width: 25px;
    height: 20px;
  }
  .myClassStuDetail .stuIconImg{
    float: left;
  }
  .myClassStuDetail .stuIconImg .stu-icon{
    font-size: 45px;
    padding-right:0;
  }
  .myClassStuDetail .stuname{
    float: left;
    margin-top: 20px;
    font-size: 16px;
    margin-left: 8px;
    color: #333333;
  }
  .myClassStuDetail .myclassStuDe-icon{
    font-size: 25px;
  }
</style>
<style>
  .myClassStuDetail .weui-cells{
    margin-top:0;
  }
  .myClassStuDetail .weui-cells .weui-cell .vux-cell-bd .vux-label{
    color: #333333;
  }
  .myClassStuDetail .weui-cell .weui-cell__ft{
    color: #666666;
  }
  .myClassStuDetail .qrCode img{
    width: 20px!important;
    height: 20px!important;
  }
</style>
