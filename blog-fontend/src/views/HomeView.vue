<!-- src/views/Home.vue -->
<template>
    <div class="home-container">
      <!-- 导航栏 -->
      <el-header class="header">
        <div class="logo">
          <!-- <img src="@/assets/logo.png" alt="博客系统"> -->
        </div>
        
        <div class="nav-menu">
          <router-link to="/">首页</router-link>
          <router-link to="/articles">文章</router-link>
          <router-link to="/about">关于</router-link>
        </div>
        
        <div class="user-panel">
          <div v-if="userStore.isLogin">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ userStore.username }}
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="toCreatePost">创建文章</el-dropdown-item>
                  <el-dropdown-item @click="userStore.logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-else>
            <router-link to="/login"><el-button type="primary">登录</el-button></router-link>
          </div>     
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view/>
      </el-main>


    </div>
  </template>
  
  <script setup lang="ts">
  import { useUserStore } from '@/stores/userStore';
  import { onMounted, onUnmounted} from 'vue';
  import router from '@/router';
  import { RouterView } from 'vue-router';

  const userStore = useUserStore()

  onMounted(() => {
    console.log(userStore.isLogin)
    if(localStorage.getItem('ACCESS_TOKEN') && localStorage.getItem('username')){
      userStore.refresh()
    }
  })
  onUnmounted(()=>{
    console.log(userStore.isLogin)
  })

  const toCreatePost = () => {
    router.push('/create')
  }
  </script>

  <style scoped>
  .home-container {
    min-height: 100vh;
  }
  
  .header {
    display: flex;
    align-items: center;
    background: #fff;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
  
  .logo img {
    height: 40px;
  }
  
  .nav-menu {
    flex: 1;
    margin-left: 50px;
  }
  
  .nav-menu a {
    color: #606266;
    margin-right: 30px;
    text-decoration: none;
  }
  
  .nav-menu a:hover {
    color: #409EFF;
  }
  
  .user-panel {
    margin-right: 30px;
  }
  
  .user-panel .el-dropdown-link {
    cursor: pointer;
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;
  }
  </style>