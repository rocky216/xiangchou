<template lang="html">
<div class="forum" >
  <div class="" @touchstart="commentVisible=false">
    <!-- <div class="top">
      <div class="logo">
        <img src="http://www.abincc.cn/ranke/images/logo.png" alt="">
      </div>
      <div class="search">
        <input type="text" placeholder="请输入关键字..." readonly >
        <i class="fa fa-search"></i>
      </div>
    </div> -->
    <div class="swip">
      <Swipe :show-indicators="false">
        <SwipeItem v-for="(item,index) in banners" :key="index">
          <div>
            <img :src="baseUrl+item.save_path" />
          </div>
        </SwipeItem>
      </Swipe>
    </div>
    <div class="navs">
      <ul>
        <li :class="{active: isActive==0}" @click="getCommentList(0)">热门</li>
        <li :class="{active: isActive==1}" @click="getCommentList(1)">最新</li>
        <li :class="{active: isActive==2}" @click="getCommentList(2)">精华</li>
      </ul>
    </div>
    <div class="forumList">
      <Loadmore  :top-method="loadTop" ref="loadmore">
        <ul
          v-infinite-scroll="loadMoreList"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10"
        >
          <div class="" v-for="(item,index) in commentList" :key="index">
            <li>
              <div class="useInfo">
                <img :src="item.userInfo.headimg" alt="">
                <h2>{{item.userInfo.nickname?item.userInfo.nickname:mobileHandle(item.userInfo.mobile)}}</h2>
              </div>
              <div class="text">
                <p class="title">{{item.title}}</p>
                <div class="content">{{item.content}}</div>
                <div class="img">
                  <img v-if="verifiyType(elem) && item.uploads" v-for="(elem,i) in item.uploads.split(',')" :src="elem" :key="i" alt="">
                  <video @loadeddata="captureImage"   v-if="!verifiyType(elem) && item.uploads" v-for="(elem,i) in item.uploads.split(',')"  :key="i" name="media" loop="loop"   controls>
                    <source :src="elem" ></source>
                  </video>
                </div>
              </div>
              <span class="fa fa-commenting-o comment" @click="clickComment(item)"></span>
            </li>
            <div class="commentBox">
              <div class="comment_item" v-for="(post, i) in item.post" :key="i">
                <div class="singleComment">
                  <strong>{{post.userInfo.nickname?post.userInfo.nickname:post.userInfo.mobile}}:</strong>
                  <span v-html="post.content"></span>
                </div>
                <div class="manyComment" v-for="reply in post.reply">
                  <strong>{{reply.userInfo.nickname?reply.userInfo.nickname:reply.userInfo.mobile}}回复{{post.userInfo.nickname?post.userInfo.nickname:post.userInfo.mobile}}:</strong>
                  <span v-html="reply.content"></span>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </Loadmore>
    </div>
  </div>
  <div class="addComment" v-show="commentVisible">
    <div class="comment_item">
      <i class="fa fa-smile-o" ref = 'btn' @click = 'showEmoji = !showEmoji' ></i>
    </div>
    <div class="comment_item">
      <div class="edit" contenteditable="" ref = 'edit' focus></div>
      <VueEmoji
        v-show = 'showEmoji'
        ref = 'emoji'
        @select = 'showEmoji = false'
        @hide = 'handleHide'
      ></VueEmoji>
    </div>
    <div class="comment_item">
      <i class="fa fa-paper-plane-o" @click="send"></i>
    </div>
  </div>
</div>
</template>

<script>
import {Swipe, SwipeItem} from "mint-ui"
import {fetch} from "utils"
import {Loadmore,InfiniteScroll} from "mint-ui"
import VueEmoji from "vue-emoji-component"

