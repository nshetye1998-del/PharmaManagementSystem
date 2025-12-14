import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Admin/Drug.css";

const Store = () => {
  const [drugs, setDrugs] = useState([]);
  const [error, setError] = useState(null);

  const fetchDrugs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/drug/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setDrugs(responseData);
    } catch (error) {
      console.error("Failed to fetch drugs:", error);
      setError("Failed to fetch drugs. Please try again.");
    }
  };

  useEffect(() => {
    fetchDrugs();
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
        <h2>Store Drugs</h2>
        {error && <p className="error">{error}</p>}
        <div className="purchase-content">
          <table className="border">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Drug Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {drugs.map((drug, index) => (
                <tr key={index}>
                  <td>{drug.company_name}</td>
                  <td>{drug.name}</td>
                  <td>{drug.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Store;
