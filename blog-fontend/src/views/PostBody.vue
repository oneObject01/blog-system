<template>
  <el-button class="back-button" :icon="ArrowLeftBold" @click="goBack" circle />
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
    <!-- 评论输入框和提交按钮 -->
    <div class="comment-input">
      <el-input
        v-model="commentContent"
        placeholder="请输入评论内容"
        type="textarea"
        :rows="3"
      ></el-input>
      <div class="submit-button">
        <el-button @click="submitComment">提交评论</el-button>
      </div>
    </div>
    <!-- 评论列表 -->
    <div class="comment-list">
      <el-card v-for="(comment, index) in comments" :key="index" class="comment-card">
        <div class="comment-meta">
          <span>评论者：{{ comment.author.username }}</span>
          <span>评论时间：{{ formatDate(comment.createdAt) }}</span>
        </div>
        <div class="comment-content">
          {{ comment.content }}
        </div>
      </el-card>
      <div v-if="loadingComments" class="loading">加载中...</div>
      <div v-if="!hasMoreComments && comments.length > 0" class="no-more">没有更多评论了</div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import MarkdownIt from'markdown-it';
import { computed, onMounted, ref,onUnmounted } from 'vue';
import 'github-markdown-css/github-markdown.css';
import postTags from '../components/postTags.vue';
import { StarFilled, CaretTop, CaretBottom } from '@element-plus/icons-vue';
import send from '../request/apis/send';
import update from '../request/apis/update';
import { type Post, type Comment } from '../types/type';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import auth from '../request/apis/auth';
import { useUserStore } from '../stores/userStore';
import { ArrowLeftBold } from '@element-plus/icons-vue';

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

// 评论相关变量
const commentContent = ref('');
const comments = ref<Comment[]>([]);
const loadingComments = ref(false);
const commentPage = ref(1);
const hasMoreComments = ref(true);
const commentPageSize = 10;
const commentDisabled = ref(false);

type ScoreType = -1 | 0 | 1;
// 定义更新分数的类型
interface UpdatedScore {
  cLikeCount: ScoreType;
  cDislikeCount: ScoreType;
  cFavoriteCount: ScoreType;
}

// 格式化日期函数
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}--${hours}:${minutes}`;
};

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
  try {
    if (userStore.isLogin) {
      const res = await send.getUserMark(route.query.postId as string);
      console.log(res);
      if (res.data.isLiked) {
        isLiked.value = true;
      }
      if (res.data.isDisliked) {
        isDisliked.value = true;
      }
      if (res.data.isFavorited) {
        isFavorited.value = true;
      }
    }
  } catch (err) {
    console.error("获取用户标记失败", err);
  }
  await loadComments();
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
});

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
})
const goBack = () => {
  router.go(-1);
};

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

// 提交评论
const submitComment = async () => {
  if (!await updateScoreToAuth()) return;
  if (commentContent.value.trim() === '') {
    ElMessage.warning('请输入评论内容');
    return;
  }
  try {
    const res = await update.updateComment({
      postId: route.query.postId as string,
      content: commentContent.value
    });
    commentContent.value = '';
    ElMessage.success('评论提交成功');
    window.location.reload() 
  } catch (err) {
    ElMessage.error('评论提交失败');
    console.error('评论提交失败', err);
  }
};

// 加载评论
const loadComments = async () => {
  if (loadingComments.value || !hasMoreComments.value || commentDisabled.value) return;
  loadingComments.value = true;
  try {
    const res = await send.getComments(route.query.postId as string, commentPage.value);
    const newComments = res.data as Comment[];
    if (newComments.length > 0) {
      comments.value = [...comments.value, ...newComments];
      hasMoreComments.value = newComments.length === commentPageSize;
      commentPage.value++;
    } else {
      hasMoreComments.value = false;
    }
  } catch (err) {
    console.error("获取评论列表失败", err);
    ElMessage({
      type: 'error',
      message: '评论加载失败',
    });
    commentDisabled.value = true;
    setTimeout(() => {
      commentDisabled.value = false;
    }, 2000);
  } finally {
    loadingComments.value = false;
  }
};

// 滚动置底加载更多文章
const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  
  // 当距离底部小于100px时触发加载
  if (scrollHeight - scrollTop - clientHeight < 100) {
    loadComments()
  }
}
</script>

<style scoped>
.back-button{
  position: fixed;
  top:90px;
  left:150px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
}

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
  margin-top: 30px;
  border-top: 1px solid #eee;
}

.action-item {
  margin-top: 30px;
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

.comment-input {
  margin-top: 30px;
}

.comment-input .submit-button { 
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}


.comment-list {
  margin-top: 30px;
  padding: 30px 0;
  border-top: 1px solid #eee;
}

.comment-card {
  margin-bottom: 20px; /* 增加评论卡片之间的间距 */
  border-radius: 8px; /* 增加圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 增加阴影 */
}

.comment-meta {
  display: flex;
  justify-content: space-between; /* 评论元信息左右分布 */
  align-items: center;
  margin-bottom: 8px; /* 增加元信息和评论内容之间的间距 */
  color: #777; /* 调整元信息颜色 */
  font-size: 14px; /* 调整元信息字号 */
}

.comment-author {
  font-weight: bold; /* 评论者姓名加粗 */
}

.comment-time {
  font-style: italic; /* 评论时间斜体 */
}

.comment-content {
  font-size: 16px; /* 调整评论内容字号 */
  line-height: 1.6; /* 调整行高，提高可读性 */
}

.comment-list .no-more{
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>    