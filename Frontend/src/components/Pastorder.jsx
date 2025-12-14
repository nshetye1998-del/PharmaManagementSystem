import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "../pages/Admin/Drug.css";

const Pastorder = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState("customername");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/invoice/get/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Sort orders by date in descending order (most recent first)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setOrders(data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearchCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
    setSearchQuery("");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    if (searchCriteria === "customername") {
      return order.customername
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    } else if (searchCriteria === "date") {
      return format(new Date(order.date), "yyyy-MM-dd").includes(searchQuery);
    }
    return true;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section className="purchase-main">
      <div className="purchase-container">
        <div
          className="header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 2rem",
            margin: "1rem 0",
          }}
        >
          <h2>Past Orders</h2>
          <div className="search-bar">
            <select
              value={searchCriteria}
              onChange={handleSearchCriteriaChange}
            >
              <option value="customername">Search by Customer Name</option>
              <option value="date">Search by Date</option>
            </select>
            <input
              type="text"
              placeholder={`Enter ${searchCriteria.replace("_", " ")}`}
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
              style={{ padding: "0.5rem", width: "30%" }}
            />
          </div>
        </div>
        {filteredOrders.length === 0 ? (
          <p>No past orders found.</p>
        ) : (
          <div className="purchase-content">
            <table className="border">
              <thead>
                <tr className="color">
                  <th>Invoice Number</th>
                  <th>Customer Name</th>
                  <th>Payment Mode</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.invoiceNumber}>
                    <td>{order.invoiceNumber}</td>
                    <td>{order.customername}</td>
                    <td>{order.paymentMode}</td>
                    <td>{order.email}</td>
                    <td>{format(new Date(order.date), "yyyy-MM-dd")}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <p key={index}>
                          {item.itemName} - {item.quantity} @ {item.sell_price}
                        </p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pastorder;
