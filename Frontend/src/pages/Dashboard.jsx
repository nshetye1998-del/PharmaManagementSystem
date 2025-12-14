import React, { useEffect, useState } from "react";
import SaleReport from "./Salereport";
import PurchaseReport from "./Purchasereport"; // Import the PurchaseReport component
import Expired from "./Expired"; // Import the Expired component
import Store from "./Store"; // Import the Store component
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [error, setError] = useState(null);
  const [historySales, setHistorySales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [activeTab, setActiveTab] = useState("purchases");
  const [activeComponent, setActiveComponent] = useState("");

  const fetchTotalCustomers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/users/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setTotalCustomers(responseData.length);
    } catch (error) {
      console.error("Failed to fetch total customers:", error);
      setError("Failed to fetch total customers. Please try again.");
    }
  };

  const fetchTotalSuppliers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/companies/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setTotalSuppliers(responseData.length);
    } catch (error) {
      console.error("Failed to fetch total suppliers:", error);
      setError("Failed to fetch total suppliers. Please try again.");
    }
  };

  const fetchTotalProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/drug/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setTotalProducts(responseData.length);
    } catch (error) {
      console.error("Failed to fetch total products:", error);
      setError("Failed to fetch total products. Please try again.");
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/invoice/get/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log(responseData);
      setTotalInvoice(responseData.length);
      let totalAmount = 0;
      let totalCostAmount = 0;
      responseData.forEach((invoice) => {
        invoice.items.forEach((item) => {
          totalAmount += item.totalAmount;
          totalCostAmount += item.totalcostamount;
        });
      });

      const profit = totalAmount - totalCostAmount;
      console.log(profit);
      setTotalRevenue(profit);
    } catch (error) {
      console.error("Failed to fetch total revenue:", error);
      setError("Failed to fetch total revenue. Please try again.");
    }
  };

  const fetchHistorySales = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/historysale/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const sortedData = responseData.sort((a, b) => (a._id < b._id ? 1 : -1));
      setHistorySales(sortedData.slice(0, 5));
      setDisplayData(sortedData.slice(0, 5));
      setActiveTab("historySales");
    } catch (error) {
      console.error("Failed to fetch history sales:", error);
      setError("Failed to fetch history sales. Please try again.");
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/purchase/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const sortedData = responseData.sort((a, b) => (a._id < b._id ? 1 : -1));
      setPurchases(sortedData.slice(0, 5));
      setDisplayData(sortedData.slice(0, 5));
      setActiveTab("purchases");
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
      setError("Failed to fetch purchases. Please try again.");
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/counter/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const sortedData = responseData.sort((a, b) => (a._id < b._id ? 1 : -1));
      const customerData = sortedData
        .map((customer) => ({
          id: customer.id,
          password: customer.password,
        }))
        .slice(0, 5);
      setCustomers(customerData);
      setDisplayData(customerData);
      setActiveTab("customers");
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setError("Failed to fetch customers. Please try again.");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/companies/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const formattedSuppliers = responseData.map((supplier) => ({
        name: supplier.name,
        address: supplier.address,
        phone: supplier.phone,
        createdAt: supplier.createdAt,
      }));
      setSuppliers(formattedSuppliers.slice(0, 5));
      setDisplayData(formattedSuppliers.slice(0, 5));
      setActiveTab("suppliers");
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
      setError("Failed to fetch suppliers. Please try again.");
    }
  };

  useEffect(() => {
    fetchTotalCustomers();
    fetchTotalSuppliers();
    fetchTotalProducts();
    fetchTotalRevenue();
    fetchPurchases();
  }, []);

  const formatHeader = (string) => {
    return string
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Dashboard <span>Store 01</span>
      </h1>
      <div className="dashboard-menus">
        <button
          className="menu-button"
          onClick={() => setActiveComponent("SaleReport")}
        >
          Sell Report
        </button>
        <button
          className="menu-button"
          onClick={() => setActiveComponent("PurchaseReport")}
        >
          Purchase Report
        </button>
        <button
          className="menu-button"
          onClick={() => setActiveComponent("Expired")}
        >
          Expired
        </button>
        <button
          className="menu-button"
          onClick={() => setActiveComponent("Store")}
        >
          Stores
        </button>
      </div>
      {activeComponent === "SaleReport" && <SaleReport />}
      {activeComponent === "PurchaseReport" && <PurchaseReport />}
      {activeComponent === "Expired" && <Expired />}
      {activeComponent === "Store" && <Store />}
      {activeComponent === "" && (
        <>
          <div className="dashboard-stats">
            <div className="stat-box">
              <h2>TOTAL INVOICE</h2>
              <p className="stat-value">{totalInvoice}</p>
            </div>
            <div className="stat-box">
              <h2>TOTAL REVENUE</h2>
              <p className="stat-value">{totalRevenue}</p>
            </div>
            <div className="stat-box">
              <h2>TOTAL CUSTOMER</h2>
              <p className="stat-value">{totalCustomers}</p>
            </div>
            <div className="stat-box">
              <h2>TOTAL SUPPLIER</h2>
              <p className="stat-value">{totalSuppliers}</p>
            </div>
            <div className="stat-box">
              <h2>TOTAL PRODUCT</h2>
              <p className="stat-value">{totalProducts}</p>
            </div>
          </div>
          <div className="recent-activities">
            <h2>Recent Activities</h2>
            <div className="tabs">
              <button
                className={`tab-button ${
                  activeTab === "purchases" ? "active" : ""
                }`}
                onClick={fetchPurchases}
              >
                Purchases
              </button>
              <button
                className={`tab-button ${
                  activeTab === "historySales" ? "active" : ""
                }`}
                onClick={fetchHistorySales}
              >
                History Sale
              </button>
              <button
                className={`tab-button ${
                  activeTab === "customers" ? "active" : ""
                }`}
                onClick={fetchCustomers}
              >
                Customers
              </button>
              <button
                className={`tab-button ${
                  activeTab === "suppliers" ? "active" : ""
                }`}
                onClick={fetchSuppliers}
              >
                Suppliers
              </button>
            </div>
            <div className="all">
              <div className="table">
                <table className="activities-table">
                  <thead>
                    <tr>
                      {displayData.length > 0 &&
                        Object.keys(displayData[0])
                          .filter((key) => key !== "__v" && key !== "_id")
                          .map((key) => <th key={key}>{formatHeader(key)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((data, index) => (
                      <tr key={index}>
                        {Object.keys(data)
                          .filter((key) => key !== "__v" && key !== "_id")
                          .map((key, idx) => (
                            <td key={idx}>
                              {key === "phone"
                                ? data[key].toString()
                                : data[key]}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
