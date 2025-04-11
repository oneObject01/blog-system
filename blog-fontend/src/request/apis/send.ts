import http from '@/request/http';

export default{
    getPosts(keyword:string="",tags:string[]=[],page: number = 1){
        return http.get('/send/posts', {
            params: {
                keyword,
                tags,
                page,
            }
        })
    },
    getPersonalPosts(page: number = 1){
        return http.get('/send/personal', {
            params: {
                page
            }
        })
    },
    getPost(postId: string|number ){
        return http.get('/send/post', {
            params: {
                postId
            }
        })
    },
}