const mongoose = require("mongoose");

const LeaveSummarySchema = new mongoose.Schema(
  {
    startLeaveDate: { type: String }, // Changed from startLeaveData to startLeaveDate
    endLeaveDate: { type: String }, // Changed from endLeaveData to endLeaveDate
    leaveType: { type: String },
  },
  { _id: false }
);

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  dateOfJoining: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  totalLeavesProvided: { type: Number, required: true },
  leavesTaken: { type: Number, default: 0 },
  leavesLeft: { type: Number },
  leaveConfirmed: { type: Boolean },
  newLeaveSummary: [LeaveSummarySchema],
});

EmployeeSchema.pre("save", function (next) {
  this.leavesLeft = this.totalLeavesProvided - this.leavesTaken;
  next();
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);
module.exports = EmployeeModel;
