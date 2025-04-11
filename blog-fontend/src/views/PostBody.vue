<template>
  <el-card class="article-card">
    <template #header>
      <div class="article-header">
        <h2>{{ postData?.title }}</h2>
        <div class="article-meta">
          <span>作者：{{ postData?.author?.username }}</span>
          <span>发布时间: {{ postData?.createdAt.toString().substring(0, 10) }}</span>
        </div>
        <postTags :tags="postData?.tags as string[]"></postTags>
      </div>
    </template>
    <div class="article-content">
      <div class="markdown-body" v-html="renderedContent"></div>
    </div>
    <div class="article-actions">
      <div class="action-item" @click="globalThrottledHandleLike" :class="{ active: isLiked }">
        <el-icon :size="20"><CaretTop /></el-icon>
        <span>{{ likeCount }}</span>
      </div>
      <div class="action-item" @click="globalThrottledHandleDislike" :class="{ active: isDisliked }">
        <el-icon :size="20"><CaretBottom /></el-icon>
        <span>{{ dislikeCount }}</span>
      </div>
      <div class="action-item" @click="globalThrottledHandleFavorite" :class="{ active: isFavorited }">
        <el-icon :size="20"><StarFilled /></el-icon>
        <span>{{ favoriteCount }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import MarkdownIt from'markdown-it';
import { computed, onMounted, ref } from 'vue';
import 'github-markdown-css/github-markdown.css';
import postTags from '../components/postTags.vue';
import { StarFilled, CaretTop, CaretBottom } from '@element-plus/icons-vue';
import send from '../request/apis/send';
import update from '../request/apis/update';
import { type Post } from '../types/type';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import auth from '../request/apis/auth';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const userStore = useUserStore();
const router = useRouter();
const postData = ref<Post | null>(null);
const md = new MarkdownIt();

// 状态变量
const isLiked = ref(false);
const isDisliked = ref(false);
const isFavorited = ref(false);
const likeCount = ref(0);
const dislikeCount = ref(0);
const favoriteCount = ref(0);
const updatedScore: UpdatedScore = {
  cLikeCount: 0,
  cDislikeCount: 0,
  cFavoriteCount: 0
};

type ScoreType = -1 | 0 | 1;
// 定义更新分数的类型
interface UpdatedScore {
  cLikeCount: ScoreType;
  cDislikeCount: ScoreType;
  cFavoriteCount: ScoreType;
}

onMounted(async () => {
  try {
    // 从路由参数获取 _id 并请求文章数据
    const response = await send.getPost(route.query.postId as string);
    postData.value = response.data as Post;
    console.log(postData.value);
    if (postData.value) {
      likeCount.value = postData.value.likeCount;
      dislikeCount.value = postData.value.dislikeCount;
      favoriteCount.value = postData.value.favoriteCount;
    }
  } catch (err) {
    console.error("获取文章失败", err);
  }
});

const handleAuth = async () => {
  try {
    await auth.authenticate();
    return true;
  } catch (err) {
    ElMessageBox.confirm(
      '身份验证已过期，是否重新登陆?',
      '验证失败',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'error',
      }
    ).then(() => {
      router.push('/login');
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '跳转失败',
      });
    });
    userStore.leaveOut();
    return false;
  }
};

const updateScoreToAuth = async () => {
  if (!userStore.isLogin) {
    ElMessageBox.confirm(
      '您暂未登录,是否跳转至登录页面',
      {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'error',
      }
    ).then(() => {
      router.push('/login');
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '跳转失败',
      });
    });
    return false;
  } else {
    return handleAuth();
  }
};
// 处理点赞
const handleLike = async () => {
  if (!await updateScoreToAuth()) return;
  if (isLiked.value) {
    isLiked.value = false;
    likeCount.value--;
    updatedScore.cLikeCount = -1;
  } else {
    isLiked.value = true;
    likeCount.value++;
    updatedScore.cLikeCount = 1;
    // 如果之前点踩了，取消点踩
    if (isDisliked.value) {
      isDisliked.value = false;
      dislikeCount.value--;
      updatedScore.cDislikeCount = -1;
    }
  }
  await handleUpdateScore();
};

// 处理点踩
const handleDislike = async () => {
  if (!await updateScoreToAuth()) return;
  if (isDisliked.value) {
    isDisliked.value = false;
    dislikeCount.value--;
    updatedScore.cDislikeCount = -1;
  } else {
    isDisliked.value = true;
    dislikeCount.value++;
    updatedScore.cDislikeCount = 1;
    // 如果之前点赞了，取消点赞
    if (isLiked.value) {
      isLiked.value = false;
      likeCount.value--;
      updatedScore.cLikeCount = -1;
    }
    // 如果之前收藏了，取消收藏
    if (isFavorited.value) {
      isFavorited.value = false;
      favoriteCount.value--;
      updatedScore.cFavoriteCount = -1;
    }
  }
  await handleUpdateScore();
};

// 处理收藏
const handleFavorite = async () => {
  if (!await updateScoreToAuth()) return;
  if (isFavorited.value) {
    isFavorited.value = false;
    favoriteCount.value--;
    updatedScore.cFavoriteCount = -1;
  } else {
    isFavorited.value = true;
    favoriteCount.value++;
    updatedScore.cFavoriteCount = 1;
    // 如果之前点踩了，取消点踩
    if (isDisliked.value) {
      isDisliked.value = false;
      dislikeCount.value--;
      updatedScore.cDislikeCount = -1;
    }
  }
  const res = await handleUpdateScore();
};

const handleUpdateScore = async () => {
  try {
    const res = await update.updatePostScore({
      postId: route.query.postId as string,
      cLikeCount: updatedScore.cLikeCount,
      cDislikeCount: updatedScore.cDislikeCount,
      cFavoriteCount: updatedScore.cFavoriteCount
    });
    console.log(res);
  } catch (err) {
    ElMessage.error('更新数据失败');
    console.error('更新分数失败', err);
  } finally {
    console.log(updatedScore);
    updatedScore.cLikeCount = 0;
    updatedScore.cDislikeCount = 0;
    updatedScore.cFavoriteCount = 0;
  }
};

// 全局节流函数
let globalThrottleTimer: number | null = null;
const globalThrottle = (func: () => Promise<void>, limit: number) => {
  return async () => {
    if (!globalThrottleTimer) {
      await func();
      globalThrottleTimer = setTimeout(() => {
        globalThrottleTimer = null;
      }, limit);
    }
  };
};

// 创建全局节流后的函数
const globalThrottledHandleLike = globalThrottle(handleLike, 300);
const globalThrottledHandleDislike = globalThrottle(handleDislike, 300);
const globalThrottledHandleFavorite = globalThrottle(handleFavorite, 300);

// 计算属性，将 Markdown 内容转换为 HTML
const renderedContent = computed(() => {
  if (!postData.value) return '';
  const content = Array.isArray(postData.value.content)? postData.value.content[0] : postData.value.content;
  return md.render(content || '');
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
  padding: 0, 20px, 20px, 0;
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