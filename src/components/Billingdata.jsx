import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import '../Admin/Drug.css';

const Billingdata = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://api-5e1h.onrender.com/pharmacy/invoice/get/all');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Sort orders by date in descending order (most recent first)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
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

  const handleExportToExcel = () => {
    const worksheetData = filteredOrders.map(order => ({
      "Invoice Number": order.invoiceNumber,
      "Customer Name": order.customername,
      "Payment Mode": order.paymentMode,
      "Email": order.email,
      "Date": format(new Date(order.date), 'yyyy-MM-dd'),
      "Items": order.items.map(item => `${item.itemName} - ${item.quantity} @ ${item.sell_price}`).join(', ')
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Billing Data");

    XLSX.writeFile(workbook, "BillingData.xlsx");
  };

  const filteredOrders = orders.filter(order =>
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
        <div className="header" style={{display:"flex", justifyContent:"space-between", padding:"0 2rem", margin:"1rem 0"}}>
          
          <h2>Billing and Invoices</h2>
          <input
            type="text"
            placeholder="Search by customer name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
            style={{padding:"0.5rem", width:"30%"}}
          />
          <button className="excel" onClick={handleExportToExcel}>Convert to Excel</button>

        </div>
        <div className="order-count" style={{padding: "0 2rem", margin: "1rem 0"}}>
          <h3>Total Orders: {filteredOrders.length}</h3>
        </div>
        {filteredOrders.length === 0 ? (
          <p>No past orders found.</p>
        ) : (
          <div className="purchase-content">
            <div className="overflow" style={{ overflowX: "auto", width: "75vw", overflowY:"auto", height:"75vh" }}>
              <table className="border">
                <thead>
                  <tr>
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
                      <td>{format(new Date(order.date), 'yyyy-MM-dd')}</td>
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
          </div>
        )}
      </div>
    </section>
  );
};

export default Billingdata;
