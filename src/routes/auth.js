const router = require("express").Router();
const authController = require("../controllers/authController")


router.post("/signUp",authController.signUp)
router.post("/signIn",authController.signIn)
router.post("/resetPassword",authController.resetPassword)

module.exports = router