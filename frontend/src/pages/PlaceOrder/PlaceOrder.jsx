import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './PlaceOrder.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const PlaceOrder = () => {
  const { getTotalCartAmount, token, cartItems, food_list, backendUrl } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })

  const onChangeHandler = (e) => {
    setData(pre => ({ ...pre, [e.target.name]: e.target.value }));
  }

  const placeOrder = async (evt) => {
    evt.preventDefault();
    try {
        let orderItems = [];
        food_list.forEach(item => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] };
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            userId: token.userId,
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2,
        };

        const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
            headers: { token },
        });

        // dummy card :=   5267 3181 8797 5449
        if (response.data.success) {
            const { id, amount } = response.data.data; // Razorpay orderId and amount
            const options = {
                key: "rzp_test_GDetf72h7NEXpM",
                amount,
                currency: "INR",
                name: "FoodieFrizzy",
                description: "Order Payment",
                order_id: id,
                handler: async function (response) {
                    try {
                        await axios.post(`${backendUrl}/api/order/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        navigate("/myorders");
                    } catch (err) {
                        alert("Payment verification failed");
                        console.error(err);
                    }
                },
                prefill: {
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    contact: data.phone,
                },
                theme: {
                    color: "#F37254",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            alert("Error placing the order");
        }
    } catch (err) {
        alert("Failed to connect to the server");
        console.error(err);
    }
};
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required onChange={onChangeHandler} name='firstName' value={data.firstName} type="text" placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={data.lastName} type="text" placeholder='Last Name' />
        </div>

        <input required onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Email Address' />
        <input required onChange={onChangeHandler} name='street' value={data.street} type="text" placeholder='Street' />

        <div className="multi-fields">
          <input required onChange={onChangeHandler} name='city' value={data.city} type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={data.state} type="text" placeholder='State' />
        </div>

        <div className="multi-fields">
          <input required onChange={onChangeHandler} name='zipcode' value={data.zipcode} type="text" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={data.country} type="text" placeholder='Country' />
        </div>

        <input required onChange={onChangeHandler} name='phone' value={data.phone} type="number" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
