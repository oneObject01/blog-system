<template>
      <!-- 内容区 -->
      <div class="home-posts">
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
      </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

  
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