export default {
  components: {
    Swipe,
    SwipeItem,
    Loadmore,
    "infinite-scroll":InfiniteScroll,
    VueEmoji
  },
  data(){
    return {
      banners: [],
      baseUrl: baseConfig.baseUrl,
      isActive: 0,
      p: 0,
      commentList: [],
      bBtn: true,
      showEmoji: false,
      commentVisible: false,
      cid: '',
      pid: '',
      userInfo: ''
    }
  },
  created(){
    this.getBanner()
    this.getUserInfo()
    // this.getCommentList(this.isActive, this.p)
  },
  mounted(){
    this.$refs.emoji.appendTo({
      area: this.$refs.edit,
      btn: this.$refs.btn,
      position: 'top left'
    });
  },
  methods:{
    mobileHandle(num){
      let arr = []
      for(let i=0;i<num.length; i++){

        if (i>3 && i<8) {
          arr.push("*")
        }else {
          arr.push(num[i])
        }
      }
      return arr.join('')
    },
    captureImage(){
      console.log(arguments)
    },
    getUserInfo(){
      if (!userInfo) return;
      const options = {
        url: "/gushi/Api/User/Account/get_user_info",
        method: "post",
        data: {
          token: userInfo
        }
      }
      fetch(options, (res)=>{
        this.userInfo = res
      })
    },
    clickComment(item){
      if (!userInfo) {
        this.$router.push('/login')
        return
      }
      window.event? window.event.cancelBubble = true : e.stopPropagation();
      this.commentVisible = true
      this.cid = item.id
    },
    send(){
      const options={
        url: "/gushi/Api/Forum/Forum/post_add",
        method: "post",
        data: {
          token: userInfo,
          cid: this.cid,
          content: this.$refs.edit.innerHTML,
          pid: this.pid,
          id: this.$route.params.regionId
        }
      }
      fetch(options, (res)=>{
        this.getNewList(this.cid)
        this.$refs.edit.innerHTML=''
        this.showEmoji = false;
      })
    },
    getNewList(cid, pid){
      let newCommentList = _.cloneDeep(this.commentList)
      let index = this.getIndex(this.commentList, cid)
      if(!this.commentList[index]["post"]){
        this.commentList[index]["post"]=[]
      }
      this.commentList[index]["post"].push({
        userInfo: {
          nickname: this.userInfo.username,
          mobile: this.userInfo.mobile,
        },
        content: this.$refs.edit.innerHTML
      })

    },
    getIndex(arr, str){
      var bBtn = -1
      _.each(arr, (item, i)=>{
        if (item.id == str) {
          bBtn = i
          return false
        }
      })
      return bBtn
    },
    hide () {
      this.showEmoji = false;
    },
    handleHide (e) {
      if (e.target === this.$refs.btn) return;
      this.hide();
    },
    loadMoreList(){
      if (this.bBtn) {
        this.bBtn = false
        this.p = parseInt(this.p)+1;
        this.getCommentList(this.isActive)
      }
    },
    loadTop(){
      this.p = 1
      this.getCommentList(this.isActive, ()=>{
        this.$refs.loadmore.onTopLoaded();
      })
    },
    verifiyType(value){
      var ImgType=["gif", "jpeg", "jpg", "bmp", "png"];//图片
    	if(!RegExp("\.(" + ImgType.join("|") + ")$", "i").test(value.toLowerCase())){
    		return false;
    	}else {
        return true
      }
    },
    getCommentList(curNavIndex,fn){
      if(this.p==1){
        this.commentList=[]
      }
      if (this.isActive != curNavIndex ) {
        this.isActive = curNavIndex;
        this.p=1
        this.commentList=[]
      }
      const options = {
        url: "/gushi/Api/Forum/ForumPublic/index",
        method: "post",
        data: {
          curNavIndex: this.isActive,
          id: this.$route.params.regionId,
          p:  this.p
        }
      }
      fetch(options, (res)=>{
        if (res) {
          this.bBtn = true
          this.commentList = this.commentList.concat(res)
          if(fn)fn()
        }

      })
    },
    getBanner(){
      const options = {
        url: '/gushi/Api/Common/Banner/index',
        method: 'post'
      }
      fetch(options, (res)=>{
        this.banners = res.banner
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";
.top {
  overflow: hidden;
  width: 100%;
  height: 1rem;
  box-sizing: border-box;
  padding: 0.1rem 0.2rem;
  position: fixed;
  top:0;
  left:0;
  z-index: 10;
  background-color: @whiteColor;
  .logo {
    float: left;
    width: 0.8rem;
    height: 0.8rem;
    margin-right: 0.3rem;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .search {
    float: left;
    width: 8rem;
    height: 0.8rem;
    position: relative;
    input {
      width: 100%;
      height: 100%;
      border: 1px solid @grayddd;
      border-radius: 0.5rem;
      padding-left: 1rem;
    }
    i {
      position: absolute;
      top: 0.2rem;
      left: 0.3rem;
      color: @gray999;
    }
  }
}
.swip {
  width: 100%;
  height: 4rem;
  background-color: @gray999;
  img {
    width: 100%;
  }
}
.navs {
  width: 100%;
  box-sizing: border-box;
  padding: 0rem 0.5rem;
  background-color: @whiteColor;
  ul{
    width:100%;
    display: flex;
    li {
      flex: 1;
      text-align: center;
      padding: 0.2rem 0;
    }
    li.active {
      color: @redColor;
      border-bottom: 1px solid @redColor;
    }
  }
}
.forumList {
  padding: 0.2rem 0.3rem;
  background-color: @whiteColor;
  li{
    padding: 0.2rem 0;
    position: relative;
    .comment {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: @size14;
    }
    .useInfo{
      overflow: hidden;
      img{
        float: left;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        background-color: @gray999;
      }
      h2 {
        float: left;
        margin-left: 0.3rem;
        line-height: 0.8rem;
      }
    }
    .text {
      margin-left: 1.1rem;
    }
    .title {
      font-weight: bold;
      .siglehidden(100%)
    }
    .content {
      color: @gray666;
    }
    .img {
      display: flex;
      img,video{
        margin-top: 0.1rem;
        width: 33.3%;
        height: 4rem;
      }
      video {
        width: 50%;
      }
    }
  }
}

.addComment {
  display: flex;
  width: 100%;
  height: 1.2rem;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: @grayf1;
  z-index: 12;
  .comment_item:nth-child(1) {
    flex: 1;
    i {
      font-size: 20px;
      margin:0.3rem 0 0 0.2rem;
    }
  }
  .comment_item:nth-child(2) {
    flex: 6;
    .edit{
      border:1px solid @grayColor;
      height: 1rem;
      margin-top: 0.1rem;
      width: 100%;
      background-color: @whiteColor;
      padding: 0.1rem;
      box-sizing: border-box;
    }
  }
  .comment_item:nth-child(3) {
    flex: 2;
    font-size: 16px;
    i {
      font-size: 18px;
      float: left;
      margin: 0.35rem 0 0 0.3rem;
      color: #26a2ff;
    }
    span.active {
      color: @redColor;
    }
    span {
      float: right;
      margin: 0.35rem 0.35rem;
      font-size: 18px;
    }
  }
}
.commentBox {
  margin-left: 1rem;
  padding-right: 0.5rem;
  font-size: 12px;
  .comment_item {
    strong {
      color: @greenColor;
      font-weight: normal;
    }
  }
}
</style>
