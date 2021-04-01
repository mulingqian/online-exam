<!-- 学生课表 -->
<template>
  <div class="courselst">
    <smst @on-load="onLoad" @on-hide="onHide" :showName="true" :weekType="true" >
    </smst>
    <group style="position: relative;padding-bottom: 95px;">
      <div v-show="(!loaded && (lst && lst.CourseDate.length === 0))">
        <divider style="margin-top:50px;">暂无数据</divider>
      </div>

      <div style="margin-top: 10px;" v-if="lst && lst.CourseDate.length !== 0">
        <x-table>
          <thead>
          <tr >
            <td><span style="font-size:11px;color:#7b82b9;">节\周</span></td>
            <th class="tblHead" v-for="(x, index) in lst.CourseDate"  v-if="index<5"><div class="datestr">{{x.substr(5,5)}}</div><div class="weekstr">{{WeekLst[index]}}</div></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(y, idy) in lst.Nodes" >
            <td class="node-index">{{idy+1}}</td>
            <td v-for="(x, idx) in lst.CourseDate" v-if="(!y[x] || y[x].span > 0) && idx<5" :rowspan="!y[x]?1:y[x].span" :class="[{'has-class': !!y[x]}, (y[x]? y[x].bg : 'no-class')]" >
              <div v-if="!!y[x]" :class="y[x].bg"  >
                <div>{{y[x].KCMC}}</div><div>{{y[x].JSMCs}}</div>
              </div>
              <div v-else >&nbsp;</div>
            </td>
          </tr>
          </tbody>

        </x-table>
      </div>
    </group>
  </div>
</template>

<script>
  // import {Cell, Group, Loading, Divider, TransferDom} from 'vux'
  import XTable from 'vux/src/components/x-table/index.vue'
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import Smst from './Smst.vue'
  import { mapState, mapActions } from 'vuex'
  export default {
    name: "courselst",
    directives: {
    },
    components: {
      Cell,
      Group,
      Smst,
      Divider,
      XTable
    },
    methods: {
      ...mapActions([
        'updateLoadingStatus'
      ]),
      onLoad (e) {
        console.log("smst on load")
        console.log(e)
        e && e.XQID && this.getList(e)
      },
      onHide (t, e) {
        console.log("smst on hide")
        console.log(e)
        if (t === true && e && e.XQID) {
          this.updateLoadingStatus(true);
          this.getList(e)
        }
      },
      async getList (e) {
        let d = await this.QD.getData('/School/StuClient/StudentSchedule', {xqid: e.XQID, weekIndex: e.weekIndex});
        this.updateLoadingStatus(false);
        console.log(JSON.stringify(d));
        if (d.status && d.status === "error") {
          this.QD.alert(`获取数据失败:${d.msg}`)
          return
        }
        let x = d.CourseDate.length;
        let y = d.Nodes.length;
        let nextj, nextNode;
        let curNode = null;
        let tmpColor = null;
        let idxColor = 0;
        let mapColor = new Map();
        for (let j = 0; j < y; j++) {
          let nd = d.Nodes[j];
          for (let i = 0; i < x; i++) {
            curNode = nd.list.find((n) => n.WeekIndex === (i + 1));
            if (curNode) {
              // 跨行显示
              if (curNode.span !== 0) {
                // 设置颜色样式类
                tmpColor = mapColor.get(curNode.KCMC);
                if (tmpColor) {
                  curNode.bg = tmpColor
                } else {
                  curNode.bg = this.BgLst[idxColor++];
                  mapColor.set(curNode.KCMC, curNode.bg);
                  if (idxColor >= this.BgLst.length) {
                    idxColor = 0
                  }
                }
                curNode.span = 1;
                nextj = j + 1;
                while (nextj < y) {
                  nextNode = d.Nodes[nextj].list.find((n) => n.WeekIndex === (i + 1));
                  if (nextNode && nextNode.JXBID === curNode.JXBID) {
                    curNode.span++;        // 跨行span+1
                    nextNode.span = 0;     // 设置不显示
                    nextj++
                  } else {
                    break
                  }
                }
              }
              nd[d.CourseDate[i]] = curNode
            } else {
              nd[d.CourseDate[i]] = null
            }
          }
        }
        this.lst = d;
        this.loaded = false;
        console.log(JSON.stringify(d))
        // this.QD.alert(`获取数据成功`)
      }
    },
    created () {
      // this.getList(0)
    },
    data () {
      return {
        loaded: true,
        lst: {
          Nodes: [],
          CourseDate: []
        },
        showWeekend: false,
        WeekLst: ['一', '二', '三', '四', '五', '六', '日'],
        BgLst: ['course01', 'course02', 'course03', 'course04', 'course05', 'course06', 'course07', 'course08', 'course09', 'course10', 'course11', 'course12'],
        currentXQ: null
      }
    },
    computed: {
    }
  }
</script>

<style scoped>
  .failed .weui-progress__inner-bar,
  .failed .scoreval{
    color:red;
  }
  .scoreval{
    color: #428bca
  }
  .tblHead{
    background-color: #dfe2fa;
    font-size:14px;
    line-height:26px;
  }
  .node-index{
    background-color: #d8dcf9;
    width:35px;
  }
  .no-class{
    background-color: #eef0fe;
  }
  .has-class{
    width: 16.6667%;
    background-color: #fab882;
    font-size:12px;
    line-height:16px;
    color:#fff;
  }
  .has-class > div{
    padding: 10px 5px;
  }
  .vux-table td:before, .vux-table th:before{
    border-bottom: 1px solid #fff;
    color: #fff;
  }
  .vux-table td:after, .vux-table th:after{
    border-right: 1px solid #fff;
    color: #fff;
  }
  .course01{
    background-color: #f79d54;;
  }
  .course02{
    background-color: #6070e9;
  }
  .course03{
    background-color: #5ba1f7;
  }
  .course04{
    background-color: #56a36c;
  }
  .course05{
    background-color: #a685e5;
  }
  .course06{
    background-color: #7e884f;
  }
  .course07{
    background-color: #31a79b;
  }
  .course08{
    background-color: #ee8077;
  }
  .course09{
    background-color: #6baf4a;
  }
  .course10{
    background-color: #2e68aa;
  }
  .course11{
    background-color: #e777ee;
  }
  .course12{
    background-color: #59b4d0;
  }
</style>
