import express from 'express';
import { addProduct } from '../controllers/admin.controller.js'; // make sure path is correct
import upload from '../middlewares/multer.middleware.js'; // if you're using multer

const router = express.Router();

// Multer uploads 'images' field for multiple images
router.post('/add-product', upload.array('images', 5), addProduct);


export default router;
