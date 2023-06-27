import multer, { MulterError } from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../back_src', 'public/images'))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = Date.now() + ext;

    if (['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].indexOf(file.mimetype) === -1) {
      return cb(new MulterError('LIMIT_UNEXPECTED_FILE'), filename);
    }

    cb(null, filename);
  }
})

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } }); // set file size limit to 5MB

export default upload;
