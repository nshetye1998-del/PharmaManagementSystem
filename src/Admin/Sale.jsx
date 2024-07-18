import React, { useState, useEffect } from "react";
import "./Purchase.css";

const Sale = () => {
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

  const saleData = {
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
        "https://api-5e1h.onrender.com/pharmacy/sale/all"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resData = await response.json();
      setData(resData);
      setCount(resData.length);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to fetch sales. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let response;
      if (isEditing) {
        response = await fetch(
          `https://api-5e1h.onrender.com/pharmacy/sale/update/${currentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(saleData),
          }
        );
      } else {
        response = await fetch(
          "https://api-5e1h.onrender.com/pharmacy/sale/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(saleData),
          }
        );
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditing ? "update" : "add"} sale: ${
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
        `Sale ${isEditing ? "updated" : "added"} successfully:`,
        responseData
      );
      alert(`Sale ${isEditing ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "add"} sale:`,
        error.message
      );
      setError(
        `Failed to ${isEditing ? "update" : "add"} sale. Please try again.`
      );
      alert(
        `Failed to ${isEditing ? "update" : "add"} sale. Please try again.`
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
        `https://api-5e1h.onrender.com/pharmacy/sale/del/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete sale: ${response.status} - ${response.statusText}`
        );
      }

      const updatedData = data.filter((sale) => sale._id !== id);
      setData(updatedData);
      setCount(count - 1);

      console.log("Sale deleted successfully:", id);
      alert("Sale deleted successfully!");
    } catch (error) {
      console.error("Failed to delete sale:", error.message);
      alert("Failed to delete sale. Please try again.");
    }
  };

  const handleEdit = (sale) => {
    setCompanyName(sale.company_name);
    setBarcode(sale.barcode);
    setType(sale.type);
    setPrice(sale.price);
    setAmount(sale.amount);
    setName(sale.name);
    setQuantity(sale.quantity);
    setIsEditing(true);
    setCurrentId(sale._id);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="purchase-main">
      <div className="purchase-container">
        <h2>{isEditing ? "Edit" : "Add"} Sale</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="sale-form">
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
        </form>
      </div>
      <div className="purchase-content">
        <h3>Total Sales: {count}</h3>
        <br></br>
        <div className="overflow" style={{ overflowX: "auto", width: "75vw",overflowY:"auto",height:"75vh" }}>

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
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sale, id) => (
              <tr key={id}>
                <td>{sale.company_name}</td>
                <td>{sale.barcode}</td>
                <td>{sale.type}</td>
                <td>{sale.price}</td>
                <td>{sale.amount}</td>
                <td>{sale.name}</td>
                <td>{sale.quantity}</td>
                <td>{new Date(sale.createdAt).toLocaleString()}</td>
                <td className="buttonss">
                  <button onClick={() => handleEdit(sale)}>Edit</button>
                  <button onClick={() => handleDelete(sale._id)}>Delete</button>
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

export default Sale;
