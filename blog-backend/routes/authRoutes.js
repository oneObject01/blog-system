const express = require('express')
const router = express.Router();
const auth = require('../controllers/authController');
const authenticate = require('../middlewares/authenticates')

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/toAuth',authenticate,auth.toAuth)

module.exports = router;