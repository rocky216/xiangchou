<template lang="html">
<div class="login">
  <Head title="用户登录"></Head>
  <div class="logo">
    <img src="http://www.lulxc.com/ranke/images/logo.png" alt="">
  </div>
  <div class="loginWrap">
    <div class="login_input">
      <input type="text" v-model="mobile" placeholder="请输入用户名" >
    </div>
    <div class="login_input">
      <input type="password" v-model="password" placeholder="请输入密码" >
    </div>
    <div class="login_input">
      <Button type="danger" size="small" @click="goLogin">登录</Button>
    </div>
    <div class="register">
      <div class="">
        <router-link to="/forget">忘记密码？</router-link>
      </div>
      <router-link to="/register">立即注册</router-link>
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
      mobile: this.$cookie.get("loginN")?this.$cookie.get("loginN"):'',
      password: this.$cookie.get("loginP")?this.$cookie.get("loginP"):''
    }
  },
  methods: {
    verifiylogin(){
      const {mobile, password} = this
      if (!mobile) {
        Toast("用户名不能为空！")
        return false
      }
      if (!password) {
        Toast("密码不能为空！")
        return false
      }
      return true
    },
    goLogin(){
      if (!this.verifiylogin()) return;
      const options={
        url: "/gushi/Api/Common/User/login",
        method: "post",
        data: {
          mobile: this.mobile,
          password: this.password,
          type: 1
        }
      }
      fetch(options, (res)=>{
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
        // this.$cookie.set("token", res.token)
        window.userInfo = res.token
        this.$cookie.set('userInfo', res.token, { expires: '2h' })

        let region_id = this.$cookie.get("regionId")
        this.$router.push(`/home/${region_id}`)
        this.$cookie.set('loginN', this.mobile)
        this.$cookie.set('loginP', this.password)
        this.$cookie.set('userinfo', res.token)
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
}
.register {
  text-align: right;
  margin-top: -0.5em;
  div{
    float: left;
  }
  a {
    color: @greenColor;
  }
}

</style>
