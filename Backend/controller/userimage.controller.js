import Image from "../models/image.model.js";

const uploadImage = async (req, res) => {
    try {
        console.log('Request headers:', req.headers);
        console.log('Received file:', req.file);

        const newImage = new Image({
            user: req.user._id,
            imagePath: `/uploads/images/${req.file.filename}`
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

export { uploadImage };