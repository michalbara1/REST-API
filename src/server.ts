import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import postsRoute from "./routes/postRoutes";
import commentsRoute from "./routes/commentRoutes";
import userssRoute from "./routes/userRoutes";

// handle unhandled promise rejections globally
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/users", userssRoute);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.MONGO_URI) { 
      reject("MONGO_URI is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;
