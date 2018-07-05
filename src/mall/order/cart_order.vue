<template>
<div class="order">
  <Head title="我的订单"></Head>
  <router-link to="/address/1">
    <div class="address">
      <div class="address_icon">
        <i class="fa fa-map-marker"></i>
      </div>
      <div class="text">
        <p v-if="!address || address.length">去添加收货地址</p>
        <div v-else >
          <p>收货人:{{address.name}}  {{address.mobile}}</p>
          <div>收货地址: {{address.province_title?address.province_title + address.city_title + address.area_title:''}}</div>
        </div>
      </div>
      <div class="address_icon">
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
  </router-link>

  <div class="cartList">
    <ul>
      <li v-for="item in orderList" :key="item.product_id">
        <div class="info">
          <div class="img">
            <img :src="baseUrl+item.product_image" />
          </div>
          <div class="infoText">
            <h2>{{item.product_title}}</h2>
            <div class="price">
              <p class="colorRed">￥{{item.product_price}}</p>
              <p>数量x{{item.product_num}}</p>
            </div>
          </div>
        </div>
        <div class="freight">
          <span>运费</span>
          <span>￥0.00</span>
        </div>
        <div class="freight">
          <span>&nbsp;</span>
          <span>共计一件商品 &nbsp;&nbsp;&nbsp; 小计￥
            <strong>{{oDecimal(parseFloat(item.product_num)*parseFloat(item.product_price))}}</strong>
          </span>
        </div>
      </li>
    </ul>
  </div>

  <div class="bottom">
    <div class="text">
      <p>共{{nums}}件</p>
      <p>总金额： ￥{{total}}</p>
    </div>
    <div class="settle">
      <Button type="danger" size="small" @click="payHandle">提交订单</Button>
    </div>
  </div>

</div>
</template>
<script >
import {Button} from "mint-ui"
import Head from "components/Head"
import {fetch,oDecimal} from "utils"

export default {
  components: {
    Button,
    Head
  },
  data(){
    return {
      address: [],
      orderList: JSON.parse(localStorage.getItem("cartorder")),
      baseUrl: config.baseUrl
    }
  },
  created(){
    this.getAddress()
    console.log(this.orderList);
  },
  computed: {
    nums(){
      let str =0
      _.each(this.orderList, (item)=>{
        str+=parseInt(item.product_num)
      })
      return str
    },
    total(){
      let str =0
      _.each(this.orderList, (item)=>{
        str+=parseFloat(item.product_num)*parseFloat(item.product_price)
      })
      return oDecimal(str)
    }
  },
  methods: {
    payHandle(){
      const options = {
        url: "/gushi/Api/User/Order/create",
        method: "post",
        data: {
          token: userInfo,
          address_id: this.address.address_id,
          cart_ids: this.getCartIds(),
          remark: '',
          card_id: ''
        }
      }
      fetch(options, (res)=>{
        var str=' '
        window.location.href=`http://www.lulxc.com/wxpay/example/jsapi.php?money=${this.total}&name=${str}&order_id=${res.order_no}&token=${userInfo}&`
      })
    },
    getCartIds(){
      let newArr = []
      _.each(this.orderList, (item)=>{
        newArr.push(item.cart_id)
      })
      return newArr.join()
    },
    oDecimal:oDecimal,
    getAddress(){
      const options = {
        url: "/gushi/Api/User/Address/index",
        method: "post",
        data: {
          token: userInfo
        }
      }
      fetch(options, (res)=>{
        this.address = _.filter(res, o=>o.is_default=="1")[0]
      })
    },
  }
}

</script>
<style lang="less" scoped>
@import "../../asset/less/common.less";

.order {
  background-color: @whiteColor;
}
.colorRed {
  color: @redColor;
}
.address {
  padding: 0.2rem 0;
  display: flex;
  .address_icon {
    flex: 1;
    font-size: 18px;
    text-align: center;
    margin-top: 0.2rem;
    color: @gray999;
  }
  .text {
    flex: 5;
  }
}

.cartList {
  border-top: 1px solid @grayf1;
  padding:0 0.2rem;
  ul {
    li {
      border-bottom: 1px solid @grayf1;
      padding: 0.2rem 0.2rem 0 0.2rem;
      .info {
        flex: 5;
        display: flex;
        .img {
          width: 2rem;
          height: 2rem;
          flex: 1;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .infoText {
          padding:0 0.2rem;
          flex: 3;
          h2 {
            .manyhidden (2);
            height: 1rem;
          }
          .price {
            overflow: hidden;
            margin-top:0.3rem;
            p:nth-child(1) {
              float: left;
              font-size: @size14;
            }
            p:nth-child(2){
              float: right;
            }
          }
        }
      }
      .freight {
        overflow: hidden;
        border-top: 1px solid @grayf1;
        line-height: 1rem;
        color: @gray999;
        span:nth-child(1){
          float: left;
        }
        span:nth-child(2){
          float: right;
          strong{
            color: @redColor;
          }
        }
      }
    }
  }
}

.bottom {
  background-color: @whiteColor;
  height: 1.2rem;
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 0;
  left:0;
  border-top: 1px solid @grayf1;
  .checkBox {
    flex: 1;
  }
  .text {
    flex: 5;
    padding-left: 0.2rem;
    box-sizing: border-box;
    p:nth-child(1) {
      margin-top:0.1rem;
    }
    p {
      font-size: @size12;
      margin-left:0.5rem;
    }
  }
  .settle {
    flex: 2;
    button{
      margin-top: 0.1rem;
    }
  }
}

</style>
