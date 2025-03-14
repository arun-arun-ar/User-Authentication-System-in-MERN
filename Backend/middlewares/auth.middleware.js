import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
    try {
        // Check for token in cookies or Authorization header
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // If no token is found
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized request" });
        }

        let decodedToken;
        try {
            // Decode and verify the JWT token
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid access token" });
        }

        // Find user by ID from the decoded token (without including sensitive data like password or refreshToken)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid access token" });
        }

        // Attach the user object to the request for use in subsequent route handlers
        req.user = user;

        // Log the authenticated user for debugging purposes
        console.log("Authenticated user:", req.user); // This line is optional but useful for debugging

        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
        // Catch and return any unexpected errors
        return res.status(401).json({ success: false, message: error?.message || "Unauthorized request" });
    }
};

export default verifyJWT;
