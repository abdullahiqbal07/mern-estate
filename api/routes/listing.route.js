import express from "express";
import { verfiyToken } from "../utlis/verifyToken.js";
import { addListing } from "../controller/listing.controller.js";
const router = express.Router();

router.post('/create',verfiyToken, addListing);


export default router;