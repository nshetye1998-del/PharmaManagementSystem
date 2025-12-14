import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./Purchase.css";

const Purchase = () => {
  const [companyName, setCompanyName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const purchaseData = {
    company_name: companyName,
    barcode,
    type,
    price: Number(price),
    amount: Number(amount),
    name,
    quantity: Number(quantity),
  };

  const getData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/purchase/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resData = await response.json();
      setData(resData);
      setCount(resData.length);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to fetch purchases. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let response;
      if (isEditing) {
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/pharmacy/purchase/update/${currentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(purchaseData),
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/pharmacy/purchase/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(purchaseData),
          }
        );
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditing ? "update" : "add"} purchase: ${
            response.status
          } - ${response.statusText}`
        );
      }

      if (isEditing) {
        setData(
          data.map((item) => (item._id === currentId ? responseData : item))
        );
      } else {
        setData([...data, responseData]);
        setCount(count + 1);
      }

      clearFields();

      console.log(
        `Purchase ${isEditing ? "updated" : "added"} successfully:`,
        responseData
      );
      alert(`Purchase ${isEditing ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "add"} purchase:`,
        error.message
      );
      setError(
        `Failed to ${isEditing ? "update" : "add"} purchase. Please try again.`
      );
      alert(
        `Failed to ${isEditing ? "update" : "add"} purchase. Please try again.`
      );
    }
  };

  const clearFields = () => {
    setCompanyName("");
    setBarcode("");
    setType("");
    setPrice("");
    setAmount("");
    setName("");
    setQuantity("");
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/purchase/del/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete purchase: ${response.status} - ${response.statusText}`
        );
      }

      const updatedData = data.filter((purchase) => purchase._id !== id);
      setData(updatedData);
      setCount(count - 1);

      console.log("Purchase deleted successfully:", id);
      alert("Purchase deleted successfully!");
    } catch (error) {
      console.error("Failed to delete purchase:", error.message);
      alert("Failed to delete purchase. Please try again.");
    }
  };

  const handleEdit = (purchase) => {
    setCompanyName(purchase.company_name);
    setBarcode(purchase.barcode);
    setType(purchase.type);
    setPrice(purchase.price);
    setAmount(purchase.amount);
    setName(purchase.name);
    setQuantity(purchase.quantity);
    setIsEditing(true);
    setCurrentId(purchase._id);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleExportToExcel = () => {
    const worksheetData = data.map((purchase) => ({
      "Company Name": purchase.company_name,
      Barcode: purchase.barcode,
      Type: purchase.type,
      Price: purchase.price,
      Amount: purchase.amount,
      Name: purchase.name,
      Quantity: purchase.quantity,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Data");

    XLSX.writeFile(workbook, "PurchaseData.xlsx");
  };

  return (
    <section className="purchase-main">
      <div className="purchase-container">
        <h2>{isEditing ? "Edit" : "Add"} Purchase</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="purchase-form">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
            required
          />
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Barcode"
            required
          />
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
            required
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            required
          />
          <button type="submit">{isEditing ? "Update" : "Submit"}</button>
          {isEditing && (
            <button type="button" onClick={clearFields}>
              Cancel
            </button>
          )}
          <button className="excel" onClick={handleExportToExcel}>
            Convert to Excel
          </button>
        </form>
      </div>
      <div className="purchase-content">
        <h3>Total Purchases: {count}</h3>
        <br></br>
        <div
          className="overflow"
          style={{
            overflowX: "auto",
            width: "75vw",
            overflowY: "auto",
            height: "70vh",
          }}
        >
          <table className="border">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Barcode</th>
                <th>Type</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((purchase, id) => (
                <tr key={id}>
                  <td>{purchase.company_name}</td>
                  <td>{purchase.barcode}</td>
                  <td>{purchase.type}</td>
                  <td>{purchase.price}</td>
                  <td>{purchase.amount}</td>
                  <td>{purchase.name}</td>
                  <td>{purchase.quantity}</td>
                  <td className="buttonss">
                    <button onClick={() => handleEdit(purchase)}>Edit</button>
                    <button onClick={() => handleDelete(purchase._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Purchase;
