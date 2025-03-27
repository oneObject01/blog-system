const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 字段中文映射
const fieldMap = {
    username: '用户名',
    phone: '手机号',
    password: '密码',
    confirmPassword: '确认密码'
  };
const register = async (req, res) => {
    try {
        const { username, phone, password, confirmPassword } = req.body;
    
        // 基础验证
        const requiredFields = { username, phone, password, confirmPassword };
        for (const [field, value] of Object.entries(requiredFields)) {
          if (!value) return res.status(400).json({ 
            success: false, 
            message: `${fieldMap[field]}不能为空` 
          });
        }
    
        if (password !== confirmPassword) {
          return res.status(400).json({ success: false, message: '两次密码不一致' });
        }
    
        // 检查用户名和手机号唯一性
        const [existingUser, existingPhone] = await Promise.all([
          User.findOne({ username }),
          User.findOne({ phone })
        ]);
    
        if (existingUser) {
          return res.status(409).json({ success: false, message: '用户名已被使用' });
        }
    
        if (existingPhone) {
          return res.status(409).json({ success: false, message: '手机号已注册' });
        }
    
        // 创建用户
        const newUser = new User({ username, phone, password });
        await newUser.save();
    
        res.status(201).json({
          success: true,
          message: '注册成功',
          user: { username: newUser.username, phone: newUser.phone }
        });
    
      } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
          const field = Object.keys(error.keyPattern)[0];
          return res.status(409).json({
            success: false,
            message: `${fieldMap[field]}已存在`
          });
        }
    
        // 处理数据验证错误
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(e => e.message).join(', ');
          console.error('数据验证错误:', messages);
          return res.status(400).json({ 
            success: false, 
            message: messages 
          });
        }
    
        // 其他未知错误
        console.error('注册错误:', error);
        res.status(500).json({ 
          success: false, 
          message: '服务器错误，请稍后再试' 
        });
      }
};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const requiredFields = { phone, password };
        for (const [field, value] of Object.entries(requiredFields)) {
          if (!value) return res.status(400).json({ 
            success: false, 
            message: `请输入${fieldMap[field]}` 
          });
        }
    
        const user = await User.findOne({ phone });
    
        if (!user) {
          return res.status(401).json({ success: false, message: '手机号或密码错误' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: '手机号或密码错误' });
        }
    
        // 密码验证通过，返回成功信息
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ success: true, message: '登录成功', token ,data:user.username});
      }catch(error){
          console.error('登录错误:', error);
          return res.status(500).json({ success: false, message: '服务器错误，请稍后再试' });
      }
}

const toAuth = async (req, res) => {
  try {
      const { userId } = req;
  
      const user = await User.findById({ userId });
  
      if (!user) {
        return res.status(401).json({ success: false, message: '身份验证失败，请重新登录！'});
      }
      // 验证通过，返回成功信息
      return res.status(200).json({ success: true, message: '验证成功' ,data:user.username});
    }catch(error){
        console.error('登录错误:', error);
        return res.status(500).json({ success: false, message: '服务器错误，请稍后再试' });
    }
}

const authController = {
    register,
    login,
    toAuth
}

module.exports = authController;