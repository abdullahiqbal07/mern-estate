import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// import of router
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

// manage env file
dotenv.config();
const app = express();

// connect to database server
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to Mongoose");
  })
  .catch((err) => {
    console.log("error connecting", err);
  });

const __dirname = path.resolve();

//allow server to pass JSON data
app.use(express.json());
app.use(cookieParser());

// API routes are creating
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";

  return res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
  });
});

// port number
const port = 3000;
app.listen(port, () => {
  console.log("listening on port", port);
});
