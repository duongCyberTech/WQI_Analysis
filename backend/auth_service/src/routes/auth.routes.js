const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controllers");

router.post("/register", controller.register);
router.post("/verify", controller.verifyCode);
router.post("/login", controller.login);
router.post('/change-password', controller.changePassword);

module.exports = router;
