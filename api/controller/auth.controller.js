import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signup = async(req, res) => {
    const {username, email, password} = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username, email, password : hashPassword});
    try {
        await newUser.save();
        res.status(201).send({
            message : "user saved successfully"
        })
    } catch (error) {
        res.status(500).send({
            message : "user already exists"
        })
    }
}


// export default auth;