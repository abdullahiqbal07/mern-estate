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

  // Check if the new email already exists in the database
  if (req.body.email) {
    const existingUser = await User.findOne({ email: req.body.email });

    // If the email exists and it's not the current user, return an error
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return next(
        errorHandler(
          400,
          "Email already exists. Please choose a different one."
        )
      );
    }
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

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(errorHandler(404, "User not found"));
  }
  try {
    const { password: pass, ...rest } = user._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};
