<template>
<div class="home-posts">
    <h1 class="page-title">我的文章</h1>
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
            <el-button size="small" type="danger" plain @click="deletePost($event,item._id)">删除</el-button> 
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
import remove from '@/request/apis/delete'
import { ref } from 'vue'
import router from '@/router'
import { type Post} from '@/types/type'
import { ElMessage, ElMessageBox } from 'element-plus'

const postIntroducts = ref<Post[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const pageSize = 10

const loadMorePosts = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  try {
    const response = await send.getPersonalPosts(page.value)
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
  } finally {
    loading.value = false
  }
}

const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight

  // 当距离底部小于100px时触发加载
  if (scrollHeight - scrollTop - clientHeight < 100) {
    loadMorePosts()
  }
}

const handleDeletePost = async (postId: string|number) => {
  try {
    const response = await remove.deletePost(postId)
    console.log("删除成功", response)
    postIntroducts.value.shift()
    ElMessage.success('删除成功')
  } catch(err) {
    console.error("删除失败", err)
  }
}

const deletePost = async (event:Event,postId: string|number) => {
  event.stopPropagation()
  ElMessageBox.confirm(
    '请问您是否要删除该文章？',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
    }
  ).then(()=>{
    handleDeletePost(postId)
  }).catch(() => {
    ElMessage({
      type: 'error',
      message: '已取消删除',
    })
  })
}

onMounted(async () => {
  try {
    const response = await send.getPersonalPosts(page.value)
    const posts = response.data as Post[]
    postIntroducts.value = posts
    hasMore.value = posts.length === pageSize
    page.value++
  } catch(err) {
    console.error("获取文章失败", err)
  }

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-posts {
  margin-left: 220px;
  width: calc(100% - 220px);
  transition: margin-left 0.3s;
}

.page-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
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
