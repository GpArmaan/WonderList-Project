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
        filename: String,
        url: {
            type: String,
            default: "https://thehawaiivacationguide.com/wp-content/uploads/2023/01/Best-Beaches-in-Hawaii-1536x859.jpg"
        }
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
    ]
})

//Mongoose middleware for deletion handelling of reviews
listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(Listing){
        await Review.deleteMany({_id:{$in:Listing.reviews}}); // Will delete all the reviews related to the listing if the listing is deleted
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;