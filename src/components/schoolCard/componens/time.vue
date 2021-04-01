<template>
  <div class="date">
    <div class="week">
      <span v-for="(item,index) in weekLst" :key="index" :class="index === currWeenIdx ? 'curr-week-style' : ''">{{item}}</span>
    </div>
    <div class="clock-box">
      <span class="school-wx-icon clock-icon">&#xe67b;</span>
      <div class="clock">
        <div class="digit hours">
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
        </div>
        <div class="digit hours">
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
        </div>
        <div class="intervalPoint">
          <div class="separator"></div>
          <div class="separator"></div>
        </div>
        <div class="digit minutes">
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
        </div>
        <div class="digit minutes">
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
        </div>
        <div class="intervalPoint">
          <div class="separator"></div>
          <div class="separator"></div>
        </div>
        <div class="digit seconds">
          <div class="segment line1"></div>
          <div class="segment line2"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
        </div>
        <div class="digit seconds">
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
          <div class="segment"></div>
          <div class="segment"></div>
          <div class="segment line1"></div>
        </div>
      </div>
      <span class="noon">{{noon}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: [''],
    data () {
      return {
        currWeenIdx: 0, // 当前星期下标
        weekLst: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        noon: 'AM', // AM还是PM
        digitSegments: [
          [1, 2, 3, 4, 5, 6],
          [2, 3],
          [1, 2, 7, 5, 4],
          [1, 2, 7, 3, 4],
          [6, 7, 2, 3],
          [1, 6, 7, 3, 4],
          [1, 6, 5, 4, 3, 7],
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 7, 3, 6, 4]
        ]
      };
    },
    created () {
      // 获取周次
      let date = new Date();
      this.currWeenIdx = date.getDay() -1
      var hour = date.getHours()
      console.log('时间', hour)
      // 判断是am还是pm
      this.noon = (hour >= 12) ? "PM " : "AM"
    },
    mounted() {
      var _that = this
      var _hours = document.querySelectorAll('.hours');
      var _minutes = document.querySelectorAll('.minutes');
      var _seconds = document.querySelectorAll('.seconds');
      setInterval(function() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        _that.setNumber(_hours[0], Math.floor(hours/10));
        _that.setNumber(_hours[1], hours%10);
        _that.setNumber(_minutes[0], Math.floor(minutes/10));
        _that.setNumber(_minutes[1], minutes%10);
        _that.setNumber(_seconds[0], Math.floor(seconds/10));
        _that.setNumber(_seconds[1], seconds%10);
      }, 1000);
    },
    methods: {
      //digit 所在元素、number 需要设置的数字
      setNumber(digit, number) {
        var _that = this
        var segments = digit.querySelectorAll('.segment');
        var current = parseInt(digit.getAttribute('data-value'));
        if (!isNaN(current) && current !== number) {
          // unset previous number
          _that.digitSegments[current].forEach(function(digitSegment, index) {
            setTimeout(function() {
              segments[digitSegment-1].classList.remove('on');
            }, index*45)
          });
        }
        if (isNaN(current) || current !== number) {
          // set new number after
          setTimeout(function() {
            _that.digitSegments[number].forEach(function(digitSegment, index) {
              setTimeout(function() {
                segments[digitSegment-1].classList.add('on');
              }, index*45)
            });
          }, 250);
          digit.setAttribute('data-value', number);
        }
      }
    },
    watch: {}
  }
</script>

<style lang='less' scoped>
  .date{
    color:#fff;
    border-radius: 10px;
    /*background:#ddd;*/
    box-shadow: 0 0px 2px rgba(0,0,0,0.08) inset, 0 0px 2px #fafafa;
  }
  /*周次*/
  .week{
    text-align: center;
    font-size:12px;
    padding: 12px 0;
    display:flex;
    border-radius:10px;
    span{
      opacity: 0.2;
      /*padding:0 10px;*/
      flex:1;
    }
    .curr-week-style{
      opacity: 1;
    }
  }
  .clock-box{
    /*padding:0 12px;*/
    .clock-icon{
      position:relative;
      top:-14px;
      color:#fff;
      opacity:0.2;
    }
    .clock {
      display: inline-block;
      text-align: center;
      .intervalPoint{
        display: inline-block;
        position: relative;
        top:-6px;
        .separator {
          position:relative;
          display:block;
          width:6px;
          height:6px;
          margin-bottom: 20px;
          background:#fff;
          border-radius:50%;
          opacity: 0.7;
        }
      }
      .digit {
        width:30px;
        height:78px;
        margin:0 0px;
        position:relative;
        display:inline-block;
        .segment {
          /*background:#00DCFF;*/
          background:#351919;
          /*border-radius:5px;*/
          position:absolute;
          opacity:0.15;
          transition:opacity 0.2s;
          -webkit-transition:opacity 0.2s;
          -ms-transition:opacity 0.2s;
          -moz-transition:opacity 0.2s;
          -o-transition:opacity 0.2s;
        }
        .segment.on, .separator {
          opacity:0.8;
          /*box-shadow:0 0 50px rgba(255,0,0,0.7);*/
          transition:opacity 0s;
          -webkit-transition:opacity 0s;
          -ms-transition:opacity 0s;
          -moz-transition:opacity 0s;
          -o-transition:opacity 0s;
        }
        .line1:before,
        .line1:after{
          content: '';
          /*width:7px;*/
          display:inline-block;
          position:absolute;
          left:-6px;
          /*height:5px;*/
          border:5px solid transparent;
          transform: rotate(-90deg);
        }
        .line1:before{
          border-right-color:#351919;
        }
        .line1:after{
          left:12px;
          top:0;
          border-right-color:#351919;
        }
        .segment:nth-child(1) {
          top: 10px;
          left: 6px;
          right: 16px;
          height: 5px;
          width: 16px;
        }
        .segment:nth-child(2) {
          top: 14px;
          right: 0px;
          width: 5px;
          height: 20px;
        }
        .segment:nth-child(3) {
          right: 0px;
          width: 5px;
          height: 20px;
          top: 40px;
        }
        .segment:nth-child(4) {
          left: 6px;
          top: 58px;
          width: 16px;
          height: 5px;
        }
        .segment:nth-child(5) {
          left: 0px;
          top: 38px;
          width: 5px;
          height: 20px;
        }
        .segment:nth-child(6) {
          top: 14px;
          left: 0px;
          width: 5px;
          height: 20px
        }
        .segment:nth-child(7) {
          top: 32px;
          left: 6px;
          height: 5px;
          width: 16px;
        }
      }
    }
    .noon{
      font-size: 12px;
      position: relative;
      top: -14px;
      left: 10px;
      opacity: 0.2;
    }
  }
</style>
