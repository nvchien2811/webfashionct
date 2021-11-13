var express = require('express');
var router = express.Router();
var controller = require('../Controller/reivew.controller');

router.post("/getReviewById",controller.getReviewById);
router.post("/addReview",controller.addReview);
router.post("/editReview",controller.editReview);


//admin
router.get("/getFullReview",controller.getFullReview);
module.exports = router;