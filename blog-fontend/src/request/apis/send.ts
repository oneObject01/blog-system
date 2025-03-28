import http from '@/request/http';

export default{
    getPosts(){
        return http.get('/send/post')
    }
}