import Image from "../models/image.model.js";

// Upload image function
const uploadImage = async (req, res) => {
    try {
        console.log('Upload request received');
        console.log('Request headers:', req.headers);
        console.log('Request file:', req.file);
        console.log('Request user:', req.user);
        console.log('Request body:', req.body);

        // Check if file is uploaded
        if (!req.file) {
            console.log('No file found in request');
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        console.log('File details:', {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Save image in the database
        const newImage = new Image({
            user: req.user._id, // Make sure user._id is correct
            imagePath: `/images/${req.file.filename}`,
        });

        await newImage.save();
        console.log('Image saved to database:', newImage);

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

// Get user images function
const getUserImage = async (req, res) => {
    try {
        console.log('User object:', req.user); // Log the user object
        const userId = req.user._id;
        console.log('Fetching images for user:', userId); // Log the user ID

        const userImage = await Image.find({ user: userId });
        console.log('Found images:', userImage);

        return res.status(200).json({
            success: true,
            image: userImage.map(image => ({
                id: image._id,
                path: image.imagePath
            }))
        });
    } catch (error) {
        console.log("Error Fetching User Image:", error);
        return res.status(500).json({
            success: false, error: "Internal Server Error", message: error.message
        });
    }
};

// Update user image function
const updateUserImage = async (req, res) => {
    try {
        console.log('Update request received');
        console.log('Request headers:', req.headers);
        console.log('Request file:', req.file);
        console.log('Request user:', req.user);
        console.log('Request body:', req.body);

        const { imageId } = req.params;

        // Check if file is uploaded
        if (!req.file) {
            console.log('No file found in request');
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        console.log('File details:', {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Find and update the image in the database
        const updatedImage = await Image.findOneAndUpdate(
            { _id: imageId, user: req.user._id },
            { imagePath: `/images/${req.file.filename}` },
            { new: true }
        );

        if (!updatedImage) {
            console.log('Image not found or user unauthorized');
            return res.status(404).json({
                success: false,
                message: 'Image not found or unauthorized'
            });
        }

        console.log('Image updated in database:', updatedImage);

        res.status(200).json({
            success: true,
            message: 'Image updated successfully',
            image: {
                id: updatedImage._id,
                path: updatedImage.imagePath,
                updatedAt: updatedImage.updatedAt
            }
        });
    } catch (error) {
        console.error('Image update error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

export { uploadImage, getUserImage, updateUserImage };
