import Vue from 'vue'
import ElementUI from 'element-ui';
import {Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import { formatDate } from './assets/util/util'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

// 导入富文本编译器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编译器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.use(ElementUI);
Vue.prototype.$message = Message
Vue.prototype.$formatDate = formatDate
Vue.config.productionTip = false

// 全局修改 el-dialog 默认点击遮照为不关闭
ElementUI.Dialog.props.closeOnClickModal.default = false

// 配置请求根路径
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true

// 挂载到原型对象之前 先设置拦截器
// 请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
    // 为请求头对象添加Token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 最后都必须 return config
    return config
})

// 响应拦截器
axios.interceptors.response.use(res => {
    // 请求成功对响应数据做处理
    // 该返回的数据则是axios.then(res)中接收的数据
    if(res.data.code == 0) {
        ElementUI.Message({
            message: '后台出现错误! ',
            type: 'error'
        });
    } else if(res.data.code == 3) {
        ElementUI.Message({
            message: '登录失效请重新登录! ',
            type: 'warning'
        });
    }
    return res
}, err => {
    // 在请求错误时要做的事
    // 该返回的数据则是axios.catch(err)中接收的数据
    return Promise.reject(err)
})

// 挂载axios
Vue.prototype.$request = axios

new Vue({
    el: '#app',
    router,
    render: h => h(App)
}).$mount('#app')
