<template>
  <div class="home-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <h2>菜单</h2>
      <el-menu
        default-active="1"
        class="personal-sidebar"
        mode="vertical"
      >
        <el-menu-item index="1" @click="$router.push({path:'/personal'})">我的文章</el-menu-item>
        <el-menu-item index="2" @click="$router.push({path:'/personal/likes'})">我的点赞</el-menu-item>
        <el-menu-item index="3" @click="$router.push({path:'/personal/favorites'})">我的收藏</el-menu-item>
      </el-menu>
    </div>
    <!-- 内容区 -->
    <router-view> </router-view>
  </div>
</template>

<script setup lang="ts">

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

.sidebar .el-menu-item {
  border-bottom: #ccc solid 1px;
}

.sidebar .el-menu-item:last-child{
  border-bottom: none;
}

.personal-sidebar {
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>