import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import "../Admin/Drug.css";

const Purchasereport = () => {
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

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api-5e1h.onrender.com/pharmacy/purchase/all"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setData(responseData);
      setCount(responseData.length);
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
          `https://api-5e1h.onrender.com/pharmacy/purchase/edit/${currentId}`,
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
          "https://api-5e1h.onrender.com/pharmacy/purchase/add",
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
          `Failed to ${isEditing ? "edit" : "add"} purchase: ${
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
        `Failed to ${isEditing ? "edit" : "add"} purchase:`,
        error.message
      );
      setError(
        `Failed to ${isEditing ? "edit" : "add"} purchase. Please try again.`
      );
      alert(
        `Failed to ${isEditing ? "edit" : "add"} purchase. Please try again.`
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
      const updatedData = data.filter((purchase) => purchase._id !== id);
      setData(updatedData);
      setCount(count - 1);

      const response = await fetch(
        `https://api-5e1h.onrender.com/pharmacy/purchase/del/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete purchase: ${response.status} - ${response.statusText}`
        );
      }

      console.log("Purchase deleted successfully:", id);
      alert("Purchase deleted successfully!");
    } catch (error) {
      console.error("Failed to delete purchase:", error.message);
      alert("Failed to delete purchase. Please try again.");
      fetchData();
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
    fetchData();
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <section className="purchase-main">
      <div className="purchase-container">
        {/* <button onClick={handleBack} className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Back
        </button> */}
        {/* <h2>{isEditing ? "Edit Purchase" : "Add Purchase"}</h2> */}
        {error && <p className="error">{error}</p>}
      </div>
      <div className="purchase-content">
        <h2>Total Purchases: {count}</h2>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Purchasereport;
