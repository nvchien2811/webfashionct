var express = require('express');
var router = express.Router();
var controller = require('../Controller/product.controller');

router.get('/getProductType',controller.getProductType);
router.get('/getCategory',controller.getCategory);
router.get('/getProduct',controller.getProduct);
router.post('/getProductDetails',controller.getProductDetails);
router.post('/getCategoryById',controller.getCategoryById);
router.post('/getPrductTypeById',controller.getProductTypeById);
router.post('/getProductByType',controller.getProductByType);
router.post('/getProductByCategory',controller.getProductByCategory);
router.post('/getProductInventory',controller.getProductInventory);

module.exports = router;