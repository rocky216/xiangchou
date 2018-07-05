import axios from "./http"
import qs from "qs"
import {Toast, Indicator} from "mint-ui"

export function timeStamp(num){
  var date = new Date(num),
  Y = date.getFullYear() + '-',
  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-',
  D = date.getDate() + ' ',
  h = date.getHours() + ':',
  m = date.getMinutes() + ':',
  s = date.getSeconds();
  return Y+M+D+h+m+s
}

export function fetch(opt, cb){

  var setting = {
    url: opt.url,
    method: (opt.method?opt.method:'get').toLowerCase()
  }
  Indicator.open();
  function prefix(method){
    return axios({
      url: setting.url,
      method: setting.method,
      [setting.method == 'GET'?'params':'data']: qs.stringify(opt.data) ,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
  }

  prefix(setting.method).then((response)=>{
    Indicator.close();
    if (response.data.status=="1" ) {
      cb(response.data.info)
    }else if(response.data.status=="-1") {
      window.userInfo = ''
      Toast("登录超时，请重新登录！")
    }else{
      Toast(response.data.msg);
    }
  }).catch((err)=>{
    Indicator.close();
    console.log('%c','color:red', err);
  })
}

export function oDecimal(x) {
  var val = Number(x)
  if(!isNaN(parseFloat(val))) {
     val = val.toFixed(2);
  }
  return  val;
}
