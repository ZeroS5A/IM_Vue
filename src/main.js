// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import store from './store/store.js'

Vue.config.productionTip = false
Vue.use(ViewUI);
Vue.use(mavonEditor)

//引入公用js
import Request from './api'
Vue.prototype.Request = Request

// 引入TIM
import tim from './common/timEvent.js'
Vue.prototype.Tim = tim

new Vue({
  el: '#app',
  router,
  components: { App },
  store,
  template: '<App/>'
})

// 路由守卫
router.beforeEach((to, from, next) => {
  window.document.title = 'ZIM'
  // 获取token
  let token = localStorage.getItem('token')
  // token 存在且不为空则已登录 不存在或为空则未登录
  if (token !== null && token !== '') {
    next()
  } else {
    // 用户进入需要登录的页面，则跳转登录界面
    if (to.meta.requireLogin) {
      next({
        path: '/login'
      })
      ViewUI.Message.info('请登录')
    } else {
      next()
    }
  }
})
