const router = require("express").Router();
const controller = require("../controllers/busController");

router.post("/createBus", controller.createBus);
router.get("/getBusByVehicleNo", controller.getBusByVehicleNo);
router.get("/getBusesForRoute", controller.getAllBusesForBusRoute);
router.get("/getBusesForStop", controller.getAllBusesForBusStop);
router.post("/updateBus", controller.updateBus);
router.delete("/deleteBus", controller.deleteBus);

module.exports=router;
