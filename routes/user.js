const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController=require("../controllers/user.js")

router
    .route("/signup")
    //Render SignUp Form
    .get(userController.renderSignUpForm)
    //SignUp 
    .post(wrapAsync(userController.signUpUser));

router
    .route("/login")
    //Login Form
    .get(userController.renderLoginForm)
    //Login
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.loginUser))


//Logout
router.get("/logout",userController.logoutUser)

module.exports=router;