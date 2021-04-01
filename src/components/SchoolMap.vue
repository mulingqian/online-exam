<template>
  <div class="schoolMap" ref="schoolMap">
    <div id="schoolBaiduMapApi" :style="{ width: '100%', height: mapHeight + 'px', overflow: 'hidden' }"></div>
    <!--<footer>
      <p>地址：上海市浦东新区浦东大道2123路</p>
    </footer>-->
  </div>
</template>
<script>
  import BMap from 'BMap'
  export default {
    name: 'schoolinfo',
    props: {
    },
    data () {
      return {
        mapHeight: 0, // 地图的高度
        longitude: '', // 经度
        latitude: '', // 纬度
        description: ''
      }
    },
    created () {
    },
    mounted () {
      this.getHeightInfo(); // 得到父级的高度
      this.getDegree();  // 获取学校地址的经纬度
    },
    methods: {
      // 得到父级的高度
      getHeightInfo () {
        this.mapHeight = this.$refs.schoolMap.offsetHeight - 46;
      },
        // 获取学校地址的经纬度
      async getDegree () {
        let d = await this.QD.getData('/ComApi/ConfigData');
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败`);
        } else {
          console.log("longitude and latitude is ", d);
          this.longitude = d.schoolAddress.lat;
          this.latitude = d.schoolAddress.lng;
          console.log("longitude is", this.longitude, 'latitude is', this.latitude);
          this.getSchoolMap();
        }
      },
      // 根据经纬度获取地图
      async getSchoolMap () {
//        const BMap = await this.QD.getBMap();
        let mapSite = ''; // 地址名词
        let map = new BMap.Map("schoolBaiduMapApi");
        let point = new BMap.Point(this.longitude, this.latitude);
        let marker = new BMap.Marker(point);
        map.addOverlay(marker);
        map.centerAndZoom(point, 20);
        // 获取当前地理名词 start
        let gc = new BMap.Geocoder();
        let that = this;
        gc.getLocation(point, function(rs){
          let addComp = rs.addressComponents;
          if (addComp.province !== addComp.city) {
            mapSite = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
          } else {
            mapSite = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
          }
          // 获取当前地理名词 end
          // 信息窗的配置信息 start
          let opts ={
            title: "地址:" + mapSite
          };
          let infoWindow = new BMap.InfoWindow(that.description, opts);// 创建信息窗口对象
          marker.addEventListener("click", function(){
            map.openInfoWindow(infoWindow, point);
          });
          map.enableScrollWheelZoom(true);
          map.openInfoWindow(infoWindow, point);//开启信息窗口
          // 信息窗的配置信息 end
        });
      }
    }
  }
</script>
<style scoped>
  .schoolMap footer{
    position: absolute;
    bottom: 0;
    box-shadow: 0 0 20px #6e6c6c;
  }
  .schoolMap footer p{
    width: 100%;
    padding: 15px 12px;
    background-color: #ffffff;
  }
</style>
<style>
  /* 去掉地图左下角的百度LOGO */
  .schoolMap .anchorBL {
    display:none
  }
  .schoolMap .BMap_pop div{
    border: 0!important;
  }
  .schoolMap .BMap_pop .BMap_bubble_title{
    width: 90%!important;
    margin-left: 2%;
    white-space: inherit!important;
    font-size: 16px;
  }
</style>

