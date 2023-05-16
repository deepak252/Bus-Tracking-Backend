const router = require("express").Router();


router.get("/check",(req,res)=>{
    res.send("Auth Working")
})

module.exports = router