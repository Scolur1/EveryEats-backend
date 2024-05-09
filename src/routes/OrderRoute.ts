import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controller/OrderController";

const router = express.Router();

//if we get a checkout request to a create-checkout-session, auth will get validated, hand off to controller
router.post(
  "/checkout/create-checkout-session", 
  jwtCheck, 
  jwtParse, 
  OrderController.createCheckoutSession
);

router.post(
  "/checkout/webhook", 
  OrderController.stripeWebhookHandler,
);

export default router;