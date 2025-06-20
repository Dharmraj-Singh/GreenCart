import React, { useEffect } from 'react'
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
const SellerLogin = () => {

    const {isSeller,setIsSeller,navigate, axios} = useAppContext();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const {data} = await axios.post("/api/seller/login", {email, password});
            if (data.success) {
                setIsSeller(true);
                navigate("/seller");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Login failed");
        }
        
    }

    useEffect(() => {
        if (isSeller) {
            navigate("/seller");
        }
    }, [isSeller]);
  return !isSeller &&(
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>

        <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
            <p className='text-2xl font-medium m-auto'><span className='text-primary'>Seller</span> Login</p>

            <div className='w-full'>
                <p>Email</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' placeholder='Enter your email' required/>
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' placeholder='Enter your password' required/>
            </div>
            <button className='bg-primary text-white rounded w-full p-2 mt-4 hover:bg-primary/90 transition-all' type='submit'>
                Login
            </button>
        </div>

    </form>
  )
}

export default SellerLogin