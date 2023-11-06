import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/user/create",
        { 
          username,
          email,
          password,
        }
      );
      console.log(response.data);
      setIsRegistered(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regex.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain a mix of uppercase and lowercase letters and numbers"
      );
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="container-fluid register-bg" style={{ backgroundColor: "#2EB5D0" }}>
      <div className="row" >
        <div className="col-1"></div>
        <div className="col-10 center-container">
        <div className="col-5 box1">
          <h3 className="pop">Register Form</h3>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="attr">
                Username:
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ marginBottom: "15px" }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="attr">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ marginBottom: "15px" }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="attr">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              {passwordError && (
                <div className="error-message text-danger">{passwordError}</div>
              )}
            </div>
            <button type="submit" className=" cutie ">
              Submit
            </button>
            {isRegistered && (
              <div className="success-message text-success">Registration successful!</div>
            )}
          </form>
          <div className='reg'> 
           Already have an account? <Link to='/login'><span className='regtxt2'>Login Now!</span></Link>
        </div>
        </div>
        </div>
        <div className="col-6">
        <div className="row">
      </div>
        </div>
      </div>
    </div>
  );
}

export default Register;