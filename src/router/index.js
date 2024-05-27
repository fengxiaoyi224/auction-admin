import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Client from '../components/user/Client.vue'
import GoodsType from '../components/goodsType/GoodsType.vue'
import Message from '../components/message/Message.vue'
import Admin from '../components/admin/Admin.vue'
import Goods from '../components/goods/Goods.vue'
import Order from '../components/order/Order.vue'
import Logistics from '../components/logistics/logistics.vue'
Vue.use(Router)

const router = new Router({
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: Login
		},
		{
			path: '/home',
			component: Home,
			// redirect: '/welcome',
			children: [
				{
					path: '/welcome',
					component: Welcome
				},
				{
					path: '/user',
					component: User
				},
				{
					path: '/client',
					component: Client
				},
				{
					path: '/type',
					component: GoodsType
				},
				{
					path: '/message',
					component: Message
				},
				{
					path: '/admin',
					component: Admin
				},
				{
					path: '/goods',
					component: Goods
				},
				{
					path: '/order',
					component: Order
				},
				{
					path: '/logistics',
					component: Logistics
				},
			]
		},
	]
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
	// to 将要访问的路径
	// 从那个路径跳转过来
	// next 表示放行

	// 如果访问登录页 直接放行
	if(to.path == '/login') {
		return next();
	}
	// 不是登录页，判断是否有token
	let token = window.sessionStorage.getItem("token")
	if(!token) {
		// token 不存在 强制跳转登录页
		return next("/login")
	}
	next()
})

export default router

