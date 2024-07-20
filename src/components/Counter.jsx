import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Counter.css";
import BillingInvoice from "./BillingInvoice";
import Todayorder from "./Todayorder";
import "./BillingInvoice.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import QRCode from "qrcode.react";

const Counter = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [error, setError] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [items, setItems] = useState([]);
  const [billTotal, setBillTotal] = useState(0);
  const [amountReceived, setAmountReceived] = useState("");
  const [balancePayable, setBalancePayable] = useState("");
  const [cashPayable, setCashPayable] = useState(0);
  const [entryDate, setEntryDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("Online"); // Default to Online
  const [email, setEmail] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const qrRef = useRef(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [orderId] = useState("ORD-12345");
  const [orderDate] = useState(new Date().toLocaleDateString());
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState(0); // Total amount state
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const urls = [
        "https://api-5e1h.onrender.com/pharmacy/drug/all",
        "https://api-5e1h.onrender.com/pharmacy/companies/all",
        "https://api-5e1h.onrender.com/pharmacy/historysale/all",
        "https://api-5e1h.onrender.com/pharmacy/purchase/all",
        "https://api-5e1h.onrender.com/pharmacy/sale/all",
      ];

      const fetchRequests = urls.map((url) => fetch(url));
      const responses = await Promise.all(fetchRequests);

      const dataPromises = responses.map(async (response, index) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch from ${urls[index]}`);
        }
        return await response.json();
      });

      const [drugData, companyData, historySaleData, purchaseData, saleData] =
        await Promise.all(dataPromises);

      const combinedData = [
        ...drugData.map((item) => ({ ...item, type: "drug" })),
        ...companyData.map((item) => ({ ...item, type: "company" })),
        ...historySaleData.map((item) => ({ ...item, type: "historySale" })),
        ...purchaseData.map((item) => ({ ...item, type: "purchase" })),
        ...saleData.map((item) => ({ ...item, type: "sale" })),
      ];

      setCombinedData(combinedData);
    } catch (error) {
      console.error("Failed to fetch data:", error.message);
      setError("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    getData();
    const savedItems = localStorage.getItem("savedItems");
    if (savedItems) {
      const dat = JSON.parse(savedItems);
      setItems(dat.items);
    }
    const today = new Date().toISOString().split("T")[0];
    setEntryDate(today);
  }, []);

  const handleQuantityChange = (barcode, value) => {
    const quantity = Number(value);
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.barcode === barcode ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotalAmount = (sell_price, quantity) => {
    return sell_price * quantity;
  };

  const handleBarcodeInputChange = (e) => {
    setBarcodeInput(e.target.value);
  };

  const handleBarcodeInputKeyPress = (e) => {
    if (e.key === "Enter") {
      const item = combinedData.find((d) => d.barcode === barcodeInput);
      if (item) {
        const currentDate = new Date();
        const expiryDate = new Date(item.expiry);
        // console.log(item, currentDate, item.expiry);
        // console.log(expiryDate)
        if (currentDate > expiryDate) {
          alert("Item has expired. Please remove from inventory.");
        } else {
          setItems((prevItems) => [
            ...prevItems,
            { ...item, quantity: item.qty || 1 },
          ]);
          setBarcodeInput("");
          setError("");
        }
      } else {
        setError("Barcode not found");
      }
    }
    console.log(items);
  };

  const determineUnit = (quantity) => {
    return Math.floor(quantity / 6);
  };

  const handleAmountReceivedChange = (e) => {
    const amount = Number(e.target.value);
    setAmountReceived(amount);
    setBalancePayable(amount - billTotal);
  };

  useEffect(() => {
    const total = items.reduce(
      (sum, item) => sum + calculateTotalAmount(item.sell_price, item.quantity),
      0
    );
    setBillTotal(total);
    setCashPayable(Math.round(total));
  }, [items]);

  const handleBarcodeChange = (index, value) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, barcode: value } : item
      )
    );
  };

  const handleSave = async () => {
    const postData = {
      customername: customerName,
      paymentMode: paymentMode,
      email: email,
      date: entryDate,
      items: items.map((item) => ({
        barcode: item.barcode,
        itemName: item.name,
        sell_price: item.sell_price,
        cost_price: item.cost_price,
        unit: determineUnit(item.quantity),
        quantity: item.quantity,
        totalAmount: calculateTotalAmount(item.sell_price, item.quantity),
        totalcostamount: calculateTotalAmount(item.cost_price, item.quantity),
      })),
    };

    try {
      console.log(postData);
      const response = await axios.post(
        "https://api-5e1h.onrender.com/pharmacy/invoice/add",
        postData
      );

      if (response.status === 201) {
        localStorage.setItem("savedItems", JSON.stringify(postData));
        alert("Invoice data saved successfully!");
      } else {
        setError("Failed to save invoice data");
      }
    } catch (error) {
      console.error("Error saving invoice data:", error);
      setError("Failed to save invoice data");
    }
  };

  const handleClear = () => {
    setItems([]);
    localStorage.removeItem("savedItems");
    setError("");
    setBillTotal(0);
    setAmountReceived("");
    setBalancePayable("");
    setCashPayable(0);
  };
  useEffect(() => {
    const savedItems = localStorage.getItem("savedItems");
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      setItems(parsedItems.items);
      setCustomerName(parsedItems.customername);
      setCustomerEmail(parsedItems.email);

      // Calculate total amount on mount
      const initialTotal = calculateTotalAmount(parsedItems.items);
      setTotalAmount(initialTotal);
    }

    // Generate a unique invoice ID
    const uniqueId = ` INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setInvoiceId(uniqueId);
  }, []);

  useEffect(() => {
    // Update total amount whenever items change
    const updatedTotal = calculateTotalAmount(items);
    setTotalAmount(updatedTotal);
  }, [items]);

  const handleLinkClick = (text) => {
    setHeaderText(text);
    setActiveLink(text);
  };

  const calculateTotalAmount1 = (items) => {
    return items.reduce((total, item) => {
      const amount = item.sell_price * item.quantity;
      const taxAmount = calculateTax(amount);
      return total + amount + taxAmount;
    }, 0);
  };

  const calculateTax = (amount) => {
    return amount * 0.18; // 18% tax rate
  };

  const downloadInvoice = async () => {
    const doc = new jsPDF();

    // Title and Invoice ID
    doc.setFontSize(22);
    doc.text("Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoiceId}`, 100, 20);

    // Company Info
    doc.setFontSize(12);
    doc.text("Company Name: ACME Corp", 20, 30);
    doc.text("Address: 123 Main Street, City, Country", 20, 35);
    doc.text("Phone: +1 234 567 890", 20, 40);
    doc.text("Email: billing@acmecorp.com", 20, 45);

    // Order Info
    doc.text(`Order ID: ${orderId}`, 20, 55);
    doc.text(`Order Date: ${orderDate}`, 20, 60);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 20, 65);

    // Customer Info
    doc.text(`Customer Name: ${customerName}`, 20, 75);
    doc.text(`Customer Email: ${customerEmail}`, 20, 80);

    // Table Headers
    const headers = [
      "Sr No",
      "Barcode Item",
      "Item Name",
      "Qty",
      "Price ₹",
      "Tax ₹",
      "Amount ₹",
    ];
    const tableRows = items.map((item, index) => {
      const amount = item.sell_price * item.quantity;
      const taxAmount = calculateTax(amount);
      return [
        index + 1,
        item.barcode,
        item.itemName,
        item.quantity,
        item.sell_price.toFixed(2),
        taxAmount.toFixed(2),
        (amount + taxAmount).toFixed(2),
      ];
    });

    doc.autoTable({
      startY: 90,
      head: [headers],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 50 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 30 },
      },
      styles: { fontSize: 10 },
    });

    // Total Amount Calculation
    const totalTax = calculateTax(totalAmount);
    const discount = 50; // Example discount amount

    // Summary
    const finalY = doc.autoTable.previous.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 20, finalY);
    doc.text(`Discount: ${discount.toFixed(2)}`, 20, finalY + 10);
    doc.text(`Tax: ${totalTax.toFixed(2)}`, 20, finalY + 20);
    doc.text(
      `Grand Total: ${(totalAmount + totalTax - discount).toFixed(2)}`,
      20,
      finalY + 30
    );

    // QR Code
    const qrCanvas = qrRef.current.querySelector("canvas");
    if (qrCanvas) {
      const qrImageData = qrCanvas.toDataURL("image/png");
      doc.addImage(qrImageData, "PNG", 150, 30, 30, 30);
    }

    // Save the PDF locally
    const pdfData = doc.output();
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", "invoice.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Send the PDF via email (Backend API call)
    const sendEmail = async () => {
      const savedItems = localStorage.getItem("savedItems");
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems.items);
        setCustomerName(parsedItems.customername);
        setCustomerEmail(parsedItems.email);

        // Calculate total amount on mount
        const initialTotal = calculateTotalAmount(parsedItems.items);
        setTotalAmount(initialTotal);
      }
      const url = "https://api-5e1h.onrender.com/pharmacy/send-invoice-email";
      console.log(email);
      console.log(items, totalAmount, totalTax, discount);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail: email,
            invoiceData: {
              items,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send email");
        }

        console.log("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error.message);
      }
    };
    sendEmail();
  };

  const handleBack = () => {
    window.history.back();
  };
  return (
    <div className="counter_container">
      {error && <p className="error">{error}</p>}
      <div className="content">
        <div className="top">
          <div className="left">
            <div className="left-top">
              <div className="input">
                <label htmlFor="date">Entry Date</label>
                <input type="date" value={entryDate} readOnly />
              </div>
              <div className="input">
                <label htmlFor="customerName">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="input">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="left-bottom table-container">
              <table>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Barcode Item</th>
                    <th>Item Name</th>
                    <th>MRP</th>
                    <th>Unit</th>
                    <th>Qty</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={item.barcode}
                          onChange={(e) =>
                            handleBarcodeChange(index, e.target.value)
                          }
                        />
                      </td>
                      <td>{item.name}</td>
                      <td className="right">{item.sell_price}</td>
                      <td className="right">{determineUnit(item.quantity)}</td>
                      <td className="right">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.barcode, e.target.value)
                          }
                        />
                      </td>
                      <td className="right">
                        {calculateTotalAmount(item.sell_price, item.quantity)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>{items.length + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={barcodeInput}
                        onChange={handleBarcodeInputChange}
                        onKeyPress={handleBarcodeInputKeyPress}
                        placeholder="Enter barcode here"
                      />
                    </td>
                    <td colSpan="5"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="left">
            <div className="input">
              <label htmlFor="">Bill Total :</label>
              <input type="text" value={billTotal} readOnly />
            </div>
            <div className="input">
              <label htmlFor="">Cash Payable :</label>
              <input type="text" value={cashPayable} readOnly />
            </div>
            <div className="input">
              <label htmlFor="">Balance Payable :</label>
              <input type="text" value={balancePayable} readOnly />
            </div>
          </div>

          <div className="right">
            <div className="input">
              <label htmlFor="">Amount Received</label>
              <input
                type="text"
                value={amountReceived}
                onChange={handleAmountReceivedChange}
              />
            </div>

            <div className="input">
              <label htmlFor="">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div className="buttons">
              <button onClick={handleSave}>Pay</button>
              <button onClick={handleClear}>Clear</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-content">
        <div className="left" style={{ height: "45vh", overflowY: "scroll" }}>
          <Todayorder />
        </div>
        <div className="right">
          <div
            className="content"
            style={{ width: "50rem", minHeight: "40vh" }}
          >
            <div ref={qrRef} style={{ display: "none" }}>
              <QRCode
                value={`https://www.yourwebsite.com/invoice/${invoiceId}`}
                size={128}
              />
            </div>
            <div className="purchase-content">
              <div className="invoice">
                <h4>Invoice</h4>
                <div className="invoice-info">
                  <button
                    onClick={downloadInvoice}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      background:
                        "linear-gradient(to bottom, #00b4db, #0083b0)",
                      color: "white",
                      cursor: "pointer",
                      fontsize: "16px",
                      margin: "5px",
                      borderRadius: "5px",
                      transition: "background-color 0.3s, color 0.3s",
                    }}
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
              <p style={{ margin: "1rem 0" }}>
                Effortlessly handle your bills and invoices right here
              </p>
              <div
                className="counterinvoice"
                style={{ overflowY: "auto", height: "20vh" }}
              >
                <table className="border">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Barcode Item</th>
                      <th>Item Name</th>
                      <th>Qty</th>
                      <th>Price ₹</th>
                      <th>Tax ₹</th>
                      <th>Amount ₹</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.barcode}</td>
                        <td>{item.name}</td>
                        <td className="right">{item.quantity}</td>
                        <td className="right">{item.sell_price.toFixed(2)}</td>
                        <td className="right">
                          {calculateTax(
                            item.sell_price * item.quantity
                          ).toFixed(2)}
                        </td>
                        <td className="right">
                          {(
                            item.sell_price * item.quantity +
                            calculateTax(item.sell_price * item.quantity)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="summary" style={{ margin: "1rem 0" }}>
                <h4>Summary</h4>
                <p>Total Amount: {totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counter;
