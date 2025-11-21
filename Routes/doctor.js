import express from "express";
import { 
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getSingleDoctor,
} from "../Controllers/doctorController.js";
import { authenticate,restrict } from "../auth/verifytoken.js";

import reviewRouter from "./review.js";


const router = express.Router();

router.use("/:doctorId/reviews", reviewRouter);

router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctors);
router.put("/:id",authenticate, restrict(["doctor"]), updateDoctor);
router.delete("/:id",authenticate, restrict(["doctor"]), deleteDoctor);

export default router;
