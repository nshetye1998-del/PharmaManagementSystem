const mongoose = require("mongoose");

const URL = process.env.MONGO_URI;

mongoose
  .connect(URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Error While Connecting Database : " + err));
