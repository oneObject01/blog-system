const express = require('express')
const router = express.Router();
const update = require('../controllers/updateController')
const upload = require('../middlewares/multer')

router.post('/image', upload.single('files[0]'),update.updateImage);

module.exports = router;