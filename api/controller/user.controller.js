import errorHandler from "../utlis/error.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

// here we are handling logic of user routes
export const test = (req, res) => {
  res.json({ message: "test is successful" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can only update your account"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        avatar : req.body.avatar
      },
    }, {new: true});

    console.log(updatedUser)

    const { password, ...restUser } = updatedUser._doc

    res.status(201).json(restUser);
  } catch (error) {
    next(error);
  }
};
