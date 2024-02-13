const multer = require('multer');
const uniqid = require('uniqid');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Adjust path as needed
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + uniqid() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;