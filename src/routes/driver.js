const router = require("express").Router();
const controller = require("../controllers/driverController");

router.get("/getDriver/:driverId", controller.getDriver);
router.post("/updateDriver", controller.updateDriver);
router.delete("/deleteDriver/:driverId", controller.deleteDriver);

module.exports=router;