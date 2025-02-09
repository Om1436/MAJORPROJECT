const Listing = require("./models/listing");
const ExpressError=require("./utils/ExpressError.js")
const{listingSchema,reviewSchema}=require("./schema.js")
const Review = require("./models/review.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if (!req.isAuthenticated()){
        //save path to session
        req.session.redirectUrl=req.originalUrl
        req.flash("error","You must be logged in!");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{

    if (req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl

    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
        let listing=await Listing.findById(id)
       
        if (!listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error","You are not the owner of this listing")
            return res.redirect(`/listing/${id}`);
        }
        next();
}

module.exports.validateListing = (req, res, next) => {
    // console.log("hello")
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    // console.log("Validating review:", req.body); // Log to see if the review data is present
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();  // Ensure 'next' is called correctly
    }
};

module.exports.isAuthor=async(req,res,next)=>{
    let { reviewId } = req.params;
    let { id } = req.params;

        let review=await Review.findById(reviewId)
        if (!review.author.equals(res.locals.currUser._id)){
            req.flash("error","You are not the author of this listing")
            return res.redirect(`/listing/${id}`);
        }
        next();
}
