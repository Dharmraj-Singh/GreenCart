import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/Product.js';

// Add product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one product image"
            });
        }

        // Parse product data
        let productData;
        try {
            productData = JSON.parse(req.body.productData);
        } catch (parseError) {
            return res.status(400).json({
                success: false,
                message: "Invalid product data format"
            });
        }

        // Validate required fields
        if (!productData.name || !productData.category || !productData.price || !productData.offerPrice) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields (name, category, price, offerPrice)"
            });
        }

        const images = req.files;

        // Upload images to Cloudinary using buffer stream
        let imagesUrl = await Promise.all(
            images.map(async (file) => {
                try {
                    // Convert buffer to base64 string for Cloudinary
                    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                    
                    const result = await cloudinary.uploader.upload(base64Image, {
                        resource_type: "image",
                        folder: "greencart/products", // Optional: organize images in folders
                        transformation: [
                            { width: 800, height: 800, crop: "limit" }, // Resize large images
                            { quality: "auto" }, // Optimize quality
                        ],
                    });
                    
                    return result.secure_url;
                } catch (uploadError) {
                    console.error("Cloudinary upload error:", uploadError);
                    // Provide more detailed error information
                    const errorMsg = uploadError.message || "Unknown upload error";
                    throw new Error(`Failed to upload image: ${errorMsg}`);
                }
            })
        );

        // Create product with image URLs
        await Product.create({
            ...productData,
            image: imagesUrl
        });

        return res.json({
            success: true,
            message: "Product added successfully"
        });

    } catch (error) {
        console.error("Add product error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to add product",
            error: error.message
        });
    }
}

// Get Product : /api/product/list
export const productList = async (req, res) => {
    try{
        const products = await Product.find({});
        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
}

// Add single product : /api/product/id
export const productById = async (req, res) => {
    try{
        const { id } = req.params;
        const product = await Product.findById(id);
        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message
        });
    }
}

// Change product inStock: /api/product/stock
export const changeStock = async (req, res) => {
    try{
        const { id, inStock } = req.body;
        const product = await Product.findByIdAndUpdate(id, { inStock});
        res.json({
            success: true,
            message: "Product stock updated successfully",
            product
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update product stock",
            error: error.message
        });
    }
}