import http from '@/request/http'

export default {
    updateImg(data: any){
        return http.post('/update/image', data)
    }
  }