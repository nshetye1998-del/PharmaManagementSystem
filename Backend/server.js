const express = require("express");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const companyRoutes = require('./routes/companyRoutes');
const drugRoutes = require('./routes/drugRoutes');
const historySaleRoutes = require('./routes/historySaleRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const userRoutes = require('./routes/userPharmaRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const pharmacyBillingRoutes = require('./routes/billingRoutes');
const mailRoute = require('./routes/mailRoute');
const counterRoutes = require('./routes/counterRoutes');
const forgetPassword = require('./routes/forgotPassRoutes');


const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
require("./config/db")


app.use('/pharmacy/billing', pharmacyBillingRoutes);
// app.use('/api/pharmacy', mailRoute); // Original
// Frontend calls /pharmacy/send-invoice-email. So we mount mailRoute at /pharmacy
app.use('/pharmacy', mailRoute);

app.use('/pharmacy/counter', counterRoutes);
app.use('/pharmacy/companies', companyRoutes);
app.use('/pharmacy/drug', drugRoutes);
app.use('/pharmacy/historysale', historySaleRoutes);
app.use('/pharmacy/purchase', purchaseRoutes);
app.use('/pharmacy/sale', saleRoutes);
app.use('/pharmacy/users', userRoutes);
app.use('/pharmacy/invoice', invoiceRoutes);
// app.use('/api/pharmacy', forgetPassword); // Original
// Frontend calls /pharmacy/users/forgot-password. 
// If forgetPassword route has /users/forgot-password inside it, we mount at /pharmacy?
// Or if it has /forgot-password, we mount at /pharmacy/users?
// Let's mount at /pharmacy for now to be safe, assuming it handles the subpaths.
app.use('/pharmacy', forgetPassword);

app.listen(port, () => {
    console.log("Server is Running on Port : " + port);
});