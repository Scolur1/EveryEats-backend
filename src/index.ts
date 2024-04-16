import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from './routes/MyUserRoute';
import myRestaurantRoute from './routes/MyRestaurantRoute';
import {v2 as cloudinary} from "cloudinary";

//connecting to mongodb
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"))
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

//connecting to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json()); //middleware that will convert response body into json
app.use(cors());

//adds a basic endpoint to our server that we can call to check if server has successfully started
app.get("/health", async (req: Request, res: Response)=>{
  res.send({message:"health OK!"});
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);

app.listen(7000, ()=>{
  console.log("App listening on localhost:7000");
})