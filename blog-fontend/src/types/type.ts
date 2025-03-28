export interface Post {
    _id: string | number; // 根据实际情况确定类型，如 MongoDB 的 `_id` 通常为字符串
    abstract : string;
    title: string;
    content: string;
    author: User;
    createdAt: Date;
}

export interface User{
    _id: string | number;
    username: string;
    phone: string;
    password: string;
}

 
  