const mongoose=require ("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")
const User=require("./users.js");
const { string } = require("joi");

const listingSchema=new Schema({
    title:{
        type:String,
        required:[true,"title is required"]
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
        reviews:[
            {
                type:Schema.Types.ObjectId,
                ref:"Review"
            }
        ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id:{$in:listing.reviews}})

    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing