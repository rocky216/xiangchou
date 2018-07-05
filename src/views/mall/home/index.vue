<template lang="html">
<div class="home">
  <!-- <div class="banner" ref="banner">
    <Swipe>
      <SwipeItem>
        <div class="banner_item">
          <img src="https://s.yimg.com/qs/mall/yps/obdesign_5.jpg" alt="">
        </div>
      </SwipeItem>
      <SwipeItem>
        <div class="banner_item">
          <img src="https://s.yimg.com/cv/api/default/20180320/_miu-star__1.jpg" alt="">
        </div>
      </SwipeItem>
    </Swipe>
  </div> -->
  <div class="nav" style="width: 100%;" ref="nav" :style="{height: navHeight}">
    <vueWaterfallEasy :imgsArr="imgsArr" @scrollReachBottom="loadData" srcKey="image" >
      <div class="img-info" slot-scope="props">
        <p class="some-info">{{props.value.title}}</p>
        <p>{{'￥'+props.value.price}}</p>
      </div>
      <div slot="loading" slot-scope="{isFirstLoad}">
        <!-- <div slot="loading" v-if="isFirstLoad"></div>
        <div v-else="v-else">没有了~~~</div> -->
      </div>
    </vueWaterfallEasy>
  </div>

</div>
</template>

<script>
import {Swipe, SwipeItem} from "mint-ui"
import vueWaterfallEasy from 'vue-waterfall-easy'
import {fetch} from "utils"

export default {
  components: {
    Swipe,
    SwipeItem,
    vueWaterfallEasy
  },
  data(){
    return {
      baseUrl: config.baseUrl,
      imgsArr: [],
      navHeight: '',
      p:1,
      bBtn: true,
      isFirstLoad: false
    }
  },
  created(){
    this.getData(this.p)

  },
  mounted(){
    this.getNavHeight()
    this.getScroll()
  },
  methods:{
    getScroll(){
      let dom = this.$el.querySelector(".vue-waterfall-easy-scroll")

      // dom.onscroll = ()=>{
      //   console.log( dom.scrollTop );
      // }

    },
    loadData(){
      if (this.bBtn) {
        this.p = this.p+1
        this.getData(this.p)
      }
      return false
    },
    getData(p){
      this.bBtn=false
      const options = {
        url: "/gushi/Api/Common/Product/index",
        method: "post",
        data:{
          p: p
        }
      }
      fetch(options, (res)=>{
        if (res && res.length>0) {
          this.bBtn=true
          this.imgsArr = this.imgsArr.concat(this.formatData(res))
        }
      })
    },
    formatData(arr){
      var newArr=[]
      _.each(arr, (item)=>{
        item.image = this.baseUrl+item.image
        item.href=`/detail/${item.product_id}`
        newArr.push(item)
      })
      return newArr
    },
    getNavHeight(){
      var getWinHei = document.documentElement.clientHeight
      var bannerHei = this.$refs.nav.clientHeight
      this.navHeight = getWinHei-bannerHei+'px'
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";

.banner {
  width:100%;
  height: 3.5rem;
  .banner_item {
    width: 100%;
    height:100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.nav {
  .img-info {
    padding: 0.2rem;
    color: @gray666;
  }
  .img-info p:nth-child(2){
    text-align: right;
    color: @redColor;
    font-size: @size16;
  }
}
</style>
