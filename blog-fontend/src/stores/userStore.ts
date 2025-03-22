import {defineStore} from 'pinia'
import {ElMessage} from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    username: '游客'
  }),
  actions: {
    comeIn(name:string) {
        this.username = name
        this.isLogin = true
        ElMessage.success(`欢迎回来，${name}`)
    },
    leaveOut() {
        this.isLogin = false
        this.username = '游客'
        localStorage.removeItem('ACCESS_TOKEN')
        ElMessage.success(`已退出登录`)
    },
    refresh(){
        if(localStorage.getItem('username')&&localStorage.getItem('ACCESS_TOKEN')){
            this.isLogin = true
            this.username = localStorage.getItem('username') as string
        }else{
            this.isLogin = false
            this.username = '游客'
        }
    }

  },
})