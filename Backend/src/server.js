const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const docsRoutes = require("./routes/docs");
const chatRoutes = require("./routes/chat");
const analyticsRoutes = require("./routes/analytics");


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);


const port = process.env.Port || 4000;
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});
