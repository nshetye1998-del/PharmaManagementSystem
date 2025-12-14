import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Admin/Drug.css";

const Expired = () => {
  const [expiredDrugs, setExpiredDrugs] = useState([]);
  const [error, setError] = useState(null);

  const fetchExpiredDrugs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pharmacy/drug/all`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const expired = responseData.filter(
        (drug) => new Date(drug.expiration_date) < new Date()
      );
      setExpiredDrugs(expired);
    } catch (error) {
      console.error("Failed to fetch expired drugs:", error);
      setError("Failed to fetch expired drugs. Please try again.");
    }
  };

  useEffect(() => {
    fetchExpiredDrugs();
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
        <h2>Expired Drugs</h2>
        {error && <p className="error">{error}</p>}
        <div
          className="purchase-content"
          style={{ overflowY: "auto", height: "69.5vh" }}
        >
          <table className="border">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Barcode</th>
                <th>Company name</th>
                <th>Production Date</th>
                <th>Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {expiredDrugs.map((drug, index) => (
                <tr key={index}>
                  <td>{drug.name}</td>
                  <td>{drug.type}</td>
                  <td>{drug.barcode}</td>
                  <td>{drug.company_name}</td>
                  <td>{drug.production_date}</td>
                  <td>{drug.expiration_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Expired;
