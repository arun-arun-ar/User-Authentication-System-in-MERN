import Image from "../models/image.model.js";

const uploadImage = async (req, res) => {
    try {
        console.log('Request headers:', req.headers);
        console.log('Received file:', req.file);

        const newImage = new Image({
            user: req.user._id,
            imagePath: `/Public/images/${req.file.filename}`,
        });

        await newImage.save();

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: {
                id: newImage._id,
                path: newImage.imagePath,
                uploadedAt: newImage.createdAt
            }
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};


const getUserImage = async (req, res) => {
    try {
        const userId = req.user._id;

        const userImage = await Image.find({user: userId});

        if(!userImage.length){
            return res.status(400).json({success: false, message: "No image found"})
        }

        return res.status(200).json({success:true, image: userImage.map(image =>({
            id: image._id,
            path: image.imagePath
        }))})
    } catch (error) {
        console.log("Error Fetching User Image.");

        return res.status(500).json({
            success: false,error: "Internal Server Error", message: error.message
        })
    }
}

export { uploadImage, getUserImage };