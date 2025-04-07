const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');

const limitSize = 1024 * 1024 * 5;
const limitNum = 1;
const busboyParse = (req, res, next)=>{
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('multipart/form-data')) {
      const busboy = Busboy({ headers: req.headers,limits:{fileSize:limitSize,files:limitNum} });
      const formData = {};
      const uploadedFile = {};

      busboy.on('field', (fieldname, val) => {
          formData[fieldname] = val;
      });

      busboy.on('file', (fieldname, file, info) => {
          const { mimeType } = info;
          const filename = String(Date.now() + '-' + Math.round(Math.random() * 1E9))
          console.log(filename)
          const saveTo = path.join(process.cwd(), 'uploads', filename);
          if(['image/jpeg', 'image/png'].includes(mimeType)){
            const writeStream = fs.createWriteStream(saveTo);
            file.pipe(writeStream).on('error', (err) => {
                console.error('文件写入错误:', err);
                res.status(500).json({
                    success: false,
                    message: '文件写入失败'
                });
            });
  
            file.on('end', () => {
                writeStream.end();
                Object.assign(uploadedFile, {
                    fieldname,
                    filename,
                    mimeType,
                    path: saveTo
                });
            });
          }else{
            res.status(400).json({
                success: false,
                message: '仅支持上传png或jpg格式的图片'
            });
          }
      });

      busboy.on('finish', () => {
          req.body = formData;
          req.file = uploadedFile;
          next();
      });

      busboy.on('error', (err) => {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
                success: false,
                message: '文件大小超出限制'
            });
        }else if(err.code === 'LIMIT_FILE_COUNT'){
            res.status(400).json({
                success: false,
                message: '文件数量超出限制'
            });
        }
      });

      req.pipe(busboy);
  } else {
      next();
  }
};

module.exports = busboyParse;