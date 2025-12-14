import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const goToNextPage = () => {
    localStorage.setItem("condition", "Pass");
    navigate(`/maindashboard`);
  };

  const [UserName, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const Login = (e) => {
    e.preventDefault();
    if (UserName === "") {
      alert("Please Enter Valid Username");
    } else if (Password === "") {
      alert("Please Enter Valid Password");
    } else if (UserName === "Pharma" && Password === "pharma123") {
      alert("Login Successful");
      setUsername("");
      setPassword("");
      goToNextPage();
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h3>PharmaXpert</h3>
        </div>
        <div className="login-right">
          <h2> ADMIN LOGIN</h2>

          <form onSubmit={Login}>
            <div className="input-group">
              <input
                type="text"
                name="Username"
                onChange={handleUsername}
                placeholder="Username"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                onChange={handlePassword}
                placeholder="Password"
              />
            </div>
            <div>
              <button className="login-btn" type="submit">
                Login
              </button>
            </div>
          </form>
          <Link to="/">CASH LOGIN</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
