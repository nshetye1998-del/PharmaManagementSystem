import React, { useState, useEffect, useRef } from "react";
import "./Maindashboard.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Dashboard from "./Dashboard";
import Drug from "../Admin/Drug";
import Sale from "../Admin/Sale";
import Purchase from "../Admin/Purchase";
import HistorySale from "../Admin/HistorySale";
import BillingInvoice from "./BillingInvoice";
import Company from "../Admin/Company";
import AddCounter from "./Addcounter";
import Billingdata from "./Billingdata";

const Maindashboard = () => {
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [items, setItems] = useState([]);
  const qrRef = useRef(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [orderId] = useState("ORD-12345");
  const [orderDate] = useState(new Date().toLocaleDateString());
  const [userAddress] = useState("123 User Street, City, Country");
  const location = useLocation();
  const navigate = useNavigate();
  const condition = localStorage.getItem("condition");

  const logout = () => {
    localStorage.removeItem("condition");
    navigate(`/adminlogin`);
  };

  const validate = () => {
    if (condition !== "Pass") {
      navigate(`/adminlogin`);
    }
  };

  useEffect(() => {
    validate();

    const savedItems = localStorage.getItem("savedItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }

    const uniqueId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setInvoiceId(uniqueId);
  }, [condition]);

  const handleLinkClick = (text) => {
    if (activeLink === text) {
      // Force reload if clicking on the active link
      window.location.reload();
    } else {
      setActiveLink(text);
    }
  };

  const calculateTotalAmount = (sell_price, quantity) => {
    return sell_price * quantity;
  };

  const calculateTax = (amount) => {
    return amount * 0.18; // 18% tax rate
  };

  const downloadInvoice = () => {
    // Implementation for downloading invoice
  };

  return (
    <>
      <div className="billing_container">
        <div className="container">
          <div className="sidebar">
            <h3>
              {" "}
              <FontAwesomeIcon icon={faUserTie} /> &nbsp;
              Admin
            </h3>
            <br></br>
            <div className="links">
              <Link
                onClick={() => handleLinkClick("Dashboard")}
                className={`bold ${
                  activeLink === "Dashboard" ? "active-link" : ""
                }`}
              >
                Dashboard
              </Link>
              <Link
                onClick={() => handleLinkClick("Drug")}
                className={activeLink === "Drug" ? "active-link" : ""}
              >
                Drug
              </Link>
              <Link
                onClick={() => handleLinkClick("Company")}
                className={activeLink === "Company" ? "active-link" : ""}
              >
                Company
              </Link>
              <hr />

              <Link
                onClick={() => handleLinkClick("Sale")}
                className={activeLink === "Sale" ? "active-link" : ""}
              >
                Sale
              </Link>
              <Link
                onClick={() => handleLinkClick("Purchase")}
                className={activeLink === "Purchase" ? "active-link" : ""}
              >
                Purchase
              </Link>
              <Link
                onClick={() => handleLinkClick("HistorySale")}
                className={activeLink === "HistorySale" ? "active-link" : ""}
              >
                History Sale
              </Link>
              <hr />
              <Link
                onClick={() => handleLinkClick("billingdata")}
                className={activeLink === "billingdata" ? "active-link" : ""}
              >
                Billing and Invoice
              </Link>
              <Link
                onClick={() => handleLinkClick("addcounter")}
                className={activeLink === "addcounter" ? "active-link" : ""}
              >
                ADD Counter
              </Link>
              <button className="logout" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
          <div className="center">
            <div className="content">
              {activeLink === "Dashboard" ? (
                <Dashboard />
              ) : activeLink === "Drug" ? (
                <Drug />
              ) : activeLink === "Company" ? (
                <Company />
              ) : activeLink === "Sale" ? (
                <Sale />
              ) : activeLink === "Purchase" ? (
                <Purchase />
              ) : activeLink === "HistorySale" ? (
                <HistorySale />
              ) : activeLink === "billingdata" ? (
                <Billingdata />
              ) : activeLink === "addcounter" ? (
                <AddCounter />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maindashboard;
