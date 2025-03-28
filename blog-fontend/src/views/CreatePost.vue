<template>
  <div class="create-article-page">
    <el-form :model="articleForm" ref="formRef" label-width="120px">
      <!-- 标题部分 -->
      <el-form-item label="文章标题">
        <el-input
          v-model="articleForm.title"
          placeholder="请输入文章标题"
          :maxlength="50"
          @input="updateTitleLength"
        />
        <span class="counter">{{ titleLength }}/50</span>
      </el-form-item>

      <!-- 摘要部分 -->
      <el-form-item label="文章摘要">
        <el-input
          v-model="articleForm.abstract"
          placeholder="请输入文章摘要"
          type="textarea"
          :maxlength="300"
          @input="updateAbstractLength"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
        <span class="counter">{{ abstractLength }}/300</span>
      </el-form-item>

      <!-- Markdown 编辑器 -->
      <el-form-item label="文章内容">
        <md-editor
          v-model="articleForm.content"
          :maxlength="3000"
          :style="{ height: '500px' }"
          @onChange="updateContentChange"
          @onUploadImg="handleUploadImg"
          placeholder="请输入文章内容（支持 Markdown 语法）"
          :no-upload-img="false"
          preview-theme="github"
        />
        <span class="counter">{{ contentLength }}/3000</span>
      </el-form-item>

      <el-form-item>
        <el-button 
          type="primary" 
          @click="handleSubmit"
          :loading="submitting"
        >
          {{ submitting ? '提交中...' : '立即提交' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance } from 'element-plus';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ElMessage } from 'element-plus';
import update from '@/request/apis/update';

interface ArticleForm {
  title: string;
  abstract: string;
  content: string;
}

// 响应式数据
const articleForm = reactive<ArticleForm>({
  title: '',
  abstract: '',
  content: ''
});

// 表单引用
const formRef = ref<FormInstance | null>(null);
const submitting = ref(false);

// 字数统计
const titleLength = ref(0);
const abstractLength = ref(0);
const contentLength = ref(0);

// 处理图片上传
const handleUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  console.log(callback)
  // 校验图片格式
  const validFormats = ['image/png', 'image/jpeg'];
  const validFiles = files.filter(file => validFormats.includes(file.type));

  if (validFiles.length < files.length) {
    ElMessage.warning('仅支持上传 PNG 或 JPG 格式的图片');
    return;
  }

  // 创建表单数据
  const formData = new FormData();
  validFiles.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  try {
    // 发送 HTTP 请求
    const reponse = await update.updateImg(formData);
    const data = reponse.data;
    // 处理后端响应
    if (data && data.url) {
      const url = `http://localhost:3000${data.url}`;
      callback([url]);
    } else {
      ElMessage.error('后端返回的响应格式不正确');
    }
  } catch (error) {
    //错误处理
    console.error('图片上传失败:', error);
    ElMessage.error('图片上传失败，请重试');
  }
};
// 更新标题字数
const updateTitleLength = () => {
  titleLength.value = articleForm.title.length;
};

// 更新摘要字数
const updateAbstractLength = () => {
  abstractLength.value = articleForm.abstract.length;
};
// 更新内容长度
const updateContentChange = (newContent: string) => {
  articleForm.content = newContent;
  contentLength.value = newContent.length;
};

// 提交处理
const handleSubmit = async () => {
  try {
    submitting.value = true;
    
    // 简单表单验证
    if (!articleForm.title.trim()) {
      return ElMessage.error('请输入文章标题');
    }
    if (!articleForm.content.trim()) {
      return ElMessage.error('请输入文章内容');
    }

    // 这里添加实际提交逻辑
    console.log('提交数据:', {
      ...articleForm,
      contentLength: contentLength.value
    });

    await update.updatePost({articleForm});

    ElMessage.success('提交成功！');
    // 清空表单
    Object.assign(articleForm, {
      title: '',
      abstract: '',
      content: ''
    });
  } catch (err) {
    ElMessage.error('提交失败，请重试');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.create-article-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.el-form-item {
  margin-bottom: 24px;
}

.counter {
  display: inline-block;
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}

/* 编辑器样式调整 */
.md-editor {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: #c0c4cc;
  }
  
  &--active {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
}

/* 预览图片样式 */
:deep(.md-editor-preview) img {
  max-width: 80%;
  display: block;
  margin: 15px auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>