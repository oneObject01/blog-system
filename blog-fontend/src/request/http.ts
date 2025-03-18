import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type AxiosError,
    type InternalAxiosRequestConfig
  } from 'axios'
  import { ElMessage } from 'element-plus'
  import router from '@/router'
  
  // 定义后端响应数据格式
  interface ApiResponse<T = any> {
    code: number
    data: T
    message?: string
    [key: string]: any // 允许其他扩展字段
  }
  
  // 创建 Axios 实例
  const http: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
  
  // 请求拦截器
  http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 添加认证 token
      const token = localStorage.getItem('ACCESS_TOKEN')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )
  
  // 响应拦截器
  http.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      // 处理二进制数据
      if (response.request.responseType === 'blob') {
        return response.data
      }
  
      // 处理业务逻辑
      const { success,data,message: msg, token} = response.data
      if (success === true) {
        if (token) {
          localStorage.setItem('ACCESS_TOKEN', token)
        }
        return data
      } else {
        ElMessage.error(msg || '操作失败')
        return Promise.reject(new Error(msg || '请求错误'))
      }
    },
    (error:  AxiosError<ApiResponse>) => {
      // 错误处理
      let errMessage = '请求异常'

      if (error.response?.data?.message) {
        errMessage = error.response.data.message
      } 
      else if (error.response) {
        switch (error.response.status) {
          case 401:
            errMessage = '身份认证失败'
            localStorage.removeItem('ACCESS_TOKEN')
            router.replace('/login')
            break
          case 403:
            errMessage = '没有操作权限'
            break
          case 404:
            errMessage = '资源不存在'
            break
          case 409:
            errMessage = '资源冲突'
            break
          case 500:
            errMessage = '服务器内部错误'
            break
        }
      } else if (error.message.includes('timeout')) {
        errMessage = '请求超时'
      } else if (error.message.includes('Network Error')) {
        errMessage = '网络连接异常'
      }
  
      ElMessage.error(errMessage)
      return Promise.reject(error)
    }
  )
  
  export default http