import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Admin/Drug.css";

const Salereport = () => {
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
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/sale/all`
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
          `${import.meta.env.VITE_API_BASE_URL}/pharmacy/sale/update/${currentId}`,
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
          `${import.meta.env.VITE_API_BASE_URL}/pharmacy/sale/add`,
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
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/sale/del/${id}`,
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

  const handleBack = () => {
    window.history.back();
  };

  return (
    <section className="purchase-main">
      <div className="purchase-container">
        {/* <button onClick={handleBack} className="back-button">
      <FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Back
        
      </button> */}
        <h2>Total Sales: {count}</h2>
        {error && <p className="error">{error}</p>}
        <div className="purchase-content">
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
              {data.map((sale, id) => (
                <tr key={id}>
                  <td>{sale.company_name}</td>
                  <td>{sale.barcode}</td>
                  <td>{sale.type}</td>
                  <td>{sale.price}</td>
                  <td>{sale.amount}</td>
                  <td>{sale.name}</td>
                  <td>{sale.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Salereport;
