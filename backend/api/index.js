import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "../models/db.config.js";

import userRoutes from "../routes/user.route.js";
import mediaRoutes from "../routes/media.route.js";
import watchlistRoutes from "../routes/watchlist.route.js";

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/watchlist", watchlistRoutes);

export default app;