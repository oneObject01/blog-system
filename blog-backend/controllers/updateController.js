const Image = require('../models/img');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const mongoose = require('mongoose');

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
        message: '服务器错误，请稍后再试', 
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
      message: '服务器错误，请稍后再试', 
      error: error.message 
    });
  }
};

const updateScore = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
      const { postId, cLikeCount, cDislikeCount, cFavoriteCount } = req.body;
      const user = await User.findById(req.userId).session(session);
      const post = await Post.findById(postId).session(session);

      if (!post) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ success: false, message: '文章不存在' });
      }
      if (!user) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ success: false, message: '用户不存在' });
      }

      const { Types: { ObjectId } } = require('mongoose');
      if (!ObjectId.isValid(postId)) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ message: "无效的文章 ID" });
      }

      if (cLikeCount !== undefined) {
          // 检查更新后点赞数是否为负数
          if (post.likeCount + cLikeCount < 0) {
              await session.abortTransaction();
              session.endSession();
              return res.status(400).json({ message: "点赞数不能为负数" });
          }
          post.likeCount += cLikeCount;
          if (cLikeCount === 1) {
              await User.updateOne(
                  { _id: req.userId },
                  { $addToSet: { likedPosts: postId } },
                  { session }
              );
          } else if (cLikeCount === -1) {
              await User.updateOne(
                  { _id: req.userId },
                  { $pull: { likedPosts: postId } },
                  { session }
              );
          }
      }

      if (cDislikeCount !== undefined) {
          // 检查更新后点踩数是否为负数
          if (post.dislikeCount + cDislikeCount < 0) {
              await session.abortTransaction();
              session.endSession();
              return res.status(400).json({ message: "点踩数不能为负数" });
          }
          post.dislikeCount += cDislikeCount;
          if (cDislikeCount === 1) {
              await User.updateOne(
                  { _id: req.userId },
                  { $addToSet: { dislikePosts: postId } },
                  { session }
              );
          } else if (cDislikeCount === -1) {
              await User.updateOne(
                  { _id: req.userId },
                  { $pull: { dislikePosts: postId } },
                  { session }
              );
          }
      }

      if (cFavoriteCount !== undefined) {
          // 检查更新后收藏数是否为负数
          if (post.favoriteCount + cFavoriteCount < 0) {
              await session.abortTransaction();
              session.endSession();
              return res.status(400).json({ message: "收藏数不能为负数" });
          }
          post.favoriteCount += cFavoriteCount;
          if (cFavoriteCount === 1) {
              await User.updateOne(
                  { _id: req.userId },
                  { $addToSet: { favoritePosts: postId } },
                  { session }
              );
          } else if (cFavoriteCount === -1) {
              await User.updateOne(
                  { _id: req.userId },
                  { $pull: { favoritePosts: postId } },
                  { session }
              );
          }
      }

      await post.save({ session });
      await user.save({ session });
      await session.commitTransaction();
      session.endSession();
      res.json({ success: true, code: 200, message: '文章点赞成功', data: { cLikeCount, cDislikeCount, cFavoriteCount } });
  } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      res.status(500).json({
          success: false,
          code: 500,
          message: '服务器错误，请稍后再试',
          error: error.message
      });
  }
};
  

// 新增的 updateComment 函数
const updateComment = async (req, res) => {
  try {
      const { postId, content } = req.body;
      const user = await User.findById(req.userId);
      const post = await Post.findById(postId);

      if (!user) {
          return res.status(404).json({ success: false, message: '用户不存在' });
      }
      if (!post) {
          return res.status(404).json({ success: false, message: '文章不存在' });
      }

      const comment = new Comment({
          post: postId,
          author: req.userId,
          content: content
      });

      await comment.save();
      res.json({ success: true, code: 200, message: '评论提交成功', data: comment });
  } catch (error) {
      res.status(500).json({
          success: false,
          code: 500,
          message: '服务器错误，请稍后再试',
          error: error.message
      });
      console.error(error);
  }
};
module.exports = { updateImage,updatePost,updateScore,updateComment};