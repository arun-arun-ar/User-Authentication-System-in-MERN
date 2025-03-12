import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

//function to generate both access and refresh token
const generateAccessAndRefereshTokens = async function (userId) {
    try {
        const user = await User.findById(userId);
        //if the user is not found 
        if (!user) {
            throw new Error("User not found")
        }
        //generate access and refresh token
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //adding refresh token of a user in database and saving the users refresh token
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new Error(`Something went wrong while generating access and refresh token ${error.message}`)
    }
}

//user registration 

const registerUser = async (req, res) => {
    // Extract user data from frontend
    const { fullname, email, password } = req.body;

    // Check if some fields are empty or contain only whitespace
    if ([fullname, email, password].some((field) => field?.trim() === "")) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Check if the user already exists by email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already exists." });
        }

        // Create a new user in the database
        const user = await User.create({
            fullname,
            email: email.toLowerCase(),
            password
        });

        // Fetch the created user, excluding sensitive fields (password, refreshToken)
        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        // Ensure user creation was successful
        if (!createdUser) {
            return res.status(500).json({ success: false, message: "Something went wrong! Please try again later." });
        }

        // Send success response
        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: createdUser
        });

    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
};

//user login
const userLogin = async (req, res) => {
    // Getting email and password from user request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

    // Find user by email in the database
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
        return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    // Validate user password using a helper function
    const isPasswordValid = await user.isPasswordCorrect(password);

    // If the password is incorrect, return an error response
    if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Generate access and refresh tokens for the authenticated user
    const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(user._id);

    // Fetch user data excluding sensitive information like password and tokens
    const loginUser = await User.findById(user._id).select("-password -refreshToken");

    // Cookie options for security
    const options = {
        httpOnly: true, // Prevents JavaScript access to cookies (protection against XSS attacks)
        secure: process.env.NODE_ENV === 'production' // Ensures cookies are sent only over HTTPS in production
    };

    // Log the tokens and options
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    console.log("Cookie Options:", options);

    // Set cookies for authentication tokens and send success response
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ success: true, message: "User logged in successfully", user: loginUser });
};


//logout 

const logout = async (req, res) => {
    console.log("Logging out user", req.user); // Check if user is correctly authenticated

    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized request: No user found" });
    }

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $set: { refreshToken: undefined }
        });

        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ success: true, message: "User logged out successfully." });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

//generating new access token 
const refreshAccessToken = async (req, res) => {
    // Get the incoming refresh token either from cookies or the request body
    const incommingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken;

    // Check if the refresh token is provided in the request
    if (!incommingRefreshtoken) {
        return res.status(401).json({ success: false, message: "Unauthorized request: No refresh token provided" });
    }

    try {
        // Verify the refresh token using the secret key
        const decodedToken = jwt.verify(incommingRefreshtoken, process.env.REFRESH_TOKEN_SECRET);

        // Find the user associated with the decoded token's user ID
        const user = await User.findById(decodedToken?._id);

        // If no user is found, return an error response
        if (!user) {
            return res.status(401).json({ success: false, message: "Refresh token is invalid: User not found" });
        }

        // Check if the refresh token in the request matches the one stored in the database
        if (incommingRefreshtoken !== user?.refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token has already been used or is invalid" });
        }

        // Set options for cookies (httpOnly and secure flags)
        const options = {
            httpOnly: true, // Prevent JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production'  // Use secure cookies only in production (HTTPS)
        };

        // Generate new access token and refresh token for the user
        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

        // Send the new tokens in the response, and set them as cookies
        return res.status(200)
            .cookie("accessToken", accessToken, options) // Set the new access token as a cookie
            .cookie("refreshToken", newRefreshToken, options)  // Optionally, set the new refresh token in cookies
            .json({
                success: true,
                message: "Access token refreshed successfully",  // Return a success message
                accessToken,  // Return the new access token
                refreshToken: newRefreshToken  // Return the new refresh token
            });
    } catch (error) {
        // Catch any errors that occurred during token verification or user fetching
        return res.status(401).json({
            success: false,
            message: error?.message || "Invalid refresh token"  // Return an error message if any
        });
    }
}


// change password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(req.user?._id);


        // Check if the old password is correct
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Incorrect previous password" });
        }

        // Update the password
        user.password = newPassword;

        // Save the new password
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error changing password:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



//update user details 
const updateUserDetails = async (req, res) => {
    try {
        // Get fullname and email from request body
        const { fullname, email } = req.body;

        // Check if fullname and email are provided
        if (!fullname || !email) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Find user by ID and update
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { $set: { fullname, email } },
            { new: true }
        ).select("-password");

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Return success response
        return res.status(200).json({ success: true, user, message: "User details updated successfully" });
    } catch (error) {
        console.error("Error updating user details:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//get current user 
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized request: No user found" })
        }

        const user = await User.findById(req.user._id).select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        return res.status(200).json({ success: true, user });
        
        
        
    } catch (error) {
        console.error("Error fetching current user:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
    
}



export { registerUser, userLogin, logout, refreshAccessToken, changePassword, updateUserDetails, getCurrentUser };