import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) =>{
  try {
    //finding currentUser based on their mongoDB id 
    const currentUser = await User.findOne({_id: req.userId});
    if(!currentUser){
      return res.status(404).json({message: "User not found"});
    }
    //send back user as json
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Something went wrong"});
  }
}
const createCurrentUser = async (req: Request, res: Response) =>{
  //1.check if the user exists
  //2. create the user if it doesn't exist
  //3. return the user object to the calling client

  try{
    const {auth0Id} = req.body;
    const existingUser = await User.findOne({auth0Id});

    if(existingUser){
      return res.status(200).send();
    }
    //create and save new user
    const newUser = new User(req.body)
    await newUser.save();

    //complete request to the client
    res.status(201).json(newUser.toObject())
  }catch(error){
    console.log(error);
    res.status(500).json({message: "Error creating user"});
  }
};

const updateCurrentUser = async(req:Request, res: Response) =>{
  try {
    //destructure form data sent
    const {name, addressLine1, country, city} = req.body;
    //get user trying to update
    const user = await User.findById(req.userId);
    
    //check if we found user in db
    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Error updating user"});
  }
}


export default {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser
}