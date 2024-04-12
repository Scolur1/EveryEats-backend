import {body, validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";

//middleware that will apply the validation logic to the request
const handleValidationErrors = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
  next();
} 

export const validateMyUserRequest = [
  //checks body for name field, isString, notEmpty-emptystring
  body("name")
  .isString()
  .notEmpty()
  .withMessage("Name must be a string"),
  body("addressLine1")
  .isString()
  .notEmpty()
  .withMessage("AddressLine1 must be a string"),
  body("city")
  .isString()
  .notEmpty()
  .withMessage("City must be a string"),
  body("country")
  .isString()
  .notEmpty()
  .withMessage("Country must be a string"),
  handleValidationErrors
]