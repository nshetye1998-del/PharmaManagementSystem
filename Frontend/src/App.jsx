import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import AdminLogin from "./pages/Admin/AdminLogin";
import Drug from "./pages/Admin/Drug";
import Sale from "./pages/Admin/Sale";
import Company from "./pages/Admin/Company";
import HistorySale from "./pages/Admin/HistorySale";
import Purchase from "./pages/Admin/Purchase";
import Cashregister from "./pages/Cashregister";
import Forgetpassword from "./pages/Forgetpassword";
import Adminprofile from "./pages/Admin/Adminprofile";
import Dashboard from "./pages/Dashboard";
import Counter from "./pages/Counter";
import Salereport from "./pages/Salereport";
import Expired from "./pages/Expired";
import Store from "./pages/Store";
import Inventory from "./pages/Inventory";
import Purchasereport from "./pages/Purchasereport";
import Navbar from "./components/Navbar";
import Historyreport from "./pages/Historyreport";
import BillingInvoice from "./pages/BillingInvoice";
import Maindashboard from "./pages/Maindashboard";
import Pos from "./pages/Pos";
import Cashlogin from "./pages/Cashlogin";
import AddCounter from "./pages/Addcounter";
import Billingdata from "./pages/Billingdata";
import Email from "./pages/Email";
import Newpage from "./pages/Newpage";
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
