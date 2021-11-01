var express = require('express');
var router = express.Router();
var controllerAdmin = require('../Controller/admin/promotion.controller');

router.get("/getFullPromotion",controllerAdmin.getFullPromotion);

module.exports = router;