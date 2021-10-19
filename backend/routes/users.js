const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

router.post("/api/user/login", userController.login);

router.post("/api/user/signup", userController.signup);

module.exports = router;