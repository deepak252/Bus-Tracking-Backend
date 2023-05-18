const router = require("express").Router();
const controller = require("../controllers/authController");


router.post("/signUp",controller.signUp);
router.post("/signIn",controller.signIn);
router.post("/resetPassword",controller.resetPassword);

module.exports = router;