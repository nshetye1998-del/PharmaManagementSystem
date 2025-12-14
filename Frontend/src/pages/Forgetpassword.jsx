import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cashlogin.css";

const Forgetpassword = () => {
  const [Email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!Email) {
      setEmailError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      setEmailError("Email is invalid");
      return;
    } else {
      setEmailError("");
    }

    try {
      setShowAnimation(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/users/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Email }),
        }
      );

      if (response.ok) {
        setMessage("Your new password has been sent to your email");
        setTimeout(() => {
          setShowAnimation(false);
          navigate("/");
        }, 5000);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to send new password: ${errorData.message}`);
        setShowAnimation(false);
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`);
      setShowAnimation(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h1>Pharmacy</h1>
        </div>
        <div className="login-right">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive your new password</p>
          {message && <p className="message">{message}</p>}
          {showAnimation ? (
            <div className="animation">
              <div className="loader"></div>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <span className="error">{emailError}</span>}
              </div>
              <button type="submit" className="login-btn">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forgetpassword;
