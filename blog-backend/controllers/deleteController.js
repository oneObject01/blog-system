const Post = require('../models/post');

const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.query.postId);
    console.log(req.query)
    console.log(post);
    if (!post) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }
    res.json({ success: true, code: 200, message: '文章删除成功' });
    console.log('文章删除成功');
    console.log(req.params.id);
  } catch (error) {
    res.status(500).json({
      success: false, 
      code: 500, 
      message: '服务器错误，请稍后再试', 
      error: error.message 
    });
  }
};

module.exports = { deletePost };