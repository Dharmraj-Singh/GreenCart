import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({
            success: false,
            message: "Unauthorized Access!"
        });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.userId = tokenDecode.id; // 🔧 Fixed: moved userId from req.body to req.userId to avoid undefined error
        } else {
            return res.json({
                success: false,
                message: "Unauthorized Access!"
            });
        }

        next();
    } catch (error) {
        res.json({
            success: false,
            message: "Unauthorized Access!",
            error: error.message
        });
    }
};

export default authUser;
