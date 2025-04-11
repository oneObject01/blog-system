const Post = require('../models/post');
const User = require('../models/user');

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
        res.status(500).json({ error: '文章发送失败' });
    }
};

const sendPost = async (req, res) => {
    try {
        const postId = req.query.postId;
        const post = await Post.findById(postId).populate('author');
        if (!post) {
            return res.status(404).json({ error: '文章不存在' });
        }
        res.status(200).json({
            success: true,
            data: post,
            message: '文章获取成功'
        })
    }catch (error) {
        res.status(500).json({ error: '文章获取失败' });
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
        res.status(500).json({ error: '文章发送失败' });
    }
};

module.exports = {
    sendPosts,
    sendPost,
    sendPersonalPosts
};