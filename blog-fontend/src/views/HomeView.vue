<!-- src/views/Home.vue -->
<template>
    <div class="home-container">
      <!-- 导航栏 -->
      <el-header class="header fixed-header">
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
                  <el-dropdown-item @click="toPersonalCenter">个人中心</el-dropdown-item>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
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
        <div class="header-pag"></div>
        <router-view/>
      </el-main>

    </div>
  </template>
  
  <script setup lang="ts">
  import { useUserStore } from '@/stores/userStore';
  import { onMounted, onUnmounted} from 'vue';
  import router from '@/router';
  import { RouterView } from 'vue-router';
  import auth from '@/request/apis/auth'
  import { ElMessage,ElMessageBox } from 'element-plus'

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

  const toPersonalCenter = async () => {
    try{
      const response = await auth.authenticate()
      router.push('/personalCenter')
    }catch(err){
      ElMessageBox.confirm(
        '身份验证已过期，是否重新登陆?',
        '验证失败',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'error',
        }
      ).then(() => {
          userStore.leaveOut()
          router.push('/login')
      }).catch(() => {
          ElMessage({
            type: 'info',
            message: '跳转失败',
          })
        })
    }
  }

  const toCreatePost = async () => {
    try{
      const response = await auth.authenticate()
      router.push('/create')
    }catch(err){
      ElMessageBox.confirm(
        '身份验证已过期，是否重新登陆?',
        '验证失败',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'error',
        }
      ).then(() => {
          userStore.leaveOut()
          router.push('/login')
      }).catch(() => {
          ElMessage({
            type: 'info',
            message: '跳转失败',
          })
        })
    }
  }

  const logout = async()=>{
    ElMessageBox.confirm(
      '是否确认退出',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'error',
      }
    ).then(()=>{
      userStore.leaveOut()
      router.push('/login')
    }).catch(()=>{
      ElMessage({
        type: 'info',
        message: '退出失败',
      })
    })
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

  .fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
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
    padding: 80px;
  }
  </style>