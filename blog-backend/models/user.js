// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    minlength: [3, '用户名至少3个字符'],
    maxlength: [12, '用户名不能超过12个字符']
  },
  phone: {
    type: String,
    required: [true, '手机号不能为空'],
    unique: true,
    match: [/^1[3-9]\d{9}$/, '请输入有效的手机号']
  },
  password: {
    type: String,
    required: [true, '密码不能为空']
  },
  originAt: { 
    type: Date, 
    default:Date.now, 
  },
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  favoritePosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  dislikePosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

// 密码加密中间件（保持不变）
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.index({username:'text'})
module.exports = mongoose.model('User', userSchema);