import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Place Order COD : /api/order/cod

export const placeOrderCOD = async (req, res) => {
    try{
        const { items, address } = req.body;
        const userId = req.userId;
        if(!address || !items || items.length === 0) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }
        // Calculate total price using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0);

        // Add Tax Charge (5%)
        amount += Math.floor(amount * 0.05);
        // Create Order
        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD"
        });
        res.json({
            success: true,
            message: "Order placed successfully",
        });
    } catch (error){
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
}

// Get Orders by UserId : /api/order/user

export const getUserOrders = async (req, res) => {
    try{
        const userId = req.userId;
        const orders = await Order.find({ userId, $or: [{paymentMethod: "COD"}, {isPaid: true}] }).populate("items.product address").sort({ createdAt: -1 });
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
}


// Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find({$or: [{paymentMethod: "COD"}, {isPaid: true}] }).populate("items.product address").sort({ createdAt: -1 });
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
}