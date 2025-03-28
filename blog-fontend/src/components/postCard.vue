<template>
    <div class="article-header">
        <span class="author">作者：{{ postIntroduct.author.username }}</span>
        <span class="date">{{ postIntroduct.createdAt.substring(0, 10) }}</span>
    </div>
    <h3>{{ postIntroduct.title }}</h3>
    <p class="summary">摘要：{{ postIntroduct.abstract }}</p>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  postIntroduct: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
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