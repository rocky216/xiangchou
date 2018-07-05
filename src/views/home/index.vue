<template lang="html">
<div class="home">
  <Detail v-if="detailId?true:false" :detailId="detailId" @removeDetail="removeDetail" ></Detail>
  <Nav></Nav>
  <div class="swip">
    <Swipe :show-indicators="false">
      <SwipeItem v-for="(item,index) in banners" :key="index">
        <div class="item_1">
          <img :src="baseUrl+item.save_path" alt="" />
        </div>
      </SwipeItem>
    </Swipe>
  </div>
  <div class="newsList">
    <ul > 
      <li v-for="item in top" :key="item.id" @click="lookDetail(item)">
        <div class="img">
          <img :src="baseUrl+item.cover" alt="">
        </div>
        <div class="text">
          <h2>{{item.title}}</h2>
          <div class="description">{{item.description}}</div>
          <div class="type">
            <span>{{getType(item.type)}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div class="selected">
    <h2>独家精选</h2>
    <div class="selectedList">
      <ul :style="{width: recLen}">
        <li v-for="item in rec" :key="item.id" @click="lookDetail(item)" >
          <img :src="baseUrl+item.cover" alt="">
          <div class="title">
            <p>{{item.title}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="showList" v-for="(item, index) in showList" :key="index"  v-if="item">
    <div class="show_item_one" @click="lookDetail(item[0])">
      <div class="big_img">
        <img :src="baseUrl+item[0]['cover']" alt="">
      </div>
      <p>{{item[0]['title']}}</p>
    </div>
    <div class="newsList">
      <ul>
        <li v-for="elem in shiftItem(item)" :key="item.id" @click="lookDetail(elem)">
          <div class="img">
            <img :src="baseUrl+elem.cover" alt="">
          </div>
          <div class="text">
            <h2>{{elem.title}}</h2>
            <div class="description" v-html="elem.content"></div>
            <div class="type">
              <span>{{getType(elem.type)}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>

</template>

<script>
import {fetch} from "utils"
import { Swipe, SwipeItem, Button} from "mint-ui"
import Nav from "components/Nav"
import Detail from "views/category/detail"


export default {
  components: {
    Swipe,
    SwipeItem,
    Button,
    Nav,
    Detail
  },
  data(){
    return {
      info: '',
      banners: '',
      baseUrl: baseConfig.baseUrl,
      top: '',
      rec: '',
      recLen: '',
      detailId: '',
      scrollTop: '',
      navs: [],
      showList: []
    }
  },
  created(){
    this.getInfo()
    regionId =this.$route.params.regionId
  },
  methods: {
    shiftItem(arr){
      return _.filter(arr,(n,i)=>i>0)
    },
    getShowList(obj){
      let arr = []
      _.each(obj, (item,key)=>{
        if (parseInt(key)>0) {
          arr.push(item)
        }
      })
      return arr
    },
    removeDetail(){
      this.detailId = ""
      $(document).scrollTop(this.scrollTop)
    },
    lookDetail(item){
      this.detailId = item.id;
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
    getInfo(){
      const options={
        url: '/gushi/Api/Common/Index/index',
        method: 'post',
        data: {
          district_id: this.$route.params.regionId
        }
    }

      fetch(options, (res)=>{
        this.info = res
        this.showList = this.getShowList(res)
        this.navs = res.type_s
        this.banners = res.banner
        this.top = res.top
        this.rec = res.rec;
        this.recLen = res.rec.length*5+'rem'
      })
    },

    getType(str){
      var filterArr = _.filter(this.navs, (item)=>item.r_value==str)
      return filterArr.length>0?filterArr[0]["remark"]:''
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";
.home {
  background-color: @grayf1;
}


.swip {
  width: 100%;
  height: 4rem;
  img {
    width: 100%;
  }
}

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
      @media (min-width: 375px) {
        .description {
          height: 0.9rem;
        }
      }
      .type {
        span {
          color: @greenColor;
        }
      }
    }
  }
}

.selected {
  background-color: @whiteColor;
  margin-top: 0.3rem;
  h2 {
    padding: 0.2rem;
    border-bottom: 1px solid @grayColor;
  }
  .selectedList::-webkit-scrollbar {display:none}
  .selectedList{
    overflow-x: scroll;
    ul {
      width: 50rem;
      display: flex;
      height: 3.6rem;
      li {
        box-sizing: border-box;
        width: 5rem;
        height: 3.5rem;
        padding:  0.2rem;
        position: relative;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.2rem;
        }
        .title {
          position: absolute;
          bottom: 0.2rem;
          padding: 0.2rem 0.3rem;
          left: 0;
          width: 100%;
          box-sizing: border-box;
          background-color: rgba(255,255,255,0.5);
          p {
            height: 1rem;
            .manyhidden(2);
          }
        }
      }
    }
  }

}

.showList {
  .show_item_one {
    padding: 0.2rem;
    background-color: @whiteColor;
    .big_img{
      width: 100%;
      height: 5rem;
      overflow: hidden;
      img {
        width: 100%;
        min-height: 100%;
      }
    }
    p {
      font-size: @size14;
      margin-top: 0.1rem;
    }
  }
}

</style>
