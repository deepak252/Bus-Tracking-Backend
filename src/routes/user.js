const router = require("express").Router();
const controller = require("../controllers/userController");

router.get("/getUser/:userId", controller.getUser);
router.post("/updateUser", controller.updateUser);
router.delete("/deleteUser/:userId", controller.deleteUser);

module.exports=router;