const express = require('express')
const router = express.Router();
const send = require('../controllers/sendController')

router.get('/post', send.sendPosts)

module.exports = router