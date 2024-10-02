import errorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const verfiyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401, "Unauthorized access"));
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
            if(err) {
                return next(errorHandler(402, "Forbiden"));
            }

            req.user = data;
            next()
        });

      } catch (error) {
        next(error);
      }

}