<!-- src/views/Login.vue -->
<template>
    <div class="auth-page">
      <el-card class="auth-card">
        <div class="logo">
          <!-- <img src="@/assets/logo.png" alt="博客系统"> -->
        </div>
        
        <el-form class="auth-form" :rules="rules" :model="form" ref="formRef" :loading="loading">
          <h2>用户注册</h2>

          <el-form-item prop="phone">
            <el-input 
              v-model="form.phone"
              placeholder="请输入手机号"
              :prefix-icon="Phone"
            />
          </el-form-item>

          <el-form-item prop="username">
            <el-input 
              v-model="form.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>
  
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请创建密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="重新输入密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
  
          <el-button type="primary" class="submit-btn" @click="submitForm" :loading="loading">{{ loading ? '注册中...' : '立即注册' }}</el-button>
  
          <div class="footer">
            <router-link to="/login">返回登录</router-link>
            <router-link to="/forget">忘记密码？</router-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </template>
  
<script setup lang="ts">
import { User, Lock, Phone } from '@element-plus/icons-vue'
import { ref } from 'vue'
import  {type FormInstance,ElMessage } from 'element-plus'
import router from '@/router'
import type { FormItemRule } from 'element-plus'
import auth from '@/request/apis/auth'

  
  const form = ref({
    username: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })

  // 密码一致性验证函数
  const checkPassword: FormItemRule['validator'] = (rule, value, callback) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

//表单规则
const rules = ref({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在3到12个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: /^\w{6,18}$/, message: '6-18位字母数字组合', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: checkPassword, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
})

const formRef = ref<FormInstance | null>(null)
let loading = ref(false)
const submitForm = async () => {
  try {
    loading.value = true
    // 触发表单验证
    await formRef.value?.validate()
    await auth.register(form.value)
    // 只有当所有验证通过才会执行到这里
    router.push('/login')
    console.log('验证通过，可以提交了')
  } catch (error) {
    // 验证失败时自动进入这里
    console.error('验证失败', error)
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