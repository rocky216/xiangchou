<template lang="html">
<div class="login">
  <Head title="用户注册"></Head>
  <div class="logo">
    <img src="http://www.lulxc.com/ranke/images/logo.png" alt="">
  </div>
  <div class="loginWrap">
    <div class="login_input">
      <input type="text" v-model="mobile" placeholder="请输入手机号" >
    </div>
    <div class="login_input yzm">
      <input  v-model="code" placeholder="请输入验证码" >
      <Button type="danger" :disabled="isDisabled"  size="small" @click="getCode">{{isDisabled?time:'获取验证码'}}</Button>
    </div>
    <!-- <div class="login_input">
      <input type="password" v-model="nickname" placeholder="昵称" >
    </div> -->
    <div class="login_input">
      <input type="password" v-model="password" placeholder="请输入密码" >
    </div>
    <div class="login_input">
      <input type="password" v-model="repassword" placeholder="请确认密码" >
    </div>
    <div class="login_input">
      <Button type="danger" size="small" @click="goRegister">立即注册</Button>
    </div>
  </div>
</div>
</template>

<script>
import Head from "components/Head"
import {Button, Toast} from "mint-ui"
import {fetch} from "utils"

export default {
  components: {
    Head,
    Button
  },
  data(){
    return {
      mobile: '',
      password: '',
      repassword: '',
      nickname: '',
      code: '',
      isDisabled: false,
      time: 60,
      timer: null
    }
  },
  created(){

  },
  methods: {
    getCode(){
      let reg = /^1\d{10}$/;
      if (!reg.test(this.mobile)) {
        Toast("手机号码不正确！")
        return
      }
      const options = {
        url: "/gushi/Api/Common/Code/send_mobile_code",
        method: "post",
        data: {
          type: 1,
          mobile: this.mobile
        }
      }
      fetch(options, ()=>{
        this.isDisabled = true
        clearInterval(this.timer)
        this.timer = setInterval(()=>{
          if (this.time==0) {
            clearInterval(this.timer)
            this.isDisabled = false
          }
          this.time = this.time-1
        },1000)
      })
    },
    goRegister(){
      let reg = /^1\d{10}$/;
      if (!reg.test(this.mobile)) {
        Toast("手机号码不正确！")
        return
      }
      if ( this.password != this.repassword) {
        Toast("两次密码不一致！")
        return
      }
      const options = {
        url: "/gushi/Api/Common/User/register",
        method:"post",
        data: {
          mobile: this.mobile,
          password: this.password,
          code: this.code,
          type: 1
        }
      }
      fetch(options, (res)=>{
        Toast("注册成功！")
        this.getToken(res.ticket)
      })
    },
    getToken(ticket){
      const options = {
        url: "/gushi/Api/Common/Public/get_token",
        method: "post",
        data: {
          ticket: ticket
        }
      }
      fetch(options, (res)=>{
        window.userInfo = res.token
        let region_id = this.$cookie.get("regionId")
        this.$router.push(`/home/${region_id}`)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";
.logo {
  width: 3rem;
  height: 3rem;
  margin: 1rem auto 0.5rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.loginWrap {
  padding: 0 1rem;
  .login_input {
    width: 100%;
    height: 1.2rem;
    border: 1px solid @grayddd;
    border-radius: 0.1rem;
    overflow: hidden;
    margin-bottom: 0.5rem;
    input {
      width: 100%;
      height: 100%;
      border: none;
      padding-left: 0.2rem;
    }
    button {
      width: 100%;
      height: 100%;
    }
  }
  .yzm {
    input {
      width: 60%;
      float: left;
    }
    button{
      width: 40%;
    }
  }
}


</style>
