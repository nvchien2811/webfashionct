var express = require('express');
var router = express.Router();
var controller = require('../Controller/user.controller');

router.post("/getUser",controller.getUser);
router.post("/login",controller.login)
router.post("/register",controller.register);

router.post("/checkEmail",controller.checkEmail);
router.post("/checkUsername",controller.checkUsername);
module.exports = router;