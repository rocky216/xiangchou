<template lang="html">
  <div class="detail" @touchmove="preventside" ref="detail" >
    <Header fixed title="详情">
      <router-link :to="backPath" slot="left">
        <Button icon="back"  @click="clickBack" ></Button>
      </router-link>
    </Header>
    <div class="detailWrap">
      <div class="detailBox" ref="detailBox">
        <h1>{{dataInfo.title}}</h1>
        <p class="time">{{dataInfo.add_time}}</p>
        <div class="content" v-html="replaceConent(dataInfo.content)"></div>
      </div>
      <div class="pinglun">
        <div class="pinglunList" v-for="item in comment" :key="item.id">
          <div class="thumbs" @click="thumbs(item)">
            <i class="fa fa-thumbs-o-up"></i>{{item.agree_num}}
          </div>
          <div class="mainping">
            <div class="title">
              <div class="head">
                <img :src="item.member.headimg?item.member.headimg:defaultHead" alt="">
              </div>
              <p>{{item.member.nickname?item.member.nickname:item.member.mobile}}</p>
            </div>
            <div class="content" v-html="item.content"></div>
          </div>
          <ul v-if="item.add_post">
            <li v-for="elem in item.add_post" :key="elem.id">
              <div class="appendTitle">
                <div class="head">
                  <img src="http://112.74.49.29:80/gushi/Uploads/Help/20180608/21528440734.png" alt="">
                </div>
                <p>asda</p>
              </div>
              <div class="content" v-html="elem.content"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="addComment" ref="addcomment">
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
        <span :class="{active: isConnect}" class="fa fa-heart-o" @click="connect"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {Header, Button, Toast} from "mint-ui"
import {fetch} from "utils"
import VueEmoji from "vue-emoji-component"

export default {
  components: {
    Header,
    Button,
    VueEmoji
  },
  props: ["detailId"],
  data(){
    return {
      dataInfo: '',
      backPath: this.$route.path,
      baseUrl: baseConfig.baseUrl,
      defaultHead: baseConfig.defaultHead,
      showEmoji: false,
      comment: '',
      isConnect: false
    }
  },
  created(){
    this.getDetail()
    this.isconnect()
  },
  mounted(){
    this.$refs.emoji.appendTo({
      area: this.$refs.edit,
      btn: this.$refs.btn,
      position: 'top left'
    });
  },
  methods:{
    replaceConent(str){
      return str?str.replace(/\/gushi\/Uploads\/UserFile\/Image/g, this.baseUrl+'Uploads/UserFile/Image'):null
    },
    isconnect(){
      if (!userInfo) return;
      const options = {
        url: "/gushi/Api/User/Government/is_collect",
        method: "post",
        data: {
          token: userInfo,
          cid: this.detailId
        }
      }
      fetch(options, (res)=>{
        this.isConnect = parseInt(res.is_collect)?true:false
      })
    },
    connect(){
      if (!userInfo) {
        this.$router.push('/login')
        return
      }
      const options = {
        url: "/gushi/Api/User/Government/collect",
        method: "post",
        data: {
          token: userInfo,
          cid: this.detailId,
          id: this.$route.params.regionId
        }
      }
      fetch(options, (res)=>{
        this.isConnect = parseInt(res.status)?true:false
      })
    },
    thumbs(item){
      if (!userInfo) {
        this.$router.push('/login')
        return
      }
      const options={
        url: "/gushi/Api/User/Government/agree",
        method:"post",
        data: {
          token: userInfo,
          cid: item.id,
        }
      }
      fetch(options, (res)=>{
        var index = this.comment.indexOf(item)
        if (res.status=="1") {
          this.comment[index]["agree_num"] = parseInt(this.comment[index]["agree_num"])+1
        }else {
          this.comment[index]["agree_num"] = parseInt(this.comment[index]["agree_num"])-1
        }
      })
    },
    sendComment(pid){
      if (!userInfo) {
        this.$router.push('/login')
        return
      }
      const options = {
        url:"/gushi/Api/User/Government/add",
        method: "post",
        data:{
          token: userInfo,
          cid: this.detailId,
          content: this.$refs.edit.innerHTML
        }
      }
      fetch(options, (res)=>{
        Toast("评论成功！")
        this.getDetail()
        this.$refs.edit.innerHTML=''
      })
    },
    send(){
      if (!this.$refs.edit.innerHTML) {
        Toast("请输入评论内容！")
        return
      }
      this.sendComment()
    },
    hide () {
      this.showEmoji = false;
    },
    handleHide (e) {
      if (e.target === this.$refs.btn) return;
      this.hide();
    },
    clickBack(){
      this.$emit("removeDetail")
    },
    getDetail(){
      const options = {
        url: "/gushi/Api/Common/Government/index",
        method: 'post',
        data: {
          id: this.detailId
        }
      }
      fetch(options, (res)=>{
        this.dataInfo = res.detail
        this.comment = res.content
      })
    },
    preventside(e){
      window.event? window.event.cancelBubble = true : e.stopPropagation();
      //window.event? window.event.returnValue = false : e.preventDefault();
    }
  }
}
</script>

<style lang="less">
@import "../../asset/less/common.less";

.detail {
  width: 100%;
  position: fixed;
  z-index: 100;
  background-color: @whiteColor;
  height: 100%;
  padding-bottom: 1.5rem;
  box-sizing: border-box;
  .detailWrap {
    width: 100%;
    height: 100%;
    margin-top: 45px;
    overflow-y: scroll;
  }
  .detailBox {
    h1 {
      text-align: center;
      font-size: @size14;
      font-weight: bold;
    }
    .time {
      text-align: center;
      color: @gray999;
      margin-top: 0.2rem;
    }
    .content {
      padding: 0.5rem 0.5rem 1rem 0.5rem;
      img {
        max-width: 100%;
      }
    }
  }
}
.maskWrap {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 99;
  left:0;
  top:0;
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
.pinglun {
  width: 100%;
  padding: 0.2rem 0.5rem 1.2rem 0.5rem;
  box-sizing: border-box;
  .pinglunList {
    position: relative;
    width: 100%;
    background-color: @grayf1;
    padding: 0.2rem;
    box-sizing: border-box;
    border-radius: 0.1rem;
    .thumbs {
      position: absolute;
      top: 0.2rem;
      right: 0rem;
      display: block;
      width: 1rem;
      height: 0.5rem;
      color: @greenColor;
      i{
        margin-right: 0.1rem;
      }

    }
    .mainping {
      .title {
        width: 100%;
        overflow: hidden;
        .head{
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          overflow: hidden;
          float: left;
          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          font-size: @size12;
          float: left;
          margin-left: 0.2rem;
          line-height: 0.8rem;
        }
      }
      .content {
        margin-left: 1rem;
      }
    }
    ul{
      margin-top: 0.2rem;
      background-color: @grayf1;
      padding: 0.2rem;
      box-sizing: border-box;
      margin-left: 0.5rem;
      border-radius: 0.1rem;
      .appendTitle {
        overflow: hidden;
        .head {
          float: left;
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          float: left;
          margin-left: 0.2rem;
          line-height: 0.6rem;
        }
      }
      .content {
        margin-left: 0.8rem;
      }
    }
  }
}
</style>
