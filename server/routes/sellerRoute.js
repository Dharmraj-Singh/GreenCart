
import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js';
import authSellers from '../middleware/authSellers.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', authSellers, isSellerAuth);
sellerRouter.post('/logout', sellerLogout);


export default sellerRouter;