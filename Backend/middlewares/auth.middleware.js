import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
    try {
        // Check for token in cookies or Authorization header
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
      

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized request" });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid access token" });
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid access token" });
        }

        req.user = user;
        console.log("Authenticated user:", req.user); // Log authenticated user
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: error?.message || "Invalid access token" });
    }
};

export default verifyJWT;

