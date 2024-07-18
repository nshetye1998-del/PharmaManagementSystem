import React, { useState, useEffect } from "react";
import "./Purchase.css";
import * as XLSX from 'xlsx';

const Company = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const companyData = {
    name: name,
    address: address,
    phone: Number(phone),
  };

  const getData = async () => {
    try {
      const company = await fetch(
        "https://api-5e1h.onrender.com/pharmacy/companies/all"
      );

      const companyData = await company.json();

      if (!company.ok) {
        throw new Error("Failed to fetch companies");
      }

      console.log(companyData);
      setData(companyData);
      setCount(companyData.length);
    } catch (error) {
      console.error("Failed to fetch companies:", error.message);
      setError("Failed to fetch companies. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const company = await fetch(
        editMode
          ? `https://api-5e1h.onrender.com/pharmacy/companies/update/${editId}`
          : "https://api-5e1h.onrender.com/pharmacy/companies/add",
        {
          method: editMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(companyData),
        }
      );

      const newCompany = await company.json();

      if (!company.ok) {
        throw new Error(
          `Failed to ${editMode ? "update" : "add"} company: ${
            company.status
          } - ${company.statusText}`
        );
      }

      if (editMode) {
        setData(
          data.map((company) => (company._id === editId ? newCompany : company))
        );
        setEditMode(false);
        setEditId(null);
      } else {
        setData([...data, newCompany]);
        setCount(count + 1);
      }

      setName("");
      setAddress("");
      setPhone("");

      console.log(
        `Company ${editMode ? "updated" : "added"} successfully:`,
        newCompany
      );
      alert(`Company ${editMode ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error(
        `Failed to ${editMode ? "update" : "add"} company:`,
        error.message
      );
      setError(
        `Failed to ${editMode ? "update" : "add"} company. Please try again.`
      );
      alert(
        `Failed to ${editMode ? "update" : "add"} company. Please try again.`
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const company = await fetch(
        `https://api-5e1h.onrender.com/pharmacy/companies/del/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!company.ok) {
        throw new Error(
          `Failed to delete drug: ${company.status} - ${company.statusText}`
        );
      }

      const updatedData = data.filter((company) => company._id !== id);
      setData(updatedData);
      setCount(count - 1);

      console.log("Company deleted successfully!", updatedData);
      alert("Company deleted successfully!");
    } catch (error) {
      console.error("Failed to delete company:", error.message);
      alert("Failed to delete company. Please try again.");
    }
  };

  const handleEdit = (company) => {
    setName(company.name);
    setAddress(company.address);
    setPhone(company.phone);
    setEditMode(true);
    setEditId(company._id);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    XLSX.writeFile(workbook, "companies.xlsx");
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="purchase-main">
      <div className="purchase-container">
        <h2>{editMode ? "Edit Company" : "Add Company"}</h2>
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
          />
          <button type="submit">{editMode ? "Update" : "Submit"}</button>
        <button className="excel" onClick={handleExportToExcel}>Convert to Excel</button>

        </form>
      </div>
      <div className="purchase-content">
        <h3>Total Companies: {count}</h3>
        <br></br>
        <div className="overflow" style={{ overflowX: "auto", width: "75vw",overflowY:"auto",height:"79vh" }}>
          <table className="border">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th className="action">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((company, id) => {
                return (
                  <tr key={id}>
                    <td>{company.name}</td>
                    <td>{company.address}</td>
                    <td>{company.phone}</td>
                    <td className="buttonss">
                      <button onClick={() => handleEdit(company)}>Edit</button>
                      <button onClick={() => handleDelete(company._id)}>
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

export default Company;
