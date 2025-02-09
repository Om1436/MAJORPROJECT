const User=require("../models/users")


module.exports.renderSignUpForm=(req,res)=>{
    res.render("user/signup.ejs")
}

module.exports.signUpUser=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser= new User({email,username})
        const registerUser=await User.register(newUser,password)
        req.login(registerUser,(err)=>{
            if (err){
                return next(err);
            }
            req.flash("success","Welcome to Wonderlust")
            res.redirect("/listing")
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs")
}

module.exports.loginUser=async(req,res,next)=>{
    
    req.flash("success","Welcome back to Wonderlust!")
    let redirectUrl=res.locals.redirectUrl ||"/listing"
    res.redirect(redirectUrl)
}

module.exports.logoutUser=(req,res,next)=>{
    req.logout((err)=>{
        if (err){
            return next(err);
        }
        req.flash("success","Logged you out")
        res.redirect("/listing")
    })
}