var express = require('express');
var router = express.Router();
var controller = require('../Controller/order.controller');

router.post("/getProductByCart",controller.getProductByCart)
router.post("/addBill",controller.addBill);

module.exports = router;