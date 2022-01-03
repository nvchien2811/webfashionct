var express = require('express');
var router = express.Router();
var controller = require('../Controller/user.controller');
var controllerAdmin = require('../Controller/admin/user.controller');

router.post("/getUser",controller.getUser);
router.post("/getInforUser",controller.getInforUser);
router.post("/login",controller.login)
router.post("/register",controller.register);

router.post("/checkEmail",controller.checkEmail);
router.post("/checkUsername",controller.checkUsername);

router.get("/getFullUser",controllerAdmin.getFullUser);
router.post("/updateStatusUser",controllerAdmin.updateStatusUser);
router.post("/updateProfile",controller.updateProfile);
router.post("/updateAvatarUser", controller.updateAvatarUser);

module.exports = router;