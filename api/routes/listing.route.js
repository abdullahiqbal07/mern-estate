import express from "express";
import { verfiyToken } from "../utlis/verifyToken.js";
import {
  addListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controller/listing.controller.js";
const router = express.Router();

router.post("/create", verfiyToken, addListing);
router.post("/update/:id", verfiyToken, updateListing);
router.delete("/delete/:id", verfiyToken, deleteListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
