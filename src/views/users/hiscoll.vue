<template lang="html">
<div class="hiscoll">
  <Detail v-if="detailId?true:false" :detailId="detailId" @removeDetail="removeDetail" ></Detail>
  <div class="newsList">
    <ul>
      <li v-for="item in newsCollect" :key="item.id" @click="lookDetail(item)">
        <div class="img">
          <img :src="baseUrl+item.content.cover" alt="">
        </div>
        <div class="text">
          <h2>{{item.content.title}}</h2>
          <div class="description">{{item.content.description}}</div>
          <div class="type">
            <span>{{getType(item.content.type)}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <!-- <Navbar  v-model="selected">
    <TabItem id="1">新闻</TabItem>
    <TabItem id="2">论坛</TabItem>
  </Navbar>
  <TabContainer v-model="selected" style="margin-top: 0.2rem;" >
    <TabContainerItem id="1">

    </TabContainerItem>
    <TabContainerItem id="2">
      2
    </TabContainerItem>
  </TabContainer> -->

</div>
</template>

<script>
import {Navbar, TabItem, TabContainer, TabContainerItem} from "mint-ui"
import {fetch} from "utils"
import Detail from "views/category/detail"

export default {
  components:{
    Navbar,
    TabItem,
    TabContainer,
    TabContainerItem,
    Detail
  },
  data(){
    return {
      selected: "1",
      newsCollect: [],
      forumCollect: [],
      navs: [],
      baseUrl: baseConfig.baseUrl,
      detailId: ''
    }
  },
  created(){
    this.getCollect()
  },
  methods:{
    lookDetail(item){
      this.detailId = item.cid;
      this.scrollTop = this.getScrollTop()
    },
    removeDetail(){
      this.detailId = ""
      $(document).scrollTop(this.scrollTop)
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
    getType(str){
      var filterArr = _.filter(this.navs, (item)=>item.r_value==str)
      return filterArr.length>0?filterArr[0]["remark"]:''
    },
    getCollect(){
      const options = {
        url: "/gushi/Api/User/Government/get_collect_list",
        method: "post",
        data: {
          token: userInfo,
          id: this.$route.params.regionId
        }
      }
      fetch(options, (res)=>{
        this.newsCollect=res.collect
        this.navs = res.type_s
      })
    }
  }
}
</script>

<style lang="less" scoped>
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

</style>
