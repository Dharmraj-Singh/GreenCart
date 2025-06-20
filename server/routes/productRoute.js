import express from 'express';
import { upload } from '../configs/multer.js';
import authSellers from '../middleware/authSellers.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';


const productRouter = express.Router();

productRouter.post('/add', upload.array(['images']), authSellers, addProduct);
productRouter.get('/list', productList);
productRouter.get('/id', productById);
productRouter.post('/stock', authSellers, changeStock);

export default productRouter;