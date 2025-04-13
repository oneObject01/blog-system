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
    getPersonalLikes(page: number = 1){
        return http.get('/send/personalLikes', {
            params: {
                page
            }
        })
    },
    getPersonalFavorites(page: number = 1){
        return http.get('/send/personalFavorites', {
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
    getUserMark(postId: string|number ){
        return http.get('/send/userMark', {
            params: {
                postId
            }
        })
    },
    getComments(postId: string|number, page: number = 1){
        return http.get('/send/comments', {
            params: {
                postId,
                page
            }
        })
    }
}