// Import packages and libraries
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from './routes/user.routes.js';
import imageRoutes from './routes/image.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Importing database
import connectDatabase from "./config/database.js";

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv config
dotenv.config({
    path: './.env'
});

// Express app 
const app = express();

// Middlewares 
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(cookieParser()); // for handling cookies
app.use(express.json()); // to handle JSON body parsing
app.use(express.urlencoded({ extended: true })); // to handle form data

// Serve uploaded files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Calling database
connectDatabase();

// Route declaration 
app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);

// Starting the app
app.get('/', (req, res) => {
    res.send("Welcome!");
});

// Listening on the port
app.listen(process.env.PORT || 8000, () => {
    console.log(`The server is listening at port ${process.env.PORT || 5000}`);
});
