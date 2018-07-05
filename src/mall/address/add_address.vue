<template lang="html">
<div class="add_address">
  <Head title="添加收货地址" right="保存" @rightHandle="rightHandle"></Head>
  <div class="area">
    <div class="area_item">
      <select v-model="province" @change="provinceHandle">
        <option value="">请选择省</option>
        <option  v-for="item in allCity" :value="item.code" :key="item.code">{{item.name}}</option>
      </select>
    </div>
    <div class="area_item">
      <select v-model="city" @change="cityHandle">
        <option value="">请选择市</option>
        <option v-for="item in citys" :value="item.code" :key="item.code">{{item.name}}</option>
      </select>
    </div>
    <div class="area_item">
      <select v-model="area" >
        <option value="">请选择区/县</option>
        <option v-for="item in areas" :value="item.code" :key="item.code">{{item.name}}</option>
      </select>
    </div>
  </div>
  <div class="detailAddress">
    <table>
      <tr>
        <td>详细地址</td>
        <td>
          <textarea v-model="detailAdrs" rows="3" placeholder="详细地址" ></textarea>
        </td>
      </tr>
      <tr>
        <td>收件人</td>
        <td>
          <input v-model="name" type="text" placeholder="收件人" >
        </td>
      </tr>
      <tr>
        <td>手机号</td>
        <td>
          <input v-model="mobile" type="text" placeholder="手机号码">
        </td>
      </tr>
    </table>
  </div>
</div>
</template>

<script>
import citys from "./citys"
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
      selected: 'bar',
      allCity: citys,
      province: '',
      city: '',
      area:'',
      citys: [],
      areas: [],
      detailAdrs: '',
      mobile: '',
      name: ''
    }
  },
  created(){

  },
  methods: {
    addAddress(){
      const {province, city, area, name, detailAdrs, mobile} = this

      const options = {
        url: "/gushi/Api/User/Address/add",
        method: "post",
        data: {
          is_default: '',
          province: province,
          city:city,
          area:area,
          address_detail: detailAdrs,
          name: name,
          mobile: mobile,
          token: userInfo
        }
      }
      fetch(options, (res)=>{
        this.$router.go("-1")
      })
    },
    rightHandle(){
      const {province, city, area, name, detailAdrs, mobile} = this
      if (!province || !city || !area) {
        Toast("请选择完整地区！")
        return
      }
      if (!detailAdrs) {
        Toast("请填写详细地址！")
        return
      }
      if (!name) {
        Toast("请填写姓名！")
        return
      }
      if (!mobile || !(/^1[34578]\d{9}$/.test(mobile)) ) {
        Toast("请输入正确的手机号码！")
        return
      }
      this.addAddress()
    },
    provinceHandle(value){
      let city = _.filter(this.allCity,n=>n.code==value.target.value)[0]
      this.citys = city?city.sub:[]
      this.areas=[]
      this.city = ""
      this.area = ""
    },
    cityHandle(value){
      let area = _.filter(this.citys,n=>n.code==value.target.value)[0]
      this.areas = area?area.sub:[]
      this.area = ""
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../asset/less/common.less";

.add_address {
  background-color: @whiteColor;
}
.area {
  display: flex;
  .area_item {
    flex: 1;
  }
  .area_item {
    padding: 0.2rem;
    select {
      width: 100%;
      height: 1rem;
      border:none;
      border-bottom: 1px solid @grayddd;
    }
  }
}
.detailAddress {
  table {
    width: 100%;
    tr {
      td {
        padding: 0.2rem;
        textarea, input{
          width: 100%;
          padding: 0.2rem;
          border:1px solid @grayddd;
          box-sizing: border-box;
        }
      }
      td:nth-child(1){
        text-align: right;
        width: 2rem;
      }
    }
  }

}

</style>
