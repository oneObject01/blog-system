export interface Post {
    _id: string | number; // 根据实际情况确定类型，如 MongoDB 的 `_id` 通常为字符串
    abstract : string;
    title: string;
    content: string;
    author: User;
    createdAt: Date;
    tags:string[];
    likeCount: number;
    dislikeCount: number;
    favoriteCount:number;
}

// ../types/type.ts
export interface Comment {
    _id: string;
    author: {
      _id: string;
      username: string;
    };
    postId: string;
    content: string;
    createdAt: Date;
}

export interface User{
    _id: string | number;
    username: string;
    phone: string;
    password: string;
}


 
  