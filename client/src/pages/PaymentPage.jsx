import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const RAZORPAY_KEY_ID = "rzp_test_YourKeyHere"; // TODO: Replace with your Razorpay key_id

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { axios, user } = useAppContext();
  const { amount, address, cartItems } = location.state || {};

  useEffect(() => {
    if (!amount || !address || !cartItems) {
      navigate("/cart");
      return;
    }
    const startPayment = async () => {
      await loadRazorpayScript();
      try {
        // Create order on backend
        const { data } = await axios.post("/api/payment/create-order", {
          amount: Math.round(amount * 100), // Razorpay expects paise
        });
        if (!data.success) throw new Error(data.message);
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "GreenCart Grocery Delivery",
          description: "Order Payment",
          order_id: data.order.id,
          handler: async function (response) {
            // You can verify payment on backend here
            alert("Payment Successful");
            navigate("/my-orders");
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: "#22c55e",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        alert("Payment initialization failed: " + err.message);
        navigate("/cart");
      }
    };
    startPayment();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-semibold mb-4">Processing Payment...</h2>
      <p className="text-gray-500">Please wait while we redirect you to Razorpay.</p>
    </div>
  );
};

export default PaymentPage; 