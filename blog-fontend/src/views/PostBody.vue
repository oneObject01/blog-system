<template>
    <el-card class="article-card">
      <template #header>
        <div class="article-header">
          <h2>{{ postData.title }}</h2>
          <div class="article-meta">
            <span>作者：{{ postData.author }}</span>
            <span>发布时间: {{ postData.createdAt }}</span>
          </div>
        </div>
      </template>
      <div class="article-content">
        <!-- 使用 v-html 渲染转换后的内容 -->
        <div class="markdown-body" v-html="renderedContent"></div>
      </div>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  import MarkdownIt from'markdown-it';
  import { computed } from 'vue';
  import 'github-markdown-css/github-markdown.css';
  
  const route = useRoute();
  const postData = route.query;
  const md = new MarkdownIt();
  // 计算属性，将 Markdown 内容转换为 HTML
  const renderedContent = computed(() =>{
    console.log("postData.content:", postData.content)
    const content = Array.isArray(postData.content)? postData.content[0] : postData.content;
    return md.render(content || '')
});

  
  console.log("获取路由 url:", route.query.id);
  </script>
  
  <style scoped>
  .article-card {
    margin-bottom: 20px;
  }
  
  .article-header {
    display: flex;
    flex-direction: column;
  }
  
  .article-meta {
    display: flex;
    gap: 20px;
    color: #888;
    font-size: 0.9em;
  }
  
  .article-content {
    margin-top: 10px;
    padding:0,20px,20px,0;
  }
  </style>