
module.exports = app => {


    const upload = require('../helpers/uploader');
    const uploadController = require('../controllers/uploadController');
var router = require("express").Router();

router.get('/upload',                                           uploadController.index);
router.post('/upload-single',   upload.single('file'),    uploadController.uploadSingle);
router.post('/upload-multiple', upload.array('files', 5), uploadController.uploadMultiple);

/* ------------------------ upload and error handling ----------------------- */
router.post('/upload-single-v2',                          uploadController.uploadSingleV2);
app.use('/api/upload', router);

};