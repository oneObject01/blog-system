const express = require('express')
const router = express.Router();
const remove = require('../controllers/deleteController')
const authenticate = require('../middlewares/authenticates')

router.get('/post', authenticate,remove.deletePost)

module.exports = router