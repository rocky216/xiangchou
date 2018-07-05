<template lang="html">
<div class="footer">
  <div class="footer_item">
    <router-link :to="{name: 'home', params: {regionId: regionId}}" >
      <i class="fa fa-newspaper-o"></i>
      <p>要闻</p>
    </router-link>
  </div>
  <div class="footer_item">
    <router-link :to="{name: 'forum', params: {regionId: regionId}}" >
      <i class="fa fa-podcast"></i>
      <p>发现</p>
    </router-link>
  </div>
  <div class="footer_item">
    <router-link :to="{name: 'post', params: {regionId: regionId}}" >
      <i class="fa fa-file-text"></i>
      <p>发帖</p>
    </router-link>
  </div>
  <div class="footer_item">
    <router-link :to="{name: 'mall', params: {regionId: regionId}}" >
      <i class="fa fa-shopping-bag"></i>
      <p>商城</p>
    </router-link>
  </div>
  <div class="footer_item">
    <router-link :to="{name: 'users', params: {regionId: regionId}}" >
      <i class="fa fa-user-circle"></i>
      <p>我的</p>
    </router-link>
  </div>
</div>
</template>

<script>
export default {
  data(){
    return {
      regionId: this.$cookie.get("regionId")
    }
  },
  created(){
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";
.footer {
  background-color: @grayf1;
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
  border-top: 1px solid @grayColor;
  height: 1.2rem;
  box-sizing: border-box;
  padding-top: 0.1rem;
  .footer_item {
    flex: 1;
    text-align: center;
  }
}
.router-link-active {
  color: @redColor;
}


</style>
