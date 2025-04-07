<template>
      <!-- 内容区 -->
      <div class="home-posts">
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="请输入关键词搜索文章"
            :maxlength="50"
            prefix-icon="Search"
            clearable
            @keyup.enter="refreshPosts"
          >
          </el-input>
        </div>
        <h1>最新文章</h1>
        <div class="article-list">
          <!-- 文章卡片 -->
          <el-card 
            v-for="item in postIntroducts" 
            :key="item._id" 
            class="article-card"
            @click="router.push({
              path:'/body',
              query:{
                postId:item._id,
                title:item.title,
                content:item.content,
                author:item.author.username,
                createdAt: item.createdAt.toString().substring(0, 10),
                tags:item.tags
              }
            })"
          >
            <postCard :postIntroduct="item">
              <template #leftUp>
                <span class="author">作者：{{ item.author.username }}</span>
              </template>
            </postCard>
          </el-card>
        </div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-if="!hasMore && postIntroducts.length > 0" class="no-more">没有更多文章了</div>
      </div>
</template>

<script setup lang="ts">
import postCard from '@/components/postCard.vue'
import { onMounted, onUnmounted } from 'vue' 
import send from '@/request/apis/send'
import { ref } from 'vue'
import router from '@/router'
import { type Post} from '@/types/type'
import {ElMessage} from 'element-plus'

const postIntroducts = ref<Post[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const pageSize = 10
const searchQuery = ref('') // 新增：用于存储搜索关键词

//搜索框回车时触发搜索，刷新文章列表
const refreshPosts = async () => {
  try {
    page.value = 1
    const response = await send.getPosts(searchQuery.value,page.value)
    const posts = response.data as Post[]
    postIntroducts.value = posts
    console.log(postIntroducts.value)
    hasMore.value = posts.length === pageSize
    page.value++
  } catch(err) {
    console.error("获取文章失败", err)
    ElMessage.error('获取文章失败')
  }
}
//加载更多文章
const loadMorePosts = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  try {
    const response = await send.getPosts(searchQuery.value,page.value)
    const posts = response.data as Post[]
    if (posts.length > 0) {
      postIntroducts.value = [...postIntroducts.value, ...posts]
      hasMore.value = posts.length === pageSize
      page.value++
    } else {
      hasMore.value = false
    }
  } catch(err) {
    console.error("获取更多文章失败", err)
    ElMessage.error('获取文章失败')
  } finally {
    loading.value = false
  }
}

//滚动置底加载更多文章
const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  
  // 当距离底部小于100px时触发加载
  if (scrollHeight - scrollTop - clientHeight < 100) {
    loadMorePosts()
  }
}

onMounted(async () => {
  await refreshPosts()
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
 .search-container {
    margin-bottom: 20px;
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
    cursor: pointer;
  }

  .loading, .no-more {
    text-align: center;
    padding: 20px;
    color: #909399;
  }
</style>