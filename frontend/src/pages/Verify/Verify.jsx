import React, { useContext, useEffect } from 'react'
import "./Verify.css"
import { useNavigate, useSearchParams } from "react-router-dom"
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const { backendUrl, setLoader } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        setLoader(true);
        const response = await axios.post(backendUrl + "/api/order/verify", {success, orderId});
        if(response.data.success) {
            setTimeout(() =>{
                setLoader(false);
            }, 1000);
            navigate("/myOrders");
        } else {
            navigate("/")
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [])

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify
