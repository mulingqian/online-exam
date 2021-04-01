<template>
  <div class="myApplicationEdit fwrapper">
    <div class="header-box">
      <a class="btn cancel-btn" @click="cancelEdit">取消</a>
      <div class="header-title">编辑我的应用</div>
      <a class="btn complete-btn" @click="completeSubmit">完成</a>
    </div>
    <div class="edit-container">
      <div class="edit-content">
        <div class="edit-desc">
          <p>你可以将常用的应用添加到{{QD.productName}}首页，</p>
          <p>也可以按住拖动调整应用顺序</p>
        </div>
        <div v-if="myDefaultMenuLst.length > 0" class="drag-igrid clearfloat">
          <draggable v-model="myDefaultMenuLst" :options="{group:'employeeApp'}" :move="getdata" @start="drag" @end="drop">
            <a v-for="(item, index) in myDefaultMenuLst" :key="index" class="igrid-block">
              <div class="igrid-block-p">
                <p class="delete-icon-box clearfloat"><span class="school-wx-icon delete-icon" @click="deleteMenuEvent(index)">&#xe7be;</span></p>
                <span class="school-wx-icon igrid-block-icon" :style="{ color: item.iconColor }" slot="icon" v-html="item.iconContent"></span>
                <span class="igrid-block-title" v-html="item.title"></span>
              </div>
            </a>
          </draggable>
        </div>
        <div v-if="myDefaultMenuLst.length <= 0" class="noneDefaultMenu">
          <p class="text">我们会更努力了解你的需要</p>
        </div>

        <div class="menu-field">
          <div :class="`${lst.canEditNum > 0 ? 'menu-box' : 'none-box'}`" v-if="lst.items.length > 0" v-for="(lst, idx) in editAllMenuList" :key="idx">
            <span class="igrid-title">{{lst.category}}</span>
            <div class="igrid">
              <a v-if="item.deleteOrAdd === 'add'" v-for="(item, index) in lst.items" :key="index" class="igrid-block">
                <div class="igrid-block-p">
                  <p class="add-icon-box clearfloat"><span class="school-wx-icon add-icon"  @click="addMenuEvent(item)">&#xe630;</span></p>
                  <span class="school-wx-icon igrid-block-icon" :style="{ color: item.iconColor }" slot="icon" v-html="item.iconContent"></span>
                  <span class="igrid-block-title" v-html="item.title"></span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      
    </div>

  </div>
</template>
<script>
  import draggable from 'vuedraggable'
  import { mapState } from 'vuex'
  export default {
    name: 'myApplicationEdit',
    directives: {
    },
    components: {
      draggable
    },
    computed: {
      ...mapState({
        userinfo: state => state.vux.userinfo   // 用户信息
      })
    },
    methods: {
      // 点击“完成”事件
      completeSubmit () {
        this.saveMyDefaultMenuEvent(); // '我的应用' 存入缓存中
        if (this.backLoaded) {
          this.backLoaded = false;
          this.QD.appLst_currPageData = null; // home 数据不从保存中取
          this.$router.go(-2);
        }
      },
      // '我的应用' 存入缓存中
      saveMyDefaultMenuEvent () {
        let obj = {userId: this.userinfo.stuObj.UserId, myDefaultMenuLst: this.myDefaultMenuLst};
        let strArr = JSON.stringify(obj);
        localStorage.setItem("tea_defaultMenuEdit_wxSchoolApp", strArr);
      },
      // 点击‘取消’事件
      cancelEdit () {
        if (this.backLoaded) {
          this.backLoaded = false;
          this.$router.go(-1);
        }
      },
      drag () {
        console.log("drag");
      },
      drop () {
        console.log("drop");
      },
      /*开始拖动得到数据*/
      getdata (evt) {
        if (evt.draggedContext.element.title !== undefined) {
          /*console.log(evt.draggedContext.element.title);*/
        }
        console.log("getdata");
      },
      // 添加菜单的事件
      addMenuEvent (item) {
        let canAdd = this.judgeCanEditNum();
        if (!canAdd) {
          return;
        }
        this.myDefaultMenuLst.push(item);
        this.initUpdateEditAllMenuList();  // 剔除 ‘editAllMenuList’中所有存在于‘myDefaultMenuLst’的菜单
      },
      // 删除菜单的事件
      deleteMenuEvent (index) {
        // “我的应用”中的序号0,1... 哪个，并删除
        this.myDefaultMenuLst.splice(index, 1);
        this.initUpdateEditAllMenuList();  // 剔除 ‘editAllMenuList’中所有存在于‘myDefaultMenuLst’的菜单
      },
      // 判断可编辑菜单个数
      judgeCanEditNum () {
        if (this.myDefaultMenuLst.length >= this.QD.teacherApplicationNum) {
          this.QD.alert('', `最多添加${this.QD.teacherApplicationNum}个应用`);
          return false;
        }
        return true; // 可在添加菜单个数
      },
      // 将‘全部应用’中的第idx 个类别中的菜单标记哪些是存在‘我的应用’
      allMenuLstExistMyApp (idx) {
        let sourceObj = this.editAllMenuList[idx];
        let editMenuList = sourceObj.items;
        sourceObj.canEditNum = editMenuList.length; // 可以编辑菜单的数目
        for (let i=0; i<editMenuList.length; i++) {
          this.editAllMenuList[idx].items[i]['deleteOrAdd'] = 'add';
          for (let j=0; j<this.myDefaultMenuLst.length; j++) {
            if (this.myDefaultMenuLst[j].cid === editMenuList[i].cid) {
              // 找到相同的
              this.editAllMenuList[idx].items[i].deleteOrAdd = 'delete';
              sourceObj.canEditNum --;
              break;
            }
          }
        }
      },
      // 剔除 ‘editAllMenuList’中所有存在于‘myDefaultMenuLst’的菜单
      initUpdateEditAllMenuList () {
        for (let i = 0; i < this.editAllMenuList.length; i++) {
          this.allMenuLstExistMyApp(i); // 将‘全部应用’中的第idx 个类别中的菜单标记哪些是存在‘我的应用’
        }
      },
      // 得到所有可以编辑的菜单
      getEditAllMenuListEvent () {
        for (let idx=0; idx<this.allMenuList.length; idx++) {
          this.editAllMenuList.push(this.allMenuList[idx]);
        }
      },
      // 从上一级页面得到数据
      getParentPgData () {
        // 获取‘我的查询’和‘应用列表’'我的办公'
        if (this.QD.application_currPageData) {
          let qd = this.QD.application_currPageData;
          qd = JSON.parse(JSON.stringify(qd));
          this.allMenuList = qd.allMenuList;
          this.myDefaultMenuLst = qd.myDefaultMenuLst;
          this.newlyUseMenuLst = qd.newlyUseMenuLst;
          this.QD.application_currPageData = null;
          this.editAllMenuList.splice(0, 0, {category: "最近使用", items: this.newlyUseMenuLst});
          this.getEditAllMenuListEvent(); // 得到所有可以编辑的菜单
          this.initUpdateEditAllMenuList(); // 开始进入页面时，剔除 ‘editAllMenuList’中所有存在于‘myDefaultMenuLst’的菜单
        } else {
          this.$router.go(-1);
        }
      }
    },
    created () {
      this.getParentPgData(); // 从上一级页面得到数据
    },
    data () {
      return {
        backLoaded: true,
        myDefaultMenuLst: [], // 我的应用
        allMenuList: [], // 全部应用菜单  包括 oa
        newlyUseMenuLst: [], // 最近使用
        editAllMenuList: [] // 可以编辑的所有菜单，包括 allMenuList、newlyUseMenuLst
      }
    }
  }
