import errorHandler from "../utlis/error.js";
import Listing from "../models/listing.model.js";

export const addListing = async(req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};