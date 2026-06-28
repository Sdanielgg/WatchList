import mongoose from "mongoose";
import "dotenv/config";    
try{
    const uri=process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
}catch(error){
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
}

import WatchListModel from "./watchList.model.js";
import UserModel from "./user.model.js";
import MediaModel from "./media.model.js";    
const User= UserModel(mongoose);
const Media=MediaModel(mongoose);
const WatchList=WatchListModel(mongoose);

export {User,Media,WatchList};