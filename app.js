const express = require("express");
var cors = require("cors");
require("dotenv").config();
const app = express();
const path = require("path");
const port = process.env.PORT;
const { createInvoice } = require("./common/createInvoice");

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111,
  },
  items: [
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234,
};


const { userRoute, postRoute } = require("./routes/allRoute.routes");
const connection = require("./DB/connectDB");
const userModel = require("./DB/user.model");
connection();
var corsOptions = {
  origin: "http://localhost:3000/",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(userRoute);
app.use(postRoute);
app.get("/",async(req,res)=>{
  let allUser = await userModel.find({})
  invoice.items = allUser
  createInvoice(invoice, "invoice.pdf");
  res.json("helllo")
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
