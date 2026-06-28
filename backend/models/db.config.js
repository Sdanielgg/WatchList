import mongoose from "mongoose";
import "dotenv/config";

import WatchListModel from "./watchList.model.js";
import UserModel from "./user.model.js";
import MediaModel from "./media.model.js";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

// Cache connection for Vercel/serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
      console.log("Connected to MongoDB");
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Avoid OverwriteModelError
const User = mongoose.models.User || UserModel(mongoose);
const Media = mongoose.models.Media || MediaModel(mongoose);
const WatchList = mongoose.models.Watchlist || WatchListModel(mongoose);

export { User, Media, WatchList };