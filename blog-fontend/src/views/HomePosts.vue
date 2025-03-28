<template>
      <!-- 内容区 -->
      <div class="home-posts">
        <h1>最新文章</h1>
        <div class="article-list">
          <!-- 文章卡片 -->
          <el-card 
            v-for="item in postIntroduct" 
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
              }
            })"
          >
            <postCard :postIntroduct="item"/>
          </el-card>
        </div>
      </div>
</template>

<script setup lang="ts">
import postCard from '@/components/postCard.vue'
import { onMounted } from 'vue' 
import send from '@/request/apis/send'
import { ref } from 'vue'
import router from '@/router'
import { type Post,type User} from '@/types/type'


const postIntroduct = ref<Post[]>([])

onMounted(async ()=>{
  try{
    const response = await send.getPosts()
    console.log("获取的文章简介",response)
    postIntroduct.value = response.data
  }catch(err){
    console.error("获取文章失败",err)
  }
})
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
    cursor:pointer;
  }
  

</style>