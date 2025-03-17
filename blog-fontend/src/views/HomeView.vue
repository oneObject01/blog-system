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
            <router-link to="/login"><el-button type="primary">登录</el-button></router-link>
        </div>
      </el-header>
  
      <!-- 内容区 -->
      <el-main class="main-content">
        <h1>最新文章</h1>
        <div class="article-list">
          <!-- 文章卡片 -->
          <el-card 
            v-for="n in 3" 
            :key="n" 
            class="article-card"
          >
            <div class="article-header">
              <h3>示例文章标题 {{ n }}</h3>
              <span class="date">2023-08-01</span>
            </div>
            <p class="summary">这里是文章的摘要内容，用于简要介绍文章的主要内容...</p>
          </el-card>
        </div>
      </el-main>
    </div>
  </template>
  
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
  
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;
  }
  
  .article-list {
    display: grid;
    gap: 20px;
  }
  
  .article-card {
    transition: transform 0.3s;
  }
  
  .article-card:hover {
    transform: translateY(-3px);
  }
  
  .article-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .date {
    color: #909399;
    font-size: 14px;
  }
  
  .summary {
    color: #606266;
    line-height: 1.6;
  }
  </style>