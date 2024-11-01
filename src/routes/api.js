const express = require('express');

const router = express.Router();

// user controller

const userController = require("../controllers/userController");

router.post("/registration", userController.registration);
router.post("/login", userController.login); 

module.exports = router