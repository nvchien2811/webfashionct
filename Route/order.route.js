var express = require('express');
var router = express.Router();
var controller = require('../Controller/order.controller');
var controllerSale = require('../Controller/promotion.controller');

router.post("/getProductByCart",controller.getProductByCart)
router.post("/addBill",controller.addBill);
router.post("/getBillByIdUser",controller.getBillByIdUser);
router.post("/getProductByIdBill",controller.getProductByIdBill);
router.post("/getBillById",controller.getBillById)

router.post("/getSaleByCode",controllerSale.getSaleByCode);
router.post("/getSaleById",controllerSale.getSaleById);
module.exports = router;