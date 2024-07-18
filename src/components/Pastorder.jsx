import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import "../Admin/Drug.css";

const Pastorder = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://api-5e1h.onrender.com/pharmacy/invoice/get/all"
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredOrders = orders.filter((order) =>
    order.customername.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <input
            type="text"
            placeholder="Search by customer name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
            style={{ padding: "0.5rem", width: "30%" }}
          />
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
