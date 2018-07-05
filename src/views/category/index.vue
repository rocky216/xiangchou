<template lang="html">
<div class="category"  ref="category">
  <Detail v-if="detailId?true:false" :detailId="detailId" @removeDetail="removeDetail" ></Detail>
  <Nav></Nav>
  <p class="isNone" v-if="isNone">暂无数据~~</p>
  <div class="newsList" :style="{display: detailId?'block':'block'}" ref="newsList" >
    <Loadmore
      :top-method="loadTop"
      ref="loadmore">
      <ul
        v-infinite-scroll="loadMoreList"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
      >
        <li v-for="(item,index) in cateList" :key="index" @click="lookDetail(item)">
          <div class="img">
            <img :src="baseUrl+item.cover" alt="">
          </div>
          <div class="text">
            <h2>{{item.title}}</h2>
            <div class="description">{{item.description}}</div>
          </div>
        </li>
      </ul>
    </Loadmore>
  </div>

</div>
</template>

<script>
import Vue from "vue"
import {fetch} from "utils"
import Nav from "components/Nav"
import {Loadmore,InfiniteScroll} from "mint-ui"
import Detail from "./detail"
Vue.use(InfiniteScroll)

export default {
  components: {
    Nav,
    Loadmore,
    Detail
  },
  data(){
    return {
      cateList: [],
      type: '',
      p: '1',
      baseUrl: baseConfig.baseUrl,
      timer: null,
      bBtn: false,
      isNone: false,
      detailId: '',
      scrollTop: ''
    }
  },
  watch: {
    "$route": "watchURl"
  },
  created(){
    this.getInfo(this.$route.params.id, this.p)
  },
  methods: {
    removeDetail(){
      this.detailId = ""
      this.bBtn = true;
      $(document).scrollTop(this.scrollTop)
    },
    lookDetail(item){
      this.detailId = item.id
      this.bBtn = false
      this.scrollTop = this.getScrollTop()
    },
    getScrollTop(){
       var scrollTop=0;
       if(document.documentElement&&document.documentElement.scrollTop){
           scrollTop=document.documentElement.scrollTop;
       }
       else if(document.body){
           scrollTop=document.body.scrollTop;
       }
       return scrollTop;
    },
    loadMoreList(){
      if (this.bBtn) {
        this.bBtn = false
        this.p = parseInt(this.p)+1;
        this.getInfo(this.$route.params.id, this.p)
      }

    },
    loadTop(){
      this.p = 1
      this.getInfo(this.$route.params.id, this.p, ()=>{
        this.$refs.loadmore.onTopLoaded();
      })
    },
    watchURl(){
      this.p=1
      this.getInfo(this.$route.params.id, this.p)
    },
    getInfo(type,p,fn){
      const options={
        url: '/gushi/Api/Common/Index/get_tab_index',
        method: 'post',
        data: {
          type: type,
          p: p,
          district_id: this.$route.params.regionId
        }
      }
      fetch(options, (res)=>{
        this.bBtn = true
        if (this.p ==1) {
          this.cateList = []
        }
        if (res) {
          this.cateList = this.cateList.concat(res)
        }else {
          this.bBtn = false
        }
        if(fn) fn(res)
        if (!this.cateList || this.cateList.length==0) {
          this.isNone = true
        }else {
          this.isNone = false
        }
      })
    }
  }
}
</script>

<style lang="less">
@import "../../asset/less/common.less";
.newsList {
  background-color: @whiteColor;
  li {
    display: flex;
    padding: 0.2rem;
    border-bottom: 1px solid @grayColor;
    .img {
      width: 3rem;
      height: 2.1rem;
      img {
        width: 100%;
        height: 100%;
        border: none;
      }
    }
    .text {
      width: 6rem;
      padding-left: 0.2rem;
      box-sizing: border-box;
      h2{
        font-size: @size14;
        .siglehidden(6rem)
      }
      .description {
        color: @gray999;
        .manyhidden(2);
        height: 1rem;
      }
      .type {
        span {
          color: @greenColor;
        }
      }
    }
  }
}
.isNone {
  text-align: center;
  line-height: 2rem;
  color: @gray999;
}
</style>
