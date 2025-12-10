const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../Models/Listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/WonderList";
main().then((res)=>{
    console.log("Connection Successfull");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"69308da292881e22361ba216"})); //It will add the owner into the listing schema.
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDb();