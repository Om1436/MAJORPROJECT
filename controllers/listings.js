const Listing=require("../models/listing")

module.exports.index=(async(req,res,next)=>{
    const alllisting=await Listing.find({});
    
    res.render("listings/index.ejs",{alllisting})
 })

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
            select: "username", 
        },
    })
    .populate("owner");
    

    if(!listing){
       req.flash("error","Listing you requested does not exist!");
       res.redirect("/listing")
    }
   res.render("listings/show.ejs",{listing})
 }

 module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listing")
     }
    originalImg=listing.image.url;
    originalImg=originalImg.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalImg})
}

module.exports.updateListings=async (req, res, next) => {     
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true, new: true });

    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save()
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted!");
    res.redirect("/listing")
}