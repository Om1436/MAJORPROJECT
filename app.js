if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}



const express= require("express");
const app=express();
const mongoose=require ("mongoose");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError")
const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/users.js")

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const dburl=process.env.ATLASTDB_URL;

main().then(res=>{
    console.log(res)
}).catch(err =>{
    console.log(err)
});

async function main() {
    await mongoose.connect(dburl)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
//for method override
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
//for styling files
app.use(express.static(path.join(__dirname,"/public")))

const store= MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.secret
    },
    touchAfter:24*3600,
})

store.on("err",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err)
})

const sessionOptions={
    store,
    secret:process.env.secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // Expire 7 days from now
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
            httpOnly: true
        }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()))

// for storing and removing user info when session is started
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     res.locals.error=req.flash("error");
//     res.locals.currUser=req.user;
//     next();
// })
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    
    console.log("Current User:", res.locals.currUser); // Debugging line
    
    next();
});

app.get("/demo",async(req,res)=>{
    let fakeUser=({
        email:"demon123@gmail.com",
        username:"demoBacha"
    });
    let demoUser=await User.register(fakeUser,"domabolte")
    res.send(demoUser)
});


//Routers
app.use("/listing",listingRouter)
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found") )
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Some error occurred" } = err;

    // Check if it's a Mongoose validation error
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    res.status(status).render("error.ejs", { message });
});

app.listen(8080,(req,res)=>{
    console.log("listning to port 8080");
});