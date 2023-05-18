const router = require("express").Router();
const controller = require("../controllers/busRouteController");

router.post("/createBusRoute", controller.createBusRoute);
router.get("/getBusRoute", controller.getBusRoute);
router.post("/updateBusRoute", controller.updateBusRoute);
router.delete("/deleteBusRoute", controller.deleteBusRoute);

module.exports=router;

