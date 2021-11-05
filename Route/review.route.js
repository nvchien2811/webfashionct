var express = require('express');
var router = express.Router();
var controller = require('../Controller/reivew.controller');

router.post("/getReviewById",controller.getReviewById);

module.exports = router;