import express from "express";
import { authenticate } from "./../auth/verifyToken.js";
import { getcheckoutSession } from "../Controllers/bookingController.js";




const router = express.Router();

router.get("/checkout-session/:doctorId", authenticate, getcheckoutSession);

export default router;
