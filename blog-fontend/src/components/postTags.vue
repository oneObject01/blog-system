<template>
    <div class="tags-container">
      <el-tag v-for="(tag, index) in tags" :key="index" :type="getTagType(index)">
        {{ tag }}
      </el-tag>
    </div>
</template>

<script setup lang="ts">
import { ElTag } from 'element-plus';

defineProps({
    tags: {
        type: Array as () => string[],
        required: true
    }
})

const getTagType = (index: number): 'success' | 'info' | 'warning' | 'danger' | 'primary' => {
  const types: ('success' | 'info' | 'warning' | 'danger' | 'primary')[] = ['success', 'info', 'warning', 'danger', 'primary'];
  const validIndex = Math.abs(index % types.length); // 确保索引为正
  return types[validIndex];
};
</script>

<style scoped>
.tags-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  flex-wrap: wrap;
}

.tags-container .el-tag{
  margin: 0 10px 10px 0;
}
</style>