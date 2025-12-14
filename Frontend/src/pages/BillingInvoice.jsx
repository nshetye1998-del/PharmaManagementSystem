import React, { useState, useEffect, useRef } from "react";
import "./BillingInvoice.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import QRCode from "qrcode.react";

const BillingInvoice = () => {
  const [headerText, setHeaderText] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const [items, setItems] = useState([]);
  const qrRef = useRef(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [orderId] = useState("ORD-12345");
  const [orderDate] = useState(new Date().toLocaleDateString());
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState(0); // Total amount state

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
    const uniqueId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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

  const calculateTotalAmount = (items) => {
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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/send-invoice-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail,
            invoiceData: {
              items,
              totalAmount,
              totalTax,
              discount,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error.message);
    }
  };
  const handleBack = () => {
    window.history.back();
  };
  return (
    <>
      <div className="content">
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
              <button onClick={downloadInvoice}>Download Invoice</button>
              <button onClick={handleBack} className="back-button">
                Back
              </button>
            </div>
          </div>
          <p>Effortlessly handle your bills and invoices right here</p>

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
                  <td>{item.itemName}</td>
                  <td className="right">{item.quantity}</td>
                  <td className="right">{item.sell_price.toFixed(2)}</td>
                  <td className="right">
                    {calculateTax(item.sell_price * item.quantity).toFixed(2)}
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

          <div className="summary">
            <h4>Summary</h4>
            <p>Total Amount: {totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingInvoice;
