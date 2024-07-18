import React, { useState, useEffect } from "react";
// import "./Purchase.css";
import "./Drug.css";
import * as XLSX from 'xlsx';

const Drug = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [barcode, setBarcode] = useState("");
  const [dose, setDose] = useState("");
  const [code, setCode] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [expiry, setExpiry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [place, setPlace] = useState("");
  const [quantity, setQuantity] = useState("");
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const drugData = {
    name: name,
    type: type,
    barcode: barcode,
    dose: dose,
    // code: code,
    cost_price: Number(costPrice),
    sell_price: Number(sellPrice),
    expiry: expiry,
    company_name: companyName,
    production_date: productionDate,
    expiration_date: expirationDate,
    place: place,
    quantity: Number(quantity),
  };

  const getData = async () => {
    try {
      const drug = await fetch(
        "https://api-5e1h.onrender.com/pharmacy/drug/all"
      );
      const drugData = await drug.json();

      if (!drug.ok) {
        throw new Error("Failed to fetch drugs");
      }

      console.log(drugData);
      setData(drugData);
      setCount(drugData.length);
    } catch (error) {
      console.error("Failed to fetch drugs:", error.message);
      setError("Failed to fetch drugs. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(
        editMode
          ? `https://api-5e1h.onrender.com/pharmacy/drug/update/${editId}`
          : "https://api-5e1h.onrender.com/pharmacy/drug/add",
        {
          method: editMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(drugData),
        }
      );

      const newDrug = await response.json();

      if (!response.ok) {
        throw new Error(
          `Failed to ${editMode ? "update" : "add"} drug: ${
            response.status
          } - ${response.statusText}`
        );
      }

      if (editMode) {
        setData(data.map((drug) => (drug._id === editId ? newDrug : drug)));
        setEditMode(false);
        setEditId(null);
      } else {
        setData([...data, newDrug]);
        setCount(count + 1);
      }

      setName("");
      setType("");
      setBarcode("");
      setDose("");
      // setCode("")/;
      setCostPrice("");
      setSellPrice("");
      setExpiry("");
      setCompanyName("");
      setProductionDate("");
      setExpirationDate("");
      setPlace("");
      setQuantity("");

      console.log(
        `Drug ${editMode ? "updated" : "added"} successfully:`,
        newDrug
      );
      alert(`Drug ${editMode ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error(
        `Failed to ${editMode ? "update" : "add"} drug:`,
        error.message
      );
      setError(
        `Failed to ${editMode ? "update" : "add"} drug. Please try again.`
      );
      alert(`Failed to ${editMode ? "update" : "add"} drug. Please try again.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://api-5e1h.onrender.com/pharmacy/drug/del/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete drug: ${response.status} - ${response.statusText}`
        );
      }

      const updatedData = data.filter((drug) => drug._id !== id);
      setData(updatedData);
      setCount(count - 1);

      console.log("Drug deleted successfully!", updatedData);
      alert("Drug deleted successfully!");
    } catch (error) {
      console.error("Failed to delete drug:", error.message);
      alert("Failed to delete drug. Please try again.");
    }
  };

  const handleEdit = (drug) => {
    setName(drug.name);
    setType(drug.type);
    setBarcode(drug.barcode);
    setDose(drug.dose);
    // setCode(drug.code);
    setCostPrice(drug.cost_price);
    setSellPrice(drug.sell_price);
    setExpiry(drug.expiry);
    setCompanyName(drug.company_name);
    setProductionDate(drug.production_date);
    setExpirationDate(drug.expiration_date);
    setPlace(drug.place);
    setQuantity(drug.quantity);
    setEditMode(true);
    setEditId(drug._id);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drugs");
    XLSX.writeFile(workbook, "DrugsData.xlsx");
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="purchase-main">
      <div className="purchase-container">
        <h2>{editMode ? "Edit Drug" : "Add Drug"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
          />
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Barcode"
          />
          <input
            type="text"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="Dose"
          />
          {/* <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code"
          /> */}
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            placeholder="Cost Price"
          />
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="Sell Price"
          />
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="Expiry"
          />
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
          />
          <input
            type="text"
            value={productionDate}
            onChange={(e) => setProductionDate(e.target.value)}
            placeholder="Production Date"
          />
          <input
            type="text"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            placeholder="Expiration Date"
          />
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Place"
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
          />
          
          <button type="submit">{editMode ? "Update" : "Submit"}</button>
          <button className="excel" onClick={handleExportToExcel}>Convert to Excel</button>
        </form>

        

      </div>
      <div className="purchase-content" style={{ width: "100%" }}>
        <h3>Total Drugs: {count}</h3>
        <br></br>
        <div className="overflow" style={{ overflowX: "scroll", width: "75vw",overflowY:"scroll",height:"64vh" }}>
          <table className="border">
            <thead>
              <tr>
                <th style={{width: "fit-content"}}>Name</th>
                <th>Type</th>
                <th>Barcode</th>
                <th>Dose</th>
                {/* <th>Code</th> */}
                <th>Cost Price</th>
                <th>Sell Price</th>
                <th>Expiry</th>
                <th>Company Name</th>
                <th>Production Date</th>
                <th>Expiration Date</th>
                <th>Place</th>
                <th>Quantity</th>
                <th>Created At</th>
                <th className="action">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((drug, id) => {
                return (
                  <tr key={id}>
                    <td>{drug.name}</td>
                    <td>{drug.type}</td>
                    <td>{drug.barcode}</td>
                    <td>{drug.dose}</td>
                    {/* <td>{drug.code}</td> */}
                    <td>{drug.cost_price}</td>
                    <td>{drug.sell_price}</td>
                    <td>{drug.expiry}</td>
                    <td>{drug.company_name}</td>
                    <td>{drug.production_date}</td>
                    <td>{drug.expiration_date}</td>
                    <td>{drug.place}</td>
                    <td>{drug.quantity}</td>
                    <td>{drug.createdAt}</td>
                    <td className="buttonss">
                      <button onClick={() => handleEdit(drug)}>Edit</button>
                      <button onClick={() => handleDelete(drug._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Drug;
