<template lang="html">
  <div class="nav">
    <ul :style="{width: navWidth}">
      <li @click="jump(item)" v-for="item in navs" :key="item.r_value" :class="{active: item.r_value==isSelect}" >{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
import {fetch} from "utils"

export default {
  data(){
    return {
      navs: '',
      navWidth: '',
      isSelect: '1'
    }
  },
  created(){
    this.isSelect = this.$route.params.id||"1"
    this.getInfo()
  },
  methods: {
    jump(item){
      if ( item.r_value == "1") {
        this.$router.push(`/home/${regionId}`)
      }else {
        this.$router.push(`/category/${regionId}/${item.r_value}`)
      }
      this.isSelect = item.r_value
    },
    getInfo(){
      const options={
          url: '/gushi/Api/Common/Index/get_type_tab',
          method: 'post'
      }
      fetch(options, (res)=>{
        this.navs = this.getNav(res.type_s);
        this.navWidth = this.navs.length*1.8+'rem'
      })
    },
    getNav(obj){
      var arr=[]
      _.each(obj,(item)=>{
        arr.push(item)
      })
      return arr
    }
  }
}
</script>

<style lang="less">
@import "../../asset/less/common.less";

.nav::-webkit-scrollbar {display:none}
.nav {
  width: 100%;
  overflow-x: scroll;
  background-color: @whiteColor;
  ul {
    width: 100%;
    li {
      text-align: center;
      height: 1.2rem;
      line-height: 1.2rem;
      text-align: center;
      float: left;
      padding: 0 0.3rem;
      font-size: 0.42rem;
    }
    li.active {
      border-bottom: 2px solid @redColor;
      color: @redColor;
    }
  }
}

</style>
