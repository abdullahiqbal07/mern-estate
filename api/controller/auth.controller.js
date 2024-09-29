import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import errorHandler from "../utlis/error.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).send({
      message: "user saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) return next(errorHandler("404", "user not found"));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY);
    const { password: pass, ...restUser } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restUser);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      const { password: pass, ...restUser } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restUser);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = bcrypt.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashPassword,
        avatar: req.body.photo,
      });
      
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);
      const { password: pass, ...restUser } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restUser);

    }
  } catch (error) {
    next(error);
  }
};
