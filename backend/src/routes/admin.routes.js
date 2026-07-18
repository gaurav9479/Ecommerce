import express from 'express';
import { addProduct, getAllProducts, registerAdmin, loginAdmin, getAdminProducts, updateProductStock, updateFlashDeal } from '../controllers/admin.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);


router.route('/ADD-products').post(verifyJWT, upload.array("images", 10), addProduct);
router.route('/products').get(getAllProducts); 
router.route('/my-products').get(verifyJWT, getAdminProducts);
router.route('/products/:productId/stock').patch(verifyJWT, updateProductStock);
router.route('/products/:productId/flash-deal').patch(verifyJWT, updateFlashDeal);

export default router;
