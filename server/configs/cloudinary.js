import {v2 as cloudinary} from 'cloudinary';

const connectCloudinary = async () => {
    try {
        // Check if required environment variables are defined
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.warn("Warning: Cloudinary credentials are not fully configured. Some features may not work.");
            return;
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log("Cloudinary configured successfully");
    } catch (error) {
        console.error("Cloudinary configuration failed:", error.message);
        // Don't exit the server if Cloudinary fails - it's not critical for basic functionality
    }
}

export default connectCloudinary;