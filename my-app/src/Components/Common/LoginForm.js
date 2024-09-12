import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBuilding,
  FaIdBadge,
  FaUserCog,
  FaMapPin,
} from "react-icons/fa";

const LoginForm = ({ isVisible, onClose }) => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    agencyName: "",
    agencyId: "",
    pincode: "",
    email: "",
    employeeName: "",
    employeeId: "",
    position: "",
    phone: "",
    regPassword: "",
  });

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    setIsLoginVisible(false);
    setIsRegisterVisible(true);
  };

  const handleCloseRegister = () => {
    setIsRegisterVisible(false);
    setIsLoginVisible(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/register', registerData);
      console.log(response.data.msg);
      setIsRegisterVisible(false);
      setPopupMessage("Registration successful! Now you can login.");
      setIsPopupVisible(true);
    } catch (error) {
      console.error("Registration failed", error.response ? error.response.data.msg : error.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/login', { username, password });
      console.log('Login successful:', response.data);
      setPopupMessage("Login successful! Redirecting to dashboard...");
      setIsPopupVisible(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      console.error("Login failed", error.response ? error.response.data.msg : error.message);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    if (popupMessage.includes("Registration")) {
      setIsLoginVisible(true);
    } else if (popupMessage.includes("Login")) {
      navigate('/dashboard');
    }
  };

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  return (
    <div>
      {/* Login Form */}
      {isVisible && isLoginVisible && (
        <div className={`login-modal ${isVisible ? "show" : ""}`}>
          <div className="login-content">
            <button onClick={handleClose} id="close-button">
              X
            </button>
            <h1>Login</h1>
            <form onSubmit={handleLoginSubmit}>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FaLock className="icon" />
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#">Forgot Password?</a>
              </div>
              <button type="submit" className="loginBtn">
                Login
              </button>
              <div className="register-link">
                <p>
                  Don't have an account?{" "}
                  <a href="#" onClick={handleRegisterClick}>
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Form */}
      {isVisible && isRegisterVisible && (
        <div className={`login-modal ${isRegisterVisible ? "show" : ""}`}>
          <div className="reg-content">
            <button onClick={handleCloseRegister} id="reg-close-button">
              X
            </button>
            <h1>Register</h1>
            <form onSubmit={handleRegisterSubmit}>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Agency Name"
                  value={registerData.agencyName}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, agencyName: e.target.value })
                  }
                  required
                />
                <FaBuilding className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="number"
                  placeholder="Agency ID"
                  value={registerData.agencyId}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, agencyId: e.target.value })
                  }
                  required
                />
                <FaIdCard className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="number"
                  placeholder="Pincode of Agency"
                  pattern="\d{6}"
                  title="Please enter exactly 6 digits"
                  value={registerData.pincode}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, pincode: e.target.value })
                  }
                  required
                />
                <FaMapPin className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  required
                />
                <FaEnvelope className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Employee Name"
                  value={registerData.employeeName}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, employeeName: e.target.value })
                  }
                  required
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="number"
                  placeholder="Employee ID"
                  value={registerData.employeeId}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, employeeId: e.target.value })
                  }
                  required
                />
                <FaIdBadge className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Position of Employee"
                  value={registerData.position}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, position: e.target.value })
                  }
                  required
                />
                <FaUserCog className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  pattern="\d{10}"
                  title="Please enter exactly 10 digits"
                  value={registerData.phone}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, phone: e.target.value })
                  }
                  required
                />
                <FaPhone className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  value={registerData.regPassword}
                  onChange={(e) => 
                    setRegisterData({ ...registerData, regPassword: e.target.value })
                  }
                  required
                />
                <FaLock className="icon" />
              </div>
              <button type="submit" className="reg-loginBtn">
                Register
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Popup Message */}
      {isPopupVisible && (
        <div className="popup-modal show">
          <div className="popup-content">
            <h2>{popupMessage}</h2>
            <button onClick={handleClosePopup} className="loginBtn">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;