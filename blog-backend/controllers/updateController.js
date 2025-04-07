const Image = require('../models/img');
const Post = require('../models/post');
const User = require('../models/user');

const updateImage = async (req, res) => {
    try {
      // 检查文件是否上传成功
      if (!req.file) {
        return res.status(400).json({ success:false,code: 400, message: '未成功获取上传的图片' });
      }
  
      // 保存图片信息到 MongoDB
      const image = new Image({
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype
      });
      await image.save();
  
      // 返回图片访问 URL（根据实际部署调整路径）
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        success: true, 
        code: 200, 
        data: { url: imageUrl } 
      });
    } catch (error) {
      res.status(500).json({
        success: false, 
        code: 500, 
        message: '服务器内部错误', 
        error: error.message 
      });
    }
  };

const updatePost = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    const post = await Post({...req.body.articleForm,author:req.userId});
    post.save();
    res.json({ success: true, code: 200, message: '文章发布成功' });
  }catch (error) {
    res.status(500).json({
      success: false, 
      code: 500, 
      message: '服务器内部错误', 
      error: error.message 
    });
  }
};

module.exports = { updateImage,updatePost};