import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

//extend type so we can add custom properties to the express request
declare global{
  namespace Express{
    interface Request{
      userId: string;
      auth0Id: string;
    }
  }
}

//when we add jwtCheck function as middleware to our routes, 
//express going to pass the request to this auth function
//Function will check the authorization header for the bearer token, 
//connect to our oauth server 
//and verify the token belongs to a logged in user
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

//finds the user from MongoDB based on the token
export const jwtParse = async(
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  //get access token from auth header thats in the request
  //destructure auth header
  const{authorization} = req.headers;

  //checking that header has authorization and starts w/ Bearer with a trailing space
  if(!authorization || !authorization.startsWith("Bearer ")){
    return res.sendStatus(401);
  }

  //get token from auth string
  //Bearer lsafjaaksglnakljn
  const token = authorization.split(" ")[1];

  //use jwt to decode the access token
  //get users auth0Id out of token
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;//convention oauth that holds the auth0Id
    
    const user = await User.findOne({auth0Id}); //find user by auth0Id

    if(!user){ //user doesnt exist. Not authorized
      return res.sendStatus(401);
    }
    //appending info about user trying to make request to actual request object
    //gets passed on to handler in MyUserController.ts
    //makes it easier to manage business logic
    req.auth0Id = auth0Id as string; 
    req.userId = user._id.toString();
    next();//Tells express that we are finished w/ middleware and do whatever is next

  } catch (error) {
    return res.sendStatus(401);
  }

  
};