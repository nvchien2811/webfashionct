var express = require('express');
var router = express.Router();
var controller = require('../Controller/upload.controller');

// For Single image upload
router.post('/uploadImageProduct',controller.imageUploadProduct.single('image'), controller.uploadImage,(error, req, res, next) => {
    res.status(400).json({ error: error.message })
})
// For Single image upload
router.post('/uploadImageProductDescription',controller.imageUploadProductDescription.single('image'), controller.uploadImage,(error, req, res, next) => {
    res.status(400).json({ error: error.message })
})
// For Single image upload
router.post('/uploadImageAvatar',controller.imageUploadAvatar.single('image'), controller.uploadImage,(error, req, res, next) => {
    res.status(400).json({ error: error.message })
})
module.exports = router;