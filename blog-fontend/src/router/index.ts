import { createWebHistory, createRouter } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CreatePost from '@/views/CreatePost.vue'
import HomePosts from '@/views/HomePosts.vue'
import PostBody from '@/views/PostBody.vue'
import PersonalView from '@/views/PersonalView.vue'

const routes = [
  { 
    path: '/', 
    component: HomeView,
    children: [
      { path: '', component: HomePosts },
      { path: 'create', component: CreatePost },
      { path: 'body', component: PostBody },
      { path: 'personalCenter', component: PersonalView }
    ]
  },
  { path: '/login', component: LoginView },
  { path: '/Register', component: RegisterView }
]

const router = createRouter({
  // 使用 createWebHistory 创建路由历史
  history: createWebHistory(), 
  routes
})

export default router    