import express from "express";
import multer from "multer";
import MyRestaurantController from "../controller/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 //5mb 1024*1024 is 1mb
  },
});

router.get("/order", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurantOrders)

router.patch("/order/:orderId/status", jwtCheck, jwtParse, MyRestaurantController.updateOrderStatus);

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant)

//define the endpoint/controller handler function
//if we get a get request to /api/my/restaurant and its post then will be passed on to MyRestaurantController createMyRestaurant function
router.post(
  "/",
  upload.single("imageFile"), //check req body for a property called imageFile 
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.createMyRestaurant
);

router.put(
  "/",
  upload.single("imageFile"), //check req body for a property called imageFile 
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateMyRestaurant, 
);

export default router;