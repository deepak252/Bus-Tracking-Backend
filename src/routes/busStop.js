const router = require("express").Router();
const controller = require("../controllers/busStopController");

router.post("/createBusStop",controller.createBusStop);
router.get("/getBusStop",controller.getBusStop);
router.post("/updateBusStop",controller.updateBusStop);
router.delete("/deleteBusStop",controller.deleteBusStop);

module.exports = router;
