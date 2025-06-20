import express from 'express';
import { createRazorpayOrder } from '../controllers/paymentController.js';
import authUser from '../middleware/authUser.js';

const router = express.Router();

router.post('/create-order', authUser, createRazorpayOrder);

export default router; 