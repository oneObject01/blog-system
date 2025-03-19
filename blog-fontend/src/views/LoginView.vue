<!-- src/views/Login.vue -->
<template>
    <div class="auth-page">
      <el-card class="auth-card">
        <div class="logo">
          <!-- <img src="@/assets/logo.png" alt="博客系统"> -->
        </div>
        
        <el-form class="auth-form">
          <h2>用户登录</h2>
          
          <el-form-item>
            <el-input 
              v-model="form.phone"
              placeholder="请输入手机号"
              :prefix-icon="Phone"
            />
          </el-form-item>
  
          <el-form-item>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
  
          <el-button type="primary" class="submit-btn" :loading="loading" @click="onSubmit">立即登录</el-button>
  
          <div class="footer">
            <router-link to="/register">注册账号</router-link>
            <router-link to="/forget">忘记密码？</router-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Lock, Phone } from '@element-plus/icons-vue'
  import { ref } from 'vue'
  import router from '@/router'
  import auth from '@/request/apis/auth'
  import { useUserStore } from '@/stores/userStore'

  const userStore = useUserStore()
  
  let loading = ref(false)
  const form = ref({
    phone: '',
    password: ''
  })

  const onSubmit = async () => {
    try {
    loading.value = true
    const username = await auth.login(form.value)
    userStore.login(username as any)
    console.log('登录成功:', username)
    await localStorage.setItem('username', username as any)
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
  }finally {
    loading.value = false
  }
  }
  </script>
  
  <style scoped>
  .auth-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(45deg, #f3f7ff, #f8f9fa);
  }
  
  .auth-card {
    width: 400px;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.1);
  }
  
  .logo {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .logo img {
    width: 120px;
  }
  
  h2 {
    text-align: center;
    color: #303133;
    margin-bottom: 30px;
  }
  
  .submit-btn {
    width: 100%;
    height: 40px;
    margin-top: 20px;
  }
  
  .footer {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  a {
    color: #666;
    font-size: 14px;
    text-decoration: none;
  }
  
  a:hover {
    color: #409EFF;
  }
  </style>