const multer = require('multer');
// 存储配置：指定图片存储目录和文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // 需提前创建 `uploads` 目录
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.mimetype.split('/')[1];
      cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
    }
  });
  
  // 格式过滤：仅允许 png/jpg
  const fileFilter = (req, file, cb) => {
    if (['image/png', 'image/jpeg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持上传 PNG 或 JPG 格式的图片'), false);
    }
  };
  
const upload = multer({ storage, fileFilter });
module.exports = upload;