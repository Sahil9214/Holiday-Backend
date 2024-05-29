const express = require("express");
const employeeRouter = express.Router();
const EmployeeModel = require("../model/employeeSchema");
const bcrypt = require("bcrypt");

// Add Employee Route
employeeRouter.post("/add", async (req, res, next) => {
  const {
    name,
    role,
    email,
    password,
    totalLeavesProvided,
    leavesTaken,
    dateOfJoining,
    leaveConfirmed,
    newLeaveSummary,
  } = req.body;

  try {
    // Check if all required fields are provided
    if (!name || !role || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new employee instance with hashed password
    const newEmployee = new EmployeeModel({
      name,
      role,
      email,
      password: hashedPassword, // Save hashed password
      totalLeavesProvided,
      leavesTaken,
      dateOfJoining,
      leaveConfirmed,
      newLeaveSummary,
    });

    // Save the new employee to the database
    await newEmployee.save();
    res.status(200).send("Successfully added");
  } catch (err) {
    next(err);
  }
});

// Get All Employees Route
employeeRouter.get("/get", async (req, res) => {
  try {
    let data = await EmployeeModel.find();
    res.status(200).send(data);
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});

// User Login Route
employeeRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    // Find the user by email
    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // If credentials are valid, send success response
    res.status(200).json({ msg: "Login successful", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
employeeRouter.post("/getByEmail", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email is provided
    if (!email) {
      return res.status(400).json({ msg: "Please provide email" });
    }

    // Find the user by email
    const user = await EmployeeModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // If user is found, send the user data
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = { employeeRouter };
