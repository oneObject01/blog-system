import http from '@/request/http';

export default{
    getPosts(keyword:string="",page: number = 1){
        return http.get('/send/post', {
            params: {
                keyword,
                page
            }
        })
    },
    getPersonalPosts(page: number = 1){
        return http.get('/send/personal', {
            params: {
                page
            }
        })
    }
}