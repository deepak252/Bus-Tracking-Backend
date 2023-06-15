const router = require("express").Router();
const controller = require("../controllers/busRouteController");

router.post("/createBusRoute", controller.createBusRoute);
router.get("/getBusRoute", controller.getBusRoute);
router.get("/getAllBusRoutes", controller.getAllBusRoutes);
router.post("/updateBusRoute", controller.updateBusRoute);
router.delete("/deleteBusRoute", controller.deleteBusRoute);
router.post("/addBusStopToRoute", controller.addBusStopToRoute);
router.post("/removeBusStopFromRoute", controller.removeBusStopFromRoute);
router.post("/removeBusStopFromAllRoutes", controller.removeBusStopFromAllRoutes);

module.exports=router;

