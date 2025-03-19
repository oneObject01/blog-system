import { createMemoryHistory, createRouter } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import CreatePost from '@/views/CreatePost.vue'
import HomePosts from '@/views/HomePosts.vue'

const routes = [
  { path: '/', component: HomeView ,
    children:[
      { path: '', component: HomePosts },
      { path: 'create', component: CreatePost }
    ]
  },
  { path: '/login', component: LoginView },
  { path: '/Register',component: RegisterView},


]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router