import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./Navbar.css";
import Counter from "../pages/Counter.jsx";
import Inventory from "../pages/Inventory";
import Todayorder from "./Todayorder";
import Pastorder from "./Pastorder";

const Navbar = () => {
  const [activeButton, setActiveButton] = useState("counter");
  const [items, setItems] = useState([]);
  // const qrRef = useRef(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [orderId] = useState("ORD-12345");
  const [orderDate] = useState(new Date().toLocaleDateString());
  const [userAddress] = useState("123 User Street, City, Country");
  const location = useLocation();
  const navigate = useNavigate();
  const condition = localStorage.getItem("condition");
  const renderComponent = () => {
    switch (activeButton) {
      case "counter":
        return <Counter />;
      case "todaysOrder":
        return <Todayorder />;
      case "pastOrder":
        return <Pastorder />;
      case "inventory":
        return <Inventory />;
      default:
        return null;
    }
  };
  const logout = () => {
    localStorage.removeItem("condition");
    navigate(`/`);
  };

  const validate = () => {
    if (condition !== "Pass") {
      navigate(`/navbar`);
    }
  };

  useEffect(() => {
    validate();
  }, [condition]);

  return (
    <div className="navbar">
      <div className="navbar-buttons">
      <button onClick={() => setActiveButton("counter")}>Counter</button>
      <button onClick={() => setActiveButton("todaysOrder")}>Todays Order</button>
      <button onClick={() => setActiveButton("pastOrder")}>Past Order</button>
      <button onClick={() => setActiveButton("inventory")}>Inventory</button>
      <button onClick={logout}>Logout</button>
      

      </div>
      
      
      <div className="component-container">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Navbar;
