import mongoose from "mongoose";


//database connection 

const connectDatabase = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/UserAuthenticationSystem`)

        console.log("Database connected succesfully");
        
    } catch (error) {
        console.log("Errot: ", error);
        
    }
}

export default connectDatabase;