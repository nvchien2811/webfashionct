var express = require('express');
var router = express.Router();

var controller = require('../Controller/admin/inventory.controller');


router.get("/getFullInventory",controller.getFullInventory);
router.post("/updateQuanityInventory",controller.updateQuanityInventory);

module.exports = router;