import { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import "../pages/Admin/Drug.css";
// import "./TodayOrder.css"; // Uncomment this line if you have a separate CSS file for this component

const Todayorder = ({ trigger }) => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/invoice/get/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const todayInvoices = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setInvoices(todayInvoices);
    } catch (err) {
      setError("Failed to fetch invoices. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [trigger]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.customername.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h2>Today's Orders</h2>
          <input
            type="text"
            placeholder="Search by customer name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
            style={{ padding: "0.5rem", width: "30%" }}
          />
        </div>

        {filteredInvoices.length === 0 ? (
          <p>No orders found for today.</p>
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.invoiceNumber}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.customername}</td>
                    <td>{invoice.paymentMode}</td>
                    <td>{invoice.email}</td>
                    <td>{format(new Date(invoice.date), "yyyy-MM-dd")}</td>
                    <td>
                      {invoice.items.map((item, index) => (
                        <p key={item.itemName + index}>
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

export default Todayorder;
