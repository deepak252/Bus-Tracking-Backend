const router = require("express").Router();
const auth = require("./auth");
const user = require("./user");
const driver = require("./driver");
const bus = require("./bus");
const busStop = require("./busStop");
const busRoute = require("./busRoute");


router.use("/auth", auth);
router.use("/user", user);
router.use("/driver", driver);
router.use("/bus", bus);
router.use("/busStop", busStop);
router.use("/busRoute", busRoute);


module.exports = router;