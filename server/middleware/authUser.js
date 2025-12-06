import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access! Please login to continue."
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

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id; // Set userId for use in controllers
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access! Invalid token."
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
};

export default authUser;
