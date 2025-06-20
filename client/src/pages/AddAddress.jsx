import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

// Input Field Component
const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition"
    type={type}
    placeholder={placeholder}
    name={name}
    onChange={handleChange}
    value={address[name]}
    required
  />
);

const AddAddress = () => {

  const {axios,user,navigate} = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Submit logic here

    try {
      const {data} = await axios.post('api/address/add',{address})

      if(data.success){
        toast.success(data.message);
        navigate('/cart');
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if(!user){
      navigate('/cart');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen mt-20 pb-16 px-4 md:px-20 flex justify-center items-start">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-6xl gap-10 bg-white shadow-lg rounded-lg p-6">
        {/* Form Section */}
        <div className="flex-1">
          <p className="text-3xl font-semibold text-gray-700 mb-2">
            Add <span className="text-primary">Shipping Address</span>
          </p>
          <p className="text-gray-500 mb-6">
            Please provide the necessary information to deliver your order.
          </p>

          <form onSubmit={onSubmitHandler} className="space-y-5 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="firstName" type="text" placeholder="First Name" />
              <InputField handleChange={handleChange} address={address} name="lastName" type="text" placeholder="Last Name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="email" type="email" placeholder="Email" />
              <InputField handleChange={handleChange} address={address} name="phone" type="text" placeholder="Phone" />
            </div>

            <InputField handleChange={handleChange} address={address} name="street" type="text" placeholder="Street Address" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="city" type="text" placeholder="City" />
              <InputField handleChange={handleChange} address={address} name="state" type="text" placeholder="State" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField handleChange={handleChange} address={address} name="country" type="text" placeholder="Country" />
              <InputField handleChange={handleChange} address={address} name="zipCode" type="number" placeholder="Zip Code" />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-primary text-white py-3 rounded-md font-medium hover:bg-primary-dull transition"
            >
              Save Address
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block md:w-[40%]">
          <img
            className="w-full h-full object-contain"
            src={assets.add_address_iamge}
            alt="address illustration"
          />
        </div>
      </div>
    </div>
  );
};


export default AddAddress;
