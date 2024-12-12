import React, { useContext } from 'react'
import "./Order.css"
import { useState } from 'react'
import axios from 'axios'
import { toast } from "react-toastify"
import { useEffect } from 'react'
import { assets } from "../../assets/assets"
import { StoreContext } from '../../context/StoreContext'

const Order = () => {

  const {backendUrl} = useContext(StoreContext);
  
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async (req, res) => {
    const response = await axios.get(backendUrl + "/api/order/list");
    if(response.data.success) {
      // res.json({success: true, data: response});
      setOrders(response.data.data);
      console.log(response.data.data);
    } else {
      toast.error("Error!!!");
    }
  }

  const statusHandler = async (e, orderId) => {
    const response = await axios.post(backendUrl + "/api/order/status", {orderId, status: e.target.value})
    if(response.data.success) {
      await fetchAllOrders();
    } else {
      toast.error("Error!!!")
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='order order-add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {
          [...orders].reverse().map((order, idx) => {
            return (
              <div key={idx} className="order-item">
                <img src={assets.parcel_icon} alt="" />
                <div>
                  <p className="order-item-food">
                    {
                      order.items.map((item, index) => {
                        if(index === order.items.length - 1) 
                          return item.name + " * " + item.quantity
                        else 
                          return item.name + " * " + item.quantity + ", "
                      })
                    }
                  </p>
                  <p className='order-item-name'>
                    { order.address.firstName + " " + order.address.lastName }
                  </p>
                  <div className='order-item-address'>
                    <p>{ order.address.street + ", "}</p>
                    <p>{ order.address.city + ", " + order.address.state + ", " + order.address.country + order.address.zipcode }</p>
                  </div>
                  <p className='order-item-phone'>{order.address.phone}</p>
                </div>
                <p>Items : {order.items.length}</p>
                <p>${ order.amount }</p>
                <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Order
