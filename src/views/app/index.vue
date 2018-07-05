<template lang="html">
  <div class="">
    <div class="mainBox">
      <router-view></router-view>
    </div>
    <Footer v-if="isShow"></Footer>
  </div>
</template>

<script>
import Footer from "components/Footer"

export default {
  components: {
    Footer
  },
  data(){
    return{
      isShow: true
    }
  },
  watch:{
    "$route": "footerIsShow"
  },
  created(){
    this.footerIsShow()
  },
  methods: {
    footerIsShow(){
      if (!userInfo && this.$cookie.get("userInfo")) {
        window.userInfo = this.$cookie.get("userInfo")
      }
      regionId = this.$cookie.get("regionId")
      let reg = /\/[mall\/detail]/;
      this.isShow = this.$route.path.indexOf('/mall/address')>-1||this.$route.path.indexOf('/mall/detail')>-1||this.$route.path.indexOf('/mall/order')>-1||this.$route.path.indexOf('/mall/cart')>-1?false:true
    }
  }
}
</script>

<style lang="less" scoped>
.mainBox {
  margin-bottom: 1.2rem;
}
</style>
