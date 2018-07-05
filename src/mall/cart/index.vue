<template>
<div class="cart">
  <Head title="购物车"></Head>
  <div class="cartList">
    <ul>
      <li v-for="item in cartList" :key="item.product_id">
        <div class="checkBox">
          <input type="checkBox" :checked="item.checked" @change="checkedHandle(item)">
          <span><i class="fa fa-check"></i></span>
        </div>
        <div class="info">
          <div class="img">
            <img :src="baseUrl+item.product_image" />
          </div>
          <div class="infoText">
            <h2>金龙鱼 盘锦大米 蟹稻共生5kg 东北大米 人气爆款</h2>
            <div class="num">
              <span @click="reduce(item)">-</span>
              <span>{{parseInt(item.product_num)}}</span>
              <span @click="add(item)">+</span>
            </div>
            <div class="isPrice">
              {{toDecimal(item.product_price*item.product_num)}}
            </div>
          </div>
        </div>
        <div class="price">
          <p>数量x1</p>
          <p>￥{{toDecimal(item.product_price)}}</p>
          <i class="fa fa-trash-o fa-lg" @click="cartDel(item)"></i>
        </div>
      </li>
    </ul>
  </div>
  <div class="bottom">
    <div class="checkBox">
      <input type="checkbox" :checked="isAllChecked" @change="allChecked">
      <span><i class="fa fa-check"></i></span>
    </div>
    <div class="text">
      <p>总价： ￥{{totalMoney}}</p>
    </div>
    <div class="settle">
      <Button @click="settle" type="danger" size="small">结算({{totalNum}})</Button>
    </div>
  </div>
</div>
</template>
<script>
import {Button, Toast, MessageBox} from "mint-ui"
import Head from "components/Head"
import {fetch} from "utils"

export default {
  components: {
    Button,
    Head
  },
  data(){
    return {
      cartList: [],
      baseUrl: config.baseUrl,
      checkedOrder: [],
      isAllChecked: false
    }
  },
  created(){
    this.getCartList()
  },
  computed: {
    totalMoney(){
      let str = 0
      _.each(this.cartList, (item)=>{
        if (item.checked) {
          str += item.product_price*item.product_num
        }
      })
      return this.toDecimal(str)
    },
    totalNum(){
      let str = 0
      _.each(this.cartList, (item)=>{
        if (item.checked) {
          str += parseInt(item.product_num)
        }
      })
      return str
    }
  },
  methods: {
    cartDel(item){
      const options = {
        url: "/gushi/Api/User/Cart/del",
        method: "post",
        data: {
          token: userInfo,
          cart_ids: item.cart_id
        }
      }

      MessageBox({
        message: '是否删除？',
        showCancelButton: true
      }).then(action => {
        if (action=="confirm") {
          fetch(options, ()=>{
            Toast("删除成功！")
            this.getCartList()
            this.isAllChecked = false
          })
        }
      });
    },
    settle(){
      if (this.totalNum==0) {
        Toast("请添加商品！")
        return
      };
      let product_ids = this.getStr(this.cartList, "product_id")
      let product_nums = this.getStr(this.cartList, "product_num")
      localStorage.setItem('cartorder', JSON.stringify(_.filter(this.cartList,o=>o.checked)));
      this.$router.push('/mall/cart_order')
    },
    getStr(arr,attr){
      var newArr=[]
      _.each(arr, (item)=>{
        newArr.push(item[attr])
      })
      return newArr.join()
    },
    allChecked(){
      this.isAllChecked = event.target.checked;
      this.cartList = _.map(this.cartList, (o)=>{
        o.checked = this.isAllChecked?true:false
        return o
      })
    },
    checkedHandle(item){
      let index = _.findIndex(this.cartList, o=>o.product_id == item.product_id)
      this.cartList = this.getCheckedArr(this.cartList, index)
      let isAllChecked = _.filter(this.cartList, o=>!o.checked)
      this.isAllChecked = !_.filter(this.cartList, o=>!o.checked).length?true:false;
    },
    getCheckedArr(arr, index){
      let newArr=[]
      _.each(arr, (item,i)=>{
        if (i==index) {
          item["checked"] = !item["checked"]
        }
        newArr.push(item)
      })
      return newArr
    },
    toDecimal(x) {
      var val = Number(x)
      if(!isNaN(parseFloat(val))) {
         val = val.toFixed(2);
      }
      return  val;
    },
    createArr(arr, index, type=true){
      var newArr=[]
      _.each(arr, (item,i)=>{
        if (index==i ) {
          if (!type && item["product_num"] >1) {
            item["product_num"] = parseInt(item["product_num"])-1
          }
          if (type) {
            item["product_num"] = parseInt(item["product_num"])+1
          }
        }
        newArr.push(item)
      })
      return newArr
    },
    add(item){
      let index = _.findIndex(this.cartList, o=>o.product_id == item.product_id)
      this.cartList = this.createArr(this.cartList, index)
    },
    reduce(item){
      let index = _.findIndex(this.cartList, o=>o.product_id == item.product_id)
      this.cartList = this.createArr(this.cartList, index, false)
    },
    // changeCartNum(item, type=true){
    //   const options={
    //     url: "/gushi/Api/User/Cart/set_num",
    //     method: "post",
    //     data: {
    //       token: this.$cookie.get("token"),
    //       cart_id: item.cart_id,
    //       product_num: type?parseInt(item.product_num)+1:parseInt(item.product_num)-1
    //     }
    //   }
    //   fetch(options, ()=>{
    //
    //   })
    // },
    getCartList(){
      const options = {
        url: "/gushi/Api/User/Cart/index",
        method: "post",
        data: {
          token: userInfo
        }
      }
      fetch(options, (res)=>{
        this.cartList=res
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../asset/less/common.less";
.cart{
  background-color: @whiteColor;
}
.checkBox {
  flex: 1;
  position: relative;
  input:checked~span {
    background-color: @redColor;
  }
  span {
    margin: 0.5rem auto;
    width: 0.6rem;
    height: 0.6rem;
    border:1px solid @grayf1;
    display: block;
    border-radius: 50%;
    text-align: center;
    color: @grayf1;
    line-height: 0.6rem;
  }
  input {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top:0;
    opacity: 0;
  }
}
.cartList {
  padding:0 0.2rem;
  ul {
    li {
      border-bottom: 1px solid @grayf1;
      padding: 0.2rem 0;
      display: flex;

      .price {
        flex: 1.3;
        text-align: right;
        i{
          margin-top: 0.3rem;
        }
      }
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
        }
      }
    }
  }
}
.bottom {
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 0;
  left:0;
  border-top: 1px solid @grayf1;
  background-color: @whiteColor;
  .checkBox {
    flex: 1;
  }
  .text {
    flex: 5;
    padding-left: 0.2rem;
    box-sizing: border-box;
    p {
      margin-top:0.5rem;
    }
  }
  .settle {
    flex: 3;
    text-align: right;
    margin-right: 0.2rem;
    button{
      margin-top: 0.3rem;
    }
  }
}
.num {
  width: 2.7rem;
  margin-top: 0.2rem;
  float: left;
  span {
    float: left;
    box-sizing: border-box;
    border: 1px solid @grayf1;
    height: 0.8rem;
    width: 0.8rem;
    text-align: center;
    line-height: 0.7rem;
    margin-left: 0.1rem;
    background-color: @grayf1;
  }
}
.isPrice {
  float: left;
  line-height: 1rem;
  margin-left: 0.1rem;
  color: @redColor;
}

</style>
