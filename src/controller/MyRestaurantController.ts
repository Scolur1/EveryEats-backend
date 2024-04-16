import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const getMyRestaurant = async (req: Request, res: Response)=> {
  try {
    const restaurant = await Restaurant.findOne({user: req.userId});
    if(!restaurant){
      return res.status(404).json({message: "restaurant not found"});
    }
    res.json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({message: "error fetching restaurant"});
  };
};

//handler function
const createMyRestaurant = async (req: Request, res: Response) =>{
  try {
    //check if user already has existing restaurant in the database. can only create ONE restaurant per account
    const existingRestaurant = await Restaurant.findOne({user: req.userId});
    //there is a match
    if(existingRestaurant){
      return res
        .status(409)
        .json({message: "User restaurant already exists"});
    }
    
    const imageUrl = await uploadImage(req.file as Express.Multer.File);
    //create new restaurant
    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    //link currentLoggedin to this restaurant
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    //complete the request
    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Something went wrong"});
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if(!restaurant){
      return res.status(404).json({message: "Restaurant not found"});
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if(req.file){
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).send(restaurant);//return new restaurant object as json
  } catch (error) {
    console.log("error", error);
    res.status(500).json({message: "Something went wrong"});
  }
};

const uploadImage = async (file:Express.Multer.File) => {
    //create data uri string that represents the image that we got in the req
    //get image from req
    const image = file;
    //convert to base 64 string
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    //upload image to cloud. gives back api response, assigns to uploadResponse.
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
};

export default{
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant
};