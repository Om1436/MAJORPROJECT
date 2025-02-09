const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.addReview=async (req, res, next) => {
    // console.log("Validating review:", req.body);
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    let newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New review Added!");

    res.redirect(`/listing/${listing._id}`);
}


module.exports.destroyReview=async (req, res, next) => {
    let { id, reviewId } = req.params;
   
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review Deleted!");

    res.redirect(`/listing/${id}`);
}