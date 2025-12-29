import multer from 'multer';

const storage = multer.memoryStorage(); // store in memory as buffer

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

export default upload;
