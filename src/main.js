import Vue from "vue"
import VueRouter from "vue-router"
import _ from "lodash"
import "asset/js/flexible"
import App from "./app"
import routes from "routers"
import store from "./store"
import "asset/js/flexible"
import baseConfig from "utils/static"
import $ from "jquery"
import {auth} from "utils/auth"
import VueCookie from "vue-cookie"

Vue.use(VueCookie);
window.$ = $;
window._ = _;
window.baseConfig = baseConfig;
window.config = baseConfig;
window.regionId = ''
window.userInfo = ''
// window.userInfo = "fnVyqrJ3dLCudXOuhHp5aIGGcayDpnpngYejl7GFotx6dXartJ18srCbc66IenmtgYWXp4OmjqeCd8XMsoWmmH6Ffmmzd416roWZroR3bXM"

Vue.use(VueRouter)
let router = new VueRouter({
  mode: 'history',
  routes
})

auth(router)

new Vue({
  store,
  router,
  el: '#root',
  render: h => h(App)
})
