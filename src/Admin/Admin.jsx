import React, { useState } from "react";
import "./Admin.css";
import Drug from "./Drug";
import Sale from "./Sale";
import Company from "./Company";
import Purchase from "./Purchase";
import HistorySale from "./HistorySale";

const Admin = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case "sale":
        return <Sale />;
      case "purchase":
        return <Purchase />;
      case "history_sale":
        return <HistorySale />;
      case "drug":
        return <Drug />;
      case "company":
        return <Company />;
      default:
        return null;
    }
  };

    return (
        <section className="admin-main">
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Admin</h1>
                </div>
                <div className="admin-content">
                    <button onClick={() => setActiveComponent("sale")}>SALE</button>
                    <button onClick={() => setActiveComponent("purchase")}>
                        PURCHASE
                    </button>
                    <button onClick={() => setActiveComponent("history_sale")}>
                        HISTORY_SALE
                    </button>
                    <button onClick={() => setActiveComponent("drug")}>DRUG</button>
                    <button onClick={() => setActiveComponent("company")}>COMPANY</button>
                </div>
            </div>



            <div className="container">{renderComponent()}</div>

        </section>
    );
    

};


export default Admin;