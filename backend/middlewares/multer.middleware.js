import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure 'uploads/' exists
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // keep original filename
  }
  
});

const upload = multer({ storage });

export default upload;
