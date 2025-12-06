import User from "../models/User.js";

// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
    try {
        // Get userId from middleware (set by authUser middleware)
        const userId = req.userId;
        const { cartItems } = req.body;

        // Validate required data
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "User not authenticated" 
            });
        }

        if (!cartItems) {
            return res.status(400).json({ 
                success: false, 
                message: "Cart items are required" 
            });
        }

        // Update user's cart items
        await User.findByIdAndUpdate(userId, { cartItems }, { new: true });

        return res.json({
            success: true,
            message: "Cart updated successfully"
        });
    } catch (error) {
        console.error("Update cart error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to update cart",
            error: error.message
        });
    }
}