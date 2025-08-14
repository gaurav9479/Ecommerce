import express from 'express';
import { addProduct } from '../controllers/admin.controller.js';
import { upload } from '../middlewares/multer.middleware.js'; 
import { loginAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/products', upload.array('images', 5), addProduct);


export default router;
