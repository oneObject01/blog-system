const Post = require('../models/post');
const User = require('../models/user');

const sendPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({createAt:1}).limit(10).populate('author');
    res.status(200).json({success:true,data:posts,message:'文章发送成功'});
  } catch (error) {
    res.status(500).json({ error: '文章发送失败' });
  }
};

module.exports = {
  sendPosts
};