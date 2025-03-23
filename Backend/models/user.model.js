import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';



//create a user schema in mongodb using mongoose
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
}, { timestamps: true });





//creating a middleware to has the password provided by the user and save to the database
// .pre() pre save middleware hook 
userSchema.pre("save", async function (next){
    // If the password has not been modified, skip hashing and proceed to the next middleware
    if(!this.isModified("password"))
        return next()

    console.log("Hashing password before saving..."); // Debug log
    //hashing password 
    this.password = await bcrypt.hash(this.password, 10)
    next()
} );

//method ot compare the plain password with hashed password
userSchema.methods.isPasswordCorrect = async function(password){
    //user compare method to compare password
return await bcrypt.compare(password, this.password)
}


// method for generating access token 
userSchema.methods.generateAccessToken = function () {
    //generate token using jsonwebtoken 
    return jwt.sign(
        //passing data (paylod)
        {
            _id: this.id,
            fullname: this.fullname,
            email: this.email,
        },
        //importing acces token secret from .env
        process.env.ACCESS_TOKEN_SECRET,
        // decleare expiry time of the token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//custom method to generate refresh token for current user i.e. particular user
userSchema.methods.generateRefreshToken = function(){
    // create a json web token using jwt.sign method
    return jwt.sign(
        {
            _id: this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


// convert user schema to user model
const User = mongoose.model("User", userSchema);


export default User;

