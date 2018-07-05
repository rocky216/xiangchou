<template lang="html">
  <div class="users">
    <div class="head">
      <div class="headImg">
        <img :src="userInfo.headimg" alt="">
        <input type="file" id="uploadImg"  />
      </div>
      <div class="name">
        <p>{{userInfo.username?userInfo.username:userInfo.mobile}}</p>
      </div>
    </div>

    <div class="orderList">
      <ul>
        <li>
          <router-link to="/mall/order_list">
            <i class="fa fa-server"></i>
            <p>全部订单</p>
          </router-link>
        </li>
        <!-- <li>
          <i class="fa fa-truck"></i>
          <p>待收货</p>
        </li>
        <li>
          <i class="fa fa-gbp"></i>
          <p>已完成</p>
        </li> -->
        <li>
          <router-link to="/mall/cart">
            <i class="fa fa-shopping-cart"></i>
            <p>购物车</p>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'hiscoll', params: {regionId: regionId} }">
            <i class="fa fa-envelope-open"></i>
            <p>收藏</p>
          </router-link>
        </li>
        <li>
          <router-link to="/mall/address">
            <i class="fa fa-map-marker"></i>
            <p>收货地址</p>
          </router-link>
        </li>
        <li @click="loginout">
          <i class="fa fa-power-off"></i>
          <p>安全退出</p>
        </li>
      </ul>
    </div>

    <!-- <div class="userList">
      <router-link :to="{ name: 'hiscoll', params: {regionId: regionId} }">
        <Cell title="收藏">
          <span class="fa fa-envelope-open redColor spanIcon" slot="icon"></span>
          <i class="fa fa-angle-right"></i>
        </Cell>
      </router-link>
    </div>
    <div class="userList"  @click="toMall" >
      <Cell title="金币">
        <span class="fa fa-dollar redColor spanIcon" slot="icon"></span>
        <i class="fa fa-angle-right"></i>
      </Cell>
      <Cell title="商城">
        <span class="fa fa-tachometer redColor spanIcon" slot="icon"></span>
        <i class="fa fa-angle-right"></i>
      </Cell>
    </div>
    <div class="userList">
      <Cell title="意见反馈">
        <span class="fa fa-external-link redColor spanIcon" slot="icon"></span>
        <i class="fa fa-angle-right"></i>
      </Cell>
      <div @click="loginout">
        <Cell title="立即退出" >
          <span class="fa fa-power-off redColor spanIcon" slot="icon"></span>
          <i class="fa fa-angle-right"></i>
        </Cell>
      </div>
    </div> -->
    <UploadImg v-show="visible" @cancel="cancel" @ok="ok" ref="uploadimg"></UploadImg>
  </div>
</template>

<script>
import UploadImg from "views/post/uploadImg"
import {Cell, Toast} from "mint-ui"
import {fetch} from "utils"

export default {
  components:{
    Cell,
    UploadImg
  },
  data(){
    return {
      userInfo: '',
      baseUrl: baseConfig.baseUrl,
      visible: false,
      regionId: this.$route.params.regionId
    }
  },
  created(){
    this.getUserInfo()
  },
  mounted(){
    this.uploadImgFn()
  },
  methods: {
    loginout(){
      window.userInfo = ''
      this.$router.push(`/home/${regionId}`)
      this.$cookie.delete('userInfo');
    },
    cancel(){
      this.visible = false;
    },
    ok(value){
      this.visible=false;
      const options = {
        url: "/gushi/Api/User/Account/upload_dateUrl",
        method: "post",
        data: {
          token: userInfo,
          headimg: value
        }
      }
      fetch(options, (res)=>{
        this.userInfo.headimg = value
        Toast("头像更换成功！")
      })
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
          reader.onload = (e)=>{
            if (e.target.result) {
              this.visible = true
              this.$refs.uploadimg.getImg(e.target.result)
              $("#uploadImg").val("")
            }
          }
      })
    },
    getUserInfo(){
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";


.users {
  .head {
    padding: 0.8rem 0 0.3rem;
    background-color: #ca6378;
    width: 100%;
    height: 3rem;
    .headImg {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      overflow: hidden;
      margin: auto;
      position: relative;
      input {
        position: absolute;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      text-align: center;
      margin-top: 0.3rem;
      color: @grayf1;
    }
  }
  .userList {
    margin-bottom: 0.5rem;
    .redColor {
      color: @redColor;
    }
    .spanIcon {
      float: left;
      margin-right: 0.2rem;
      font-size: 18px;
      width: 20px;
    }
  }
}

.orderList {
  width: 100%;
  ul {
    width: 100%;
    display: flex;
    flex-wrap:wrap;
    li{
      width: 33.3%;
      box-sizing: border-box;
      padding: 0.6rem 0.2rem;
      border-right: 1px solid @grayf1;
      border-bottom: 1px solid @grayf1;
      color: @gray666;
      background: #f9f9f9;
      text-align: center;
      i {
        font-size: @size16;
      }
    }
  }
}

</style>
