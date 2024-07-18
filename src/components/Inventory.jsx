import React, { useEffect, useState } from "react";
import "../Admin/Drug.css";
const Inventory = ({ updateTrigger }) => {
  const [drugs, setDrugs] = useState([]);
  const [filteredDrugs, setFilteredDrugs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [lowQuantityCount, setLowQuantityCount] = useState(0);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState("barcode");
  const [searchValue, setSearchValue] = useState("");

  const fetchDrugs = async () => {
    try {
      const response = await fetch(
        "https://api-5e1h.onrender.com/pharmacy/drug/all"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setDrugs(responseData);
      // Calculate total count
      setTotalCount(responseData.length);
      // Calculate low quantity count
      const lowQuantityDrugs = responseData.filter(
        (drug) => drug.quantity < 10
      ); // Example threshold
      setLowQuantityCount(lowQuantityDrugs.length);
    } catch (error) {
      console.error("Failed to fetch drugs:", error);
      setError("Failed to fetch drugs. Please try again.");
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  useEffect(() => {
    // Filter drugs based on selected criteria and value
    const filtered = drugs.filter((drug) =>
      drug[searchCriteria].toLowerCase().includes(searchValue.toLowerCase())
    );

    // Sort filtered drugs by quantity in ascending order
    filtered.sort((a, b) => a.quantity - b.quantity);

    setFilteredDrugs(filtered);
  }, [drugs, searchCriteria, searchValue]);

  useEffect(() => {
    // Update drug data whenever updateTrigger changes (from Billing component)
    fetchDrugs();
  }, [updateTrigger]); // Depend on updateTrigger to update inventory

  const handleSearchCriteriaChange = (e) => {
    setSearchCriteria(e.target.value);
    setSearchValue("");
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <section className="purchase-main">
      <div className="purchase-container">
        <h2>All Drugs</h2>
        {error && <p className="error">{error}</p>}
        <div className="search-bar">
          <select value={searchCriteria} onChange={handleSearchCriteriaChange}>
            <option value="barcode">Search by Barcode</option>
            <option value="company_name">Search by Company Name</option>
            <option value="name">Search by Drug Name</option>
          </select>
          <input
            type="text"
            placeholder={`Enter ${searchCriteria.replace("_", " ")}`}
            value={searchValue}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className="count">
        <p>Total Drugs Count:  {totalCount}</p>
        <p>Low Quantity Drugs Count:  {lowQuantityCount}</p>
        </div>
        <div className="purchase-content">
          <table className="border">
            <thead>
              <tr className="color">
                <th>Sr no</th>
                <th>Company Name</th>
                <th>Type</th>
                <th>Drug Name</th>
                <th>Barcode</th>
                <th>Dose</th>
                <th>Cost Price</th>
                <th>Sell Price</th>
                <th>Quantity</th>
                <th>Expiry</th>
                <th>Production Date</th>
                <th>Place</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrugs.map((drug, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{drug.company_name}</td>
                  <td>{drug.type}</td>
                  <td>{drug.name}</td>
                  <td>{drug.barcode}</td>
                  <td>{drug.dose}</td>
                  <td>{drug.cost_price}</td>
                  <td>{drug.sell_price}</td>
                  <td>{drug.quantity}</td>
                  <td>{drug.expiry}</td>
                  <td>{drug.production_date}</td>
                  <td>{drug.place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Inventory;
