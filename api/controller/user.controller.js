import errorHandler from "../utlis/error.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Listing from "../models/listing.model.js";

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

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    // console.log(updatedUser)

    const { password, ...restUser } = updatedUser._doc;

    res.status(201).json(restUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "this accuont doesn't belong to you"));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(201).json({ message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      if (listings.length < 1) {
        return next(errorHandler(404, "Not Found"));
      }
      res.status(201).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "you can only view your listings"));
  }
};
