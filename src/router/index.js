import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path:'/login',
      name:"login",
      component: r => require.ensure([], () => r(require('@/pages/Login.vue')), 'demo')
    },
    {
      path:'/register',
      name:"register",
      component: r => require.ensure([], () => r(require('@/pages/Register.vue')), 'demo')
    },
    {
      path:'/',
      name:"chatRoom",
      component: r => require.ensure([], () => r(require('@/pages/ChatRoom.vue')), 'demo'),
      meta:{
        requireLogin:true
      }
    },
    //管理页面的路由以及子路由
    {
      path:'/admin/:page',
      name:"admin",
      component: r => require.ensure([], () => r(require('@/pages/Admin.vue')), 'demo'),
      //子路由
      children:[
        {
          path:'/admin/systemInfo',
          name:"systemInfo",
          component: r => require.ensure([], () => r(require('@/components/background/systemInfo.vue')), 'demo'),
          meta:{
            requireLogin:true,
            requireAdmin:true
          }
        },{
          path:'/admin/druidInfo',
          name:"druidInfo",
          component: r => require.ensure([], () => r(require('@/components/background/druidInfo.vue')), 'demo'),
          meta:{
            requireLogin:true,
            requireAdmin:true
          }
        },{
          path:'/admin/userAdmin',
          name:"userAdmin",
          component: r => require.ensure([], () => r(require('@/components/background/userAdmin.vue')), 'demo'),
          meta:{
            requireLogin:true,
            requireAdmin:true
          }
        },{
          path:'/admin/blogAdmin',
          name:"blogAdmin",
          component: r => require.ensure([], () => r(require('@/components/background/blogAdmin.vue')), 'demo'),
          meta:{
            requireLogin:true,
            requireAdmin:true
          }
        }
      ],
      meta:{
        requireLogin:true, //需要登录
        requireAdmin:true
      }
    },
    //空白跳转
    {
      path: "*",
      redirect: "/"
    }

  ]
})
