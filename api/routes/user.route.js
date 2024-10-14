import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getListings,
  getUser,
} from "../controller/user.controller.js";
import { verfiyToken } from "../utlis/verifyToken.js";

const router = express.Router();

router.get("/test", verfiyToken, test);
router.post("/updateuser/:id", verfiyToken, updateUser);
router.delete("/deleteuser/:id", verfiyToken, deleteUser);
router.get("/listings/:id", verfiyToken, getListings);
router.get("/get/:id", verfiyToken, getUser);

export default router;
