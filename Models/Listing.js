const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review=require("./reviews.js");

let listingSchema=new schema({
    title:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    image:{
        url: String,
        filename: String
    },
    location:{
        type:String
    },
    price:{
        type:Number
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{ //it is a geojson format odf mongoose used to store the coordinates and helpful in performing operations
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});


//Mongoose middleware for deletion handelling of reviews
listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(Listing){
        await Review.deleteMany({_id:{$in:Listing.reviews}}); // Will delete all the reviews related to the listing if the listing is deleted
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;