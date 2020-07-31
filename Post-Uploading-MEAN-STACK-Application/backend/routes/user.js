const express = require('express');
const userController =  require("../Controllers/user")
const router = express.Router();

router.post("/signup", userController.createUser)

router.post("/login", userController.userLogin)

module.exports = router; 