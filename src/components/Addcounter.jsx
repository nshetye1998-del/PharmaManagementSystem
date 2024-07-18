import React, { useState, useEffect } from "react";
import "../Admin/Drug.css";
import "./Addcounter.css";

const AddCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [counters, setCounters] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      const response = await fetch(
        "https://api-5e1h.onrender.com/pharmacy/counter/all"
      );
      const data = await response.json();
      setCounters(data);
    } catch (error) {
      console.error("Error fetching counters:", error);
    }
  };

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
    if (isEditing) {
      setIsEditing(false);
      setEditId(null);
      setId("");
      setPassword("");
    }
  };

  const handleSave = async () => {
    const counterData = { id, password };

    try {
      let response;
      if (isEditing) {
        response = await fetch(
          `https://api-5e1h.onrender.com/pharmacy/counter/update/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(counterData),
          }
        );
      } else {
        response = await fetch(
          "https://api-5e1h.onrender.com/pharmacy/counter/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(counterData),
          }
        );
      }

      if (response.ok) {
        alert(
          `${isEditing ? "Counter updated" : "New counter saved"} successfully!`
        );
        setIsVisible(false);
        setId("");
        setPassword("");
        setIsEditing(false);
        setEditId(null);
        fetchCounters(); // Fetch updated counters after adding/editing a new one
      } else {
        alert(`Failed to ${isEditing ? "update" : "save"} counter`);
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "saving"} counter:`,
        error
      );
      alert(`Error ${isEditing ? "updating" : "saving"} counter`);
    }
  };

  const handleEdit = (counter) => {
    setIsVisible(true);
    setIsEditing(true);
    setEditId(counter.id);
    setId(counter.id);
    setPassword(counter.password);
  };

  const handleDelete = async (counterId) => {
    try {
      const response = await fetch(
        `https://api-5e1h.onrender.com/pharmacy/counter/del/${counterId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Counter deleted successfully!");
        fetchCounters(); // Fetch updated counters after deletion
      } else {
        alert("Failed to delete counter");
      }
    } catch (error) {
      console.error("Error deleting counter:", error);
      alert("Error deleting counter");
    }
  };

  return (
    <div className="mainnn">
      <section className="purchase-main">
        <div className="purchase-container">
          <div className="add">
            <button onClick={handleButtonClick}>
              {isVisible ? "Cancel" : "Add Counter"}
            </button>
          </div>
          {isVisible && (
            <div className="addcounter-main">
              <input
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={isEditing}
              />
              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleSave}>
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          )}
          <div className="purchase-content">
        <div className="overflow1" style={{ overflowY:"scroll",height:"75vh" }}>

            <table className="border">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {counters.map((counter) => (
                  <tr key={counter.id}>
                    <td>{counter.id}</td>
                    <td>{counter.password}</td>
                    <td className="buttonss">
                      <button onClick={() => handleEdit(counter)}>Edit</button>
                      <button onClick={() => handleDelete(counter._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddCounter;
