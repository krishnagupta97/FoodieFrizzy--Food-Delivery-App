import React, { useContext, useState } from 'react'
import "./Home.css"
import axios from "axios"
import { StoreContext } from '../../context/StoreContext';
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';

function Home() {

    const { backendUrl, setToken } = useContext(StoreContext);

    const [currForm, setCurrForm] = useState("login");
    const navigate = useNavigate();

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    const onSubmitHandler = async () => {
        if(currForm === "login") {
            try {
                const response = await axios.post(backendUrl +"/api/admin/login", { loginEmail, loginPassword });
                if(response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem("adminToken", response.data.token)
                    navigate("/add");
                    toast.success("Logged In Successfully !!!");
                } else {
                    toast.error("Cannot login right now !")
                }
            } catch (error) {
                console.log(error);
                toast.error("Error!");
            }
        } else {
            if(password != confirmPassword) {
                alert("Password Mismatched! Enter it correctly")
                return;
            }
            try {
                const response = await axios.post(backendUrl +"/api/admin/register", { name, email, password });
                if(response.data.success) {
                    setToken(response.data.token)
                    localStorage.setItem("adminToken", response.data.token)
                    toast.success("Registered Successfully !!!");
                    navigate("/add");
                } else {
                    toast.error("Cannot Register Right Now !")
                }                
            } catch (error) {
                
            }
        }
    }

    return (
        <div className='container'>
            <div className='form-container'>
                {
                    currForm === "login"
                        ? <div className='login-container'>
                            <form className='login-form'>
                                <div className='input-conatiner'>
                                    <input
                                        className="inputbox"
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        value={loginEmail}
                                        type="email"
                                        name="email"
                                        placeholder='Email Address'
                                    />
                                    <input
                                        className="inputbox"
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        value={loginPassword}
                                        type="password"
                                        name="password"
                                        placeholder='Enter Password'
                                    />
                                </div>
                            </form>
                        </div>
                        : <div className='register-container'>
                            <form className='register-form'>
                                <div className='input-conatiner'>
                                    <input
                                        className="inputbox"
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        type="text"
                                        name="name"
                                        placeholder='Enter Your Name'
                                    />
                                    <input
                                        className="inputbox"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email"
                                        name="email"
                                        placeholder='Email Address'
                                    />
                                    <input
                                        className="inputbox"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="password"
                                        name="password"
                                        placeholder='Enter Password'
                                    />
                                    <input
                                        className="inputbox"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                        type="password"
                                        name="confirmPassword"
                                        placeholder='Confirm Password'
                                    />
                                </div>
                            </form>
                        </div>
                }

                <div className='btn-container'>
                    <div className='btns'>
                        <button className={`login-btn ${currForm == "login" ? "active" : ""}`} onClick={() => setCurrForm("login")}>Login</button>
                        <button className={`register-btn ${currForm != "login" ? "active" : ""}`} onClick={() => setCurrForm("sign up")}>Sign up</button>
                    </div>
                    <div className='submit-btn'>
                        <button onClick={onSubmitHandler}>{currForm === "login" ? "Login" : "Create Account"}</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home
