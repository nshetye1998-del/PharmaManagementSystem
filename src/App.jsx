import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "./Admin/Admin";
import AdminLogin from "./Admin/AdminLogin";
import Drug from "./Admin/Drug";
import Sale from "./Admin/Sale";
import Company from "./Admin/Company";
import HistorySale from "./Admin/HistorySale";
import Purchase from "./Admin/Purchase";
import Cashregister from "./components/Cashregister";
import Forgetpassword from "./components/Forgetpassword";
import Adminprofile from "./Admin/Adminprofile";
import Dashboard from "./components/Dashboard";
import Counter from "./components/Counter";
import Salereport from "./components/Salereport";
import Expired from "./components/Expired";
import Store from "./components/Store";
import Inventory from "./components/Inventory";
import Purchasereport from "./components/Purchasereport";
import Navbar from "./components/Navbar";
import Historyreport from "./components/Historyreport";
import BillingInvoice from "./components/BillingInvoice";
import Maindashboard from "./components/Maindashboard";
import Pos from "./components/Pos";
import Cashlogin from "./components/Cashlogin";
import AddCounter from "./components/Addcounter";
import Billingdata from "./components/Billingdata";
import Email from "./components/Email";
import Newpage from "./components/Newpage";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/drug" element={<Drug />} />
        <Route path="/History" element={<HistorySale />} />
        <Route path="/" element={<Cashlogin />} />
        <Route path="/Cashregister" element={<Cashregister />} />
        <Route path="/Forgetpassword" element={<Forgetpassword />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/company" element={<Company />} />
        <Route path="/History" element={<HistorySale />} />
        <Route path="/adminprofile" element={<Adminprofile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/salereport" element={<Salereport />} />
        <Route path="/expired" element={<Expired />} />
        <Route path="/store" element={<Store />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/purchasereport" element={<Purchasereport />} />
        <Route path="/historyreport" element={<Historyreport />} />
        <Route path="/billinginvoice" element={<BillingInvoice />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/maindashboard" element={<Maindashboard />} />
        <Route path="/pos" element={<Pos />} />
        <Route path="/addcounter" element={<AddCounter />} />
        <Route path="/billingdata" element={<Billingdata />} />
        <Route path="/email" element={<Email />} />
        <Route path="/newpage" element={<Newpage />} />
      </Routes>
    </>
  );
};

export default App;
