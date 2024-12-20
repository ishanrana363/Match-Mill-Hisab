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
// mill entry controller
const millController = require("../controllers/millController");
// daily bazar controller
const dailyBazarController = require("../controllers/dailyBazarController");
// money entry controller
const moneyEntryController = require("../controllers/moneyEntryController");
// former border controller
const formerBorderController = require("../controllers/formerBorderController");
// forget password controller
const forgetPasswordController = require("../controllers/otpController");
// user related api
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.put("/user-update",isLogIn,isAdmin, userController.updateUser);
router.get("/user-profile", isLogIn,isAdmin, userController.userProfile);
router.get("/user-list/:pageNo/:perPage/:searchValue", isLogIn,isAdmin, userController.userList);
router.put("/status-update/:userId", isLogIn,isAdmin, userController.userStatusUpdate);
router.put(`/user/delete/:id`, isLogIn,isAdmin, userController.userDelete);
router.get("/disable-user/:pageNo/:perPage/:searchValue", isLogIn, isAdmin, userController.disableUserList);
router.put("/enable-user/:id", isLogIn, isAdmin, userController.enableUser );


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

// mill entry api

router.post("/mill-upload", millController.millUpload );
router.post("/total-mill-calculation", millController.findOneBorderTotalEtatenMill);

// daily bazar api

router.post("/insert-daily-bazar", dailyBazarController.dailyBazarInsert);
router.post("/total-bazar-calculation", dailyBazarController.totalCalculationBazar);
router.post("/total-bazar-list", dailyBazarController.totalBazarList);

// money entry api

router.post("/money-entry", moneyEntryController.insertMoneyEntry);
router.post("/money-calculation", moneyEntryController.moneyCalculation);
router.post("/money-calculation-30days",moneyEntryController.moneyCalculationby30Days);
router.post("/rice-calculation-30days", moneyEntryController.riceCalculationby30Days);

// router.post("/total-money-border", moneyEntryController.findOneBorderTotalMoneyGiven);

// former border api

router.get("/all-former-border",formerBorderController.allFormerBorder);

// forget password api

router.post("/send-otp", forgetPasswordController.sendMail);
router.post("/verify-otp", forgetPasswordController.verifyOtp);
router.post("/reset-password", forgetPasswordController.resetPassword);



module.exports = router