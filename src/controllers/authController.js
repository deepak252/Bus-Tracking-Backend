// const {User, Driver} = require("../models");
const {User} = require("../models");
const { errorMessage, successMessage } = require("../utils/responseUtil");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { regex, UserType } = require("../config/constants");
const { JWT_SECRET } = require("../config");

module.exports.registerUser = async (req,res)=> {
    try{
        const {name, phone, email, password} = req.body;
        let user = new User({
            name,phone,email,password
        });
        let error = user.validateSync();
        if(error){
            throw error;
        }
        if(password.length<4){
            throw new Error("Password must contain at least 4 characters");
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user = await user.save();
        const token = jwt.sign({user},JWT_SECRET);
        return res.json(successMessage({
            message : "Account created successfully",
            data : {user,token}
        }));
    }catch(e){
        console.error("registerUser Error : ", e);
        if(e.code===11000){
            //duplicate key error, unique value
            return res.status(400).json(errorMessage("User already exists with given email / phone"));
        }
        return res.status(400).json(errorMessage(e.message || e));
    }
}


module.exports.signInUser = async (req,res)=> {
    try{
        let {email, password} = req.body;
        if(!email || !password){
            throw new Error("Email and Password are required");
        }
        email = email.toLowerCase().trim();

        if(!regex.email.test(email)){
            throw new Error("Invalid Email");
        }
        let user = await User.findOne({email});
        if(!user || !(await bcryptjs.compare(password, user.password))){
            throw new Error("Invalid email or password");
        }
        const token = jwt.sign({user},JWT_SECRET);
        return res.json(successMessage({
            message : "Sign in successful",
            data : {user,token}
        }));
    }catch(e){
        console.error("signInUser Error : ", e);
        return res.status(400).json(errorMessage(e.message || e));
    }
}


module.exports.resetUserPassword = async (req,res)=> {
    try{
        let {email, newPassword} = req.body;
        if(!email || !newPassword){
            throw new Error("Email and new password are required");
        }
        email = email.toLowerCase().trim();
        if(!regex.email.test(email)){
            throw new Error("Invalid Email");
        }
        if(newPassword.length<4){
            throw new Error("Password must contain at least 4 characters");
        }

        let user = await User.findOne({email});
        if(!user){
            throw new Error("User does not exist");
        }
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        user = await user.save();

        return res.json(successMessage({
            message : "Password reset successful",
        }));
    }catch(e){
        console.error("resetUserPassword Error : ", e);
        return res.status(400).json(errorMessage(e.message || e));
    }
}




module.exports.registerDriver = async (req,res)=> {
    try{
        const {name, phone, email, password} = req.body;
        let driver = new User({
            name,phone,email,password, 
            userType : UserType.driver
        });
        let error = driver.validateSync();
        if(error){
            throw error;
        }
        if(password.length<4){
            throw new Error("Password must contain at least 4 characters");
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        driver.password = hashedPassword;
        driver = await driver.save();
        const token = jwt.sign({driver},JWT_SECRET);
        return res.json(successMessage({
            message : "Account created successfully",
            data : {driver,token}
        }));
    }catch(e){
        console.error("registerDriver Error : ", e);
        if(e.code===11000){
            //duplicate key error, unique value
            return res.status(400).json(errorMessage("Driver already exists with given email / phone"));
        }
        return res.status(400).json(errorMessage(e.message || e));
    }
}


module.exports.signInDriver = async (req,res)=> {
    try{
        let {email, password} = req.body;
        if(!email || !password){
            throw new Error("Email and Password are required");
        }
        email = email.toLowerCase().trim();

        if(!regex.email.test(email)){
            throw new Error("Invalid Email");
        }
        let driver = await User.findOne({email});
        if(!driver || !(await bcryptjs.compare(password, driver.password))){
            throw new Error("Invalid email or password");
        }
        const token = jwt.sign({driver},JWT_SECRET);
        return res.json(successMessage({
            message : "Sign in successful",
            data : {driver,token}
        }));
    }catch(e){
        console.error("signInDriver Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}


module.exports.resetDriverPassword = async (req,res)=> {
    try{
        let {email, newPassword} = req.body;
        if(!email || !newPassword){
            throw new Error("Email and new password are required");
        }
        email = email.toLowerCase().trim();
        if(!regex.email.test(email)){
            throw new Error("Invalid Email");
        }
        if(newPassword.length<4){
            throw new Error("Password must contain at least 4 characters");
        }

        let driver = await User.findOne({email});
        if(!driver){
            throw new Error("Driver does not exist");
        }
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        driver.password = hashedPassword;
        driver = await driver.save();

        return res.json(successMessage({
            message : "Password reset successful",
        }));
    }catch(e){
        console.error("resetDriverPassword Error : ", e);
        return res.json(errorMessage(e.message || e));
    }
}