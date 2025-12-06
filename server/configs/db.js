import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables. Please check your .env file.");
    }

    // Clean the connection string - remove trailing slashes and whitespace
    let mongoURI = process.env.MONGODB_URI.trim();
    
    // Extract the base URI and check if database name is already specified
    // MongoDB URI format: mongodb+srv://user:pass@host/database?options
    const uriParts = mongoURI.split('?');
    const baseUri = uriParts[0];
    const options = uriParts[1] ? `?${uriParts[1]}` : '';
    
    // Check if database name is already in the URI (after the last / in host part)
    // Pattern: host/database or host/database?options
    const hostAndDbMatch = baseUri.match(/mongodb(\+srv)?:\/\/[^/]+\/([^?]+)/);
    
    let finalURI;
    if (hostAndDbMatch && hostAndDbMatch[2]) {
      // Database already specified in URI
      finalURI = mongoURI;
      console.log(`Using existing database from connection string`);
    } else {
      // No database specified, add greencart
      if (baseUri.endsWith('/')) {
        finalURI = `${baseUri}greencart${options}`;
      } else {
        finalURI = `${baseUri}/greencart${options}`;
      }
    }

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Connection options for MongoDB Atlas
    const connectionOptions = {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Log connection attempt (safely, without password)
    const safeURI = finalURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
    console.log(`Attempting to connect to MongoDB...`);
    console.log(`Connection string: ${safeURI}`);

    await mongoose.connect(finalURI, connectionOptions);
    
    console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("\n❌ MongoDB connection failed!");
    console.error("Error:", error.message);
    
    // Check for specific error types
    if (error.message.includes("ENOTFOUND") || error.message.includes("could not connect")) {
      console.error("\n🔍 Possible issues:");
      console.error("1. IP Whitelist: Your current IP address is not whitelisted in MongoDB Atlas");
      console.error("   → Go to: https://cloud.mongodb.com/ → Security → Network Access");
      console.error("   → Click 'Add IP Address' → Select 'Allow Access from Anywhere' (0.0.0.0/0) for testing");
      console.error("   → Or add your specific IP address");
      console.error("\n2. Connection String: Verify your MONGODB_URI in the .env file");
      console.error("   → Format should be: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net");
      console.error("   → Make sure there are no extra spaces or characters");
      console.error("\n3. Credentials: Verify your MongoDB username and password are correct");
      console.error("   → Check your MongoDB Atlas dashboard for the correct credentials");
      console.error("\n4. Network: Check your internet connection");
    } else {
      console.error("\nPlease ensure:");
      console.error("1. You have a .env file in the server directory");
      console.error("2. MONGODB_URI is set correctly in your .env file");
      console.error("3. Your MongoDB connection string is valid");
      console.error("4. Your IP address is whitelisted in MongoDB Atlas");
    }
    
    process.exit(1);
  }
};

export default connectDB;
