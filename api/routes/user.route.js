import express from "express";
import {test, updateUser } from "../controller/user.controller.js";
import { verfiyToken } from "../utlis/verifyToken.js"

const router = express.Router();

router.get('/test',verfiyToken, test);
router.post('/updateuser/:id',verfiyToken, updateUser);

export default router;