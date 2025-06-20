import jwt from "jsonwebtoken";

// Login a seller : /api/seller/login

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please provide all fields",
      });
    }
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        success: true,
        message: "Seller login successful",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Seller login failed",
      error: error.message,
    });
  }
};

// Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({
      success: true
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: "User authentication failed",
      error: error.message
    });
  }
};

// Seller logout : /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({
      success: true,
      message: "Seller logout successful",
    });
  } catch (error) {
    console.log(error.message);
    return res.json({
      success: false,
      message: "Seller logout failed",
      error: error.message,
    });
  }
};
