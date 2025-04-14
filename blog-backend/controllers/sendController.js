const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

const limit = 10;

const findPostsByPage = async (page, limit = 10, query = {}) => {
    const skip = (page - 1) * limit;
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author');
    return posts;
};

const findCommentsByPage = async (page, limit = 10, query = {}) => {
    const skip = (page - 1) * limit;
    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author');
    return comments;
};

// 通用函数，根据操作类型获取用户对应的文章列表
const sendUserActionPosts = async (req, res, actionField) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        const postIds = user[actionField];
        console.log(postIds);
        const posts = await findPostsByPage(page, limit, { _id: { $in: postIds } });
        console.log(posts);
        res.status(200).json({
            success: true,
            data: posts,
            message: `${actionField} 文章发送成功`
        });
    } catch (error) {
        res.status(500).json({ error: `服务器错误，请稍后再试` });
    }
};

const sendPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const keyword = req.query.keyword || '';
        const tags = req.query.tags || [];

        let query = {};
        let conditions = [];

        if (keyword) {
            // 根据 title 字段进行模糊匹配
            const titleQuery = { title: { $regex: keyword, $options: 'i' } };

            // 根据 author 的 username 字段进行模糊匹配
            const users = await User.find({ username: { $regex: keyword, $options: 'i' } });
            const userIds = users.map(user => user._id);
            let authorQuery = {};
            if (userIds.length > 0) {
                authorQuery = { author: { $in: userIds } };
            }

            if (Object.keys(titleQuery).length > 0) {
                conditions.push(titleQuery);
            }
            if (Object.keys(authorQuery).length > 0) {
                conditions.push(authorQuery);
            }
        }

        if (tags.length > 0) {
            // 确保文章的 tags 包含所有用户选择的 tags
            const tagQuery = { tags: { $all: tags } };
            conditions.push(tagQuery);
        }

        if (conditions.length > 0) {
            query = {
                $and: conditions
            };
        }

        const posts = await findPostsByPage(page, limit, query);
        res.status(200).json({
            success: true,
            data: posts,
            message: '文章发送成功'
        });
    } catch (error) {
        res.status(500).json({ error: '服务器错误，请稍后再试' });
    }
};

const sendPost = async (req, res) => {
    try {
        const postId = req.query.postId;
        const post = await Post.findById(postId).populate('author');
        if (!post) {
            return res.status(404).json({ error: '文章获取失败' });
        }
        res.status(200).json({
            success: true,
            data: post,
            message: '文章获取成功'
        })
    }catch (error) {
        res.status(500).json({ error: '服务器错误，请稍后再试' });
    }
}

const sendPersonalPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const posts = await findPostsByPage(page, limit, { author: req.userId });

        res.status(200).json({
            success: true,
            data: posts,
            message: '文章发送成功'
        });
    } catch (error) {
        res.status(500).json({ error: '服务器错误，请稍后再试' });
    }
};

const sendUserMark = async (req, res) => {
    try{
        const postId = req.query.postId;
        const user = await User.findById(req.userId);
        let isLiked = false, isDisliked = false, isFavorited = false;
        if (!user) {
            return res.status(404).json({ success: false, message: '用户不存在' });
        }
        if (user.likedPosts.includes(postId)) {
            isLiked = true;
        }else{
            isLiked = false;
        }
        if(user.dislikePosts.includes(postId)){
            isDisliked = true;
        }else{
            isDisliked = false;
        }
        if(user.favoritePosts.includes(postId)){
            isFavorited = true;
        }else{
            isFavorited = false;
        }
        res.status(200).json({
            success: true,
            data: {
                isLiked,
                isDisliked,
                isFavorited
            },
            message: '文章发送成功'
        });
    }catch (error) {
        console.error("错误信息",error)
        res.status(500).json({ error: '服务器错误，请稍后再试' });
    }
}

// 发送用户点赞的文章
const sendLikedPosts = async (req, res) => {
    await sendUserActionPosts(req, res, 'likedPosts');
};

// 发送用户收藏的文章
const sendFavoritePosts = async (req, res) => {
    await sendUserActionPosts(req, res, 'favoritePosts');
};

const sendComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const postId = req.query.postId;

        if (!postId) {
            return res.status(400).json({ error: '文章 ID 不能为空' });
        }

        const comments = await findCommentsByPage(page, limit, { post: postId });

        res.status(200).json({
            success: true,
            data: comments,
            message: '评论加载成功'
        });
    } catch (error) {
        res.status(500).json({ error: '评论加载失败' });
    }
};
module.exports = {
    sendPosts,
    sendPost,
    sendPersonalPosts,
    sendUserMark,
    sendLikedPosts,
    sendFavoritePosts,
    sendComments,
};