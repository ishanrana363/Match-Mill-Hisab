const express = require('express');

const router = express.Router();
//auth controller
const {isAdmin,isLogIn,isLogOut} = require("../middlewares/authMiddleware");
// user controller
const userController = require("../controllers/userController");
// border controller
const borderController = require("../controllers/borderController");

// user related api
router.post("/registration", userController.registration);
router.post("/login", userController.login);

// border api

router.post("/create-border",isLogIn,isAdmin,borderController.borderCreate);
// router.get("/getBorder", borderController.getBorder);
// router.get("/getAllBorders", borderController.getAllBorders);
// router.put("/updateBorder", borderController.updateBorder);
// router.delete("/deleteBorder", borderController.deleteBorder);


module.exports = router