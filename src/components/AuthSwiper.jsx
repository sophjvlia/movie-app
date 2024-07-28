import React, { useState, useRef, useEffect }  from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '../styles/AuthSwiper.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthSwiper = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [token, setToken] = useState('');
  const swiperRef = useState(null);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://booking-system-api-sophjvlias-projects.vercel.app/login', { email, password });
      const { token } = response.data;
      setToken(token);

      setTimeout(() => {
        setShowPopup(false);
        navigate('/movies');
      }, 1000);
    } catch (error) {
      console.error('Login Error:', error.response.data.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    
    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      return;
    }

    setPasswordError(false);

    try {
      const response = await axios.post('https://booking-system-api-sophjvlias-projects.vercel.app/signup', { email, password });

      const result = response.json();

      // Set the message and show the popup
      setMessage("You have successfully registered!");
      setShowPopup(true);
      
    } catch (error) {
      setMessage(error.response.message);
      setShowPopup(true);
    }
  };

  useEffect(() => {
    const signUpSlide = document.getElementById('signUpSlide');
    const logInSlide = document.getElementById('logInSlide');
    
    if (signUpSlide && swiperRef.current) {
      signUpSlide.addEventListener("click", () => {
        swiperRef.current.swiper.slideNext();
      });
    }
    
    if (logInSlide && swiperRef.current) {
      logInSlide.addEventListener("click", () => {
        swiperRef.current.swiper.slidePrev();
      });
    }

    // Cleanup listener on component unmount
    return () => {
      if (signUpSlide && swiperRef.current) {
        signUpSlide.removeEventListener("click", () => {
          swiperRef.current.swiper.slideNext();
        });
      }

      if (logInSlide && swiperRef.current) {
        logInSlide.removeEventListener("click", () => {
          swiperRef.current.swiper.slidePrev();
        });
      }
    };
  }, []);

  return (
    <div className="auth-swiper">
      <Swiper ref={swiperRef} spaceBetween={50} slidesPerView={1}>
        <SwiperSlide>
          <div style={{ backgroundColor: "rgb(230, 230, 250)" }}>
            <h1>Log In</h1>
            <form onSubmit={handleLogin}>
              <div>
                <label htmlFor="loginEmail">Email</label>
                <input type="email" id="loginEmail" name="loginEmail"  
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                required />
              </div>
              <div>
                <label htmlFor="loginPassword">Password</label>
                <input
                  type="password"
                  id="loginPassword"
                  name="loginPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Log in</button>
              <small>Don't have an account? <span id="signUpSlide">Sign up</span></small>
            </form>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div style={{ backgroundColor: "rgb(230, 230, 250)" }}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSignup}>
              <div>
                <label htmlFor="signupEmail">Email:</label>
                <input type="email"
                id="signupEmail" 
                name="signupEmail" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                required
                />
              </div>
              <div>
                <label htmlFor="signupPassword">Password:</label>
                <input
                  type="password"
                  id="signupPassword"
                  name="signupPassword"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  required
                />
                <small 
                  id="errorMessage" 
                  style={{ color: passwordError ? 'red' : 'inherit' }}
                >
                  * Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.
                </small>
              </div>
              <button type="submit">Sign Up</button>
              <small>Have an account? <span id="logInSlide">Log in</span></small>
            </form>
          </div>
        </SwiperSlide>
      </Swiper>

      {showPopup && (
        <>
          <div className="overlay" onClick={() => setShowPopup(false)}></div>
          <div className="popup">
            <p>{message}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthSwiper;
