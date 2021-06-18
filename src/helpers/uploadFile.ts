import multer from 'multer';
import fs from 'fs';
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `images/${req.query.userId}`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export default multer({
  storage: fileStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
}).single('image');
