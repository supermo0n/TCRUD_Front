import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
      path: '/',
      name: 'first',
      component: () => import('../views/LoginView.vue')
    },  
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },  
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/board',
        name: 'board',
        component: () => import('../components/board/BoardList.vue')
    },
    {
        path: '/board/:id',
        name: 'board-read',
        component: () => import('../components/board/BoardDetail.vue')
    },
    {
        path: '/add-board/:id?',
        name: 'add-board',
        component: () => import('../components/board/AddBoard.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue')
    },
    {
        path: '/mypage',
        name: 'mypage',
        component: () => import('../components/user/MyPage.vue')
    },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
