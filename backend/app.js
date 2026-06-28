import express from "express";
import cors from "cors";
import "dotenv/config";
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

const app = express();
app.use(cors());

// Middleware to read JSON body
app.use(express.json());

// Routes
import userRoutes from "./routes/user.route.js";
import mediaRoutes from "./routes/media.route.js";
import watchListRoutes from "./routes/watchList.route.js";

app.use("/api/media", mediaRoutes);
app.use("/api/watchlist", watchListRoutes);
app.use("/api/users", userRoutes);
// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    err.message = "Invalid JSON payload";
    err.status = 400;
  }

  res.status(err.status || 500).json({
    description: err.message || "Internal server error",
    ...(err.errors && { errors: err.errors }),
  });
});

app.listen(PORT,HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));