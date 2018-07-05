<template lang="html">
<div class="post">
  <div class="top">
    <strong>我要发帖</strong>
    <div class="send">
      <Button type="primary" size="small" @click="send">发送</Button>
    </div>
  </div>
  <div class="postmain">
    <div class="title">
      <input type="text" v-model="title" placeholder="请输入标题" maxlength="20" />
    </div>
    <div class="content">
      <textarea v-model="content" rows="15" placeholder="你想说。。。" ></textarea>
    </div>
    <div class="upload">
      <Button class="uploadImg" type="primary" size="small" :disabled="isUploadImg">
        <span>图片上传</span>
        <input type="file" id="uploadImg" :disabled="isUploadImg" />
      </Button>
      <Button class="uploadImg" type="primary" size="small" :disabled="isUploadVideo">
        <span>视频上传</span>
        <FileUpload
          v-if="!isUploadVideo"
          class="uploadVideo"
          url="/gushi/Api/Forum/ForumPublic/video"
          :headers="headers"
          :thumb-url='thumbUrl'
          @change="uploadVideo"
          accept="video/*"
        >
        </FileUpload>
      </Button>
    </div>
    <div class="imgList">
      <div class="imgbox" v-for="(item, index) in imgArr" :key="index">
        <img  :src="item" alt="">
        <span class="fa fa-times-circle" @click="removeImg(item)"></span>
      </div>
      <div class="imgbox" v-if="fileUploaded">
        <video name="media" loop="loop" controls >
          <source :src="baseUrl+fileUploaded" >
        </video>
        <span class="fa fa-times-circle" @click="removeVideo"></span>
      </div>
    </div>
  </div>
  <UploadImg v-show="visible" @cancel="cancel" @ok="ok" ref="uploadimg"></UploadImg>
</div>
</template>

<script>
import Vue from "vue"
import {Button, Toast } from "mint-ui"
import UploadImg from "./uploadImg"
import {fetch} from "utils"
import FileUpload from 'v-file-upload'

export default {
  components: {
    Button,
    UploadImg,
    FileUpload
  },
  data(){
    return {
      baseUrl: baseConfig.baseUrl,
      visible: false,
      imgArr: [],
      title: '',
      content: '',
      video: '',
      fileUploaded: '',
      headers: {'access-token': '<your-token>'}
    }
  },
  mounted(){
    this.uploadImgFn()
  },
  computed:{
    isUploadImg(){
      return this.fileUploaded || this.imgArr.length>=3?true:false
    },
    isUploadVideo(){
      return this.imgArr.length>0?true:false
    }
  },
  methods: {
    removeVideo(){
      this.fileUploaded = ""
    },
    removeImg(item){
      var newImgArr = _.clone(this.imgArr)
      var removedom = _.remove(newImgArr, (n)=>n == item)[0]
      this.imgArr = _.filter(this.imgArr, (n)=>n != removedom)
    },
    ok(value){
      this.visible=false;
      this.imgArr.push(value)
    },
    cancel(){
      this.visible = false;
    },
    uploadImgFn(){
      $("#uploadImg").on("change", (e)=>{
          var file = e.target.files[0];
          if (!file ) return;
          if (!file.type.match('image.*')) {
            Toast('请上传正确图片格式！');
            return;
          }
          var reader = new FileReader();
          reader.readAsDataURL(file); // 读取文件
          if (file.size>5100000) {
            Toast('图片不能超过5M');
            return
          }
          reader.onload = (e)=>{
            if (e.target.result) {
              this.visible = true
              this.$refs.uploadimg.getImg(e.target.result)
              $("#uploadImg").val("")
            }
          }
      })
    },
    analyImg(arr){
      if (arr.length==0) return {};
      let obj = {}
      _.each(arr, (item, index)=>{
        obj["image"+(index+1)] = item
      })
      return obj
    },
    thumbUrl (file) {
      return file.myThumbUrlProperty
    },
    uploadVideo(file){
      if (file.status=="1") {
        this.fileUploaded = file.info.path
      }
    },
    send(){
      if (!this.title || !this.content) {
        Toast("标题或内容不能为空！")
        return
      }
      let type = '';
      if (this.imgArr.length>0) {
        type=1
      }
      if (this.fileUploaded) {
        type=2
      }

      const newData={
        token: userInfo,
        id: this.$route.params.regionId,
        type: type,
        title: this.title,
        content: this.content,
        uploads: this.fileUploaded
      }
      const options = {
        url: "/gushi/Api/Forum/Forum/thread_add",
        method: "post",
        data:_.assign({},newData,this.analyImg(this.imgArr))
      }
      fetch(options, (res)=>{
        Toast("发布成功！")
        this.$router.push(`/forum/${this.$route.params.regionId}`)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";
.top {
  width: 100%;
  height: 1.1rem;
  background-color: @whiteColor;
  overflow: hidden;
  strong {
    font-size: @size14;
    margin: 0.22rem 0 0 0.3rem;
    float: left;
  }
  .send {
    float: right;
    margin: 0.1rem 0.3rem 0 0;
  }
}
.postmain {
  padding: 0.5rem;
  box-sizing: border-box;
  margin-top: 0.2rem;
  background-color: @whiteColor;
  .title {
    input{
      border: none;
      line-height: 0.8rem;
      width: 100%;
    }
    border-bottom: 2px solid #26a2ff;
  }
  .content {
    margin-top: 0.3rem;
    textarea {
      width: 100%;
      padding: 0.2rem;
      box-sizing: border-box;
      border: none;
    }
  }
}
.uploadImg {
  position: relative;
  margin-right: 0.3rem;
  input {
    opacity: 0;
    position: absolute;
    left:0;
    top:0;
    height: 100%;
    z-index: 1;
  }
  .uploadVideo {
    position: absolute;
    z-index: 10;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
.imgList {
  display: flex;
  margin-top: 0.3rem;
  .imgbox {
    position: relative;
    width: 3rem;
    height: 4rem;
    img {
      width: 100%;
      height: 100%;
    }
    span {
      position:absolute;
      top: -0.2rem;
      right: -0.2rem;
      color: @redColor;
      font-size: @size14;
      z-index: 2;
    }
    video {
      width: 100%;
      height: 100%;
    }
  }

}
</style>
