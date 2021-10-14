var express = require('express');
var router = express.Router();
var controller = require('../Controller/user.controller');

router.get("/getUser",controller.getUser);

module.exports = router;