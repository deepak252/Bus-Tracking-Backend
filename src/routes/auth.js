const router = require("express").Router();
const controller = require("../controllers/authController");


router.post("/registerUser",controller.registerUser);
router.post("/signInUser",controller.signInUser);
router.post("/resetUserPassword",controller.resetUserPassword);

router.post("/registerDriver",controller.registerDriver);
router.post("/signInDriver",controller.signInDriver);
router.post("/resetDriverPassword",controller.resetDriverPassword);

module.exports = router;