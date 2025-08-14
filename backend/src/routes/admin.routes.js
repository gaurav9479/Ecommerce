import express from 'express';
import { addProduct, getAllProducts } from '../controllers/admin.controller.js';
import { upload } from '../middlewares/multer.middleware.js'; 
import { loginAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/ADD-products', addProduct);
router.get('/products', getAllProducts);

export default router;
