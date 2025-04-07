import http from '../http'

export default{
    deletePost(postId: string|number ){
        return http.get('/delete/post', {
            params: {
                postId
            }
        })
    }
}