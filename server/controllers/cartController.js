import User from "../models/User.js";


// Update User CartData : /api/cart/update

export const updateCart = async (req, res) => {
    try{
        // cursor-fix: persisted cart state with MongoDB
        const { cartItems } = req.body;
        const userId = req.userId; // get from middleware
        await User.findByIdAndUpdate(userId, {cartItems});
        res.json({
            success: true,
            message: "Cart updated successfully"
        })
    } catch (error){
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update cart",
            error: error.message
        });
    }
}