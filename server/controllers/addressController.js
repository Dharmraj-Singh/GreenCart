import Address from "../models/Address.js";

// Add Address : /api/address/add

export const addAddress = async (req, res) => {
    try{
        const { userId, address } = req.body;
        await Address.create({ userId, ...address });
        res.json({
            success: true,
            message: "Address added successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add address"
        });
    }
}


// Get User Address : /api/address/get
export const getAddress = async (req, res) => {
    try{
        const { userId } = req.body;
        const addresses = await Address.find({ userId });
        res.json({
            success: true,
            addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch addresses",
            error: error.message
        });
    }
}