import http from '@/request/http';

export default {
  login(data: any) {
    return http.post('/auth/login', data);
  },
  register(data: any) {
    return http.post('/auth/register', data);
  }
}