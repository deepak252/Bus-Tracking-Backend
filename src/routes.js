const express = require("express");
const authRoutes = require("./routes/auth");

const router = express.Router();

router.use("/auth", authRoutes)


module.exports = router;