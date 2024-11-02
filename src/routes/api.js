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
// daily rice entry controller
const dailyRiceController  = require("../controllers/dailyRiceController");
// vegetable entry controller
const vegetableEntryController = require("../controllers/vegetableEntryController");

// user related api
router.post("/registration", userController.registration);
router.post("/login", userController.login);

// border api

router.post("/create-border",isLogIn,isAdmin,borderController.borderCreate);
router.put("/border-update/:borderId", borderController.borderUpdate);
router.delete("/border-delete/:borderId", borderController.borderDelete);
router.get("/single-border/:borderId", borderController.singleBorder);
router.get("/all-border/:pageNo/:perPage/:searchValue" , borderController.allBorder);
router.get("/border-name", borderController.borderName ); 

// rice entry api

router.post("/insert-rice-entry", riceEntryController.insertRiceEntry);
router.post("/total-rice-border", riceEntryController.findOneBorderTotalRiceGiven);

// daily rice entry releted api 

router.post("/insert-daily-rice-entry", dailyRiceController.insertDailyRiceEntry);
router.post("/total-eaten-rice-border", dailyRiceController.findOneBorderTotalEatenRice);

// vegetable entry api

router.post("/insert-vegetable-entry", vegetableEntryController.vegetableCreate);
router.post("/total-mill-calculation", vegetableEntryController.findOneBorderTotalEtatenMill);



module.exports = router