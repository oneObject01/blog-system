const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    abstract:{
        type: String,
        default: '',
    },
    tags: [{
        type: String,
        required: true
    }],
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    dislikeCount: {
        type: Number,
        default: 0
    },
    collectionCount: {
        type: Number,
        default: 0
    },
    createdAt: { type: Date, default: Date.now }
})

postSchema.index({ title: 'text', abstract: 'text',content: 'text',tags: 'text' });

const Post = mongoose.model('Post', postSchema)
module.exports = Post