</script>
<style scoped>
  .myApplicationEdit{
    position: static;
    background-color: #f2f2f2;
  }
  .header-box{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 3px 0;
    background-color: #f8f8f8;
    z-index: 100;
  }
  .header-title{
    position: relative;
    height: 40px;
    margin: 0 88px;
    line-height: 40px;
    font-size: 16px;
    text-align: center;
  }
  .header-box .btn{
    position: absolute;
    top: 9px;
    padding: 6px 12px;
    font-size: 16px;
    border-radius: 5px;
  }
  .header-box .cancel-btn{
    left: 15px;
    color: #7d7d7d;
    background-color: #f8f8f8;
  }
  .header-box .complete-btn{
    right: 15px;
    color: #ffffff;
    background-color: #16a1fe;
  }
  .edit-container{
    position: absolute;
    top: 46px;
    bottom: 0;
    width: 100%;
    overflow-y: scroll;
  }
  .edit-content{
    position: relative;
  }
  .edit-desc{
    padding: 18px 0 15px 0;
    font-size: 14px;
    color: #7d7d7d;
    text-align: center;
    background-color: #ffffff;
  }
  .noneDefaultMenu{
    padding: 0 36px 15px 36px;
    text-align: center;
    background-color: #ffffff;
  }
  .noneDefaultMenu>.text{
    padding: 34px 0;
    font-size: 14px;
    color: #333333;
    border: 1px dashed #f0f0f0;
  }
  .add-icon-box,
  .delete-icon-box{
    position: relative;
    text-align: right;
  }
  .delete-icon{
    padding-right: 6px;
    font-size: 18px;
    color: #bebebe;
  }
  .add-icon{
    padding-right: 6px;
    font-size: 18px;
    color: #108fe9;
  }
  .igrid{
    overflow: hidden;
    margin: 0;
    background-color: #ffffff;
    border-top: 1px solid #f0f0f0;
  }
  .drag-igrid{
    margin: 0;
    overflow: hidden;
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
  }
  .igrid-block{
    position: relative;
    display: inline-block;
    float: left;
    padding: 8px 0 5px 0;
    box-sizing: border-box;
    width: 20%;
    color:#fff;
    border: 1px solid #f0f0f0;
    border-width: 0px 1px 1px 0;
  }
  .igrid-block-p{
    position:relative;
    height: 84px;
    text-align: center;
  }
  .school-wx-icon.igrid-block-icon{
    display: block;
    height: 35px;
    margin: 0 auto;
    padding-right: 0;
    font-size: 2em;
    text-align: center;
  }
  .igrid-block-title{
    display: block;
    padding: 0 2px;
    text-align: center;
    font-size: 12px;
    color: #000000;
    line-height: 14px;
  }
  .menu-field{
    position: relative;
    padding-bottom: 20px;
    background-color: #f2f2f2;
  }
  .none-box{
    display: none;
  }
  .menu-box{
    margin-top: 10px;
    padding-top: 10px;
    background-color: #fff;
  }
  .igrid-title{
    display: inline-block;
    font-size: 18px;
    padding: 0 0 16px 18px;
    color: #000000;
    letter-spacing: 1px;
    font-weight: bold;
  }
  .sortable-ghost{
    opacity: 0;
  }
</style>
