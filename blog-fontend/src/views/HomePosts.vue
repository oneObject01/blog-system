<template>
  <div class="home-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <h2>选择标签</h2>
      <div class="tag-list">
        <el-tag
          v-for="tag in availableTags"
          :key="tag"
          type="primary"
          @click="toggleTag(tag)"
          :class="{ 'selected-tag': selectedTags.includes(tag) }" 
          size="large"
        >
          {{ tag }}
        </el-tag>
      </div>
      <el-button class="clear-button" @click="clearSelectedTags" type="danger">一键清除</el-button>
    </div>
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
  </div>
</template>

<script setup lang="ts">
import postCard from '@/components/postCard.vue'
import { onMounted, onUnmounted, ref, watchEffect } from 'vue' 
import send from '@/request/apis/send'
import router from '@/router'
import { type Post} from '@/types/type'
import { ElMessage } from 'element-plus'

const postIntroducts = ref<Post[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const pageSize = 10
const searchQuery = ref('') // 用于存储搜索关键词
const selectedTags = ref<string[]>([]) // 用于存储选择的标签
const availableTags = ref<string[]>([
  // 编程语言
  'Python', 'Java', 'JavaScript', 'C++', 'C#', 'Go', 'Ruby', 'Swift', 'Kotlin',
  // 开发工具
  'Visual Studio Code', 'IntelliJ IDEA', 'Eclipse', 'Git', 'Docker', 'Maven', 'Gradle', 'Webpack', 'JUnit',
  // 技术领域
  '人工智能', '机器学习', '深度学习', '大数据', '云计算', '区块链', '物联网', '前端开发', '后端开发', '移动开发', '数据库管理', '算法与数据结构', '操作系统', '网络编程'
])

// 搜索框回车时触发搜索，刷新文章列表
const refreshPosts = async () => {
  try {
    page.value = 1
    const response = await send.getPosts(searchQuery.value, selectedTags.value, page.value)
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

// 加载更多文章
const loadMorePosts = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  try {
    const response = await send.getPosts(searchQuery.value, selectedTags.value, page.value)
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

// 滚动置底加载更多文章
const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  
  // 当距离底部小于100px时触发加载
  if (scrollHeight - scrollTop - clientHeight < 100) {
    loadMorePosts()
  }
}

// 切换标签选择状态
const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t!== tag)
  } else {
    selectedTags.value.push(tag)
  }
  refreshPosts()
}

// 一键清除选择的标签
const clearSelectedTags = () => {
  selectedTags.value = []
  refreshPosts()
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
.home-container {
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  padding: 20px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  transition: left 0.3s;
}

.sidebar h2 {
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  margin-top: 60px;
}

.tag-list {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.el-tag {
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
}

.selected-tag {
  background-color: #007BFF;
  color: #fff;
  border-color: #007BFF;
}

.clear-button {
  width: 80%;
  border: none;
  transition: background-color 0.3s;
}

.home-posts {
  margin-left: 220px;
  width: calc(100% - 220px);
  transition: margin-left 0.3s;
}

.search-container {
  margin-bottom: 30px;
}

.search-container .el-input {
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.home-posts h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.article-list {
  gap: 20px;
}

.article-card {
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  transition: transform 0.3s;
  margin-bottom: 10px;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.loading, .no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>