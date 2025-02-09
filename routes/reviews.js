const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner,validateReview, isAuthor}=require("../middleware.js")

const reviewController=require("../controllers/reviews.js")

// Review route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.addReview));

// Delete review
router.delete("/:reviewId",isAuthor,isLoggedIn, wrapAsync(reviewController.destroyReview));

module.exports = router;