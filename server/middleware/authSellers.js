import jwt from 'jsonwebtoken';

const authSellers = async (req, res, next) => {
    const {sellerToken} = req.cookies;
    if (!sellerToken) {
        return res.json({
            success: false,
            message: "Unauthorized Access!"
        });
    }
    try {
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next();
        }else{
            return res.json({
                success: false,
                message: "Unauthorized Access!"
            });
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Unauthorized Access!",
            error: error.message
        });
    }
}

export default authSellers;