const express = require("express");
const { connection } = require("./config/db");
const { employeeRouter } = require("./routes/employeesroute");
const PORT = process.env.PORT || 3000;
var cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
// Routes
app.use("/api", employeeRouter);
app.listen(process.env.PORT, async (req, res) => {
  try {
    await connection;
    console.log(`${process.env.PORT} submitted`);
  } catch (err) {
    console.log("err", err);
  }
});
