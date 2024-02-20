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
    // const ext = TYPE_IMAGE[file.mimetype] 
    cb(null, Date.now() + uniqid() + path.extname(file.originalname));
  },
});
const ktpSatuMiddleware = multer({ storage: storage }).single('ktp_satu', (err) => {
  if (err) {
    return next(err);
  }
});
const ktpDuaMiddleware = multer({ storage: storage }).single('ktp_dua', (err) => {
  if (err) {
    return next(err);
  }
});
const npwpSatuMiddleware = multer({ storage: storage }).single('npwp_satu', (err) => {
  if (err) {
    return next(err);
  }
});
const npwpDuaMiddleware = multer({ storage: storage }).single('npwp_dua', (err) => {
  if (err) {
    return next(err);
  }
});

module.exports = {
  ktpSatuMiddleware,
  ktpDuaMiddleware,
  npwpSatuMiddleware,
  npwpDuaMiddleware,
};