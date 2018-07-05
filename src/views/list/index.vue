<template lang="html">
  <div class="">
    <Loadmore :top-method="loadTop" ref="loadmore">
      <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="10">
        <li v-for="item in list">{{ item }}</li>
      </ul>
      <p v-if="loading">加载中。。。</p>
    </Loadmore>
  </div>
</template>

<script>
import Vue from "vue"
import {InfiniteScroll,Loadmore } from "mint-ui"
Vue.use(InfiniteScroll);

export default {
  components: {
    Loadmore
  },
  data(){
    return {
      list: [1,2,3,4,5],
      loading: false
    }
  },
  methods: {
    loadTop(){
      
      setTimeout(()=>{
        this.$refs.loadmore.onTopLoaded();
      },2000)
    },
    loadMore() {
      this.loading = true;
      setTimeout(() => {
        let last = this.list[this.list.length - 1];
        for (let i = 1; i <= 10; i++) {
          this.list.push(last + i);
        }
        this.loading = false;
      }, 2500);
    }
  }
}
</script>

<style lang="less" scoped>
ul {
  li {
    width: 100%;
    height: 2rem;
    border-bottom: 1px solid #eee;
  }
}
</style>
