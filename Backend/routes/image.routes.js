import { Router } from 'express';
import { uploadImage, getUserImage, updateUserImage } from '../controller/userimage.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = Router();

// Route to upload an image
router.post('/upload',
    verifyJWT,
    (req, res, next) => {
        // Ensure the request contains multipart/form-data
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
                return res.status(400).json({ error: err.message });
            }

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

// Route to update user image
router.put('/update/:imageId',
    verifyJWT,
    (req, res, next) => {
        // Ensure the request contains multipart/form-data
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
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({
                    error: 'No file uploaded. Please select an image file'
                });
            }
            next();
        });
    },
    updateUserImage
);

export default router;