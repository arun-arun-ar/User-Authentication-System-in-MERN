import { Router } from 'express';
import { uploadImage } from '../controller/userimage.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import verifyJWT from '../middlewares/auth.middleware.js';
import multer from 'multer';

const router = Router();

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

router.post('/upload', 
    verifyJWT,
    (req, res, next) => {
        // Check content type first
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
            
            // Additional check if file exists after processing
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

export default router;