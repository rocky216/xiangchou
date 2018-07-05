<template lang="html">
  <router-view></router-view>
</template>

<script>
export default {
  created(){
    if (this.$route.params.regionId) {
      this.$cookie.set("regionId", this.$route.params.regionId)
      regionId = this.$cookie.get("regionId")
    }
    this.footerIsShow()
  },
  watch:{
    "$route": "footerIsShow"
  },
  methods:{
    footerIsShow(){
      if (!userInfo && this.$cookie.get("userInfo")) {
        window.userInfo = this.$cookie.get("userInfo")
      }
    }
  }
}
</script>

<style lang="css">
</style>
