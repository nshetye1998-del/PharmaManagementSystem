import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cashlogin.css";

const Cashlogin = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://api-5e1h.onrender.com/pharmacy/counter/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/navbar");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h3>PHARMACY</h3>
        </div>
        <div className="login-right">
          <h2>Login</h2>
          {/* <p>Please enter your credentials to log in</p> */}
          <div className="input-group">
            <input
              type="text"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="login-btn" onClick={handleLogin}>Login</button>
   <Link to="/adminlogin">Admin</Link>
        </div>
      </div>
    </div>
  );
};

export default Cashlogin;
