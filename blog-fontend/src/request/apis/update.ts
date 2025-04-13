import http from '@/request/http'

export default {
    updateImg(data: any){
        return http.post('/update/image', data)
    },
    updatePost(data: any){
        return http.post('/update/post', data)
    },
    updatePostScore(data: any){
        return http.post('/update/score', data)
    },
    updateComment(data: any){
        return http.post('/update/comment', data)
    },
  }