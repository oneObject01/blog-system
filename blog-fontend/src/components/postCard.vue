<template>
  <div class="article-container">
    <div class="article-header">
      <!-- <span class="author">作者：{{ postIntroduct.author.username }}</span> -->
      <slot name="leftUp"></slot>
      <span class="date">{{ postIntroduct.createdAt.substring(0, 10) }}</span>
    </div>
    <h3>{{ postIntroduct.title }}</h3>
    <div class="summary">摘要：{{ postIntroduct.abstract }}</div>
    <postTags :tags="postIntroduct.tags"></postTags>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import postTags from './postTags.vue';

defineProps({
  postIntroduct: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.article-container {
  position: relative;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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