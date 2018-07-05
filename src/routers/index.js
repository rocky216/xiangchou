import App from "views/app"
import Home from "views/home"
import List from "views/list"
import Test from "views/test"
import Category from "views/category"
import Forum from "views/forum"
import Post from "views/post"
import Login from "views/login"
import Register from "views/login/register"
import Forget from "views/login/forget"
import Users from "views/users"
import Hiscoll from "views/users/hiscoll"
//商城
import Mall from "mall/home"
import MallDetail from "mall/detail"
import MallOrder from "mall/order"
import MallAddress from "mall/address"
import MallCart from "mall/cart"
import CartOrder from "mall/order/cart_order"
import AddAddress from "mall/address/add_address"
import OrderList from "mall/order/order_list"

export default [
  {
    path: '/',
    component: App,
    redirect: "/home",
    children: [
      {
        path: '/home/:regionId',
        component: Home,
        name: 'home'
      },
      {
        path: '/category/:regionId/:id/',
        component: Category,
        name: 'category'
      },{
        path: '/forum/:regionId',
        component: Forum,
        name: 'forum'
      },{
        path: '/post/:regionId',
        component: Post,
        name: 'post',
        meta: {requiresAuth: true}
      },{
        path:"/users/:regionId",
        component: Users,
        name: 'users',
        meta: {requiresAuth: true}
      },{
        path:"/hiscoll/:regionId",
        component: Hiscoll,
        name: 'hiscoll',
        meta: {requiresAuth: true}
      },{
        path: "/mall/home/:regionId",
        component: Mall,
        name: 'mall'
      },{
        path: "/mall/detail/:product_id",
        component: MallDetail
      },{
        path: "/mall/order/:product_id/:num",
        component: MallOrder,
        meta: {requiresAuth: true}
      },{
        path: "/mall/address/:type?",
        component: MallAddress,
        meta: {requiresAuth: true}
      },{
        path: "/mall/cart",
        component: MallCart,
        meta: {requiresAuth: true}
      },{
        path: "/mall/cart_order",
        component: CartOrder,
        meta: {requiresAuth: true}
      },{
        path: "/mall/add_address",
        component: AddAddress,
        meta: {requiresAuth: true}
      },{
        path: "/mall/order_list",
        component: OrderList,
        meta: {requiresAuth: true}
      }
    ]
  },{
    path: "/login",
    component: Login
  },{
    path: "/register",
    component: Register
  },{
    path:"/forget",
    component: Forget
  },{
    path: '/test',
    component: Test
  }
]
