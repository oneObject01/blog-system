const express = require('express')
const router = express.Router();
const send = require('../controllers/sendController')
const authenticate = require('../middlewares/authenticates')

router.get('/posts', send.sendPosts)
router.get('/post', send.sendPost)
router.get('/personal', authenticate, send.sendPersonalPosts)
router.get('/userMark',authenticate,send.sendUserMark)

module.exports = router