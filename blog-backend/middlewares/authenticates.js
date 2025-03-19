const jwt = require('jsonwebtoken');

// 验证令牌中间件
const authenticate = (req, res, next) => {
    let token;
    try {
        // 先尝试从请求头中获取 Token
        if (req.header('Authorization')) {
            console.log('req.header:', req.header('Authorization'));
            token = req.header('Authorization').split(' ')[1];
        } else {
            // 若请求头中没有 Token，则尝试从 Cookie 中获取
            token = req.cookies.token;
        }

        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.userId };
        next();
    } catch (error) {
        res.status(401).send({ message: 'Authentication failed' });
    }
};

module.exports = {
    authenticate
};