import express from "express";
import { verfiyToken } from "../utlis/verifyToken.js";
import { addListing, deleteListing } from "../controller/listing.controller.js";
const router = express.Router();

router.post("/create", verfiyToken, addListing);
router.delete("/delete/:id", verfiyToken, deleteListing);

export default router;
