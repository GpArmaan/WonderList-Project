const mongoose=require("mongoose");
const schema=mongoose.Schema;

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
    }
}
)

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;