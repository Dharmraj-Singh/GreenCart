import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests

// Set axios base URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isSellerLoading, setIsSellerLoading] = useState(true); // Track loading state
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // Fetch Seller Status
  const fetchSeller = async () => {
    try {
      setIsSellerLoading(true);
      const { data } = await axios.get("/api/seller/is-auth");
      if (data && data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      // Silently handle authentication errors (401) - user is not authenticated
      if (error.response && error.response.status === 401) {
        setIsSeller(false);
      } else if (error.response && error.response.status >= 500) {
        // Server errors - log but don't set seller status
        console.error("Server error checking seller auth:", error.response.data);
        setIsSeller(false);
      } else {
        // Network errors or other issues
        setIsSeller(false);
      }
    } finally {
      setIsSellerLoading(false);
    }
  };

  // Fetch User Auth Status, User Data and Cart Items

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch (error) {
      setUser(null);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  // Update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  // Remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("Removed from Cart");
  };

  // Get Cart Item Count
  const getCartCount = () => {
    let count = 0;
    for (const key in cartItems) {
      count += cartItems[key];
    }
    return count;
  };
  // Get Cart Total Price
  const getCartTotal = () => {
    let total = 0;
    for (const key in cartItems) {
      const item = products.find((product) => product._id === key);
      if (item) {
        total += item.offerPrice * cartItems[key];
      }
    }
    return Math.round(total * 100) / 100;
  };

  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  // Update Database Cart Items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        
        // Only show error if there's an actual error message
        if (data && !data.success && data.message) {
          // Silently handle cart update - don't show toast for normal operations
          console.warn("Cart update warning:", data.message);
        }
      } catch (error) {
        // Only show error toast for client-side errors (network, etc.)
        // Don't show for 401 errors (user not logged in) - this is expected
        if (error.response) {
          if (error.response.status === 401) {
            // User not logged in - this is fine, cart is stored locally
            console.log("Cart update skipped: User not authenticated");
          } else if (error.response.status >= 500) {
            // Server error - log but don't spam user with toasts
            console.error("Cart update server error:", error.response.data);
          } else {
            // Other client errors (400, 403, etc.) - log but don't show toast
            console.warn("Cart update error:", error.response.data);
          }
        } else {
          // Network error - only show if it's unexpected
          console.error("Cart update network error:", error.message);
        }
      }
    }

    // Only update cart if user is logged in
    if (user) {
      updateCart();
    }
  }, [cartItems, user]);

  const value = {
    getCartTotal,
    getCartCount,
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    isSellerLoading,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    axios,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
