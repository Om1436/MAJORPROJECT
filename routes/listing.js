const express =require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync")

const Listing=require("../models/listing")
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")

const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({ storage })

router
    .route("/")
    //Index route
    .get(wrapAsync(listingController.index))
    //Create route
    .post(isLoggedIn,upload.single('listing[image]'), wrapAsync(listingController.createListing));
    

//New listing
router.get("/new",isLoggedIn,listingController.renderNewForm)

router
    .route("/:id")
    //Show route
    .get(wrapAsync(listingController.showListing))
    //Update route
    .put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing,wrapAsync(listingController.updateListings))
    //Delete route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
 

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));




//Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports=router;
