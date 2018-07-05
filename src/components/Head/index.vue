<template lang="html">
<div class="head">
  <Header :title="title">
    <span to="/" slot="left" @click="goBack">
      <Button icon="back" style="color:#fff;"></Button>
    </span>
    <Button v-if="right" slot="right" @click="rightHandle">{{right}}</Button>
  </Header>
</div>
</template>

<script>
import {Header,Button} from "mint-ui"

export default {
  components: {
    Header,
    Button
  },
  props: ["title","right"],
  data(){
    return{

    }
  },
  methods:{
    goBack(){
      this.$router.back(-1)
    },
    rightHandle(){
      this.$emit("rightHandle")
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";


</style>
