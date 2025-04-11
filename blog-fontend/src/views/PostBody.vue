<template>
    <el-card class="article-card">
      <template #header>
        <div class="article-header">
          <h2>{{ postData.title }}</h2>
          <div class="article-meta">
            <span>作者：{{ postData.author }}</span>
            <span>发布时间: {{ postData.createdAt }}</span>
          </div>
          <postTags :tags="postData.tags as string[]"></postTags>
        </div>
      </template>
      <div class="article-content">
        <!-- 使用 v-html 渲染转换后的内容 -->
        <div class="markdown-body" v-html="renderedContent"></div>
      </div>
      <div class="article-actions">
        <div class="action-item" @click="handleLike" :class="{ active: isLiked }">
          <el-icon :size="20"><CaretTop /></el-icon>
          <span>{{ likeCount }}</span>
        </div>
        <div class="action-item" @click="handleDislike" :class="{ active: isDisliked }">
          <el-icon :size="20"><CaretBottom /></el-icon>
          <span>{{ dislikeCount }}</span>
        </div>
        <div class="action-item" @click="handleFavorite" :class="{ active: isFavorited }">
          <el-icon :size="20"><StarFilled /></el-icon>
          <span>{{ favoriteCount }}</span>
        </div>
      </div>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  import MarkdownIt from'markdown-it';
  import { computed, ref } from 'vue';
  import 'github-markdown-css/github-markdown.css';
  import postTags from '../components/postTags.vue';
  import { StarFilled, CaretTop, CaretBottom } from '@element-plus/icons-vue'
  
  const route = useRoute();
  const postData = route.query;
  const md = new MarkdownIt();

  // 状态变量
  const isLiked = ref(false);
  const isDisliked = ref(false);
  const isFavorited = ref(false);
  const likeCount = ref(0);
  const dislikeCount = ref(0);
  const favoriteCount = ref(0);
  const updatedScore: UpdatedScore = {
    likeCount: 0,
    dislikeCount: 0,
    favoriteCount: 0
  }

  type ScoreType = -1 | 0 | 1
  // 定义更新分数的类型
  interface UpdatedScore {
    likeCount: ScoreType;
    dislikeCount: ScoreType;
    favoriteCount: ScoreType;
  }
  // 处理点赞
  const handleLike = () => {
    if (isLiked.value) {
      isLiked.value = false;
      likeCount.value--;
      updatedScore.likeCount = -1
    } else {
      isLiked.value = true;
      likeCount.value++;
      updatedScore.likeCount = 1
      // 如果之前点踩了，取消点踩
      if (isDisliked.value) {
        isDisliked.value = false;
        dislikeCount.value--;
        updatedScore.dislikeCount = -1
      }
    }
    handleUpdateScore()
  };

  // 处理点踩
  const handleDislike = () => {
    if (isDisliked.value) {
      isDisliked.value = false;
      dislikeCount.value--;
      updatedScore.dislikeCount = -1
    } else {
      isDisliked.value = true;
      dislikeCount.value++;
      updatedScore.dislikeCount = 1
      // 如果之前点赞了，取消点赞
      if (isLiked.value) {
        isLiked.value = false;
        likeCount.value--;
        updatedScore.likeCount = -1
      }
      // 如果之前收藏了，取消收藏
      if (isFavorited.value) {
        isFavorited.value = false;
        favoriteCount.value--;
        updatedScore.favoriteCount = -1
      }
    }
    handleUpdateScore()
  };

  // 处理收藏
  const handleFavorite = () => {
    if (isFavorited.value) {
      isFavorited.value = false;
      favoriteCount.value--;
      updatedScore.favoriteCount = -1
    } else {
      isFavorited.value = true;
      favoriteCount.value++;
      updatedScore.favoriteCount = 1
      // 如果之前点踩了，取消点踩
      if (isDisliked.value) {
        isDisliked.value = false;
        dislikeCount.value--;
        updatedScore.dislikeCount = -1
      }
    }
    handleUpdateScore()
  };

  const handleUpdateScore = () => {
    console.log(updatedScore);
    updatedScore.likeCount = 0;
    updatedScore.dislikeCount = 0;
    updatedScore.favoriteCount = 0;
    console.log(updatedScore);
  }
  // 计算属性，将 Markdown 内容转换为 HTML
  const renderedContent = computed(() =>{
    const content = Array.isArray(postData.content)? postData.content[0] : postData.content;
    return md.render(content || '')
  });
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

  .article-actions {
    display: flex;
    justify-content: flex-end;
    gap: 30px;
    margin-top: 20px;
    padding: 10px 0;
    border-top: 1px solid #eee;
  }

  .action-item {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    color: #666;
    transition: all 0.3s ease;
  }

  .action-item:hover {
    color: #409EFF;
  }

  .action-item.active {
    color: #409EFF;
  }

  .action-item span {
    font-size: 14px;
  }
  </style>