import express from 'express';
import authUser from '../middleware/authUser.js';
import { placeOrderCOD, getUserOrders, getAllOrders } from '../controllers/orderController.js';
import authSellers from '../middleware/authSellers.js';


const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSellers, getAllOrders);

export default orderRouter;
