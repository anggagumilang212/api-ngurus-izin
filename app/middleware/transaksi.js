const multer = require('multer');
const uniqid = require('uniqid');
const path = require('path');

const TYPE_IMAGE = {
  "image/jpg":"jpg",
  "image/jpeg":"jpeg",
  "image/png":"png",
  "image/webp":"webp",
  "image/webm":"webm",
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/images/transaksi'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + uniqid() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload.fields([
  { name: 'ktp_satu', maxCount: 1 },
  { name: 'ktp_dua', maxCount: 1 },
  { name: 'npwp_satu', maxCount: 1 },
  { name: 'npwp_dua', maxCount: 1 }
]);
