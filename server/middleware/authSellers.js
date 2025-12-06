import jwt from 'jsonwebtoken';

const authSellers = async (req, res, next) => {
    try {
        const {sellerToken} = req.cookies;
        if (!sellerToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access!"
            });
        }

        // Verify JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        
        // Check if email matches seller email
        if (!process.env.SELLER_EMAIL) {
            console.error("SELLER_EMAIL is not defined in environment variables");
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access!"
            });
        }
    } catch (error) {
        // Handle JWT verification errors
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access!",
                error: "Invalid or expired token"
            });
        }
        // Handle other errors
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
}

export default authSellers;