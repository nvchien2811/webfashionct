var express = require('express');
var router = express.Router();
var controller = require('../Controller/upload.controller');

// For Single image upload
router.post('/uploadImageProduct',controller.imageUpload.single('image'), controller.uploadImage,(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = router;