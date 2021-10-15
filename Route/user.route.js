var express = require('express');
var router = express.Router();
var controller = require('../Controller/user.controller');

router.get("/getUser",controller.getUser);
router.post("/login",controller.login)

module.exports = router;