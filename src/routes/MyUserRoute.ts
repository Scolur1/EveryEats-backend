import express from "express";
import MyUserController from "../controller/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

//if we get a get request to /api/my/user and its get then will be passed on to MyUserController function
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser)
// if we get a post request from /api/my/user and its post then pass on to controller
router.post("/",jwtCheck, MyUserController.createCurrentUser);
//if we get a put request to /api/my/user updateCurrentUser function from controller is invoked 
router.put("/",jwtCheck, jwtParse, validateMyUserRequest, MyUserController.updateCurrentUser);
export default router;