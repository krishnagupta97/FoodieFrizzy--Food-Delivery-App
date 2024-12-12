import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from "react-toastify"

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = new useState("home");
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    
    const { isPopup, setIsPopup } = useContext(StoreContext);

    const navigate = useNavigate()

    const logout = () => {
        toast.success("Successfully, Logged out!!!")
        localStorage.removeItem("token")
        setToken("")
        setIsPopup(false);
        navigate("/")
    }

    const emptyCartHandler = () => {
        if(getTotalCartAmount() === 0) {
            toast.info("Cart is empty!!!");
        } else {
            navigate("/cart");
        }
    }

    return (
        <div className='navbar'>
            <Link to="/"><img src={assets.logo} alt="" className="logo" /></Link>
            <ul className="navbar-menu">
                <Link to={"/"} onClick={() => {setIsPopup(false); setMenu("home")}} className={menu=="home"?"active":""}>Home</Link>
                <a href='#explore-menu' onClick={() => {setIsPopup(false); setMenu("menu")}} className={menu=="menu"?"active":""}>Menu</a>
                <a href='#app-download' onClick={() => {setIsPopup(false); setMenu("mobile-app")}} className={menu=="mobile-app"?"active":""}>Mobile App</a>
                <a href='#footer' onClick={() => {setIsPopup(false); setMenu("contact-us")}} className={menu=="contact-us"?"active":""}>Contact Us</a>
            </ul>
            <div className="navbar-right">
                <img className='nav-icons nav-search' src={assets.search_icon} alt="" />
                <div className='navbar-search-icon'>
                    <div onClick={emptyCartHandler} ><img className='nav-icons nav-cart' src={assets.basket_icon} alt="" /></div>
                    <div className={getTotalCartAmount() == 0 ? "" : "dot"}></div>
                </div>
                {
                    !token
                    ? <button onClick={() => setShowLogin(prev => !prev)}>Sign In</button>
                    : <div className='nav-profile'>
                        <img onClick={() => setIsPopup(prev => !prev)} className='nav-icons nav-profile' src={assets.profile_icon} alt="" />
                        <ul className={`nav-profile-dropdown ${isPopup ? "popup" : ""}`}>
                            <li onClick={() => {setIsPopup(false); navigate("/myorders");}}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                            <hr />
                            <li onClick={logout}><img src={assets.logout_icon} alt="" />Logout</li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar
