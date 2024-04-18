import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controller/RestaurantController";

const router = express.Router();

// /api/restaurant/search/london
// :city tells express that any string after : is going to be a city variable
router.get(
  "/search/:city", 
  param("city") //validating that the request we get has a valid city param in req
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
    RestaurantController.searchRestaurant
);

export default router;
