import React, { useState, useEffect } from "react";
// import "./HistorySale.css";

const Historyreport= () => {
  const [userName, setUserName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [dose, setDose] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const historySaleData = {
    user_name: userName,
    barcode,
    dose,
    type,
    price: Number(price),
    amount: Number(amount),
    name,
    quantity: Number(quantity),
    date,
    time,
  };

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api-5e1h.onrender.com/pharmacy/historysale/all"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setData(responseData);
      setCount(responseData.length);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to fetch history sales. Please try again.");
    }
  };

  // Function to handle form submission for adding/editing a history sale
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let response;
      if (isEditing) {
        response = await fetch(
          `https://api-5e1h.onrender.com/pharmacy/historysale/update/${currentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(historySaleData),
          }
        );
      } else {
        response = await fetch(
          "https://api-5e1h.onrender.com/pharmacy/historysale/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(historySaleData),
          }
        );
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditing ? "update" : "add"} history sale: ${
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

      // Clear input fields after successful submission
      clearFields();

      console.log(
        `History sale ${isEditing ? "updated" : "added"} successfully:`,
        responseData
      );
      alert(`History sale ${isEditing ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "add"} history sale:`,
        error.message
      );
      setError(
        `Failed to ${
          isEditing ? "update" : "add"
        } history sale. Please try again.`
      );
      alert(
        `Failed to ${
          isEditing ? "update" : "add"
        } history sale. Please try again.`
      );
    }
  };

  // Function to clear input fields
  const clearFields = () => {
    setUserName("");
    setBarcode("");
    setDose("");
    setType("");
    setPrice("");
    setAmount("");
    setDate("");
    setTime("");
    setName("");
    setQuantity("");
    setIsEditing(false);
    setCurrentId(null);
  };

  // Function to handle deletion of a history sale
  const handleDelete = async (id) => {
    try {
      // Optimistically update UI
      const updatedData = data.filter((sale) => sale._id !== id);
      setData(updatedData);
      setCount(count - 1);

      const response = await fetch(
        `https://api-5e1h.onrender.com/pharmacy/historysale/del/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `succesfully delete history sale: ${response.status} - ${response.statusText}`
        );
      }

      console.log("History sale deleted successfully:", id);
      alert("History sale deleted successfully!");
    } catch (error) {
      console.error("succesfullyto delete history sale:", error.message);
      alert("succesfully to delete history sale");

      // Rollback UI update on error
      fetchData(); // Fetch fresh data to revert UI to current state
    }
  };

  // Function to handle editing of a history sale
  const handleEdit = (sale) => {
    setUserName(sale.user_name);
    setBarcode(sale.barcode);
    setDose(sale.dose);
    setType(sale.type);
    setPrice(sale.price);
    setAmount(sale.amount);
    setDate(sale.createdAt.slice(0, 10)); // Extracting date from createdAt field
    setTime(sale.createdAt.slice(11, 19)); // Extracting time from createdAt field
    setName(sale.name);
    setQuantity(sale.quantity);
    setIsEditing(true);
    setCurrentId(sale._id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="history-sale-main">
      <div className="history-sale-container">
        <h2>{isEditing ? "Edit" : "Add"} History Sale</h2>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="history-sale-content">
        <h2>Total History Sales: {count}</h2>
        <table className="history-sale-border">
          <thead>
            <tr>
              <th>Username</th>
              <th>Barcode</th>
              <th>Dose</th>
              <th>Type</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Time</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sale, id) => (
              <tr key={id}>
                <td>{sale.user_name}</td>
                <td>{sale.barcode}</td>
                <td>{sale.dose}</td>
                <td>{sale.type}</td>
                <td>{sale.price}</td>
                <td>{sale.amount}</td>
                <td>{sale.createdAt.slice(0, 10)}</td>{" "}
                {/* Extracting date from createdAt field */}
                <td>{sale.createdAt.slice(11, 19)}</td>{" "}
                {/* Extracting time from createdAt field */}
                <td>{sale.name}</td>
                <td>{sale.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Historyreport;
