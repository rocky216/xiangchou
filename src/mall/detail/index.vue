<template>
<div class="detail">
  <div class="goback" @click="goback">
    <i class="fa fa-angle-left"></i>
  </div>
  <div class="banner" ref="banner">
    <Swipe>
      <SwipeItem v-for="item in imgs" :key="item.image_id">
        <div class="banner_item">
          <img :src="baseUrl+item.image" alt="">
        </div>
      </SwipeItem>
    </Swipe>
  </div>
  <div class="title">
    <h2>{{detailInfo.title}}</h2>
    <span>{{detailInfo.price}}元</span>
  </div>
  <div class="getNum">
    <div class="num">
      <span @click="reduce()">-</span>
      <span>{{num}}</span>
      <span @click="add()">+</span>
    </div>
  </div>
  <div class="description">{{detailInfo.description}}</div>
  <div class="detail_title_box">
    <div class="detail_title">
      <div class="line"></div>
      <div class="text">详情</div>
      <div class="line"></div>
    </div>
  </div>
  <div class="contentDetail" v-html="replaceConent(detailInfo.content)"></div>
  <div class="bottom">
    <div class="collect">
      <i class="fa fa-star-o"></i>
      <p>收藏</p>
    </div>
    <div class="cart">
      <a @click="addCart">加入购物车</a>
    </div>
    <div class="buy">
      <a @click="buy">立即购买</a>
    </div>
  </div>
</div>
</template>
<script>
import {Swipe, SwipeItem, Toast} from "mint-ui"
import {fetch, oDecimal} from "utils"

export default {
  components: {
    Swipe,
    SwipeItem,
  },
  data(){
    return {
      imgs: [],
      detailInfo: '',
      baseUrl: config.baseUrl,
      num: 1
    }
  },
  created(){
    this.getDetail()
  },
  methods: {
    reduce(){
      if (this.num>1) {
        this.num = this.num-1
      }
    },
    add(){
      this.num = this.num+1
    },
    buy(){
      if (!userInfo) {
        this.$router.push("/login")
        return
      }
      this.$router.push(`/mall/order/${this.$route.params.product_id}/${this.num}`)
    },
    addCart(){
      if (!userInfo) {
        this.$router.push('/login')
        return
      }
      const options = {
        url: "/gushi/Api/User/Cart/add",
        method: "post",
        data: {
          token: userInfo,
          sku_id: this.detailInfo.sku[0]["sku_id"],
          num: 1
        }
      }
      fetch(options, (res)=>{
        Toast("加入购物车成功！")
      })
    },
    replaceConent(str){
      return str?str.replace(/\/Uploads\/UserFile\/Image/g, this.baseUrl+'Uploads/UserFile/Image'):null
    },
    getDetail(){
      const options = {
        url: "/gushi/Api/Common/Product/info",
        method: "post",
        data: {
          product_id: this.$route.params.product_id
        }
      }
      fetch(options, (res)=>{
        this.detailInfo = res
        this.imgs = res.images
      })
    },
    goback(){
      this.$router.go('-1')
    }
  }
}
</script>
<style lang="less" >
.contentDetail {
  width: 100%;
  box-sizing: border-box;
  word-break:break-all;
  padding: 0.2rem;
  img {
    width: 100%;
  }
}
</style>
<style lang="less" scoped>
@import "../../asset/less/common.less";

.banner {
  width:100%;
  height: 7rem;
  .banner_item {
    width: 100%;
    height:100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.title {
  padding: 0.2rem 0.2rem 0 0.2rem;
  display: flex;
  h2 {
    flex: 10;
    font-size: 16px;
  }
  span {
    flex: 2;
    color: @redColor;
    font-size: @size14;
    font-weight: bold;
  }
}
.description {
  padding:0 0.2rem 0.3rem;
  color:@gray999;
}


.bottom {
  display: flex;
  position: fixed;
  width: 100%;
  height:40px;
  left: 0;
  bottom: 0;
  z-index: 1;
  background: @grayf1;
  .collect {
    flex: 2;
    text-align: center;
    padding-top: 2px;
    i {
      font-size: @size14;
    }
  }
  .cart, .buy{
    flex: 3;
    a {
      display: block;
      text-align: center;
      line-height: 40px;
      background-color: @redColor;
      font-size: @size14;
      color: @whiteColor;
    }
  }
  .buy a {
    background-color: @greenColor;
  }
}
.detail_title_box {
  background-color: @grayf1;
  width: 100%;
  height: 1rem;
  padding-top: 8px;
  box-sizing: border-box;
}
.detail_title {
  display: flex;
  width: 60%;
  margin: auto;
  .line {
    flex: 2;
    width: 100%;
    height: 1px;
    background-color: #c5c4c4;
    margin-top: 7px;
  }
  .text {
    flex: 1;
    text-align: center;
    color:@gray999;
  }
}
.goback {
  width: 1rem;
  height: 1rem;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  position: fixed;
  left:0.2rem;
  top:0.2rem;
  z-index: 3;
  line-height: 1rem;
  text-align: center;
  i {
    color:@whiteColor;
    font-size: 18px;
  }
}
.getNum {
  overflow: hidden;
  margin: 0 0 0.2rem 0.2rem;
}
.num {
  width: 2.7rem;
  margin-top: 0.2rem;
  float: left;
  span {
    float: left;
    box-sizing: border-box;
    border: 1px solid @grayf1;
    height: 0.8rem;
    width: 0.8rem;
    text-align: center;
    line-height: 0.7rem;
    margin-left: 0.1rem;
    background-color: @grayf1;
  }
}
</style>
