<template lang="html">
<div class="IconNav">
  <ul>
    <li @click="jump(item)" v-for="item in IconNavData" v-if="item.r_value!=1">
      <div class="img">
        <img :src="getImg(item.r_value)" alt="">
      </div>
      <p>{{item.title}}</p>
    </li>
  </ul>
</div>
</template>

<script>
import {fetch} from "utils"

export default {
  data(){
    return {
      IconNavData: [
        {title: "公益", img: "/img/icon_01.png", url: "/home"},
        {title: "时事", img: "/img/icon_02.png", url: ""},
        {title: "情感", img: "/img/icon_03.png", url: ""},
        {title: "征婚", img: "/img/icon_04.png", url: ""},
        {title: "便民服务", img: "/img/icon_05.png", url: ""},
        {title: "招聘", img: "/img/icon_06.png", url: ""},
        {title: "幽默段子", img: "/img/icon_07.png", url: ""},
      ]
    }
  },
  created(){
    this.isSelect = this.$route.params.id||"1"
    this.getInfo()
  },
  methods:{
    getImg(num){
      return "/img/icon_0"+num+'.png'
    },
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
        console.log(111);
        this.IconNavData = this.getNav(res.type_s);
        console.log(this.IconNavData);
        // this.navWidth = this.navs.length*1.8+'rem'
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
.IconNav {
  background-color: #fff;
  padding-bottom: 0.4rem;
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 25%;
      text-align: center;
      padding-top: 0.4rem;
      .img {
        width: 1.2rem;
        height: 1.2rem;
        margin: auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
