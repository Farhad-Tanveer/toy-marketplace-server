const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("toy market place is running");
});

app.listen(port, () => {
  console.log(`toy market place is running on ${port}`);
});
