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
  import { ElMessage } from 'element-plus'
  import router from '@/router'

  
  let loading = ref(false)
  const form = ref({
    phone: '',
    password: ''
  })

  const onSubmit = async () => {
    try {
    loading.value = true
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || '登录失败')
  }

    router.push('/')
    console.log('登录成功')
  } catch (error) {
    let message = (error as {message:string}).message
    console.log('错误信息：', error)
    if ((error as {message:string}).message.includes('Failed to fetch')) {
      message = '网络连接失败，请检查网络设置'
    }
    
    ElMessage.error(message)
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