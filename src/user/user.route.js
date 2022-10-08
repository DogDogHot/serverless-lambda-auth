const express = require("express");
const userController = require("./user.controller");

const router = express.Router();

router.get("/", userController.getUserList);
router.post("/", userController.createUser);
router.get("/me", userController.getMeInfo);
router.post("/login", userController.login);

module.exports = router;
