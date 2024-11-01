const express = require('express');

const router = express.Router();
//auth controller
const {isAdmin,isLogIn,isLogOut} = require("../middlewares/authMiddleware");
// user controller
const userController = require("../controllers/userController");
// border controller
const borderController = require("../controllers/borderController");
// rice entry controller
const riceEntryController = require("../controllers/riceEntryController");

// user related api
router.post("/registration", userController.registration);
router.post("/login", userController.login);

// border api

router.post("/create-border",isLogIn,isAdmin,borderController.borderCreate);
router.put("/border-update/:borderId", borderController.borderUpdate);
router.delete("/border-delete/:borderId", borderController.borderDelete);
router.get("/single-border/:borderId", borderController.singleBorder);
router.get("/all-border/:pageNo/:perPage/:searchValue" , borderController.allBorder);

// rice entry api

router.post("/insert-rice-entry", riceEntryController.insertRiceEntry);

// router.get("/rice-entries/:borderId", riceEntryController.riceEntries);
// router.put("/rice-entry-update/:riceEntryId", riceEntryController.riceEntryUpdate);
// router.delete("/rice-entry-delete/:riceEntryId", riceEntryController.riceEntryDelete);

module.exports = router