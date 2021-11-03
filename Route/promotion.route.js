var express = require('express');
var router = express.Router();
var controllerAdmin = require('../Controller/admin/promotion.controller');

router.get("/getFullPromotion",controllerAdmin.getFullPromotion);
router.post("/updateTimeSale",controllerAdmin.updateTimeSale);
router.post("/updateQuanitySale",controllerAdmin.updateQuanitySale);
router.post("/addPromotion",controllerAdmin.addPromotion);
router.post("/deleteSale", controllerAdmin.deleteSale);
module.exports = router;