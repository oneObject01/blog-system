const mongoose = require('mongoose');

// 定义评论 Schema
const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // 引用 Post 模型
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 引用 User 模型
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 创建评论模型
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;