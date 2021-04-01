<template>
  <div class="assets-getadd">
    <group class="gp">
      <cell>
        <span slot="after-title">
          <a class="neces">*</a>
          <span>物品用途</span>
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="input-text" placeholder="如：日常办公" />
        </span>
      </cell>
    </group>
    <group title="物品明细">
      <cell>
        <span slot="after-title">
          <a class="neces">*</a>
          <span>物品名称</span>
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="input-text" placeholder="请输入物品名称" />
        </span>
      </cell>
      <cell>
        <span slot="after-title">
          <a class="neces"></a>
          <span>数量</span>
        </span>
        <span slot="default" class="rg-cell">
          <input type="text" class="input-text" placeholder="请输入物品数量" />
        </span>
      </cell>
      <p class="add-detail"><a style="font-size: 20px;">+</a> 增加物品明细</p>
    </group>
    <group>
      <cell title="领用详情"></cell>
      <x-textarea placeholder="请输入物品领用详情说明" :rows="4" :max="100" :show-counter="false" class="x-textarea" show-counter></x-textarea>
    </group>
    <group style="margin-bottom: 55px;">
      <cell title="图片"></cell>
      <p class="school-wx-icon imgIcon">&#xe658;</p>
    </group>
    <div class="btn-item">
      <x-button type="primary" class="btn-update" mini>领用</x-button>
    </div>
  </div>
</template>
<script>
  import Cell from 'vux/src/components/cell/index.vue'
  import Group from 'vux/src/components/group/index.vue'
  import XTextarea from 'vux/src/components/x-textarea/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  export default {
    name: 'assetsGetAdd',
    components: {
      Cell,
      Group,
      XTextarea,
      XButton
    },
    methods: {
    },
    data () {
      return {
      }
    }
  }
</script>
<style scoped>
  .assets-getadd{
    background-color: #f2f2f2;
  }
  .gp{
    margin-top: -20px;
  }
  .neces{
    color: #ff191a;
  }
  .input-text{
    width: 100%;
    height: 25px;
    text-align: right;
    font-size: 14px;
    color: #666666;
    border:0;
    outline: none;
  }
  .add-detail{
    padding-bottom: 10px;
    text-align: center;
    color: #0f89e0;
  }
  .x-textarea{
    font-size: 14px;
    color: #999;
  }
  .imgIcon{
    padding: 10px 15px;
    font-size: 40px;
    color: #999999;
  }
  .btn-item{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    text-align: center;
    background-color: #fff;
  }
  .btn-update{
    width: 80%;
    margin-top: 10px;
    background-color: #0f89e0;
  }
</style>
