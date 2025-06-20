import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config.js'; // Load environment variables
import express from 'express';
import connectCloudinary from './configs/cloudinary.js';
import connectDB from './configs/db.js';
import addressRouter from './routes/addressRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import productRouter from './routes/productRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import userRouter from './routes/userRoute.js';
const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://greencart-frontend-txt4.onrender.com'
];
// Middleware Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));



app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/user',userRouter);
app.use('/api/seller',sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app; // Export the app for testing or further configuration
