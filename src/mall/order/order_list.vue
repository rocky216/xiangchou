<template lang="html">
<div class="orderList">
  <Head title="我的订单"></Head>
  <!-- <div class="nav">
    <ul>
      <li class="active">全部</li>
      <li>待收货</li>
      <li>已完成</li>
      <li>已取消</li>
    </ul>
  </div> -->
  <div class="cartList">
    <ul>
      <li v-for="item in orderList" :key="item.product_id">
        <div class="info">
          <div class="img">
            <img :src="baseUrl+item.product_info[0].product_image" />
          </div>
          <div class="infoText">
            <h2>{{item.product_info[0].product_title}}</h2>
            <div class="price">
              <p class="colorRed">￥{{item.product_info[0].product_price}}</p>
              <p>数量x{{item.product_info[0].product_num}}</p>
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
            <strong>{{oDecimal(parseFloat(item.product_info[0].product_num)*parseFloat(item.product_info[0].product_price))}}</strong>
          </span>
        </div>
      </li>
    </ul>
  </div>

</div>
</template>

<script>
import Head from "components/Head"
import {fetch, oDecimal} from "utils"

export default {
  components: {
    Head
  },
  data(){
    return {
      orderList: [],
      baseUrl: config.baseUrl
    }
  },
  created(){
    this.getBePaid()
  },
  methods: {
    oDecimal:oDecimal,
    getBePaid(){
      const options = {
        url: "/gushi/Api/User/Order/unpaid",
        method: "post",
        data: {
          token: userInfo
        }
      }
      fetch(options, (res)=>{
        this.orderList = res
      })
    }
  }
}
</script>

<style lang="less" scoped >
@import "../../asset/less/common.less";
.orderList {
  background-color: @whiteColor;
}
.nav {
  width: 100%;
  ul {
    display: flex;
    li {
      flex: 1;
      text-align: center;
      padding: 0.2rem 0;
      border-bottom: 1px solid @grayddd;
    }
    li.active {
      border-color: @redColor;
      color: @redColor;
    }
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


</style>
