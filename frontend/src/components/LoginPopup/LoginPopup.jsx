import React, { useContext, useState, useEffect } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from "axios"
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
  const { backendUrl, setToken, setIsPopup, setLoader } = useContext(StoreContext);

  const [currState, setCurrState] = new useState("Login");
  const [data, setData] = new useState({
    name: "",
    email: "",
    password: "",
  });

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(false);

  const onChangeHandler = (e) => {
    setData(pre => ({ ...pre, [e.target.name]: e.target.value }));
    setEmail(data.email);
  }

  const sendOtp = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/v/sendOtp", { email });
      if (response.data.success) {
        toast.success("OTP sent to your email");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setStep(false);
      console.error(error);
      toast.error("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      setLoader(true);
      const response = await axios.post(backendUrl + "/api/v/verifyOtp", { email, otp });
      if (response.data.success) {
        setToken(response.data.token)
        localStorage.setItem("token", response.data.token)
        // toast.success("Account verified, Logged in");
        setIsPopup(false);
        setShowLogin(false)
        setStep(false);
        setTimeout(() => {
          setLoader(false);
        }, 500)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error verifying OTP");
    }
  };

  const onLogin = async (evt) => {
    evt.preventDefault();

    let newbackendUrl = backendUrl;
    newbackendUrl += currState === "Login" ? "/api/user/login" : "/api/user/register";

    if (currState === "Login") setLoader(true);
    const response = await axios.post(newbackendUrl, data);
    if (response.data.success) {
      if (currState !== "Login") {
        setStep(true);
        await sendOtp();
      } else {
        setToken(response.data.token)
        localStorage.setItem("token", response.data.token)
        setIsPopup(false);
        setShowLogin(false)
        if (currState === "Login") setLoader(false);
      }
    } else {
        if (currState === "Login") setLoader(false);
    }
  }

  const getBackHandler = () => {
    setStep(false);
  }

  useEffect(() => {
    setEmail(data.email);
  }, [data.email]);

  return (
    <div className='login-popup'>
      {

        step ?
          <div className='login-popup-container'>
            <div className='login-popup-inputs'>
              <h3 className='login-popup-title'>Enter the OTP sent to your email</h3>
              <input type="text" name='otp' value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" required />
              <p onClick={getBackHandler}>Want to Change Email ?</p>
              <button onClick={verifyOtp}>Verify OTP</button>
            </div>
          </div> :
          <form onSubmit={onLogin} className='login-popup-container'>


            <div className='login-popup-title'>
              <h2>{currState}</h2>
              <img onClick={() => setShowLogin(prev => !prev)} src={assets.cross_icon} alt="" />
            </div>
            <div className='login-popup-inputs'>
              {
                currState === "Login"
                  ? <></>
                  : <input onChange={onChangeHandler} name='name' value={data.name} type="text" placeholder='Your Name' required />
              }
              <input onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Your Email' required />
              <input onChange={onChangeHandler} name='password' value={data.password} type="password" placeholder='Password' required />
            </div>
            <button type='submit'>
              {currState === "Login" ? "Login" : "Create Account"}
            </button>
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>
            {
              currState === "Login"
                ? <p>Create a new Account? <span onClick={() => setCurrState("Sign Up")}>Click Here</span></p>
                : <p>Already have an Account? <span onClick={() => setCurrState("Login")}>Login Here</span></p>
            }

          </form>
      }
    </div>
  )
}

export default LoginPopup
