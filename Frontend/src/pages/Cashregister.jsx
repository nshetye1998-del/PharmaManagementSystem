import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cashlogin.css"; // Reuse the same CSS for consistent styling

const Cashregister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    let valid = true;
    let tempErrors = {};

    if (!name) {
      tempErrors.name = "Name is required";
      valid = false;
    }
    if (!email) {
      tempErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is invalid";
      valid = false;
    }
    if (!dob) {
      tempErrors.dob = "Date of Birth is required";
      valid = false;
    }
    if (!phone) {
      tempErrors.phone = "Phone number is required";
      valid = false;
    }
    if (!address) {
      tempErrors.address = "Address is required";
      valid = false;
    }
    if (!salary) {
      tempErrors.salary = "Salary is required";
      valid = false;
    } else if (isNaN(salary)) {
      tempErrors.salary = "Salary must be a number";
      valid = false;
    }
    if (!password) {
      tempErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(tempErrors);

    if (valid) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/pharmacy/users/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              Email: email,
              dob: dob,
              phone: phone,
              address: address,
              salary: parseInt(salary),
              password: password,
            }),
          }
        );

        console.log("Response status:", response.status); // Debugging line

        if (response.ok) {
          alert("Registration successful");
          navigate("/"); // Redirect to login page after successful registration
        } else {
          const errorData = await response.json();
          console.log("Error data:", errorData); // Debugging line
          let errorMessage =
            "Registration failed due to a server error. Please try again later.";
          if (errorData.message) {
            errorMessage = `Registration failed: ${errorData.message}`;
          }
          alert(errorMessage);
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
        alert(
          "Registration failed due to a network error. Please try again later."
        );
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h1>Pharmacy</h1>
        </div>
        <div className="login-right">
          <h2>Register</h2>
          <p>Create your account</p>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="input-group">
              <input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              {errors.dob && <span className="error">{errors.dob}</span>}
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && (
                <span className="error">{errors.address}</span>
              )}
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
              {errors.salary && <span className="error">{errors.salary}</span>}
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            <button type="submit" className="login-btn">
              Register
            </button>
          </form>
          <Link to="/" className="register-link">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cashregister;
