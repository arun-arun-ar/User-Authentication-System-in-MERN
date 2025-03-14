import { Router } from 'express';
import { uploadImage, getUserImage } from '../controller/userimage.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import multer from 'multer';

const router = Router();

// Handle Multer errors
const handleMulterError = (err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ 
                    error: 'File too large. Maximum size is 5MB' 
                });
            }
            return res.status(400).json({ error: err.message });
        }
        return res.status(400).json({ error: err.message });
    }
    next();
};

// Route to upload an image
router.post('/upload', 
    verifyJWT,
    (req, res, next) => {
        // Ensure request contains multipart/form-data
        if (!req.is('multipart/form-data')) {
            return res.status(400).json({ 
                error: 'Invalid content type. Use multipart/form-data' 
            });
        }
        next();
    },
    (req, res, next) => {
        upload.single('image')(req, res, (err) => {
            if (err) {
                return handleMulterError(err, req, res, next);
            }
            
            // Ensure file is uploaded
            if (!req.file) {
                return res.status(400).json({ 
                    error: 'No file uploaded. Please select an image file' 
                });
            }
            next();
        });
    },
    uploadImage
);

// Route to get user images
router.get('/user-images', verifyJWT, getUserImage);

export default router;
